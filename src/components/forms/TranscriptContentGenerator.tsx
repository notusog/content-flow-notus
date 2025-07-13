import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mic, FileText, Sparkles, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentGenerationData {
  transcript: string;
  context?: string;
}

interface TranscriptContentGeneratorProps {
  onSubmit: (data: { content: string; metadata: any }) => void;
  onCancel: () => void;
  brandName?: string;
  contentArchetype?: string;
}

export default function TranscriptContentGenerator({ 
  onSubmit, 
  onCancel, 
  brandName, 
  contentArchetype 
}: TranscriptContentGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<ContentGenerationData>({
    transcript: '',
    context: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');

  const generateContent = async () => {
    if (!formData.transcript) {
      toast({
        title: "Missing Transcript",
        description: "Please provide a transcript to generate LinkedIn content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('claude-copywriter', {
        body: {
          prompt: formData.context || '',
          tone: 'professional',
          type: 'linkedin_post',
          transcript: formData.transcript,
          useStructuredPrompt: true,
          clientName: brandName || 'the client'
        }
      });

      if (error) throw error;

      const generatedText = data?.copy || data?.content || '';
      setGeneratedContent(generatedText);

      toast({
        title: "LinkedIn Post Generated",
        description: "Successfully generated LinkedIn content from transcript",
      });

    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!generatedContent) {
      toast({
        title: "No Content Generated",
        description: "Please generate content first",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      content: generatedContent,
      metadata: {
        platform: 'LinkedIn',
        contentType: 'post',
        tone: 'professional',
        hasTranscript: true,
        context: formData.context
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            LinkedIn Post Generator
            {brandName && <Badge variant="secondary">{brandName}</Badge>}
          </CardTitle>
          <CardDescription>
            Generate LinkedIn posts from transcripts with optional context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  Transcript (Required)
                </CardTitle>
                <CardDescription>
                  Paste transcript from calls, podcasts, or videos to generate LinkedIn content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.transcript}
                  onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                  placeholder="Paste your transcript here..."
                  rows={8}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Additional Context (Optional)
                </CardTitle>
                <CardDescription>
                  Add any specific angle, key points, or direction for the LinkedIn post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.context || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="e.g., Focus on the leadership insights, highlight the data points, emphasize the practical tips..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {contentArchetype && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Brand Archetype Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-xs">
                    LinkedIn post will be generated using your brand voice and strategy
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* Generation Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Generated Content</h3>
              <Button 
                onClick={generateContent}
                disabled={isGenerating || !formData.transcript}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>

            {generatedContent ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {generatedContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Generated content will appear here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!generatedContent}>
              Save Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}