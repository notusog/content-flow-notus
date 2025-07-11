import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Plus, 
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  Send,
  Eye,
  MousePointer,
  UserPlus,
  UserMinus,
  BarChart3,
  Edit,
  Copy,
  Archive,
  Settings,
  Target,
  Zap,
  Globe,
  FileText,
  Image,
  Video
} from 'lucide-react';
import { format } from 'date-fns';

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  template: 'modern' | 'classic' | 'minimal' | 'branded';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledDate?: Date;
  scheduledTime?: string;
  client: string;
  subscribers: number;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    bounced: number;
  };
  segments: string[];
  tags: string[];
}

interface SubscriberList {
  id: string;
  name: string;
  subscribers: number;
  growth: number;
  lastUpdated: Date;
  status: 'active' | 'paused';
  segments: string[];
}

const mockNewsletters: Newsletter[] = [
  {
    id: '1',
    title: 'Weekly Tech Insights',
    subject: '🚀 5 AI Tools That Will Transform Your Workflow',
    content: 'This week we are diving into the latest AI tools that are revolutionizing how we work...',
    template: 'modern',
    status: 'sent',
    client: 'TechCorp',
    subscribers: 15420,
    stats: {
      sent: 15420,
      delivered: 15380,
      opened: 7690,
      clicked: 1540,
      unsubscribed: 23,
      bounced: 40
    },
    segments: ['Tech Enthusiasts', 'Premium Subscribers'],
    tags: ['AI', 'Productivity', 'Tools']
  },
  {
    id: '2',
    title: 'Monthly Business Review',
    subject: 'Q4 Growth Strategies: What\'s Working Now',
    content: 'Our latest analysis reveals the top strategies driving growth this quarter...',
    template: 'classic',
    status: 'scheduled',
    scheduledDate: new Date(2024, 0, 20, 9, 0),
    scheduledTime: '09:00',
    client: 'BusinessPro',
    subscribers: 8900,
    segments: ['Business Leaders', 'Entrepreneurs'],
    tags: ['Business', 'Strategy', 'Growth']
  },
  {
    id: '3',
    title: 'Design Inspiration Weekly',
    subject: 'Fresh Design Trends for 2024',
    content: 'Explore the latest design trends that are shaping the creative industry...',
    template: 'minimal',
    status: 'draft',
    client: 'CreativeStudio',
    subscribers: 12300,
    segments: ['Designers', 'Creative Professionals'],
    tags: ['Design', 'Trends', 'Inspiration']
  }
];

const mockSubscriberLists: SubscriberList[] = [
  {
    id: '1',
    name: 'Tech Enthusiasts',
    subscribers: 15420,
    growth: 12.5,
    lastUpdated: new Date(),
    status: 'active',
    segments: ['Premium', 'Free Trial', 'Enterprise']
  },
  {
    id: '2',
    name: 'Business Leaders',
    subscribers: 8900,
    growth: 8.3,
    lastUpdated: new Date(),
    status: 'active',
    segments: ['C-Suite', 'Managers', 'Entrepreneurs']
  },
  {
    id: '3',
    name: 'Creative Professionals',
    subscribers: 12300,
    growth: 15.7,
    lastUpdated: new Date(),
    status: 'active',
    segments: ['Designers', 'Developers', 'Marketers']
  }
];

const templateTypes = {
  modern: { name: 'Modern', description: 'Clean, contemporary design with bold typography' },
  classic: { name: 'Classic', description: 'Traditional newsletter layout with professional styling' },
  minimal: { name: 'Minimal', description: 'Simplified design focusing on content readability' },
  branded: { name: 'Branded', description: 'Custom template matching your brand identity' }
};

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  sent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

export default function Newsletters() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newsletters] = useState<Newsletter[]>(mockNewsletters);
  const [subscriberLists] = useState<SubscriberList[]>(mockSubscriberLists);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const totalSubscribers = subscriberLists.reduce((sum, list) => sum + list.subscribers, 0);
  const averageOpenRate = newsletters.filter(n => n.stats).reduce((sum, n) => {
    if (n.stats) return sum + (n.stats.opened / n.stats.sent * 100);
    return sum;
  }, 0) / newsletters.filter(n => n.stats).length || 0;

  const totalSent = newsletters.reduce((sum, n) => sum + (n.stats?.sent || 0), 0);
  const totalClicks = newsletters.reduce((sum, n) => sum + (n.stats?.clicked || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Newsletter Management</h1>
            <p className="text-muted-foreground">Create, schedule, and analyze email campaigns</p>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Newsletter</DialogTitle>
              <DialogDescription>
                Design and schedule your email campaign
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Newsletter Title</Label>
                  <Input id="title" placeholder="Weekly Tech Insights" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techcorp">TechCorp</SelectItem>
                      <SelectItem value="businesspro">BusinessPro</SelectItem>
                      <SelectItem value="creativestudio">CreativeStudio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject Line</Label>
                <Input id="subject" placeholder="🚀 5 AI Tools That Will Transform Your Workflow" />
              </div>

              {/* Template Selection */}
              <div className="space-y-3">
                <Label>Template</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(templateTypes).map(([key, template]) => (
                    <div key={key} className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                      <div className="flex items-center space-x-2 mb-2">
                        <input type="radio" name="template" value={key} className="text-primary" />
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content"
                  placeholder="Write your newsletter content here..."
                  className="min-h-40"
                />
              </div>

              {/* Subscriber Lists */}
              <div className="space-y-3">
                <Label>Subscriber Lists</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {subscriberLists.map((list) => (
                    <div key={list.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Switch />
                        <div>
                          <p className="font-medium">{list.name}</p>
                          <p className="text-sm text-muted-foreground">{list.subscribers.toLocaleString()} subscribers</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Send Option</Label>
                  <Select defaultValue="schedule">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send Now</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" defaultValue="09:00" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Save as Draft</Button>
                <Button className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Schedule Newsletter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Open Rate</p>
                <p className="text-2xl font-bold">{averageOpenRate.toFixed(1)}%</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{totalSent.toLocaleString()}</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
              </div>
              <MousePointer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {newsletters.map((newsletter) => (
              <Card key={newsletter.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                      <CardDescription>{newsletter.subject}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground">{newsletter.client}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {newsletter.subscribers.toLocaleString()} subscribers
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[newsletter.status]}>
                        {newsletter.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{newsletter.content}</p>
                  
                  {newsletter.stats && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm border-t pt-4">
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-bold">{newsletter.stats.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivered</p>
                        <p className="font-bold">{newsletter.stats.delivered.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opened</p>
                        <p className="font-bold text-green-600">
                          {newsletter.stats.opened.toLocaleString()} 
                          <span className="text-xs ml-1">
                            ({((newsletter.stats.opened / newsletter.stats.sent) * 100).toFixed(1)}%)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicked</p>
                        <p className="font-bold text-blue-600">
                          {newsletter.stats.clicked.toLocaleString()}
                          <span className="text-xs ml-1">
                            ({((newsletter.stats.clicked / newsletter.stats.sent) * 100).toFixed(1)}%)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Unsubscribed</p>
                        <p className="font-bold text-red-600">{newsletter.stats.unsubscribed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bounced</p>
                        <p className="font-bold text-orange-600">{newsletter.stats.bounced}</p>
                      </div>
                    </div>
                  )}

                  {newsletter.scheduledDate && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          Scheduled for {format(newsletter.scheduledDate, "MMM dd, yyyy")} at {newsletter.scheduledTime}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <div className="grid gap-4">
            {subscriberLists.map((list) => (
              <Card key={list.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{list.name}</CardTitle>
                      <CardDescription>
                        {list.subscribers.toLocaleString()} subscribers • 
                        Last updated {format(list.lastUpdated, "MMM dd, yyyy")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={list.status === 'active' ? 'default' : 'secondary'}>
                        {list.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">+{list.growth}%</p>
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{list.segments.length}</p>
                      <p className="text-sm text-muted-foreground">Segments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">4.2%</p>
                      <p className="text-sm text-muted-foreground">Avg CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">24.8%</p>
                      <p className="text-sm text-muted-foreground">Open Rate</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-4">
                    {list.segments.map((segment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {segment}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(templateTypes).map(([key, template]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{template.name} Template</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Template Preview</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Customize
                    </Button>
                    <Button size="sm" className="flex-1">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Open Rate</span>
                    <span className="font-bold">{averageOpenRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Click-Through Rate</span>
                    <span className="font-bold">4.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Unsubscribe Rate</span>
                    <span className="font-bold text-red-600">0.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">List Growth Rate</span>
                    <span className="font-bold text-green-600">+12.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Performing Content</CardTitle>
                <CardDescription>Top newsletters by engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {newsletters.filter(n => n.stats).map((newsletter, index) => (
                    <div key={newsletter.id} className="flex items-center gap-3 p-2 bg-muted rounded">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{newsletter.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {newsletter.stats ? ((newsletter.stats.opened / newsletter.stats.sent) * 100).toFixed(1) : 0}% open rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}