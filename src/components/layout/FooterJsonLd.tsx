/**
 * FooterJsonLd
 *
 * Renders the Organization schema as script-src JSON-LD.
 * This is intentionally a Server Component (no 'use client').
 * 
 * Note: next/script with id avoids CSP nonce requirement for JSON-LD,
 * and works correctly with Next.js's script handling.
 */
import Script from 'next/script';

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Divine Tarot',
  url: 'https://thedivinetarotonline.com',
  logo: 'https://thedivinetarotonline.com/logo.png',
  sameAs: [
    'https://instagram.com/thedivineetarot',
    'https://facebook.com/profile.php?id=61578567343068',
    'https://youtube.com/@TheDivineTarot',
    'https://youtube.com/@thedivineetarot',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'thedivinetarot11@gmail.com',
    contactType: 'customer support',
  },
};

export default function FooterJsonLd() {
  const jsonLd = JSON.stringify(ORGANIZATION_SCHEMA);

  return (
    <Script
      id="organization-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
