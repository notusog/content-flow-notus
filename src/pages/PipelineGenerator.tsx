import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Phone,
  Mail,
  Linkedin,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Star
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  score: number;
  source: 'linkedin' | 'youtube' | 'newsletter' | 'lead-magnet';
  engagement: string;
  lastActivity: string;
  status: 'new' | 'contacted' | 'qualified' | 'meeting' | 'closed';
  avatar: string;
}

interface Task {
  id: string;
  type: 'follow-up' | 'research' | 'meeting' | 'proposal';
  leadId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
}

const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    company: 'TechFlow Inc',
    title: 'VP Marketing',
    score: 92,
    source: 'linkedin',
    engagement: 'Liked and commented on 3 posts about content strategy',
    lastActivity: '2 hours ago',
    status: 'new',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    company: 'Growth Labs',
    title: 'Content Director',
    score: 88,
    source: 'youtube',
    engagement: 'Watched full vlog, subscribed, and left detailed comment',
    lastActivity: '4 hours ago',
    status: 'contacted',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Michael Thompson',
    company: 'Enterprise Solutions',
    title: 'Marketing Manager',
    score: 76,
    source: 'newsletter',
    engagement: 'Opened last 5 newsletters, clicked 3 times',
    lastActivity: '1 day ago',
    status: 'qualified',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Lisa Wang',
    company: 'SaaS Startup Co',
    title: 'Founder',
    score: 94,
    source: 'lead-magnet',
    engagement: 'Downloaded content audit checklist, high email engagement',
    lastActivity: '6 hours ago',
    status: 'meeting',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

const sampleTasks: Task[] = [
  {
    id: '1',
    type: 'follow-up',
    leadId: '1',
    title: 'Follow up on LinkedIn engagement',
    description: 'Alex showed high interest in our content strategy post. Send personalized connection request.',
    priority: 'high',
    dueDate: 'Today',
    completed: false
  },
  {
    id: '2',
    type: 'research',
    leadId: '2',
    title: 'Research Growth Labs content needs',
    description: 'Deep dive into their current content strategy and identify gaps we can fill.',
    priority: 'medium',
    dueDate: 'Tomorrow',
    completed: false
  },
  {
    id: '3',
    type: 'meeting',
    leadId: '4',
    title: 'Discovery call with Lisa Wang',
    description: 'Scheduled 30-min call to discuss content strategy needs for SaaS Startup Co.',
    priority: 'high',
    dueDate: 'Jan 18, 2:00 PM',
    completed: false
  }
];

const sourceIcons = {
  linkedin: Linkedin,
  youtube: Target,
  newsletter: Mail,
  'lead-magnet': TrendingUp
};

const scoreColors = {
  high: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-red-600 bg-red-50'
};

const getScoreLevel = (score: number) => {
  if (score >= 85) return 'high';
  if (score >= 70) return 'medium';
  return 'low';
};

export default function PipelineGenerator() {
  const [selectedTab, setSelectedTab] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredLeads = sampleLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingTasks = sampleTasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline Generator</h1>
          <p className="text-muted-foreground">
            Convert content signals into qualified leads and revenue
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-600 border-green-200">
            {filteredLeads.filter(l => l.score >= 85).length} High-Intent
          </Badge>
          <Badge variant="outline" className="text-amber-600 border-amber-200">
            {pendingTasks.length} Pending Tasks
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Active Leads</p>
                <p className="text-2xl font-bold">{sampleLeads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Avg. Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(sampleLeads.reduce((acc, lead) => acc + lead.score, 0) / sampleLeads.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Due Today</p>
                <p className="text-2xl font-bold">{highPriorityTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Pipeline Value</p>
                <p className="text-2xl font-bold">$180K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="leads">Lead Queue</TabsTrigger>
          <TabsTrigger value="tasks">
            Task Briefs 
            {pendingTasks.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {pendingTasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-2 bg-background"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="meeting">Meeting Set</option>
            </select>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredLeads.map((lead) => {
              const SourceIcon = sourceIcons[lead.source];
              const scoreLevel = getScoreLevel(lead.score);
              
              return (
                <Card key={lead.id} className="hover:shadow-md smooth-transition">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={lead.avatar} 
                          alt={lead.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{lead.name}</h3>
                          <p className="text-sm text-muted-foreground">{lead.title}</p>
                          <p className="text-sm font-medium">{lead.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${scoreColors[scoreLevel]}`}>
                          <Star className="h-3 w-3 mr-1" />
                          {lead.score}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <SourceIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{lead.source.replace('-', ' ')}</span>
                      <Badge variant="outline" className="text-xs">
                        {lead.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {lead.engagement}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        Last activity: {lead.lastActivity}
                      </span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-4">
            {pendingTasks.map((task) => {
              const lead = sampleLeads.find(l => l.id === task.leadId);
              const priorityColors = {
                high: 'border-l-red-500 bg-red-50/50',
                medium: 'border-l-yellow-500 bg-yellow-50/50',
                low: 'border-l-green-500 bg-green-50/50'
              };
              
              return (
                <Card key={task.id} className={`border-l-4 ${priorityColors[task.priority]} hover:shadow-md smooth-transition`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge variant="outline" className="text-xs capitalize">
                            {task.type.replace('-', ' ')}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                                   task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                                   'bg-green-100 text-green-700'}`}
                          >
                            {task.priority} priority
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {task.description}
                        </p>
                        
                        {lead && (
                          <div className="flex items-center space-x-2 mb-3">
                            <img 
                              src={lead.avatar} 
                              alt={lead.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium">{lead.name}</span>
                            <span className="text-sm text-muted-foreground">at {lead.company}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead progression through pipeline stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: 'Content Engagement', count: 247, percentage: 100 },
                    { stage: 'Lead Scored', count: 89, percentage: 36 },
                    { stage: 'Qualified', count: 34, percentage: 14 },
                    { stage: 'Meeting Set', count: 18, percentage: 7 },
                    { stage: 'Closed Won', count: 8, percentage: 3 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-24 text-sm font-medium">{item.stage}</div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full smooth-transition"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground w-16 text-right">
                        {item.count} ({item.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
                <CardDescription>Lead quality by content channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'LinkedIn Posts', leads: 34, score: 87, icon: Linkedin },
                    { source: 'YouTube Vlogs', leads: 28, score: 91, icon: Target },
                    { source: 'Newsletter', leads: 18, score: 76, icon: Mail },
                    { source: 'Lead Magnets', leads: 9, score: 94, icon: TrendingUp }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{item.source}</p>
                          <p className="text-xs text-muted-foreground">{item.leads} leads</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">Avg. Score: {item.score}</p>
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