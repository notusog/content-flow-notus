import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useContent } from '@/contexts/ContentContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Lightbulb, 
  FileText, 
  Mic, 
  Upload, 
  Sparkles,
  ChevronRight,
  Play
} from 'lucide-react';

interface ContentGenerationFormProps {
  onClose: () => void;
}

export default function ContentGenerationForm({ onClose }: ContentGenerationFormProps) {
  const { sources, generateContentIdea, generateContentFromSources } = useContent();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('idea');
  const [formData, setFormData] = useState({
    prompt: '',
    platform: '',
    selectedSources: [] as string[],
    transcript: '',
    transcriptFile: null as File | null
  });
  
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsTranscribing(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64 = btoa(String.fromCharCode(...uint8Array));

        try {
          const { data, error } = await supabase.functions.invoke('transcribe-audio', {
            body: { 
              audio: base64,
              filename: file.name
            }
          });

          if (error) throw error;

          if (data?.text) {
            setFormData(prev => ({ ...prev, transcript: data.text }));
            toast({
              title: "Transcription Complete",
              description: "Audio transcribed successfully"
            });
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast({
            title: "Transcription Failed",
            description: "Could not transcribe audio. You can add transcript manually.",
            variant: "destructive"
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('File reading error:', error);
      toast({
        title: "File Error",
        description: "Could not read the audio file.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateIdea = async () => {
    if (!formData.prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a content idea or prompt",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generateContentIdea(
        formData.prompt,
        formData.selectedSources.length > 0 ? formData.selectedSources : undefined,
        formData.transcript || undefined
      );
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!formData.prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a content prompt",
        variant: "destructive"
      });
      return;
    }

    if (!formData.platform) {
      toast({
        title: "Missing Platform",
        description: "Please select a platform",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generateContentFromSources(
        formData.selectedSources,
        formData.platform,
        formData.prompt,
        formData.transcript || undefined
      );
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSourceSelection = (sourceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSources: prev.selectedSources.includes(sourceId)
        ? prev.selectedSources.filter(id => id !== sourceId)
        : [...prev.selectedSources, sourceId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">AI Content Generation</h2>
        <p className="text-muted-foreground">
          Create content ideas or generate platform-specific content using your knowledge sources
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="idea" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Generate Idea
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="idea" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Content Idea Generation
              </CardTitle>
              <CardDescription>
                Start with a content idea that can be developed into drafts later
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idea-prompt">Content Idea or Topic</Label>
                <Textarea
                  id="idea-prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe your content idea, topic, or what you want to create content about..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerateIdea} 
                  disabled={isGenerating || !formData.prompt.trim()}
                  className="flex-1"
                >
                  {isGenerating ? 'Creating...' : 'Create Content Idea'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('content')}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="h-4 w-4" />
                  Skip to Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Platform Content Generation
              </CardTitle>
              <CardDescription>
                Generate ready-to-use content for specific platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content-prompt">Content Prompt</Label>
                  <Textarea
                    id="content-prompt"
                    value={formData.prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="What specific content do you want to create?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select 
                    value={formData.platform} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateContent} 
                disabled={isGenerating || !formData.prompt.trim() || !formData.platform}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Content Draft'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transcript Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Transcript Input (Optional)
          </CardTitle>
          <CardDescription>
            Add a transcript from audio/video to enhance content generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload">Upload Audio</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-3">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <Label htmlFor="transcript-file" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose Audio File</span>
                  </Button>
                </Label>
                <Input
                  id="transcript-file"
                  type="file"
                  accept=".m4a,.mp3,.wav,.mp4,.mov,.avi"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, transcriptFile: file }));
                      handleFileUpload(file);
                    }
                  }}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Supports: MP3, WAV, M4A, MP4, MOV, AVI
                </p>
              </div>
              {isTranscribing && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Transcribing audio...
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="manual">
              <Textarea
                value={formData.transcript}
                onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                placeholder="Paste or type your transcript here..."
                rows={4}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Source Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Sources (Optional)</CardTitle>
          <CardDescription>
            Select sources to reference in your content generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No knowledge sources available</p>
              <p className="text-sm">Add sources in the Content Engine first</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sources.map((source) => (
                <div key={source.id} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded">
                  <Checkbox
                    id={source.id}
                    checked={formData.selectedSources.includes(source.id)}
                    onCheckedChange={() => toggleSourceSelection(source.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={source.id} className="text-sm font-medium cursor-pointer">
                      {source.title}
                    </Label>
                    <p className="text-xs text-muted-foreground truncate">
                      {source.summary}
                    </p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {source.type}
                      </Badge>
                      {source.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {formData.selectedSources.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                {formData.selectedSources.length} source{formData.selectedSources.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex flex-wrap gap-1">
                {formData.selectedSources.map(sourceId => {
                  const source = sources.find(s => s.id === sourceId);
                  return source ? (
                    <Badge key={sourceId} variant="secondary" className="text-xs">
                      {source.title}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}