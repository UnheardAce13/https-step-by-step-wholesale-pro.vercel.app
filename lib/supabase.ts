import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
export const supabase = createClientComponentClient()

// Server-side Supabase client with service role (admin)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types (will be auto-generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'wholesaler' | 'investor' | 'agent' | 'vendor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'wholesaler' | 'investor' | 'agent' | 'vendor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'wholesaler' | 'investor' | 'agent' | 'vendor'
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          title: string
          type: string
          status: string
          content: any
          parties: any[]
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          status?: string
          content: any
          parties: any[]
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          status?: string
          content?: any
          parties?: any[]
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          metric_type: string
          value: number
          metadata: any
          recorded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metric_type: string
          value: number
          metadata?: any
          recorded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          metric_type?: string
          value?: number
          metadata?: any
          recorded_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'wholesaler' | 'investor' | 'agent' | 'vendor'
      contract_status: 'draft' | 'pending_review' | 'sent_for_signature' | 'partially_signed' | 'fully_executed' | 'expired' | 'cancelled' | 'voided'
    }
  }
}

// Helper functions for common operations
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Real-time subscriptions
export function subscribeToTable<T>(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) {
  return supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter
      },
      callback
    )
    .subscribe()
}