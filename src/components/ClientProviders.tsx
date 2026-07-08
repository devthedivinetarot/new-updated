'use client';

import { useState, useEffect } from 'react';
import { PersonalizationProvider } from '@/components/personalization/PersonalizationProvider';
import { supabase } from '@/lib/supabase/client';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [userId, setUserId] = useState<string | null>(null);

  // Resolve the user id in the background. This MUST NOT block rendering the
  // app: gating the whole tree behind supabase.auth.getUser() meant the server
  // (and initial client) render was just a "Loading…" screen — no <h1>, no hero,
  // broken SEO, a black first paint, and entrance animations that mounted late.
  // Personalization simply starts with a null userId and updates once known.
  useEffect(() => {
    let cancelled = false;

    const initUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (cancelled) return;
        setUserId(user && !error ? user.id : crypto.randomUUID());
      } catch (e) {
        console.warn('[User] Failed to get user session:', e);
        if (!cancelled) setUserId(crypto.randomUUID());
      }
    };

    initUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PersonalizationProvider userId={userId}>
      <div>
        {children}
      </div>
    </PersonalizationProvider>
  );
}
