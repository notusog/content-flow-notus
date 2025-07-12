import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  FileText, 
  Zap, 
  BarChart3, 
  Youtube,
  LinkedinIcon,
  Brain,
  User,
  Bot,
  Settings,
  ChevronDown,
  ChevronRight,
  Calendar,
  Users,
  Building
} from 'lucide-react';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  permissions: string[];
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navigationGroups: NavGroup[] = [
  {
    title: 'Dashboard',
    defaultOpen: true,
    items: [
      {
        title: 'Overview',
        url: '/',
        icon: LayoutDashboard,
        permissions: ['content:view', 'admin:all']
      },
      {
        title: 'Analytics Hub',
        url: '/analytics',
        icon: BarChart3,
        permissions: ['reports:view', 'admin:all']
      }
    ]
  },
  {
    title: 'Content Management',
    defaultOpen: true,
    items: [
      {
        title: 'Content Engine',
        url: '/content',
        icon: FileText,
        permissions: ['content:create', 'content:view', 'admin:all']
      },
      {
        title: 'Content Library',
        url: '/library',
        icon: Brain,
        permissions: ['content:view', 'admin:all']
      },
      {
        title: 'Content Calendar',
        url: '/content-calendar',
        icon: Calendar,
        permissions: ['content:view', 'admin:all']
      }
    ]
  },
  {
    title: 'Channels',
    defaultOpen: false,
    items: [
      {
        title: 'LinkedIn',
        url: '/linkedin',
        icon: LinkedinIcon,
        permissions: ['content:create', 'content:view', 'admin:all']
      },
      {
        title: 'YouTube',
        url: '/youtube',
        icon: Youtube,
        permissions: ['content:create', 'content:view', 'admin:all']
      }
    ]
  },
  {
    title: 'Setup',
    defaultOpen: false,
    items: [
      {
        title: 'Workspace Setup',
        url: '/workspace-setup',
        icon: Settings,
        permissions: ['content:view', 'admin:all']
      },
      {
        title: 'Personal Brands',
        url: '/personal-brands',
        icon: User,
        permissions: ['content:view', 'admin:all']
      },
      {
        title: 'AI Chat',
        url: '/ai-chat',
        icon: Bot,
        permissions: ['content:view', 'admin:all']
      }
    ]
  }
];


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { 
    user, 
    profile, 
    isContentStrategist, 
    isClient, 
    clientRelationships, 
    selectedClient, 
    selectClient 
  } = useUser();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    navigationGroups.reduce((acc, group) => ({
      ...acc,
      [group.title]: group.defaultOpen ?? false
    }), {})
  );

  const toggleGroup = (groupTitle: string) => {
    if (collapsed) return;
    setOpenGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === path;
    return currentPath.startsWith(path);
  };

  const getNavClassName = (active: boolean) =>
    active 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-muted/60 text-muted-foreground hover:text-foreground";

  // Filter navigation based on user role
  const filteredGroups = navigationGroups.filter(group => {
    if (isClient && group.title === 'Setup') {
      // Clients don't need full setup access
      return false;
    }
    return true;
  });

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} border-r border-border/60`}>
      <SidebarContent className="py-4">
        {/* Brand Header */}
        {!collapsed && (
          <div className="px-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg brand-gradient">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-sm">notus OS</h2>
                <p className="text-xs text-muted-foreground">Content Engine</p>
              </div>
            </div>
          </div>
        )}

        {/* Client Switcher for Content Strategists */}
        {!collapsed && isContentStrategist && clientRelationships.length > 0 && (
          <div className="px-6 mb-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Current Client
            </div>
            <select
              value={selectedClient?.id || ''}
              onChange={(e) => selectClient(e.target.value || null)}
              className="w-full p-2 text-sm border rounded-lg bg-background"
            >
              <option value="">Select Client</option>
              {clientRelationships.map((rel) => (
                <option key={rel.client_id} value={rel.client_id}>
                  {rel.client_profile?.full_name || rel.client_profile?.email || 'Unknown Client'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Groups */}
        <div className="space-y-1">
          {filteredGroups.map((group) => {
            const visibleItems = group.items; // Show all items for authenticated users

            const isGroupOpen = openGroups[group.title];
            const hasActiveItem = visibleItems.some(item => isActive(item.url));

            return (
              <SidebarGroup key={group.title}>
                {!collapsed && (
                  <SidebarGroupLabel 
                    className="px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors flex items-center justify-between"
                    onClick={() => toggleGroup(group.title)}
                  >
                    <span>{group.title}</span>
                    {isGroupOpen ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </SidebarGroupLabel>
                )}
                
                <SidebarGroupContent 
                  className={`overflow-hidden transition-all duration-200 ${
                    collapsed || isGroupOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <SidebarMenu className="space-y-1 px-3">
                    {visibleItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.url} 
                            className={({ isActive: active }) => 
                              `flex items-center space-x-3 px-3 py-2 rounded-lg smooth-transition ${getNavClassName(active || isActive(item.url))}`
                            }
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {!collapsed && (
                              <span className="font-medium text-sm truncate">
                                {item.title}
                              </span>
                            )}
                            {!collapsed && item.badge && (
                              <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </div>


        {/* User Info */}
        {!collapsed && profile && (
          <div className="px-6 mt-auto pt-4">
            <div className="p-3 rounded-lg bg-muted/40 border">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {isContentStrategist ? (
                    <Building className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {profile.full_name || profile.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isContentStrategist ? 'Content Strategist' : 'Client'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}