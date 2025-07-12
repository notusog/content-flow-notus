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
  // Enhanced connection system
  workspaceId: string;
  clientConnections: ClientConnection[];
  permissions: BrandPermissions;
  strategyDocuments: StrategyDocument[];
}

interface ClientConnection {
  clientId: string;
  clientName: string;
  role: 'primary' | 'secondary' | 'consultant';
  permissions: string[];
  dateConnected: string;
  status: 'active' | 'paused' | 'completed';
}

interface BrandPermissions {
  canCreateContent: boolean;
  canPublishContent: boolean;
  canAccessAnalytics: boolean;
  canManageClients: boolean;
  maxClientsAllowed: number;
}

interface StrategyDocument {
  id: string;
  type: 'icp' | 'content-archetype' | 'brand-guidelines' | 'content-calendar';
  title: string;
  content: any;
  clientId?: string;
  createdAt: string;
  updatedAt: string;
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
  type: 'company' | 'personal' | 'agency' | 'enterprise';
  members: WorkspaceMember[];
  personalBrands: string[];
  clients: WorkspaceClient[];
  description: string;
  settings: WorkspaceSettings;
  billing: BillingInfo;
}

interface WorkspaceMember {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'creator' | 'viewer';
  permissions: string[];
  joinedAt: string;
}

interface WorkspaceClient {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'enterprise';
  status: 'active' | 'onboarding' | 'paused' | 'completed';
  assignedBrands: string[];
  contractValue: number;
  startDate: string;
  endDate?: string;
  primaryContact: {
    name: string;
    email: string;
    role: string;
  };
}

interface WorkspaceSettings {
  defaultBrandPermissions: BrandPermissions;
  contentApprovalRequired: boolean;
  clientAccessLevel: 'full' | 'limited' | 'view-only';
  brandingCustomization: boolean;
}

const mockWorkspaces: Workspace[] = [
  {
    id: 'notus-company',
    name: 'Notus Agency',
    type: 'agency',
    members: [
      { userId: 'marvin-sangines', name: 'Marvin Sangines', email: 'marvin@notus.com', role: 'owner', permissions: ['all'], joinedAt: '2024-01-01' },
      { userId: 'max-radman', name: 'Max Radman', email: 'max@notus.com', role: 'manager', permissions: ['content:create', 'content:edit', 'analytics:view'], joinedAt: '2024-01-02' },
      { userId: 'tim-chilling', name: 'Tim Chilling', email: 'tim@notus.com', role: 'creator', permissions: ['content:create'], joinedAt: '2024-01-03' }
    ],
    personalBrands: ['marvin-sangines', 'max-radman'],
    clients: [
      {
        id: 'techcorp-client',
        name: 'TechCorp Solutions',
        industry: 'Technology',
        size: 'enterprise',
        status: 'active',
        assignedBrands: ['marvin-sangines'],
        contractValue: 15000,
        startDate: '2024-01-01',
        primaryContact: { name: 'Sarah Johnson', email: 'sarah@techcorp.com', role: 'Marketing Director' }
      },
      {
        id: 'saas-startup-client',
        name: 'SaaS Growth Co',
        industry: 'Software',
        size: 'startup',
        status: 'active',
        assignedBrands: ['max-radman'],
        contractValue: 8000,
        startDate: '2024-01-15',
        primaryContact: { name: 'Mike Chen', email: 'mike@saasgrowth.com', role: 'CEO' }
      }
    ],
    description: 'Professional content marketing agency serving B2B companies',
    settings: {
      defaultBrandPermissions: { canCreateContent: true, canPublishContent: false, canAccessAnalytics: true, canManageClients: false, maxClientsAllowed: 5 },
      contentApprovalRequired: true,
      clientAccessLevel: 'limited',
      brandingCustomization: true
    },
    billing: { plan: 'pro', monthlyRevenue: 23000, nextBillingDate: '2024-02-01' }
  },
  {
    id: 'w3-group-workspace',
    name: 'w3.group',
    type: 'company',
    members: [
      { userId: 'vicktoria-klich', name: 'Vicktoria Klich', email: 'vicky@w3.group', role: 'owner', permissions: ['all'], joinedAt: '2024-01-01' }
    ],
    personalBrands: ['vicktoria-klich'],
    clients: [
      {
        id: 'web3-clients',
        name: 'Internal Brand Building',
        industry: 'Web3',
        size: 'small',
        status: 'active',
        assignedBrands: ['vicktoria-klich'],
        contractValue: 0,
        startDate: '2024-01-01',
        primaryContact: { name: 'Vicktoria Klich', email: 'vicky@w3.group', role: 'Co-founder' }
      }
    ],
    description: 'Web3 innovation company focused on decentralized solutions',
    settings: {
      defaultBrandPermissions: { canCreateContent: true, canPublishContent: true, canAccessAnalytics: true, canManageClients: true, maxClientsAllowed: 10 },
      contentApprovalRequired: false,
      clientAccessLevel: 'full',
      brandingCustomization: true
    },
    billing: { plan: 'enterprise', monthlyRevenue: 0, nextBillingDate: '2024-02-01' }
  }
];

interface BillingInfo {
  plan: 'free' | 'pro' | 'enterprise';
  monthlyRevenue: number;
  nextBillingDate: string;
}

const mockPersonalBrands: PersonalBrand[] = [
  {
    id: 'vicktoria-klich',
    name: 'Vicktoria Klich',
    role: 'Co-founder & Web3 Expert',
    company: 'w3.group',
    avatar: '/lovable-uploads/76a444dc-5aff-491b-bbfc-670b6193d6c7.png',
    bio: 'Changing the way people think about web3 | Co-founder w3.group | Based in Berlin | Top Voice on LinkedIn with 20,406 followers',
    toneOfVoice: ['Innovative', 'Web3-focused', 'Educational', 'Thought-leadership', 'Accessible'],
    workspaceId: 'w3-group-workspace',
    clientConnections: [
      {
        clientId: 'web3-clients',
        clientName: 'Internal Brand Building',
        role: 'primary',
        permissions: ['content:create', 'content:publish', 'analytics:view'],
        dateConnected: '2024-01-01',
        status: 'active'
      }
    ],
    permissions: {
      canCreateContent: true,
      canPublishContent: true,
      canAccessAnalytics: true,
      canManageClients: true,
      maxClientsAllowed: 10
    },
    strategyDocuments: [
      {
        id: 'vk-icp-1',
        type: 'icp',
        title: 'Web3 Founder ICP',
        content: { demographics: 'Tech founders, CTOs, Web3 enthusiasts', psychographics: 'Innovation-driven, early adopters' },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-16'
      },
      {
        id: 'vk-brand-1',
        type: 'brand-guidelines',
        title: 'w3.group Brand Voice',
        content: { voice: 'Educational yet passionate', tone: 'Accessible expertise', style: 'Future-focused storytelling' },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-16'
      }
    ],
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
    workspaceId: 'notus-company',
    clientConnections: [
      {
        clientId: 'techcorp-client',
        clientName: 'TechCorp Solutions',
        role: 'primary',
        permissions: ['content:create', 'content:edit', 'analytics:view'],
        dateConnected: '2024-01-01',
        status: 'active'
      }
    ],
    permissions: {
      canCreateContent: true,
      canPublishContent: false,
      canAccessAnalytics: true,
      canManageClients: false,
      maxClientsAllowed: 5
    },
    strategyDocuments: [
      {
        id: 'ms-icp-techcorp',
        type: 'icp',
        title: 'TechCorp B2B SaaS ICP',
        content: {
          demographics: 'B2B SaaS founders, Marketing Directors, Growth teams',
          companySize: '50-500 employees',
          painPoints: 'Lead generation, content strategy, thought leadership',
          goals: 'Increase qualified leads, build authority, scale content'
        },
        clientId: 'techcorp-client',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      },
      {
        id: 'ms-archetype-techcorp',
        type: 'content-archetype',
        title: 'TechCorp Content Strategy',
        content: {
          contentPillars: ['Thought Leadership', 'Industry Insights', 'Case Studies', 'Educational Content'],
          formats: ['LinkedIn posts', 'Video content', 'Whitepapers', 'Webinars'],
          frequency: '5 posts/week LinkedIn, 1 video/week, 1 whitepaper/month'
        },
        clientId: 'techcorp-client',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
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
    workspaceId: 'notus-company',
    clientConnections: [
      {
        clientId: 'saas-startup-client',
        clientName: 'SaaS Growth Co',
        role: 'primary',
        permissions: ['content:create', 'content:edit', 'analytics:view'],
        dateConnected: '2024-01-15',
        status: 'active'
      }
    ],
    permissions: {
      canCreateContent: true,
      canPublishContent: false,
      canAccessAnalytics: true,
      canManageClients: false,
      maxClientsAllowed: 3
    },
    strategyDocuments: [
      {
        id: 'mr-brand-saas',
        type: 'brand-guidelines',
        title: 'SaaS Growth Co Brand Voice',
        content: {
          voice: 'Authentic and energetic',
          tone: 'Relatable storytelling',
          style: 'Conversational with creative flair',
          doNots: 'Corporate jargon, overly formal language'
        },
        clientId: 'saas-startup-client',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      }
    ],
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
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<WorkspaceClient | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newBrand, setNewBrand] = useState({
    name: '',
    role: '',
    company: '',
    bio: '',
    toneOfVoice: '',
  });
  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    size: 'small' as 'startup' | 'small' | 'medium' | 'enterprise',
    contactName: '',
    contactEmail: '',
    contactRole: '',
    contractValue: 0,
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
      workspaceId: selectedWorkspace.id,
      clientConnections: [],
      permissions: selectedWorkspace.settings.defaultBrandPermissions,
      strategyDocuments: [],
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
    
    // Update workspace to include new brand
    setWorkspaces(prev => prev.map(w => 
      w.id === selectedWorkspace.id 
        ? { ...w, personalBrands: [...w.personalBrands, brand.id] }
        : w
    ));
    
    setSelectedBrand(brand);
    setIsCreatingBrand(false);
    setNewBrand({ name: '', role: '', company: '', bio: '', toneOfVoice: '' });
    
    toast({
      title: "Brand Created",
      description: `Successfully created brand profile for ${brand.name}`,
    });
  };

  const handleCreateClient = () => {
    if (!newClient.name || !newClient.industry || !newClient.contactName || !newClient.contactEmail) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const client: WorkspaceClient = {
      id: newClient.name.toLowerCase().replace(/\s+/g, '-'),
      name: newClient.name,
      industry: newClient.industry,
      size: newClient.size,
      status: 'onboarding',
      assignedBrands: [],
      contractValue: newClient.contractValue,
      startDate: new Date().toISOString().split('T')[0],
      primaryContact: {
        name: newClient.contactName,
        email: newClient.contactEmail,
        role: newClient.contactRole,
      }
    };

    setWorkspaces(prev => prev.map(w => 
      w.id === selectedWorkspace.id 
        ? { ...w, clients: [...w.clients, client] }
        : w
    ));

    setIsCreatingClient(false);
    setNewClient({ name: '', industry: '', size: 'small', contactName: '', contactEmail: '', contactRole: '', contractValue: 0 });
    
    toast({
      title: "Client Added",
      description: `Successfully added ${client.name} to workspace`,
    });
  };

  const assignBrandToClient = (brandId: string, clientId: string) => {
    setWorkspaces(prev => prev.map(w => 
      w.id === selectedWorkspace.id 
        ? {
            ...w, 
            clients: w.clients.map(c => 
              c.id === clientId 
                ? { ...c, assignedBrands: [...c.assignedBrands, brandId] }
                : c
            )
          }
        : w
    ));

    setPersonalBrands(prev => prev.map(b => 
      b.id === brandId 
        ? {
            ...b,
            clientConnections: [
              ...b.clientConnections,
              {
                clientId,
                clientName: selectedWorkspace.clients.find(c => c.id === clientId)?.name || '',
                role: 'primary',
                permissions: ['content:create', 'content:edit', 'analytics:view'],
                dateConnected: new Date().toISOString().split('T')[0],
                status: 'active'
              }
            ]
          }
        : b
    ));

    toast({
      title: "Brand Assigned",
      description: "Brand successfully assigned to client",
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
        <Button onClick={() => {
          console.log('Create Brand button clicked');
          setIsCreatingBrand(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Brand
        </Button>
      </div>

      {/* Workspace Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Building className="h-5 w-5 text-muted-foreground" />
                <Select 
                  value={selectedWorkspace.id} 
                  onValueChange={(value) => {
                    const workspace = workspaces.find(w => w.id === value);
                    if (workspace) setSelectedWorkspace(workspace);
                  }}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
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
                <div>
                  <p className="text-sm font-medium">{selectedWorkspace.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedWorkspace.clients.length} clients • {selectedWorkspace.members.length} members
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsCreatingClient(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                ${selectedWorkspace.billing.monthlyRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              <Badge variant="outline" className="mt-2">
                {selectedWorkspace.billing.plan}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Create Client Dialog */}
      <Dialog open={isCreatingClient} onOpenChange={setIsCreatingClient}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a new client to your workspace and assign personal brands.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  placeholder="Enter client company name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={newClient.industry}
                  onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Select value={newClient.size} onValueChange={(value: 'startup' | 'small' | 'medium' | 'enterprise') => setNewClient({ ...newClient, size: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-50)</SelectItem>
                    <SelectItem value="small">Small (51-200)</SelectItem>
                    <SelectItem value="medium">Medium (201-1000)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractValue">Monthly Contract Value</Label>
                <Input
                  id="contractValue"
                  type="number"
                  placeholder="0"
                  value={newClient.contractValue}
                  onChange={(e) => setNewClient({ ...newClient, contractValue: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Primary Contact</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="Primary contact name"
                    value={newClient.contactName}
                    onChange={(e) => setNewClient({ ...newClient, contactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@company.com"
                    value={newClient.contactEmail}
                    onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactRole">Contact Role</Label>
                <Input
                  id="contactRole"
                  placeholder="e.g., Marketing Director, CEO"
                  value={newClient.contactRole}
                  onChange={(e) => setNewClient({ ...newClient, contactRole: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreatingClient(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClient}>
              Add Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clients & Strategy Documents Tab */}
      {selectedBrand && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clients">Client Connections</TabsTrigger>
            <TabsTrigger value="strategy">Strategy Documents</TabsTrigger>
            <TabsTrigger value="workspace-clients">Workspace Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connected Clients</CardTitle>
                <CardDescription>
                  Manage client relationships and permissions for {selectedBrand.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBrand.clientConnections.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBrand.clientConnections.map((connection) => (
                      <div key={connection.clientId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{connection.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {connection.role} • Connected {new Date(connection.dateConnected).toLocaleDateString()}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {connection.permissions.map((perm, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{perm}</Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant={connection.status === 'active' ? 'default' : 'secondary'}>
                          {connection.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No client connections yet</p>
                    <p className="text-sm text-muted-foreground">Assign this brand to clients from the workspace tab</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Strategy Documents</h3>
                <p className="text-sm text-muted-foreground">ICP definitions, content archetypes, and brand guidelines</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add ICP
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Archetype
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Guidelines
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {selectedBrand.strategyDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{doc.title}</CardTitle>
                        <CardDescription>
                          {doc.type.toUpperCase()} • Updated {new Date(doc.updatedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.clientId && (
                          <Badge variant="outline" className="text-xs">
                            {selectedBrand.clientConnections.find(c => c.clientId === doc.clientId)?.clientName}
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(doc.content, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {selectedBrand.strategyDocuments.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No strategy documents yet</p>
                    <p className="text-sm text-muted-foreground">Create ICP definitions, content archetypes, and brand guidelines</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="workspace-clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workspace Clients</CardTitle>
                <CardDescription>
                  All clients in {selectedWorkspace.name} workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedWorkspace.clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {client.industry} • {client.size} • ${client.contractValue.toLocaleString()}/mo
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Contact: {client.primaryContact.name} ({client.primaryContact.email})
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                        {client.assignedBrands.includes(selectedBrand.id) ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Assigned
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => assignBrandToClient(selectedBrand.id, client.id)}
                          >
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}