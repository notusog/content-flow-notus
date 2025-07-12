import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube } from 'lucide-react';
import { ChannelSetup } from '@/components/channels/ChannelSetup';
import { ContentPieces } from '@/components/channels/ContentPieces';

const YouTube = () => {
  const [profile, setProfile] = useState({
    id: 'youtube-main',
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
        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
          <Youtube className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">YouTube Channel</h1>
          <p className="text-muted-foreground">Manage your YouTube channel and content</p>
        </div>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup">Channel Setup</TabsTrigger>
          <TabsTrigger value="content">Content Library</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <ChannelSetup
            platform="YouTube"
            icon={Youtube}
            profile={profile}
            onSave={handleSaveProfile}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentPieces platform="YouTube" icon={Youtube} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YouTube;