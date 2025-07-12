import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TimestampedTranscriptRequest {
  audio: string;
  filename: string;
  sourceId?: string;
  workspaceId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio, filename, sourceId, workspaceId }: TimestampedTranscriptRequest = await req.json();

    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log('Processing timestamped transcript for:', filename);

    // Process audio in chunks to prevent memory issues
    function processBase64Chunks(base64String: string, chunkSize = 32768) {
      const chunks: Uint8Array[] = [];
      let position = 0;
      
      while (position < base64String.length) {
        const chunk = base64String.slice(position, position + chunkSize);
        const binaryChunk = atob(chunk);
        const bytes = new Uint8Array(binaryChunk.length);
        
        for (let i = 0; i < binaryChunk.length; i++) {
          bytes[i] = binaryChunk.charCodeAt(i);
        }
        
        chunks.push(bytes);
        position += chunkSize;
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
    }

    const binaryAudio = processBase64Chunks(audio);
    
    // Determine file extension for proper MIME type
    const ext = filename?.split('.').pop()?.toLowerCase() || 'mp3';
    const mimeTypes: { [key: string]: string } = {
      'm4a': 'audio/mp4',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo'
    };
    
    const mimeType = mimeTypes[ext] || 'audio/mpeg';
    
    // Prepare form data for OpenAI Whisper API with timestamp words
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: mimeType });
    formData.append('file', blob, filename || `audio.${ext}`);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');

    console.log('Sending to OpenAI Whisper API for timestamped transcription...');

    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    console.log('Timestamped transcription completed successfully');

    // Process the response and create segments
    const segments = [];
    const words = result.words || [];
    
    // Group words into meaningful segments (sentences or phrases)
    let currentSegment = {
      text: '',
      start: 0,
      end: 0,
      words: [] as any[]
    };

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      if (currentSegment.words.length === 0) {
        currentSegment.start = word.start;
      }
      
      currentSegment.words.push(word);
      currentSegment.text += (currentSegment.text ? ' ' : '') + word.word;
      currentSegment.end = word.end;
      
      // End segment on punctuation or after ~20 words
      const isPunctuation = /[.!?]$/.test(word.word);
      const isLongSegment = currentSegment.words.length >= 20;
      
      if (isPunctuation || isLongSegment || i === words.length - 1) {
        segments.push({
          text: currentSegment.text.trim(),
          start_time: currentSegment.start,
          end_time: currentSegment.end,
          word_count: currentSegment.words.length
        });
        
        currentSegment = {
          text: '',
          start: 0,
          end: 0,
          words: []
        };
      }
    }

    // Store segments in database if sourceId and workspaceId are provided
    if (sourceId && workspaceId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Get user from auth header
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const jwt = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(jwt);
        
        if (user) {
          // Clear existing segments for this source
          await supabase
            .from('transcript_segments')
            .delete()
            .eq('source_id', sourceId);

          // Insert new segments
          const segmentInserts = segments.map((segment, index) => ({
            source_id: sourceId,
            workspace_id: workspaceId,
            user_id: user.id,
            segment_text: segment.text,
            start_time_seconds: segment.start_time,
            end_time_seconds: segment.end_time,
            segment_index: index,
            confidence_score: result.confidence || null,
            metadata: {
              word_count: segment.word_count,
              duration: segment.end_time - segment.start_time
            }
          }));

          await supabase
            .from('transcript_segments')
            .insert(segmentInserts);

          console.log(`Stored ${segments.length} transcript segments in database`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        text: result.text,
        segments: segments,
        duration: result.duration,
        language: result.language,
        word_count: words.length,
        segment_count: segments.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Timestamped transcription error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});