import React, { useState } from 'react';
import { Bot, MessageSquare, Plus, Settings, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAgentChat } from '@/components/ai/AIAgentChat';
import { AgentConfiguration } from '@/components/ai/AgentConfiguration';
import { KnowledgeBaseManager } from '@/components/ai/KnowledgeBaseManager';

const agentTypes = [
  {
    id: 'content_strategist',
    name: 'Content Strategist',
    description: 'Expert in content planning, editorial calendars, and strategic content marketing',
    icon: Bot,
    color: 'bg-blue-500',
    features: ['Content Planning', 'SEO Strategy', 'Audience Analysis', 'Performance Metrics']
  },
  {
    id: 'copywriter',
    name: 'AI Copywriter',
    description: 'Persuasive writing specialist for sales copy, social media, and conversion optimization',
    icon: MessageSquare,
    color: 'bg-purple-500',
    features: ['Sales Copy', 'Social Media', 'Email Campaigns', 'A/B Testing']
  },
  {
    id: 'brand_analyst',
    name: 'Brand Analyst',
    description: 'Brand strategy expert for positioning, competitive analysis, and market insights',
    icon: Database,
    color: 'bg-green-500',
    features: ['Brand Positioning', 'Competitive Analysis', 'Market Research', 'Brand Guidelines']
  },
  {
    id: 'client_consultant',
    name: 'Client Consultant',
    description: 'Client relationship specialist for project management and strategic business advice',
    icon: Settings,
    color: 'bg-orange-500',
    features: ['Client Relations', 'Project Planning', 'Business Strategy', 'Problem Solving']
  }
];

export function AIAgentsHub() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">
            Chat with specialized AI agents powered by your knowledge base
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showKnowledgeBase} onOpenChange={setShowKnowledgeBase}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Knowledge Base
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Knowledge Base Manager</DialogTitle>
              </DialogHeader>
              <KnowledgeBaseManager />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showConfiguration} onOpenChange={setShowConfiguration}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Agents
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agent Configuration</DialogTitle>
              </DialogHeader>
              <AgentConfiguration />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {selectedAgent ? (
        <AIAgentChat 
          defaultAgentType={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentTypes.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${agent.color} text-white`}>
                      <agent.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{agent.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {agent.features.map((feature) => (
                        <span 
                          key={feature}
                          className="px-2 py-1 bg-muted rounded-md text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Button 
                      onClick={() => setSelectedAgent(agent.id)}
                      className="w-full"
                    >
                      Start Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>How AI Agents Work</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold mb-2">Knowledge Base</h3>
                  <p className="text-sm text-muted-foreground">
                    Agents use your content sources, personal brands, and workspace context for informed responses
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold mb-2">Specialized Prompts</h3>
                  <p className="text-sm text-muted-foreground">
                    Each agent has expert-level prompts tailored for specific roles and use cases
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold mb-2">Contextual Responses</h3>
                  <p className="text-sm text-muted-foreground">
                    Get relevant, actionable advice based on your specific business context and goals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}