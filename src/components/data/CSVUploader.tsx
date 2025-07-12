import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  AlertCircle, 
  X,
  Download,
  Eye
} from 'lucide-react';

interface CSVData {
  filename: string;
  channel: string;
  uploadDate: string;
  rowCount: number;
  columns: string[];
  status: 'processing' | 'ready' | 'error';
}

interface CSVUploaderProps {
  channel: 'linkedin' | 'youtube' | 'newsletter' | 'lead-magnet';
  onDataProcessed: (data: any[]) => void;
}

export function CSVUploader({ channel, onDataProcessed }: CSVUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [csvFiles, setCsvFiles] = useState<CSVData[]>([]);
  const { toast } = useToast();

  const channelConfigs = {
    linkedin: {
      name: 'LinkedIn',
      expectedColumns: ['Date', 'Impressions', 'Clicks', 'Reactions', 'Comments', 'Shares', 'Post URL'],
      color: 'bg-blue-50 border-blue-200'
    },
    youtube: {
      name: 'YouTube',
      expectedColumns: ['Date', 'Views', 'Watch Time', 'Subscribers Gained', 'Likes', 'Comments', 'Video Title'],
      color: 'bg-red-50 border-red-200'
    },
    newsletter: {
      name: 'Newsletter',
      expectedColumns: ['Date', 'Sends', 'Opens', 'Clicks', 'Unsubscribes', 'Subject Line'],
      color: 'bg-purple-50 border-purple-200'
    },
    'lead-magnet': {
      name: 'Lead Magnets',
      expectedColumns: ['Date', 'Downloads', 'Email Signups', 'Source', 'Magnet Title'],
      color: 'bg-green-50 border-green-200'
    }
  };

  const config = channelConfigs[channel];

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return data;
  };

  const simulateProcessing = (data: any[], filename: string) => {
    const csvData: CSVData = {
      filename,
      channel,
      uploadDate: new Date().toISOString(),
      rowCount: data.length,
      columns: Object.keys(data[0] || {}),
      status: 'processing'
    };

    setCsvFiles(prev => [...prev, csvData]);
    setUploadProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCsvFiles(current => 
            current.map(file => 
              file.filename === filename 
                ? { ...file, status: 'ready' }
                : file
            )
          );
          onDataProcessed(data);
          toast({
            title: "CSV Processed Successfully",
            description: `${data.length} rows imported from ${filename}`,
          });
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        
        if (data.length === 0) {
          throw new Error('No data found in CSV');
        }

        simulateProcessing(data, file.name);
        
      } catch (error) {
        toast({
          title: "Processing Error",
          description: "Failed to process CSV file. Please check the format.",
          variant: "destructive",
        });
        setUploading(false);
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }, [channel, onDataProcessed, toast]);

  const removeFile = (filename: string) => {
    setCsvFiles(prev => prev.filter(file => file.filename !== filename));
  };

  const downloadTemplate = () => {
    const headers = config.expectedColumns.join(',');
    const sampleRow = config.expectedColumns.map(() => 'Sample Data').join(',');
    const csvContent = `${headers}\n${sampleRow}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${channel}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className={config.color}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span>{config.name} Data Import</span>
        </CardTitle>
        <CardDescription>
          Upload CSV exports from {config.name} to analyze performance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <div className="space-y-4">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <Label htmlFor={`${channel}-upload`} className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>Choose CSV File</span>
                </Button>
              </Label>
              <Input
                id={`${channel}-upload`}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload your {config.name} analytics export CSV file
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={downloadTemplate}
              className="text-primary hover:text-primary/80"
            >
              <Download className="h-3 w-3 mr-1" />
              Download Template
            </Button>
          </div>
        </div>

        {/* Expected Columns */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Expected Columns:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {config.expectedColumns.map((col, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {col}
              </Badge>
            ))}
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Uploaded Files */}
        {csvFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Uploaded Files:</Label>
            {csvFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.rowCount} rows • {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'ready' && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Check className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  )}
                  {file.status === 'processing' && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Processing
                    </Badge>
                  )}
                  {file.status === 'error' && (
                    <Badge variant="destructive">
                      <X className="h-3 w-3 mr-1" />
                      Error
                    </Badge>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeFile(file.filename)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}