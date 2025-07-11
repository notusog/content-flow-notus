import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileAudio, 
  FileVideo, 
  FileText, 
  Zap, 
  Brain,
  Lightbulb,
  Tag,
  Quote,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InsightExtractor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast({
            title: "Insights Extracted Successfully",
            description: "AI has analyzed your content and extracted key insights.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const sampleInsights = {
    topics: [
      { name: 'Content Strategy', type: 'Tactical', confidence: 95 },
      { name: 'Personal Growth', type: 'Aspirational', confidence: 89 },
      { name: 'Market Insights', type: 'Insightful', confidence: 92 },
      { name: 'Career Journey', type: 'Personal', confidence: 87 }
    ],
    goldNuggets: [
      { text: "The biggest mistake agencies make is treating content as a commodity rather than a strategic asset.", type: 'insight' },
      { text: "We increased our client's pipeline by 340% in 6 months using this exact framework.", type: 'metric' },
      { text: "I remember when I first started, I was making content that nobody cared about...", type: 'story' }
    ],
    voiceprint: {
      tone: 'Professional yet approachable',
      vocabulary: 'Business-focused with storytelling elements',
      structure: 'Hook-Story-Takeaway format preferred',
      engagement: 'Uses questions and direct address'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insight Extractor</h1>
        <p className="text-muted-foreground">
          Transform raw content into structured insights and voice patterns
        </p>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Content</span>
            </CardTitle>
            <CardDescription>
              Upload audio, video, or text files for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
              <div className="flex justify-center space-x-4">
                <FileAudio className="h-8 w-8 text-muted-foreground" />
                <FileVideo className="h-8 w-8 text-muted-foreground" />
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">
                  Supports MP3, MP4, YouTube links, and text files
                </p>
              </div>
              <Button onClick={handleFileUpload} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                  </>
                )}
              </Button>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>AI Processing</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  Transcribing audio, identifying speakers, and extracting insights...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Capabilities</span>
            </CardTitle>
            <CardDescription>
              What our AI extracts from your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Topic Extraction</h4>
                  <p className="text-sm text-muted-foreground">
                    Identify key themes and categorize by content pillars
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-700">
                  <Quote className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Golden Nuggets</h4>
                  <p className="text-sm text-muted-foreground">
                    Extract compelling stories, quotes, and metrics
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Voice Pattern Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Create unique voiceprint for consistent content generation
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Results */}
      {progress === 100 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">Extraction Results</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Content Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleInsights.topics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{topic.name}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {topic.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-green-600">
                        {topic.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Golden Nuggets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Golden Nuggets</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleInsights.goldNuggets.map((nugget, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <p className="text-sm italic">"{nugget.text}"</p>
                    <Badge variant="secondary" className="text-xs mt-2">
                      {nugget.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Voiceprint */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Voice Pattern</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Tone</p>
                    <p className="text-sm">{sampleInsights.voiceprint.tone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Structure</p>
                    <p className="text-sm">{sampleInsights.voiceprint.structure}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Engagement Style</p>
                    <p className="text-sm">{sampleInsights.voiceprint.engagement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}