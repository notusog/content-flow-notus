import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Video, 
  Image as ImageIcon, 
  FileText, 
  Link,
  Calendar as CalendarIcon,
  Clock,
  Play,
  Edit3,
  X,
  Plus,
  Upload,
  Music,
  Target,
  Lightbulb
} from 'lucide-react';

interface YouTubeContentData {
  title: string;
  client: string;
  episodeNumber: string;
  timeframe: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  rawFootage: string[];
  videoAssets: string[];
  thumbnailOptions: string[];
  titleOptions: string[];
  descriptionOptions: string[];
  vlogOutline: {
    goal: string;
    intro: {
      location: string;
      content: string;
      duration: string;
    };
    mainStory: {
      location: string;
      events: string[];
      bRoll: string;
    };
    outro: {
      location: string;
      reflection: string;
      cliffhanger: string;
      signoff: string;
      duration: string;
    };
  };
  timestamps: string[];
  songsUsed: string[];
  notes: string;
  socialLinks: {
    linkedin: string[];
    instagram: string[];
    tiktok: string[];
    website: string;
  };
}

interface YouTubeContentFormProps {
  onSubmit: (data: YouTubeContentData) => void;
  onCancel: () => void;
}

export default function YouTubeContentForm({ onSubmit, onCancel }: YouTubeContentFormProps) {
  const [formData, setFormData] = useState<YouTubeContentData>({
    title: '',
    client: '',
    episodeNumber: '',
    timeframe: {
      startDate: undefined,
      endDate: undefined
    },
    rawFootage: [''],
    videoAssets: [''],
    thumbnailOptions: [''],
    titleOptions: [''],
    descriptionOptions: [''],
    vlogOutline: {
      goal: '',
      intro: {
        location: '',
        content: '',
        duration: '1-2 min'
      },
      mainStory: {
        location: '',
        events: [''],
        bRoll: ''
      },
      outro: {
        location: '',
        reflection: '',
        cliffhanger: '',
        signoff: '',
        duration: '1-2 min'
      }
    },
    timestamps: [''],
    songsUsed: [''],
    notes: '',
    socialLinks: {
      linkedin: [''],
      instagram: [''],
      tiktok: [''],
      website: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addToArray = (path: string, value: string = '') => {
    setFormData(prev => {
      const keys = path.split('.');
      let current = { ...prev } as any;
      let target = current;
      
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      
      const finalKey = keys[keys.length - 1];
      target[finalKey] = [...target[finalKey], value];
      
      return current;
    });
  };

  const removeFromArray = (path: string, index: number) => {
    setFormData(prev => {
      const keys = path.split('.');
      let current = { ...prev } as any;
      let target = current;
      
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      
      const finalKey = keys[keys.length - 1];
      target[finalKey] = target[finalKey].filter((_: any, i: number) => i !== index);
      
      return current;
    });
  };

  const updateArrayItem = (path: string, index: number, value: string) => {
    setFormData(prev => {
      const keys = path.split('.');
      let current = { ...prev } as any;
      let target = current;
      
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      
      const finalKey = keys[keys.length - 1];
      target[finalKey] = target[finalKey].map((item: any, i: number) => i === index ? value : item);
      
      return current;
    });
  };

  const ArrayInput = ({ 
    path, 
    items, 
    placeholder, 
    icon: Icon, 
    title 
  }: { 
    path: string; 
    items: string[]; 
    placeholder: string; 
    icon: any; 
    title: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateArrayItem(path, index, e.target.value)}
              placeholder={placeholder}
            />
            {items.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeFromArray(path, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addToArray(path)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {title.slice(0, -1)}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            YouTube Content Piece - Charles & Charlotte Style
          </CardTitle>
          <CardDescription>
            Complete YouTube vlog production workflow with assets, outlines, and deliverables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="content">Content Options</TabsTrigger>
                <TabsTrigger value="outline">Vlog Outline</TabsTrigger>
                <TabsTrigger value="details">Production Details</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Content Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Paulina & Pascal | YouTube VLOG #5"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                      placeholder="Charles & Charlotte"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="episode">Episode Number</Label>
                    <Input
                      id="episode"
                      value={formData.episodeNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, episodeNumber: e.target.value }))}
                      placeholder="#5"
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      Timeframe
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[140px] justify-start text-left font-normal",
                              !formData.timeframe.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.timeframe.startDate ? format(formData.timeframe.startDate, "PPP") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.timeframe.startDate}
                            onSelect={(date) => setFormData(prev => ({ 
                              ...prev, 
                              timeframe: { ...prev.timeframe, startDate: date }
                            }))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[140px] justify-start text-left font-normal",
                              !formData.timeframe.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.timeframe.endDate ? format(formData.timeframe.endDate, "PPP") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.timeframe.endDate}
                            onSelect={(date) => setFormData(prev => ({ 
                              ...prev, 
                              timeframe: { ...prev.timeframe, endDate: date }
                            }))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assets Tab */}
              <TabsContent value="assets" className="space-y-6 mt-6">
                <ArrayInput
                  path="rawFootage"
                  items={formData.rawFootage}
                  placeholder="https://drive.google.com/drive/folders/..."
                  icon={Lightbulb}
                  title="Raw Footage Links"
                />

                <ArrayInput
                  path="videoAssets"
                  items={formData.videoAssets}
                  placeholder="https://next.frame.io/share/..."
                  icon={Video}
                  title="Video & Shorts Assets"
                />

                <ArrayInput
                  path="thumbnailOptions"
                  items={formData.thumbnailOptions}
                  placeholder="Thumbnail description or link"
                  icon={ImageIcon}
                  title="Thumbnail Options"
                />
              </TabsContent>

              {/* Content Options Tab */}
              <TabsContent value="content" className="space-y-6 mt-6">
                <ArrayInput
                  path="titleOptions"
                  items={formData.titleOptions}
                  placeholder="ungefiltert: 168 Stunden beim Aufbau einer 7-stelligen Agentur..."
                  icon={Edit3}
                  title="Title Options"
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Description Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.descriptionOptions.map((desc, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Option {index + 1}</Label>
                          {formData.descriptionOptions.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray('descriptionOptions', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <Textarea
                          value={desc}
                          onChange={(e) => updateArrayItem('descriptionOptions', index, e.target.value)}
                          placeholder="Willkommen zu unserem fünften Vlog..."
                          rows={8}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addToArray('descriptionOptions')}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Description Option
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vlog Outline Tab */}
              <TabsContent value="outline" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Vlog Framework
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Goal</Label>
                      <Textarea
                        value={formData.vlogOutline.goal}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vlogOutline: { ...prev.vlogOutline, goal: e.target.value }
                        }))}
                        placeholder="🏁 Goal: Show authentic behind-the-scenes of agency life..."
                        rows={2}
                      />
                    </div>

                    {/* Intro Section */}
                    <Card className="border-l-4 border-primary">
                      <CardHeader>
                        <CardTitle className="text-sm">1. Intro (1-2 min)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={formData.vlogOutline.intro.location}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                vlogOutline: {
                                  ...prev.vlogOutline,
                                  intro: { ...prev.vlogOutline.intro, location: e.target.value }
                                }
                              }))}
                              placeholder="Office, Home, etc."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                              value={formData.vlogOutline.intro.duration}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                vlogOutline: {
                                  ...prev.vlogOutline,
                                  intro: { ...prev.vlogOutline.intro, duration: e.target.value }
                                }
                              }))}
                              placeholder="1-2 min"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={formData.vlogOutline.intro.content}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              vlogOutline: {
                                ...prev.vlogOutline,
                                intro: { ...prev.vlogOutline.intro, content: e.target.value }
                              }
                            }))}
                            placeholder="Brief welcome, intention, teaser..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Main Story Section */}
                    <Card className="border-l-4 border-secondary">
                      <CardHeader>
                        <CardTitle className="text-sm">2. Main Story / Events</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={formData.vlogOutline.mainStory.location}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              vlogOutline: {
                                ...prev.vlogOutline,
                                mainStory: { ...prev.vlogOutline.mainStory, location: e.target.value }
                              }
                            }))}
                            placeholder="Various locations..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Key Events</Label>
                          {formData.vlogOutline.mainStory.events.map((event, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={event}
                                onChange={(e) => updateArrayItem('vlogOutline.mainStory.events', index, e.target.value)}
                                placeholder="Key event or story point..."
                              />
                              {formData.vlogOutline.mainStory.events.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeFromArray('vlogOutline.mainStory.events', index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addToArray('vlogOutline.mainStory.events')}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Event
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Natural B-Roll</Label>
                          <Textarea
                            value={formData.vlogOutline.mainStory.bRoll}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              vlogOutline: {
                                ...prev.vlogOutline,
                                mainStory: { ...prev.vlogOutline.mainStory, bRoll: e.target.value }
                              }
                            }))}
                            placeholder="People talking, walking and living..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Outro Section */}
                    <Card className="border-l-4 border-accent">
                      <CardHeader>
                        <CardTitle className="text-sm">3. Outro & Cliffhanger (1-2 min)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={formData.vlogOutline.outro.location}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                vlogOutline: {
                                  ...prev.vlogOutline,
                                  outro: { ...prev.vlogOutline.outro, location: e.target.value }
                                }
                              }))}
                              placeholder="Same as intro or different..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                              value={formData.vlogOutline.outro.duration}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                vlogOutline: {
                                  ...prev.vlogOutline,
                                  outro: { ...prev.vlogOutline.outro, duration: e.target.value }
                                }
                              }))}
                              placeholder="1-2 min"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Personal Reflection</Label>
                          <Textarea
                            value={formData.vlogOutline.outro.reflection}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              vlogOutline: {
                                ...prev.vlogOutline,
                                outro: { ...prev.vlogOutline.outro, reflection: e.target.value }
                              }
                            }))}
                            placeholder="My favorite part was... It was hard to..."
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cliffhanger</Label>
                          <Textarea
                            value={formData.vlogOutline.outro.cliffhanger}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              vlogOutline: {
                                ...prev.vlogOutline,
                                outro: { ...prev.vlogOutline.outro, cliffhanger: e.target.value }
                              }
                            }))}
                            placeholder="Next vlog will be us at... looking forward to..."
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Signature Sign-off</Label>
                          <Input
                            value={formData.vlogOutline.outro.signoff}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              vlogOutline: {
                                ...prev.vlogOutline,
                                outro: { ...prev.vlogOutline.outro, signoff: e.target.value }
                              }
                            }))}
                            placeholder="und denkt dran - immer eine Handbreit Wasser unterm Kiel"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Production Details Tab */}
              <TabsContent value="details" className="space-y-6 mt-6">
                <ArrayInput
                  path="timestamps"
                  items={formData.timestamps}
                  placeholder="00:00:00:00 Intro"
                  icon={Clock}
                  title="Timestamps"
                />

                <ArrayInput
                  path="songsUsed"
                  items={formData.songsUsed}
                  placeholder="Atomic Kitten – Be with You"
                  icon={Music}
                  title="Songs Used"
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Link className="h-4 w-4 text-muted-foreground" />
                      Social Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input
                        value={formData.socialLinks.website}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, website: e.target.value }
                        }))}
                        placeholder="https://www.charlesandcharlotte.com/"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>LinkedIn Profiles</Label>
                        {formData.socialLinks.linkedin.map((link, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={link}
                              onChange={(e) => updateArrayItem('socialLinks.linkedin', index, e.target.value)}
                              placeholder="LinkedIn profile URL"
                            />
                            {formData.socialLinks.linkedin.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeFromArray('socialLinks.linkedin', index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addToArray('socialLinks.linkedin')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add LinkedIn
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Instagram Profiles</Label>
                        {formData.socialLinks.instagram.map((link, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={link}
                              onChange={(e) => updateArrayItem('socialLinks.instagram', index, e.target.value)}
                              placeholder="Instagram profile URL"
                            />
                            {formData.socialLinks.instagram.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeFromArray('socialLinks.instagram', index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addToArray('socialLinks.instagram')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Instagram
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>TikTok Profiles</Label>
                        {formData.socialLinks.tiktok.map((link, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={link}
                              onChange={(e) => updateArrayItem('socialLinks.tiktok', index, e.target.value)}
                              placeholder="TikTok profile URL"
                            />
                            {formData.socialLinks.tiktok.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeFromArray('socialLinks.tiktok', index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addToArray('socialLinks.tiktok')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add TikTok
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Production Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes, special requirements, behind-the-scenes info..."
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Create YouTube Content
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}