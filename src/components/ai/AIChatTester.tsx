import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Bot, TestTube } from 'lucide-react';

export function AIChatTester() {
  const [testMessage, setTestMessage] = useState('Hello! Can you help me with content strategy?');
  const [testAgent, setTestAgent] = useState('content_strategist');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const testAIChat = async () => {
    if (!user || !currentWorkspace) {
      setError('User or workspace not available');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      console.log('Testing AI chat with:', {
        agent: testAgent,
        workspace: currentWorkspace.id,
        user: user.id
      });

      const { data, error: invokeError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: testMessage,
          agentType: testAgent,
          workspaceId: currentWorkspace.id,
          userId: user.id,
          conversationId: crypto.randomUUID()
        }
      });

      console.log('AI chat response:', { data, error: invokeError });

      if (invokeError) {
        throw new Error(`Invoke error: ${JSON.stringify(invokeError)}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResponse(data.response);
      toast({
        title: "AI Chat Test Successful",
        description: "The AI agent responded successfully!",
      });

    } catch (error) {
      console.error('AI chat test error:', error);
      setError(error.message);
      toast({
        title: "AI Chat Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const agents = [
    { id: 'content_strategist', name: 'Content Strategist', provider: 'OpenAI' },
    { id: 'copywriter', name: 'Copywriter', provider: 'Claude 4.0' },
    { id: 'brand_analyst', name: 'Brand Analyst', provider: 'OpenAI' },
    { id: 'client_consultant', name: 'Client Consultant', provider: 'OpenAI' }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="h-5 w-5" />
          <span>AI Chat Tester</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the AI chat functionality and verify API connections
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Select Agent:</label>
            <select
              value={testAgent}
              onChange={(e) => setTestAgent(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.provider})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Badge variant="outline" className="mb-2">
              Current: {agents.find(a => a.id === testAgent)?.provider}
            </Badge>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Test Message:</label>
          <Input
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="mt-1"
            placeholder="Enter a test message..."
          />
        </div>

        <Button 
          onClick={testAIChat} 
          disabled={isLoading || !testMessage.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing AI Chat...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 mr-2" />
              Test AI Chat
            </>
          )}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-medium text-red-800 mb-2">Error:</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800 mb-2">AI Response:</h4>
            <p className="text-sm text-green-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Current User:</strong> {user?.email}</p>
          <p><strong>Current Workspace:</strong> {currentWorkspace?.name}</p>
          <p><strong>Workspace ID:</strong> {currentWorkspace?.id}</p>
        </div>
      </CardContent>
    </Card>
  );
}