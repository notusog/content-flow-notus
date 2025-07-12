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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ContentCallForm from '@/components/forms/ContentCallForm';
import YouTubeContentForm from '@/components/forms/YouTubeContentForm';
import ContentArchetypeForm from '@/components/forms/ContentArchetypeForm';
import TranscriptContentGenerator from '@/components/forms/TranscriptContentGenerator';
import ContentGenerationForm from '@/components/forms/ContentGenerationForm';
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
  Brain,
  Search,
  Tag,
  Link,
  Video,
  Mic,
  Image,
  Calendar,
  Eye,
  Trash2,
  Sparkles,
  Filter,
  Download,
  Target,
  BarChart,
  BookOpen,
  Lightbulb,
  Rocket
} from 'lucide-react';

// Enhanced interfaces connecting brands to content sources
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
  workspaceId: string;
  clientConnections: ClientConnection[];
  permissions: BrandPermissions;
  strategyDocuments: StrategyDocument[];
  contentLibrary: ContentSource[];
  generatedContent: ContentPiece[];
  contentCalls: ContentCall[];
  youtubeContent: YouTubeContent[];
}

interface ContentCall {
  id: string;
  clientName: string;
  projectName: string;
  projectGoal: string;
  contentArchetype: string;
  targetAudience: string;
  contentGoals: string;
  ideas: ContentIdea[];
  callNotes: string;
  transcript: string;
  nextSteps: string;
  createdDate: string;
  brandId: string;
}

interface ContentIdea {
  id: string;
  title: string;
  outline: string;
  hook: string;
  questions: string[];
}

interface YouTubeContent {
  id: string;
  title: string;
  client: string;
  episodeNumber: string;
  timeframe: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  rawFootage: string[];
  videoAssets: string[];
  thumbnailOptions: string[];
  titleOptions: string[];
  descriptionOptions: string[];
  vlogOutline: any;
  timestamps: string[];
  songsUsed: string[];
  notes: string;
  socialLinks: any;
  createdDate: string;
  brandId: string;
}

interface ContentSource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'image' | 'document' | 'url' | 'content-call' | 'transcript' | 'youtube-content';
  content: string;
  summary: string;
  tags: string[];
  source: string;
  dateAdded: string;
  brandId: string;
  clientId?: string;
  insights?: string[];
  relatedTopics?: string[];
  contentCallId?: string;
  youtubeContentId?: string;
}

interface ContentPiece {
  id: string;
  title: string;
  content: string;
  platform: string;
  sourceIds: string[];
  tags: string[];
  status: 'draft' | 'ready' | 'published';
  createdDate: string;
  brandId: string;
  clientId?: string;
  contentCallId?: string;
}

interface LinkedInPost {
  id: string;
  content: string;
  engagement: number;
  date: string;
  tags: string[];
  approved: boolean;
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

interface BillingInfo {
  plan: 'free' | 'pro' | 'enterprise';
  monthlyRevenue: number;
  nextBillingDate: string;
}

// Mock content sources for brands
const mockContentSources: ContentSource[] = [
  {
    id: 'cs1',
    title: 'Web3 Industry Report 2024',
    type: 'article',
    content: 'Comprehensive analysis of web3 trends, decentralization patterns, and market adoption rates...',
    summary: 'Deep dive into web3 ecosystem growth and emerging opportunities in decentralized technologies.',
    tags: ['web3', 'blockchain', 'decentralization', 'industry-analysis'],
    source: 'Web3 Research Institute',
    dateAdded: '2024-01-16',
    brandId: 'vicktoria-klich',
    insights: ['DeFi adoption accelerating in Europe', 'Enterprise blockchain integration growing'],
    relatedTopics: ['DeFi', 'Enterprise blockchain', 'Regulatory frameworks']
  },
  {
    id: 'cs2',
    title: 'B2B Content Strategy Masterclass',
    type: 'video',
    content: 'Expert strategies for building thought leadership through strategic content marketing...',
    summary: '45-minute masterclass on creating compelling B2B content that drives engagement and leads.',
    tags: ['b2b-marketing', 'content-strategy', 'thought-leadership', 'lead-generation'],
    source: 'Marketing Excellence Summit',
    dateAdded: '2024-01-15',
    brandId: 'marvin-sangines',
    clientId: 'techcorp-client',
    insights: ['Personalization increases conversion by 40%', 'Video content performs 5x better'],
    relatedTopics: ['Marketing automation', 'Lead nurturing', 'Content personalization']
  }
];

// Enhanced mock data with content integration
const mockPersonalBrands: PersonalBrand[] = [
  {
    id: 'marvin-sangines',
    name: 'Marvin Sangines',
    role: 'Personal Brand Strategist & Content Expert',
    company: 'Personal Brand Consultancy',
    avatar: '/api/placeholder/150/150',
    bio: 'Helping B2B founders become thought leaders | Personal brand strategist | Content systems expert | Building content frameworks that scale',
    toneOfVoice: ['Strategic', 'Thought-leadership', 'Practical', 'Insightful', 'Direct'],
    workspaceId: 'marvin-workspace',
    clientConnections: [
      {
        clientId: 'b2b-clients',
        clientName: 'B2B Founder Clients',
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
      maxClientsAllowed: 15
    },
    strategyDocuments: [
      {
        id: 'ms-icp-1',
        type: 'icp',
        title: 'B2B Founder ICP',
        content: { 
          demographics: 'B2B founders, CEOs, startup executives aged 28-50',
          psychographics: 'Growth-minded, strategic thinkers, visibility-focused',
          painPoints: 'Limited time for content creation, unclear personal brand strategy',
          goals: 'Build thought leadership, generate qualified leads, establish market authority'
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-16'
      }
    ],
    contentLibrary: mockContentSources.filter(s => s.brandId === 'marvin-sangines'),
    generatedContent: [],
    approvedContent: [],
    llmSettings: {
      primaryModel: 'Claude 3.5 Sonnet',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: 'You are Marvin Sangines, a personal brand strategist helping B2B founders build thought leadership. Write with strategic insight about personal branding, content creation, and founder communication. Be practical and direct while sharing valuable frameworks.'
    },
    metrics: {
      postsGenerated: 0,
      engagementRate: 0,
      followers: 0,
      contentScore: 0
    },
    lastUpdated: '2024-01-16',
    contentCalls: [],
    youtubeContent: []
  },
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
        content: { 
          demographics: 'Tech founders, CTOs, Web3 enthusiasts aged 25-45',
          psychographics: 'Innovation-driven, early adopters, future-focused',
          painPoints: 'Understanding complex web3 concepts, finding practical applications',
          goals: 'Build decentralized solutions, stay ahead of tech trends'
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-16'
      },
      {
        id: 'vk-brand-1',
        type: 'brand-guidelines',
        title: 'w3.group Brand Voice',
        content: { 
          voice: 'Educational yet passionate',
          tone: 'Accessible expertise with vision',
          style: 'Future-focused storytelling',
          contentPillars: ['Web3 Education', 'Industry Insights', 'Technical Trends', 'Vision & Future']
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-16'
      }
    ],
    contentLibrary: mockContentSources.filter(s => s.brandId === 'vicktoria-klich'),
    generatedContent: [],
    approvedContent: [
      {
        id: 'vk1',
        content: 'Web3 isn\'t just about crypto. It\'s about reimagining how we interact, own, and create value online. At w3.group, we\'re building the infrastructure for this new internet. The future is decentralized, and it\'s happening now.',
        engagement: 2100,
        date: '2024-01-16',
        tags: ['web3', 'decentralization', 'innovation', 'future-tech'],
        approved: true
      }
    ],
    llmSettings: {
      primaryModel: 'Claude 3.5 Sonnet',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: 'You are Vicktoria Klich, co-founder of w3.group and web3 thought leader. Write with passion about web3, decentralization, and digital innovation. Make complex concepts accessible and always connect to real-world impact. Use an innovative yet educational tone.'
    },
    metrics: {
      postsGenerated: 28,
      engagementRate: 6.8,
      followers: 20406,
      contentScore: 9.2
    },
    lastUpdated: '2024-01-16',
    contentCalls: [],
    youtubeContent: []
  }
];

const mockWorkspaces: Workspace[] = [
  {
    id: 'marvin-workspace',
    name: 'Marvin Sangines Consultancy',
    type: 'personal',
    members: [
      { userId: 'marvin-sangines', name: 'Marvin Sangines', email: 'marvin@personalbrand.com', role: 'owner', permissions: ['all'], joinedAt: '2024-01-01' }
    ],
    personalBrands: ['marvin-sangines'],
    clients: [
      {
        id: 'b2b-clients',
        name: 'B2B Founder Clients',
        industry: 'SaaS/B2B',
        size: 'small',
        status: 'active',
        assignedBrands: ['marvin-sangines'],
        contractValue: 15000,
        startDate: '2024-01-01',
        primaryContact: { name: 'Marvin Sangines', email: 'marvin@personalbrand.com', role: 'Consultant' }
      }
    ],
    description: 'Personal brand consultancy specializing in B2B thought leadership',
    settings: {
      defaultBrandPermissions: { canCreateContent: true, canPublishContent: true, canAccessAnalytics: true, canManageClients: true, maxClientsAllowed: 15 },
      contentApprovalRequired: true,
      clientAccessLevel: 'full',
      brandingCustomization: true
    },
    billing: { plan: 'pro', monthlyRevenue: 15000, nextBillingDate: '2024-02-01' }
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

export default function PersonalBrands() {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>(mockWorkspaces[0]);
  const [selectedBrand, setSelectedBrand] = useState<PersonalBrand | null>(mockPersonalBrands[0]);
  const [personalBrands, setPersonalBrands] = useState<PersonalBrand[]>(mockPersonalBrands);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [isAddingContentCall, setIsAddingContentCall] = useState(false);
  const [isAddingYouTubeContent, setIsAddingYouTubeContent] = useState(false);
  const [isCreatingArchetype, setIsCreatingArchetype] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  // Content generation with strategic context
  const generateContent = (brand: PersonalBrand, sourceIds?: string[]) => {
    const clientContext = brand.clientConnections.find(c => c.status === 'active');
    const strategyDoc = brand.strategyDocuments.find(d => d.type === 'content-archetype');
    const selectedSources = sourceIds ? brand.contentLibrary.filter(s => sourceIds.includes(s.id)) : [];
    
    const newContent: ContentPiece = {
      id: `content-${Date.now()}`,
      title: `AI-Generated Post - ${brand.name}`,
      content: generateSmartContent(brand, clientContext, strategyDoc, selectedSources),
      platform: 'LinkedIn',
      sourceIds: sourceIds || [],
      tags: extractTagsFromBrand(brand, selectedSources),
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      brandId: brand.id,
      clientId: clientContext?.clientId
    };

    // Update brand with new generated content
    const updatedBrand = {
      ...brand,
      generatedContent: [...brand.generatedContent, newContent],
      metrics: {
        ...brand.metrics,
        postsGenerated: brand.metrics.postsGenerated + 1
      }
    };

    setPersonalBrands(prev => prev.map(b => b.id === brand.id ? updatedBrand : b));
    
    toast({
      title: "Content Generated",
      description: `Generated new ${newContent.platform} post using ${brand.llmSettings.primaryModel}`,
    });
  };

  const generateSmartContent = (brand: PersonalBrand, client?: ClientConnection, strategy?: StrategyDocument, sources?: ContentSource[]) => {
    const toneWords = brand.toneOfVoice.join(', ').toLowerCase();
    const clientContext = client ? `for ${client.clientName}` : 'for personal brand';
    const sourceContext = sources && sources.length > 0 ? 
      `Based on recent insights from ${sources.map(s => s.title).join(', ')}: ` : '';
    
    // AI-simulated content generation with strategy integration
    const contentTemplates = {
      'web3': [
        `${sourceContext}Web3 isn't just technology - it's a paradigm shift in how we think about digital ownership. Here's what I'm seeing in the industry right now...`,
        `${sourceContext}After years building in web3, one thing is clear: the future belongs to those who understand both the tech AND the human element. ${clientContext}...`,
        `${sourceContext}The biggest misconception about web3? That it's only about crypto. Actually, it's about giving people control of their digital lives...`
      ],
      'b2b': [
        `${sourceContext}Just analyzed the latest B2B trends ${clientContext}. Here's what the top performers do differently...`,
        `${sourceContext}Content strategy mistake I see everywhere: focusing on quantity over quality. Here's how to fix it...`,
        `${sourceContext}The best B2B content doesn't sell - it solves problems. Here's a framework that actually works...`
      ],
      'leadership': [
        `${sourceContext}Leadership isn't about having all the answers - it's about asking the right questions...`,
        `${sourceContext}Building teams taught me this: culture beats strategy every time. Here's why...`,
        `${sourceContext}The hardest part of leadership? Knowing when to pivot. Here's how I learned to recognize the signs...`
      ]
    };

    const brandType = brand.bio.toLowerCase().includes('web3') ? 'web3' : 
                     brand.bio.toLowerCase().includes('b2b') ? 'b2b' : 'leadership';
    
    const templates = contentTemplates[brandType] || contentTemplates['leadership'];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const extractTagsFromBrand = (brand: PersonalBrand, sources?: ContentSource[]) => {
    const baseTags = brand.toneOfVoice.map(t => t.toLowerCase().replace(/\s+/g, '-'));
    const sourceTags = sources ? sources.flatMap(s => s.tags).slice(0, 3) : [];
    const industryTags = brand.company.toLowerCase().includes('web3') ? ['web3', 'blockchain'] :
                        brand.company.toLowerCase().includes('saas') ? ['saas', 'software'] :
                        ['business', 'leadership'];
    return [...new Set([...baseTags, ...sourceTags, ...industryTags])].slice(0, 5);
  };

  const addContentSource = (sourceData: Partial<ContentSource>) => {
    if (!selectedBrand) return;

    const newSource: ContentSource = {
      id: `source-${Date.now()}`,
      title: sourceData.title || '',
      type: sourceData.type || 'article',
      content: sourceData.content || '',
      summary: sourceData.summary || '',
      tags: sourceData.tags || [],
      source: sourceData.source || '',
      dateAdded: new Date().toISOString().split('T')[0],
      brandId: selectedBrand.id,
      clientId: sourceData.clientId,
      insights: [],
      relatedTopics: []
    };

    const updatedBrand = {
      ...selectedBrand,
      contentLibrary: [...selectedBrand.contentLibrary, newSource]
    };

    setPersonalBrands(prev => prev.map(b => b.id === selectedBrand.id ? updatedBrand : b));
    setIsAddingSource(false);
    
    toast({
      title: "Source Added",
      description: "New content source added to brand library",
    });
  };

  const addContentCall = (callData: any) => {
    if (!selectedBrand) return;

    const newCall: ContentCall = {
      id: `call-${Date.now()}`,
      ...callData,
      createdDate: new Date().toISOString().split('T')[0],
      brandId: selectedBrand.id
    };

    // Also create content sources from transcript and notes
    const sources: ContentSource[] = [];
    
    if (callData.transcript) {
      sources.push({
        id: `transcript-${Date.now()}`,
        title: `${callData.clientName} - Call Transcript`,
        type: 'transcript',
        content: callData.transcript,
        summary: `Transcript from content call with ${callData.clientName}`,
        tags: ['transcript', 'content-call', callData.clientName.toLowerCase().replace(/\s+/g, '-')],
        source: 'Content Call',
        dateAdded: new Date().toISOString().split('T')[0],
        brandId: selectedBrand.id,
        contentCallId: newCall.id,
        insights: callData.ideas.map((idea: any) => idea.title),
        relatedTopics: callData.ideas.flatMap((idea: any) => idea.questions)
      });
    }

    if (callData.callNotes) {
      sources.push({
        id: `notes-${Date.now()}`,
        title: `${callData.clientName} - Call Notes`,
        type: 'content-call',
        content: callData.callNotes,
        summary: `Detailed notes from content strategy call`,
        tags: ['notes', 'content-call', callData.clientName.toLowerCase().replace(/\s+/g, '-')],
        source: 'Content Call',
        dateAdded: new Date().toISOString().split('T')[0],
        brandId: selectedBrand.id,
        contentCallId: newCall.id,
        insights: [],
        relatedTopics: []
      });
    }

    const updatedBrand = {
      ...selectedBrand,
      contentCalls: [...selectedBrand.contentCalls, newCall],
      contentLibrary: [...selectedBrand.contentLibrary, ...sources]
    };

    setPersonalBrands(prev => prev.map(b => b.id === selectedBrand.id ? updatedBrand : b));
    setIsAddingContentCall(false);
    
    toast({
      title: "Content Call Saved",
      description: `Added content call with ${sources.length} new sources to brand library`,
    });
  };

  const addYouTubeContent = (youtubeData: any) => {
    if (!selectedBrand) return;

    const newYouTubeContent: YouTubeContent = {
      id: `youtube-${Date.now()}`,
      ...youtubeData,
      createdDate: new Date().toISOString().split('T')[0],
      brandId: selectedBrand.id
    };

    // Create content source from YouTube content for reference
    const youtubeSource: ContentSource = {
      id: `youtube-source-${Date.now()}`,
      title: `${youtubeData.title} - YouTube Production`,
      type: 'youtube-content',
      content: `Episode: ${youtubeData.episodeNumber}\nGoal: ${youtubeData.vlogOutline.goal}\n\nOutline:\n${JSON.stringify(youtubeData.vlogOutline, null, 2)}`,
      summary: `YouTube content production for ${youtubeData.client}`,
      tags: ['youtube', 'video-content', youtubeData.client.toLowerCase().replace(/\s+/g, '-')],
      source: 'YouTube Production',
      dateAdded: new Date().toISOString().split('T')[0],
      brandId: selectedBrand.id,
      youtubeContentId: newYouTubeContent.id,
      insights: youtubeData.titleOptions,
      relatedTopics: youtubeData.vlogOutline.mainStory.events
    };

    const updatedBrand = {
      ...selectedBrand,
      youtubeContent: [...selectedBrand.youtubeContent, newYouTubeContent],
      contentLibrary: [...selectedBrand.contentLibrary, youtubeSource]
    };

    setPersonalBrands(prev => prev.map(b => b.id === selectedBrand.id ? updatedBrand : b));
    setIsAddingYouTubeContent(false);
    
    toast({
      title: "YouTube Content Created",
      description: `Added ${youtubeData.title} with production assets and outline`,
    });
  };

  const addContentArchetype = (archetypeData: any) => {
    if (!selectedBrand) return;

    const newArchetype: StrategyDocument = {
      id: `archetype-${Date.now()}`,
      type: 'content-archetype',
      title: `Content Archetype - ${new Date().toLocaleDateString()}`,
      content: archetypeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedBrand = {
      ...selectedBrand,
      strategyDocuments: [...selectedBrand.strategyDocuments, newArchetype]
    };

    setPersonalBrands(prev => prev.map(b => b.id === selectedBrand.id ? updatedBrand : b));
    setIsCreatingArchetype(false);
    
    toast({
      title: "Content Archetype Created",
      description: "New content archetype added to brand strategy documents",
    });
  };

  const generateContentWithTranscript = (contentData: { content: string; metadata: any }) => {
    if (!selectedBrand) return;

    const newContent: ContentPiece = {
      id: `transcript-content-${Date.now()}`,
      title: `AI Generated ${contentData.metadata.contentType} - ${contentData.metadata.platform}`,
      content: contentData.content,
      platform: contentData.metadata.platform,
      sourceIds: [],
      tags: [contentData.metadata.tone, contentData.metadata.platform.toLowerCase(), 'ai-generated'],
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      brandId: selectedBrand.id
    };

    const updatedBrand = {
      ...selectedBrand,
      generatedContent: [...selectedBrand.generatedContent, newContent],
      metrics: {
        ...selectedBrand.metrics,
        postsGenerated: selectedBrand.metrics.postsGenerated + 1
      }
    };

    setPersonalBrands(prev => prev.map(b => b.id === selectedBrand.id ? updatedBrand : b));
    setIsGeneratingContent(false);
    
    toast({
      title: "Content Generated",
      description: `Generated ${contentData.metadata.contentType} for ${contentData.metadata.platform}`,
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
      toneOfVoice: newBrand.toneOfVoice.split(',').map(t => t.trim()),
      workspaceId: selectedWorkspace.id,
      clientConnections: [],
      permissions: selectedWorkspace.settings.defaultBrandPermissions,
      strategyDocuments: [],
      contentLibrary: [],
      generatedContent: [],
      approvedContent: [],
      contentCalls: [],
      youtubeContent: [],
      llmSettings: {
        primaryModel: 'Claude 3.5 Sonnet',
        temperature: 0.7,
        maxTokens: 500,
        systemPrompt: `You are ${newBrand.name}, ${newBrand.role} at ${newBrand.company}.`
      },
      metrics: {
        postsGenerated: 0,
        engagementRate: 0,
        followers: 0,
        contentScore: 0
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setPersonalBrands([...personalBrands, brand]);
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

  // Filter content sources
  const filteredSources = selectedBrand?.contentLibrary.filter(source => {
    const matchesSearch = searchQuery === '' || 
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => source.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  }) || [];

  const allTags = selectedBrand ? Array.from(new Set(selectedBrand.contentLibrary.flatMap(s => s.tags))) : [];

  const typeIcons = {
    article: FileText,
    video: Video,
    audio: Mic,
    image: Image,
    document: FileText,
    url: Link
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Brain className="h-8 w-8 text-primary" />
            <span>Personal Brand Studio</span>
          </h1>
          <p className="text-muted-foreground">
            AI-powered brand management with integrated content strategy
          </p>
        </div>
        <Button onClick={() => setIsCreatingBrand(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Brand
        </Button>
      </div>

      {/* Workspace Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{selectedWorkspace.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedWorkspace.personalBrands.length} brands • {selectedWorkspace.clients.length} clients
                </p>
              </div>
            </div>
            <Badge variant="outline">{selectedWorkspace.billing.plan}</Badge>
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
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedBrand?.id === brand.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-muted-foreground/20'
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
                      <p className="text-xs text-muted-foreground truncate">{brand.role}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-primary font-medium">
                          {brand.metrics.contentScore}/10
                        </span>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(brand.metrics.contentScore/2) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {selectedBrand && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content-engine">Content Engine</TabsTrigger>
                <TabsTrigger value="strategy">Strategy</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={selectedBrand.avatar} alt={selectedBrand.name} />
                          <AvatarFallback>{selectedBrand.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{selectedBrand.name}</CardTitle>
                          <CardDescription className="text-base">{selectedBrand.role} at {selectedBrand.company}</CardDescription>
                          <p className="text-sm text-muted-foreground mt-2">{selectedBrand.bio}</p>
                        </div>
                      </div>
                      <Button onClick={() => generateContent(selectedBrand)}>
                        <Zap className="mr-2 h-4 w-4" />
                        Generate Content
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Tone of Voice</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBrand.toneOfVoice.map((tone, index) => (
                          <Badge key={index} variant="secondary">{tone}</Badge>
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Engine Tab */}
              <TabsContent value="content-engine" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Content Engine</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered content generation using your knowledge base and strategy
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => setIsGeneratingContent(true)}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with AI
                    </Button>
                    <Button onClick={() => setIsCreatingArchetype(true)} variant="outline">
                      <Target className="mr-2 h-4 w-4" />
                      Content Archetype
                    </Button>
                    <Button onClick={() => setIsAddingYouTubeContent(true)} variant="outline">
                      <Video className="mr-2 h-4 w-4" />
                      YouTube Content
                    </Button>
                    <Button onClick={() => setIsAddingContentCall(true)} variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Content Call
                    </Button>
                    <Button onClick={() => setIsAddingSource(true)} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Source
                    </Button>
                  </div>
                </div>

                {/* Search and Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search knowledge base..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {allTags.slice(0, 4).map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={() => {
                                setSelectedTags(prev =>
                                  prev.includes(tag)
                                    ? prev.filter(t => t !== tag)
                                    : [...prev, tag]
                                );
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="sources" className="w-full">
                  <TabsList>
                    <TabsTrigger value="sources">Knowledge Base ({filteredSources.length})</TabsTrigger>
                    <TabsTrigger value="generated">Generated Content ({selectedBrand.generatedContent.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sources" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredSources.map((source) => {
                        const TypeIcon = typeIcons[source.type];
                        return (
                          <Card key={source.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                  <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                  <Badge variant="outline" className="capitalize text-xs">
                                    {source.type}
                                  </Badge>
                                </div>
                                  <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => setIsGenerateOpen(true)}
                                      >
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Generate
                                      </Button>
                                    </DialogTrigger>
                                  </Dialog>
                              </div>
                              <CardTitle className="text-lg">{source.title}</CardTitle>
                              <CardDescription className="text-sm">
                                {source.summary}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex flex-wrap gap-1">
                                {source.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    <Tag className="h-2 w-2 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              {source.insights && source.insights.length > 0 && (
                                <div className="space-y-1">
                                  <Label className="text-xs font-medium text-muted-foreground">Key Insights:</Label>
                                  {source.insights.slice(0, 2).map((insight, index) => (
                                    <p key={index} className="text-xs text-muted-foreground">• {insight}</p>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {new Date(source.dateAdded).toLocaleDateString()}
                                </div>
                                <span className="text-xs text-muted-foreground">{source.source}</span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="generated" className="space-y-4">
                    <div className="space-y-4">
                      {selectedBrand.generatedContent.map((content) => (
                        <Card key={content.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{content.title}</CardTitle>
                                <CardDescription>
                                  For {content.platform} • Created {new Date(content.createdDate).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                                {content.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm">{content.content}</p>
                            <div className="flex flex-wrap gap-1">
                              {content.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-xs text-muted-foreground">
                                Based on {content.sourceIds.length} source(s)
                              </span>
                              <div className="space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm">
                                  <Rocket className="h-3 w-3 mr-1" />
                                  Approve & Publish
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Strategy Tab */}
              <TabsContent value="strategy" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBrand.strategyDocuments.map((doc) => (
                    <Card key={doc.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          {doc.type === 'icp' && <Target className="h-5 w-5 text-blue-500" />}
                          {doc.type === 'brand-guidelines' && <BookOpen className="h-5 w-5 text-green-500" />}
                          {doc.type === 'content-archetype' && <Lightbulb className="h-5 w-5 text-yellow-500" />}
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(doc.content).map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                              <p className="text-sm text-muted-foreground">{String(value)}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Content Score</span>
                          <span className="font-medium">{selectedBrand.metrics.contentScore}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Engagement Rate</span>
                          <span className="font-medium">{selectedBrand.metrics.engagementRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Posts Generated</span>
                          <span className="font-medium">{selectedBrand.metrics.postsGenerated}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Content Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span>Knowledge Base:</span>
                          <span className="float-right font-medium">{selectedBrand.contentLibrary.length} sources</span>
                        </div>
                        <div className="text-sm">
                          <span>Generated:</span>
                          <span className="float-right font-medium">{selectedBrand.generatedContent.length} posts</span>
                        </div>
                        <div className="text-sm">
                          <span>Approved:</span>
                          <span className="float-right font-medium">{selectedBrand.approvedContent.length} posts</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Client Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedBrand.clientConnections.map((client, index) => (
                          <div key={index} className="text-sm">
                            <span>{client.clientName}</span>
                            <Badge variant="outline" className="float-right text-xs">
                              {client.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
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
            </Tabs>
          )}
        </div>
      </div>

      {/* Create Brand Dialog */}
      <Dialog open={isCreatingBrand} onOpenChange={setIsCreatingBrand}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Personal Brand</DialogTitle>
            <DialogDescription>
              Set up a new AI-powered personal brand profile
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={newBrand.role}
                  onChange={(e) => setNewBrand(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Content Strategist"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={newBrand.company}
                onChange={(e) => setNewBrand(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Acme Inc"
                required
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={newBrand.bio}
                onChange={(e) => setNewBrand(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Describe your expertise and mission..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="toneOfVoice">Tone of Voice & LinkedIn Posts</Label>
              <Textarea
                id="toneOfVoice"
                value={newBrand.toneOfVoice}
                onChange={(e) => setNewBrand(prev => ({ ...prev, toneOfVoice: e.target.value }))}
                placeholder="Describe tone or paste LinkedIn posts to analyze tone..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste LinkedIn posts here to automatically analyze tone patterns, or describe the desired tone of voice
              </p>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCreateBrand}>
                Create Brand
              </Button>
              <Button variant="outline" onClick={() => setIsCreatingBrand(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Source Dialog */}
      <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Content Source</DialogTitle>
            <DialogDescription>
              Add articles, videos, podcasts, or other content to your knowledge base
            </DialogDescription>
          </DialogHeader>
          <AddSourceForm onSubmit={addContentSource} onCancel={() => setIsAddingSource(false)} />
        </DialogContent>
      </Dialog>

      {/* Content Call Dialog */}
      <Dialog open={isAddingContentCall} onOpenChange={setIsAddingContentCall}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Call Preparation & Analysis</DialogTitle>
            <DialogDescription>
              Comprehensive content creation workflow from call prep to analysis
            </DialogDescription>
          </DialogHeader>
          <ContentCallForm onSubmit={addContentCall} onCancel={() => setIsAddingContentCall(false)} />
        </DialogContent>
      </Dialog>

      {/* YouTube Content Dialog */}
      <Dialog open={isAddingYouTubeContent} onOpenChange={setIsAddingYouTubeContent}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>YouTube Content Production</DialogTitle>
            <DialogDescription>
              Complete YouTube vlog workflow - Charles & Charlotte style
            </DialogDescription>
          </DialogHeader>
          <YouTubeContentForm onSubmit={addYouTubeContent} onCancel={() => setIsAddingYouTubeContent(false)} />
        </DialogContent>
      </Dialog>

      {/* Content Archetype Dialog */}
      <Dialog open={isCreatingArchetype} onOpenChange={setIsCreatingArchetype}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Archetype Generator</DialogTitle>
            <DialogDescription>
              Create a comprehensive content strategy framework for this brand
            </DialogDescription>
          </DialogHeader>
          <ContentArchetypeForm 
            onSubmit={addContentArchetype} 
            onCancel={() => setIsCreatingArchetype(false)}
            clientName={selectedBrand?.name}
          />
        </DialogContent>
      </Dialog>

      {/* AI Content Generator Dialog */}
      <Dialog open={isGeneratingContent} onOpenChange={setIsGeneratingContent}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Content Generator</DialogTitle>
            <DialogDescription>
              Generate content using prompts and transcripts with your brand archetype
            </DialogDescription>
          </DialogHeader>
          <TranscriptContentGenerator 
            onSubmit={generateContentWithTranscript} 
            onCancel={() => setIsGeneratingContent(false)}
            brandName={selectedBrand?.name}
            contentArchetype={selectedBrand?.strategyDocuments.find(d => d.type === 'content-archetype')?.content?.generatedArchetype}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add Source Form Component
function AddSourceForm({ onSubmit, onCancel }: { onSubmit: (data: Partial<ContentSource>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'article' as ContentSource['type'],
    content: '',
    summary: '',
    tags: '',
    source: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value: ContentSource['type']) => 
            setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio/Podcast</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="url">URL/Link</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          value={formData.source}
          onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
          placeholder="Website, Publication, etc."
        />
      </div>
      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          placeholder="Brief description of the content..."
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Full content or key excerpts..."
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="web3, blockchain, marketing"
        />
      </div>
      <div className="flex space-x-2 pt-4">
        <Button type="submit">
          Add Source
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}