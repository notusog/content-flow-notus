-- Create analytics reports table for storing CSV data and reports
CREATE TABLE public.analytics_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  report_type TEXT NOT NULL, -- 'linkedin', 'content_performance', 'engagement', 'custom'
  report_name TEXT NOT NULL,
  data_source TEXT NOT NULL, -- 'csv_upload', 'api_sync', 'manual_entry'
  csv_data JSONB NOT NULL, -- Store CSV data as JSON for querying
  raw_csv_text TEXT, -- Store original CSV text for export
  metadata JSONB DEFAULT '{}', -- Additional report metadata
  date_range_start DATE,
  date_range_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analytics_reports
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_reports
CREATE POLICY "Users can view reports from their workspaces" 
ON public.analytics_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create reports in their workspaces" 
ON public.analytics_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update reports in their workspaces" 
ON public.analytics_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete reports from their workspaces" 
ON public.analytics_reports 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create transcript segments table for timestamped transcripts
CREATE TABLE public.transcript_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.content_sources(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  segment_text TEXT NOT NULL,
  start_time_seconds DECIMAL(10,3), -- Support millisecond precision
  end_time_seconds DECIMAL(10,3),
  segment_index INTEGER NOT NULL,
  speaker_name TEXT,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on transcript_segments
ALTER TABLE public.transcript_segments ENABLE ROW LEVEL SECURITY;

-- Create policies for transcript_segments
CREATE POLICY "Users can view segments from their workspaces" 
ON public.transcript_segments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create segments in their workspaces" 
ON public.transcript_segments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update segments in their workspaces" 
ON public.transcript_segments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete segments from their workspaces" 
ON public.transcript_segments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create LinkedIn metrics table for tracking post performance
CREATE TABLE public.linkedin_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content_piece_id UUID REFERENCES public.content_pieces(id) ON DELETE SET NULL,
  linkedin_post_id TEXT,
  post_url TEXT,
  impressions INTEGER DEFAULT 0,
  engagement_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,4), -- Percentage as decimal (e.g., 0.0325 = 3.25%)
  post_date TIMESTAMP WITH TIME ZONE,
  sync_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on linkedin_metrics
ALTER TABLE public.linkedin_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for linkedin_metrics
CREATE POLICY "Users can view metrics from their workspaces" 
ON public.linkedin_metrics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create metrics in their workspaces" 
ON public.linkedin_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update metrics in their workspaces" 
ON public.linkedin_metrics 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete metrics from their workspaces" 
ON public.linkedin_metrics 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_analytics_reports_updated_at
BEFORE UPDATE ON public.analytics_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transcript_segments_updated_at
BEFORE UPDATE ON public.transcript_segments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_linkedin_metrics_updated_at
BEFORE UPDATE ON public.linkedin_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_analytics_reports_workspace_id ON public.analytics_reports(workspace_id);
CREATE INDEX idx_analytics_reports_user_id ON public.analytics_reports(user_id);
CREATE INDEX idx_analytics_reports_type ON public.analytics_reports(report_type);
CREATE INDEX idx_analytics_reports_date_range ON public.analytics_reports(date_range_start, date_range_end);

CREATE INDEX idx_transcript_segments_source_id ON public.transcript_segments(source_id);
CREATE INDEX idx_transcript_segments_workspace_id ON public.transcript_segments(workspace_id);
CREATE INDEX idx_transcript_segments_user_id ON public.transcript_segments(user_id);
CREATE INDEX idx_transcript_segments_time ON public.transcript_segments(start_time_seconds, end_time_seconds);

CREATE INDEX idx_linkedin_metrics_workspace_id ON public.linkedin_metrics(workspace_id);
CREATE INDEX idx_linkedin_metrics_user_id ON public.linkedin_metrics(user_id);
CREATE INDEX idx_linkedin_metrics_content_piece_id ON public.linkedin_metrics(content_piece_id);
CREATE INDEX idx_linkedin_metrics_post_date ON public.linkedin_metrics(post_date);