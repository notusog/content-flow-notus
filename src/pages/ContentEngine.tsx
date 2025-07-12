import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search,
  Filter,
  FileText,
  Video,
  Mic,
  BookOpen,
  FileIcon,
  Linkedin,
  Youtube,
  Mail,
  Instagram,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User
} from 'lucide-react';

const platformIcons = {
  linkedin: Linkedin,
  youtube: Youtube,
  newsletter: Mail,
  instagram: Instagram
};

const sourceTypeIcons = {
  article: FileText,
  video: Video,
  recording: Mic,
  note: BookOpen,
  document: FileIcon
};

export default function ContentEngine() {
  const { user, hasPermission } = useAuth();
  const { sources, pieces, loading, addSource, addPiece, generateContentFromSources } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Filter sources based on search
  const filteredSources = sources.filter(source => {
    if (searchQuery && !source.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !source.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => source.tags.includes(tag))) return false;
    return true;
  });

  // All pieces are already filtered by RLS
  const filteredPieces = pieces;

  // Get all unique tags
  const allTags = [...new Set(sources.flatMap(source => source.tags))];

  const canCreateContent = hasPermission('content:create');
  const canEditContent = hasPermission('content:edit');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Engine</h1>
          <p className="text-muted-foreground">
            Transform your knowledge into content across all channels
          </p>
        </div>
        {canCreateContent && (
          <div className="flex gap-2">
            <Dialog open={isAddSourceOpen} onOpenChange={setIsAddSourceOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Knowledge Source</DialogTitle>
                  <DialogDescription>
                    Add articles, videos, notes, or documents to your knowledge base
                  </DialogDescription>
                </DialogHeader>
                <AddSourceForm 
                  onSubmit={(data) => {
                    addSource(data);
                    setIsAddSourceOpen(false);
                  }}
                  onCancel={() => setIsAddSourceOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>AI Content Generation</DialogTitle>
                  <DialogDescription>
                    Generate content for any platform using your knowledge sources
                  </DialogDescription>
                </DialogHeader>
                <GenerateContentForm 
                  sources={filteredSources}
                  onGenerate={(sourceIds, platform, prompt) => {
                    generateContentFromSources(sourceIds, platform, prompt);
                    setIsGenerateOpen(false);
                  }}
                  onCancel={() => setIsGenerateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="knowledge" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="generated">Generated Content</TabsTrigger>
          <TabsTrigger value="workflow">Content Workflow</TabsTrigger>
        </TabsList>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select onValueChange={(tag) => setSelectedTags([tag])}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">
              {filteredSources.length} sources
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map((source) => {
              const TypeIcon = sourceTypeIcons[source.type];
              return (
                <Card key={source.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {source.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{source.dateAdded}</span>
                    </div>
                    <CardTitle className="text-sm font-medium leading-tight">
                      {source.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {source.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {source.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {source.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{source.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{source.source}</span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {canEditContent && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Generated Content Tab */}
        <TabsContent value="generated" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Content</h3>
            <Badge variant="outline">
              {filteredPieces.length} pieces
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPieces.map((piece) => {
              const PlatformIcon = platformIcons[piece.platform as keyof typeof platformIcons];
              return (
                <Card key={piece.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {PlatformIcon && <PlatformIcon className="h-4 w-4 text-muted-foreground" />}
                        <Badge variant="outline" className="text-xs">
                          {piece.platform}
                        </Badge>
                      </div>
                      <Badge className={`text-xs ${piece.status === 'published' ? 'bg-green-100 text-green-800' : 
                        piece.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        piece.status === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {piece.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-medium leading-tight">
                      {piece.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-3">
                      {piece.content.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {piece.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{piece.createdDate}</span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {canEditContent && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['draft', 'review', 'approved', 'published'].map((status) => {
              const statusPieces = filteredPieces.filter(piece => piece.status === status);
              return (
                <Card key={status}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm capitalize flex items-center justify-between">
                      {status}
                      <Badge variant="secondary" className="text-xs">
                        {statusPieces.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {statusPieces.map((piece) => (
                      <div key={piece.id} className="p-2 border rounded-lg text-xs">
                        <div className="font-medium truncate">{piece.title}</div>
                        <div className="text-muted-foreground">{piece.platform}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Add Source Form Component
interface AddSourceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

function AddSourceForm({ onSubmit, onCancel }: AddSourceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'article' as const,
    content: '',
    summary: '',
    tags: '',
    source: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      insights: [],
      relatedTopics: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter source title..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="recording">Recording</SelectItem>
            <SelectItem value="document">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Source</label>
        <Input
          value={formData.source}
          onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
          placeholder="e.g., Harvard Business Review, Internal Meeting..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Summary</label>
        <Textarea
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          placeholder="Brief summary of the content..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Full content or key excerpts..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="AI, sales, strategy (comma-separated)"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
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

// Generate Content Form Component
interface GenerateContentFormProps {
  sources: any[];
  onGenerate: (sourceIds: string[], platform: string, prompt?: string) => void;
  onCancel: () => void;
}

function GenerateContentForm({ sources, onGenerate, onCancel }: GenerateContentFormProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [platform, setPlatform] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSources.length > 0 && platform) {
      onGenerate(selectedSources, platform, prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Sources</label>
        <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-3">
          {sources.map((source) => (
            <label key={source.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedSources.includes(source.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSources(prev => [...prev, source.id]);
                  } else {
                    setSelectedSources(prev => prev.filter(id => id !== source.id));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">{source.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Platform</label>
        <Select onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Custom Prompt (Optional)</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Any specific instructions for content generation..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={selectedSources.length === 0 || !platform}>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Content
        </Button>
      </div>
    </form>
  );
}