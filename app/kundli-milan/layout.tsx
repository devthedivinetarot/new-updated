import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kundli Milan — Vedic Marriage Compatibility',
  description:
    'Free Ashtakoota Guna Milan calculator. Enter two birth details and get a full 36-guna compatibility score with Nadi, Bhakoot, Gana and Yoni analysis. Download a detailed report.',
  alternates: { canonical: '/kundli-milan' },
  openGraph: {
    title: 'Kundli Milan — Vedic Marriage Compatibility',
    description:
      'Ashtakoota Guna Milan out of 36, computed from both birth charts. Download a detailed compatibility report.',
    url: '/kundli-milan',
  },
};

export default function KundliMilanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
