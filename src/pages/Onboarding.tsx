import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  User, 
  Mail, 
  Upload, 
  Users, 
  ArrowRight,
  Building,
  Target,
  FileText,
  Zap
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
}

export default function Onboarding() {
  const { user, profile, updateProfile, isContentStrategist, refreshClientRelationships } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form data
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    company: profile?.company || '',
  });
  const [clientInvites, setClientInvites] = useState([
    { email: '', name: '' }
  ]);

  const strategistSteps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us about yourself and your agency',
      icon: User,
      completed: false
    },
    {
      id: 'clients',
      title: 'Invite Your First Clients',
      description: 'Add clients to start managing their content',
      icon: Users,
      completed: false
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start creating amazing content strategies',
      icon: CheckCircle,
      completed: false
    }
  ];

  const clientSteps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us about your brand and goals',
      icon: User,
      completed: false
    },
    {
      id: 'brand',
      title: 'Set Up Your Brand',
      description: 'Create your first personal brand profile',
      icon: Target,
      completed: false
    },
    {
      id: 'complete',
      title: 'Welcome to Your Portal!',
      description: 'Your content strategist will start creating content for you',
      icon: CheckCircle,
      completed: false
    }
  ];

  const steps = isContentStrategist ? strategistSteps : clientSteps;
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (profile?.onboarding_completed) {
      navigate('/');
    }
  }, [profile, navigate]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: profileData.full_name,
        company: profileData.company,
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });

      setCurrentStep(1);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientInvites = async () => {
    setLoading(true);
    try {
      const validInvites = clientInvites.filter(invite => 
        invite.email.trim() && invite.name.trim()
      );

      if (validInvites.length === 0) {
        // Skip if no invites, go to next step
        setCurrentStep(2);
        return;
      }

      for (const invite of validInvites) {
        const { error } = await supabase
          .from('client_invitations')
          .insert({
            strategist_id: user?.id,
            email: invite.email.trim(),
            client_name: invite.name.trim(),
          });

        if (error) throw error;
      }

      toast({
        title: "Invitations sent",
        description: `${validInvites.length} client invitation(s) sent successfully.`,
      });

      await refreshClientRelationships();
      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: "Error sending invitations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = async () => {
    setLoading(true);
    try {
      // First create a workspace for the client
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          user_id: user?.id,
          client_id: user?.id,
          name: `${profileData.full_name || 'My'} Workspace`,
          description: 'Personal workspace',
        })
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Create a default personal brand for the client
      const { error } = await supabase
        .from('personal_brands')
        .insert({
          user_id: user?.id,
          client_id: user?.id,
          workspace_id: workspace.id,
          name: profileData.full_name || 'My Personal Brand',
          description: 'My personal brand description',
        });

      if (error) throw error;

      toast({
        title: "Brand created",
        description: "Your personal brand has been set up successfully.",
      });

      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: "Error creating brand",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        onboarding_completed: true,
      });

      if (error) throw error;

      toast({
        title: "Welcome aboard! 🎉",
        description: "Your account is now fully set up.",
      });

      // Force a page refresh to ensure proper navigation
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error completing onboarding",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addClientInvite = () => {
    setClientInvites([...clientInvites, { email: '', name: '' }]);
  };

  const updateClientInvite = (index: number, field: 'email' | 'name', value: string) => {
    const updated = [...clientInvites];
    updated[index][field] = value;
    setClientInvites(updated);
  };

  const removeClientInvite = (index: number) => {
    if (clientInvites.length > 1) {
      setClientInvites(clientInvites.filter((_, i) => i !== index));
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ 
                  ...prev, full_name: e.target.value 
                }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">
                {isContentStrategist ? 'Agency/Company Name' : 'Company/Brand Name'}
              </Label>
              <Input
                id="company"
                value={profileData.company}
                onChange={(e) => setProfileData(prev => ({ 
                  ...prev, company: e.target.value 
                }))}
                placeholder={isContentStrategist ? 'Your agency name' : 'Your company name'}
              />
            </div>
            <Button 
              onClick={handleProfileUpdate} 
              disabled={loading || !profileData.full_name.trim()}
              className="w-full"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Invite clients to start managing their content. You can always add more later.
            </p>
            {clientInvites.map((invite, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Client {index + 1}</h4>
                  {clientInvites.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeClientInvite(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Client Name</Label>
                    <Input
                      value={invite.name}
                      onChange={(e) => updateClientInvite(index, 'name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={invite.email}
                      onChange={(e) => updateClientInvite(index, 'email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addClientInvite} className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Add Another Client
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                Skip for Now
              </Button>
              <Button onClick={handleClientInvites} disabled={loading} className="flex-1">
                Send Invitations <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'brand':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We'll create a basic personal brand profile for you. Your content strategist will help you customize it further.
            </p>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Your Personal Brand</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Name:</strong> {profileData.full_name || 'Your Name'}<br />
                <strong>Company:</strong> {profileData.company || 'Your Company'}
              </p>
            </div>
            <Button onClick={handleCreateBrand} disabled={loading} className="w-full">
              Create My Brand <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {isContentStrategist ? 'Your agency is ready!' : 'Welcome to your portal!'}
              </h3>
              <p className="text-muted-foreground">
                {isContentStrategist 
                  ? 'You can now start managing clients and creating content strategies.'
                  : 'Your content strategist will start creating amazing content for your brand.'
                }
              </p>
            </div>
            <Button onClick={completeOnboarding} disabled={loading} className="w-full">
              Get Started <Zap className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">notus OS</h1>
          </div>
          <p className="text-muted-foreground">
            Let's get you set up in just a few steps
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Current Step */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {React.createElement(steps[currentStep].icon, { className: "h-5 w-5 text-primary" })}
              </div>
              <div>
                <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Steps Overview */}
        <div className="flex justify-center space-x-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}