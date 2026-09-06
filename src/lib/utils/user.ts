'use client';

import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

function generateAnonymousId(): string {
  const stored = typeof window !== 'undefined' 
    ? localStorage.getItem('divine_tarot_user_id')
    : null;
  
  if (stored) return stored;
  
  const newId = crypto.randomUUID();
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('divine_tarot_user_id', newId);
  }
  
  return newId;
}

export function getUserId(): string {
  return generateAnonymousId();
}

export async function ensureUser(): Promise<string> {
  const userId = getUserId();
  
  if (!isSupabaseConfigured()) {
    console.log('[User] Would ensure user:', userId);
    return userId;
  }
  
  try {
    const client = supabase as any;

    const { data: existing } = await client
      .from('users')
      .select('id')
      .eq('anonymous_id', userId)
      .single();
    
    if (existing) {
      return (existing as any).id;
    }
    
    const { data: newUser, error } = await client
      .from('users')
      .insert({
        anonymous_id: userId,
        metadata: {
          first_visit: new Date().toISOString(),
        }
      })
      .select('id')
      .single();
    
    if (error) throw error;
    return (newUser as any)?.id || userId;
  } catch (err) {
    console.error('[Ensure User Error]', err);
    return userId;
  }
}

export function clearUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('divine_tarot_user_id');
  }
}