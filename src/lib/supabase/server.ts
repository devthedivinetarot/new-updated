/**
 * Supabase Server Client
 * Server-only: do NOT import this from client components.
 * Uses dynamic import() for next/headers to stay server-only.
 */
const getCookieStore = async () => {
  return (await import('next/headers')).cookies();
};

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Create Supabase server client
 * Uses service role key for admin access (server-side only).
 * Falls back to anon key for dev when service key not available.
 */
export async function createServerClient() {
  const cookieStore = await getCookieStore();

  const isProduction = process.env.NODE_ENV === 'production';
  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
                      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  let serviceKeyToUse: string;

  if (isProduction && supabaseServiceKey) {
    serviceKeyToUse = supabaseServiceKey;
  } else if (!isProduction && supabaseServiceKey) {
    serviceKeyToUse = supabaseServiceKey;
  } else if (!isProduction) {
    console.warn('[Supabase] Service role key not set. Using anon key for dev mode only.');
    serviceKeyToUse = supabaseAnonKey;
  } else {
    throw new Error('[Supabase] SERVICE_ROLE_KEY is required in production');
  }

  return createSupabaseServerClient(supabaseUrl, serviceKeyToUse, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as any);
          });
        } catch {
        }
      },
    },
  });
}

export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
         !!process.env.SUPABASE_SERVICE_ROLE_KEY;
};

export default createServerClient;
