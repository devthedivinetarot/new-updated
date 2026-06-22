import type { Metadata } from 'next';

// Admin tooling must never be indexed by search engines or AI crawlers.
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
