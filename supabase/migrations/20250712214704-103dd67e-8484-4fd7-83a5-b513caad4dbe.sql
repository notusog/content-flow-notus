-- Create personal brands table
CREATE TABLE public.personal_brands (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    bio TEXT,
    expertise_areas TEXT[],
    tone_of_voice TEXT,
    brand_colors JSONB DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    avatar_url TEXT,
    banner_url TEXT,
    knowledge_base JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.personal_brands ENABLE ROW LEVEL SECURITY;

-- Create policies for personal brands
CREATE POLICY "Users can view their own personal brands" 
ON public.personal_brands 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personal brands" 
ON public.personal_brands 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal brands" 
ON public.personal_brands 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personal brands" 
ON public.personal_brands 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add personal_brand_id to content_pieces table
ALTER TABLE public.content_pieces 
ADD COLUMN personal_brand_id UUID REFERENCES public.personal_brands(id) ON DELETE SET NULL;

-- Add personal_brand_id to content_sources table  
ALTER TABLE public.content_sources 
ADD COLUMN personal_brand_id UUID REFERENCES public.personal_brands(id) ON DELETE SET NULL;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_personal_brands_updated_at
BEFORE UPDATE ON public.personal_brands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();