import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { posts, personalBrandId, userId, workspaceId } = await req.json();
    
    console.log('Analyzing tone from LinkedIn posts for brand:', personalBrandId);

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Analyze tone of voice from LinkedIn posts
    const toneAnalysis = await analyzeToneFromPosts(anthropicKey, posts);
    
    // Update personal brand with analyzed tone
    if (personalBrandId) {
      const { error } = await supabase
        .from('personal_brands')
        .update({ 
          tone_of_voice: toneAnalysis.tone_description,
          knowledge_base: {
            ...{},
            linkedin_posts: posts,
            tone_analysis: toneAnalysis
          }
        })
        .eq('id', personalBrandId);

      if (error) throw error;
    }

    return new Response(JSON.stringify({ 
      tone_analysis: toneAnalysis,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tone-analyzer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeToneFromPosts(apiKey: string, posts: string[]) {
  const combinedPosts = posts.join('\n\n---\n\n');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: `You are an expert content strategist and brand voice analyst. Analyze the provided LinkedIn posts to extract detailed tone of voice characteristics that can be used for AI content generation.

Provide your analysis in the following JSON format:
{
  "tone_description": "A comprehensive description of the tone of voice",
  "key_characteristics": ["characteristic1", "characteristic2", ...],
  "writing_style": {
    "formality_level": "casual/professional/formal",
    "sentence_structure": "short/medium/long/varied",
    "vocabulary": "simple/technical/sophisticated/mixed",
    "emotional_tone": "enthusiastic/confident/thoughtful/etc"
  },
  "content_patterns": {
    "common_phrases": ["phrase1", "phrase2", ...],
    "post_structure": "typical structure pattern",
    "call_to_action_style": "how they typically end posts",
    "hashtag_usage": "description of hashtag patterns"
  },
  "personality_traits": ["trait1", "trait2", ...],
  "content_themes": ["theme1", "theme2", ...]
}`,
      messages: [
        {
          role: 'user',
          content: `Analyze these LinkedIn posts and extract the tone of voice characteristics:\n\n${combinedPosts}`
        }
      ]
    }),
  });

  const data = await response.json();
  const analysisText = data.content[0].text;
  
  try {
    return JSON.parse(analysisText);
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      tone_description: analysisText,
      key_characteristics: ["professional", "engaging"],
      writing_style: {
        formality_level: "professional",
        sentence_structure: "varied",
        vocabulary: "mixed",
        emotional_tone: "confident"
      },
      content_patterns: {
        common_phrases: [],
        post_structure: "standard",
        call_to_action_style: "engaging",
        hashtag_usage: "moderate"
      },
      personality_traits: ["authentic", "knowledgeable"],
      content_themes: ["business", "professional development"]
    };
  }
}