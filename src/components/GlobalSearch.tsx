import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Lightbulb, 
  Target, 
  Zap, 
  BarChart3,
  Users,
  Settings,
  Search,
  Youtube,
  Mail,
  Download
} from 'lucide-react';

interface CommandItem {
  title: string;
  description: string;
  action: () => void;
  icon: React.ComponentType<any>;
  keywords: string[];
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Global keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigationItems: CommandItem[] = [
    {
      title: 'Dashboard',
      description: 'View your content performance overview',
      action: () => navigate('/'),
      icon: LayoutDashboard,
      keywords: ['dashboard', 'home', 'overview', 'stats']
    },
    {
      title: 'Content Engine',
      description: 'Manage your content pipeline',
      action: () => navigate('/content'),
      icon: FileText,
      keywords: ['content', 'posts', 'kanban', 'pipeline', 'drafts']
    },
    {
      title: 'Insight Extractor',
      description: 'Upload and analyze content for insights',
      action: () => navigate('/insights'),
      icon: Lightbulb,
      keywords: ['insights', 'upload', 'ai', 'analysis', 'voice', 'extract']
    },
    {
      title: 'Pipeline Generator',
      description: 'Manage leads and sales tasks',
      action: () => navigate('/pipeline'),
      icon: Target,
      keywords: ['pipeline', 'leads', 'sales', 'tasks', 'prospects']
    },
    {
      title: 'Multi-Channel Hub',
      description: 'Schedule content across platforms',
      action: () => navigate('/channels'),
      icon: Zap,
      keywords: ['schedule', 'channels', 'calendar', 'linkedin', 'youtube']
    },
    {
      title: 'Analytics',
      description: 'Track performance and ROI',
      action: () => navigate('/analytics'),
      icon: BarChart3,
      keywords: ['analytics', 'metrics', 'performance', 'roi', 'reports']
    },
    {
      title: 'YouTube',
      description: 'Manage video content',
      action: () => navigate('/youtube'),
      icon: Youtube,
      keywords: ['youtube', 'videos', 'clips']
    },
    {
      title: 'Newsletters',
      description: 'Email marketing campaigns',
      action: () => navigate('/newsletters'),
      icon: Mail,
      keywords: ['newsletter', 'email', 'campaigns', 'subscribers']
    },
    {
      title: 'Lead Magnets',
      description: 'Create and manage downloadable content',
      action: () => navigate('/lead-magnets'),
      icon: Download,
      keywords: ['magnets', 'downloads', 'pdfs', 'guides', 'checklists']
    }
  ];

  const quickActions: CommandItem[] = [
    {
      title: 'Create New Content',
      description: 'Start drafting a new content piece',
      action: () => {
        navigate('/content');
        // In a real app, this would open a "new content" modal
      },
      icon: FileText,
      keywords: ['create', 'new', 'content', 'draft', 'post']
    },
    {
      title: 'Upload for Insights',
      description: 'Upload audio/video for AI analysis',
      action: () => {
        navigate('/insights');
      },
      icon: Lightbulb,
      keywords: ['upload', 'analyze', 'insights', 'ai']
    },
    {
      title: 'View Today\'s Tasks',
      description: 'See your pipeline tasks for today',
      action: () => {
        navigate('/pipeline');
      },
      icon: Target,
      keywords: ['tasks', 'today', 'todo', 'pipeline']
    },
    {
      title: 'Schedule Content',
      description: 'Add content to your publishing calendar',
      action: () => {
        navigate('/channels');
      },
      icon: Zap,
      keywords: ['schedule', 'calendar', 'publish']
    }
  ];

  // All authenticated users can see all navigation items
  const visibleNavItems = navigationItems;
  const visibleQuickActions = quickActions;

  const runCommand = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {visibleNavItems.map((item) => (
            <CommandItem
              key={item.title}
              onSelect={() => runCommand(item.action)}
              className="flex items-center space-x-3 p-3"
            >
              <item.icon className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        {visibleQuickActions.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
              {visibleQuickActions.map((item) => (
                <CommandItem
                  key={item.title}
                  onSelect={() => runCommand(item.action)}
                  className="flex items-center space-x-3 p-3"
                >
                  <item.icon className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Tips">
          <CommandItem disabled>
            <Search className="h-4 w-4 mr-3" />
            <div className="text-sm text-muted-foreground">
              Press <kbd className="kbd">⌘K</kbd> anytime to open search
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}