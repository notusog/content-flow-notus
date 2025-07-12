import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  role: 'content_strategist' | 'client' | null;
  onboarding_completed: boolean;
}

interface ClientRelationship {
  id: string;
  strategist_id: string;
  client_id: string;
  status: string;
  client_profile?: UserProfile;
}

interface UserContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  clientRelationships: ClientRelationship[];
  selectedClientId: string | null;
  selectedClient: UserProfile | null;
  isContentStrategist: boolean;
  isClient: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'content_strategist' | 'client') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  selectClient: (clientId: string | null) => void;
  refreshClientRelationships: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [clientRelationships, setClientRelationships] = useState<ClientRelationship[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setClientRelationships([]);
          setSelectedClientId(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
        
        // If user is a content strategist, fetch client relationships
        if (profileData.role === 'content_strategist') {
          await fetchClientRelationships(userId);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientRelationships = async (strategistId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_relationships')
        .select('*')
        .eq('strategist_id', strategistId)
        .eq('status', 'active');

      if (error) throw error;

      // Fetch client profiles separately
      if (data && data.length > 0) {
        const clientIds = data.map(rel => rel.client_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', clientIds);

        if (profilesError) throw profilesError;

        const relationships = data.map(rel => ({
          ...rel,
          client_profile: profiles?.find(p => p.id === rel.client_id) || null
        }));

        setClientRelationships(relationships);
        
        // Auto-select first client if none selected
        if (relationships.length > 0 && !selectedClientId) {
          setSelectedClientId(relationships[0].client_id);
        }
      } else {
        setClientRelationships([]);
      }
    } catch (error) {
      console.error('Error fetching client relationships:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'content_strategist' | 'client') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role
        }
      }
    });

    if (!error && data.user) {
      // Create user role entry
      await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: role
        });

      // Update profile with role
      await supabase
        .from('profiles')
        .update({ role: role, full_name: fullName })
        .eq('id', data.user.id);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setClientRelationships([]);
    setSelectedClientId(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user found') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }

    return { error };
  };

  const selectClient = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  const refreshClientRelationships = async () => {
    if (user && profile?.role === 'content_strategist') {
      await fetchClientRelationships(user.id);
    }
  };

  const selectedClient = clientRelationships.find(
    rel => rel.client_id === selectedClientId
  )?.client_profile || null;

  const isContentStrategist = profile?.role === 'content_strategist';
  const isClient = profile?.role === 'client';

  const value: UserContextType = {
    user,
    session,
    profile,
    clientRelationships,
    selectedClientId,
    selectedClient,
    isContentStrategist,
    isClient,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    selectClient,
    refreshClientRelationships,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}