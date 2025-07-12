import React, { useState, useEffect } from 'react';
import { Plus, Target, Users, TrendingUp, FileText, Calendar, Brain } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';

interface ContentArchetype {
  id: string;
  name: string;
  description: string;
  target_audience: string;
  content_pillars: string[];
  tone_guidelines: string;
  post_frequency: string;
  content_types: string[];
  cta_patterns: string[];
  hashtag_strategy: string;
  success_metrics: string[];
  created_at: string;
}

interface MediaStrategy {
  id: string;
  name: string;
  objectives: string[];
  target_platforms: string[];
  content_calendar: any;
  budget_allocation: any;
  kpis: string[];
  timeline: string;
  created_at: string;
}

interface ProfileRevamp {
  id: string;
  client_name: string;
  current_analysis: string;
  improvement_areas: string[];
  proposed_changes: string;
  before_metrics: any;
  target_metrics: any;
  implementation_plan: string[];
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

export function ClientServices() {
  const [activeTab, setActiveTab] = useState('archetypes');
  const [archetypes, setArchetypes] = useState<ContentArchetype[]>([]);
  const [strategies, setStrategies] = useState<MediaStrategy[]>([]);
  const [revamps, setRevamps] = useState<ProfileRevamp[]>([]);
  const [isAddingArchetype, setIsAddingArchetype] = useState(false);
  const [isAddingStrategy, setIsAddingStrategy] = useState(false);
  const [isAddingRevamp, setIsAddingRevamp] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    loadClientServices();
  }, [currentWorkspace]);

  const loadClientServices = async () => {
    if (!currentWorkspace) return;

    try {
      // Load content archetypes
      const { data: archetypeData } = await supabase
        .from('workspace_context')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('context_type', 'content_archetype')
        .order('created_at', { ascending: false });

      // Load media strategies
      const { data: strategyData } = await supabase
        .from('workspace_context')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('context_type', 'media_strategy')
        .order('created_at', { ascending: false });

      // Load profile revamps
      const { data: revampData } = await supabase
        .from('workspace_context')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('context_type', 'profile_revamp')
        .order('created_at', { ascending: false });

      setArchetypes(archetypeData?.map(item => ({
        id: item.id,
        ...JSON.parse(item.content),
        created_at: item.created_at
      })) || []);

      setStrategies(strategyData?.map(item => ({
        id: item.id,
        ...JSON.parse(item.content),
        created_at: item.created_at
      })) || []);

      setRevamps(revampData?.map(item => ({
        id: item.id,
        ...JSON.parse(item.content),
        created_at: item.created_at
      })) || []);

    } catch (error) {
      console.error('Error loading client services:', error);
      toast({
        title: "Error",
        description: "Failed to load client services",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Services</h1>
          <p className="text-muted-foreground">
            Comprehensive content strategy, profile optimization, and media planning
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="archetypes" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Content Archetypes</span>
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Media Strategies</span>
          </TabsTrigger>
          <TabsTrigger value="revamps" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Profile Revamps</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="archetypes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Content Archetypes</h2>
            <Dialog open={isAddingArchetype} onOpenChange={setIsAddingArchetype}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Archetype
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Content Archetype</DialogTitle>
                </DialogHeader>
                <ArchetypeForm onSave={loadClientServices} onClose={() => setIsAddingArchetype(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archetypes.map((archetype) => (
              <Card key={archetype.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span>{archetype.name}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{archetype.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Target Audience:</p>
                    <p className="text-sm text-muted-foreground">{archetype.target_audience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Content Pillars:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {archetype.content_pillars?.slice(0, 3).map((pillar, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {pillar}
                        </Badge>
                      ))}
                      {archetype.content_pillars?.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{archetype.content_pillars.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Post Frequency:</p>
                    <p className="text-sm text-muted-foreground">{archetype.post_frequency}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Media Strategies</h2>
            <Dialog open={isAddingStrategy} onOpenChange={setIsAddingStrategy}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Strategy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Media Strategy</DialogTitle>
                </DialogHeader>
                <StrategyForm onSave={loadClientServices} onClose={() => setIsAddingStrategy(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>{strategy.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Objectives:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {strategy.objectives?.slice(0, 3).map((obj, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {obj}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Target Platforms:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {strategy.target_platforms?.map((platform, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Timeline:</p>
                    <p className="text-sm text-muted-foreground">{strategy.timeline}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revamps" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Profile Revamps</h2>
            <Dialog open={isAddingRevamp} onOpenChange={setIsAddingRevamp}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Revamp
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Start Profile Revamp</DialogTitle>
                </DialogHeader>
                <RevampForm onSave={loadClientServices} onClose={() => setIsAddingRevamp(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {revamps.map((revamp) => (
              <Card key={revamp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      <span>{revamp.client_name}</span>
                    </div>
                    <Badge 
                      variant={revamp.status === 'completed' ? 'default' : 
                              revamp.status === 'in_progress' ? 'secondary' : 'outline'}
                    >
                      {revamp.status.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Improvement Areas:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {revamp.improvement_areas?.slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Current Analysis:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {revamp.current_analysis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Form Components
function ArchetypeForm({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_audience: '',
    content_pillars: '',
    tone_guidelines: '',
    post_frequency: '',
    content_types: '',
    cta_patterns: '',
    hashtag_strategy: '',
    success_metrics: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentWorkspace) return;

    setIsSaving(true);
    try {
      const archetypeData = {
        ...formData,
        content_pillars: formData.content_pillars.split(',').map(p => p.trim()).filter(Boolean),
        content_types: formData.content_types.split(',').map(t => t.trim()).filter(Boolean),
        cta_patterns: formData.cta_patterns.split(',').map(c => c.trim()).filter(Boolean),
        success_metrics: formData.success_metrics.split(',').map(m => m.trim()).filter(Boolean)
      };

      const { error } = await supabase
        .from('workspace_context')
        .insert({
          workspace_id: currentWorkspace.id,
          user_id: user.id,
          context_type: 'content_archetype',
          title: formData.name,
          content: JSON.stringify(archetypeData)
        });

      if (error) throw error;

      toast({
        title: "Archetype Created",
        description: `${formData.name} archetype has been created successfully`,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating archetype:', error);
      toast({
        title: "Error",
        description: "Failed to create content archetype",
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
          <Label htmlFor="name">Archetype Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Thought Leader"
            required
          />
        </div>
        <div>
          <Label htmlFor="post_frequency">Post Frequency</Label>
          <Select value={formData.post_frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, post_frequency: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="3x_week">3x per week</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe this content archetype..."
          required
        />
      </div>

      <div>
        <Label htmlFor="target_audience">Target Audience</Label>
        <Textarea
          id="target_audience"
          value={formData.target_audience}
          onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
          placeholder="Define the target audience for this archetype..."
          required
        />
      </div>

      <div>
        <Label htmlFor="content_pillars">Content Pillars (comma-separated)</Label>
        <Input
          id="content_pillars"
          value={formData.content_pillars}
          onChange={(e) => setFormData(prev => ({ ...prev, content_pillars: e.target.value }))}
          placeholder="e.g., Industry Insights, Personal Stories, Tips & Tricks"
          required
        />
      </div>

      <div>
        <Label htmlFor="tone_guidelines">Tone Guidelines</Label>
        <Textarea
          id="tone_guidelines"
          value={formData.tone_guidelines}
          onChange={(e) => setFormData(prev => ({ ...prev, tone_guidelines: e.target.value }))}
          placeholder="Describe the tone and voice for this archetype..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="content_types">Content Types (comma-separated)</Label>
          <Input
            id="content_types"
            value={formData.content_types}
            onChange={(e) => setFormData(prev => ({ ...prev, content_types: e.target.value }))}
            placeholder="e.g., Articles, Videos, Infographics"
          />
        </div>
        <div>
          <Label htmlFor="success_metrics">Success Metrics (comma-separated)</Label>
          <Input
            id="success_metrics"
            value={formData.success_metrics}
            onChange={(e) => setFormData(prev => ({ ...prev, success_metrics: e.target.value }))}
            placeholder="e.g., Engagement Rate, Reach, Conversions"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cta_patterns">CTA Patterns (comma-separated)</Label>
        <Input
          id="cta_patterns"
          value={formData.cta_patterns}
          onChange={(e) => setFormData(prev => ({ ...prev, cta_patterns: e.target.value }))}
          placeholder="e.g., What's your take?, Share your thoughts, Tell me below"
        />
      </div>

      <div>
        <Label htmlFor="hashtag_strategy">Hashtag Strategy</Label>
        <Textarea
          id="hashtag_strategy"
          value={formData.hashtag_strategy}
          onChange={(e) => setFormData(prev => ({ ...prev, hashtag_strategy: e.target.value }))}
          placeholder="Describe hashtag usage strategy for this archetype..."
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create Archetype'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function StrategyForm({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    objectives: '',
    target_platforms: '',
    timeline: '',
    budget_allocation: '',
    kpis: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentWorkspace) return;

    setIsSaving(true);
    try {
      const strategyData = {
        ...formData,
        objectives: formData.objectives.split(',').map(o => o.trim()).filter(Boolean),
        target_platforms: formData.target_platforms.split(',').map(p => p.trim()).filter(Boolean),
        kpis: formData.kpis.split(',').map(k => k.trim()).filter(Boolean),
        budget_allocation: formData.budget_allocation ? JSON.parse(formData.budget_allocation) : {},
        content_calendar: {}
      };

      const { error } = await supabase
        .from('workspace_context')
        .insert({
          workspace_id: currentWorkspace.id,
          user_id: user.id,
          context_type: 'media_strategy',
          title: formData.name,
          content: JSON.stringify(strategyData)
        });

      if (error) throw error;

      toast({
        title: "Strategy Created",
        description: `${formData.name} strategy has been created successfully`,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating strategy:', error);
      toast({
        title: "Error",
        description: "Failed to create media strategy",
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
          <Label htmlFor="name">Strategy Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Q1 Brand Awareness Campaign"
            required
          />
        </div>
        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Input
            id="timeline"
            value={formData.timeline}
            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
            placeholder="e.g., 3 months, Q1 2024"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="objectives">Objectives (comma-separated)</Label>
        <Input
          id="objectives"
          value={formData.objectives}
          onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
          placeholder="e.g., Increase brand awareness, Generate leads, Drive engagement"
          required
        />
      </div>

      <div>
        <Label htmlFor="target_platforms">Target Platforms (comma-separated)</Label>
        <Input
          id="target_platforms"
          value={formData.target_platforms}
          onChange={(e) => setFormData(prev => ({ ...prev, target_platforms: e.target.value }))}
          placeholder="e.g., LinkedIn, Twitter, Instagram, YouTube"
          required
        />
      </div>

      <div>
        <Label htmlFor="kpis">Key Performance Indicators (comma-separated)</Label>
        <Input
          id="kpis"
          value={formData.kpis}
          onChange={(e) => setFormData(prev => ({ ...prev, kpis: e.target.value }))}
          placeholder="e.g., Engagement rate, Reach, Click-through rate, Conversions"
          required
        />
      </div>

      <div>
        <Label htmlFor="budget_allocation">Budget Allocation (JSON format)</Label>
        <Textarea
          id="budget_allocation"
          value={formData.budget_allocation}
          onChange={(e) => setFormData(prev => ({ ...prev, budget_allocation: e.target.value }))}
          placeholder='{"content_creation": 40, "paid_promotion": 35, "tools": 15, "contingency": 10}'
        />
        <p className="text-xs text-muted-foreground">Optional: Enter budget allocation as JSON with percentages</p>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create Strategy'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function RevampForm({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    client_name: '',
    current_analysis: '',
    improvement_areas: '',
    proposed_changes: '',
    implementation_plan: '',
    status: 'pending'
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentWorkspace) return;

    setIsSaving(true);
    try {
      const revampData = {
        ...formData,
        improvement_areas: formData.improvement_areas.split(',').map(a => a.trim()).filter(Boolean),
        implementation_plan: formData.implementation_plan.split('\n').map(p => p.trim()).filter(Boolean),
        before_metrics: {},
        target_metrics: {}
      };

      const { error } = await supabase
        .from('workspace_context')
        .insert({
          workspace_id: currentWorkspace.id,
          user_id: user.id,
          context_type: 'profile_revamp',
          title: formData.client_name + ' Profile Revamp',
          content: JSON.stringify(revampData)
        });

      if (error) throw error;

      toast({
        title: "Revamp Started",
        description: `Profile revamp for ${formData.client_name} has been initiated`,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating revamp:', error);
      toast({
        title: "Error",
        description: "Failed to start profile revamp",
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
          <Label htmlFor="client_name">Client Name</Label>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
            placeholder="Enter client name"
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="current_analysis">Current Profile Analysis</Label>
        <Textarea
          id="current_analysis"
          value={formData.current_analysis}
          onChange={(e) => setFormData(prev => ({ ...prev, current_analysis: e.target.value }))}
          placeholder="Analyze the current state of the client's profile..."
          required
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="improvement_areas">Improvement Areas (comma-separated)</Label>
        <Input
          id="improvement_areas"
          value={formData.improvement_areas}
          onChange={(e) => setFormData(prev => ({ ...prev, improvement_areas: e.target.value }))}
          placeholder="e.g., Bio optimization, Content strategy, Visual branding"
          required
        />
      </div>

      <div>
        <Label htmlFor="proposed_changes">Proposed Changes</Label>
        <Textarea
          id="proposed_changes"
          value={formData.proposed_changes}
          onChange={(e) => setFormData(prev => ({ ...prev, proposed_changes: e.target.value }))}
          placeholder="Detail the proposed changes and improvements..."
          required
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="implementation_plan">Implementation Plan (one item per line)</Label>
        <Textarea
          id="implementation_plan"
          value={formData.implementation_plan}
          onChange={(e) => setFormData(prev => ({ ...prev, implementation_plan: e.target.value }))}
          placeholder="Step 1: Update profile photo and banner&#10;Step 2: Optimize bio and headline&#10;Step 3: Audit and improve content"
          rows={4}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Starting...' : 'Start Revamp'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}