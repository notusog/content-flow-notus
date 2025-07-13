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
  prompt: string;
  transcript: string;
  platform: string;
  contentType: string;
  tone: string;
  length: string;
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
    prompt: '',
    transcript: '',
    platform: 'LinkedIn',
    contentType: 'post',
    tone: 'professional',
    length: 'medium'
  });
  const [generatedContent, setGeneratedContent] = useState('');

  const generateContent = async () => {
    if (!formData.prompt && !formData.transcript) {
      toast({
        title: "Missing Information",
        description: "Please provide either a prompt or transcript",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const contentPrompt = `You are a content creator for ${brandName || 'the brand'}. Generate ${formData.contentType} content for ${formData.platform}.

${contentArchetype ? `Brand Content Archetype:\n${contentArchetype}\n\n` : ''}

Content Requirements:
- Platform: ${formData.platform}
- Type: ${formData.contentType}
- Tone: ${formData.tone}
- Length: ${formData.length}

${formData.prompt ? `Content Brief:\n${formData.prompt}\n\n` : ''}

${formData.transcript ? `Source Transcript:\n${formData.transcript}\n\n` : ''}

Generate engaging ${formData.platform} content that:
1. Matches the brand voice and archetype
2. Provides value to the target audience
3. Is optimized for ${formData.platform} engagement
4. Follows ${formData.platform} best practices

${formData.transcript ? 'Extract the most compelling insights from the transcript and turn them into engaging content.' : ''}`;

      const { data, error } = await supabase.functions.invoke('claude-copywriter', {
        body: {
          prompt: contentPrompt,
          tone: formData.tone,
          type: 'linkedin_post', // Match the expected parameter
          transcript: formData.transcript,
          useStructuredPrompt: true, // Use the sophisticated LinkedIn prompt
          clientName: brandName || 'the client'
        }
      });

      if (error) throw error;

      // The function returns 'copy' not 'content'
      const generatedText = data?.copy || data?.content || '';
      setGeneratedContent(generatedText);

      toast({
        title: "Content Generated",
        description: `Generated ${formData.contentType} for ${formData.platform}`,
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
        platform: formData.platform,
        contentType: formData.contentType,
        tone: formData.tone,
        length: formData.length,
        hasTranscript: !!formData.transcript,
        prompt: formData.prompt
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Content Generator
            {brandName && <Badge variant="secondary">{brandName}</Badge>}
          </CardTitle>
          <CardDescription>
            Generate content using prompts and transcripts with your brand archetype
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Content Brief
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Describe the content you want to create..."
                    rows={4}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                    Transcript Source
                  </CardTitle>
                  <CardDescription>
                    Paste transcript from calls, podcasts, or videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.transcript}
                    onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                    placeholder="Paste your transcript here..."
                    rows={6}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Content Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform</label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content Type</label>
                      <Select value={formData.contentType} onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post">Social Post</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="script">Video Script</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tone</label>
                      <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="inspiring">Inspiring</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Length</label>
                      <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {contentArchetype && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Content Archetype Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">
                      Brand strategy will guide content generation
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          {/* Generation Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Generated Content</h3>
              <Button 
                onClick={generateContent}
                disabled={isGenerating || (!formData.prompt && !formData.transcript)}
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