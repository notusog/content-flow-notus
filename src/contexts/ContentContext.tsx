import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ContentSource, ContentPiece } from '@/types/content';

interface ContentContextType {
  sources: ContentSource[];
  pieces: ContentPiece[];
  addSource: (source: Omit<ContentSource, 'id' | 'dateAdded'>) => void;
  addPiece: (piece: Omit<ContentPiece, 'id' | 'createdDate'>) => void;
  updatePiece: (id: string, updates: Partial<ContentPiece>) => void;
  deletePiece: (id: string) => void;
  generateContentFromSources: (sourceIds: string[], platform: string, prompt?: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

const sampleSources: ContentSource[] = [
  {
    id: '1',
    title: 'AI Industry Report 2024',
    type: 'article',
    content: 'Comprehensive analysis of AI trends and adoption in enterprise...',
    summary: 'Key insights on AI transformation in business',
    tags: ['AI', 'enterprise', 'trends'],
    source: 'McKinsey',
    dateAdded: '2024-01-15',
    clientId: 'client-1',
    insights: ['70% increase in AI adoption', 'ROI improvement of 15%'],
    relatedTopics: ['automation', 'digital transformation']
  },
  {
    id: '2',
    title: 'Sales Strategy Meeting Notes',
    type: 'note',
    content: 'Discussion on Q2 goals, pipeline optimization, and team performance...',
    summary: 'Strategic planning for sales growth',
    tags: ['sales', 'strategy', 'Q2'],
    source: 'Internal Meeting',
    dateAdded: '2024-01-20',
    clientId: 'client-1',
    insights: ['Focus on mid-market segment', 'Improve lead qualification'],
    relatedTopics: ['pipeline', 'lead generation']
  }
];

const samplePieces: ContentPiece[] = [
  {
    id: '1',
    title: 'AI Transformation in Enterprise',
    content: 'The future of business lies in AI adoption...',
    platform: 'linkedin',
    sourceIds: ['1'],
    tags: ['AI', 'enterprise'],
    status: 'draft',
    createdDate: '2024-01-22',
    clientId: 'client-1'
  }
];

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [sources, setSources] = useState<ContentSource[]>(sampleSources);
  const [pieces, setPieces] = useState<ContentPiece[]>(samplePieces);

  const addSource = (sourceData: Omit<ContentSource, 'id' | 'dateAdded'>) => {
    const newSource: ContentSource = {
      ...sourceData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setSources(prev => [...prev, newSource]);
  };

  const addPiece = (pieceData: Omit<ContentPiece, 'id' | 'createdDate'>) => {
    const newPiece: ContentPiece = {
      ...pieceData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    setPieces(prev => [...prev, newPiece]);
  };

  const updatePiece = (id: string, updates: Partial<ContentPiece>) => {
    setPieces(prev => prev.map(piece => 
      piece.id === id ? { ...piece, ...updates } : piece
    ));
  };

  const deletePiece = (id: string) => {
    setPieces(prev => prev.filter(piece => piece.id !== id));
  };

  const generateContentFromSources = (sourceIds: string[], platform: string, prompt?: string) => {
    const selectedSources = sources.filter(source => sourceIds.includes(source.id));
    const combinedContent = selectedSources.map(s => s.content).join(' ');
    
    // Simulate AI generation
    const newPiece: ContentPiece = {
      id: Date.now().toString(),
      title: `Generated ${platform} content`,
      content: `AI-generated content based on: ${selectedSources.map(s => s.title).join(', ')}`,
      platform,
      sourceIds,
      tags: [...new Set(selectedSources.flatMap(s => s.tags))],
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      clientId: selectedSources[0]?.clientId || 'default'
    };
    
    setPieces(prev => [...prev, newPiece]);
  };

  return (
    <ContentContext.Provider value={{
      sources,
      pieces,
      addSource,
      addPiece,
      updatePiece,
      deletePiece,
      generateContentFromSources
    }}>
      {children}
    </ContentContext.Provider>
  );
};