import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for development
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@notus.com',
    role: 'strategist',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus@techcorp.com',
    role: 'client',
    clientId: 'client-1',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena@notus.com',
    role: 'gtm',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@notus.com',
    role: 'leadership',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('notus-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
      } catch {
        localStorage.removeItem('notus-user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Demo authentication - in production this would hit your auth API
    const user = DEMO_USERS.find(u => u.email === email);
    if (user && password === 'demo123') {
      localStorage.setItem('notus-user', JSON.stringify(user));
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('notus-user');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    
    // Leadership has all permissions
    if (authState.user.role === 'leadership') return true;
    
    // Check role-specific permissions
    const rolePermissions = {
      strategist: ['content:create', 'content:edit', 'content:schedule', 'ai:draft', 'insights:extract'],
      client: ['content:view', 'content:approve', 'content:comment', 'reports:view'],
      gtm: ['leads:view', 'tasks:complete', 'pipeline:access'],
      leadership: ['admin:all', 'reports:export', 'users:manage', 'modules:toggle']
    };

    return rolePermissions[authState.user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}