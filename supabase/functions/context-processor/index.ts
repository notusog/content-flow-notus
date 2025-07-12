import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContextRequest {
  workspaceId: string;
  content: string;
  action: 'enhance' | 'summarize' | 'extract_insights' | 'generate_ideas';
  contextType?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workspaceId, content, action, contextType }: ContextRequest = await req.json();

    if (!workspaceId || !content || !action) {
      throw new Error('Workspace ID, content, and action are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing context with Claude:', { workspaceId, action });

    // Get workspace context for better AI responses
    const { data: workspaceContext } = await supabase
      .from('workspace_context')
      .select('*')
      .eq('workspace_id', workspaceId)
      .limit(10);

    const contextInfo = workspaceContext?.map(ctx => 
      `${ctx.context_type}: ${ctx.title} - ${ctx.content.substring(0, 200)}`
    ).join('\n') || '';

    // Define action-specific prompts
    const actionPrompts = {
      enhance: `Enhance and improve the following content. Make it more engaging, clear, and compelling while maintaining the original intent and tone:`,
      summarize: `Create a comprehensive summary of the following content, extracting key points and main ideas:`,
      extract_insights: `Analyze the following content and extract valuable insights, patterns, and actionable recommendations:`,
      generate_ideas: `Based on the following content, generate creative ideas and suggestions for related content, improvements, or new directions:`
    };

    let systemPrompt = `You are an AI content strategist and copywriting expert. You have access to workspace context to provide more relevant and personalized responses.

Workspace Context:
${contextInfo}

Your task: ${actionPrompts[action]}

Guidelines:
- Be specific and actionable
- Maintain consistency with workspace context when relevant
- Provide clear, well-structured responses
- Focus on practical value and implementation`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('ANTHROPIC_API_KEY')}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        temperature: 0.6,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: content
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${errorText}`);
    }

    const data = await response.json();
    const result = data.content[0].text;

    // Store the interaction in workspace context
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const jwt = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(jwt);
      
      if (user) {
        await supabase.from('workspace_context').insert({
          workspace_id: workspaceId,
          user_id: user.id,
          context_type: 'conversation',
          title: `${action} - ${new Date().toISOString()}`,
          content: `Input: ${content.substring(0, 500)}...\n\nOutput: ${result.substring(0, 500)}...`,
          metadata: { action, timestamp: new Date().toISOString() }
        });
      }
    }

    console.log('Context processing completed successfully');

    return new Response(
      JSON.stringify({ 
        result,
        action,
        metadata: {
          workspaceId,
          processedAt: new Date().toISOString(),
          wordCount: result.split(' ').length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in context-processor function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});