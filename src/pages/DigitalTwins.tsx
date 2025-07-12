import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Send, 
  Users, 
  MessageCircle, 
  Star,
  Brain,
  Zap,
  Settings,
  Upload,
  Play
} from 'lucide-react';

interface DigitalTwin {
  id: string;
  name: string;
  role: string;
  avatar: string;
  expertise: string[];
  personality: string;
  trainingData: {
    youtube: number;
    calls: number;
    posts: number;
    content: number;
  };
  status: 'active' | 'training' | 'offline';
  lastUpdated: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'twin';
  content: string;
  timestamp: string;
  twinId?: string;
}

const digitalTwins: DigitalTwin[] = [
  {
    id: 'marvin-sangines',
    name: 'Marvin Sangines',
    role: 'Content Strategist',
    avatar: '/api/placeholder/150/150',
    expertise: ['Content Strategy', 'LinkedIn Growth', 'B2B Marketing', 'Personal Branding'],
    personality: 'Strategic, analytical, growth-focused with a passion for data-driven content',
    trainingData: {
      youtube: 45,
      calls: 120,
      posts: 350,
      content: 80
    },
    status: 'active',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'max-radman',
    name: 'Max Radman',
    role: 'Content Strategist',
    avatar: '/api/placeholder/150/150',
    expertise: ['Content Creation', 'Social Media', 'Brand Voice', 'Copywriting'],
    personality: 'Creative, energetic, brand-focused with expertise in authentic storytelling',
    trainingData: {
      youtube: 28,
      calls: 95,
      posts: 280,
      content: 65
    },
    status: 'active',
    lastUpdated: '2024-01-14'
  },
  {
    id: 'tim-chilling',
    name: 'Tim Chilling',
    role: 'YouTube Editor',
    avatar: '/api/placeholder/150/150',
    expertise: ['Video Editing', 'YouTube Strategy', 'Content Production', 'Visual Storytelling'],
    personality: 'Creative, detail-oriented, production-focused with expertise in video content',
    trainingData: {
      youtube: 65,
      calls: 40,
      posts: 150,
      content: 90
    },
    status: 'training',
    lastUpdated: '2024-01-13'
  },
  {
    id: 'luca-wetzel',
    name: 'Luca Wetzel',
    role: 'COO',
    avatar: '/api/placeholder/150/150',
    expertise: ['Operations', 'Strategy', 'Team Management', 'Process Optimization'],
    personality: 'Strategic, operational, efficiency-focused with expertise in scaling businesses',
    trainingData: {
      youtube: 20,
      calls: 200,
      posts: 180,
      content: 45
    },
    status: 'active',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'selim-burcu',
    name: 'Selim Burcu',
    role: 'Head of Partnerships',
    avatar: '/api/placeholder/150/150',
    expertise: ['Partnerships', 'Business Development', 'Relationship Building', 'Growth'],
    personality: 'Relationship-focused, strategic, growth-oriented with expertise in partnerships',
    trainingData: {
      youtube: 15,
      calls: 180,
      posts: 220,
      content: 35
    },
    status: 'active',
    lastUpdated: '2024-01-14'
  }
];

export default function DigitalTwins() {
  const { toast } = useToast();
  const [selectedTwin, setSelectedTwin] = useState<DigitalTwin | null>(digitalTwins[0]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'twin',
      content: 'Hey! I\'m the digital twin of Marvin Sangines. I can help you with content strategy, LinkedIn growth, and B2B marketing insights based on my training data. What would you like to discuss?',
      timestamp: new Date().toISOString(),
      twinId: 'marvin-sangines'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTwin) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const twinResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'twin',
        content: generateTwinResponse(newMessage, selectedTwin),
        timestamp: new Date().toISOString(),
        twinId: selectedTwin.id
      };
      setChatMessages(prev => [...prev, twinResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateTwinResponse = (message: string, twin: DigitalTwin): string => {
    const responses = {
      'marvin-sangines': [
        "Based on my experience with content strategy, I'd recommend focusing on data-driven approaches...",
        "From what I've learned through LinkedIn growth tactics, the key is consistency and value-first content...",
        "In B2B marketing, I've found that authentic personal branding drives the best results..."
      ],
      'max-radman': [
        "From a creative content perspective, I think we should focus on authentic storytelling...",
        "Brand voice is crucial here - let me share what I've learned about developing consistent messaging...",
        "In my copywriting experience, the most effective content connects emotionally with the audience..."
      ],
      'tim-chilling': [
        "From a video production standpoint, the key is creating engaging visual narratives...",
        "Based on my YouTube editing experience, retention comes down to pacing and story structure...",
        "Visual storytelling is all about capturing attention in the first 3 seconds..."
      ],
      'luca-wetzel': [
        "From an operational perspective, we need to systematize this process for scalability...",
        "Strategic planning is key here - let me break down how we can optimize this workflow...",
        "Based on my experience scaling teams, the most important factor is clear processes..."
      ],
      'selim-burcu': [
        "Partnership opportunities come from building genuine relationships first...",
        "In business development, I've learned that value alignment is crucial for long-term success...",
        "Growth through partnerships requires a strategic approach to relationship building..."
      ]
    };

    const twinResponses = responses[twin.id as keyof typeof responses] || responses['marvin-sangines'];
    return twinResponses[Math.floor(Math.random() * twinResponses.length)];
  };

  const getStatusColor = (status: DigitalTwin['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Bot className="h-8 w-8 text-primary" />
            <span>Digital Twins</span>
          </h1>
          <p className="text-muted-foreground">
            Chat with AI-powered digital twins of Notus content strategists
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Train Twin
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Twin Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Available Twins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {digitalTwins.map((twin) => (
                <div
                  key={twin.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTwin?.id === twin.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTwin(twin)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={twin.avatar} alt={twin.name} />
                        <AvatarFallback>{twin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(twin.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{twin.name}</p>
                      <p className="text-xs text-muted-foreground">{twin.role}</p>
                      <Badge variant="outline" className="text-xs mt-1 capitalize">
                        {twin.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              {selectedTwin && (
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedTwin.avatar} alt={selectedTwin.name} />
                    <AvatarFallback>{selectedTwin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedTwin.name}</CardTitle>
                    <CardDescription>{selectedTwin.role}</CardDescription>
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask me anything about content strategy..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Twin Details */}
        <div className="lg:col-span-1 space-y-4">
          {selectedTwin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Twin Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTwin.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Personality</h4>
                    <p className="text-sm text-muted-foreground">{selectedTwin.personality}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Training Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">YouTube Videos</span>
                    <Badge variant="outline">{selectedTwin.trainingData.youtube}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Call Recordings</span>
                    <Badge variant="outline">{selectedTwin.trainingData.calls}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">LinkedIn Posts</span>
                    <Badge variant="outline">{selectedTwin.trainingData.posts}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Content Pieces</span>
                    <Badge variant="outline">{selectedTwin.trainingData.content}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Customize Twin
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}