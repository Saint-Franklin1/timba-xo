export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_name: string
          career_id: string | null
          cover_letter: string | null
          created_at: string
          email: string
          id: string
          phone: string | null
          resume_url: string | null
        }
        Insert: {
          applicant_name: string
          career_id?: string | null
          cover_letter?: string | null
          created_at?: string
          email: string
          id?: string
          phone?: string | null
          resume_url?: string | null
        }
        Update: {
          applicant_name?: string
          career_id?: string | null
          cover_letter?: string | null
          created_at?: string
          email?: string
          id?: string
          phone?: string | null
          resume_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      careers: {
        Row: {
          created_at: string
          deadline: string | null
          department: string | null
          description: string | null
          id: string
          requirements: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          department?: string | null
          description?: string | null
          id?: string
          requirements?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          department?: string | null
          description?: string | null
          id?: string
          requirements?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
          type?: string | null
        }
        Relationships: []
      }
      dining: {
        Row: {
          availability: boolean | null
          chef: string | null
          created_at: string
          cuisine_type: string | null
          description: string | null
          dish_name: string
          id: string
          images: Json | null
          ingredients: string | null
          price: number
          updated_at: string
        }
        Insert: {
          availability?: boolean | null
          chef?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          dish_name: string
          id?: string
          images?: Json | null
          ingredients?: string | null
          price?: number
          updated_at?: string
        }
        Update: {
          availability?: boolean | null
          chef?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          dish_name?: string
          id?: string
          images?: Json | null
          ingredients?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      drinks: {
        Row: {
          alcohol_content: number | null
          bottle_size: string | null
          brand: string | null
          created_at: string
          id: string
          images: Json | null
          name: string
          origin: string | null
          price: number
          provenance: string | null
          quality: string | null
          stock_status: string | null
          tasting_notes: string | null
          type: string | null
          updated_at: string
          year_manufactured: number | null
        }
        Insert: {
          alcohol_content?: number | null
          bottle_size?: string | null
          brand?: string | null
          created_at?: string
          id?: string
          images?: Json | null
          name: string
          origin?: string | null
          price?: number
          provenance?: string | null
          quality?: string | null
          stock_status?: string | null
          tasting_notes?: string | null
          type?: string | null
          updated_at?: string
          year_manufactured?: number | null
        }
        Update: {
          alcohol_content?: number | null
          bottle_size?: string | null
          brand?: string | null
          created_at?: string
          id?: string
          images?: Json | null
          name?: string
          origin?: string | null
          price?: number
          provenance?: string | null
          quality?: string | null
          stock_status?: string | null
          tasting_notes?: string | null
          type?: string | null
          updated_at?: string
          year_manufactured?: number | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string | null
          description: string | null
          id: string
          images: Json | null
          name: string
          performers: string | null
          status: string | null
          type: string | null
          updated_at: string
          venue_section: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          name: string
          performers?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
          venue_section?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          name?: string
          performers?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
          venue_section?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string
          file_path: string
          id: string
          linked_to: string | null
          type: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          linked_to?: string | null
          type: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          linked_to?: string | null
          type?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          contact: string
          created_at: string
          date: string
          id: string
          section: string | null
          status: string | null
          time: string
          type: string | null
          user_name: string
        }
        Insert: {
          contact: string
          created_at?: string
          date: string
          id?: string
          section?: string | null
          status?: string | null
          time: string
          type?: string | null
          user_name: string
        }
        Update: {
          contact?: string
          created_at?: string
          date?: string
          id?: string
          section?: string | null
          status?: string | null
          time?: string
          type?: string | null
          user_name?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          images: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venue_sections: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          id: string
          images: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
