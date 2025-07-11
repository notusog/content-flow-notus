import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye,
  Heart,
  MessageSquare,
  Share,
  Download,
  Target,
  Calendar,
  Filter,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  metrics: {
    totalReach: number;
    engagement: number;
    conversions: number;
    revenue: number;
  };
  channels: {
    linkedin: { posts: number; reach: number; engagement: number };
    youtube: { videos: number; views: number; subscribers: number };
    newsletter: { sends: number; opens: number; clicks: number };
    leadMagnets: { downloads: number; conversion: number };
  };
}

const mockAnalytics: AnalyticsData = {
  period: 'Last 30 Days',
  metrics: {
    totalReach: 45200,
    engagement: 3890,
    conversions: 127,
    revenue: 68500
  },
  channels: {
    linkedin: { posts: 24, reach: 18500, engagement: 1540 },
    youtube: { videos: 8, views: 12300, subscribers: 245 },
    newsletter: { sends: 12000, opens: 4800, clicks: 720 },
    leadMagnets: { downloads: 342, conversion: 18 }
  }
};

const contentPerformance = [
  {
    title: 'The Content Strategy Framework That 10x Our Results',
    channel: 'LinkedIn',
    date: '2024-01-10',
    reach: 4200,
    engagement: 387,
    conversions: 12,
    score: 94
  },
  {
    title: 'Content Creation Workflow Deep Dive',
    channel: 'YouTube',
    date: '2024-01-08',
    reach: 2800,
    engagement: 445,
    conversions: 8,
    score: 89
  },
  {
    title: 'Weekly Industry Insights #45',
    channel: 'Newsletter',
    date: '2024-01-07',
    reach: 1200,
    engagement: 156,
    conversions: 23,
    score: 87
  },
  {
    title: 'B2B Content Audit Checklist',
    channel: 'Lead Magnet',
    date: '2024-01-05',
    reach: 890,
    engagement: 67,
    conversions: 45,
    score: 92
  }
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedClient, setSelectedClient] = useState('all');

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    
    return {
      value: Math.abs(change).toFixed(1),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600'
    };
  };

  // Mock previous period data for comparison
  const previousMetrics = {
    totalReach: 38900,
    engagement: 3200,
    conversions: 98,
    revenue: 52000
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track performance across all content channels
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-2 bg-background"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Reach',
            value: mockAnalytics.metrics.totalReach.toLocaleString(),
            previous: previousMetrics.totalReach,
            icon: Eye,
            color: 'text-blue-600'
          },
          {
            title: 'Engagement',
            value: mockAnalytics.metrics.engagement.toLocaleString(),
            previous: previousMetrics.engagement,
            icon: Heart,
            color: 'text-red-600'
          },
          {
            title: 'Conversions',
            value: mockAnalytics.metrics.conversions.toString(),
            previous: previousMetrics.conversions,
            icon: Target,
            color: 'text-green-600'
          },
          {
            title: 'Revenue Impact',
            value: `$${(mockAnalytics.metrics.revenue / 1000).toFixed(0)}K`,
            previous: previousMetrics.revenue,
            icon: TrendingUp,
            color: 'text-purple-600'
          }
        ].map((metric, index) => {
          const change = getChangeIndicator(
            typeof metric.value === 'string' && metric.value.includes('$') 
              ? mockAnalytics.metrics.revenue 
              : typeof metric.value === 'string' && metric.value.includes(',')
              ? parseInt(metric.value.replace(',', ''))
              : parseInt(metric.value),
            metric.previous
          );
          const ChangeIcon = change.icon;
          
          return (
            <Card key={index} className="hover:shadow-md smooth-transition">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className={`flex items-center space-x-1 text-sm ${change.color}`}>
                      <ChangeIcon className="h-3 w-3" />
                      <span>{change.value}% vs last period</span>
                    </div>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channel Performance</TabsTrigger>
          <TabsTrigger value="content">Top Content</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Daily engagement across all channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Interactive chart would show here</p>
                    <p className="text-sm">Daily engagement, reach, and conversion trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Channel Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
                <CardDescription>Reach breakdown by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: 'LinkedIn', reach: 18500, percentage: 41, color: 'bg-blue-500' },
                    { channel: 'Newsletter', reach: 12000, percentage: 27, color: 'bg-purple-500' },
                    { channel: 'YouTube', reach: 12300, percentage: 27, color: 'bg-red-500' },
                    { channel: 'Lead Magnets', reach: 2400, percentage: 5, color: 'bg-green-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.channel}</span>
                        <span>{item.reach.toLocaleString()} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>ROI Analysis</CardTitle>
              <CardDescription>Content investment vs revenue impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">285%</div>
                  <p className="text-sm text-muted-foreground">Content ROI</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">$540</div>
                  <p className="text-sm text-muted-foreground">Cost per conversion</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">2.8x</div>
                  <p className="text-sm text-muted-foreground">Revenue multiplier</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LinkedIn Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-blue-100">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>LinkedIn Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.channels.linkedin.posts}</p>
                    <p className="text-xs text-muted-foreground">Posts Published</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.channels.linkedin.reach.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Reach</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.channels.linkedin.engagement.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8.3%</p>
                    <p className="text-xs text-muted-foreground">Engagement Rate</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Top performing post types:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Strategy insights (12.4% avg. engagement)</div>
                    <div>• Behind-the-scenes (9.8% avg. engagement)</div>
                    <div>• Client case studies (11.2% avg. engagement)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* YouTube Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-red-100">
                    <Eye className="h-4 w-4 text-red-600" />
                  </div>
                  <span>YouTube Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.channels.youtube.videos}</p>
                    <p className="text-xs text-muted-foreground">Videos Published</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.channels.youtube.views.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.channels.youtube.subscribers}</p>
                    <p className="text-xs text-muted-foreground">New Subscribers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">6.4%</p>
                    <p className="text-xs text-muted-foreground">CTR</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Top performing videos:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Content strategy deep dives (avg. 15min watch time)</div>
                    <div>• Tool tutorials (avg. 12min watch time)</div>
                    <div>• Industry analysis (avg. 8min watch time)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-purple-100">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Newsletter Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{(mockAnalytics.channels.newsletter.sends / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-muted-foreground">Total Sends</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">40%</p>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">6%</p>
                    <p className="text-xs text-muted-foreground">Click Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2.1%</p>
                    <p className="text-xs text-muted-foreground">Unsubscribe Rate</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Best performing sections:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Industry insights (65% click rate)</div>
                    <div>• Tool recommendations (48% click rate)</div>
                    <div>• Case studies (42% click rate)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Magnets Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-green-100">
                    <Download className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Lead Magnets Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.channels.leadMagnets.downloads}</p>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24%</p>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.channels.leadMagnets.conversion}</p>
                    <p className="text-xs text-muted-foreground">Qualified Leads</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$2.1K</p>
                    <p className="text-xs text-muted-foreground">Revenue Generated</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Top performing magnets:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Content audit checklist (89 downloads)</div>
                    <div>• Strategy templates (67 downloads)</div>
                    <div>• ROI calculator (45 downloads)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>
                Content pieces with highest engagement and conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 smooth-transition">
                    <div className="flex-1">
                      <h3 className="font-medium">{content.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span>{content.channel}</span>
                        <span>{content.date}</span>
                        <Badge variant="outline" className="text-green-600">
                          Score: {content.score}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{content.reach.toLocaleString()}</p>
                        <p className="text-muted-foreground">Reach</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{content.engagement}</p>
                        <p className="text-muted-foreground">Engagement</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{content.conversions}</p>
                        <p className="text-muted-foreground">Conversions</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content-to-Revenue Funnel</CardTitle>
              <CardDescription>
                Track how content engagement converts to revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { stage: 'Content Views', count: 45200, percentage: 100, color: 'bg-blue-500' },
                  { stage: 'Engaged Users', count: 3890, percentage: 8.6, color: 'bg-green-500' },
                  { stage: 'Lead Captured', count: 342, percentage: 0.76, color: 'bg-yellow-500' },
                  { stage: 'Qualified Leads', count: 127, percentage: 0.28, color: 'bg-orange-500' },
                  { stage: 'Closed Deals', count: 18, percentage: 0.04, color: 'bg-red-500' }
                ].map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-sm text-muted-foreground">
                        {stage.count.toLocaleString()} ({stage.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${stage.color} smooth-transition`}
                        style={{ width: `${Math.log(stage.percentage + 1) * 25}%` }}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Key Insights:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Content engagement rate of 8.6% is above industry average (5.2%)</li>
                    <li>• Lead capture conversion improved 23% vs last month</li>
                    <li>• Average deal size from content leads: $3,800</li>
                    <li>• Time from first engagement to close: avg. 47 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}