import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, MessageSquare, ThumbsUp, Eye, Calendar, TrendingUp, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ContentPiece {
  id: string;
  title: string;
  platform: string;
  status: string;
  created_at: string;
  content: string;
}

interface AnalyticsData {
  date: string;
  impressions: number;
  engagement: number;
  reach: number;
}

const statusConfig = {
  'need_review': { 
    label: 'Need Your Review', 
    color: 'bg-orange-100 text-orange-800 border-orange-200', 
    icon: AlertCircle,
    description: 'Your input is needed to move forward'
  },
  'in_review': { 
    label: 'In Review by Client', 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Eye,
    description: 'Currently being reviewed by your team'
  },
  'approved': { 
    label: 'Approved', 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle,
    description: 'Ready for scheduling and publishing'
  },
  'scheduled': { 
    label: 'Scheduled', 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: Calendar,
    description: 'Set to publish automatically'
  },
  'published': { 
    label: 'Published', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
    icon: CheckCircle,
    description: 'Live on your channels'
  }
};

// Mock analytics data - replace with real data
const mockAnalyticsData: AnalyticsData[] = [
  { date: '2025-01-01', impressions: 2500, engagement: 150, reach: 2200 },
  { date: '2025-01-02', impressions: 3200, engagement: 180, reach: 2800 },
  { date: '2025-01-03', impressions: 2800, engagement: 165, reach: 2400 },
  { date: '2025-01-04', impressions: 4100, engagement: 220, reach: 3500 },
  { date: '2025-01-05', impressions: 3600, engagement: 195, reach: 3100 },
  { date: '2025-01-06', impressions: 2900, engagement: 175, reach: 2600 },
  { date: '2025-01-07', impressions: 3800, engagement: 210, reach: 3300 },
];

export default function ClientPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contentPieces, setContentPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('approval');

  useEffect(() => {
    if (user) {
      fetchContentPieces();
    }
  }, [user]);

  const fetchContentPieces = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_pieces')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setContentPieces(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error loading content",
        description: "Failed to load content pieces",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContentStatus = async (contentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('content_pieces')
        .update({ status: newStatus })
        .eq('id', contentId);

      if (error) throw error;

      setContentPieces(prev => 
        prev.map(piece => 
          piece.id === contentId 
            ? { ...piece, status: newStatus }
            : piece
        )
      );

      toast({
        title: "Status updated",
        description: `Content status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update content status",
        variant: "destructive"
      });
    }
  };

  const getContentByStatus = (status: string) => {
    return contentPieces.filter(piece => piece.status === status);
  };

  const needReviewCount = getContentByStatus('need_review').length;
  const inReviewCount = getContentByStatus('in_review').length;
  const approvedCount = getContentByStatus('approved').length;
  const publishedCount = getContentByStatus('published').length;

  const ContentCard = ({ piece }: { piece: ContentPiece }) => {
    const config = statusConfig[piece.status as keyof typeof statusConfig];
    const IconComponent = config?.icon || Clock;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1 line-clamp-2">{piece.title}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                {piece.content.substring(0, 120)}...
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {piece.platform}
                </Badge>
                <Badge className={`text-xs ${config?.color}`}>
                  <IconComponent className="h-3 w-3 mr-1" />
                  {config?.label}
                </Badge>
              </div>
            </div>
          </div>
          
          {piece.status === 'need_review' && (
            <div className="flex space-x-2 mt-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateContentStatus(piece.id, 'in_review')}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Review
              </Button>
              <Button 
                size="sm"
                onClick={() => updateContentStatus(piece.id, 'approved')}
                className="text-xs"
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Portal</h1>
          <p className="text-muted-foreground">
            Review, approve, and track your content performance
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{needReviewCount}</p>
                <p className="text-xs text-muted-foreground">Need Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{inReviewCount}</p>
                <p className="text-xs text-muted-foreground">In Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-emerald-600">{publishedCount}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="approval">Post Feedback & Approval</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Hub</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="approval" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Post Feedback and Approval</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review newly created posts, give feedback, and approve posts.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Need Review Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-orange-100 text-orange-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Need Your Review
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {needReviewCount} items requiring your attention
                    </span>
                  </div>
                  {needReviewCount > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {getContentByStatus('need_review').map(piece => (
                        <ContentCard key={piece.id} piece={piece} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No content needs your review right now</p>
                    </div>
                  )}
                </div>

                {/* In Review Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Eye className="h-3 w-3 mr-1" />
                      In Review by Client
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {inReviewCount} items being reviewed
                    </span>
                  </div>
                  {inReviewCount > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {getContentByStatus('in_review').map(piece => (
                        <ContentCard key={piece.id} piece={piece} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No content currently in review</p>
                    </div>
                  )}
                </div>

                {/* Approved Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {approvedCount} items ready to go
                    </span>
                  </div>
                  {approvedCount > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {getContentByStatus('approved').slice(0, 6).map(piece => (
                        <ContentCard key={piece.id} piece={piece} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No approved content yet</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Analytics Hub</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                All of your most important metrics at a glance
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Metric Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Overall Followers
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    New Followers (Weekly)
                  </Button>
                  <Button variant="default" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Impressions (Weekly)
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    New Followers (Monthly)
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Impressions (Monthly)
                  </Button>
                </div>

                {/* Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockAnalyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value, name) => [value, name === 'impressions' ? 'Impressions' : name]}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="impressions" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Content Calendar</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                View Content Pieces, sorted by date of publication
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Calendar Coming Soon</p>
                <p>Your content calendar will be displayed here with scheduling capabilities.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}