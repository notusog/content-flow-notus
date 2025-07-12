import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, Edit, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChannelProfile {
  id: string;
  name: string;
  description: string;
  profileImage?: string;
  bannerImage?: string;
  tags: string[];
  isSetup: boolean;
}

interface ChannelSetupProps {
  platform: string;
  icon: React.ComponentType<any>;
  profile: ChannelProfile;
  onSave: (profile: ChannelProfile) => void;
}

export function ChannelSetup({ platform, icon: Icon, profile, onSave }: ChannelSetupProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!profile.isSetup);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave({ ...formData, isSetup: true });
    setIsEditing(false);
    toast({
      title: "Profile Saved",
      description: `${platform} profile has been updated successfully.`
    });
  };

  const handleImageUpload = (type: 'profile' | 'banner') => {
    // Simulate image upload
    const fakeUrl = `https://via.placeholder.com/${type === 'profile' ? '150x150' : '800x200'}?text=${platform}+${type}`;
    setFormData(prev => ({
      ...prev,
      [type === 'profile' ? 'profileImage' : 'bannerImage']: fakeUrl
    }));
  };

  if (!isEditing && profile.isSetup) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{platform} Profile</CardTitle>
              <CardDescription>Channel setup and branding</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            {formData.profileImage && (
              <img 
                src={formData.profileImage} 
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{formData.name}</h3>
              <p className="text-muted-foreground">{formData.description}</p>
            </div>
          </div>
          
          {formData.bannerImage && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border">
              <img 
                src={formData.bannerImage} 
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Setup {platform} Profile</CardTitle>
            <CardDescription>Configure your channel branding and information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name *</Label>
            <Input
              id="name"
              placeholder="Enter channel name..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas..."
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your channel and content focus..."
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Profile Image</Label>
            <div className="flex items-center space-x-4">
              {formData.profileImage ? (
                <img 
                  src={formData.profileImage} 
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleImageUpload('profile')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Banner Image</Label>
            <div className="space-y-2">
              {formData.bannerImage ? (
                <div className="relative w-full h-24 rounded-lg overflow-hidden border">
                  <img 
                    src={formData.bannerImage} 
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-24 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">No banner uploaded</span>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleImageUpload('banner')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Banner
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {profile.isSetup && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}