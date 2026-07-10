import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How The Divine Tarot collects, uses, and protects your information — readings, payments, and communications.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

const UPDATED = 'July 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(244,197,66,0.10)_0%,transparent_55%)]" />

      <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
        <header className="mb-10">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-3">Privacy Policy</h1>
          <p className="text-sm text-foreground-muted">Last updated: {UPDATED}</p>
          <div className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </header>

        <div className="space-y-8 text-foreground-secondary leading-relaxed text-[15px]">
          <p>
            The Divine Tarot (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
            information we collect when you use our website and services, how we use it, and the choices you have. By
            using the site you agree to the practices described here.
          </p>

          <Section title="Information we collect">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Contact details</strong> — such as your email address (and, if you opt in, your WhatsApp number) when you subscribe or request a reading or report.</li>
              <li><strong className="text-foreground">Reading &amp; compatibility inputs</strong> — details you enter for a reading or a Kundli Milan report, such as names, dates, times, and places of birth.</li>
              <li><strong className="text-foreground">Payment information</strong> — processed securely by our payment provider. We do not store your card details on our servers.</li>
              <li><strong className="text-foreground">Usage data</strong> — basic analytics such as pages visited and device/browser information, used to improve the site.</li>
            </ul>
          </Section>

          <Section title="How we use your information">
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide readings, generate and deliver reports, and respond to your requests.</li>
              <li>To send the communications you asked for (for example daily guidance by email or WhatsApp). You can opt out at any time.</li>
              <li>To process payments and deliver purchased content.</li>
              <li>To maintain, secure, and improve the website.</li>
            </ul>
          </Section>

          <Section title="Third-party services">
            <p>
              We rely on trusted providers to run the service, including a payment processor (to take payments), an email
              provider (to deliver reports and messages), a messaging provider (for optional WhatsApp updates), hosting
              and database providers (to run and store data for the site), and analytics tools. These providers process
              data only as needed to perform their function.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              We use essential cookies to run the site and may use analytics cookies to understand usage. You can control
              cookies through your browser settings.
            </p>
          </Section>

          <Section title="Data retention">
            <p>
              We keep your information only as long as needed to provide the service and meet legal or accounting
              requirements, after which it is deleted or anonymised.
            </p>
          </Section>

          <Section title="Your choices &amp; rights">
            <p>
              You can unsubscribe from communications at any time, and you may request access to, correction of, or
              deletion of your personal information, subject to applicable law.
            </p>
          </Section>

          <Section title="Children">
            <p>Our services are intended for adults and are not directed at children under 18.</p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes will be reflected by the &ldquo;last
              updated&rdquo; date above.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              If you have any questions about this policy or how your data is handled, or if you&rsquo;d like to reach
              our team for any reason, you can{' '}
              <Link href="/contact" className="text-gold underline underline-offset-2 hover:text-gold-light">
                get in touch with us here
              </Link>
              .
            </p>
          </Section>
        </div>

        <p className="mt-12 text-xs text-foreground-muted">
          This policy is provided as a general template and should be reviewed by a qualified professional to ensure it
          meets the requirements applicable to your business and jurisdiction.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-xl text-foreground mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
