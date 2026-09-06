'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePersonalization, UsePersonalizationReturn } from '@/hooks/usePersonalization';

/**
 * Personalization Context
 * Provides user personalization state throughout the app
 */

const PersonalizationContext = createContext<UsePersonalizationReturn | null>(null);

interface PersonalizationProviderProps {
  children: ReactNode;
  userId: string | null;
}

/**
 * PersonalizationProvider Component
 * Wraps the app to provide personalization data
 */
export function PersonalizationProvider({ children, userId }: PersonalizationProviderProps) {
  const personalization = usePersonalization(userId);

  return (
    <PersonalizationContext.Provider value={personalization}>
      {children}
    </PersonalizationContext.Provider>
  );
}

/**
 * Hook to consume personalization context
 */
export function usePersonalizationContext(): UsePersonalizationReturn {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalizationContext must be used within a PersonalizationProvider');
  }
  return context;
}

export default PersonalizationProvider;
