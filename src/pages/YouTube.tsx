import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Plus, 
  Calendar as CalendarIcon, 
  Users, 
  BarChart3, 
  Clock, 
  Upload, 
  Edit3, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  TrendingUp,
  Target,
  Zap,
  Video,
  Camera,
  Mic,
  Settings,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const YouTube = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
    category: "",
    tags: ""
  });

  // Sample data
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "B2B SaaS Growth Strategies for 2024",
      thumbnail: "/api/placeholder/320/180",
      status: "published",
      publishDate: "2024-01-15",
      duration: "12:45",
      views: 15420,
      likes: 892,
      comments: 156,
      engagement: 8.2,
      client: "TechCorp"
    },
    {
      id: 2,
      title: "Customer Success Stories: From Startup to Scale",
      thumbnail: "/api/placeholder/320/180",
      status: "scheduled",
      publishDate: "2024-01-20",
      duration: "8:30",
      views: 0,
      likes: 0,
      comments: 0,
      engagement: 0,
      client: "StartupXYZ"
    },
    {
      id: 3,
      title: "Digital Transformation Masterclass",
      thumbnail: "/api/placeholder/320/180",
      status: "editing",
      publishDate: "2024-01-25",
      duration: "15:20",
      views: 0,
      likes: 0,
      comments: 0,
      engagement: 0,
      client: "Enterprise Solutions"
    },
    {
      id: 4,
      title: "Weekly Industry Insights & Trends",
      thumbnail: "/api/placeholder/320/180",
      status: "draft",
      publishDate: "2024-01-30",
      duration: "6:15",
      views: 0,
      likes: 0,
      comments: 0,
      engagement: 0,
      client: "TrendWatch"
    }
  ]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateVlog = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newVideo = {
      id: videos.length + 1,
      title: formData.title,
      thumbnail: thumbnailPreview || "/api/placeholder/320/180",
      status: "draft",
      publishDate: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      duration: "0:00",
      views: 0,
      likes: 0,
      comments: 0,
      engagement: 0,
      client: formData.client || "Personal"
    };

    setVideos([newVideo, ...videos]);
    
    // Reset form
    setFormData({ title: "", client: "", description: "", category: "", tags: "" });
    setThumbnailFile(null);
    setThumbnailPreview("");
    setSelectedDate(undefined);
    setIsCreateOpen(false);

    toast({
      title: "Vlog Created!",
      description: "Your new vlog has been added to your content library.",
    });
  };

  const analytics = {
    totalViews: 2850000,
    totalSubscribers: 45200,
    avgWatchTime: "4:32",
    totalWatchHours: 12800,
    monthlyGrowth: 18.5
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'editing': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'draft': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <Play className="h-3 w-3" />;
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'editing': return <Edit3 className="h-3 w-3" />;
      case 'draft': return <Edit3 className="h-3 w-3" />;
      default: return <Edit3 className="h-3 w-3" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">YouTube Vlogs</h1>
          <p className="text-muted-foreground">Create and manage your vlog content with thumbnails and descriptions</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Vlog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Vlog</DialogTitle>
              <DialogDescription>
                Set up your vlog with title, description, and thumbnail attachment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Vlog Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter vlog title..." 
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client/Channel</Label>
                  <Select value={formData.client} onValueChange={(value) => handleInputChange("client", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="techcorp">TechCorp</SelectItem>
                      <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                      <SelectItem value="enterprise">Enterprise Solutions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your vlog content, key points, and target audience..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    id="thumbnail" 
                    type="file" 
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="flex-1"
                  />
                  {thumbnailPreview && (
                    <div className="relative w-20 h-12 rounded overflow-hidden border">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Upload a custom thumbnail for your vlog (recommended: 1280x720px)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vlog">Personal Vlog</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Publish Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags" 
                  placeholder="Enter tags separated by commas..." 
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVlog}>
                  Create Vlog
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analytics.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analytics.monthlyGrowth}% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analytics.totalSubscribers.toLocaleString()}</div>
            <div className="flex items-center text-sm text-blue-600 mt-1">
              <Users className="h-3 w-3 mr-1" />
              +1,240 this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Watch Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analytics.avgWatchTime}</div>
            <div className="flex items-center text-sm text-purple-600 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              +12% vs last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Watch Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analytics.totalWatchHours.toLocaleString()}</div>
            <div className="flex items-center text-sm text-orange-600 mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              +850 this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$12,450</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <Target className="h-3 w-3 mr-1" />
              +24% vs last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="videos">Vlogs</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                    {video.thumbnail.startsWith('data:') ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <Video className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <Badge 
                    className={cn("absolute top-2 right-2 text-xs", getStatusColor(video.status))}
                  >
                    {getStatusIcon(video.status)}
                    <span className="ml-1 capitalize">{video.status}</span>
                  </Badge>
                  {video.duration && (
                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
                      {video.duration}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{video.title}</h3>
                  <div className="text-xs text-muted-foreground mb-3">
                    Client: {video.client}
                  </div>
                  {video.status === 'published' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {video.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {video.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {video.comments}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Engagement: {video.engagement}%</span>
                        <Progress value={video.engagement * 10} className="w-16 h-1" />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(video.publishDate), "MMM dd")}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                Plan and schedule your video content across multiple channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="min-h-24 p-2 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      {((i % 31) + 1)}
                    </div>
                    {i === 10 && (
                      <div className="bg-blue-500/10 text-blue-700 text-xs p-1 rounded border border-blue-200">
                        B2B Growth Video
                      </div>
                    )}
                    {i === 15 && (
                      <div className="bg-green-500/10 text-green-700 text-xs p-1 rounded border border-green-200">
                        Customer Success
                      </div>
                    )}
                    {i === 22 && (
                      <div className="bg-purple-500/10 text-purple-700 text-xs p-1 rounded border border-purple-200">
                        Industry Trends
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Videos</CardTitle>
                <CardDescription>Highest engagement in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos.filter(v => v.status === 'published').map((video, index) => (
                    <div key={video.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.views.toLocaleString()} views</p>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {video.engagement}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>Growth metrics across all channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subscriber Growth</span>
                      <span className="font-medium">+18.5%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>View Duration</span>
                      <span className="font-medium">+12.3%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement Rate</span>
                      <span className="font-medium">+8.7%</span>
                    </div>
                    <Progress value={55} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Revenue Growth</span>
                      <span className="font-medium">+24.1%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Pre-Production
                </CardTitle>
                <CardDescription>Planning and preparation phase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Script Writing</span>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Storyboard</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Location Scouting</span>
                    <Badge className="bg-green-500/10 text-green-700 border-green-200">Complete</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="h-5 w-5 mr-2" />
                  Production
                </CardTitle>
                <CardDescription>Recording and capturing content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Video Recording</span>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Audio Recording</span>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">B-Roll Capture</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Post-Production
                </CardTitle>
                <CardDescription>Editing and publishing workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Video Editing</span>
                    <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Color Grading</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Thumbnail Design</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Publishing Checklist</CardTitle>
              <CardDescription>Ensure all requirements are met before publishing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Video title optimized for SEO</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Description with keywords</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Thumbnail created and uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Tags added (max 500 chars)</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">End screen elements configured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Captions/subtitles uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Social media posts scheduled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Analytics tracking setup</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YouTube;