-- Create content_sources table
CREATE TABLE public.content_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'note', 'recording', 'document')),
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT[],
  source TEXT,
  insights TEXT[],
  related_topics TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_pieces table  
CREATE TABLE public.content_pieces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  source_ids UUID[],
  tags TEXT[],
  status TEXT NOT NULL CHECK (status IN ('draft', 'review', 'approved', 'scheduled', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pieces ENABLE ROW LEVEL SECURITY;

-- Create policies for content_sources
CREATE POLICY "Users can view their own content sources" 
ON public.content_sources 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content sources" 
ON public.content_sources 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content sources" 
ON public.content_sources 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content sources" 
ON public.content_sources 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for content_pieces
CREATE POLICY "Users can view their own content pieces" 
ON public.content_pieces 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content pieces" 
ON public.content_pieces 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content pieces" 
ON public.content_pieces 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content pieces" 
ON public.content_pieces 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_content_sources_updated_at
BEFORE UPDATE ON public.content_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_pieces_updated_at
BEFORE UPDATE ON public.content_pieces
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();