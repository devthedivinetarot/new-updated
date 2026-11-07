'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export default function FinalCTA() {
  const { t, isHydrated } = useLanguage();
  return (
    <section className="relative py-14 md:py-20 bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--background))] overflow-hidden">
      {/* Background glow — static gradients. The old version animated two
          blur-3xl blobs forever; on iPhones that constant blur repaint made
          the bottom of the page flash black while scrolling. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 25% 30%, rgb(var(--gold) / 0.10) 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgb(var(--secondary) / 0.08) 0%, transparent 45%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Sparkle Icon with a light opacity pulse (no animated blur) */}
          <div className="relative inline-block mb-8">
            <div aria-hidden className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--gold) / 0.25) 0%, transparent 70%)', transform: 'scale(1.8)' }} />
            <motion.div
              animate={{ opacity: [1, 0.65, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="relative h-12 w-12 text-[rgb(var(--gold))]" />
            </motion.div>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[rgb(var(--foreground))] mb-6 leading-tight">
            {isHydrated ? t('home.finalCta.title') : 'Your answers are waiting…'}
          </h2>
          <p className="text-base sm:text-lg text-[rgb(var(--foreground-muted))] mb-10 leading-relaxed">
            {isHydrated ? t('home.finalCta.subtitle') : 'The cards are ready. Your guidance is ready. Take the first step toward clarity.'}
          </p>

          <a href="https://reading.thedivinetarotonline.com/" className={cn(buttonVariants({ size: 'xl' }), 'btn-cta-pulse w-full sm:w-auto flex items-center justify-center gap-2 mx-auto')}>
            <span>{isHydrated ? t('home.finalCta.button') : "Let's Begin"}</span>
            <ArrowRight className="h-6 w-6" />
          </a>

          <p className="mt-6 text-sm text-[rgb(var(--foreground-muted))]">
            {isHydrated ? t('home.finalCta.subtext') : 'Takes less than 60 seconds • Try it free'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
