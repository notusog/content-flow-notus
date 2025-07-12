export type UserRole = 'strategist' | 'client' | 'gtm' | 'leadership';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  clientId?: string; // For client users
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const ROLE_PERMISSIONS = {
  strategist: {
    name: 'Content Strategist',
    description: 'Full access to client workspaces and content pipelines',
    permissions: ['content:create', 'content:edit', 'content:schedule', 'ai:draft', 'insights:extract']
  },
  client: {
    name: 'Client Visionary',
    description: 'Read-only dashboard for content calendar and approvals',
    permissions: ['content:view', 'content:approve', 'content:comment', 'reports:view']
  },
  gtm: {
    name: 'GTM Setter',
    description: 'Access to lead scoring and pipeline tasks',
    permissions: ['leads:view', 'tasks:complete', 'pipeline:access']
  },
  leadership: {
    name: 'Leadership Architect',
    description: 'Admin dashboard with full oversight and reporting',
    permissions: ['admin:all', 'reports:export', 'users:manage', 'modules:toggle']
  }
} as const;