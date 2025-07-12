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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Building, 
  ArrowRight,
  ArrowLeft,
  MoreHorizontal,
  Eye,
  Edit,
  Target,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CRM = () => {
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('all');

  // Sample data
  const people = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      company: "TechCorp",
      position: "Marketing Director",
      label: "client",
      avatar: "",
      status: "active",
      lastContact: "2024-01-15",
      pipelineStage: "proposal",
      dealValue: 25000,
      notes: "Interested in content strategy package"
    },
    {
      id: 2,
      name: "Max Radman",
      email: "max@notus.com",
      phone: "+1 (555) 234-5678",
      company: "notus",
      position: "Content Strategist",
      label: "team",
      avatar: "",
      status: "active",
      lastContact: "2024-01-18",
      pipelineStage: "",
      dealValue: 0,
      notes: "Content strategist and team member"
    },
    {
      id: 3,
      name: "John Partnership",
      email: "john@partner.co",
      phone: "+1 (555) 345-6789",
      company: "PartnerCo",
      position: "Business Development",
      label: "partner",
      avatar: "",
      status: "active",
      lastContact: "2024-01-10",
      pipelineStage: "negotiation",
      dealValue: 50000,
      notes: "Strategic partnership opportunity"
    },
    {
      id: 4,
      name: "Emma Friend",
      email: "emma@personal.com",
      phone: "+1 (555) 456-7890",
      company: "Personal",
      position: "Friend",
      label: "friend",
      avatar: "",
      status: "active",
      lastContact: "2024-01-12",
      pipelineStage: "",
      dealValue: 0,
      notes: "Personal connection"
    }
  ];

  const pipelineStages = [
    { id: 'lead', name: 'Lead', count: 12, color: 'bg-blue-500' },
    { id: 'qualified', name: 'Qualified', count: 8, color: 'bg-yellow-500' },
    { id: 'proposal', name: 'Proposal', count: 5, color: 'bg-orange-500' },
    { id: 'negotiation', name: 'Negotiation', count: 3, color: 'bg-purple-500' },
    { id: 'closed', name: 'Closed', count: 15, color: 'bg-green-500' }
  ];

  const labels = [
    { value: 'all', label: 'All People', count: people.length },
    { value: 'team', label: 'Team', count: people.filter(p => p.label === 'team').length },
    { value: 'client', label: 'Client', count: people.filter(p => p.label === 'client').length },
    { value: 'partner', label: 'Partner', count: people.filter(p => p.label === 'partner').length },
    { value: 'family', label: 'Family', count: people.filter(p => p.label === 'family').length },
    { value: 'friend', label: 'Friend', count: people.filter(p => p.label === 'friend').length },
    { value: 'private', label: 'Private', count: people.filter(p => p.label === 'private').length }
  ];

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'team': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'client': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'partner': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'family': return 'bg-pink-500/10 text-pink-700 border-pink-200';
      case 'friend': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'private': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getPipelineStageColor = (stage: string) => {
    const stageConfig = pipelineStages.find(s => s.id === stage);
    return stageConfig ? stageConfig.color : 'bg-gray-500';
  };

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLabel = selectedLabel === 'all' || person.label === selectedLabel;
    return matchesSearch && matchesLabel;
  });

  const moveToPipeline = (personId: number) => {
    console.log(`Moving person ${personId} to pipeline`);
    // Implementation for moving to pipeline
  };

  const removeFromPipeline = (personId: number) => {
    console.log(`Removing person ${personId} from pipeline`);
    // Implementation for removing from pipeline
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM</h1>
          <p className="text-muted-foreground">Manage your contacts and pipeline</p>
        </div>
        <Dialog open={isAddPersonOpen} onOpenChange={setIsAddPersonOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Person
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
              <DialogDescription>
                Add a new contact to your CRM database.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Enter company..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" placeholder="Enter position..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add any relevant notes..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsAddPersonOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddPersonOpen(false)}>
                  Add Person
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{people.length}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {people.filter(p => p.pipelineStage).length}
            </div>
            <div className="flex items-center text-sm text-blue-600 mt-1">
              <Target className="h-3 w-3 mr-1" />
              {people.filter(p => p.pipelineStage === 'proposal').length} in proposal
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${people.reduce((sum, p) => sum + p.dealValue, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-purple-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +$25k this quarter
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24%</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3% vs last quarter
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              {labels.map((label) => (
                <Button
                  key={label.value}
                  variant={selectedLabel === label.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLabel(label.value)}
                  className="text-xs"
                >
                  {label.label} ({label.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Contacts Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Pipeline Stage</TableHead>
                  <TableHead>Deal Value</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeople.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={person.avatar} />
                          <AvatarFallback>
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{person.company}</p>
                        <p className="text-xs text-muted-foreground">{person.position}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", getLabelColor(person.label))}>
                        {person.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {person.pipelineStage ? (
                        <Badge className={cn("text-xs text-white", getPipelineStageColor(person.pipelineStage))}>
                          {person.pipelineStage}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not in pipeline</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {person.dealValue > 0 ? (
                        <span className="font-medium">${person.dealValue.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{person.lastContact}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        {person.pipelineStage ? (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0"
                            onClick={() => removeFromPipeline(person.id)}
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0"
                            onClick={() => moveToPipeline(person.id)}
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          {/* Pipeline Stages */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map((stage) => (
              <Card key={stage.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {stage.count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {people
                      .filter(p => p.pipelineStage === stage.id)
                      .map((person) => (
                        <div key={person.id} className="p-2 bg-muted/50 rounded border">
                          <p className="font-medium text-xs">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.company}</p>
                          {person.dealValue > 0 && (
                            <p className="text-xs font-medium text-green-600">
                              ${person.dealValue.toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pipeline Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Analytics</CardTitle>
              <CardDescription>Track your sales pipeline performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    ${people.filter(p => p.pipelineStage === 'qualified').reduce((sum, p) => sum + p.dealValue, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Qualified Opportunities</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round((people.filter(p => p.pipelineStage === 'closed').length / people.filter(p => p.pipelineStage).length) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Close Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">14 days</div>
                  <p className="text-sm text-muted-foreground">Avg. Sales Cycle</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;