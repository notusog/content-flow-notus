import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Globe, Target, Users, Brain, Lightbulb, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentArchetypeData {
  onboardingQuestionnaire: string;
  deepDiveInterview: string;
  mediaStrategy: string;
  additionalContext: string;
  websites: string[];
  language: string;
  generatedArchetype?: string;
}

interface ContentArchetypeFormProps {
  onSubmit: (data: ContentArchetypeData) => void;
  onCancel: () => void;
  clientName?: string;
}

export default function ContentArchetypeForm({ onSubmit, onCancel, clientName }: ContentArchetypeFormProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<ContentArchetypeData>({
    onboardingQuestionnaire: '',
    deepDiveInterview: '',
    mediaStrategy: '',
    additionalContext: '',
    websites: [''],
    language: 'English',
    generatedArchetype: ''
  });

  const addWebsite = () => {
    setFormData(prev => ({
      ...prev,
      websites: [...prev.websites, '']
    }));
  };

  const removeWebsite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      websites: prev.websites.filter((_, i) => i !== index)
    }));
  };

  const updateWebsite = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      websites: prev.websites.map((website, i) => i === index ? value : website)
    }));
  };

  const generateArchetype = async () => {
    if (!formData.onboardingQuestionnaire || !formData.mediaStrategy) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the questionnaire and media strategy",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('content-archetype', {
        body: {
          onboardingQuestionnaire: formData.onboardingQuestionnaire,
          deepDiveInterview: formData.deepDiveInterview,
          mediaStrategy: formData.mediaStrategy,
          additionalContext: formData.additionalContext,
          websites: formData.websites.filter(w => w.trim()),
          language: formData.language
        }
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        generatedArchetype: data.contentArchetype
      }));

      toast({
        title: "Content Archetype Generated",
        description: data.websiteResearch ? "Generated with website research included" : "Generated successfully",
      });

    } catch (error) {
      console.error('Error generating archetype:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content archetype. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Content Archetype Generator
            {clientName && <Badge variant="secondary">{clientName}</Badge>}
          </CardTitle>
          <CardDescription>
            Generate a comprehensive content strategy framework with four pillars: Tactical, Aspirational, Insightful, and Personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="input" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="input">Client Information</TabsTrigger>
                <TabsTrigger value="research">Website Research</TabsTrigger>
                <TabsTrigger value="output">Generated Archetype</TabsTrigger>
              </TabsList>

              {/* Input Tab */}
              <TabsContent value="input" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Onboarding Questionnaire
                    </CardTitle>
                    <CardDescription>
                      Client's answers to initial onboarding questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.onboardingQuestionnaire}
                      onChange={(e) => setFormData(prev => ({ ...prev, onboardingQuestionnaire: e.target.value }))}
                      placeholder="Paste the client's onboarding questionnaire responses here..."
                      rows={4}
                      required
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      Deep Dive Interview
                    </CardTitle>
                    <CardDescription>
                      Key insights from the deep dive interview session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.deepDiveInterview}
                      onChange={(e) => setFormData(prev => ({ ...prev, deepDiveInterview: e.target.value }))}
                      placeholder="Notes and insights from the deep dive interview..."
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      Media Strategy
                    </CardTitle>
                    <CardDescription>
                      Current media strategy and positioning goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.mediaStrategy}
                      onChange={(e) => setFormData(prev => ({ ...prev, mediaStrategy: e.target.value }))}
                      placeholder="Outline the media strategy, target audience, goals, and positioning..."
                      rows={4}
                      required
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                      Additional Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.additionalContext}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
                      placeholder="Any additional context, constraints, or special considerations..."
                      rows={3}
                    />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="Italian">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Research Tab */}
              <TabsContent value="research" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website Research
                    </CardTitle>
                    <CardDescription>
                      Add client and competitor websites for AI-powered research and analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.websites.map((website, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={website}
                          onChange={(e) => updateWebsite(index, e.target.value)}
                          placeholder="https://example.com"
                          type="url"
                        />
                        {formData.websites.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeWebsite(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addWebsite}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Website
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Output Tab */}
              <TabsContent value="output" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Content Archetype</CardTitle>
                    <CardDescription>
                      Your AI-generated content strategy with four pillars
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!formData.generatedArchetype ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Generate your content archetype to see the results here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {formData.generatedArchetype}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex justify-between">
              <Button 
                type="button" 
                onClick={generateArchetype}
                disabled={isGenerating || !formData.onboardingQuestionnaire || !formData.mediaStrategy}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Archetype
                  </>
                )}
              </Button>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!formData.generatedArchetype}>
                  Save Archetype
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}