import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus,
  Download,
  FileText,
  Image,
  BarChart3,
  Eye,
  Edit,
  Copy,
  Share,
  TrendingUp,
  Users,
  Calendar,
  ExternalLink,
  Settings,
  Zap,
  Target,
  Mail,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeadMagnet {
  id: string;
  title: string;
  type: 'pdf' | 'checklist' | 'template' | 'guide' | 'calculator';
  description: string;
  status: 'draft' | 'published' | 'archived';
  createdDate: string;
  client: string;
  landingPageUrl: string;
  downloadCount: number;
  conversionRate: number;
  leadCount: number;
  thumbnail: string;
}

interface LeadMagnetForm {
  title: string;
  type: 'pdf' | 'checklist' | 'template' | 'guide' | 'calculator';
  description: string;
  client: string;
  content: string;
  landingPageTitle: string;
  landingPageDescription: string;
}

const sampleLeadMagnets: LeadMagnet[] = [
  {
    id: '1',
    title: 'The Ultimate Content Audit Checklist',
    type: 'checklist',
    description: 'A comprehensive 25-point checklist to audit your content strategy',
    status: 'published',
    createdDate: '2024-01-10',
    client: 'TechCorp',
    landingPageUrl: '/magnets/content-audit-checklist',
    downloadCount: 342,
    conversionRate: 24.5,
    leadCount: 84,
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&crop=top'
  },
  {
    id: '2',
    title: 'B2B Content Strategy Templates',
    type: 'template',
    description: 'Ready-to-use templates for planning your content strategy',
    status: 'published',
    createdDate: '2024-01-08',
    client: 'SaaS Startup',
    landingPageUrl: '/magnets/content-strategy-templates',
    downloadCount: 189,
    conversionRate: 31.2,
    leadCount: 59,
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&crop=top'
  },
  {
    id: '3',
    title: 'ROI Calculator for Content Marketing',
    type: 'calculator',
    description: 'Calculate the true ROI of your content marketing efforts',
    status: 'published',
    createdDate: '2024-01-05',
    client: 'Growth Agency',
    landingPageUrl: '/magnets/roi-calculator',
    downloadCount: 156,
    conversionRate: 41.8,
    leadCount: 65,
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=top'
  },
  {
    id: '4',
    title: 'LinkedIn Content Strategy Guide',
    type: 'guide',
    description: '30-page comprehensive guide to LinkedIn content success',
    status: 'draft',
    createdDate: '2024-01-12',
    client: 'Enterprise Co',
    landingPageUrl: '/magnets/linkedin-guide',
    downloadCount: 0,
    conversionRate: 0,
    leadCount: 0,
    thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop&crop=top'
  }
];

const magnetTypeIcons = {
  pdf: FileText,
  checklist: Target,
  template: Copy,
  guide: FileText,
  calculator: BarChart3
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700'
};

export default function LeadMagnets() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMagnet, setNewMagnet] = useState<LeadMagnetForm>({
    title: '',
    type: 'checklist',
    description: '',
    client: '',
    content: '',
    landingPageTitle: '',
    landingPageDescription: ''
  });
  const { toast } = useToast();

  const handleCreateMagnet = () => {
    toast({
      title: "Lead Magnet Created",
      description: `${newMagnet.title} has been created successfully.`,
    });
    setIsCreateDialogOpen(false);
    setNewMagnet({
      title: '',
      type: 'checklist',
      description: '',
      client: '',
      content: '',
      landingPageTitle: '',
      landingPageDescription: ''
    });
  };

  const totalDownloads = sampleLeadMagnets.reduce((acc, magnet) => acc + magnet.downloadCount, 0);
  const totalLeads = sampleLeadMagnets.reduce((acc, magnet) => acc + magnet.leadCount, 0);
  const avgConversionRate = sampleLeadMagnets.reduce((acc, magnet) => acc + magnet.conversionRate, 0) / sampleLeadMagnets.length;
  const publishedMagnets = sampleLeadMagnets.filter(m => m.status === 'published').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Magnets</h1>
          <p className="text-muted-foreground">
            Create and manage downloadable content to capture qualified leads
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="smooth-transition">
              <Plus className="mr-2 h-4 w-4" />
              Create Lead Magnet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Lead Magnet</DialogTitle>
              <DialogDescription>
                Design a compelling lead magnet to capture and convert prospects
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="The Ultimate Content Strategy Checklist"
                    value={newMagnet.title}
                    onChange={(e) => setNewMagnet(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select 
                    value={newMagnet.type} 
                    onChange={(e) => setNewMagnet(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
                  >
                    <option value="checklist">Checklist</option>
                    <option value="template">Template</option>
                    <option value="guide">Guide</option>
                    <option value="pdf">PDF Report</option>
                    <option value="calculator">Calculator</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A comprehensive checklist to audit and improve your content strategy..."
                  value={newMagnet.description}
                  onChange={(e) => setNewMagnet(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <select 
                  value={newMagnet.client} 
                  onChange={(e) => setNewMagnet(prev => ({ ...prev, client: e.target.value }))}
                  className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
                >
                  <option value="">Select client</option>
                  <option value="TechCorp">TechCorp</option>
                  <option value="SaaS Startup">SaaS Startup</option>
                  <option value="Growth Agency">Growth Agency</option>
                  <option value="Enterprise Co">Enterprise Co</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content Outline</Label>
                <Textarea
                  id="content"
                  placeholder="1. Content audit basics&#10;2. Competitor analysis&#10;3. Performance metrics..."
                  value={newMagnet.content}
                  onChange={(e) => setNewMagnet(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Landing Page Settings</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="landingTitle">Landing Page Title</Label>
                    <Input
                      id="landingTitle"
                      placeholder="Download Your Free Content Strategy Checklist"
                      value={newMagnet.landingPageTitle}
                      onChange={(e) => setNewMagnet(prev => ({ ...prev, landingPageTitle: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landingDesc">Landing Page Description</Label>
                    <Textarea
                      id="landingDesc"
                      placeholder="Get instant access to our proven content strategy checklist..."
                      value={newMagnet.landingPageDescription}
                      onChange={(e) => setNewMagnet(prev => ({ ...prev, landingPageDescription: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMagnet}>
                  Create Lead Magnet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Downloads</p>
                <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Leads Generated</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Avg. Conversion</p>
                <p className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Active Magnets</p>
                <p className="text-2xl font-bold">{publishedMagnets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">All Magnets</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleLeadMagnets.map((magnet) => {
              const TypeIcon = magnetTypeIcons[magnet.type];
              
              return (
                <Card key={magnet.id} className="hover:shadow-md smooth-transition">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={magnet.thumbnail} 
                      alt={magnet.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={statusColors[magnet.status]}>
                        {magnet.status}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="p-2 rounded-lg bg-white/90 backdrop-blur-sm">
                        <TypeIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{magnet.title}</CardTitle>
                    <CardDescription>{magnet.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{magnet.client}</span>
                      <span className="text-muted-foreground">{magnet.createdDate}</span>
                    </div>
                    
                    {magnet.status === 'published' && (
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold">{magnet.downloadCount}</p>
                          <p className="text-xs text-muted-foreground">Downloads</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{magnet.conversionRate}%</p>
                          <p className="text-xs text-muted-foreground">Conversion</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{magnet.leadCount}</p>
                          <p className="text-xs text-muted-foreground">Leads</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Download Trends</CardTitle>
                <CardDescription>Downloads over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Interactive chart showing download trends</p>
                    <p className="text-sm">Peak: 47 downloads on Jan 10th</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Magnets</CardTitle>
                <CardDescription>Ranked by conversion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleLeadMagnets
                    .filter(m => m.status === 'published')
                    .sort((a, b) => b.conversionRate - a.conversionRate)
                    .map((magnet, index) => (
                      <div key={magnet.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-bold text-muted-foreground">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{magnet.title}</p>
                            <p className="text-xs text-muted-foreground">{magnet.client}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{magnet.conversionRate}%</p>
                          <p className="text-xs text-muted-foreground">{magnet.downloadCount} downloads</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lead Quality Analysis</CardTitle>
              <CardDescription>Breakdown of leads by source and quality score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">78%</div>
                  <p className="text-sm text-muted-foreground">High Quality Leads</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">4.2</div>
                  <p className="text-sm text-muted-foreground">Avg. Lead Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">23%</div>
                  <p className="text-sm text-muted-foreground">Lead-to-Customer Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landing-pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Manager</CardTitle>
              <CardDescription>
                Manage and optimize your lead magnet landing pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleLeadMagnets.map((magnet) => (
                  <div key={magnet.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={magnet.thumbnail} 
                        alt={magnet.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{magnet.title}</h3>
                        <p className="text-sm text-muted-foreground">{magnet.landingPageUrl}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Conversion: {magnet.conversionRate}%
                          </span>
                          <Badge className={statusColors[magnet.status]}>
                            {magnet.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Marketing</span>
                </CardTitle>
                <CardDescription>
                  Connect with your email marketing platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: 'ConvertKit', status: 'connected', leads: 142 },
                    { name: 'Mailchimp', status: 'available', leads: 0 },
                    { name: 'ActiveCampaign', status: 'available', leads: 0 }
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {integration.status === 'connected' 
                            ? `${integration.leads} leads synced` 
                            : 'Not connected'}
                        </p>
                      </div>
                      <Button size="sm" variant={integration.status === 'connected' ? 'outline' : 'default'}>
                        {integration.status === 'connected' ? 'Settings' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Automation</span>
                </CardTitle>
                <CardDescription>
                  Set up automated workflows for lead nurturing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: 'Welcome Email Sequence', status: 'active', triggers: 89 },
                    { name: 'Lead Scoring Automation', status: 'active', triggers: 156 },
                    { name: 'CRM Sync', status: 'paused', triggers: 0 }
                  ].map((automation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{automation.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {automation.status === 'active' 
                            ? `${automation.triggers} triggers this month` 
                            : 'Currently paused'}
                        </p>
                      </div>
                      <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Automation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}