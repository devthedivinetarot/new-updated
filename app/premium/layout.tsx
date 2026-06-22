import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Tarot Membership — Unlimited Readings',
  description:
    'Unlock unlimited premium tarot readings, deeper spreads and priority guidance. Affordable spiritual mentorship in English, Hindi and Hinglish.',
  alternates: { canonical: '/premium' },
  openGraph: {
    title: 'Premium Tarot Membership — The Divine Tarot',
    description:
      'Unlimited premium tarot readings, deeper spreads and priority spiritual guidance.',
    url: '/premium',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Premium Tarot Membership — The Divine Tarot' }],
  },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
