import type { Metadata } from 'next';
import TarotReports from '@/components/reports/TarotReports';

export const metadata: Metadata = {
  title: 'Personal 12-Month Tarot Report — PDF by Email',
  description:
    'Personal 12-month tarot report as a PDF: your overall year, or his feelings & actions in no contact, affair, crush or marriage separation. In Hindi, English or Hinglish.',
  alternates: { canonical: '/reports' },
  openGraph: {
    title: 'Tarot Reports — The Divine Tarot',
    description: '12 tarot cards for your year with monthly guidance, delivered as a PDF to your email.',
    url: '/reports',
  },
};

export default function ReportsPage() {
  return <TarotReports />;
}
