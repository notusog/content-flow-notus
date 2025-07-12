export interface ContentSource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'note' | 'recording' | 'document';
  content: string;
  summary: string;
  tags: string[];
  source: string;
  dateAdded: string;
  clientId: string;
  insights: string[];
  relatedTopics: string[];
}

export interface ContentPiece {
  id: string;
  title: string;
  content: string;
  platform: string;
  sourceIds: string[];
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
  createdDate: string;
  clientId: string;
}