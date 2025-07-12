-- Create chat conversations table for storing AI chat history
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  agent_type TEXT NOT NULL DEFAULT 'client_consultant',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for chat conversations
CREATE POLICY "Users can view their own chat conversations" 
ON public.chat_conversations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat conversations" 
ON public.chat_conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat conversations" 
ON public.chat_conversations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat conversations" 
ON public.chat_conversations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster conversation queries
CREATE INDEX idx_chat_conversations_conversation_id ON public.chat_conversations(conversation_id);
CREATE INDEX idx_chat_conversations_user_workspace ON public.chat_conversations(user_id, workspace_id);
CREATE INDEX idx_chat_conversations_agent_type ON public.chat_conversations(agent_type);