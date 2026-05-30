export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      lands: {
        Row: {
          id: string
          token_id: number | null
          owner_address: string
          owner_name: string | null
          owner_phone: string | null
          owner_email: string | null
          land_title: string
          description: string | null
          location: string
          coordinates: string
          location_geo: Json | null
          size_sqm: number
          land_use: string | null
          status: string | null
          images: string[] | null
          price: number | null
          currency: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          token_id?: number | null
          owner_address: string
          owner_name?: string | null
          owner_phone?: string | null
          owner_email?: string | null
          land_title: string
          description?: string | null
          location: string
          coordinates: string
          location_geo?: Json | null
          size_sqm: number
          land_use?: string | null
          status?: string | null
          images?: string[] | null
          price?: number | null
          currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          token_id?: number | null
          owner_address?: string
          owner_name?: string | null
          owner_phone?: string | null
          owner_email?: string | null
          land_title?: string
          description?: string | null
          location?: string
          coordinates?: string
          location_geo?: Json | null
          size_sqm?: number
          land_use?: string | null
          status?: string | null
          images?: string[] | null
          price?: number | null
          currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          land_id: string
          document_type: string
          storage_path: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          land_id: string
          document_type: string
          storage_path: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          land_id?: string
          document_type?: string
          storage_path?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requests: {
        Row: {
          id: string
          land_id: string
          requester_name: string
          requester_email: string
          requester_phone: string | null
          requester_address: string | null
          request_type: string
          message: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          land_id: string
          requester_name: string
          requester_email: string
          requester_phone?: string | null
          requester_address?: string | null
          request_type: string
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          land_id?: string
          requester_name?: string
          requester_email?: string
          requester_phone?: string | null
          requester_address?: string | null
          request_type?: string
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_requests_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_address: string
          type: string
          title: string
          message: string | null
          read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_address: string
          type: string
          title: string
          message?: string | null
          read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_address?: string
          type?: string
          title?: string
          message?: string | null
          read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
