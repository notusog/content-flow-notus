import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { usePersonalBrand } from '@/contexts/PersonalBrandContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Brain,
  Search,
  Tag,
  Plus,
  FileText,
  Link,
  Video,
  Mic,
  Image,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  Filter,
  Download,
  Upload
} from 'lucide-react';

import type { Tables } from '@/integrations/supabase/types';

type ContentSource = Tables<'content_sources'>;
type ContentPiece = Tables<'content_pieces'>;

// Using real Supabase data now

export default function ContentLibrary() {
  const { user } = useUser();
  const { currentPersonalBrand } = usePersonalBrand();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [generatedContent, setGeneratedContent] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from Supabase
  useEffect(() => {
    if (currentPersonalBrand) {
      fetchSources();
      fetchContentPieces();
    }
  }, [currentPersonalBrand]);

  const fetchSources = async () => {
    if (!user || !currentPersonalBrand) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_sources')
        .select('*')
        .eq('personal_brand_id', currentPersonalBrand.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSources(data || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
      toast({
        title: "Error",
        description: "Failed to load content sources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContentPieces = async () => {
    if (!user || !currentPersonalBrand) return;

    try {
      const { data, error } = await supabase
        .from('content_pieces')
        .select('*')
        .eq('personal_brand_id', currentPersonalBrand.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGeneratedContent(data || []);
    } catch (error) {
      console.error('Error fetching content pieces:', error);
    }
  };

  // Filter sources by personal brand
  const userSources = sources;

  // Get all unique tags
  const allTags = Array.from(new Set(userSources.flatMap(source => source.tags || [])));

  // Filter sources based on search and tags
  const filteredSources = userSources.filter(source => {
    const matchesSearch = searchQuery === '' || 
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (source.tags && source.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesTags = selectedTags.length === 0 || 
      (source.tags && selectedTags.some(tag => source.tags.includes(tag)));
    
    return matchesSearch && matchesTags;
  });

  const addSource = async (sourceData: Partial<ContentSource>) => {
    if (!user || !currentPersonalBrand) return;

    try {
      const { data, error } = await supabase
        .from('content_sources')
        .insert({
          title: sourceData.title || '',
          type: sourceData.type || 'article',
          content: sourceData.content || '',
          summary: sourceData.summary || '',
          tags: sourceData.tags || [],
          source: sourceData.source || '',
          user_id: user.id,
          personal_brand_id: currentPersonalBrand.id,
          workspace_id: currentPersonalBrand.workspace_id,
        })
        .select()
        .single();

      if (error) throw error;

      setSources(prev => [data, ...prev]);
      setIsAddingSource(false);
      toast({
        title: "Source Added",
        description: "New content source has been added to your library",
      });
    } catch (error) {
      console.error('Error adding source:', error);
      toast({
        title: "Error",
        description: "Failed to add content source",
        variant: "destructive",
      });
    }
  };

  const generateContentFromSources = async (sourceIds: string[], platform: string) => {
    if (!user || !currentPersonalBrand) return;

    try {
      const selectedSources = sources.filter(s => sourceIds.includes(s.id));
      const combinedTags = Array.from(new Set(selectedSources.flatMap(s => s.tags || [])));
      
      const { data, error } = await supabase
        .from('content_pieces')
        .insert({
          title: `Generated Content from ${selectedSources.length} Sources`,
          content: `AI-generated content based on: ${selectedSources.map(s => s.title).join(', ')}...`,
          platform,
          source_ids: sourceIds,
          tags: combinedTags,
          status: 'draft',
          user_id: user.id,
          personal_brand_id: currentPersonalBrand.id,
          workspace_id: currentPersonalBrand.workspace_id,
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedContent(prev => [data, ...prev]);
      toast({
        title: "Content Generated",
        description: `New ${platform} content created from selected sources`,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive",
      });
    }
  };

  const typeIcons = {
    article: FileText,
    video: Video,
    audio: Mic,
    image: Image,
    document: FileText,
    url: Link
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!currentPersonalBrand) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No Personal Brand Selected</h3>
          <p className="text-muted-foreground">Please select a personal brand from the header to view content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Brain className="h-8 w-8 text-primary" />
            <span>Content Library</span>
          </h1>
          <p className="text-muted-foreground">
            Your second brain for {currentPersonalBrand.name} content creation and knowledge management
          </p>
        </div>
        <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Content Source</DialogTitle>
              <DialogDescription>
                Add articles, videos, podcasts, or other content to your knowledge base
              </DialogDescription>
            </DialogHeader>
            <AddSourceForm onSubmit={addSource} onCancel={() => setIsAddingSource(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search sources, topics, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {allTags.slice(0, 6).map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">Knowledge Base ({filteredSources.length})</TabsTrigger>
          <TabsTrigger value="generated">Generated Content ({generatedContent.length})</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSources.map((source) => {
              const TypeIcon = typeIcons[source.type];
              return (
                <Card key={source.id} className="hover:shadow-md smooth-transition">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="capitalize text-xs">
                          {source.type}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{source.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {source.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {(source.tags || []).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {source.insights && source.insights.length > 0 && (
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Key Insights:</Label>
                        {source.insights.slice(0, 2).map((insight, index) => (
                          <p key={index} className="text-xs text-muted-foreground">• {insight}</p>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(source.created_at).toLocaleDateString()}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateContentFromSources([source.id], 'LinkedIn')}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="space-y-4">
          <div className="space-y-4">
            {generatedContent.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        For {content.platform} • Created {new Date(content.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                      {content.status}
                    </Badge>
                  </div>
                </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{content.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {(content.tags || []).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        Based on {(content.source_ids || []).length} source(s)
                      </span>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Trends and patterns discovered from your content library
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Trending Topics</h4>
                  <div className="space-y-1">
                    {['AI & Automation', 'B2B Marketing', 'SaaS Growth'].map((topic, index) => (
                      <div key={index} className="text-sm text-muted-foreground">• {topic}</div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Content Gaps</h4>
                  <div className="space-y-1">
                    {['Customer Success Stories', 'Technical Deep Dives', 'Industry Predictions'].map((gap, index) => (
                      <div key={index} className="text-sm text-muted-foreground">• {gap}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Add Source Form Component
function AddSourceForm({ onSubmit, onCancel }: { onSubmit: (data: Partial<ContentSource>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'article' as ContentSource['type'],
    content: '',
    summary: '',
    tags: '',
    source: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value: ContentSource['type']) => 
            setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio/Podcast</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="url">URL/Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          value={formData.source}
          onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
          placeholder="e.g., Harvard Business Review, Industry Podcast"
        />
      </div>

      {/* File Upload Section */}
      <div>
        <Label htmlFor="fileUpload">Upload File (Optional)</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <input
            id="fileUpload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.mp3,.mp4,.wav,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData(prev => ({ 
                  ...prev, 
                  source: file.name,
                  content: `Uploaded file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
                }));
              }
            }}
          />
          <label htmlFor="fileUpload" className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, TXT, MP3, MP4, WAV, JPG, PNG files
            </p>
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          placeholder="Brief summary of the content"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="content">Content/Notes</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Main content, key points, or notes"
          rows={5}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="marketing, b2b, strategy, ai"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Source
        </Button>
      </div>
    </form>
  );
}