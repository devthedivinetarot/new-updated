/**
 * FooterJsonLd
 *
 * Site-wide JSON-LD structured data graph. Rendered server-side and CSP-safe
 * via next/script. A connected @graph (Organization + WebSite + Service +
 * founder Person) gives both classic search engines and AI answer engines
 * (GEO) a clear, citable understanding of the brand, its services and entities.
 */
import Script from 'next/script';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thedivinetarotonline.com';

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${BASE_URL}/#organization`,
      name: 'The Divine Tarot',
      alternateName: 'TheDivineTarot Online',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
        width: 426,
        height: 500,
      },
      image: `${BASE_URL}/og-image.png`,
      description:
        'Online tarot reading service offering mystical, emotionally intelligent spiritual guidance for love, career and life in English, Hindi and Hinglish.',
      foundingDate: '2020',
      founder: { '@id': `${BASE_URL}/#founder` },
      knowsLanguage: ['en', 'hi'],
      areaServed: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'Place', name: 'Worldwide' },
      ],
      priceRange: '₹₹',
      contactPoint: {
        '@type': 'ContactPoint',
        url: `${BASE_URL}/contact`,
        contactType: 'customer support',
        availableLanguage: ['English', 'Hindi'],
      },
      sameAs: [
        'https://instagram.com/thedivineetarot',
        'https://facebook.com/profile.php?id=61578567343068',
        'https://youtube.com/@TheDivineTarot',
        'https://youtube.com/@thedivineetarot',
      ],
    },
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/#founder`,
      name: 'Bharti Singh',
      jobTitle: 'Tarot Reader & Spiritual Life Coach',
      worksFor: { '@id': `${BASE_URL}/#organization` },
      knowsLanguage: ['en', 'hi'],
      sameAs: ['https://youtube.com/@TheDivineTarot'],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'The Divine Tarot',
      description:
        'Premium online tarot readings and spiritual guidance in English, Hindi and Hinglish.',
      publisher: { '@id': `${BASE_URL}/#organization` },
      inLanguage: ['en', 'hi'],
    },
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/#service`,
      serviceType: 'Tarot Card Reading',
      name: 'Online Tarot Reading',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'Place', name: 'Worldwide' },
      ],
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${BASE_URL}/reading`,
      },
      description:
        'Instant, emotionally intelligent tarot readings for love, relationships, career, money and life decisions, available in English, Hindi and Hinglish.',
    },
  ],
};

export default function FooterJsonLd() {
  return (
    <Script
      id="site-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
    />
  );
}
