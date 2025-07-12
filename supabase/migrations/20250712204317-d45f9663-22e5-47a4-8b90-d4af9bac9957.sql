-- Create workspaces table
CREATE TABLE public.workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Create policies for workspaces
CREATE POLICY "Users can view their own workspaces" 
ON public.workspaces 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workspaces" 
ON public.workspaces 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspaces" 
ON public.workspaces 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspaces" 
ON public.workspaces 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create workspace context table for storing conversation history and context
CREATE TABLE public.workspace_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  context_type TEXT NOT NULL, -- 'conversation', 'preference', 'template', 'style_guide'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on workspace_context
ALTER TABLE public.workspace_context ENABLE ROW LEVEL SECURITY;

-- Create policies for workspace_context
CREATE POLICY "Users can view context from their workspaces" 
ON public.workspace_context 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create context in their workspaces" 
ON public.workspace_context 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update context in their workspaces" 
ON public.workspace_context 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete context from their workspaces" 
ON public.workspace_context 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add workspace_id to existing content_sources and content_pieces tables
ALTER TABLE public.content_sources 
ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

ALTER TABLE public.content_pieces 
ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- Create updated_at triggers
CREATE TRIGGER update_workspaces_updated_at
BEFORE UPDATE ON public.workspaces
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workspace_context_updated_at
BEFORE UPDATE ON public.workspace_context
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_workspaces_user_id ON public.workspaces(user_id);
CREATE INDEX idx_workspace_context_workspace_id ON public.workspace_context(workspace_id);
CREATE INDEX idx_workspace_context_user_id ON public.workspace_context(user_id);
CREATE INDEX idx_workspace_context_type ON public.workspace_context(context_type);
CREATE INDEX idx_content_sources_workspace_id ON public.content_sources(workspace_id);
CREATE INDEX idx_content_pieces_workspace_id ON public.content_pieces(workspace_id);