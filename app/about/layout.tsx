import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'About The Divine Tarot — Our Story & Philosophy',
  description:
    'Meet the readers behind The Divine Tarot. Mystical yet grounded tarot guidance for love, career and life — offered in English, Hindi and Hinglish for seekers in India and worldwide.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About The Divine Tarot',
    description:
      'Our story, philosophy and approach to emotionally intelligent tarot readings.',
    url: '/about',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About The Divine Tarot' }],
  },
};

// Genuine Q&A used both as a visible FAQ and as FAQPage structured data.
// Visible + structured content is what AI answer engines and Google rich
// results reward, so the two are kept perfectly in sync here.
const FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'What is The Divine Tarot?',
    a: 'The Divine Tarot is an online tarot reading service offering mystical, emotionally intelligent guidance for love, relationships, career, money and life decisions. Readings are available instantly in English, Hindi and Hinglish.',
  },
  {
    q: 'How do online tarot readings work?',
    a: 'You start a reading, ask your question, and the cards are drawn and interpreted for you in real time. Each reading blends traditional tarot symbolism with warm, practical guidance you can act on right away.',
  },
  {
    q: 'Which languages are available?',
    a: 'Readings and guidance are available in English, Hindi and Hinglish, so you can connect in the language that feels most natural to you.',
  },
  {
    q: 'Is my reading private and confidential?',
    a: 'Yes. Your questions and readings are private. The Divine Tarot is designed for personal, confidential spiritual guidance.',
  },
  {
    q: 'How much does a tarot reading cost?',
    a: 'You can begin with free guidance, and a Premium membership unlocks unlimited readings, deeper spreads and priority support. Visit the Premium page for current pricing.',
  },
  {
    q: 'Can tarot predict my future?',
    a: 'Tarot offers insight, clarity and perspective rather than fixed predictions. It helps you understand your situation and make empowered choices — your free will always shapes the outcome.',
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <section
        aria-labelledby="faq-heading"
        className="relative bg-[rgb(var(--background))] px-6 py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl">
          <h2
            id="faq-heading"
            className="font-heading text-2xl md:text-3xl text-[rgb(var(--foreground))] mb-8 text-center"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {FAQS.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-[rgb(var(--gold))/15] bg-[rgb(var(--surface))/40] p-6"
              >
                <dt className="font-heading text-lg text-[rgb(var(--foreground))]">{f.q}</dt>
                <dd className="mt-2 text-[rgb(var(--foreground-secondary))] leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
    </>
  );
}
