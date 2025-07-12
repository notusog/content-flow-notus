import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { usePersonalBrand } from '@/contexts/PersonalBrandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Briefcase, 
  User, 
  Settings, 
  Palette, 
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function WorkspaceSetup() {
  const { user } = useAuth();
  const { workspaces, currentWorkspace, createWorkspace, setCurrentWorkspace } = useWorkspace();
  const { personalBrands, createPersonalBrand } = usePersonalBrand();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  
  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    description: ''
  });

  const [brandForm, setBrandForm] = useState({
    name: '',
    description: '',
    bio: '',
    expertise_areas: '',
    tone_of_voice: ''
  });

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingWorkspace(true);
    
    try {
      await createWorkspace(workspaceForm);
      setWorkspaceForm({ name: '', description: '' });
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace) {
      alert('Please select a workspace first');
      return;
    }
    
    setIsCreatingBrand(true);
    
    try {
      await createPersonalBrand({
        name: brandForm.name,
        description: brandForm.description,
        bio: brandForm.bio,
        expertise_areas: brandForm.expertise_areas.split(',').map(s => s.trim()).filter(Boolean),
        tone_of_voice: brandForm.tone_of_voice,
        workspace_id: currentWorkspace.id
      });
      setBrandForm({
        name: '',
        description: '',
        bio: '',
        expertise_areas: '',
        tone_of_voice: ''
      });
    } finally {
      setIsCreatingBrand(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
          <p className="text-muted-foreground">You need to be logged in to set up workspaces.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Setup</h1>
          <p className="text-muted-foreground">
            Set up your workspaces and personal brands to organize your content strategy
          </p>
        </div>
      </div>

      {/* Quick Setup Guide */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Quick Setup Guide
          </CardTitle>
          <CardDescription>
            Follow these steps to get started with your content creation system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</div>
              <span className="text-sm">Create a workspace (e.g., "Personal Brand", "Client Project")</span>
              {workspaces.length > 0 && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</div>
              <span className="text-sm">Set up personal brand profiles for content consistency</span>
              {personalBrands.length > 0 && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</div>
              <span className="text-sm">Start adding content sources and generating content</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Setup Tabs */}
      <Tabs defaultValue="workspaces" className="w-full">
        <TabsList>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="brands">Personal Brands</TabsTrigger>
        </TabsList>

        {/* Workspaces Tab */}
        <TabsContent value="workspaces" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Workspace */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Workspace
                </CardTitle>
                <CardDescription>
                  Workspaces help you organize content for different clients, projects, or brands
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace Name</Label>
                    <Input
                      id="workspace-name"
                      value={workspaceForm.name}
                      onChange={(e) => setWorkspaceForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Personal Brand, Acme Corp, Client Project"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspace-description">Description (Optional)</Label>
                    <Textarea
                      id="workspace-description"
                      value={workspaceForm.description}
                      onChange={(e) => setWorkspaceForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this workspace..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={isCreatingWorkspace || !workspaceForm.name.trim()}>
                    {isCreatingWorkspace ? 'Creating...' : 'Create Workspace'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Workspaces */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Your Workspaces
                </CardTitle>
                <CardDescription>
                  {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''} created
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workspaces.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No workspaces yet</p>
                    <p className="text-sm">Create your first workspace to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workspaces.map((workspace) => (
                      <div 
                        key={workspace.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          currentWorkspace?.id === workspace.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setCurrentWorkspace(workspace)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{workspace.name}</h4>
                            {workspace.description && (
                              <p className="text-sm text-muted-foreground">{workspace.description}</p>
                            )}
                          </div>
                          {currentWorkspace?.id === workspace.id && (
                            <Badge variant="secondary">Active</Badge>
                          )}
                        </div>
                      </div>
                    ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personal Brands Tab */}
        <TabsContent value="brands" className="space-y-6">
          {!currentWorkspace ? (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-yellow-600" />
                  <h3 className="font-semibold mb-2">Select a Workspace First</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to select a workspace before creating personal brands
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/?tab=workspaces'}>
                    Go to Workspaces
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Personal Brand */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Personal Brand
                  </CardTitle>
                  <CardDescription>
                    Set up a personal brand profile for consistent content creation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateBrand} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand-name">Brand Name</Label>
                      <Input
                        id="brand-name"
                        value={brandForm.name}
                        onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., John Smith, TechGuru, Marketing Maven"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand-bio">Bio</Label>
                      <Textarea
                        id="brand-bio"
                        value={brandForm.bio}
                        onChange={(e) => setBrandForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Brief personal bio..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expertise">Expertise Areas</Label>
                      <Input
                        id="expertise"
                        value={brandForm.expertise_areas}
                        onChange={(e) => setBrandForm(prev => ({ ...prev, expertise_areas: e.target.value }))}
                        placeholder="Marketing, Content Strategy, Social Media"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone of Voice</Label>
                      <Input
                        id="tone"
                        value={brandForm.tone_of_voice}
                        onChange={(e) => setBrandForm(prev => ({ ...prev, tone_of_voice: e.target.value }))}
                        placeholder="Professional, Friendly, Authoritative"
                      />
                    </div>
                    <Button type="submit" disabled={isCreatingBrand || !brandForm.name.trim()}>
                      {isCreatingBrand ? 'Creating...' : 'Create Personal Brand'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Brands */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Brands
                  </CardTitle>
                  <CardDescription>
                    Brands in workspace: {currentWorkspace.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {personalBrands.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No personal brands yet</p>
                      <p className="text-sm">Create your first personal brand profile</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {personalBrands.map((brand) => (
                        <div key={brand.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium">{brand.name}</h4>
                          {brand.bio && (
                            <p className="text-sm text-muted-foreground mt-1">{brand.bio}</p>
                          )}
                          {brand.expertise_areas && brand.expertise_areas.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {brand.expertise_areas.slice(0, 3).map((area, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
