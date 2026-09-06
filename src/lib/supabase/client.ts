import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// IMPORTANT:
// If env vars are missing, do NOT silently fall back to placeholder URLs.
// Silent fallbacks cause browser errors like:
//   net::ERR_NAME_NOT_RESOLVED placeholder.supabase.co/rest/v1/...
//
// Downstream callers should guard with `isSupabaseConfigured()`.
export const supabase = ((): ReturnType<typeof createClient> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Create a non-functional client to avoid import-time crashes.
    // Calls will fail quickly, but won't leak placeholder network errors.
    return createClient('https://invalid.supabase.co', 'invalid-anon-key', {
      auth: {
        persistSession: true,
        autoRefreshToken: false,
      },
    });
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
})();


export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
         !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          phone: string | null;
          email: string | null;
          anonymous_id: string | null;
          metadata: Record<string, unknown>;
          plan: 'free' | 'premium';
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due' | null;
          subscription_started_at: string | null;
          subscription_end_date: string | null;
          razorpay_payment_id: string | null;
          auto_renew: boolean;
          readings_today: number;
          last_reading_date: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone?: string | null;
          email?: string | null;
          anonymous_id?: string | null;
          metadata?: Record<string, unknown>;
          plan?: 'free' | 'premium';
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due' | null;
          subscription_started_at?: string | null;
          subscription_end_date?: string | null;
          razorpay_payment_id?: string | null;
          auto_renew?: boolean;
          readings_today?: number;
          last_reading_date?: string | null;
          updated_at?: string;
        };
        Update: {
          phone?: string | null;
          email?: string | null;
          anonymous_id?: string | null;
          metadata?: Record<string, unknown>;
          plan?: 'free' | 'premium';
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due' | null;
          subscription_started_at?: string | null;
          subscription_end_date?: string | null;
          razorpay_payment_id?: string | null;
          auto_renew?: boolean;
          readings_today?: number;
          last_reading_date?: string | null;
          updated_at?: string;
        };
      };
      readings: {
        Row: {
          id: string;
          user_id: string | null;
          question: string;
          spread_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          question: string;
          spread_type?: string;
        };
        Update: Record<string, never>;
      };
      cards_drawn: {
        Row: {
          id: string;
          reading_id: string;
          card_name: string;
          position: string;
          is_reversed: boolean;
        };
        Insert: {
          id?: string;
          reading_id: string;
          card_name: string;
          position: string;
          is_reversed?: boolean;
        };
        Update: Record<string, never>;
      };
      ai_responses: {
        Row: {
          id: string;
          reading_id: string;
          response: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reading_id: string;
          response: string;
        };
        Update: Record<string, never>;
      };
      events: {
        Row: {
          id: string;
          user_id: string | null;
          event_name: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_name: string;
          metadata?: Record<string, unknown>;
        };
        Update: Record<string, never>;
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          status: string;
          razorpay_payment_id: string | null;
          razorpay_order_id: string | null;
          razorpay_subscription_id: string | null;
          plan_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency?: string;
          status?: string;
          razorpay_payment_id?: string | null;
          razorpay_order_id?: string | null;
          razorpay_subscription_id?: string | null;
          plan_type?: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      user_memory: {
        Row: {
          id: string;
          user_id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          key: string;
          value: string;
        };
        Update: {
          value?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export default supabase;