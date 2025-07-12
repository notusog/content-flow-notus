import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ContentGenerationForm from '@/components/forms/ContentGenerationForm';
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
  User,
  ChevronRight,
  ArrowUp
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
  const { user } = useAuth();
  const { sources, pieces, loading, addSource, addPiece, generateContentFromSources, promoteToNextStage } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [editingPiece, setEditingPiece] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const canCreateContent = true; // All authenticated users can create content
  const canEditContent = true;   // All authenticated users can edit content

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

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
                <ContentGenerationForm 
                  onClose={() => setIsGenerateOpen(false)}
                />
              </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflow">Content Workflow</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="generated">All Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Content Workflow Tab - MOVED TO FIRST */}
        <TabsContent value="workflow" className="space-y-4">
          <div className="text-center mb-6">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Content Production Pipeline</h3>
            <p className="text-muted-foreground">Track your content from idea to publication</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { status: 'idea', label: 'Ideas', icon: '💡', color: 'bg-yellow-50 border-yellow-200' },
              { status: 'draft', label: 'Drafts', icon: '📝', color: 'bg-blue-50 border-blue-200' },
              { status: 'review', label: 'In Review', icon: '👁️', color: 'bg-orange-50 border-orange-200' },
              { status: 'approved', label: 'Approved', icon: '✅', color: 'bg-green-50 border-green-200' }
            ].map(({ status, label, icon, color }) => {
              const statusPieces = filteredPieces.filter(piece => piece.status === status);
              return (
                <Card key={status} className={color}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        {label}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {statusPieces.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {statusPieces.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-xs">No {label.toLowerCase()}</p>
                      </div>
                    ) : (
                      statusPieces.map((piece) => (
                        <div key={piece.id} className="p-3 border rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium text-sm truncate pr-2">{piece.title}</div>
                            {status !== 'approved' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={() => promoteToNextStage(piece.id, piece.status)}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {piece.platform !== 'general' && (
                              <Badge variant="outline" className="mr-1 text-xs">
                                {piece.platform}
                              </Badge>
                            )}
                            {piece.createdDate}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setEditingPiece(piece);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                            {status === 'idea' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs px-2"
                                onClick={() => promoteToNextStage(piece.id, 'idea')}
                              >
                                Develop
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="border-dashed border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary/60" />
                <h4 className="font-medium mb-2">Ready to create?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start with an idea or jump straight to content creation
                </p>
                <div className="flex gap-2 justify-center">
                  <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Content
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
            <Select onValueChange={(tag) => setSelectedTags(tag === "all" ? [] : [tag])}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
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

        {/* All Content Tab */}
        <TabsContent value="generated" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Content</h3>
            <div className="flex items-center gap-4">
              <Select onValueChange={(status) => {
                // Filter by status
                console.log('Filter by status:', status);
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="idea">Ideas</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline">
                {filteredPieces.length} pieces
              </Badge>
            </div>
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingPiece(piece);
                                setIsEditDialogOpen(true);
                              }}
                            >
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance Overview</CardTitle>
              <CardDescription>Track how your content is performing across different stages and platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {pieces.filter(p => p.status === 'idea').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Ideas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {pieces.filter(p => p.status === 'draft').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Drafts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {pieces.filter(p => p.status === 'review').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Review</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {pieces.filter(p => p.status === 'approved').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Platform Distribution</h4>
                <div className="space-y-2">
                  {['linkedin', 'youtube', 'newsletter', 'instagram', 'blog'].map(platform => {
                    const count = pieces.filter(p => p.platform === platform).length;
                    const percentage = pieces.length > 0 ? (count / pieces.length) * 100 : 0;
                    return (
                      <div key={platform} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{platform}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Edit your generated content before publishing
            </DialogDescription>
          </DialogHeader>
          {editingPiece && (
            <EditContentForm 
              piece={editingPiece}
              onSave={(updatedPiece) => {
                // Update the piece in the context/database
                console.log('Saving updated piece:', updatedPiece);
                setIsEditDialogOpen(false);
                setEditingPiece(null);
              }}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingPiece(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add Source Form Component
interface AddSourceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

function AddSourceForm({ onSubmit, onCancel }: AddSourceFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    type: 'article' as const,
    content: '',
    summary: '',
    tags: '',
    source: '',
    file: null as File | null
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      
      // Auto-fill title from filename if empty
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: file.name.split('.')[0] }));
      }
      
      // Check if it's an audio/video file for transcription
      const audioVideoExtensions = ['m4a', 'mp3', 'wav', 'mp4', 'mov', 'avi'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension && audioVideoExtensions.includes(fileExtension)) {
        try {
          toast({
            title: "Transcribing audio...",
            description: "Please wait while we transcribe your audio file.",
          });

          // Convert file to base64
          const reader = new FileReader();
          reader.onload = async (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            const base64 = btoa(String.fromCharCode(...uint8Array));

            try {
              // Call transcription edge function
              const { data, error } = await supabase.functions.invoke('transcribe-audio', {
                body: { 
                  audio: base64,
                  filename: file.name
                }
              });

              if (error) throw error;

              if (data?.text) {
                setFormData(prev => ({ ...prev, content: data.text }));
                toast({
                  title: "Transcription complete!",
                  description: "Audio has been transcribed successfully.",
                });
              }
            } catch (error) {
              console.error('Transcription error:', error);
              toast({
                title: "Transcription failed",
                description: "Could not transcribe audio. You can add content manually.",
                variant: "destructive",
              });
            }
          };
          reader.readAsArrayBuffer(file);
        } catch (error) {
          console.error('File reading error:', error);
          toast({
            title: "File error",
            description: "Could not read the audio file.",
            variant: "destructive",
          });
        }
      } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        // Handle text files as before
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setFormData(prev => ({ ...prev, content }));
        };
        reader.readAsText(file);
      }
    }
  };

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
        <label className="text-sm font-medium">Upload File (Optional)</label>
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".txt,.md,.pdf,.doc,.docx,.csv,.m4a,.mp3,.wav,.mp4,.mov,.avi"
          className="file:mr-2 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
        />
        {formData.file && (
          <p className="text-xs text-muted-foreground">
            Selected: {formData.file.name}
          </p>
        )}
      </div>

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

// Edit Content Form Component
interface EditContentFormProps {
  piece: any;
  onSave: (piece: any) => void;
  onCancel: () => void;
}

function EditContentForm({ piece, onSave, onCancel }: EditContentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: piece.title || '',
    content: piece.content || '',
    platform: piece.platform || '',
    status: piece.status || 'draft',
    tags: piece.tags ? piece.tags.join(', ') : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPiece = {
      ...piece,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      updatedDate: new Date().toISOString()
    };

    onSave(updatedPiece);
    
    toast({
      title: "Content Updated",
      description: "Your content has been saved successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Content title..."
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform</label>
          <Select 
            value={formData.platform} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Your content..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="tag1, tag2, tag3..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}