import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CopywritingRequest {
  prompt: string;
  context?: string;
  tone?: 'professional' | 'casual' | 'creative' | 'persuasive' | 'technical';
  length?: 'short' | 'medium' | 'long';
  type?: 'email' | 'social' | 'blog' | 'ad' | 'product_description' | 'landing_page' | 'general';
  audience?: string;
  brandVoice?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      prompt, 
      context, 
      tone = 'professional', 
      length = 'medium', 
      type = 'general',
      audience,
      brandVoice
    }: CopywritingRequest = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Generating copy with Claude:', { prompt, tone, length, type });

    // Build system prompt based on parameters
    let systemPrompt = `You are an expert copywriter and content strategist. Your job is to create compelling, effective copy that achieves the user's goals.

Guidelines:
- Tone: ${tone}
- Length: ${length}
- Content type: ${type}
- Always write clear, engaging, and actionable content
- Focus on benefits over features
- Use persuasive language appropriate for the tone
- Make it scannable with good structure`;

    if (audience) {
      systemPrompt += `\n- Target audience: ${audience}`;
    }

    if (brandVoice) {
      systemPrompt += `\n- Brand voice: ${brandVoice}`;
    }

    if (context) {
      systemPrompt += `\n- Additional context: ${context}`;
    }

    // Length guidelines
    const lengthGuides = {
      short: "Keep it concise - 1-2 paragraphs or bullet points",
      medium: "Provide substantial content - 3-5 paragraphs with clear structure", 
      long: "Create comprehensive content - multiple sections with headings and detailed explanations"
    };

    systemPrompt += `\n- ${lengthGuides[length]}`;

    // Type-specific instructions
    const typeInstructions = {
      email: "Write as an email with subject line, greeting, body, and call-to-action",
      social: "Create engaging social media content with hooks and hashtags",
      blog: "Structure as a blog post with title, introduction, main points, and conclusion",
      ad: "Focus on grabbing attention, highlighting benefits, and driving action",
      product_description: "Highlight features, benefits, and create desire for the product",
      landing_page: "Create persuasive copy with clear value proposition and strong CTA",
      general: "Create well-structured, engaging content appropriate for the context"
    };

    systemPrompt += `\n- ${typeInstructions[type]}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('ANTHROPIC_API_KEY')}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      throw new Error(`Claude API error: ${errorText}`);
    }

    const data = await response.json();
    const generatedCopy = data.content[0].text;

    console.log('Copy generation completed successfully');

    return new Response(
      JSON.stringify({ 
        copy: generatedCopy,
        metadata: {
          tone,
          length,
          type,
          audience,
          wordCount: generatedCopy.split(' ').length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in claude-copywriter function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});