import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { 
      onboardingQuestionnaire,
      deepDiveInterview,
      mediaStrategy,
      additionalContext,
      websites,
      language = 'English'
    } = await req.json();

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // First, research the websites if provided
    let websiteResearch = '';
    if (websites && websites.length > 0) {
      try {
        const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
        if (perplexityApiKey) {
          const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${perplexityApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.1-sonar-small-128k-online',
              messages: [
                {
                  role: 'system',
                  content: 'Analyze the provided websites and extract valuable information for content strategy and personal branding. Focus on industry insights, company positioning, market trends, and competitive landscape.'
                },
                {
                  role: 'user',
                  content: `Research and analyze these websites for content strategy insights: ${websites.join(', ')}`
                }
              ],
              temperature: 0.2,
              max_tokens: 1000,
              return_images: false,
              return_related_questions: false,
              search_recency_filter: 'month',
            }),
          });

          if (perplexityResponse.ok) {
            const perplexityData = await perplexityResponse.json();
            websiteResearch = perplexityData.choices[0]?.message?.content || '';
          }
        }
      } catch (perplexityError) {
        console.log('Perplexity research failed, continuing without web research:', perplexityError);
      }
    }

    const contentArchetypePrompt = `You are tasked with developing a customized content Archetype for a client and their company, based on the information provided. This Archetype will form the foundation of their branding strategy on LinkedIn, manifesting in four content pillars: Tactical, Aspirational, Insightful, and Personal.

A content archetype is a strategic framework that defines how a personal brand should communicate across different content types. It serves as the foundation for consistent, authentic content creation that aligns with business goals and audience needs. The archetype ensures every piece of content serves a specific purpose in building authority, trust, and engagement.

Based on the following client information:

**Onboarding Questionnaire:**
${onboardingQuestionnaire}

**Deep Dive Interview:**
${deepDiveInterview}

**Media Strategy:**
${mediaStrategy}

**Additional Context:**
${additionalContext}

**Website Research:**
${websiteResearch}

Create a Content Archetype with four pillars:

1. **Tactical**: Provide immediate, actionable value to the audience.
2. **Aspirational**: Inspire through transformation stories and success narratives.
3. **Insightful**: Position the client as an industry authority, offering in-depth perspectives.
4. **Personal**: Build deeper trust and humanize the personal brand.

For each pillar, develop:
- Three specific sub-points
- For each sub-point, add three detailed explanations (5 to 12 words each)
- Craft two post ideas for each sub-point

Guidelines for post ideas:
- Write in a professional yet conversational tone
- Never use direct questions in the post text
- Rarely begin with "How"
- Never use colons (":") or dashes ("–") in post ideas
- Avoid direct bragging or influencer-style hooks
- Be specific, using placeholders like [X] for unknown data

Format each explanation bullet starting with action words like: How, Show, Identify, Provide, Share, Explain, etc.

Language: ${language}

Present your output in this exact structure:

1. Tactical
    - Sub-point 1
        - [Explanation bullet]
        - [Explanation bullet]
        - [Explanation bullet]

        - Post 1: "[Post text]"
        - Post 2: "[Post text]"

    - Sub-point 2
        - [Follow same format]

    - Sub-point 3
        - [Follow same format]

2. Aspirational
    [Follow same format as Tactical]

3. Insightful
    [Follow same format as Tactical]

4. Personal
    [Follow same format as Tactical]

Ensure all content aligns with the client's voice and business goals.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: contentArchetypePrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const contentArchetype = data.content[0].text;

    return new Response(JSON.stringify({ 
      contentArchetype,
      websiteResearch: websiteResearch ? 'Website research included' : 'No website research performed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in content-archetype function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate content archetype'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});