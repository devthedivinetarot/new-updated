'use client';

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * Extended user profile with phone data
 */
export interface ExtendedUser {
  id: string;
  phone?: string;
  email?: string;
  anonymous_id?: string;
}

/**
 * Hook to fetch extended user profile data
 * Combines Supabase auth user with database profile (phone, metadata)
 */
export function useUser() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      try {
        // Get auth user (guard against long hangs)
        const withTimeout = async <T,>(p: Promise<T>, ms: number): Promise<T> => {
          let t: ReturnType<typeof setTimeout> | null = null;
          try {
            return await Promise.race([
              p,
              new Promise<T>((_, reject) => {
                t = setTimeout(() => reject(new Error(`Supabase request timed out after ${ms}ms`)), ms);
              }),
            ]);
          } finally {
            if (t) clearTimeout(t);
          }
        };

        const { data: { user: authUser }, error: authError } = await withTimeout(
          supabase.auth.getUser(),
          8000
        );


        if (authError || !authUser) {
          // Not authenticated - use anonymous ID
          const anonId = getAnonymousId();
          setUser({
            id: anonId,
            phone: undefined,
            email: undefined,
          });
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Fetch profile from users table
        if (!isSupabaseConfigured()) {
          // Dev mode: use auth user data
          setUser({
            id: authUser.id,
            phone: authUser.phone || undefined,
            email: authUser.email || undefined,
          });
          setIsLoading(false);
          return;
        }

        const profileResult = await Promise.race([
          supabase
            .from('users')
            .select('id, phone, email, anonymous_id')
            .eq('id', authUser.id)
            .single(),
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Supabase request timed out after 8000ms'));
            }, 8000);
          }),
        ]);

        const { data: profile, error: profileError } = profileResult as unknown as {
          data: ExtendedUser | null;
          error: { code?: string } | null;
        };


        if (profileError && profileError.code !== 'PGRST116') {
          console.error('[useUser] Profile fetch error:', profileError);
          // Fall back to auth user
          setUser({
            id: authUser.id,
            phone: authUser.phone || undefined,
            email: authUser.email || undefined,
          });
        } else if (profile) {
          setUser(profile);
        } else {
          // User row doesn't exist yet - create minimal profile using auth data
          setUser({
            id: authUser.id,
            phone: authUser.phone || undefined,
            email: authUser.email || undefined,
          });
        }
      } catch (err) {
        console.error('[useUser] Unexpected error:', err);
        // Fallback to anonymous
        const anonId = getAnonymousId();
        setUser({ id: anonId });
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Refetch profile
          const { data: profile } = await supabase
            .from('users')
            .select('id, phone, email')
            .eq('id', session.user.id)
            .single();
          setUser(profile || {
            id: session.user.id,
            phone: session.user.phone,
            email: session.user.email,
          });
          setIsAuthenticated(true);
        } else {
          const anonId = getAnonymousId();
          setUser({ id: anonId });
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}

/**
 * Get anonymous user ID from localStorage
 */
function getAnonymousId(): string {
  if (typeof window === 'undefined') {
    return `anon-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }

  const stored = localStorage.getItem('divine_tarot_user_id');
  if (stored) return stored;

  const newId = crypto.randomUUID();
  localStorage.setItem('divine_tarot_user_id', newId);
  return newId;
}

/**
 * Hook to get current session ID for watermark
 */
export function useSessionId() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return 'LOADING';
  }

  if (user?.id) {
    return `SESS:${user.id.slice(0, 8).toUpperCase()}`;
  }

  // Anonymous session ID from localStorage
  if (typeof window !== 'undefined') {
    const anonId = localStorage.getItem('divine_tarot_user_id');
    if (anonId) {
      return `ANON:${anonId.slice(0, 8).toUpperCase()}`;
    }
  }

  return 'GUEST';
}

