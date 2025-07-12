import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useContent } from '@/contexts/ContentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Brain, Sparkles, FileText, MessageSquare, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WorkspaceManager() {
  const { 
    workspaces, 
    currentWorkspace, 
    workspaceContext,
    setCurrentWorkspace,
    createWorkspace, 
    updateWorkspace,
    deleteWorkspace,
    generateCopy,
    enhanceContent,
    addToneOfVoice,
    addPreviousPost,
    getPreviousPosts,
    getToneOfVoice
  } = useWorkspace();
  
  const { sources } = useContent();
  
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCopywriterDialog, setShowCopywriterDialog] = useState(false);
  const [showEnhancerDialog, setShowEnhancerDialog] = useState(false);
  const [showLinkedInDialog, setShowLinkedInDialog] = useState(false);
  const [showToneDialog, setShowToneDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });
  const [copyRequest, setCopyRequest] = useState({
    prompt: '',
    tone: 'professional',
    length: 'medium',
    type: 'general',
    audience: '',
    brandVoice: '',
    context: ''
  });
  const [enhanceRequest, setEnhanceRequest] = useState({
    content: '',
    action: 'enhance' as const
  });
  const [linkedInRequest, setLinkedInRequest] = useState({
    clientName: '',
    transcript: '',
    selectedSource: ''
  });
  const [toneOfVoice, setToneOfVoiceState] = useState('');
  const [previousPost, setPreviousPost] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspace.name.trim()) return;
    
    await createWorkspace(newWorkspace);
    setNewWorkspace({ name: '', description: '' });
    setShowCreateDialog(false);
  };

  const handleGenerateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyRequest.prompt.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateCopy(copyRequest.prompt, {
        tone: copyRequest.tone,
        length: copyRequest.length,
        type: copyRequest.type,
        audience: copyRequest.audience || undefined,
        brandVoice: copyRequest.brandVoice || undefined,
        context: copyRequest.context || undefined,
      });
      setGeneratedContent(result);
      toast({
        title: "Copy Generated!",
        description: "Your copy has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate copy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enhanceRequest.content.trim()) return;

    setIsGenerating(true);
    try {
      const result = await enhanceContent(enhanceRequest.content, enhanceRequest.action);
      setGeneratedContent(result);
      toast({
        title: "Content Enhanced!",
        description: "Your content has been processed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateLinkedInPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedInRequest.clientName.trim() || !linkedInRequest.transcript.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateCopy('Generate a LinkedIn post from this transcript', {
        type: 'linkedin_post',
        clientName: linkedInRequest.clientName,
        transcript: linkedInRequest.transcript,
        useStructuredPrompt: true
      });
      setGeneratedContent(result);
      toast({
        title: "LinkedIn Post Generated!",
        description: "Your LinkedIn post has been generated using the structured prompt.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate LinkedIn post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToneOfVoice = async () => {
    if (!toneOfVoice.trim()) return;
    
    try {
      await addToneOfVoice(toneOfVoice);
      setToneOfVoiceState('');
      setShowToneDialog(false);
      toast({
        title: "Tone of Voice Saved!",
        description: "Your brand tone of voice has been saved to the workspace.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tone of voice.",
        variant: "destructive",
      });
    }
  };

  const handleAddPreviousPost = async () => {
    if (!previousPost.trim()) return;
    
    try {
      await addPreviousPost(previousPost);
      setPreviousPost('');
      setShowPostDialog(false);
      toast({
        title: "Previous Post Added!",
        description: "The post has been added as reference material.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add previous post.",
        variant: "destructive",
      });
    }
  };

  // Get current tone of voice and previous posts
  const currentTone = getToneOfVoice();
  const previousPosts = getPreviousPosts();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Workspace Manager</h1>
          <p className="text-muted-foreground">Manage your workspaces and leverage Claude AI for copywriting and content enhancement</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showLinkedInDialog} onOpenChange={setShowLinkedInDialog}>
            <DialogTrigger asChild>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                LinkedIn Post Generator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Advanced LinkedIn Post Generator</DialogTitle>
                <DialogDescription>Generate high-quality LinkedIn posts using transcript analysis and structured prompts</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGenerateLinkedInPost} className="space-y-4">
                <Input
                  placeholder="Client name"
                  value={linkedInRequest.clientName}
                  onChange={(e) => setLinkedInRequest(prev => ({ ...prev, clientName: e.target.value }))}
                  required
                />
                <div>
                  <label className="text-sm font-medium">Select Source (Optional)</label>
                  <Select value={linkedInRequest.selectedSource} onValueChange={(value) => {
                    setLinkedInRequest(prev => ({ ...prev, selectedSource: value }));
                    const selectedSource = sources.find(s => s.id === value);
                    if (selectedSource) {
                      setLinkedInRequest(prev => ({ ...prev, transcript: selectedSource.content }));
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a source to use as transcript" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.title} ({source.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Paste your transcript here..."
                  value={linkedInRequest.transcript}
                  onChange={(e) => setLinkedInRequest(prev => ({ ...prev, transcript: e.target.value }))}
                  rows={8}
                  required
                />
                <div className="bg-muted p-3 rounded-md text-sm">
                  <strong>Using:</strong> {previousPosts.length} previous posts, {currentTone ? 'custom tone of voice' : 'default tone'}
                </div>
                <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? "Generating LinkedIn Post..." : "Generate LinkedIn Post"}
                </Button>
              </form>
              {generatedContent && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Generated LinkedIn Post:</h4>
                  <div className="whitespace-pre-wrap text-sm">{generatedContent}</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Character count: {generatedContent.length}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={showToneDialog} onOpenChange={setShowToneDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                {currentTone ? 'Update' : 'Set'} Tone of Voice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Brand Tone of Voice</DialogTitle>
                <DialogDescription>Define your brand's tone of voice for consistent content generation</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your brand's tone of voice, communication style, and personality..."
                  value={toneOfVoice || currentTone?.content || ''}
                  onChange={(e) => setToneOfVoiceState(e.target.value)}
                  rows={8}
                />
                <Button onClick={handleSaveToneOfVoice} className="w-full">
                  Save Tone of Voice
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Add Reference Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Previous Post</DialogTitle>
                <DialogDescription>Add a previous post as reference material for style consistency</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste a previous post that represents your style..."
                  value={previousPost}
                  onChange={(e) => setPreviousPost(e.target.value)}
                  rows={8}
                />
                <Button onClick={handleAddPreviousPost} className="w-full">
                  Add Reference Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCopywriterDialog} onOpenChange={setShowCopywriterDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                AI Copywriter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Claude AI Copywriter</DialogTitle>
                <DialogDescription>Generate compelling copy with Claude's advanced AI</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGenerateCopy} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tone</label>
                    <Select value={copyRequest.tone} onValueChange={(value) => setCopyRequest(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Length</label>
                    <Select value={copyRequest.length} onValueChange={(value) => setCopyRequest(prev => ({ ...prev, length: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select value={copyRequest.type} onValueChange={(value) => setCopyRequest(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="ad">Advertisement</SelectItem>
                        <SelectItem value="product_description">Product Description</SelectItem>
                        <SelectItem value="landing_page">Landing Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="Target audience"
                    value={copyRequest.audience}
                    onChange={(e) => setCopyRequest(prev => ({ ...prev, audience: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Brand voice (optional)"
                  value={copyRequest.brandVoice}
                  onChange={(e) => setCopyRequest(prev => ({ ...prev, brandVoice: e.target.value }))}
                />
                <Textarea
                  placeholder="Additional context (optional)"
                  value={copyRequest.context}
                  onChange={(e) => setCopyRequest(prev => ({ ...prev, context: e.target.value }))}
                />
                <Textarea
                  placeholder="Describe what you want to create..."
                  value={copyRequest.prompt}
                  onChange={(e) => setCopyRequest(prev => ({ ...prev, prompt: e.target.value }))}
                  required
                />
                <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? "Generating..." : "Generate Copy"}
                </Button>
              </form>
              {generatedContent && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Generated Copy:</h4>
                  <div className="whitespace-pre-wrap text-sm">{generatedContent}</div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={showEnhancerDialog} onOpenChange={setShowEnhancerDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Content Enhancer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>AI Content Enhancer</DialogTitle>
                <DialogDescription>Enhance, summarize, or extract insights from your content</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEnhanceContent} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Action</label>
                  <Select value={enhanceRequest.action} onValueChange={(value: any) => setEnhanceRequest(prev => ({ ...prev, action: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enhance">Enhance Content</SelectItem>
                      <SelectItem value="summarize">Summarize</SelectItem>
                      <SelectItem value="extract_insights">Extract Insights</SelectItem>
                      <SelectItem value="generate_ideas">Generate Ideas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Paste your content here..."
                  value={enhanceRequest.content}
                  onChange={(e) => setEnhanceRequest(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  required
                />
                <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? "Processing..." : "Process Content"}
                </Button>
              </form>
              {generatedContent && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Result:</h4>
                  <div className="whitespace-pre-wrap text-sm">{generatedContent}</div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>Set up a new workspace for your content projects</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <Input
                  placeholder="Workspace name"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                />
                <Button type="submit" className="w-full">Create Workspace</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Workspaces</CardTitle>
              <CardDescription>Manage and switch between your content workspaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {workspaces.map((workspace) => (
                  <div 
                    key={workspace.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      currentWorkspace?.id === workspace.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setCurrentWorkspace(workspace)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{workspace.name}</h3>
                        {workspace.description && (
                          <p className="text-sm text-muted-foreground mt-1">{workspace.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {currentWorkspace?.id === workspace.id && (
                          <Badge variant="default">Active</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkspace(workspace.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>Manage your workspace configuration and AI settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Tone of Voice</h4>
                  {currentTone ? (
                    <div className="p-3 bg-muted rounded-md text-sm">
                      {currentTone.content.substring(0, 200)}...
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tone of voice set</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Reference Posts ({previousPosts.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {previousPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="p-2 bg-muted rounded-md text-xs">
                        {post.content.substring(0, 100)}...
                      </div>
                    ))}
                    {previousPosts.length === 0 && (
                      <p className="text-sm text-muted-foreground">No reference posts added</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Workspace Context</CardTitle>
              <CardDescription>AI conversation history and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workspaceContext.slice(0, 5).map((context) => (
                  <div key={context.id} className="p-3 rounded-md bg-muted">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{context.context_type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(context.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium">{context.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {context.content.substring(0, 100)}...
                    </p>
                  </div>
                ))}
                {workspaceContext.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No context history yet. Start using AI features to build context.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}