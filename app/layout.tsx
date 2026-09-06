import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import ClientLayout from "./client-layout";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import FooterJsonLd from "@/components/layout/FooterJsonLd";
import "./globals.css";
import { headers } from 'next/headers';

function getNonce(): string | undefined {
  try {
    const nonce = headers().get('x-next-nonce');
    return nonce || undefined;
  } catch {
    return undefined;
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thedivinetarotonline.com';
const SITE_NAME = 'The Divine Tarot';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Divine Tarot | Premium Tarot Readings in English, Hindi & Hinglish',
    template: '%s | The Divine Tarot',
  },
  description:
    'Get answers from the universe in seconds. Experience mystical, emotionally intelligent tarot readings for love, career and life — in English, Hindi and Hinglish.',
  applicationName: SITE_NAME,
  authors: [{ name: 'The Divine Tarot' }, { name: 'Bharti Singh' }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Spirituality',
  keywords: [
    'tarot',
    'tarot reading',
    'online tarot reading',
    'hindi tarot',
    'hinglish tarot',
    'tarot card reading',
    'love tarot',
    'career tarot',
    'spiritual guidance',
    'psychic reading',
    'fortune telling',
    'daily tarot',
    'The Divine Tarot',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'The Divine Tarot | Premium Tarot Readings',
    description:
      'Mystical, emotionally intelligent tarot readings for love, career and life — in English, Hindi and Hinglish.',
    url: '/',
    locale: 'en_US',
    alternateLocale: ['hi_IN', 'en_IN'],
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Divine Tarot — Premium Tarot Readings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Divine Tarot | Premium Tarot Readings',
    description:
      'Mystical, emotionally intelligent tarot readings in English, Hindi & Hinglish.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6d28d9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = getNonce();

  return (
    <html lang="en">
      <head />
      <body
        className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
        suppressHydrationWarning
      >
        {/*
         * JSON-LD structured data — rendered server-side, safe under CSP.
         * GA4 / GTM / Clarity scripts — loaded via Next.js <Script> at
         * document body level, external source whitelisted in CSP.
         */}
        <FooterJsonLd />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
        />
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ? (
          <Script
            id="clarity-analytics"
            strategy="afterInteractive"
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`,
            }}
          />
        ) : null}
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
