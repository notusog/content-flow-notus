import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Lightbulb, 
  MessageSquare, 
  Plus,
  X,
  Clock,
  Target,
  Brain,
  Users
} from 'lucide-react';

interface ContentIdea {
  id: string;
  title: string;
  outline: string;
  hook: string;
  questions: string[];
}

interface ContentCallData {
  clientName: string;
  projectName: string;
  projectGoal: string;
  contentArchetype: string;
  targetAudience: string;
  contentGoals: string;
  ideas: ContentIdea[];
  callNotes: string;
  transcript: string;
  nextSteps: string;
}

interface ContentCallFormProps {
  onSubmit: (data: ContentCallData) => void;
  onCancel: () => void;
}

export default function ContentCallForm({ onSubmit, onCancel }: ContentCallFormProps) {
  const [formData, setFormData] = useState<ContentCallData>({
    clientName: '',
    projectName: '',
    projectGoal: '',
    contentArchetype: '',
    targetAudience: '',
    contentGoals: '',
    ideas: [],
    callNotes: '',
    transcript: '',
    nextSteps: ''
  });

  const [newIdea, setNewIdea] = useState<ContentIdea>({
    id: '',
    title: '',
    outline: '',
    hook: '',
    questions: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addIdea = () => {
    if (newIdea.title.trim()) {
      setFormData(prev => ({
        ...prev,
        ideas: [...prev.ideas, { ...newIdea, id: Date.now().toString() }]
      }));
      setNewIdea({
        id: '',
        title: '',
        outline: '',
        hook: '',
        questions: ['']
      });
    }
  };

  const removeIdea = (ideaId: string) => {
    setFormData(prev => ({
      ...prev,
      ideas: prev.ideas.filter(idea => idea.id !== ideaId)
    }));
  };

  const addQuestion = () => {
    setNewIdea(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }));
  };

  const updateQuestion = (index: number, value: string) => {
    setNewIdea(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? value : q)
    }));
  };

  const removeQuestion = (index: number) => {
    setNewIdea(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const generateTranscriptAnalysisPrompt = () => {
    return `[BEGIN OF PROMPT FOR TRANSCRIPT ANALYSIS]

GOAL: I want a structured analysis of the conversations (transcripts) with ${formData.clientName} to identify recurring themes, questions, problems, and best practices.

**ROLE**: You are an analysis tool. Use the following transcript to:
1. Identify recurring **main topics**.
2. Highlight **key insights / bottlenecks** (e.g., issues, challenges, opportunities).
3. Collect **frequent client questions or concerns** (technical, organizational, etc.).
4. Point out **patterns** in the conversation dynamics.
5. Provide **potential next steps** or **recommendations** (e.g., for new content directions).

### Background
- **Project Name**: ${formData.projectName}
- **Project Goal**: ${formData.projectGoal}
- **Client/Industry**: ${formData.clientName}

### Transcript
${formData.transcript}

**TASK**
Summarize the main points and give me a structured overview (lists, bullet points, etc.). Focus on patterns, key insights, recurring themes, and concrete recommendations for the content team.

[END OF PROMPT FOR TRANSCRIPT ANALYSIS]`;
  };

  const generateInterviewQuestionsPrompt = () => {
    return `[BEGIN OF PROMPT FOR NEW INTERVIEW QUESTIONS]

GOAL: I want to create new, targeted interview questions for my next meeting with ${formData.clientName}, based on previous discussions and my current strategy. This will help me gain deeper insights and optimize our content production.

### Context
1. **Past Takeaways** (Transcript Analysis / Summary):
   - ${formData.callNotes}
   
2. **Current Content Archetype**:
   - ${formData.contentArchetype}

3. **Target Audience**:
   - ${formData.targetAudience}

4. **Content Goals**:
   - ${formData.contentGoals}

### Task
Please create a list of **focused interview questions** for my next call with the client:
- They should build upon **past insights** from previous calls.
- They should consider the **current strategy** (above) and the **target audience**.
- They can address technical, organizational, and personal aspects, and encourage **storytelling**.

**Format**
- Provide about 5–10 concise questions.
- Optional: Include brief pointers on how to follow up or probe further.

[END OF PROMPT FOR NEW INTERVIEW QUESTIONS]`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Content Call Preparation & Analysis
          </CardTitle>
          <CardDescription>
            Structured approach to content creation calls with comprehensive prep and analysis tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="setup" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="setup">Client Setup</TabsTrigger>
                <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
                <TabsTrigger value="ideas">Content Ideas</TabsTrigger>
                <TabsTrigger value="notes">Call Notes</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              </TabsList>

              {/* Client Setup Tab */}
              <TabsContent value="setup" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="e.g., Marvin Sangines"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                      placeholder="Personal Brand Development"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectGoal">Project Goal</Label>
                  <Textarea
                    id="projectGoal"
                    value={formData.projectGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectGoal: e.target.value }))}
                    placeholder="Build thought leadership in B2B space, generate qualified leads..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentArchetype">Content Archetype</Label>
                  <Textarea
                    id="contentArchetype"
                    value={formData.contentArchetype}
                    onChange={(e) => setFormData(prev => ({ ...prev, contentArchetype: e.target.value }))}
                    placeholder="Strategic thought leader sharing practical frameworks and insights..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                      placeholder="B2B founders, CEOs, startup executives aged 28-50..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contentGoals">Content Goals</Label>
                    <Textarea
                      id="contentGoals"
                      value={formData.contentGoals}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentGoals: e.target.value }))}
                      placeholder="Generate qualified leads, establish market authority, build trust..."
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* AI Prompts Tab */}
              <TabsContent value="prompts" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      Transcript Analysis Prompt
                    </CardTitle>
                    <CardDescription>
                      Copy this prompt to analyze call transcripts for themes and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={generateTranscriptAnalysisPrompt()}
                      readOnly
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigator.clipboard.writeText(generateTranscriptAnalysisPrompt())}
                    >
                      Copy Prompt
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Interview Questions Generator
                    </CardTitle>
                    <CardDescription>
                      Generate targeted questions for your next client call
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={generateInterviewQuestionsPrompt()}
                      readOnly
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigator.clipboard.writeText(generateInterviewQuestionsPrompt())}
                    >
                      Copy Prompt
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Ideas Tab */}
              <TabsContent value="ideas" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Content Ideas
                    </CardTitle>
                    <CardDescription>
                      Prepare at least 3 ideas with outlines, hooks, and questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing Ideas */}
                    {formData.ideas.map((idea, index) => (
                      <Card key={idea.id} className="border border-border/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Idea {index + 1}: {idea.title}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIdea(idea.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm">
                          <div className="space-y-2">
                            <div>
                              <strong>Outline:</strong> {idea.outline}
                            </div>
                            <div>
                              <strong>Hook:</strong> {idea.hook}
                            </div>
                            <div>
                              <strong>Questions:</strong>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {idea.questions.filter(q => q.trim()).map((question, qIndex) => (
                                  <li key={qIndex}>{question}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Add New Idea */}
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="text-sm">Add New Content Idea</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input
                          value={newIdea.title}
                          onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Idea title..."
                        />
                        <Textarea
                          value={newIdea.outline}
                          onChange={(e) => setNewIdea(prev => ({ ...prev, outline: e.target.value }))}
                          placeholder="Draft a rough outline of the post..."
                          rows={2}
                        />
                        <Textarea
                          value={newIdea.hook}
                          onChange={(e) => setNewIdea(prev => ({ ...prev, hook: e.target.value }))}
                          placeholder="Hook idea..."
                          rows={2}
                        />
                        
                        <div className="space-y-2">
                          <Label>Questions (3-5)</Label>
                          {newIdea.questions.map((question, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={question}
                                onChange={(e) => updateQuestion(index, e.target.value)}
                                placeholder={`Question ${index + 1}...`}
                              />
                              {newIdea.questions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeQuestion(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))
                          }
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addQuestion}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </Button>
                        </div>

                        <Button type="button" onClick={addIdea} className="w-full">
                          Add Idea
                        </Button>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Call Notes Tab */}
              <TabsContent value="notes" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Call Notes
                    </CardTitle>
                    <CardDescription>
                      Take detailed notes during the call with timestamps and key insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.callNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, callNotes: e.target.value }))}
                      placeholder="9:30 - Q2 Travels
- Spent a day in Mallorca with AFC
- Key insights and patterns
- Important client feedback..."
                      rows={12}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transcript Tab */}
              <TabsContent value="transcript" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Call Transcript
                    </CardTitle>
                    <CardDescription>
                      Paste the full transcript for AI analysis and content extraction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.transcript}
                      onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                      placeholder="Paste your Riverside or other transcript here..."
                      rows={12}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.nextSteps}
                      onChange={(e) => setFormData(prev => ({ ...prev, nextSteps: e.target.value }))}
                      placeholder="What content pieces will you create from this call?"
                      rows={3}
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
                Save Content Call
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
