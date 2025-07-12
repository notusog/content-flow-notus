import React, { useState, useEffect } from 'react';
import { Plus, Brain, BarChart3, FileText, Target, Users, TrendingUp, Settings, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';

interface PersonalBrandProfile {
  id: string;
  name: string;
  description: string;
  bio: string;
  tone_of_voice: string;
  expertise_areas: string[];
  brand_colors: any;
  social_links: any;
  knowledge_base: {
    content_archetype?: any;
    media_strategy?: any;
    profile_optimization?: any;
    analytics_insights?: any;
  };
  created_at: string;
}

interface BrandContextItem {
  id: string;
  title: string;
  type: 'content_archetype' | 'media_strategy' | 'profile_optimization' | 'analytics_insights';
  content: any;
  created_at: string;
}

export function PersonalBrandsManagement() {
  const [brands, setBrands] = useState<PersonalBrandProfile[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<PersonalBrandProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [isAddingContext, setIsAddingContext] = useState(false);
  const [contextType, setContextType] = useState<string>('');
  const { toast } = useToast();
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    loadPersonalBrands();
  }, [currentWorkspace]);

  const loadPersonalBrands = async () => {
    if (!currentWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('personal_brands')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBrands((data || []).map(brand => ({
        ...brand,
        knowledge_base: typeof brand.knowledge_base === 'string' 
          ? JSON.parse(brand.knowledge_base) 
          : brand.knowledge_base || {}
      })) as PersonalBrandProfile[]);
      if (data && data.length > 0 && !selectedBrand) {
        const firstBrand = {
          ...data[0],
          knowledge_base: typeof data[0].knowledge_base === 'string' 
            ? JSON.parse(data[0].knowledge_base) 
            : data[0].knowledge_base || {}
        } as PersonalBrandProfile;
        setSelectedBrand(firstBrand);
      }
    } catch (error) {
      console.error('Error loading personal brands:', error);
      toast({
        title: "Error",
        description: "Failed to load personal brands",
        variant: "destructive",
      });
    }
  };

  const contextTypes = [
    {
      id: 'content_archetype',
      name: 'Content Archetype',
      description: 'Define content strategy, target audience, and posting patterns',
      icon: Target,
      fields: ['target_audience', 'content_pillars', 'posting_frequency', 'tone_guidelines', 'success_metrics']
    },
    {
      id: 'media_strategy',
      name: 'Media Strategy',
      description: 'Platform strategy, campaign objectives, and budget allocation',
      icon: TrendingUp,
      fields: ['objectives', 'target_platforms', 'timeline', 'budget_allocation', 'kpis']
    },
    {
      id: 'profile_optimization',
      name: 'Profile Optimization',
      description: 'Profile analysis, improvement areas, and optimization plan',
      icon: Users,
      fields: ['current_analysis', 'improvement_areas', 'proposed_changes', 'implementation_plan']
    },
    {
      id: 'analytics_insights',
      name: 'Analytics & Insights',
      description: 'Performance data, trends, and strategic insights',
      icon: BarChart3,
      fields: ['performance_metrics', 'content_insights', 'audience_analysis', 'growth_trends']
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar - Brand Selection */}
      <div className="w-80 border-r bg-muted/20 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Personal Brands</h2>
          <Dialog open={isCreatingBrand} onOpenChange={setIsCreatingBrand}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Personal Brand</DialogTitle>
              </DialogHeader>
              <CreateBrandForm onSave={loadPersonalBrands} onClose={() => setIsCreatingBrand(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {brands.map((brand) => (
            <Card 
              key={brand.id} 
              className={`cursor-pointer transition-colors ${
                selectedBrand?.id === brand.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedBrand(brand)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium">{brand.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{brand.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {brand.expertise_areas?.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {selectedBrand ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{selectedBrand.name}</h1>
                  <p className="text-muted-foreground">{selectedBrand.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Content Engine
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="mx-6 mt-4 w-fit">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="content">Content Hub</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="overview" className="space-y-6">
                  <BrandOverview brand={selectedBrand} onUpdate={loadPersonalBrands} />
                </TabsContent>

                <TabsContent value="knowledge" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Brand Knowledge Base</h3>
                    <Dialog open={isAddingContext} onOpenChange={setIsAddingContext}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Context
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add Brand Context</DialogTitle>
                        </DialogHeader>
                        <AddContextForm 
                          brandId={selectedBrand.id}
                          onSave={loadPersonalBrands} 
                          onClose={() => setIsAddingContext(false)} 
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <BrandKnowledgeBase brand={selectedBrand} />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <BrandAnalytics brand={selectedBrand} />
                </TabsContent>

                <TabsContent value="content" className="space-y-6">
                  <BrandContentHub brand={selectedBrand} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Select a Personal Brand</h3>
              <p className="text-muted-foreground">Choose a brand from the sidebar to manage its profile and knowledge base</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component implementations
function BrandOverview({ brand, onUpdate }: { brand: PersonalBrandProfile; onUpdate: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Bio</Label>
            <p className="text-sm text-muted-foreground mt-1">{brand.bio}</p>
          </div>
          <div>
            <Label>Expertise Areas</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {brand.expertise_areas?.map((area, index) => (
                <Badge key={index} variant="secondary">{area}</Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Tone of Voice</Label>
            <p className="text-sm text-muted-foreground mt-1">{brand.tone_of_voice}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <FileText className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">24</div>
              <div className="text-xs text-muted-foreground">Content Pieces</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">85%</div>
              <div className="text-xs text-muted-foreground">Engagement Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BrandKnowledgeBase({ brand }: { brand: PersonalBrandProfile }) {
  const contextTypes = [
    { id: 'content_archetype', name: 'Content Archetype', icon: Target, color: 'bg-blue-500' },
    { id: 'media_strategy', name: 'Media Strategy', icon: TrendingUp, color: 'bg-green-500' },
    { id: 'profile_optimization', name: 'Profile Optimization', icon: Users, color: 'bg-purple-500' },
    { id: 'analytics_insights', name: 'Analytics Insights', icon: BarChart3, color: 'bg-orange-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {contextTypes.map((type) => {
        const Icon = type.icon;
        const hasContext = brand.knowledge_base?.[type.id as keyof typeof brand.knowledge_base];
        
        return (
          <Card key={type.id} className={hasContext ? 'border-green-200' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${type.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span>{type.name}</span>
                {hasContext && (
                  <Badge variant="outline" className="text-xs">
                    Configured
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasContext ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Context configured and ready for AI prompts
                  </p>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Context
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add {type.name.toLowerCase()} context to enhance AI responses
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function BrandAnalytics({ brand }: { brand: PersonalBrandProfile }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analytics integration coming soon. This will show content performance, engagement metrics, and growth insights for {brand.name}.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function BrandContentHub({ brand }: { brand: PersonalBrandProfile }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Content management integration coming soon. This will show all content pieces, drafts, and published content for {brand.name}.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateBrandForm({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bio: '',
    tone_of_voice: '',
    expertise_areas: ''
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
      const { error } = await supabase
        .from('personal_brands')
        .insert({
          workspace_id: currentWorkspace.id,
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          bio: formData.bio,
          tone_of_voice: formData.tone_of_voice,
          expertise_areas: formData.expertise_areas.split(',').map(a => a.trim()).filter(Boolean),
          knowledge_base: {}
        });

      if (error) throw error;

      toast({
        title: "Brand Created",
        description: `${formData.name} has been created successfully`,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating brand:', error);
      toast({
        title: "Error",
        description: "Failed to create personal brand",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Brand Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="expertise_areas">Expertise Areas (comma-separated)</Label>
          <Input
            id="expertise_areas"
            value={formData.expertise_areas}
            onChange={(e) => setFormData(prev => ({ ...prev, expertise_areas: e.target.value }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="tone_of_voice">Tone of Voice & LinkedIn Posts</Label>
        <Textarea
          id="tone_of_voice"
          value={formData.tone_of_voice}
          onChange={(e) => setFormData(prev => ({ ...prev, tone_of_voice: e.target.value }))}
          placeholder="Describe tone or paste LinkedIn posts to analyze..."
          rows={4}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create Brand'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function AddContextForm({ brandId, onSave, onClose }: { brandId: string; onSave: () => void; onClose: () => void }) {
  const [contextType, setContextType] = useState('content_archetype');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();

  const contextTypes = [
    {
      id: 'content_archetype',
      name: 'Content Archetype',
      fields: [
        { key: 'target_audience', label: 'Target Audience', type: 'textarea' },
        { key: 'content_pillars', label: 'Content Pillars (comma-separated)', type: 'input' },
        { key: 'posting_frequency', label: 'Posting Frequency', type: 'select', options: ['Daily', '3x/week', 'Weekly', 'Bi-weekly'] },
        { key: 'tone_guidelines', label: 'Tone Guidelines', type: 'textarea' },
        { key: 'success_metrics', label: 'Success Metrics (comma-separated)', type: 'input' }
      ]
    },
    {
      id: 'media_strategy',
      name: 'Media Strategy',
      fields: [
        { key: 'objectives', label: 'Objectives (comma-separated)', type: 'input' },
        { key: 'target_platforms', label: 'Target Platforms (comma-separated)', type: 'input' },
        { key: 'timeline', label: 'Timeline', type: 'input' },
        { key: 'budget_allocation', label: 'Budget Allocation (%)', type: 'textarea' },
        { key: 'kpis', label: 'KPIs (comma-separated)', type: 'input' }
      ]
    }
  ];

  const selectedTypeConfig = contextTypes.find(t => t.id === contextType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentWorkspace) return;

    setIsSaving(true);
    try {
      // Process form data based on field types
      const processedData = { ...formData };
      selectedTypeConfig?.fields.forEach(field => {
        if (field.key.includes('comma-separated') || field.key.includes('_areas') || field.key.includes('pillars')) {
          processedData[field.key] = formData[field.key]?.split(',').map(item => item.trim()).filter(Boolean).join(',') || '';
        }
      });

      // Store as workspace context with reference to brand
      const { error } = await supabase
        .from('workspace_context')
        .insert({
          workspace_id: currentWorkspace.id,
          user_id: user.id,
          context_type: contextType,
          title: `${selectedTypeConfig?.name} - Brand Context`,
          content: JSON.stringify({
            brand_id: brandId,
            ...processedData
          }),
          metadata: { brand_id: brandId }
        });

      if (error) throw error;

      toast({
        title: "Context Added",
        description: `${selectedTypeConfig?.name} context has been added to the brand`,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error adding context:', error);
      toast({
        title: "Error",
        description: "Failed to add brand context",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Context Type</Label>
        <Select value={contextType} onValueChange={setContextType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {contextTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTypeConfig?.fields.map(field => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.type === 'textarea' ? (
            <Textarea
              id={field.key}
              value={formData[field.key] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
              rows={3}
            />
          ) : field.type === 'select' ? (
            <Select 
              value={formData[field.key] || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, [field.key]: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.key}
              value={formData[field.key] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
            />
          )}
        </div>
      ))}

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Adding...' : 'Add Context'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}