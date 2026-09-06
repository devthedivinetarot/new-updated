'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export default function FinalCTA() {
  const { t, isHydrated } = useLanguage();
  return (
    <section className="relative py-14 md:py-20 bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--background))] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[rgb(var(--gold))]/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[rgb(var(--secondary))]/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Sparkle Icon with Pulse */}
          <motion.div
            className="relative inline-block mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-12 w-12 text-[rgb(var(--gold))]" />
            <motion.div
              className="absolute inset-0"
              animate={{ 
                scale: [1, 1.5, 1.5, 1],
                opacity: [0.5, 0, 0.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-12 w-12 text-[rgb(var(--gold-light))]" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full bg-[rgb(var(--gold))]/20 blur-xl"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[rgb(var(--foreground))] mb-6 leading-tight">
            {isHydrated ? t('home.finalCta.title') : 'Your answers are waiting…'}
          </h2>
          <p className="text-base sm:text-lg text-[rgb(var(--foreground-muted))] mb-10 leading-relaxed">
            {isHydrated ? t('home.finalCta.subtitle') : 'The cards are ready. Your guidance is ready. Take the first step toward clarity.'}
          </p>

          <Link href="/reading" className={cn(buttonVariants({ size: 'xl' }), 'btn-cta-pulse w-full sm:w-auto flex items-center justify-center gap-2 mx-auto')}>
            <span>{isHydrated ? t('home.finalCta.button') : "Let's Begin"}</span>
            <ArrowRight className="h-6 w-6" />
          </Link>

          <p className="mt-6 text-sm text-[rgb(var(--foreground-muted))]">
            {isHydrated ? t('home.finalCta.subtext') : 'Takes less than 60 seconds • Try it free'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
