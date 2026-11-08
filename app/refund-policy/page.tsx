import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Refund and cancellation policy for The Divine Tarot reports and readings.',
  alternates: { canonical: '/refund-policy' },
  robots: { index: true, follow: true },
};

const UPDATED = 'November 2026';

export default function RefundPolicyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(244,197,66,0.10)_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
        <header className="mb-10">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-3">Refund &amp; Cancellation Policy</h1>
          <p className="text-sm text-foreground-muted">Last updated: {UPDATED}</p>
          <div className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </header>

        <div className="space-y-8 text-foreground-secondary leading-relaxed text-[15px]">
          <Section title="Digital tarot reports">
            <p>
              Our tarot reports are personalised digital products. The cards for your report are drawn and your order
              is prepared as soon as payment is made, so <strong className="text-foreground">all payments are final and
              no refunds are given once an order is paid</strong>, including if you change your mind.
            </p>
          </Section>

          <Section title="Delivery">
            <ul className="list-disc pl-5 space-y-2">
              <li>Standard report (₹999): the PDF is emailed on the 7th day after payment.</li>
              <li>Express report (₹1299): the PDF is emailed on the 3rd day after payment.</li>
              <li>Reports are sent to the email address entered at checkout. Please check your spam or promotions folder.</li>
            </ul>
          </Section>

          <Section title="If your report does not arrive">
            <p>
              If you have not received your report within 2 days of the promised date, contact us with your name,
              email and payment ID. We will resend it. If we are unable to deliver the report at all, we will refund
              the amount paid to the original payment method within 7 working days.
            </p>
          </Section>

          <Section title="Cancellation">
            <p>
              Orders cannot be cancelled once payment is completed. If a payment fails but money is deducted, it is
              usually reversed automatically by your bank within 5–7 working days.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For any question about an order, please reach us through our{' '}
              <Link href="/contact" className="text-gold underline underline-offset-2">contact page</Link>.
            </p>
          </Section>
        </div>
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
