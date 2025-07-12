import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Clock, 
  Edit, 
  Trash2,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type ContentPiece = Tables<'content_pieces'>;

interface ContentPiecesProps {
  platform: string;
  icon: React.ComponentType<any>;
}

export function ContentPieces({ platform, icon: Icon }: ContentPiecesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contentPieces, setContentPieces] = useState<ContentPiece[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: platform.toLowerCase(),
    status: 'draft' as const,
    tags: ''
  });

  useEffect(() => {
    fetchContentPieces();
  }, [platform, user]);

  const fetchContentPieces = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('content_pieces')
        .select('*')
        .eq('platform', platform.toLowerCase())
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentPieces(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content pieces.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = async () => {
    if (!formData.title || !formData.content || !user) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('content_pieces')
        .insert({
          title: formData.title,
          content: formData.content,
          platform: formData.platform,
          status: formData.status,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setContentPieces(prev => [data, ...prev]);
      setFormData({ title: '', content: '', platform: platform.toLowerCase(), status: 'draft', tags: '' });
      setIsCreateOpen(false);

      toast({
        title: "Content Created",
        description: "Your content piece has been created successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content piece.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'review': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'draft': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const filteredContent = contentPieces.filter(piece => {
    if (filter === 'all') return true;
    return piece.status === filter;
  });

  const stats = {
    total: contentPieces.length,
    published: contentPieces.filter(p => p.status === 'published').length,
    scheduled: contentPieces.filter(p => p.status === 'scheduled').length,
    drafts: contentPieces.filter(p => p.status === 'draft').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{platform} Content</h2>
            <p className="text-muted-foreground">Manage your {platform.toLowerCase()} content pieces</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create {platform} Content</DialogTitle>
              <DialogDescription>
                Create new content for your {platform.toLowerCase()} channel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter content title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your content here..."
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Enter tags separated by commas..."
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContent}>
                  Create Content
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Content</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No content yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first {platform.toLowerCase()} content piece to get started.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((piece) => (
            <Card key={piece.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{piece.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(piece.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(piece.status)}>
                      {piece.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {piece.content}
                </p>
                
                {piece.tags && piece.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {piece.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {piece.status === 'published' && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground border-t pt-4">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Coming soon
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Coming soon
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Coming soon
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}