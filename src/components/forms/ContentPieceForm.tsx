import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Eye, 
  Key, 
  List, 
  Target, 
  Lightbulb, 
  Book, 
  Mic,
  Link,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface ContentPieceFormData {
  title: string;
  assetToReview: string;
  visualOptions: string[];
  keyTakeaways: string;
  coreStructure: string;
  hook: string;
  ctaTldr: string;
  notes: string;
  inspiration: string;
  transcript: string;
  tags: string[];
}

interface ContentPieceFormProps {
  onSubmit: (data: ContentPieceFormData) => void;
  onCancel: () => void;
}

export default function ContentPieceForm({ onSubmit, onCancel }: ContentPieceFormProps) {
  const [formData, setFormData] = useState<ContentPieceFormData>({
    title: '',
    assetToReview: '',
    visualOptions: [],
    keyTakeaways: '',
    coreStructure: '',
    hook: '',
    ctaTldr: '',
    notes: '',
    inspiration: '',
    transcript: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addVisualOption = () => {
    setFormData(prev => ({
      ...prev,
      visualOptions: [...prev.visualOptions, '']
    }));
  };

  const updateVisualOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      visualOptions: prev.visualOptions.map((option, i) => i === index ? value : option)
    }));
  };

  const removeVisualOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      visualOptions: prev.visualOptions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Piece - Notion Style Template
          </CardTitle>
          <CardDescription>
            Create a comprehensive content piece following your proven Notion template structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Content Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Lulu Cheng Meservey"
                required
              />
            </div>

            <Tabs defaultValue="assets" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="assets">Assets & Visual</TabsTrigger>
                <TabsTrigger value="outline">Content Outline</TabsTrigger>
                <TabsTrigger value="research">Research & Notes</TabsTrigger>
                <TabsTrigger value="inspiration">Inspiration & Sources</TabsTrigger>
              </TabsList>

              {/* Assets & Visual Tab */}
              <TabsContent value="assets" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Asset to Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={formData.assetToReview}
                      onChange={(e) => setFormData(prev => ({ ...prev, assetToReview: e.target.value }))}
                      placeholder="https://docs.google.com/document/d/..."
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      Visual Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.visualOptions.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateVisualOption(index, e.target.value)}
                          placeholder="Image URL or description"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeVisualOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addVisualOption}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Visual Option
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Outline Tab */}
              <TabsContent value="outline" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      Key Takeaways
                    </CardTitle>
                    <CardDescription>
                      What should the reader think when they finish this post?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.keyTakeaways}
                      onChange={(e) => setFormData(prev => ({ ...prev, keyTakeaways: e.target.value }))}
                      placeholder="• Main insight or lesson learned..."
                      rows={3}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <List className="h-4 w-4 text-muted-foreground" />
                      Core Structure
                    </CardTitle>
                    <CardDescription>
                      How should the post be structured? Write down main points, storyline & linear flow.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.coreStructure}
                      onChange={(e) => setFormData(prev => ({ ...prev, coreStructure: e.target.value }))}
                      placeholder="• Opening statement or problem
• Key point 1
• Key point 2
• Conclusion and insight"
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      Hook
                    </CardTitle>
                    <CardDescription>
                      How do we catch attention with the first 1-2 sentences?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.hook}
                      onChange={(e) => setFormData(prev => ({ ...prev, hook: e.target.value }))}
                      placeholder="Compelling opening that grabs attention..."
                      rows={2}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      CTA / TL;DR
                    </CardTitle>
                    <CardDescription>
                      Do we want the reader to take a direct action? If not, how do we round off the post?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.ctaTldr}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaTldr: e.target.value }))}
                      placeholder="Call to action or summary statement..."
                      rows={2}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Research & Notes Tab */}
              <TabsContent value="research" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Notes
                    </CardTitle>
                    <CardDescription>
                      Paste your Content Call notes here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="I want to do a post about her. Seems like she's #1 pr/communication expert in silicon valley..."
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      Transcript
                    </CardTitle>
                    <CardDescription>
                      Paste your Riverside Transcript here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.transcript}
                      onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                      placeholder="We have here Lulu Cheng who you sent me message about saying that she's like the PR expert in Silicon Valley..."
                      rows={8}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inspiration & Sources Tab */}
              <TabsContent value="inspiration" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                      Inspiration
                    </CardTitle>
                    <CardDescription>
                      Add anything that gave inspiration to this piece
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.inspiration}
                      onChange={(e) => setFormData(prev => ({ ...prev, inspiration: e.target.value }))}
                      placeholder="https://x.com/lulumeservey"
                      rows={3}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Create Content Piece
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}