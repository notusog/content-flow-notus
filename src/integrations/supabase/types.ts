export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_reports: {
        Row: {
          created_at: string
          csv_data: Json
          data_source: string
          date_range_end: string | null
          date_range_start: string | null
          id: string
          metadata: Json | null
          raw_csv_text: string | null
          report_name: string
          report_type: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          csv_data: Json
          data_source: string
          date_range_end?: string | null
          date_range_start?: string | null
          id?: string
          metadata?: Json | null
          raw_csv_text?: string | null
          report_name: string
          report_type: string
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          csv_data?: Json
          data_source?: string
          date_range_end?: string | null
          date_range_start?: string | null
          id?: string
          metadata?: Json | null
          raw_csv_text?: string | null
          report_name?: string
          report_type?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_reports_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          agent_type: string
          assistant_message: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          updated_at: string
          user_id: string
          user_message: string
          workspace_id: string
        }
        Insert: {
          agent_type?: string
          assistant_message: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id: string
          user_message: string
          workspace_id: string
        }
        Update: {
          agent_type?: string
          assistant_message?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id?: string
          user_message?: string
          workspace_id?: string
        }
        Relationships: []
      }
      client_invitations: {
        Row: {
          client_name: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invitation_token: string | null
          status: string
          strategist_id: string
          updated_at: string
        }
        Insert: {
          client_name: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invitation_token?: string | null
          status?: string
          strategist_id: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string | null
          status?: string
          strategist_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_relationships: {
        Row: {
          accepted_at: string | null
          client_id: string
          created_at: string
          id: string
          invited_at: string | null
          status: string
          strategist_id: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          client_id: string
          created_at?: string
          id?: string
          invited_at?: string | null
          status?: string
          strategist_id: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          client_id?: string
          created_at?: string
          id?: string
          invited_at?: string | null
          status?: string
          strategist_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_pieces: {
        Row: {
          client_id: string | null
          content: string
          created_at: string
          id: string
          personal_brand_id: string | null
          platform: string
          source_ids: string[] | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string
          id?: string
          personal_brand_id?: string | null
          platform: string
          source_ids?: string[] | null
          status: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string
          id?: string
          personal_brand_id?: string | null
          platform?: string
          source_ids?: string[] | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_pieces_personal_brand_id_fkey"
            columns: ["personal_brand_id"]
            isOneToOne: false
            referencedRelation: "personal_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_pieces_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      content_sources: {
        Row: {
          client_id: string | null
          content: string
          created_at: string
          id: string
          insights: string[] | null
          personal_brand_id: string | null
          related_topics: string[] | null
          source: string | null
          summary: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string
          id?: string
          insights?: string[] | null
          personal_brand_id?: string | null
          related_topics?: string[] | null
          source?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string
          id?: string
          insights?: string[] | null
          personal_brand_id?: string | null
          related_topics?: string[] | null
          source?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_sources_personal_brand_id_fkey"
            columns: ["personal_brand_id"]
            isOneToOne: false
            referencedRelation: "personal_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_sources_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      linkedin_metrics: {
        Row: {
          click_count: number | null
          comments_count: number | null
          content_piece_id: string | null
          created_at: string
          engagement_count: number | null
          engagement_rate: number | null
          id: string
          impressions: number | null
          likes_count: number | null
          linkedin_post_id: string | null
          post_date: string | null
          post_url: string | null
          reach: number | null
          shares_count: number | null
          sync_date: string | null
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          click_count?: number | null
          comments_count?: number | null
          content_piece_id?: string | null
          created_at?: string
          engagement_count?: number | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          likes_count?: number | null
          linkedin_post_id?: string | null
          post_date?: string | null
          post_url?: string | null
          reach?: number | null
          shares_count?: number | null
          sync_date?: string | null
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          click_count?: number | null
          comments_count?: number | null
          content_piece_id?: string | null
          created_at?: string
          engagement_count?: number | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          likes_count?: number | null
          linkedin_post_id?: string | null
          post_date?: string | null
          post_url?: string | null
          reach?: number | null
          shares_count?: number | null
          sync_date?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_metrics_content_piece_id_fkey"
            columns: ["content_piece_id"]
            isOneToOne: false
            referencedRelation: "content_pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "linkedin_metrics_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_brands: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          brand_colors: Json | null
          client_id: string | null
          created_at: string
          description: string | null
          expertise_areas: string[] | null
          id: string
          knowledge_base: Json | null
          name: string
          social_links: Json | null
          tone_of_voice: string | null
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          brand_colors?: Json | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          expertise_areas?: string[] | null
          id?: string
          knowledge_base?: Json | null
          name: string
          social_links?: Json | null
          tone_of_voice?: string | null
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          brand_colors?: Json | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          expertise_areas?: string[] | null
          id?: string
          knowledge_base?: Json | null
          name?: string
          social_links?: Json | null
          tone_of_voice?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      transcript_segments: {
        Row: {
          confidence_score: number | null
          created_at: string
          end_time_seconds: number | null
          id: string
          metadata: Json | null
          segment_index: number
          segment_text: string
          source_id: string
          speaker_name: string | null
          start_time_seconds: number | null
          tags: string[] | null
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          end_time_seconds?: number | null
          id?: string
          metadata?: Json | null
          segment_index: number
          segment_text: string
          source_id: string
          speaker_name?: string | null
          start_time_seconds?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          end_time_seconds?: number | null
          id?: string
          metadata?: Json | null
          segment_index?: number
          segment_text?: string
          source_id?: string
          speaker_name?: string | null
          start_time_seconds?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcript_segments_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "content_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcript_segments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workspace_context: {
        Row: {
          content: string
          context_type: string
          created_at: string
          id: string
          metadata: Json | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          content: string
          context_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          content?: string
          context_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_context_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          client_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_client_data: {
        Args: { _user_id: string; _client_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "content_strategist" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["content_strategist", "client"],
    },
  },
} as const
