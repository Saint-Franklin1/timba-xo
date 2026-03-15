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
      dining_media: {
        Row: {
          chef: string | null
          created_at: string
          cuisine_type: string | null
          description: string | null
          dish_name: string | null
          id: string
          ingredients: string | null
          media_id: string | null
          price: number | null
        }
        Insert: {
          chef?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          dish_name?: string | null
          id?: string
          ingredients?: string | null
          media_id?: string | null
          price?: number | null
        }
        Update: {
          chef?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          dish_name?: string | null
          id?: string
          ingredients?: string | null
          media_id?: string | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dining_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      drink_bookings: {
        Row: {
          created_at: string
          customer_name: string
          drink_id: string | null
          drink_name: string
          email: string
          id: string
          phone: string | null
          reservation_date: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          drink_id?: string | null
          drink_name: string
          email: string
          id?: string
          phone?: string | null
          reservation_date: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          drink_id?: string | null
          drink_name?: string
          email?: string
          id?: string
          phone?: string | null
          reservation_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "drink_bookings_drink_id_fkey"
            columns: ["drink_id"]
            isOneToOne: false
            referencedRelation: "drinks"
            referencedColumns: ["id"]
          },
        ]
      }
      drink_details: {
        Row: {
          age: string | null
          alcohol_content: number | null
          bottle_size: string | null
          brand: string | null
          color: string | null
          created_at: string
          distillery: string | null
          drink_name: string | null
          id: string
          manufacturer: string | null
          media_id: string
          origin_country: string | null
          price: number | null
          provenance_description: string | null
          quality: string | null
          taste_notes: string | null
          type: string | null
          year_manufactured: number | null
        }
        Insert: {
          age?: string | null
          alcohol_content?: number | null
          bottle_size?: string | null
          brand?: string | null
          color?: string | null
          created_at?: string
          distillery?: string | null
          drink_name?: string | null
          id?: string
          manufacturer?: string | null
          media_id: string
          origin_country?: string | null
          price?: number | null
          provenance_description?: string | null
          quality?: string | null
          taste_notes?: string | null
          type?: string | null
          year_manufactured?: number | null
        }
        Update: {
          age?: string | null
          alcohol_content?: number | null
          bottle_size?: string | null
          brand?: string | null
          color?: string | null
          created_at?: string
          distillery?: string | null
          drink_name?: string | null
          id?: string
          manufacturer?: string | null
          media_id?: string
          origin_country?: string | null
          price?: number | null
          provenance_description?: string | null
          quality?: string | null
          taste_notes?: string | null
          type?: string | null
          year_manufactured?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drink_details_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
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
      event_media: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_name: string
          gallery_media_ids: Json | null
          id: string
          poster_media_id: string | null
          venue_section: string | null
          video_media_ids: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_name: string
          gallery_media_ids?: Json | null
          id?: string
          poster_media_id?: string | null
          venue_section?: string | null
          video_media_ids?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_name?: string
          gallery_media_ids?: Json | null
          id?: string
          poster_media_id?: string | null
          venue_section?: string | null
          video_media_ids?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "event_media_poster_media_id_fkey"
            columns: ["poster_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
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
      media_assets: {
        Row: {
          category: string
          description: string | null
          file_format: string | null
          file_size: number | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_hidden: boolean
          storage_bucket: string
          storage_path: string | null
          title: string | null
          uploaded_at: string
          uploaded_by: string | null
          video_url: string | null
        }
        Insert: {
          category: string
          description?: string | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_hidden?: boolean
          storage_bucket: string
          storage_path?: string | null
          title?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_hidden?: boolean
          storage_bucket?: string
          storage_path?: string | null
          title?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          video_url?: string | null
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
      venue_media: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          id: string
          media_id: string | null
          venue_section_name: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          media_id?: string | null
          venue_section_name?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          media_id?: string | null
          venue_section_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
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
