import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  Users, 
  BarChart3, 
  Settings,
  Lightbulb,
  Target,
  Youtube,
  Mail,
  Download,
  LinkedinIcon,
  Brain,
  Bot,
  User,
  ChevronDown,
  ChevronRight
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
    title: 'Workspace',
    defaultOpen: true,
    items: [
      {
        title: 'Dashboard',
        url: '/',
        icon: LayoutDashboard,
        permissions: ['content:view', 'admin:all']
      },
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
      }
    ]
  },
  {
    title: 'Channels',
    defaultOpen: false,
    items: [
      {
        title: 'Multi-Channel Hub',
        url: '/channels',
        icon: Zap,
        permissions: ['content:schedule', 'content:view', 'admin:all']
      },
      {
        title: 'YouTube',
        url: '/youtube',
        icon: Youtube,
        permissions: ['content:create', 'content:view', 'admin:all']
      },
      {
        title: 'LinkedIn',
        url: '/linkedin',
        icon: LinkedinIcon,
        permissions: ['content:create', 'content:view', 'admin:all']
      },
      {
        title: 'Newsletters',
        url: '/newsletters',
        icon: Mail,
        permissions: ['content:create', 'content:view', 'admin:all']
      },
      {
        title: 'Lead Magnets',
        url: '/lead-magnets',
        icon: Download,
        permissions: ['content:create', 'content:view', 'admin:all']
      }
    ]
  },
  {
    title: 'Intelligence',
    defaultOpen: false,
    items: [
      {
        title: 'Insight Extractor',
        url: '/insights',
        icon: Lightbulb,
        permissions: ['insights:extract', 'admin:all']
      },
      {
        title: 'Analytics',
        url: '/analytics',
        icon: BarChart3,
        permissions: ['reports:view', 'admin:all']
      },
      {
        title: 'Digital Twins',
        url: '/digital-twins',
        icon: Bot,
        permissions: ['content:view', 'admin:all']
      }
    ]
  },
  {
    title: 'Business',
    defaultOpen: false,
    items: [
      {
        title: 'CRM',
        url: '/crm',
        icon: Users,
        permissions: ['crm:view', 'admin:all']
      },
      {
        title: 'Pipeline',
        url: '/pipeline',
        icon: Target,
        permissions: ['leads:view', 'admin:all']
      },
      {
        title: 'Personal Brands',
        url: '/personal-brands',
        icon: User,
        permissions: ['content:view', 'admin:all']
      }
    ]
  }
];

const managementItems: NavItem[] = [
  {
    title: 'Team',
    url: '/team',
    icon: Users,
    permissions: ['users:manage', 'admin:all']
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    permissions: ['admin:all', 'content:view']
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { hasPermission, user } = useAuth();
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

  const hasGroupPermission = (items: NavItem[]) =>
    items.some(item => item.permissions.some(permission => hasPermission(permission)));

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

        {/* Navigation Groups */}
        <div className="space-y-1">
          {navigationGroups.map((group) => {
            if (!hasGroupPermission(group.items)) return null;
            
            const visibleItems = group.items.filter(item => 
              item.permissions.some(permission => hasPermission(permission))
            );

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

        {/* Management Items */}
        <div className="mt-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-3">
                {managementItems
                  .filter(item => item.permissions.some(permission => hasPermission(permission)))
                  .map((item) => (
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
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User Role Badge */}
        {!collapsed && user && (
          <div className="px-6 mt-auto pt-4">
            <div className="p-3 rounded-lg bg-muted/40 border">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                     {user.role === 'strategist' ? 'Strategist' : 
                     user.role === 'leadership' ? 'Architect' :
                     user.role === 'gtm' ? 'Setter' : 'Visionary'}
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