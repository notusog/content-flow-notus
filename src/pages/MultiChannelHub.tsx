import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Send,
  Edit,
  Eye,
  MoreHorizontal,
  Linkedin,
  Mail,
  Youtube,
  Download,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';

interface ScheduledContent {
  id: string;
  title: string;
  channel: 'linkedin' | 'newsletter' | 'youtube' | 'lead-magnet';
  status: 'scheduled' | 'published' | 'draft' | 'failed';
  scheduledDate: string;
  scheduledTime: string;
  client: string;
  engagement?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

const scheduledContent: ScheduledContent[] = [
  {
    id: '1',
    title: 'B2B Content Strategy: The 5 Pillars That Drive Results',
    channel: 'linkedin',
    status: 'scheduled',
    scheduledDate: '2024-01-16',
    scheduledTime: '09:00',
    client: 'TechCorp'
  },
  {
    id: '2',
    title: 'Weekly Industry Insights Newsletter #47',
    channel: 'newsletter',
    status: 'scheduled',
    scheduledDate: '2024-01-16',
    scheduledTime: '07:00',
    client: 'SaaS Startup'
  },
  {
    id: '3',
    title: 'Content Creation Mastery: Behind the Scenes',
    channel: 'youtube',
    status: 'published',
    scheduledDate: '2024-01-15',
    scheduledTime: '16:00',
    client: 'Growth Agency',
    engagement: { views: 1247, likes: 89, comments: 23, shares: 12 }
  },
  {
    id: '4',
    title: 'The Ultimate Content Audit Checklist',
    channel: 'lead-magnet',
    status: 'published',
    scheduledDate: '2024-01-14',
    scheduledTime: '10:00',
    client: 'Enterprise Co',
    engagement: { views: 342 }
  },
  {
    id: '5',
    title: 'LinkedIn Algorithm Update: What You Need to Know',
    channel: 'linkedin',
    status: 'published',
    scheduledDate: '2024-01-14',
    scheduledTime: '14:00',
    client: 'TechCorp',
    engagement: { views: 2341, likes: 156, comments: 42, shares: 28 }
  }
];

const channelIcons = {
  linkedin: Linkedin,
  newsletter: Mail,
  youtube: Youtube,
  'lead-magnet': Download
};

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-700',
  failed: 'bg-red-100 text-red-700'
};

const channelColors = {
  linkedin: 'bg-blue-50 border-blue-200',
  newsletter: 'bg-purple-50 border-purple-200',
  youtube: 'bg-red-50 border-red-200',
  'lead-magnet': 'bg-green-50 border-green-200'
};

export default function MultiChannelHub() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  const today = new Date().toISOString().split('T')[0];
  const todayContent = scheduledContent.filter(content => content.scheduledDate === today);
  const publishedContent = scheduledContent.filter(content => content.status === 'published');

  const getEngagementTotal = (content: ScheduledContent) => {
    if (!content.engagement) return 0;
    return (content.engagement.views || 0) + (content.engagement.likes || 0) + 
           (content.engagement.comments || 0) + (content.engagement.shares || 0);
  };

  const totalEngagement = publishedContent.reduce((acc, content) => acc + getEngagementTotal(content), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Multi-Channel Hub</h1>
          <p className="text-muted-foreground">
            Schedule and manage content across all platforms
          </p>
        </div>
        <Button className="smooth-transition">
          <Send className="mr-2 h-4 w-4" />
          Schedule Content
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Today's Posts</p>
                <p className="text-2xl font-bold">{todayContent.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Total Engagement</p>
                <p className="text-2xl font-bold">{totalEngagement.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Active Channels</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Queue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>
                  Click a date to see scheduled content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Daily Schedule */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Schedule for {selectedDate.toLocaleDateString()}
                </CardTitle>
                <CardDescription>
                  Content planned for this day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledContent
                    .filter(content => content.scheduledDate === selectedDate.toISOString().split('T')[0])
                    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                    .map((content) => {
                      const ChannelIcon = channelIcons[content.channel];
                      
                      return (
                        <div key={content.id} className={`p-4 rounded-lg border-2 ${channelColors[content.channel]}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 rounded-lg bg-white">
                                <ChannelIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{content.title}</h3>
                                <p className="text-sm text-muted-foreground capitalize mb-2">
                                  {content.channel.replace('-', ' ')} • {content.client}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <Badge className={statusColors[content.status]}>
                                    {content.status}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {content.scheduledTime}
                                  </span>
                                </div>
                                {content.engagement && (
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                    {content.engagement.views && (
                                      <span>{content.engagement.views} views</span>
                                    )}
                                    {content.engagement.likes && (
                                      <span>{content.engagement.likes} likes</span>
                                    )}
                                    {content.engagement.comments && (
                                      <span>{content.engagement.comments} comments</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                  {scheduledContent.filter(content => 
                    content.scheduledDate === selectedDate.toISOString().split('T')[0]
                  ).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No content scheduled for this date</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          {/* Channel Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Filter by channel:</span>
            <select 
              value={selectedChannel} 
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-background"
            >
              <option value="all">All Channels</option>
              <option value="linkedin">LinkedIn</option>
              <option value="newsletter">Newsletter</option>
              <option value="youtube">YouTube</option>
              <option value="lead-magnet">Lead Magnets</option>
            </select>
          </div>

          {/* Schedule Queue */}
          <div className="space-y-4">
            {scheduledContent
              .filter(content => selectedChannel === 'all' || content.channel === selectedChannel)
              .sort((a, b) => new Date(a.scheduledDate + 'T' + a.scheduledTime).getTime() - 
                               new Date(b.scheduledDate + 'T' + b.scheduledTime).getTime())
              .map((content) => {
                const ChannelIcon = channelIcons[content.channel];
                const isUpcoming = new Date(content.scheduledDate + 'T' + content.scheduledTime) > new Date();
                
                return (
                  <Card key={content.id} className="hover:shadow-md smooth-transition">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${channelColors[content.channel]}`}>
                            <ChannelIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{content.title}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-muted-foreground capitalize">
                                {content.channel.replace('-', ' ')}
                              </span>
                              <span className="text-sm font-medium">{content.client}</span>
                              <Badge className={statusColors[content.status]}>
                                {content.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(content.scheduledDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {content.scheduledTime}
                            </p>
                          </div>
                          
                          <div className="flex space-x-1">
                            {isUpcoming ? (
                              <AlertCircle className="h-5 w-5 text-blue-500" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {content.engagement && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            {content.engagement.views && (
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{content.engagement.views.toLocaleString()}</span>
                              </div>
                            )}
                            {content.engagement.likes && (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{content.engagement.likes}</span>
                              </div>
                            )}
                            {content.engagement.comments && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{content.engagement.comments}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>Engagement metrics by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: 'LinkedIn', posts: 8, avgEngagement: 187, color: 'bg-blue-500' },
                    { channel: 'YouTube', posts: 3, avgEngagement: 423, color: 'bg-red-500' },
                    { channel: 'Newsletter', posts: 4, avgEngagement: 89, color: 'bg-purple-500' },
                    { channel: 'Lead Magnets', posts: 2, avgEngagement: 171, color: 'bg-green-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <div>
                          <p className="font-medium text-sm">{item.channel}</p>
                          <p className="text-xs text-muted-foreground">{item.posts} posts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{item.avgEngagement}</p>
                        <p className="text-xs text-muted-foreground">avg. engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing Success Rate</CardTitle>
                <CardDescription>Content delivery performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">98.5%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Published Successfully</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Scheduled</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Failed</span>
                      <span className="font-medium text-red-600">1</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}