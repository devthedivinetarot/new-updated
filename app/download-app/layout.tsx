import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download The Divine Tarot App',
  description:
    'Get The Divine Tarot app by Bharti Singh on your Android phone — Ginni tarot readings, Card of the Day, daily horoscope, Kundli, Panchang and personal readings in Hindi, Hinglish and English.',
  alternates: { canonical: '/download-app' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'The Divine Tarot App',
    description: 'Tarot readings with Ginni, Card of the Day, horoscope, Kundli and more — on your phone.',
    url: '/download-app',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'The Divine Tarot App' }],
  },
};

export default function DownloadAppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
