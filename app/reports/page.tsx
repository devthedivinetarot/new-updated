import type { Metadata } from 'next';
import TarotReports from '@/components/reports/TarotReports';

export const metadata: Metadata = {
  title: 'Tarot Reports — Yearly, Love, Marriage, Career, Health & Education',
  description:
    'Personal 12-month tarot reports: Yearly, No Contact, Love Life, Marriage, Career & Business, Health and Education — each with 12 cards drawn from the full deck.',
  alternates: { canonical: '/reports' },
  openGraph: {
    title: 'Tarot Reports — The Divine Tarot',
    description: 'Personal 12-month tarot reports with monthly cards, guidance and lucky colours & numbers.',
    url: '/reports',
  },
};

export default function ReportsPage() {
  return <TarotReports />;
}
