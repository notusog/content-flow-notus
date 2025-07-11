import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Zap, 
  Calendar,
  Target,
  ArrowRight,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const roleSpecificContent = {
    strategist: {
      title: 'Content Strategist Dashboard',
      subtitle: 'Orchestrate high-impact content ecosystems',
      quickActions: [
        { title: 'Extract Insights', desc: 'Process new client content', icon: Lightbulb, href: '/insights', color: 'bg-blue-50 text-blue-700' },
        { title: 'Create Content', desc: 'Draft multi-channel campaigns', icon: FileText, href: '/content', color: 'bg-green-50 text-green-700' },
        { title: 'Schedule Posts', desc: 'Manage content calendar', icon: Calendar, href: '/channels', color: 'bg-purple-50 text-purple-700' },
        { title: 'View Analytics', desc: 'Track performance metrics', icon: BarChart3, href: '/analytics', color: 'bg-orange-50 text-orange-700' }
      ],
      stats: [
        { label: 'Active Clients', value: '12', change: '+2 this month', trend: 'up' },
        { label: 'Content Pieces', value: '89', change: '+15 this week', trend: 'up' },
        { label: 'Avg. Engagement', value: '8.4%', change: '+1.2% vs last month', trend: 'up' },
        { label: 'Pipeline Generated', value: '$45K', change: '+$12K this quarter', trend: 'up' }
      ]
    },
    client: {
      title: 'Content Performance Dashboard',
      subtitle: 'Track your brand\'s content ecosystem',
      quickActions: [
        { title: 'Review Drafts', desc: '3 pieces pending approval', icon: FileText, href: '/content', color: 'bg-amber-50 text-amber-700' },
        { title: 'View Calendar', desc: 'See upcoming content', icon: Calendar, href: '/channels', color: 'bg-blue-50 text-blue-700' },
        { title: 'Performance', desc: 'Latest metrics & insights', icon: TrendingUp, href: '/analytics', color: 'bg-green-50 text-green-700' }
      ],
      stats: [
        { label: 'Posts This Month', value: '24', change: 'On schedule', trend: 'up' },
        { label: 'Total Reach', value: '15.2K', change: '+23% vs last month', trend: 'up' },
        { label: 'Engagement Rate', value: '12.3%', change: '+2.1% improvement', trend: 'up' },
        { label: 'Leads Generated', value: '18', change: '+6 this month', trend: 'up' }
      ]
    },
    gtm: {
      title: 'Pipeline Dashboard',
      subtitle: 'Convert content signals into revenue',
      quickActions: [
        { title: 'Lead Queue', desc: '8 high-intent prospects', icon: Target, href: '/pipeline', color: 'bg-red-50 text-red-700' },
        { title: 'Task Briefs', desc: 'Follow up on warm leads', icon: Users, href: '/pipeline', color: 'bg-blue-50 text-blue-700' },
        { title: 'Performance', desc: 'Track conversion metrics', icon: BarChart3, href: '/analytics', color: 'bg-green-50 text-green-700' }
      ],
      stats: [
        { label: 'Active Leads', value: '47', change: '+12 this week', trend: 'up' },
        { label: 'Qualified Prospects', value: '18', change: '+5 high-intent', trend: 'up' },
        { label: 'Meetings Booked', value: '12', change: '+4 this month', trend: 'up' },
        { label: 'Pipeline Value', value: '$180K', change: '+$45K potential', trend: 'up' }
      ]
    },
    leadership: {
      title: 'Executive Dashboard',
      subtitle: 'Oversee content operations & growth',
      quickActions: [
        { title: 'Team Performance', desc: 'Monitor strategist metrics', icon: Users, href: '/team', color: 'bg-purple-50 text-purple-700' },
        { title: 'Client Overview', desc: 'Portfolio health check', icon: BarChart3, href: '/analytics', color: 'bg-blue-50 text-blue-700' },
        { title: 'Revenue Impact', desc: 'Content ROI analysis', icon: TrendingUp, href: '/analytics', color: 'bg-green-50 text-green-700' },
        { title: 'System Settings', desc: 'Configure modules & permissions', icon: Zap, href: '/settings', color: 'bg-orange-50 text-orange-700' }
      ],
      stats: [
        { label: 'Monthly Revenue', value: '$127K', change: '+18% growth', trend: 'up' },
        { label: 'Client Retention', value: '94%', change: '+2% improvement', trend: 'up' },
        { label: 'Team Efficiency', value: '87%', change: '+5% this quarter', trend: 'up' },
        { label: 'Content Velocity', value: '156', change: '+34 pieces/month', trend: 'up' }
      ]
    }
  };

  const content = roleSpecificContent[user?.role || 'strategist'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground text-lg">
          {content.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.stats.map((stat, index) => (
          <Card key={index} className="smooth-transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <Badge variant="outline">
            {content.quickActions.length} available
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="smooth-transition hover:shadow-md hover:scale-105 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium group-hover:text-primary smooth-transition">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.desc}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary smooth-transition" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates from your content ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New LinkedIn post published', client: 'TechCorp', time: '2 hours ago', type: 'success' },
              { action: 'YouTube vlog uploaded', client: 'SaaS Startup', time: '4 hours ago', type: 'info' },
              { action: 'Lead magnet downloaded 12 times', client: 'Enterprise Co', time: '6 hours ago', type: 'success' },
              { action: 'Newsletter sent to 1,200 subscribers', client: 'Growth Agency', time: '1 day ago', type: 'info' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 smooth-transition">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.client} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}