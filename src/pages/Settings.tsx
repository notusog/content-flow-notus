import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Save,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar: string;
    title: string;
    department: string;
    location: string;
    phone: string;
    timezone: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    currency: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    marketing: boolean;
    security: boolean;
    mentions: boolean;
    deadlines: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
    activeSessions: number;
    loginAlerts: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'team' | 'private';
    activityTracking: boolean;
    dataSharing: boolean;
    analyticsOptOut: boolean;
  };
}

const mockSettings: UserSettings = {
  profile: {
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: '/api/placeholder/80/80',
    title: 'Content Strategy Lead',
    department: 'Operations',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    timezone: 'America/Los_Angeles'
  },
  preferences: {
    theme: 'system',
    language: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD'
  },
  notifications: {
    email: true,
    push: true,
    desktop: false,
    marketing: false,
    security: true,
    mentions: true,
    deadlines: true
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: new Date(2023, 11, 15),
    activeSessions: 3,
    loginAlerts: true
  },
  privacy: {
    profileVisibility: 'team',
    activityTracking: true,
    dataSharing: false,
    analyticsOptOut: false
  }
};

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>(mockSettings);
  const [showPassword, setShowPassword] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateSetting = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // Save settings logic here
    setUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <SettingsIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and configuration</p>
          </div>
        </div>
        {unsavedChanges && (
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      {unsavedChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your settings.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings.profile.avatar} alt={settings.profile.name} />
                  <AvatarFallback className="text-lg">
                    {settings.profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={settings.profile.name}
                    onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={settings.profile.email}
                    onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    value={settings.profile.title}
                    onChange={(e) => updateSetting('profile', 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={settings.profile.department} onValueChange={(value) => updateSetting('profile', 'department', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Strategy">Strategy</SelectItem>
                      <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={settings.profile.location}
                    onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={settings.profile.phone}
                    onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.profile.timezone} onValueChange={(value) => updateSetting('profile', 'timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg z-50">
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Interface Preferences
              </CardTitle>
              <CardDescription>
                Customize your interface and display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={settings.preferences.theme} onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('preferences', 'theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.preferences.language} onValueChange={(value) => updateSetting('preferences', 'language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                      <SelectItem value="fr-FR">Français</SelectItem>
                      <SelectItem value="de-DE">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={settings.preferences.dateFormat} onValueChange={(value) => updateSetting('preferences', 'dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select value={settings.preferences.timeFormat} onValueChange={(value: '12h' | '24h') => updateSetting('preferences', 'timeFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.preferences.currency} onValueChange={(value) => updateSetting('preferences', 'currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on mobile devices</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show desktop notifications in browser</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.desktop}
                    onCheckedChange={(checked) => updateSetting('notifications', 'desktop', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Receive product updates and marketing emails</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Important security and account notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.security}
                    onCheckedChange={(checked) => updateSetting('notifications', 'security', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Mentions & Comments</Label>
                    <p className="text-sm text-muted-foreground">When someone mentions you or comments on your content</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.mentions}
                    onCheckedChange={(checked) => updateSetting('notifications', 'mentions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Deadlines & Reminders</Label>
                    <p className="text-sm text-muted-foreground">Task deadlines and scheduled reminders</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.deadlines}
                    onCheckedChange={(checked) => updateSetting('notifications', 'deadlines', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Change Password</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Last changed: {settings.security.lastPasswordChange.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="current-password" 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Key className="h-4 w-4" />
                  Update Password
                </Button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.security.twoFactorEnabled && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Enabled
                      </Badge>
                    )}
                    <Switch 
                      checked={settings.security.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                    />
                  </div>
                </div>
                
                {settings.security.twoFactorEnabled && (
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Smartphone className="h-4 w-4" />
                      Configure Authenticator App
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Backup Codes
                    </Button>
                  </div>
                )}
              </div>

              {/* Active Sessions */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base">Active Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      You have {settings.security.activeSessions} active sessions
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Sign Out All Devices
                  </Button>
                </div>
              </div>

              {/* Login Alerts */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of suspicious login attempts
                    </p>
                  </div>
                  <Switch 
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose who can see your profile information
                  </p>
                  <Select value={settings.privacy.profileVisibility} onValueChange={(value: 'public' | 'team' | 'private') => updateSetting('privacy', 'profileVisibility', value)}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Activity Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow tracking of your activity for analytics and improvements
                    </p>
                  </div>
                  <Switch 
                    checked={settings.privacy.activityTracking}
                    onCheckedChange={(checked) => updateSetting('privacy', 'activityTracking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Share anonymized data to help improve our services
                    </p>
                  </div>
                  <Switch 
                    checked={settings.privacy.dataSharing}
                    onCheckedChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Analytics Opt-out</Label>
                    <p className="text-sm text-muted-foreground">
                      Opt out of all analytics and usage tracking
                    </p>
                  </div>
                  <Switch 
                    checked={settings.privacy.analyticsOptOut}
                    onCheckedChange={(checked) => updateSetting('privacy', 'analyticsOptOut', checked)}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base text-red-600">Danger Zone</Label>
                    <p className="text-sm text-muted-foreground">
                      Irreversible actions that affect your account
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export My Data
                    </Button>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}