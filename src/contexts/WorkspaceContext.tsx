import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Workspace {
  id: string;
  name: string;
  description?: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

interface WorkspaceContext {
  id: string;
  workspace_id: string;
  context_type: string;
  title: string;
  content: string;
  metadata: any;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  workspaceContext: WorkspaceContext[];
  loading: boolean;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  createWorkspace: (data: { name: string; description?: string }) => Promise<void>;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  addContext: (data: Omit<WorkspaceContext, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  enhanceContent: (content: string, action: 'enhance' | 'summarize' | 'extract_insights' | 'generate_ideas') => Promise<string>;
  generateCopy: (prompt: string, options?: {
    tone?: string;
    length?: string;
    type?: string;
    audience?: string;
    brandVoice?: string;
    context?: string;
    clientName?: string;
    transcript?: string;
    useStructuredPrompt?: boolean;
  }) => Promise<string>;
  addToneOfVoice: (toneOfVoice: string) => Promise<void>;
  addPreviousPost: (post: string) => Promise<void>;
  getPreviousPosts: () => WorkspaceContext[];
  getToneOfVoice: () => WorkspaceContext | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContext[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch workspaces and context
  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch workspaces
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*')
        .order('updated_at', { ascending: false });

      if (workspacesError) throw workspacesError;
      setWorkspaces(workspacesData || []);

      // Set current workspace to first one if none selected
      if (!currentWorkspace && workspacesData && workspacesData.length > 0) {
        setCurrentWorkspace(workspacesData[0]);
      }

      // Fetch workspace context for current workspace
      if (currentWorkspace) {
        const { data: contextData, error: contextError } = await supabase
          .from('workspace_context')
          .select('*')
          .eq('workspace_id', currentWorkspace.id)
          .order('created_at', { ascending: false });

        if (contextError) throw contextError;
        setWorkspaceContext(contextData || []);
      }

    } catch (error) {
      console.error('Error fetching workspace data:', error);
      toast({
        title: "Error",
        description: "Failed to load workspace data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, currentWorkspace?.id]);

  const createWorkspace = async (data: { name: string; description?: string }) => {
    if (!user) return;

    try {
      const { data: workspace, error } = await supabase
        .from('workspaces')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setWorkspaces(prev => [workspace, ...prev]);
      setCurrentWorkspace(workspace);

      toast({
        title: "Success",
        description: "Workspace created successfully",
      });
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      });
    }
  };

  const updateWorkspace = async (id: string, updates: Partial<Workspace>) => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setWorkspaces(prev => prev.map(w => w.id === id ? data : w));
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(data);
      }

      toast({
        title: "Success",
        description: "Workspace updated successfully",
      });
    } catch (error) {
      console.error('Error updating workspace:', error);
      toast({
        title: "Error",
        description: "Failed to update workspace",
        variant: "destructive",
      });
    }
  };

  const deleteWorkspace = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkspaces(prev => prev.filter(w => w.id !== id));
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(workspaces[0] || null);
      }

      toast({
        title: "Success",
        description: "Workspace deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast({
        title: "Error",
        description: "Failed to delete workspace",
        variant: "destructive",
      });
    }
  };

  const addContext = async (data: Omit<WorkspaceContext, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data: context, error } = await supabase
        .from('workspace_context')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setWorkspaceContext(prev => [context, ...prev]);
    } catch (error) {
      console.error('Error adding context:', error);
      throw error;
    }
  };

  const enhanceContent = async (content: string, action: 'enhance' | 'summarize' | 'extract_insights' | 'generate_ideas'): Promise<string> => {
    if (!currentWorkspace) throw new Error('No workspace selected');

    try {
      const { data, error } = await supabase.functions.invoke('context-processor', {
        body: {
          workspaceId: currentWorkspace.id,
          content,
          action
        }
      });

      if (error) throw error;
      return data.result;
    } catch (error) {
      console.error('Error enhancing content:', error);
      throw error;
    }
  };

  const generateCopy = async (prompt: string, options?: {
    tone?: string;
    length?: string;
    type?: string;
    audience?: string;
    brandVoice?: string;
    context?: string;
    clientName?: string;
    transcript?: string;
    useStructuredPrompt?: boolean;
  }): Promise<string> => {
    try {
      // Get previous posts and tone of voice from workspace context
      const previousPosts = getPreviousPosts().map(ctx => ctx.content);
      const toneOfVoiceContext = getToneOfVoice();
      const brandVoice = options?.brandVoice || toneOfVoiceContext?.content;

      const { data, error } = await supabase.functions.invoke('claude-copywriter', {
        body: {
          prompt,
          previousPosts: previousPosts.length > 0 ? previousPosts : undefined,
          ...options,
          brandVoice
        }
      });

      if (error) throw error;
      
      // Store the generated content in workspace context
      if (currentWorkspace && user) {
        await addContext({
          workspace_id: currentWorkspace.id,
          context_type: 'generated_content',
          title: `Generated ${options?.type || 'content'} - ${new Date().toISOString()}`,
          content: data.copy,
          metadata: { 
            prompt, 
            ...options,
            generatedAt: new Date().toISOString(),
            characterCount: data.metadata?.characterCount,
            wordCount: data.metadata?.wordCount
          },
          tags: [options?.type || 'content', 'generated']
        });
      }

      return data.copy;
    } catch (error) {
      console.error('Error generating copy:', error);
      throw error;
    }
  };

  const addToneOfVoice = async (toneOfVoice: string) => {
    if (!currentWorkspace || !user) return;

    // Remove existing tone of voice
    const existingTone = getToneOfVoice();
    if (existingTone) {
      await supabase.from('workspace_context').delete().eq('id', existingTone.id);
    }

    await addContext({
      workspace_id: currentWorkspace.id,
      context_type: 'tone_of_voice',
      title: 'Brand Tone of Voice',
      content: toneOfVoice,
      metadata: { updatedAt: new Date().toISOString() },
      tags: ['brand', 'tone', 'voice']
    });
  };

  const addPreviousPost = async (post: string) => {
    if (!currentWorkspace || !user) return;

    await addContext({
      workspace_id: currentWorkspace.id,
      context_type: 'previous_post',
      title: `Previous Post - ${new Date().toLocaleDateString()}`,
      content: post,
      metadata: { addedAt: new Date().toISOString() },
      tags: ['post', 'reference', 'example']
    });
  };

  const getPreviousPosts = (): WorkspaceContext[] => {
    return workspaceContext.filter(ctx => ctx.context_type === 'previous_post');
  };

  const getToneOfVoice = (): WorkspaceContext | null => {
    return workspaceContext.find(ctx => ctx.context_type === 'tone_of_voice') || null;
  };

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      currentWorkspace,
      workspaceContext,
      loading,
      setCurrentWorkspace,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      addContext,
      enhanceContent,
      generateCopy,
      addToneOfVoice,
      addPreviousPost,
      getPreviousPosts,
      getToneOfVoice,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}