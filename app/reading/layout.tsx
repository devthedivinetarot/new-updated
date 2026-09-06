import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Tarot Reading — Ask the Cards',
  description:
    'Start a live, emotionally intelligent tarot reading. Ask about love, career, money or life and get instant spiritual guidance in English, Hindi or Hinglish.',
  alternates: { canonical: '/reading' },
  openGraph: {
    title: 'Live Tarot Reading — The Divine Tarot',
    description:
      'Ask the cards anything and receive instant, intuitive tarot guidance — love, career, relationships and more.',
    url: '/reading',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Live Tarot Reading — The Divine Tarot' }],
  },
};

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
