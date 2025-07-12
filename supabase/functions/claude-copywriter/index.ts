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
  type?: 'linkedin_post' | 'email' | 'social' | 'blog' | 'ad' | 'product_description' | 'landing_page' | 'newsletter' | 'general';
  audience?: string;
  brandVoice?: string;
  clientName?: string;
  transcript?: string;
  previousPosts?: string[];
  useStructuredPrompt?: boolean;
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
      brandVoice,
      clientName,
      transcript,
      previousPosts,
      useStructuredPrompt = false
    }: CopywritingRequest = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Generating copy with Claude:', { prompt, tone, length, type, useStructuredPrompt });

    // Use structured LinkedIn prompt if specified and type is linkedin_post
    if (useStructuredPrompt && type === 'linkedin_post' && transcript && clientName) {
      return await generateLinkedInPost(transcript, clientName, previousPosts, brandVoice, audience);
    }

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
      linkedin_post: "Create an engaging LinkedIn post with strong hook, clear structure, and authentic voice. Keep it between 1300-1500 characters.",
      email: "Write as an email with subject line, greeting, body, and call-to-action",
      social: "Create engaging social media content with hooks and hashtags",
      blog: "Structure as a blog post with title, introduction, main points, and conclusion",
      ad: "Focus on grabbing attention, highlighting benefits, and driving action",
      product_description: "Highlight features, benefits, and create desire for the product",
      landing_page: "Create persuasive copy with clear value proposition and strong CTA",
      newsletter: "Write engaging newsletter content with clear sections and compelling CTAs",
      general: "Create well-structured, engaging content appropriate for the context"
    };

    systemPrompt += `\n- ${typeInstructions[type] || typeInstructions.general}`;

    return await generateContent(systemPrompt, prompt);
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

async function generateLinkedInPost(transcript: string, clientName: string, previousPosts?: string[], brandVoice?: string, audience?: string) {
  const previousPostsSection = previousPosts && previousPosts.length > 0 
    ? `<Previous Posts>\n${previousPosts.map((post, i) => `(Post Example ${i + 1})\n${post}\n(/Post Example ${i + 1})`).join('\n\n')}\n</Previous Posts>`
    : '<Previous Posts>\nNo previous posts provided.\n</Previous Posts>';

  const systemPrompt = `You are an expert in transcript analysis and content writing for the client ${clientName}.

<Transcript>
${transcript}
</Transcript>

Please work in steps and document each step:

# Step 1: Transcript Content Analysis

## Step 1.1: Identify Potential Core Narratives
Analyze the transcript to identify 2-4 potential core narratives that could drive a complete post. Each narrative should be substantial enough to support 1,300-1,500 characters of content.

## Step 1.2: Map Content Distribution
For each potential narrative, estimate what percentage of the transcript content directly supports that narrative. Present as:

Narrative A: Description - X% of transcript content
Narrative B: Description - Y% of transcript content
etc.

## Step 1.3: Voice & Language Analysis
Analyze the client's communication patterns: specific phrases they use, sentence structure, tone, and authentic language choices that should be preserved in the final content.

# Step 2: Analyze the Previous Posts

Please analyze all previous posts in great detail. Determine all components that you need to understand to reproduce this writing style exactly. Then analyze and understand each component down to the smallest detail.

# Step 3: Strategic Narrative Selection & Hook Creation

## Step 3.1: Select Primary Narrative
Choose the narrative with the strongest content support and highest relevance to the client's audience. This becomes THE core narrative that will drive the entire post.

## Step 3.2: Write Hook Using Advanced Principles
Create a hook (maximum 200 characters) that establishes the chosen core narrative using these principles:

- Credibility/Social Proof: Establish qualification through achievements/experience
- Specificity: Use concrete details rather than abstract concepts
- Curiosity Gap Creation: Provide intrigue while withholding key details
- Personal Storytelling: Use unique experiences for differentiation
- Value Promise: Clearly communicate what reader will gain

The hook must:
- Use exclusively information from the transcript
- Sound like the client wrote it themselves
- Set clear frame for the post
- Capture attention through principle stacking

## Step 3.3: Define Core Narrative Requirements
Based on the hook created, define what the body copy must deliver to maintain Frame Consistency. What specific expectations has the hook established?

# Step 4: Content Architecture & Systematic Filtering

## Step 4.1: Apply Single Concept Focus Filtering
Using the core narrative from Step 3.1, ruthlessly filter transcript content:

INCLUDE: Only elements that directly advance the chosen narrative
EXCLUDE: All tangents, secondary stories, or competing narratives (regardless of how interesting)
Present filtered content in logical building blocks.

## Step 4.2: Plan Logical Progression
Arrange filtered building blocks using these progression principles:

- Sequential Development: Each block builds naturally on the previous
- Cause-and-Effect Relationships: Clear logical connections between blocks
- Progressive Information Revelation: Foundation concepts before advanced details
- Systematic Architecture: For complex topics, use clear hierarchical structure

## Step 4.2a: Narrative Completeness Check
Review the planned building block sequence and identify any logical gaps where readers would need to make inferences. Specifically check:

- Are there unexplained jumps in timeline or circumstances?
- Do any building blocks reference elements not previously established?
- Would a newcomer to this content understand each transition?
- Are there missing connecting pieces between major narrative elements?

If gaps exist, either:
- Add necessary context from transcript to bridge gaps
- Restructure building blocks to eliminate logical leaps
- Include brief explanatory bridges using available transcript content

The goal: Every building block should flow naturally from previously established information without requiring reader inference.

## Step 4.3: Identify Application Opportunities
Mark opportunities throughout the planned content for:

- Context Embedding: Where background information needs natural weaving
- Specificity Enhancement: Where concrete details can replace abstract concepts
- Timeline Structure: If content spans multiple time periods

# Step 5: Write Content with Principle Application

## Step 5.1: Write Body Copy Maintaining Frame Consistency
Write the body content ensuring it flows seamlessly from the hook and delivers exactly what the hook promised. Apply these principles systematically:

**Zero Context Assumption**: Write as if readers know nothing about the client's background

- Embed credentials naturally: "As someone who..."
- Clarify company context: "my content strategy agency notus"
- Explain relationships: "For context, this investor had reached out..."

**Specificity as Attention Anchor**: Replace general concepts with concrete details

- Specific numbers: "56 meetings" vs "many meetings"
- Named tools: "LinkedIn Sales Navigator" vs "prospecting tool"
- Precise timelines: "In February" vs "recently"
- Exact processes: "1-hour content calls" vs "regular planning"

**Context Embedding Strategies**: Weave background information naturally

- Relationship context when introducing people
- Process context when describing actions
- Timeline context for events
- Metric context for numbers

**Voice and Authenticity**: Maintain the client's natural communication patterns identified in Step 1.3

## Step 5.2: Apply Content Quality Standards
Ensure the content meets these standards:

- Write between 1,300-1,500 characters total
- Vary sentence length for reading flow
- Use active voice and strong verbs
- Eliminate filler words and generic phrases
- Never use rhetorical questions like "The best part?"
- Avoid hyperbolic phrasing like "But here's the kicker..."

## Step 5.3: Final Integration Check
Verify that:

- Body copy serves the exact core narrative established by hook
- All building blocks advance the single chosen concept
- Logical progression is maintained throughout
- Client's authentic voice is preserved

# Step 6: Advanced Quality Validation
Rather than generic questions, validate against these principle-based checkpoints:

**Core Trait Compliance:**
- Does every sentence pass the Zero Context Assumption test?
- Is the Single Concept Focus maintained without deviation?
- Does the content maintain Frame Consistency with the hook's promises?
- Is Logical Progression clear from first to last building block?

**Advanced Principle Application:**
- Are all details as specific and concrete as possible?
- Is context embedded naturally without exposition dumps?
- Does the voice authentically match the client's communication style?
- Are metrics and timelines presented for maximum credibility?

**Content Architecture Validation:**
- Does each building block earn the right to the next building block?
- Are transitions logical and explicitly connected?
- Is the hierarchy clear for complex information?
- Does the progression feel natural and momentum-building?

Only when all principle-based checkpoints are satisfied should the content be considered complete.

Please output only the final post (hook + body) in an artifact, with character count (including spaces) at the end.

${previousPostsSection}

${brandVoice ? `\nBrand Voice Guidelines: ${brandVoice}` : ''}
${audience ? `\nTarget Audience: ${audience}` : ''}`;

  return await generateContent(systemPrompt, 'Generate a LinkedIn post following the structured process above.');
}

async function generateContent(systemPrompt: string, userPrompt: string) {
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
          content: userPrompt
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
        wordCount: generatedCopy.split(' ').length,
        characterCount: generatedCopy.length
      }
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}