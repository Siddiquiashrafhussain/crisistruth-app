import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'fact-checker' | 'admin'
          subscription_tier: 'free' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      claims: {
        Row: {
          id: string
          text: string
          user_id: string
          status: 'pending' | 'processing' | 'verified' | 'disputed' | 'unverified'
          category: string | null
          crisis_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['claims']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['claims']['Insert']>
      }
      verifications: {
        Row: {
          id: string
          claim_id: string
          status: 'verified' | 'disputed' | 'unverified'
          confidence_score: number
          summary: string
          processing_time_ms: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['verifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['verifications']['Insert']>
      }
      crises: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          priority: 'low' | 'medium' | 'high'
          status: 'active' | 'resolved' | 'monitoring'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['crises']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['crises']['Insert']>
      }
    }
  }
}
