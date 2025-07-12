import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LinkedinIcon } from 'lucide-react';
import { ChannelSetup } from '@/components/channels/ChannelSetup';
import { ContentPieces } from '@/components/channels/ContentPieces';

const LinkedIn = () => {
  const [profile, setProfile] = useState({
    id: 'linkedin-main',
    name: '',
    description: '',
    tags: [],
    isSetup: false
  });

  const handleSaveProfile = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
          <LinkedinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LinkedIn Channel</h1>
          <p className="text-muted-foreground">Manage your LinkedIn professional presence and content</p>
        </div>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup">Profile Setup</TabsTrigger>
          <TabsTrigger value="content">Content Library</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <ChannelSetup
            platform="LinkedIn"
            icon={LinkedinIcon}
            profile={profile}
            onSave={handleSaveProfile}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentPieces platform="LinkedIn" icon={LinkedinIcon} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkedIn;