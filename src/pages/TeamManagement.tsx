import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Plus, 
  UserPlus,
  UserMinus,
  Settings,
  Mail,
  Phone,
  Calendar,
  Clock,
  Target,
  BarChart3,
  Shield,
  Key,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Star
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'strategist' | 'gtm' | 'leadership' | 'client';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  lastActive: Date;
  joinedDate: Date;
  permissions: string[];
  clients: string[];
  performance: {
    tasksCompleted: number;
    contentCreated: number;
    leadsGenerated: number;
    clientSatisfaction: number;
  };
  department: string;
  location: string;
  phone?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  level: 'executive' | 'manager' | 'specialist' | 'client';
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'admin',
    status: 'active',
    avatar: '/api/placeholder/32/32',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    joinedDate: new Date(2023, 0, 15),
    permissions: ['admin:all', 'users:manage', 'content:create', 'content:view', 'reports:view'],
    clients: ['All Clients'],
    performance: {
      tasksCompleted: 147,
      contentCreated: 89,
      leadsGenerated: 234,
      clientSatisfaction: 4.8
    },
    department: 'Operations',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@company.com',
    role: 'strategist',
    status: 'active',
    avatar: '/api/placeholder/32/32',
    lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    joinedDate: new Date(2023, 2, 10),
    permissions: ['content:create', 'content:view', 'insights:extract'],
    clients: ['TechCorp', 'InnovateLab'],
    performance: {
      tasksCompleted: 92,
      contentCreated: 156,
      leadsGenerated: 89,
      clientSatisfaction: 4.6
    },
    department: 'Strategy',
    location: 'Austin, TX',
    phone: '+1 (555) 987-6543'
  },
  {
    id: '3',
    name: 'Emily Thompson',
    email: 'emily.thompson@company.com',
    role: 'gtm',
    status: 'active',
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    joinedDate: new Date(2023, 5, 20),
    permissions: ['leads:view', 'content:schedule', 'reports:view'],
    clients: ['StartupXYZ', 'BusinessPro'],
    performance: {
      tasksCompleted: 78,
      contentCreated: 45,
      leadsGenerated: 312,
      clientSatisfaction: 4.9
    },
    department: 'Sales & Marketing',
    location: 'New York, NY',
    phone: '+1 (555) 456-7890'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@techcorp.com',
    role: 'client',
    status: 'active',
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    joinedDate: new Date(2023, 8, 5),
    permissions: ['content:view'],
    clients: ['TechCorp'],
    performance: {
      tasksCompleted: 23,
      contentCreated: 12,
      leadsGenerated: 45,
      clientSatisfaction: 4.7
    },
    department: 'Client',
    location: 'Seattle, WA',
    phone: '+1 (555) 321-0987'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'leadership',
    status: 'pending',
    joinedDate: new Date(2024, 0, 8),
    permissions: ['admin:all', 'users:manage', 'reports:view'],
    clients: ['All Clients'],
    performance: {
      tasksCompleted: 0,
      contentCreated: 0,
      leadsGenerated: 0,
      clientSatisfaction: 0
    },
    department: 'Executive',
    location: 'Los Angeles, CA',
    lastActive: new Date()
  }
];

const roleDefinitions: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access and user management',
    permissions: ['admin:all', 'users:manage', 'content:create', 'content:view', 'reports:view'],
    memberCount: 1,
    level: 'executive'
  },
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Strategic oversight and high-level management',
    permissions: ['admin:all', 'users:manage', 'reports:view'],
    memberCount: 1,
    level: 'executive'
  },
  {
    id: 'strategist',
    name: 'Content Strategist',
    description: 'Content creation and strategy development',
    permissions: ['content:create', 'content:view', 'insights:extract'],
    memberCount: 1,
    level: 'specialist'
  },
  {
    id: 'gtm',
    name: 'GTM Specialist',
    description: 'Go-to-market strategy and lead generation',
    permissions: ['leads:view', 'content:schedule', 'reports:view'],
    memberCount: 1,
    level: 'specialist'
  },
  {
    id: 'client',
    name: 'Client',
    description: 'View access to assigned content and reports',
    permissions: ['content:view'],
    memberCount: 1,
    level: 'client'
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const roleIcons = {
  admin: Crown,
  leadership: Star,
  strategist: Target,
  gtm: BarChart3,
  client: Users
};

const roleColors = {
  admin: 'text-purple-600',
  leadership: 'text-yellow-600',
  strategist: 'text-blue-600',
  gtm: 'text-green-600',
  client: 'text-gray-600'
};

export default function TeamManagement() {
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [roles] = useState<Role[]>(roleDefinitions);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const activeMembers = teamMembers.filter(member => member.status === 'active');
  const pendingMembers = teamMembers.filter(member => member.status === 'pending');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </div>
        </div>
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg z-50">
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg z-50">
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="sales">Sales & Marketing</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Send Invitation
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
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{activeMembers.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
                <p className="text-2xl font-bold">{pendingMembers.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Satisfaction</p>
                <p className="text-2xl font-bold">4.7</p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4">
            {teamMembers.map((member) => {
              const RoleIcon = roleIcons[member.role];
              return (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{member.name}</h3>
                            <Badge className={statusColors[member.status]}>
                              {member.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{member.email}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <RoleIcon className={`h-4 w-4 ${roleColors[member.role]}`} />
                              <span className="capitalize">{member.role}</span>
                            </div>
                            <span>•</span>
                            <span>{member.department}</span>
                            <span>•</span>
                            <span>{member.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Last active</p>
                          <p className="font-medium">{getTimeAgo(member.lastActive)}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-background border border-border shadow-lg z-50">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Manage Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {member.status === 'active' && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-lg font-bold">{member.performance.tasksCompleted}</p>
                          <p className="text-xs text-muted-foreground">Tasks Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{member.performance.contentCreated}</p>
                          <p className="text-xs text-muted-foreground">Content Created</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{member.performance.leadsGenerated}</p>
                          <p className="text-xs text-muted-foreground">Leads Generated</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{member.performance.clientSatisfaction}</p>
                          <p className="text-xs text-muted-foreground">Client Rating</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Permissions</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4">
            {roles.map((role) => {
              const RoleIcon = roleIcons[role.id as keyof typeof roleIcons];
              return (
                <Card key={role.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${role.level === 'executive' ? 'bg-purple-100 dark:bg-purple-900' : 
                          role.level === 'manager' ? 'bg-blue-100 dark:bg-blue-900' : 
                          role.level === 'specialist' ? 'bg-green-100 dark:bg-green-900' : 
                          'bg-gray-100 dark:bg-gray-800'}`}>
                          <RoleIcon className={`h-6 w-6 ${roleColors[role.id as keyof typeof roleColors]}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{role.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                          <p className="text-sm">
                            <span className="font-medium">{role.memberCount}</span> members assigned
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Permissions</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Based on overall productivity and client satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeMembers
                    .sort((a, b) => b.performance.clientSatisfaction - a.performance.clientSatisfaction)
                    .slice(0, 3)
                    .map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{member.performance.clientSatisfaction}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Metrics</CardTitle>
                <CardDescription>Overall team performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Client Satisfaction</span>
                    <span className="font-bold">4.7/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Tasks Completed</span>
                    <span className="font-bold">340</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Content Pieces Created</span>
                    <span className="font-bold">302</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Leads Generated</span>
                    <span className="font-bold">680</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Team Utilization</span>
                    <span className="font-bold text-green-600">87%</span>
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