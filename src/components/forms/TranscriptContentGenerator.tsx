import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TranscriptContentGeneratorProps {
  onSubmit: (data: { content: string; metadata: any }) => void;
  onCancel: () => void;
  brandName?: string;
  contentArchetype?: string;
}

export default function TranscriptContentGenerator({ 
  onSubmit, 
  onCancel, 
  brandName, 
  contentArchetype 
}: TranscriptContentGeneratorProps) {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Missing Transcript",
        description: "Please provide a transcript",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const previousPosts = [
        "Over the past 3 years, I've built a 7 figure company without even having an office. Here's my take on being remote-first (and how we make it work):\n\nFor context, I started notus alone.\n\n• little savings\n• no investors\n• no co-founders\n\nBuilding a remote-first company was an obvious choice:\n\n• low overhead\n• complete flexibility\n• access to global talent\n\nToday, we are 20 people spread across the globe and we're stronger than ever. Remote-first is still the best setup for us as a company.\n\nOver the years, I realized we don't need an office to be successful.\n\nWhat we need are: 1. the right work principles, 2. the right work setup\n\n𝗪𝗼𝗿𝗸 𝗣𝗿𝗶𝗻𝗰𝗶𝗽𝗹𝗲𝘀:\n\n• put everything you do in your calendar\n• confirm when you read a message\n• daily check-in & check-out routine\n• clearly communicate ownership\n• address elephants in the room\n• never assume anything\n\n𝗪𝗼𝗿𝗸 𝗦𝗲𝘁𝘂𝗽:\n\n• Will I be distracted?\n• Am I comfortable working here?\n• Do I have a good Wifi connection?\n\nIf these things are given, running a remote company comes with all of the benefits and little downside.\n\nNaturally, 1 downside still remains - the lack of unstructured discussions.\n\nThe coffee breaks, the chats over lunch. The informal convos that create an emotional connection and bring out new ideas.\n\nThat's why we host off-sites with the core team once a quarter.\n\nIt's the best way I've found to make sure everyone's aligned. (Heavy emphasis on coffee walks and casual chats.)\n\nFor me, work is about making life and work fit together.\n\nI just want to do cool s**t with cool people and this is the setup that works for us.",
        "2 weeks ago, one of my posts got 40 likes (Ouch), but booked us 11 meetings (LFG). Here's what happened (and how not to focus on the wrong metrics):\n\nAbout a month ago, we announced a webinar with Jesse Pujji.\n\nFor context, we worked with Jesse for 1.5+ years and helped him scale his founder brand to over 30k followers on LinkedIn.\n\nHe'd become a standout case study for us - and honestly, collaborating with his team on a webinar sounded perfect.\n\nTo promote the webinar, we did 2 things:\n\nPublished a LinkedIn post about our collaboration\nSent an email to our newsletter subscribers\n\nThe post looked great.\n\n• Strong hook,\n• good storytelling,\n• and super actionable.\n\nThen the disappointing stats 24 hours in:\n\n• 5k impressions\n• 7 comments\n• 40 likes\n\nSeeing below-average numbers like this, it's easy to think something went wrong. I wrote it off as a fluke and moved on.\n\nThe next day, I get a message from our Head of Partnerships Selim.\n\n\"Strong post yesterday man, booked 5 demos already!\"\n\n\"Wait what??\"\n\nTurns out, the post wasn't a flop at all.\n\nDespite low impressions & engagement, it generated:\n\n• Dozens of intent signals from potential clients\n• 11 meetings booked that week\n• 300+ webinar sign-ups\n\nLooking back, that post outperformed others with way more impressions & likes.\n\nIt reached the right people with the right message.\n\nOnce again, this was a great reminder to myself.\n\nWhile it makes sense to cast a wide net here and there (broad, top-of-funnel content), it's the niche posts that speak to the target audience that generate the most leads.\n\nTL:DR\n\nImpressions don't pay the bills.\nFocus on the metrics that matter.\n____\n\nPS: Speaking of the webinar with Jesse - there's a secret recording.\n\nComment \"webinar\" and I'll send it your way.",
        "At 20 years old, I left my family in Switzerland to become a 'wannabe Instagram blogger.'\n\nHigh school prepared me for a path I wasn't sold on - I didn't want to:\n\n• Go to university\n• Get a regular 9-5 job\n• Live my life knowing I never tried to do my own thing\n\nWhat I wanted was to:\n\n• Find something I'm passionate about\n• Fulfill my potential\n• Inspire others who were in a similar situation\n\nAt that time my biggest inspiration was GaryVee.\n\nI loved his take on personal branding and documenting the journey - so I wanted to do the same.\n\nBut I was hesitant.\n\nI knew people in my hometown would judge me for \"doing social media\".\n\nSo I:\n\n• Took a gap year\n• Left Switzerland\n• Travelled to the US\n\nAnd I documented my journey on Instagram & LinkedIn along the way.\n\nSince I was so far away from home, I had a much easier time forming my new character.\n\nBut I still couldn't avoid all the negativity.\n\nI remember how 2 months into my journey, friends from Switzerland called to tell me I was the talk of the town\n\n→ \"What is Marvin doing with this Instagram \"Wannabe Influencer\" Stuff?\".\n\nThose words stung.\n\nLuckily the pain didn't last long.\n\n2 things that helped me:\n\n1. Practicing awareness and regular reflection to detach\n2. Being surrounded by people who encouraged me to keep going\n\n(Being a 10-hour flight away from home also helped lol)\n\nAnd who would have thought - it paid off.\n\nSlowly, but steadily, I built new relationships, got my first clients, and ultimately started my own agency.\n\nToday, I have:\n\n• A 6-star team at notus\n• Time & location freedom\n• A vision to work towards\n• Skills I didn't have before\n• A portfolio of 110+ awesome partners\n\nAnd tons of fun doing it.\n\nI still document the journey on Instagram and LinkedIn & YouTube, but no one makes fun of me anymore.\n\n(At least not directly - and even if someone did, I couldn't care less)\n\n3 big lessons I learned:\n\n1. Someone else's judgment is just a projection of their own insecurities - not a reflection of reality\n2. The most important thing is starting. The 2nd most important is not stopping\n3. Treat content as an infinite game & have fun with it\n\nPS. this pic is from October 2018 during our US roadtrip in NYC. It was peak \"Instagram Blogger\" time :D"
      ];

      const { data, error } = await supabase.functions.invoke('claude-copywriter', {
        body: {
          prompt: '',
          tone: 'professional',
          type: 'linkedin_post',
          transcript: transcript,
          useStructuredPrompt: true,
          clientName: brandName || 'the client',
          previousPosts: previousPosts
        }
      });

      if (error) throw error;

      const generatedText = data?.copy || data?.content || '';
      setGeneratedContent(generatedText);

      toast({
        title: "LinkedIn Post Generated",
        description: "Successfully generated content from transcript",
      });

    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!generatedContent) return;
    
    onSubmit({
      content: generatedContent,
      metadata: {
        platform: 'LinkedIn',
        contentType: 'post',
        hasTranscript: true
      }
    });
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Generate LinkedIn Post</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Transcript
          </label>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your transcript here..."
            rows={8}
            className="min-h-[200px]"
          />
        </div>

        <Button 
          onClick={generateContent}
          disabled={isGenerating || !transcript.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate LinkedIn Post'
          )}
        </Button>

        {generatedContent && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Generated Content</label>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!generatedContent}>
            Save Content
          </Button>
        </div>
      </div>
    </div>
  );
}