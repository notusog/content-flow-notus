import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';

interface AgentConfig {
  name: string;
  provider: 'openai' | 'anthropic';
  model: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
}

const defaultConfigs: Record<string, AgentConfig> = {
  content_strategist: {
    name: 'Content Strategist AI',
    provider: 'openai',
    model: 'gpt-4.1-2025-04-14',
    prompt: `You are an expert content strategist with deep knowledge of content marketing, social media strategy, and brand building. 

Your expertise includes:
- Content planning and editorial calendars
- Platform-specific content optimization
- Audience analysis and targeting
- Brand voice and messaging
- Content performance analysis
- SEO and content distribution strategies

Always provide actionable, strategic advice that considers business goals, target audience, and platform best practices. Use the knowledge base provided to give contextual recommendations.`,
    temperature: 0.7,
    maxTokens: 2000
  },
  copywriter: {
    name: 'AI Copywriter',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    prompt: `You are a professional copywriter specializing in persuasive, engaging content across all platforms and formats.

Your expertise includes:
- Sales copy and conversion optimization
- Social media copy that drives engagement
- Email marketing campaigns
- Brand messaging and voice development
- A/B testing and copy optimization
- Storytelling and emotional connection

Write compelling copy that converts while maintaining authenticity and brand alignment. Always consider the target audience and desired action. Use the provided knowledge base to ensure brand consistency.`,
    temperature: 0.8,
    maxTokens: 1500
  },
  brand_analyst: {
    name: 'Brand Analyst AI',
    provider: 'openai',
    model: 'gpt-4.1-2025-04-14',
    prompt: `You are a brand analyst with expertise in brand strategy, market positioning, and competitive analysis.

Your expertise includes:
- Brand positioning and differentiation
- Competitive landscape analysis
- Market research and insights
- Brand perception and reputation management
- Visual identity and brand guidelines
- Brand extension and growth strategies

Provide data-driven insights and strategic recommendations for brand development and positioning. Use the knowledge base to understand the current brand context and market position.`,
    temperature: 0.6,
    maxTokens: 2000
  },
  client_consultant: {
    name: 'Client Consultant AI',
    provider: 'openai',
    model: 'gpt-4.1-2025-04-14',
    prompt: `You are a helpful client consultant focused on understanding client needs and providing tailored solutions.

Your expertise includes:
- Client relationship management
- Solution consulting and recommendations
- Project planning and timeline management
- Communication and expectation setting
- Problem-solving and troubleshooting
- Strategic business advice

Always be professional, empathetic, and solution-focused. Ask clarifying questions when needed and provide clear, actionable recommendations. Use the knowledge base to provide contextual and relevant advice.`,
    temperature: 0.7,
    maxTokens: 1800
  }
};

export function AgentConfiguration() {
  const [selectedAgent, setSelectedAgent] = useState('content_strategist');
  const [config, setConfig] = useState<AgentConfig>(defaultConfigs.content_strategist);
  const [isSaving, setIsSaving] = useState(false);
  const [customConfigs, setCustomConfigs] = useState<Record<string, AgentConfig>>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    loadCustomConfigs();
  }, [currentWorkspace]);

  useEffect(() => {
    const selectedConfig = customConfigs[selectedAgent] || defaultConfigs[selectedAgent];
    setConfig(selectedConfig);
  }, [selectedAgent, customConfigs]);

  const loadCustomConfigs = async () => {
    if (!currentWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('workspace_context')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('context_type', 'agent_config');

      if (error) throw error;

      const configs: Record<string, AgentConfig> = {};
      data?.forEach(item => {
        try {
          configs[item.title] = JSON.parse(item.content);
        } catch (e) {
          console.error('Error parsing agent config:', e);
        }
      });

      setCustomConfigs(configs);
    } catch (error) {
      console.error('Error loading custom configs:', error);
    }
  };

  const saveConfig = async () => {
    if (!user || !currentWorkspace) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('workspace_context')
        .upsert({
          workspace_id: currentWorkspace.id,
          user_id: user.id,
          context_type: 'agent_config',
          title: selectedAgent,
          content: JSON.stringify(config)
        }, {
          onConflict: 'workspace_id,context_type,title'
        });

      if (error) throw error;

      setCustomConfigs(prev => ({
        ...prev,
        [selectedAgent]: config
      }));

      toast({
        title: "Configuration Saved",
        description: `${config.name} configuration has been updated`,
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "Failed to save agent configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = () => {
    setConfig(defaultConfigs[selectedAgent]);
    toast({
      title: "Reset to Default",
      description: "Configuration reset to default values",
    });
  };

  const agentOptions = Object.keys(defaultConfigs).map(key => ({
    value: key,
    label: defaultConfigs[key].name
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Configuration</h2>
          <p className="text-muted-foreground">
            Customize AI agent behavior, prompts, and model settings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetToDefault}>
            Reset to Default
          </Button>
          <Button onClick={saveConfig} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Agent Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="agent-select">Select Agent to Configure</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agentOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="prompt">System Prompt</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Agent display name"
                />
              </div>

              <div>
                <Label htmlFor="provider">AI Provider</Label>
                <Select 
                  value={config.provider} 
                  onValueChange={(value: 'openai' | 'anthropic') => 
                    setConfig(prev => ({ ...prev, provider: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Select 
                  value={config.model}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.provider === 'openai' ? (
                      <>
                        <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1 (Recommended)</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4 (Recommended)</SelectItem>
                        <SelectItem value="claude-opus-4-20250514">Claude Opus 4</SelectItem>
                        <SelectItem value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt">
          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <p className="text-sm text-muted-foreground">
                Define the agent's expertise, personality, and behavior
              </p>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="prompt">System Prompt</Label>
                <Textarea
                  id="prompt"
                  value={config.prompt}
                  onChange={(e) => setConfig(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Enter the system prompt for this agent..."
                  className="min-h-[300px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This prompt defines the agent's role, expertise, and how it should respond to users.
                  The agent will also have access to your knowledge base for contextual responses.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Fine-tune model behavior and response characteristics
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="temperature">
                  Temperature: {config.temperature}
                </Label>
                <input
                  type="range"
                  id="temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    temperature: parseFloat(e.target.value) 
                  }))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Lower values (0.1-0.3) for focused responses, higher values (0.7-1.0) for creative responses
                </p>
              </div>

              <div>
                <Label htmlFor="maxTokens">Maximum Response Length</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    maxTokens: parseInt(e.target.value) || 1500 
                  }))}
                  placeholder="Maximum tokens in response"
                  min="100"
                  max="4000"
                />
                <p className="text-xs text-muted-foreground">
                  Approximate words in response (1 token ≈ 0.75 words)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}