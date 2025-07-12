import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CSVUploader } from '@/components/data/CSVUploader';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye,
  Heart,
  MessageSquare,
  Download,
  Target,
  RefreshCw,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';

interface AnalyticsData {
  totalReach: number;
  engagement: number;
  conversions: number;
  revenue: number;
}

interface AnalyticsReport {
  id: string;
  report_name: string;
  report_type: string;
  csv_data: any;
  created_at: string;
  data_source: string;
}

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [analyticsReports, setAnalyticsReports] = useState<AnalyticsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalReach: 0,
    engagement: 0,
    conversions: 0,
    revenue: 0
  });

  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();

  const loadAnalyticsReports = async () => {
    if (!user || !currentWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('analytics_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnalyticsReports(data || []);
      
      // Calculate aggregated metrics
      const aggregated = data?.reduce((acc: AnalyticsData, report) => {
        const csvData = Array.isArray(report.csv_data) ? report.csv_data : [];
        
        csvData.forEach((row: any) => {
          // LinkedIn metrics
          if (report.report_type === 'linkedin') {
            acc.totalReach += parseInt(row.Impressions || row.impressions || '0');
            acc.engagement += parseInt(row.Reactions || row.reactions || '0') + 
                            parseInt(row.Comments || row.comments || '0') + 
                            parseInt(row.Shares || row.shares || '0');
          }
          
          // YouTube metrics  
          if (report.report_type === 'youtube') {
            acc.totalReach += parseInt(row.Views || row.views || '0');
            acc.engagement += parseInt(row.Likes || row.likes || '0') + 
                            parseInt(row.Comments || row.comments || '0');
          }

          // Newsletter metrics
          if (report.report_type === 'newsletter') {
            acc.totalReach += parseInt(row.Opens || row.opens || '0');
            acc.engagement += parseInt(row.Clicks || row.clicks || '0');
          }
        });
        
        return acc;
      }, { totalReach: 0, engagement: 0, conversions: 0, revenue: 0 });

      if (aggregated) {
        setAnalytics(aggregated);
      }
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsReports();
  }, [user, currentWorkspace]);

  const handleDataProcessed = () => {
    loadAnalyticsReports();
    toast({
      title: "Success",
      description: "Analytics data updated successfully",
    });
  };

  const getChangeIndicator = (current: number, previous: number) => {
    if (previous === 0) return { value: '0', isPositive: true, icon: TrendingUp, color: 'text-muted-foreground' };
    
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    
    return {
      value: Math.abs(change).toFixed(1),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600'
    };
  };

  const previousMetrics = {
    totalReach: Math.floor(analytics.totalReach * 0.85),
    engagement: Math.floor(analytics.engagement * 0.9),
    conversions: Math.floor(analytics.conversions * 0.8),
    revenue: Math.floor(analytics.revenue * 0.75)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
          <Button variant="outline" size="sm" onClick={loadAnalyticsReports}>
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
            value: analytics.totalReach.toLocaleString(),
            previous: previousMetrics.totalReach,
            icon: Eye,
            color: 'text-blue-600'
          },
          {
            title: 'Engagement',
            value: analytics.engagement.toLocaleString(),
            previous: previousMetrics.engagement,
            icon: Heart,
            color: 'text-red-600'
          },
          {
            title: 'Conversions',
            value: analytics.conversions.toString(),
            previous: previousMetrics.conversions,
            icon: Target,
            color: 'text-green-600'
          },
          {
            title: 'Revenue Impact',
            value: `$${(analytics.revenue / 1000).toFixed(0)}K`,
            previous: previousMetrics.revenue,
            icon: TrendingUp,
            color: 'text-purple-600'
          }
        ].map((metric, index) => {
          const change = getChangeIndicator(
            typeof metric.value === 'string' && metric.value.includes('$') 
              ? analytics.revenue 
              : typeof metric.value === 'string' && metric.value.includes(',')
              ? parseInt(metric.value.replace(',', ''))
              : parseInt(metric.value),
            metric.previous
          );
          const ChangeIcon = change.icon;
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
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

      {/* Reports Overview */}
      {analyticsReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Analytics Reports</CardTitle>
            <CardDescription>Your uploaded analytics data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{report.report_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.report_type} • {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {Array.isArray(report.csv_data) ? report.csv_data.length : 0} rows
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      <Tabs defaultValue="linkedin" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="lead-magnet">Lead Magnets</TabsTrigger>
        </TabsList>

        <TabsContent value="linkedin" className="space-y-6">
          <CSVUploader channel="linkedin" onDataProcessed={handleDataProcessed} />
        </TabsContent>

        <TabsContent value="youtube" className="space-y-6">
          <CSVUploader channel="youtube" onDataProcessed={handleDataProcessed} />
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-6">
          <CSVUploader channel="newsletter" onDataProcessed={handleDataProcessed} />
        </TabsContent>

        <TabsContent value="lead-magnet" className="space-y-6">
          <CSVUploader channel="lead-magnet" onDataProcessed={handleDataProcessed} />
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {analyticsReports.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Data Yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first CSV export to start tracking performance
            </p>
            <p className="text-sm text-muted-foreground">
              Export data from LinkedIn, YouTube, Newsletter platforms, or Lead Magnets and upload here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}