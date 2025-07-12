import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Plus, 
  Edit, 
  Upload, 
  Settings, 
  Star,
  Building,
  Users,
  MessageSquare,
  TrendingUp,
  FileText,
  Zap,
  Brain
} from 'lucide-react';

interface PersonalBrand {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  toneOfVoice: string[];
  approvedContent: LinkedInPost[];
  llmSettings: {
    primaryModel: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
  metrics: {
    postsGenerated: number;
    engagementRate: number;
    followers: number;
    contentScore: number;
  };
  lastUpdated: string;
}

interface LinkedInPost {
  id: string;
  content: string;
  engagement: number;
  date: string;
  tags: string[];
  approved: boolean;
}

interface Workspace {
  id: string;
  name: string;
  type: 'company' | 'personal';
  members: string[];
  personalBrands: string[];
  description: string;
}

const mockWorkspaces: Workspace[] = [
  {
    id: 'notus-company',
    name: 'Notus Company',
    type: 'company',
    members: ['marvin-sangines', 'max-radman', 'tim-chilling', 'luca-wetzel', 'selim-burcu'],
    personalBrands: ['marvin-sangines', 'max-radman'],
    description: 'Main company workspace for Notus content strategy'
  },
  {
    id: 'personal-workspace',
    name: 'Personal Brands',
    type: 'personal',
    members: ['marvin-sangines', 'vicktoria-klich'],
    personalBrands: ['marvin-sangines', 'vicktoria-klich'],
    description: 'Individual personal brand management'
  }
];

const mockPersonalBrands: PersonalBrand[] = [
  {
    id: 'vicktoria-klich',
    name: 'Vicktoria Klich',
    role: 'Co-founder & Web3 Expert',
    company: 'w3.group',
    avatar: '/lovable-uploads/76a444dc-5aff-491b-bbfc-670b6193d6c7.png',
    bio: 'Changing the way people think about web3 | Co-founder w3.group | Based in Berlin | Top Voice on LinkedIn with 20,406 followers',
    toneOfVoice: ['Innovative', 'Web3-focused', 'Educational', 'Thought-leadership', 'Accessible'],
    approvedContent: [
      {
        id: 'vk1',
        content: 'Web3 isn\'t just about crypto. It\'s about reimagining how we interact, own, and create value online. At w3.group, we\'re building the infrastructure for this new internet. The future is decentralized, and it\'s happening now.',
        engagement: 2100,
        date: '2024-01-16',
        tags: ['web3', 'decentralization', 'innovation', 'future-tech'],
        approved: true
      },
      {
        id: 'vk2',
        content: 'After 2+ years building in the web3 space, here\'s what I\'ve learned: The technology is complex, but the vision is simple - give people back control of their digital lives. That\'s what drives us every day at w3.group.',
        engagement: 1650,
        date: '2024-01-15',
        tags: ['web3', 'digital-ownership', 'entrepreneurship', 'vision'],
        approved: true
      }
    ],
    llmSettings: {
      primaryModel: 'Claude 3.5 Sonnet',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: 'You are Vicktoria Klich (vickchick030), co-founder of w3.group and web3 thought leader. Write with passion about web3, decentralization, and digital innovation. Make complex concepts accessible and always connect to real-world impact. Use an innovative yet educational tone.'
    },
    metrics: {
      postsGenerated: 28,
      engagementRate: 6.8,
      followers: 20406,
      contentScore: 9.2
    },
    lastUpdated: '2024-01-16'
  },
  {
    id: 'marvin-sangines',
    name: 'Marvin Sangines',
    role: 'Content Strategist',
    company: 'Notus',
    avatar: '/api/placeholder/150/150',
    bio: 'Helping B2B companies scale through strategic content and personal branding. 5+ years in growth marketing.',
    toneOfVoice: ['Strategic', 'Data-driven', 'Authentic', 'Growth-focused', 'Educational'],
    approvedContent: [
      {
        id: '1',
        content: 'Just analyzed 500+ B2B LinkedIn posts. Here\'s what the top performers have in common: 1) Lead with a hook 2) Share specific data 3) Tell a story 4) End with actionable advice. The difference? Top posts get 5x more engagement.',
        engagement: 1250,
        date: '2024-01-15',
        tags: ['b2b-marketing', 'linkedin-strategy', 'content-tips'],
        approved: true
      },
      {
        id: '2',
        content: 'Content strategy isn\'t about posting more. It\'s about posting smarter. I\'ve seen companies double their leads by cutting their posting frequency in half and focusing on quality. Less noise, more signal.',
        engagement: 890,
        date: '2024-01-14',
        tags: ['content-strategy', 'marketing-tips', 'quality-over-quantity'],
        approved: true
      }
    ],
    llmSettings: {
      primaryModel: 'Claude 3.5 Sonnet',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: 'You are Marvin Sangines, a strategic content marketer. Write in a data-driven, authentic tone with actionable insights. Always include specific examples or metrics when possible.'
    },
    metrics: {
      postsGenerated: 45,
      engagementRate: 4.2,
      followers: 8500,
      contentScore: 8.7
    },
    lastUpdated: '2024-01-15'
  },
  {
    id: 'max-radman',
    name: 'Max Radman',
    role: 'Content Strategist',
    company: 'Notus',
    avatar: '/api/placeholder/150/150',
    bio: 'Creative content strategist focused on authentic brand storytelling and social media growth.',
    toneOfVoice: ['Creative', 'Authentic', 'Energetic', 'Story-driven', 'Relatable'],
    approvedContent: [
      {
        id: '3',
        content: 'Stop trying to sound like everyone else. Your brand\'s unique voice is your competitive advantage. I\'ve helped 20+ brands find their authentic voice, and the results speak for themselves: 3x higher engagement, better brand recall, and stronger customer relationships.',
        engagement: 750,
        date: '2024-01-13',
        tags: ['brand-voice', 'authenticity', 'content-creation'],
        approved: true
      }
    ],
    llmSettings: {
      primaryModel: 'GPT-4',
      temperature: 0.8,
      maxTokens: 400,
      systemPrompt: 'You are Max Radman, a creative content strategist. Write with energy and authenticity, focusing on storytelling and brand voice. Use relatable examples and conversational tone.'
    },
    metrics: {
      postsGenerated: 32,
      engagementRate: 3.8,
      followers: 6200,
      contentScore: 8.1
    },
    lastUpdated: '2024-01-14'
  }
];

export default function PersonalBrands() {
  const { toast } = useToast();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>(mockWorkspaces[0]);
  const [selectedBrand, setSelectedBrand] = useState<PersonalBrand | null>(mockPersonalBrands[0]);
  const [personalBrands, setPersonalBrands] = useState<PersonalBrand[]>(mockPersonalBrands);
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: '',
    role: '',
    company: '',
    bio: '',
    toneOfVoice: '',
  });

  const workspaceBrands = personalBrands.filter(brand => 
    selectedWorkspace.personalBrands.includes(brand.id)
  );

  const generateContent = (brand: PersonalBrand) => {
    toast({
      title: "Content Generated",
      description: `Generated new LinkedIn post for ${brand.name} using ${brand.llmSettings.primaryModel}`,
    });
  };

  const handleCreateBrand = () => {
    if (!newBrand.name || !newBrand.role || !newBrand.company) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const brand: PersonalBrand = {
      id: newBrand.name.toLowerCase().replace(/\s+/g, '-'),
      name: newBrand.name,
      role: newBrand.role,
      company: newBrand.company,
      avatar: '/api/placeholder/150/150',
      bio: newBrand.bio,
      toneOfVoice: newBrand.toneOfVoice.split(',').map(t => t.trim()).filter(t => t),
      approvedContent: [],
      llmSettings: {
        primaryModel: 'Claude 3.5 Sonnet',
        temperature: 0.7,
        maxTokens: 500,
        systemPrompt: `You are ${newBrand.name}, ${newBrand.role} at ${newBrand.company}. Write in an authentic and engaging tone.`,
      },
      metrics: {
        postsGenerated: 0,
        engagementRate: 0,
        followers: 0,
        contentScore: 0,
      },
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setPersonalBrands([...personalBrands, brand]);
    setSelectedBrand(brand);
    setIsCreatingBrand(false);
    setNewBrand({ name: '', role: '', company: '', bio: '', toneOfVoice: '' });
    
    toast({
      title: "Brand Created",
      description: `Successfully created brand profile for ${brand.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <User className="h-8 w-8 text-primary" />
            <span>Personal Brands</span>
          </h1>
          <p className="text-muted-foreground">
            Manage personal brand profiles and AI-powered content generation
          </p>
        </div>
        <Button onClick={() => setIsCreatingBrand(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Brand
        </Button>
      </div>

      {/* Workspace Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Building className="h-5 w-5 text-muted-foreground" />
            <Select 
              value={selectedWorkspace.id} 
              onValueChange={(value) => {
                const workspace = mockWorkspaces.find(w => w.id === value);
                if (workspace) setSelectedWorkspace(workspace);
              }}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockWorkspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    <div className="flex items-center space-x-2">
                      {workspace.type === 'company' ? (
                        <Building className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>{workspace.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {workspace.personalBrands.length} brands
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{selectedWorkspace.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Brand List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Brand Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workspaceBrands.map((brand) => (
                <div
                  key={brand.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedBrand?.id === brand.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedBrand(brand)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={brand.avatar} alt={brand.name} />
                      <AvatarFallback>{brand.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{brand.name}</p>
                      <p className="text-xs text-muted-foreground">{brand.role}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">{brand.metrics.contentScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Brand Details */}
        <div className="lg:col-span-3">
          {selectedBrand && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Approved Content</TabsTrigger>
                <TabsTrigger value="llm-settings">LLM Settings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedBrand.avatar} alt={selectedBrand.name} />
                        <AvatarFallback>{selectedBrand.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{selectedBrand.name}</CardTitle>
                        <CardDescription>{selectedBrand.role} at {selectedBrand.company}</CardDescription>
                        <p className="text-sm text-muted-foreground mt-2">{selectedBrand.bio}</p>
                      </div>
                      <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Tone of Voice</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBrand.toneOfVoice.map((tone, index) => (
                          <Badge key={index} variant="secondary">
                            {tone}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{selectedBrand.metrics.postsGenerated}</p>
                        <p className="text-xs text-muted-foreground">Posts Generated</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{selectedBrand.metrics.engagementRate}%</p>
                        <p className="text-xs text-muted-foreground">Engagement Rate</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{selectedBrand.metrics.followers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{selectedBrand.metrics.contentScore}</p>
                        <p className="text-xs text-muted-foreground">Content Score</p>
                      </div>
                    </div>

                    <Button onClick={() => generateContent(selectedBrand)} className="w-full">
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Content
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Approved LinkedIn Posts</h3>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Posts
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {selectedBrand.approvedContent.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <p className="text-sm">{post.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{post.engagement} engagements</span>
                              <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="llm-settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>LLM Configuration</CardTitle>
                    <CardDescription>
                      Customize AI model settings for content generation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="model">Primary Model</Label>
                        <Select value={selectedBrand.llmSettings.primaryModel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</SelectItem>
                            <SelectItem value="GPT-4">GPT-4</SelectItem>
                            <SelectItem value="GPT-3.5 Turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="Gemini Pro">Gemini Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="temperature">Temperature: {selectedBrand.llmSettings.temperature}</Label>
                        <Input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          value={selectedBrand.llmSettings.temperature}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input 
                        type="number" 
                        value={selectedBrand.llmSettings.maxTokens}
                        min="100"
                        max="2000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="systemPrompt">System Prompt</Label>
                      <Textarea 
                        value={selectedBrand.llmSettings.systemPrompt}
                        rows={4}
                        placeholder="Define the AI's personality and writing style..."
                      />
                    </div>

                    <Button>
                      <Settings className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg. Engagement Rate</span>
                          <span className="font-medium">{selectedBrand.metrics.engagementRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Posts This Month</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Best Performing Tag</span>
                          <span className="font-medium">b2b-marketing</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Model Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Content Quality Score</span>
                          <span className="font-medium">{selectedBrand.metrics.contentScore}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Model Accuracy</span>
                          <span className="font-medium">94%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tone Consistency</span>
                          <span className="font-medium">91%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Create Brand Dialog */}
      <Dialog open={isCreatingBrand} onOpenChange={setIsCreatingBrand}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Brand</DialogTitle>
            <DialogDescription>
              Set up a new personal brand profile for AI-powered content generation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newBrand.name}
                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role/Title *</Label>
              <Input
                id="role"
                placeholder="e.g., Content Strategist, CEO, Marketing Director"
                value={newBrand.role}
                onChange={(e) => setNewBrand({ ...newBrand, role: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="Company or organization name"
                value={newBrand.company}
                onChange={(e) => setNewBrand({ ...newBrand, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Brief professional bio..."
                value={newBrand.bio}
                onChange={(e) => setNewBrand({ ...newBrand, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toneOfVoice">Tone of Voice (comma-separated)</Label>
              <Input
                id="toneOfVoice"
                placeholder="e.g., Professional, Innovative, Authentic"
                value={newBrand.toneOfVoice}
                onChange={(e) => setNewBrand({ ...newBrand, toneOfVoice: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreatingBrand(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBrand}>
              Create Brand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}