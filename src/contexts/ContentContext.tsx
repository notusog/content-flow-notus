import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContentSource, ContentPiece } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePersonalBrand } from './PersonalBrandContext';
import { useWorkspace } from './WorkspaceContext';

interface ContentContextType {
  sources: ContentSource[];
  pieces: ContentPiece[];
  loading: boolean;
  addSource: (source: Omit<ContentSource, 'id' | 'dateAdded' | 'clientId'>) => Promise<void>;
  addPiece: (piece: Omit<ContentPiece, 'id' | 'createdDate' | 'clientId'>) => Promise<void>;
  updatePiece: (id: string, updates: Partial<ContentPiece>) => Promise<void>;
  deletePiece: (id: string) => Promise<void>;
  generateContentFromSources: (sourceIds: string[], platform: string, prompt?: string, transcript?: string) => Promise<void>;
  generateContentIdea: (prompt: string, sourceIds?: string[], transcript?: string) => Promise<void>;
  promoteToNextStage: (id: string, currentStatus: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [pieces, setPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentPersonalBrand } = usePersonalBrand();
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [sourcesResult, piecesResult] = await Promise.all([
        supabase.from('content_sources').select('*').order('created_at', { ascending: false }),
        supabase.from('content_pieces').select('*').order('created_at', { ascending: false })
      ]);

      if (sourcesResult.data) {
        const mappedSources = sourcesResult.data.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type as ContentSource['type'],
          content: item.content,
          summary: item.summary || '',
          tags: item.tags || [],
          source: item.source || '',
          dateAdded: item.created_at.split('T')[0],
          clientId: item.user_id,
          insights: item.insights || [],
          relatedTopics: item.related_topics || []
        }));
        setSources(mappedSources);
      }

      if (piecesResult.data) {
        const mappedPieces = piecesResult.data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          platform: item.platform,
          sourceIds: item.source_ids || [],
          tags: item.tags || [],
          status: item.status as ContentPiece['status'],
          createdDate: item.created_at.split('T')[0],
          clientId: item.user_id
        }));
        setPieces(mappedPieces);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load content data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSource = async (sourceData: Omit<ContentSource, 'id' | 'dateAdded' | 'clientId'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('content_sources')
        .insert({
          title: sourceData.title,
          type: sourceData.type,
          content: sourceData.content,
          summary: sourceData.summary,
          tags: sourceData.tags,
          source: sourceData.source,
          insights: sourceData.insights,
          related_topics: sourceData.relatedTopics,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newSource: ContentSource = {
        id: data.id,
        title: data.title,
        type: data.type as ContentSource['type'],
        content: data.content,
        summary: data.summary || '',
        tags: data.tags || [],
        source: data.source || '',
        dateAdded: data.created_at.split('T')[0],
        clientId: data.user_id,
        insights: data.insights || [],
        relatedTopics: data.related_topics || []
      };

      setSources(prev => [newSource, ...prev]);
      toast({
        title: "Success",
        description: "Content source added successfully"
      });
    } catch (error) {
      console.error('Error adding source:', error);
      toast({
        title: "Error",
        description: "Failed to add content source",
        variant: "destructive"
      });
    }
  };

  const addPiece = async (pieceData: Omit<ContentPiece, 'id' | 'createdDate' | 'clientId'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('content_pieces')
        .insert({
          title: pieceData.title,
          content: pieceData.content,
          platform: pieceData.platform,
          source_ids: pieceData.sourceIds,
          tags: pieceData.tags,
          status: pieceData.status,
          user_id: user.id,
          workspace_id: currentWorkspace?.id || null,
          personal_brand_id: currentPersonalBrand?.id || null
        })
        .select()
        .single();

      if (error) throw error;

      const newPiece: ContentPiece = {
        id: data.id,
        title: data.title,
        content: data.content,
        platform: data.platform,
        sourceIds: data.source_ids || [],
        tags: data.tags || [],
        status: data.status as ContentPiece['status'],
        createdDate: data.created_at.split('T')[0],
        clientId: data.user_id
      };

      setPieces(prev => [newPiece, ...prev]);
      toast({
        title: "Success",
        description: "Content piece added successfully"
      });
    } catch (error) {
      console.error('Error adding piece:', error);
      toast({
        title: "Error",
        description: "Failed to add content piece",
        variant: "destructive"
      });
    }
  };

  const updatePiece = async (id: string, updates: Partial<ContentPiece>) => {
    try {
      const { error } = await supabase
        .from('content_pieces')
        .update({
          title: updates.title,
          content: updates.content,
          platform: updates.platform,
          source_ids: updates.sourceIds,
          tags: updates.tags,
          status: updates.status
        })
        .eq('id', id);

      if (error) throw error;

      setPieces(prev => prev.map(piece => 
        piece.id === id ? { ...piece, ...updates } : piece
      ));

      toast({
        title: "Success",
        description: "Content piece updated successfully"
      });
    } catch (error) {
      console.error('Error updating piece:', error);
      toast({
        title: "Error",
        description: "Failed to update content piece",
        variant: "destructive"
      });
    }
  };

  const deletePiece = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_pieces')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPieces(prev => prev.filter(piece => piece.id !== id));
      toast({
        title: "Success",
        description: "Content piece deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting piece:', error);
      toast({
        title: "Error",
        description: "Failed to delete content piece",
        variant: "destructive"
      });
    }
  };

  const generateContentFromSources = async (sourceIds: string[], platform: string, prompt?: string, transcript?: string) => {
    try {
      const selectedSources = sources.filter(source => sourceIds.includes(source.id));
      
      // Enhanced content generation with transcript support
      let baseContent = '';
      if (transcript) {
        baseContent = `Transcript: ${transcript}\n\n`;
      }
      
      const sourceContent = selectedSources.map(s => `${s.title}: ${s.content}`).join('\n\n');
      const generatedContent = `${baseContent}AI-generated ${platform} content based on: ${selectedSources.map(s => s.title).join(', ')}\n\nPrompt: ${prompt || 'Generate content'}\n\nSource Material:\n${sourceContent}`;
      
      await addPiece({
        title: `${platform} Draft - ${prompt || 'Generated Content'}`,
        content: generatedContent,
        platform,
        sourceIds,
        tags: [...new Set(selectedSources.flatMap(s => s.tags))],
        status: 'draft'
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive"
      });
    }
  };

  const generateContentIdea = async (prompt: string, sourceIds?: string[], transcript?: string) => {
    try {
      const selectedSources = sourceIds ? sources.filter(source => sourceIds.includes(source.id)) : [];
      
      let ideaContent = `Content Idea: ${prompt}\n\n`;
      
      if (transcript) {
        ideaContent += `Transcript Reference: ${transcript}\n\n`;
      }
      
      if (selectedSources.length > 0) {
        ideaContent += `Related Sources: ${selectedSources.map(s => s.title).join(', ')}\n\n`;
        ideaContent += `Source Insights:\n${selectedSources.map(s => `- ${s.title}: ${s.summary}`).join('\n')}\n\n`;
      }
      
      ideaContent += `Status: Ready for development into content draft`;
      
      await addPiece({
        title: `Idea: ${prompt}`,
        content: ideaContent,
        platform: 'general',
        sourceIds: sourceIds || [],
        tags: selectedSources.length > 0 ? [...new Set(selectedSources.flatMap(s => s.tags))] : ['idea'],
        status: 'idea'
      });
      
      toast({
        title: "Content Idea Created",
        description: "Your content idea has been saved and can now be developed into a draft"
      });
    } catch (error) {
      console.error('Error creating content idea:', error);
      toast({
        title: "Error",
        description: "Failed to create content idea",
        variant: "destructive"
      });
    }
  };

  const promoteToNextStage = async (id: string, currentStatus: string) => {
    try {
      const statusFlow = {
        'idea': 'draft',
        'draft': 'review',
        'review': 'approved',
        'approved': 'published'
      };
      
      const nextStatus = statusFlow[currentStatus as keyof typeof statusFlow];
      if (!nextStatus) {
        toast({
          title: "Info",
          description: "This content is already at the final stage",
          variant: "default"
        });
        return;
      }
      
      await updatePiece(id, { status: nextStatus as ContentPiece['status'] });
      
      toast({
        title: "Status Updated",
        description: `Content moved from ${currentStatus} to ${nextStatus}`
      });
    } catch (error) {
      console.error('Error promoting content:', error);
      toast({
        title: "Error",
        description: "Failed to update content status",
        variant: "destructive"
      });
    }
  };

  return (
    <ContentContext.Provider value={{
      sources,
      pieces,
      loading,
      addSource,
      addPiece,
      updatePiece,
      deletePiece,
      generateContentFromSources,
      generateContentIdea,
      promoteToNextStage
    }}>
      {children}
    </ContentContext.Provider>
  );
};