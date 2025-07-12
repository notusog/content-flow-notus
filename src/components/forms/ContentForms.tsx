import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Lightbulb, 
  FileText, 
  Plus, 
  Calendar as CalendarIcon,
  Send,
  Sparkles,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Content Brief Form Schema
const contentBriefSchema = z.object({
  title: z.string().min(1, "Title is required"),
  channel: z.string().min(1, "Channel is required"),
  contentType: z.string().min(1, "Content type is required"),
  client: z.string().min(1, "Client is required"),
  objectives: z.string().min(10, "Objectives must be at least 10 characters"),
  targetAudience: z.string().min(5, "Target audience is required"),
  keyMessages: z.string().min(10, "Key messages are required"),
  tone: z.string().min(1, "Tone is required"),
  deadline: z.date(),
  priority: z.string().min(1, "Priority is required"),
  attachments: z.array(z.string()).optional()
});

type ContentBriefForm = z.infer<typeof contentBriefSchema>;

// AI Content Generation Form Schema
const aiGenerationSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  contentType: z.string().min(1, "Content type is required"),
  tone: z.string().min(1, "Tone is required"),
  length: z.string().min(1, "Length is required"),
  keywords: z.string().optional(),
  targetAudience: z.string().min(3, "Target audience is required"),
  platform: z.string().min(1, "Platform is required")
});

type AIGenerationForm = z.infer<typeof aiGenerationSchema>;

interface ContentBriefDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContentBriefDialog({ isOpen, onClose }: ContentBriefDialogProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<ContentBriefForm>({
    resolver: zodResolver(contentBriefSchema),
    defaultValues: {
      title: "",
      channel: "",
      contentType: "",
      client: "",
      objectives: "",
      targetAudience: "",
      keyMessages: "",
      tone: "",
      priority: "",
      attachments: []
    }
  });

  const onSubmit = async (data: ContentBriefForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Content Brief Created",
        description: `"${data.title}" has been added to your content pipeline.`
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content brief. Please try again.",
        variant: "destructive"
      });
    }
  };

  const channels = [
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "youtube", label: "YouTube", icon: "🎥" },
    { value: "newsletter", label: "Newsletter", icon: "📧" },
    { value: "instagram", label: "Instagram", icon: "📸" }
  ];

  const getContentTypesForChannel = (channel: string) => {
    switch (channel) {
      case "linkedin":
        return [
          { value: "text-post", label: "Text Post" },
          { value: "text-image", label: "Text + Image" },
          { value: "text-video", label: "Text + Video" },
          { value: "article", label: "LinkedIn Article" }
        ];
      case "youtube":
        return [
          { value: "vlog", label: "Vlog" },
          { value: "tutorial", label: "Tutorial" },
          { value: "interview", label: "Interview" },
          { value: "shorts", label: "YouTube Shorts" }
        ];
      case "newsletter":
        return [
          { value: "weekly-roundup", label: "Weekly Roundup" },
          { value: "industry-insights", label: "Industry Insights" },
          { value: "product-updates", label: "Product Updates" },
          { value: "educational", label: "Educational Newsletter" }
        ];
      case "instagram":
        return [
          { value: "reel", label: "Instagram Reel" },
          { value: "story", label: "Instagram Story" },
          { value: "post", label: "Feed Post" },
          { value: "carousel", label: "Carousel Post" }
        ];
      default:
        return [];
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "friendly", label: "Friendly" },
    { value: "authoritative", label: "Authoritative" },
    { value: "conversational", label: "Conversational" },
    { value: "inspiring", label: "Inspiring" },
    { value: "educational", label: "Educational" },
    { value: "humorous", label: "Humorous" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Create Content Brief</h2>
              <p className="text-sm text-muted-foreground">
                Provide detailed requirements for your content creation
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5 AI Tools for Productivity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedChannel(value);
                        form.setValue('contentType', ''); // Reset content type when channel changes
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border border-border shadow-lg z-50">
                          {channels.map((channel) => (
                            <SelectItem key={channel.value} value={channel.value}>
                              <span className="flex items-center gap-2">
                                {channel.icon} {channel.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!selectedChannel}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedChannel ? "Select content type" : "Select channel first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border border-border shadow-lg z-50">
                          {getContentTypesForChannel(selectedChannel).map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border border-border shadow-lg z-50">
                          <SelectItem value="techcorp">TechCorp</SelectItem>
                          <SelectItem value="innovatelab">InnovateLab</SelectItem>
                          <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                          <SelectItem value="businesspro">BusinessPro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border border-border shadow-lg z-50">
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Content Details */}
              <FormField
                control={form.control}
                name="objectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Objectives</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What do you want to achieve with this content? (e.g., increase brand awareness, generate leads, educate audience)"
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target audience (demographics, interests, pain points)"
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyMessages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Messages</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Main points you want to communicate"
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone & Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        {tones.map((tone) => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deadline */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a deadline</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* File Attachments */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="attachments">Attachments & Files</Label>
                  <div className="mt-2">
                    <input
                      id="attachments"
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload images, videos, or documents to attach to your content brief
                    </p>
                  </div>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                              {file.type.startsWith('image/') ? '🖼️' : 
                               file.type.startsWith('video/') ? '🎥' : '📄'}
                            </div>
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({Math.round(file.size / 1024)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gap-2">
                  <FileText className="h-4 w-4" />
                  Create Brief
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIGenerationDialog({ isOpen, onClose }: AIGenerationDialogProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const form = useForm<AIGenerationForm>({
    resolver: zodResolver(aiGenerationSchema),
    defaultValues: {
      topic: "",
      contentType: "",
      tone: "",
      length: "",
      keywords: "",
      targetAudience: "",
      platform: ""
    }
  });

  const onSubmit = async (data: AIGenerationForm) => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockContent = `# ${data.topic}

In today's rapidly evolving digital landscape, ${data.topic.toLowerCase()} has become increasingly important for ${data.targetAudience}.

## Key Points:
- Revolutionary approach to modern challenges
- Practical implementation strategies
- Real-world case studies and examples
- Future trends and predictions

## Why This Matters:
The impact of ${data.topic.toLowerCase()} extends far beyond traditional boundaries, offering unprecedented opportunities for growth and innovation.

## Next Steps:
1. Assess your current position
2. Develop a strategic roadmap
3. Implement best practices
4. Monitor and optimize performance

${data.keywords ? `\n**Keywords:** ${data.keywords}` : ''}

---
*This content was generated using AI and optimized for ${data.platform}.*`;

      setGeneratedContent(mockContent);
      
      toast({
        title: "Content Generated Successfully",
        description: `AI has created ${data.contentType} content about "${data.topic}".`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const contentTypes = [
    { value: "blog-post", label: "Blog Post" },
    { value: "social-post", label: "Social Media Post" },
    { value: "email", label: "Email Content" },
    { value: "ad-copy", label: "Ad Copy" },
    { value: "product-description", label: "Product Description" },
    { value: "landing-page", label: "Landing Page Copy" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Content Generation</h2>
                <p className="text-sm text-muted-foreground">
                  Generate high-quality content using artificial intelligence
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>

        <div className="p-6">
          {!generatedContent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., AI in Digital Marketing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background border border-border shadow-lg z-50">
                            {contentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background border border-border shadow-lg z-50">
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="authoritative">Authoritative</SelectItem>
                            <SelectItem value="conversational">Conversational</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background border border-border shadow-lg z-50">
                            <SelectItem value="short">Short (100-300 words)</SelectItem>
                            <SelectItem value="medium">Medium (300-800 words)</SelectItem>
                            <SelectItem value="long">Long (800+ words)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Marketing professionals, Small business owners" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border border-border shadow-lg z-50">
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AI, automation, productivity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isGenerating} className="flex-1 gap-2">
                    {isGenerating ? (
                      <>
                        <Brain className="h-4 w-4 animate-pulse" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Content</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setGeneratedContent("")}>
                    Generate New
                  </Button>
                  <Button onClick={() => {
                    navigator.clipboard.writeText(generatedContent);
                    toast({ title: "Copied to clipboard!" });
                  }}>
                    Copy Content
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{generatedContent}</pre>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Save to Pipeline
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}