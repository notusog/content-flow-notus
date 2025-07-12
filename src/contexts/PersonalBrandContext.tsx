import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useWorkspace } from './WorkspaceContext';
import { useToast } from '@/hooks/use-toast';

interface PersonalBrand {
  id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  description?: string;
  bio?: string;
  expertise_areas?: string[];
  tone_of_voice?: string;
  brand_colors?: any;
  social_links?: any;
  avatar_url?: string;
  banner_url?: string;
  knowledge_base?: any;
  created_at: string;
  updated_at: string;
}

interface PersonalBrandContextType {
  personalBrands: PersonalBrand[];
  currentPersonalBrand: PersonalBrand | null;
  loading: boolean;
  setCurrentPersonalBrand: (brand: PersonalBrand | null) => void;
  createPersonalBrand: (data: { name: string; description?: string; bio?: string; expertise_areas?: string[]; tone_of_voice?: string; workspace_id: string }) => Promise<void>;
  updatePersonalBrand: (id: string, updates: Partial<PersonalBrand>) => Promise<void>;
  deletePersonalBrand: (id: string) => Promise<void>;
}

const PersonalBrandContext = createContext<PersonalBrandContextType | undefined>(undefined);

export const usePersonalBrand = () => {
  const context = useContext(PersonalBrandContext);
  if (!context) {
    throw new Error('usePersonalBrand must be used within a PersonalBrandProvider');
  }
  return context;
};

export function PersonalBrandProvider({ children }: { children: ReactNode }) {
  const [personalBrands, setPersonalBrands] = useState<PersonalBrand[]>([]);
  const [currentPersonalBrand, setCurrentPersonalBrand] = useState<PersonalBrand | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();

  // Fetch personal brands for current workspace
  const fetchPersonalBrands = async () => {
    if (!user || !currentWorkspace) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('personal_brands')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setPersonalBrands(data || []);
      
      // Set current personal brand to first one if none selected
      if (!currentPersonalBrand && data && data.length > 0) {
        setCurrentPersonalBrand(data[0]);
      }

    } catch (error) {
      console.error('Error fetching personal brands:', error);
      toast({
        title: "Error",
        description: "Failed to load personal brands",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalBrands();
  }, [user, currentWorkspace?.id]);

  const createPersonalBrand = async (data: { name: string; description?: string; bio?: string; expertise_areas?: string[]; tone_of_voice?: string; workspace_id: string }) => {
    if (!user) return;

    try {
      const { data: brand, error } = await supabase
        .from('personal_brands')
        .insert({
          name: data.name,
          description: data.description || null,
          bio: data.bio || null,
          expertise_areas: data.expertise_areas || [],
          tone_of_voice: data.tone_of_voice || null,
          user_id: user.id,
          workspace_id: data.workspace_id,
        })
        .select()
        .single();

      if (error) throw error;

      setPersonalBrands(prev => [brand, ...prev]);
      setCurrentPersonalBrand(brand);

      toast({
        title: "Success",
        description: "Personal brand created successfully",
      });
    } catch (error) {
      console.error('Error creating personal brand:', error);
      toast({
        title: "Error",
        description: "Failed to create personal brand",
        variant: "destructive",
      });
    }
  };

  const updatePersonalBrand = async (id: string, updates: Partial<PersonalBrand>) => {
    try {
      const { data, error } = await supabase
        .from('personal_brands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPersonalBrands(prev => prev.map(b => b.id === id ? data : b));
      if (currentPersonalBrand?.id === id) {
        setCurrentPersonalBrand(data);
      }

      toast({
        title: "Success",
        description: "Personal brand updated successfully",
      });
    } catch (error) {
      console.error('Error updating personal brand:', error);
      toast({
        title: "Error",
        description: "Failed to update personal brand",
        variant: "destructive",
      });
    }
  };

  const deletePersonalBrand = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personal_brands')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPersonalBrands(prev => prev.filter(b => b.id !== id));
      if (currentPersonalBrand?.id === id) {
        setCurrentPersonalBrand(personalBrands[0] || null);
      }

      toast({
        title: "Success",
        description: "Personal brand deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting personal brand:', error);
      toast({
        title: "Error",
        description: "Failed to delete personal brand",
        variant: "destructive",
      });
    }
  };

  return (
    <PersonalBrandContext.Provider value={{
      personalBrands,
      currentPersonalBrand,
      loading,
      setCurrentPersonalBrand,
      createPersonalBrand,
      updatePersonalBrand,
      deletePersonalBrand,
    }}>
      {children}
    </PersonalBrandContext.Provider>
  );
}