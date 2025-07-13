import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [transcript, setTranscript] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Missing Transcript",
        description: "Please provide a transcript",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('claude-copywriter', {
        body: {
          prompt: '',
          tone: 'professional',
          type: 'linkedin_post',
          transcript: transcript,
          useStructuredPrompt: true,
          clientName: brandName || 'the client'
        }
      });

      if (error) throw error;

      const generatedText = data?.copy || data?.content || '';
      setGeneratedContent(generatedText);

      toast({
        title: "LinkedIn Post Generated",
        description: "Successfully generated content from transcript",
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
    if (!generatedContent) return;
    
    onSubmit({
      content: generatedContent,
      metadata: {
        platform: 'LinkedIn',
        contentType: 'post',
        hasTranscript: true
      }
    });
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Generate LinkedIn Post</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Transcript
          </label>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your transcript here..."
            rows={8}
            className="min-h-[200px]"
          />
        </div>

        <Button 
          onClick={generateContent}
          disabled={isGenerating || !transcript.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate LinkedIn Post'
          )}
        </Button>

        {generatedContent && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Generated Content</label>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!generatedContent}>
            Save Content
          </Button>
        </div>
      </div>
    </div>
  );
}