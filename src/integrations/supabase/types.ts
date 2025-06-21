export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
         Row: {
          id: string;
          sender_id: string;
          receiver_id: string; // new column
          alert_id: string;
          message: string;
          message_type: string | null;
          created_at: string;
        }
        Insert: {
          sender_id: string;
          receiver_id: string; // new column
          alert_id: string;
          message: string;
          message_type?: string | null;
          created_at?: string;
          id?: string;
        }
        Update: {
          sender_id?: string;
          receiver_id?: string; // new column
          alert_id?: string;
          message?: string;
          message_type?: string | null;
          created_at?: string;
          id?: string;
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "emergency_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_alerts: {
        Row: {
          created_at: string
          description: string
          emergency_type: string
          id: string
          location: Json | null
          status: string
          updated_at: string
          user_id: string
          volunteer_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          emergency_type: string
          id?: string
          location?: Json | null
          status?: string
          updated_at?: string
          user_id: string
          volunteer_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          emergency_type?: string
          id?: string
          location?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
          volunteer_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_available: boolean | null
          location: Json | null
          phone: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_available?: boolean | null
          location?: Json | null
          phone?: string | null
          updated_at?: string
          user_type?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_available?: boolean | null
          location?: Json | null
          phone?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          id: string
          user_id: string | null
          user_type: string | null
          location: Json | null
          last_updated: string | null
          emergency_id: string | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_type?: string | null
          location?: Json | null
          last_updated?: string | null
          emergency_id?: string | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string | null
          user_type?: string | null
          location?: Json | null
          last_updated?: string | null
          emergency_id?: string | null
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_locations_emergency_id_fkey"
            columns: ["emergency_id"]
            isOneToOne: false
            referencedRelation: "emergency_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_volunteer_to_alert: {
        Args: { alert_id: string }
        Returns: string
      }
    }
    Enums: {
      user_type_enum: "victim" | "volunteer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_type_enum: ["victim", "volunteer"] as const,
    },
  },
} as const

// Updated interfaces to match database schema
export interface Message {
  id: string;
  sender_id: string;
  message: string; // Changed from 'content' to match DB
  message_type?: string | null;
  alert_id: string;
  created_at: string;
}

export interface EmergencyAlert {
  id: string;
  user_id: string;
  emergency_type: string;
  description: string;
  location: { lat: number; lng: number } | null;
  status: string;
  created_at: string;
  updated_at: string;
  volunteer_id?: string | null;
}

export interface UserLocation {
  id: string;
  user_id?: string | null;
  user_type?: 'victim' | 'volunteer' | null;
  location?: { lat: number; lng: number } | null;
  last_updated?: string | null;
  emergency_id?: string | null;
  is_active?: boolean | null;
}

export interface Profile {
  id: string;
  email?: string | null;
  full_name?: string | null;
  is_available?: boolean | null;
  location?: { lat: number; lng: number } | null;
  phone?: string | null;
  user_type: string;
  created_at: string;
  updated_at: string;
}

// Add to your existing types
export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  alert_id: string;
  message: string;
  created_at: string;
  read_at?: string;
  sender?: {
    full_name: string;
    user_type: UserType;
  };
}

// export type SelectChatMessage = Tables<'chat_messages'>;

// Helper types for common operations
export type UserType = 'victim' | 'volunteer';
export type AlertStatus = 'active' | 'resolved' | 'pending' | 'in_progress';

// Type helpers for table operations
export type InsertUserLocation = TablesInsert<'user_locations'>;
export type UpdateUserLocation = TablesUpdate<'user_locations'>;
export type SelectUserLocation = Tables<'user_locations'>;

export type InsertEmergencyAlert = TablesInsert<'emergency_alerts'>;
export type UpdateEmergencyAlert = TablesUpdate<'emergency_alerts'>;
export type SelectEmergencyAlert = Tables<'emergency_alerts'>;

export type InsertChatMessage = TablesInsert<'chat_messages'>;
export type UpdateChatMessage = TablesUpdate<'chat_messages'>;
export type SelectChatMessage = Tables<'chat_messages'>;

export type InsertProfile = TablesInsert<'profiles'>;
export type UpdateProfile = TablesUpdate<'profiles'>;
export type SelectProfile = Tables<'profiles'>;