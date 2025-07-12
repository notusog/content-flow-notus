import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CSVProcessRequest {
  csvData: string;
  reportName: string;
  reportType: 'linkedin' | 'content_performance' | 'engagement' | 'custom';
  workspaceId: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
}

interface CSVExportRequest {
  reportId?: string;
  reportType: 'linkedin' | 'content_performance' | 'engagement' | 'custom';
  workspaceId: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  customQuery?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'import';

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    if (action === 'import') {
      // Import CSV data
      const { csvData, reportName, reportType, workspaceId, dateRangeStart, dateRangeEnd }: CSVProcessRequest = await req.json();

      if (!csvData || !reportName || !reportType || !workspaceId) {
        throw new Error('Missing required fields for CSV import');
      }

      console.log('Processing CSV import:', reportName, reportType);

      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/\"/g, ''));
      
      const jsonData = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/\"/g, ''));
        const row: any = { row_index: index };
        
        headers.forEach((header, i) => {
          let value = values[i] || '';
          
          // Try to parse numbers
          if (!isNaN(Number(value)) && value !== '') {
            value = Number(value);
          }
          
          // Try to parse dates
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            // Keep as string for now, but mark as date
            row[`${header}_is_date`] = true;
          }
          
          row[header] = value;
        });
        
        return row;
      });

      // Store in database
      const { data: report, error: insertError } = await supabase
        .from('analytics_reports')
        .insert({
          workspace_id: workspaceId,
          user_id: user.id,
          report_type: reportType,
          report_name: reportName,
          data_source: 'csv_upload',
          csv_data: jsonData,
          raw_csv_text: csvData,
          date_range_start: dateRangeStart || null,
          date_range_end: dateRangeEnd || null,
          metadata: {
            headers: headers,
            row_count: jsonData.length,
            import_date: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log('CSV import completed successfully');

      return new Response(
        JSON.stringify({ 
          success: true,
          report_id: report.id,
          rows_imported: jsonData.length,
          headers: headers
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'export') {
      // Export data as CSV
      const { reportId, reportType, workspaceId, dateRangeStart, dateRangeEnd, customQuery }: CSVExportRequest = await req.json();

      console.log('Processing CSV export for:', reportType, workspaceId);

      let csvData = '';

      if (reportId) {
        // Export specific report
        const { data: report, error: reportError } = await supabase
          .from('analytics_reports')
          .select('*')
          .eq('id', reportId)
          .eq('user_id', user.id)
          .single();

        if (reportError || !report) {
          throw new Error('Report not found');
        }

        csvData = report.raw_csv_text || '';
        
        if (!csvData && report.csv_data) {
          // Generate CSV from JSON data
          const data = report.csv_data as any[];
          if (data.length > 0) {
            const headers = Object.keys(data[0]).filter(key => !key.endsWith('_is_date') && key !== 'row_index');
            csvData = headers.join(',') + '\n';

            csvData += data.map(row => 
              headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
              }).join(',')
            ).join('\n');
          }
        }

      } else if (reportType === 'linkedin') {
        // Export LinkedIn metrics
        let query = supabase
          .from('linkedin_metrics')
          .select('*')
          .eq('workspace_id', workspaceId)
          .eq('user_id', user.id);

        if (dateRangeStart) {
          query = query.gte('post_date', dateRangeStart);
        }
        if (dateRangeEnd) {
          query = query.lte('post_date', dateRangeEnd);
        }

        const { data: metrics, error: metricsError } = await query;

        if (metricsError) {
          throw metricsError;
        }

        if (metrics && metrics.length > 0) {
          const headers = Object.keys(metrics[0]);
          csvData = headers.join(',') + '\n';

          csvData += metrics.map(row => 
            headers.map(header => {
              const value = (row as any)[header];
              return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(',')
          ).join('\n');
        }

      } else if (reportType === 'content_performance') {
        // Export content performance data
        const { data: contentPieces, error: contentError } = await supabase
          .from('content_pieces')
          .select(`
            *,
            linkedin_metrics(*)
          `)
          .eq('workspace_id', workspaceId)
          .eq('user_id', user.id);

        if (contentError) {
          throw contentError;
        }

        if (contentPieces && contentPieces.length > 0) {
          const headers = ['title', 'platform', 'status', 'created_at', 'impressions', 'engagement_count', 'likes_count', 'comments_count', 'shares_count', 'engagement_rate'];
          csvData = headers.join(',') + '\n';
          
          csvData += contentPieces.map(piece => {
            const metrics = (piece as any).linkedin_metrics?.[0] || {};
            return [
              piece.title,
              piece.platform,
              piece.status,
              piece.created_at,
              metrics.impressions || 0,
              metrics.engagement_count || 0,
              metrics.likes_count || 0,
              metrics.comments_count || 0,
              metrics.shares_count || 0,
              metrics.engagement_rate || 0
            ].map(value => 
              typeof value === 'string' && value.includes(',') ? `"${value}"` : value
            ).join(',');
          }).join('\n');
        }
      }

      if (!csvData) {
        csvData = 'No data available for export\n';
      }

      return new Response(csvData, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${reportType}_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });

    } else {
      throw new Error('Invalid action. Use "import" or "export".');
    }

  } catch (error) {
    console.error('CSV processor error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
