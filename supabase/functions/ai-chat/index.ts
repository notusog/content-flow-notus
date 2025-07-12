import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, agentType, workspaceId, userId, conversationId } = await req.json();
    
    console.log('AI Chat request:', { agentType, workspaceId, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get agent configuration
    const agentConfig = await getAgentConfig(supabase, agentType, workspaceId);
    
    // Get relevant knowledge base content
    const knowledgeBase = await getKnowledgeBase(supabase, workspaceId, message);
    
    // Get conversation history
    const conversationHistory = await getConversationHistory(supabase, conversationId);

    // Prepare system prompt with knowledge base
    const systemPrompt = buildSystemPrompt(agentConfig, knowledgeBase);
    
    // Get API key based on agent configuration
    const apiKey = agentConfig.provider === 'anthropic' 
      ? Deno.env.get('ANTHROPIC_API_KEY')
      : Deno.env.get('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error(`API key not configured for provider: ${agentConfig.provider}`);
    }

    // Call appropriate LLM
    let response;
    if (agentConfig.provider === 'anthropic') {
      response = await callAnthropicAPI(apiKey, systemPrompt, message, conversationHistory);
    } else {
      response = await callOpenAIAPI(apiKey, systemPrompt, message, conversationHistory);
    }

    // Store conversation in database
    await storeConversation(supabase, {
      conversationId,
      userId,
      workspaceId,
      userMessage: message,
      assistantMessage: response,
      agentType
    });

    return new Response(JSON.stringify({ 
      response,
      agentType,
      knowledgeUsed: knowledgeBase.length > 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getAgentConfig(supabase: any, agentType: string, workspaceId: string) {
  // First try to get custom agent config from workspace_context
  const { data: customConfig } = await supabase
    .from('workspace_context')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('context_type', 'agent_config')
    .eq('title', agentType)
    .single();

  if (customConfig) {
    return JSON.parse(customConfig.content);
  }

  // Fallback to default agent configurations
  const defaultConfigs = {
    'content_strategist': {
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
    'copywriter': {
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
    'brand_analyst': {
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
    'client_consultant': {
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

  return defaultConfigs[agentType] || defaultConfigs['client_consultant'];
}

async function getKnowledgeBase(supabase: any, workspaceId: string, message: string) {
  // Get relevant content sources and workspace context
  const { data: contentSources } = await supabase
    .from('content_sources')
    .select('title, summary, content, insights, related_topics')
    .eq('workspace_id', workspaceId)
    .limit(5);

  const { data: workspaceContext } = await supabase
    .from('workspace_context')
    .select('title, content, context_type')
    .eq('workspace_id', workspaceId)
    .limit(5);

  // Get personal brand information
  const { data: personalBrands } = await supabase
    .from('personal_brands')
    .select('name, description, bio, tone_of_voice, expertise_areas')
    .eq('workspace_id', workspaceId)
    .limit(3);

  return [
    ...(contentSources || []),
    ...(workspaceContext || []),
    ...(personalBrands || [])
  ];
}

function buildSystemPrompt(agentConfig: any, knowledgeBase: any[]) {
  let systemPrompt = agentConfig.prompt;

  if (knowledgeBase.length > 0) {
    systemPrompt += '\n\nKNOWLEDGE BASE:\n';
    systemPrompt += knowledgeBase.map(item => {
      if (item.title && item.content) {
        return `${item.title}: ${item.content}`;
      }
      if (item.name && item.description) {
        return `Brand: ${item.name} - ${item.description}`;
      }
      if (item.tone_of_voice) {
        return `Tone of Voice: ${item.tone_of_voice}`;
      }
      if (item.bio) {
        return `Bio: ${item.bio}`;
      }
      if (item.expertise_areas) {
        return `Expertise: ${item.expertise_areas.join(', ')}`;
      }
      return JSON.stringify(item);
    }).join('\n\n');
    
    systemPrompt += '\n\nIMPORTANT: Use this knowledge base to provide contextual and accurate responses. When generating content, especially for LinkedIn posts, follow the tone of voice patterns and personal brand guidelines provided. Reference specific information when relevant and maintain consistency with the established brand voice.';
  }

  return systemPrompt;
}

async function callOpenAIAPI(apiKey: string, systemPrompt: string, message: string, history: any[]) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => [
      { role: 'user', content: h.user_message },
      { role: 'assistant', content: h.assistant_message }
    ]).flat(),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropicAPI(apiKey: string, systemPrompt: string, message: string, history: any[]) {
  const messages = [
    ...history.map(h => [
      { role: 'user', content: h.user_message },
      { role: 'assistant', content: h.assistant_message }
    ]).flat(),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}

async function getConversationHistory(supabase: any, conversationId: string) {
  if (!conversationId) return [];

  const { data } = await supabase
    .from('chat_conversations')
    .select('user_message, assistant_message')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(10);

  return data || [];
}

async function storeConversation(supabase: any, {
  conversationId,
  userId,
  workspaceId,
  userMessage,
  assistantMessage,
  agentType
}: any) {
  await supabase.from('chat_conversations').insert({
    conversation_id: conversationId,
    user_id: userId,
    workspace_id: workspaceId,
    user_message: userMessage,
    assistant_message: assistantMessage,
    agent_type: agentType
  });
}