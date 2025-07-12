import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Settings, Brain, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
}

interface AIAgentChatProps {
  defaultAgentType?: string;
  onClose?: () => void;
}

const agentTypes = [
  {
    id: 'content_strategist',
    name: 'Content Strategist',
    description: 'Expert in content planning and strategy',
    icon: Brain,
    color: 'bg-blue-500'
  },
  {
    id: 'copywriter',
    name: 'AI Copywriter', 
    description: 'Persuasive writing and conversion copy',
    icon: MessageSquare,
    color: 'bg-purple-500'
  },
  {
    id: 'brand_analyst',
    name: 'Brand Analyst',
    description: 'Brand strategy and market positioning',
    icon: Bot,
    color: 'bg-green-500'
  },
  {
    id: 'client_consultant',
    name: 'Client Consultant',
    description: 'Client relationship and project guidance',
    icon: User,
    color: 'bg-orange-500'
  }
];

export function AIAgentChat({ defaultAgentType = 'client_consultant', onClose }: AIAgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(defaultAgentType);
  const [conversationId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const currentAgentInfo = agentTypes.find(agent => agent.id === selectedAgent);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !currentWorkspace) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputMessage,
          agentType: selectedAgent,
          workspaceId: currentWorkspace.id,
          userId: user.id,
          conversationId
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        agentType: selectedAgent
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.knowledgeUsed) {
        toast({
          title: "Knowledge Base Used",
          description: "Response enhanced with your workspace knowledge",
          duration: 3000,
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI agent",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    toast({
      title: "Conversation Cleared",
      description: "Chat history has been reset",
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentAgentInfo?.icon && (
              <div className={`p-2 rounded-lg ${currentAgentInfo.color} text-white`}>
                <currentAgentInfo.icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{currentAgentInfo?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{currentAgentInfo?.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agentTypes.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center space-x-2">
                      <agent.icon className="h-4 w-4" />
                      <span>{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={clearConversation}>
              Clear
            </Button>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with your AI agent</p>
                <p className="text-sm">Your knowledge base will be used to provide contextual responses</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && currentAgentInfo && (
                      <currentAgentInfo.icon className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.agentType && (
                          <Badge variant="secondary" className="text-xs">
                            {agentTypes.find(a => a.id === message.agentType)?.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${currentAgentInfo?.name}...`}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}