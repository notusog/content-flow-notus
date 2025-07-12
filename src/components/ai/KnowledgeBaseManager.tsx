import React, { useState, useEffect } from 'react';
import { Plus, Database, FileText, User, Trash2, Edit, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'content_source' | 'workspace_context' | 'personal_brand';
  summary?: string;
  insights?: string[];
  tags?: string[];
  created_at: string;
}

export function KnowledgeBaseManager() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    loadKnowledgeBase();
  }, [currentWorkspace]);

  const loadKnowledgeBase = async () => {
    if (!currentWorkspace) return;

    try {
      // Load content sources
      const { data: contentSources } = await supabase
        .from('content_sources')
        .select('id, title, content, summary, insights, tags, created_at')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      // Load workspace context
      const { data: workspaceContext } = await supabase
        .from('workspace_context')
        .select('id, title, content, tags, created_at')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      // Load personal brands
      const { data: personalBrands } = await supabase
        .from('personal_brands')
        .select('id, name, description, expertise_areas, created_at')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      const allItems: KnowledgeItem[] = [
        ...(contentSources || []).map(item => ({ ...item, type: 'content_source' as const })),
        ...(workspaceContext || []).map(item => ({ ...item, type: 'workspace_context' as const })),
        ...(personalBrands || []).map(item => ({ 
          id: item.id,
          title: item.name || '',
          content: item.description || '',
          type: 'personal_brand' as const,
          tags: item.expertise_areas || [],
          created_at: item.created_at
        }))
      ];

      setKnowledgeItems(allItems);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      toast({
        title: "Error",
        description: "Failed to load knowledge base",
        variant: "destructive",
      });
    }
  };

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content_source': return FileText;
      case 'workspace_context': return Database;
      case 'personal_brand': return User;
      default: return Database;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'content_source': return 'Content Source';
      case 'workspace_context': return 'Workspace Context';
      case 'personal_brand': return 'Personal Brand';
      default: return 'Unknown';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'content_source': return 'bg-blue-100 text-blue-800';
      case 'workspace_context': return 'bg-green-100 text-green-800';
      case 'personal_brand': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteItem = async (item: KnowledgeItem) => {
    try {
      if (item.type === 'content_source') {
        const { error } = await supabase
          .from('content_sources')
          .delete()
          .eq('id', item.id);
        if (error) throw error;
      } else if (item.type === 'workspace_context') {
        const { error } = await supabase
          .from('workspace_context')
          .delete()
          .eq('id', item.id);
        if (error) throw error;
      } else if (item.type === 'personal_brand') {
        const { error } = await supabase
          .from('personal_brands')
          .delete()
          .eq('id', item.id);
        if (error) throw error;
      }

      setKnowledgeItems(prev => prev.filter(i => i.id !== item.id));
      toast({
        title: "Item Deleted",
        description: `${item.title} has been removed from the knowledge base`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete knowledge base item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Manage the information your AI agents use to provide contextual responses
          </p>
        </div>
        <Button onClick={() => setIsAddingItem(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Types</option>
          <option value="content_source">Content Sources</option>
          <option value="workspace_context">Workspace Context</option>
          <option value="personal_brand">Personal Brands</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const Icon = getTypeIcon(item.type);
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <CardTitle className="text-sm font-medium line-clamp-1">
                      {item.title}
                    </CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(item)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                  {getTypeLabel(item.type)}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {item.summary || item.content.substring(0, 150)}...
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No knowledge items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No items match your search criteria' : 'Start building your knowledge base'}
          </p>
          <Button onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </Button>
        </div>
      )}

      {/* Add/Edit Knowledge Dialog */}
      <Dialog open={isAddingItem || !!editingItem} onOpenChange={(open) => {
        if (!open) {
          setIsAddingItem(false);
          setEditingItem(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Knowledge Item' : 'Add Knowledge Item'}
            </DialogTitle>
          </DialogHeader>
          <AddKnowledgeForm 
            item={editingItem} 
            onSave={loadKnowledgeBase}
            onClose={() => {
              setIsAddingItem(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AddKnowledgeFormProps {
  item?: KnowledgeItem | null;
  onSave: () => void;
  onClose: () => void;
}

function AddKnowledgeForm({ item, onSave, onClose }: AddKnowledgeFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    content: item?.content || '',
    type: item?.type || 'workspace_context',
    summary: item?.summary || '',
    tags: item?.tags?.join(', ') || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentWorkspace) return;

    setIsSaving(true);
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      if (item) {
        // Update existing item
        const tableName = item.type === 'content_source' ? 'content_sources' :
                         item.type === 'personal_brand' ? 'personal_brands' : 'workspace_context';
        
        const updateData: any = {
          title: formData.title,
          content: formData.content,
          tags
        };

        if (item.type === 'content_source') {
          updateData.summary = formData.summary;
        } else if (item.type === 'personal_brand') {
          updateData.name = formData.title;
          updateData.description = formData.content;
          updateData.expertise_areas = tags;
          delete updateData.title;
          delete updateData.content;
          delete updateData.tags;
        }

        const { error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq('id', item.id);

        if (error) throw error;
      } else {
        // Create new item
        if (formData.type === 'workspace_context') {
          const { error } = await supabase
            .from('workspace_context')
            .insert({
              workspace_id: currentWorkspace.id,
              user_id: user.id,
              context_type: 'knowledge',
              title: formData.title,
              content: formData.content,
              tags
            });
          if (error) throw error;
        } else if (formData.type === 'content_source') {
          const { error } = await supabase
            .from('content_sources')
            .insert({
              workspace_id: currentWorkspace.id,
              user_id: user.id,
              type: 'text',
              title: formData.title,
              content: formData.content,
              summary: formData.summary,
              tags
            });
          if (error) throw error;
        }
      }

      toast({
        title: item ? "Item Updated" : "Item Added",
        description: `${formData.title} has been ${item ? 'updated' : 'added to'} the knowledge base`,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving knowledge item:', error);
      toast({
        title: "Error",
        description: "Failed to save knowledge item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter a descriptive title"
          required
        />
      </div>

      {!item && (
        <div>
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="workspace_context">Workspace Context</option>
            <option value="content_source">Content Source</option>
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Enter the knowledge content..."
          rows={6}
          required
        />
      </div>

      {(formData.type === 'content_source' || item?.type === 'content_source') && (
        <div>
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Brief summary of the content"
            rows={2}
          />
        </div>
      )}

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="Enter tags separated by commas"
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : item ? 'Update' : 'Add'} Knowledge
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}