import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Plus, 
  Calendar as CalendarIcon,
  Filter,
  MoreHorizontal,
  FileText,
  Linkedin,
  Mail,
  Youtube,
  Instagram,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Edit,
  Sparkles,
  Image,
  Video,
  Type
} from 'lucide-react';
import { format } from 'date-fns';
import { ContentBriefDialog, AIGenerationDialog } from '@/components/forms/ContentForms';

type ContentStatus = 'idea' | 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
type ContentChannel = 'linkedin' | 'youtube' | 'newsletter' | 'instagram';

interface ContentPiece {
  id: string;
  title: string;
  channel: ContentChannel;
  status: ContentStatus;
  client: string;
  dueDate: string;
  assignee: string;
  description: string;
}

const sampleContent: ContentPiece[] = [
  {
    id: '1',
    title: 'AI Trends in B2B Sales - LinkedIn Post',
    channel: 'linkedin',
    status: 'review',
    client: 'TechCorp',
    dueDate: '2024-01-15',
    assignee: 'Sarah Chen',
    description: 'Text + Image post about AI automation trends with infographic'
  },
  {
    id: '2',
    title: 'Weekly Industry Newsletter',
    channel: 'newsletter',
    status: 'draft',
    client: 'SaaS Startup',
    dueDate: '2024-01-16',
    assignee: 'Sarah Chen',
    description: 'Weekly roundup with 3 key insights and actionable tips'
  },
  {
    id: '3',
    title: 'Content Creation Workflow Vlog',
    channel: 'youtube',
    status: 'scheduled',
    client: 'Growth Agency',
    dueDate: '2024-01-18',
    assignee: 'Sarah Chen',
    description: '15-minute educational vlog with thumbnail and description'
  },
  {
    id: '4',
    title: 'Behind the Scenes Reel',
    channel: 'instagram',
    status: 'approved',
    client: 'Enterprise Co',
    dueDate: '2024-01-20',
    assignee: 'Sarah Chen',
    description: '30-second Instagram reel showing office culture'
  },
  {
    id: '5',
    title: 'LinkedIn Video Post - Product Demo',
    channel: 'linkedin',
    status: 'idea',
    client: 'TechCorp',
    dueDate: '2024-01-22',
    assignee: 'Sarah Chen',
    description: 'Text + Video post showcasing new product features'
  },
  {
    id: '6',
    title: 'Instagram Story Series',
    channel: 'instagram',
    status: 'draft',
    client: 'Growth Agency',
    dueDate: '2024-01-24',
    assignee: 'Sarah Chen',
    description: 'Multi-slide story series with tips and insights'
  }
];

const statusColors = {
  idea: 'bg-gray-100 text-gray-700',
  draft: 'bg-blue-100 text-blue-700',
  review: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  scheduled: 'bg-purple-100 text-purple-700',
  published: 'bg-emerald-100 text-emerald-700'
};

const channelIcons = {
  linkedin: Linkedin,
  newsletter: Mail,
  youtube: Youtube,
  instagram: Instagram
};

export default function ContentEngine() {
  const { user, hasPermission } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<ContentStatus | 'all'>('all');
  const [selectedChannel, setSelectedChannel] = useState<ContentChannel | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

  const filteredContent = sampleContent.filter(content => {
    if (selectedStatus !== 'all' && content.status !== selectedStatus) return false;
    if (selectedChannel !== 'all' && content.channel !== selectedChannel) return false;
    return true;
  });

  const canCreateContent = hasPermission('content:create');
  const canEditContent = hasPermission('content:edit');

  const statusColumns: ContentStatus[] = ['idea', 'draft', 'review', 'approved', 'scheduled', 'published'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Engine</h1>
          <p className="text-muted-foreground">
            Orchestrate your multi-channel content ecosystem
          </p>
        </div>
        {canCreateContent && (
          <div className="flex gap-2">
            <Button onClick={() => setIsBriefDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Brief
            </Button>
            <Button onClick={() => setIsAIDialogOpen(true)} variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generate
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        {/* Status Filter */}
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value as ContentStatus | 'all')}
          className="text-sm border border-border rounded-md px-3 py-1 bg-background"
        >
          <option value="all">All Status</option>
          <option value="idea">Ideas</option>
          <option value="draft">Drafts</option>
          <option value="review">In Review</option>
          <option value="approved">Approved</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>

        {/* Channel Filter */}
        <select 
          value={selectedChannel} 
          onChange={(e) => setSelectedChannel(e.target.value as ContentChannel | 'all')}
          className="text-sm border border-border rounded-md px-3 py-1 bg-background"
        >
          <option value="all">All Channels</option>
          <option value="linkedin">LinkedIn</option>
          <option value="youtube">YouTube</option>
          <option value="newsletter">Newsletter</option>
          <option value="instagram">Instagram</option>
        </select>

        <Badge variant="outline" className="ml-auto">
          {filteredContent.length} pieces
        </Badge>
      </div>

      {/* Content Views */}
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 min-h-96">
            {statusColumns.map((status) => {
              const columnContent = filteredContent.filter(content => content.status === status);
              
              return (
                <div key={status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm capitalize flex items-center space-x-2">
                      <span>{status.replace('-', ' ')}</span>
                      <Badge variant="secondary" className="text-xs">
                        {columnContent.length}
                      </Badge>
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {columnContent.map((content) => {
                      const ChannelIcon = channelIcons[content.channel];
                      
                      return (
                        <Card key={content.id} className="hover:shadow-md smooth-transition cursor-pointer">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-sm font-medium leading-tight">
                                {content.title}
                              </CardTitle>
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center space-x-2">
                              <ChannelIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground capitalize">
                                {content.channel.replace('-', ' ')}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {content.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium">{content.client}</span>
                                <span className="text-muted-foreground">{content.dueDate}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-primary">
                                    {content.assignee.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {content.assignee}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {columnContent.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No content in {status}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                Upcoming content schedule across all channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border w-full"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Today's"} Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">9:00 AM</p>
                        <p className="text-xs text-muted-foreground truncate">LinkedIn post - AI trends</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">LinkedIn</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">2:00 PM</p>
                        <p className="text-xs text-muted-foreground truncate">Twitter thread - productivity tips</p>
                      </div>
                      <Badge className="bg-sky-100 text-sky-800">Twitter</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">6:00 PM</p>
                        <p className="text-xs text-muted-foreground truncate">Instagram story - behind the scenes</p>
                      </div>
                      <Badge className="bg-pink-100 text-pink-800">Instagram</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content List</CardTitle>
              <CardDescription>
                Detailed view of all content pieces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredContent.map((content) => {
                  const ChannelIcon = channelIcons[content.channel];
                  
                  return (
                    <div key={content.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 smooth-transition">
                      <ChannelIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{content.title}</h4>
                        <p className="text-sm text-muted-foreground">{content.client}</p>
                      </div>
                      <Badge className={statusColors[content.status]}>
                        {content.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{content.dueDate}</span>
                      {canEditContent && (
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ContentBriefDialog 
        isOpen={isBriefDialogOpen} 
        onClose={() => setIsBriefDialogOpen(false)} 
      />
      <AIGenerationDialog 
        isOpen={isAIDialogOpen} 
        onClose={() => setIsAIDialogOpen(false)} 
      />
    </div>
  );
}