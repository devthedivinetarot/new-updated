'use client';

import { useEffect } from 'react';
import { useFunnelStore } from '@/store/funnel-store';

/**
 * HomePageClient
 *
 * Client-side wrapper for the Home route. All hook-based logic
 * (funnel stage tracking) lives here; JSX content is rendered
 * via {children} from the Server Component parent.
 */
export default function HomePageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCurrentStage } = useFunnelStore();

  useEffect(() => {
    setCurrentStage('homepage');
  }, [setCurrentStage]);

  return <>{children}</>;
}
