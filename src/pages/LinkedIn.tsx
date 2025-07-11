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
import { 
  LinkedinIcon, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  TrendingUp,
  MessageSquare,
  Share2,
  Eye,
  ThumbsUp,
  BarChart3,
  Edit,
  Trash2,
  Send,
  Image
} from 'lucide-react';
import { format } from 'date-fns';

interface LinkedInPost {
  id: string;
  content: string;
  postType: 'text' | 'image' | 'video' | 'article' | 'poll';
  scheduledDate: Date;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  client?: string;
  engagement?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
  };
  hashtags: string[];
  mentions: string[];
}

interface LinkedInMetrics {
  followers: number;
  profileViews: number;
  postImpressions: number;
  engagementRate: number;
  connectionRequests: number;
}

const mockPosts: LinkedInPost[] = [
  {
    id: '1',
    content: 'Excited to share insights from our latest digital transformation project. Key lessons learned: 1) Culture change is harder than tech change 2) Start small, scale fast 3) Data-driven decisions win every time. What\'s your experience with digital transformation? #DigitalTransformation #Leadership',
    postType: 'text',
    scheduledDate: new Date(2024, 0, 15, 9, 0),
    scheduledTime: '09:00',
    status: 'published',
    client: 'TechCorp',
    engagement: {
      views: 5420,
      likes: 89,
      comments: 23,
      shares: 12,
      clicks: 156
    },
    hashtags: ['DigitalTransformation', 'Leadership'],
    mentions: []
  },
  {
    id: '2',
    content: 'Just published a new article on the future of AI in business operations. Link in comments! 🚀',
    postType: 'article',
    scheduledDate: new Date(2024, 0, 16, 14, 30),
    scheduledTime: '14:30',
    status: 'scheduled',
    client: 'InnovateLab',
    hashtags: ['AI', 'Business', 'Innovation'],
    mentions: []
  },
  {
    id: '3',
    content: 'Behind the scenes at our team strategy session. Building the roadmap for Q2! 💼',
    postType: 'image',
    scheduledDate: new Date(2024, 0, 17, 11, 0),
    scheduledTime: '11:00',
    status: 'draft',
    client: 'StartupXYZ',
    hashtags: ['TeamWork', 'Strategy', 'Q2Planning'],
    mentions: ['@teamlead', '@ceo']
  }
];

const mockMetrics: LinkedInMetrics = {
  followers: 12500,
  profileViews: 850,
  postImpressions: 45200,
  engagementRate: 4.8,
  connectionRequests: 23
};

const postTypeIcons = {
  text: MessageSquare,
  image: Image,
  video: Eye,
  article: BarChart3,
  poll: Users
};

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

export default function LinkedIn() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [posts] = useState<LinkedInPost[]>(mockPosts);
  const [metrics] = useState<LinkedInMetrics>(mockMetrics);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const todayPosts = posts.filter(post => {
    const today = new Date();
    return post.scheduledDate.toDateString() === today.toDateString();
  });

  const publishedPosts = posts.filter(post => post.status === 'published');

  const getEngagementTotal = (post: LinkedInPost): number => {
    if (!post.engagement) return 0;
    return post.engagement.likes + post.engagement.comments + post.engagement.shares;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <LinkedinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">LinkedIn Management</h1>
            <p className="text-muted-foreground">Professional networking and content strategy</p>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create LinkedIn Post</DialogTitle>
              <DialogDescription>
                Create and schedule your professional content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postType">Post Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Post</SelectItem>
                      <SelectItem value="image">Image Post</SelectItem>
                      <SelectItem value="video">Video Post</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="poll">Poll</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techcorp">TechCorp</SelectItem>
                      <SelectItem value="innovatelab">InnovateLab</SelectItem>
                      <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content"
                  placeholder="What would you like to share with your professional network?"
                  className="min-h-32"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Schedule Date</Label>
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" defaultValue="09:00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input 
                  id="hashtags"
                  placeholder="#Leadership #Innovation #Business"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Save as Draft</Button>
                <Button className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Schedule Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Followers</p>
                <p className="text-2xl font-bold">{metrics.followers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{metrics.profileViews}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Post Impressions</p>
                <p className="text-2xl font-bold">{metrics.postImpressions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">{metrics.engagementRate}%</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connection Requests</p>
                <p className="text-2xl font-bold">{metrics.connectionRequests}</p>
              </div>
              <Share2 className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid gap-4">
            {posts.map((post) => {
              const PostTypeIcon = postTypeIcons[post.postType];
              return (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <PostTypeIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-sm">{post.client}</CardTitle>
                          <CardDescription>
                            {format(post.scheduledDate, "MMM dd, yyyy")} at {post.scheduledTime}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[post.status]}>
                          {post.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{post.content}</p>
                    
                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.hashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {post.engagement && (
                      <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.engagement.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {post.engagement.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.engagement.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          {post.engagement.shares}
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          {post.engagement.clicks} clicks
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>Schedule and manage your LinkedIn posts</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Today's"} Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No posts scheduled for this day</p>
                ) : (
                  todayPosts.map((post) => (
                    <div key={post.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{post.scheduledTime}</p>
                        <p className="text-xs text-muted-foreground truncate">{post.content}</p>
                      </div>
                      <Badge className={statusColors[post.status]}>
                        {post.status}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Your most engaging LinkedIn content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {publishedPosts
                  .sort((a, b) => getEngagementTotal(b) - getEngagementTotal(a))
                  .slice(0, 3)
                  .map((post, index) => (
                    <div key={post.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{post.content.slice(0, 60)}...</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{getEngagementTotal(post)} total engagements</span>
                          <span>{post.engagement?.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Engagement metrics breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Engagement Rate</span>
                    <span className="font-bold">{metrics.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Impressions</span>
                    <span className="font-bold">{metrics.postImpressions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profile Growth</span>
                    <span className="font-bold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connection Rate</span>
                    <span className="font-bold">3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="networking" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Requests</CardTitle>
                <CardDescription>Manage pending and recent connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Pending Requests</p>
                      <p className="text-sm text-muted-foreground">{metrics.connectionRequests} waiting for response</p>
                    </div>
                    <Button size="sm">View All</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Sent Requests</p>
                      <p className="text-sm text-muted-foreground">15 awaiting acceptance</p>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Growth</CardTitle>
                <CardDescription>Your LinkedIn network expansion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{metrics.followers.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Connections</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-green-600">+47</p>
                      <p className="text-xs text-muted-foreground">This Week</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-blue-600">+189</p>
                      <p className="text-xs text-muted-foreground">This Month</p>
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