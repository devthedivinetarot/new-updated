import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Questions about your tarot reading or membership? Contact The Divine Tarot and our team will reach out personally.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — The Divine Tarot',
    description: 'Get in touch with The Divine Tarot for readings, membership and spiritual guidance.',
    url: '/contact',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact The Divine Tarot' }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
