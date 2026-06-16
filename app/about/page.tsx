'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

function GoldLineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 38c8-16 17-24 28-24 7 0 12 3 12 9 0 10-12 13-22 17-9 3-17 7-17 15 0 6 5 10 12 10 10 0 20-7 26-18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M20 48c5-2 10-3 15-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionTitle({
  title,
  id,
}: {
  title: string;
  id?: string;
}) {
  return (
    <div className="text-center mb-12">
      <h2 id={id} className="font-heading text-2xl md:text-3xl text-foreground mb-4">
        {title}
      </h2>
      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto" />
    </div>
  );
}

export default function AboutPage() {
  const { t, isHydrated } = useLanguage();

  const authorityBadges = [
    {
      titleKey: 'about.redesigned.authority.badge1.title',
      fallbackTitle: "India's No.1 Psychic Tarot Reader",
    },
    {
      titleKey: 'about.redesigned.authority.badge2.title',
      fallbackTitle: '7 Lakh+ YouTube Community',
    },
  ];

  const expertiseSections = [
    {
      titleKey: 'about.redesigned.expertise.divination.title',
      itemsKey: 'about.redesigned.expertise.divination.items',
      fallbackTitle: 'Divination',
      fallbackItems: 'Hindi Tarot • Runes • Candle Wax • Dice • Tea Leaf Reading',
    },
    {
      titleKey: 'about.redesigned.expertise.astrology.title',
      itemsKey: 'about.redesigned.expertise.astrology.items',
      fallbackTitle: 'Astrology',
      fallbackItems: 'Vedic • Nadi • Prashanna • KP',
    },
    {
      titleKey: 'about.redesigned.expertise.transformation.title',
      itemsKey: 'about.redesigned.expertise.transformation.items',
      fallbackTitle: 'Transformation',
      fallbackItems: 'Manifestation Coaching • Life Alignment',
    },
    {
      titleKey: 'about.redesigned.expertise.esoteric.title',
      itemsKey: 'about.redesigned.expertise.esoteric.items',
      fallbackTitle: 'Esoteric Arts',
      fallbackItems: 'Numerology • Hoodoo • Tantra • Spells',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle elite glow background */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.14)_0%,transparent_55%),radial-gradient(ellipse_at_70%_20%,rgba(244,197,66,0.12)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* HERO SECTION — ELITE SPLIT LAYOUT */}
        <header>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            {/* Left / Center Text */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="order-1 md:order-1"
            >
              <div className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-widest mb-4 md:mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-gold/80 shadow-glow-gold-sm" />
                <span>{isHydrated ? t('about.redesigned.hero.title') : 'About The Divine Tarot'}</span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground mb-4 md:mb-6 tracking-tight leading-tight">
                {isHydrated
                  ? t('about.redesigned.hero.subtitle')
                  : 'A sacred space for clarity, healing, and transformation.'}
              </h1>

              <div className="bg-gradient-to-b from-surface/20 to-surface/10 rounded-2xl p-5 md:p-8 mb-6 border border-gold/10 backdrop-blur-sm">
                <p className="text-foreground/90 text-base sm:text-lg md:text-xl leading-relaxed font-sans text-balance">
                  {isHydrated
                    ? t('about.redesigned.intro')
                    : "I'm Bharti Singh. For over a decade, I've been honored to guide thousands of seekers through life's most profound moments of uncertainty. What began as a personal calling evolved into a mission — to make the ancient wisdom of tarot accessible, relatable, and deeply transformative for every soul seeking light."}
                </p>
              </div>

              {/* Trust badges (minimal pill tags) */}
              <div className="flex flex-wrap gap-3">
                {authorityBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="group inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-gold/20 hover:border-gold/35 transition-colors"
                  >
                    <span className="text-sm text-foreground-secondary/85 group-hover:text-gold transition-colors">
                      {isHydrated ? t(badge.titleKey) : badge.fallbackTitle}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right / Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="order-2 md:order-2 relative mt-10 md:mt-0"
            >
              <div className="absolute -inset-7 bg-[radial-gradient(circle_at_30%_30%,rgba(244,197,66,0.24)_0%,transparent_55%)] blur-2xl -z-10" />

              <div className="relative rounded-2xl overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[#F4C542]/55 via-[#FFD700]/18 to-[#C084FC]/25" />
                <div className="absolute inset-0 rounded-2xl bg-[#0F0F14]" />

                <div className="relative rounded-2xl overflow-hidden border border-gold/10 bg-black/20 shadow-[0_18px_55px_rgba(0,0,0,0.55)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Keep <img> as requested */}
                  <div className="relative w-full aspect-[4/5] md:aspect-square">
                    <img
                      src="/img-02.png"
                      alt="About — Elite Tarot Experience"
                      className="w-full h-full object-cover rounded-2xl"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </header>

        {/* WHY THIS SPACE EXISTS — IMMERSIVE TEXT OVERLAY */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-20 md:mb-28"
          aria-label="Why this space exists"
        >
          <SectionTitle
            title={isHydrated ? t('about.redesigned.philosophy.title') : 'Why This Space Exists'}
          />

          <div className="relative rounded-3xl overflow-hidden border border-gold/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/imgbg.png')] bg-cover bg-center opacity-25" />
            <div className="absolute inset-0 bg-black/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(244,197,66,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_70%_50%,rgba(124,58,237,0.14)_0%,transparent_60%)]" />

            <div className="relative p-8 md:p-12">
              <p className="text-foreground/90 text-lg md:text-xl leading-relaxed font-serif text-center text-balance">
                {isHydrated
                  ? t('about.redesigned.philosophy.text')
                  : 'The cards don\'t predict your future — they help you remember what your soul already knows. This is a sanctuary where ancient symbolism meets modern intuition, where clarity emerges not from fortune-telling, but from deep inner knowing. Here, you\'re not just getting answers — you\'re reconnecting with your own wisdom.'}
              </p>
            </div>
          </div>
        </motion.section>

        {/* THE PATHS I WALK — MINIMAL 2x2 GRID CARDS */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-20 md:mb-28"
          aria-label="The paths I walk"
        >
          <SectionTitle
            title={isHydrated ? t('about.redesigned.expertise.title') : 'The Paths I Walk'}
          />

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {expertiseSections.map((section, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.08 * index, duration: 0.55 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-gold/10 via-purple-500/10 to-gold/10 rounded-2xl opacity-0 group-hover:opacity-55 transition-opacity duration-300" />

                <div className="relative rounded-2xl bg-surface/20 border border-gold/10 backdrop-blur-sm p-5 md:p-8 h-full transition-all duration-300 group-hover:border-gold/25">
                  <div className="flex items-start gap-4 mb-3 md:mb-4">
                    <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center text-gold">
                      <GoldLineIcon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <h3 className="font-heading text-base md:text-lg text-foreground">
                      {isHydrated ? t(section.titleKey) : section.fallbackTitle}
                    </h3>
                  </div>

                  <p className="text-foreground-secondary text-sm md:text-base leading-relaxed text-balance">
                    {isHydrated ? t(section.itemsKey) : section.fallbackItems}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* THE SACRED BLEND — SPLIT SCREEN VISUAL BALANCE */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-20 md:mb-28"
          aria-label="The sacred blend"
        >
          <SectionTitle
            title={isHydrated ? t('about.redesigned.differentiator.title') : 'The Sacred Blend'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            {/* Side A — Philosophy */}
            <div className="relative rounded-3xl overflow-hidden border border-gold/10 bg-gradient-to-b from-surface/20 to-surface/10 backdrop-blur-sm p-6 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(244,197,66,0.18)_0%,transparent_55%)] pointer-events-none" />
              <div className="relative space-y-6">
                <p className="text-foreground/90 text-lg md:text-xl leading-relaxed font-serif text-center">
                  {isHydrated
                    ? t('about.redesigned.differentiator.p1')
                    : 'Where ancient tradition meets intuitive innovation. I bridge the timeless wisdom of Eastern mysticism with a grounded, modern approach — creating a holistic experience that honors both spirit and practicality.'}
                </p>

              </div>
            </div>

            {/* Side B — Tall Image Placeholder */}
            <div className="relative rounded-3xl overflow-hidden border border-gold/10 bg-black/30 shadow-[0_18px_55px_rgba(0,0,0,0.55)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(244,197,66,0.14)_0%,transparent_55%),radial-gradient(ellipse_at_70%_60%,rgba(124,58,237,0.12)_0%,transparent_60%)]" />

              {/* Concept placeholder */}
              <div className="relative h-full">
                <div className="absolute left-0 right-0 top-0 px-8 pt-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-gold/20 backdrop-blur-md text-gold text-sm uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span>Spiritual Tools</span>
                  </div>
                </div>

                <div className="w-full h-full min-h-[320px] flex items-end justify-center">
                  <div className="w-full h-full flex items-center justify-center px-6">
                    <div className="w-full h-[520px] max-h-[70vh] rounded-3xl overflow-hidden border border-gold/10 bg-[linear-gradient(135deg,rgba(244,197,66,0.08),rgba(124,58,237,0.08))]">
                      <div className="w-full h-full bg-[url('/img-02.png')] bg-cover bg-center opacity-85" />
                      <div className="absolute inset-0 bg-black/55" />
                      <div className="relative p-8 text-center">
                        <p className="font-serif text-foreground/90 text-lg">
                          {'Every reading is a sacred conversation, not a template. Your energy is unique; your guidance should be too.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CLOSING MESSAGE */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-20 md:mb-28"
          aria-label="Closing message"
        >
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 text-gold/20" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 text-gold/20" />

            <div className="bg-gradient-to-br from-[#8B5CF6]/10 via-gold/5 to-[#8B5CF6]/10 border border-gold/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-center">
              <p className="text-foreground/90 text-xl md:text-2xl leading-relaxed font-serif italic mb-6 text-balance">
                {isHydrated
                  ? t('about.redesigned.closing.text')
                  : 'The answers you seek already exist within you. Consider this space a mirror — reflecting back the clarity, the strength, and the divine wisdom that has always been your birthright. You are more powerful than you know.'}
              </p>
              <div className="flex justify-center">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* FINAL CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="text-center"
          aria-label="Start your reading"
        >
          <div className="relative rounded-3xl overflow-hidden border border-gold/15">
            <div className="absolute inset-0 bg-[url('/imgbg.png')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(244,197,66,0.22)_0%,transparent_55%)]" />

            <div className="relative p-8 md:p-12">
              <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-8">
                {isHydrated ? t('about.redesigned.cta.title') : 'Step Into Your Power'}
              </h2>

              <div className="flex justify-center">
                <Link href="/reading" className="inline-flex">
                  <Button size="xl" variant="secondary" className="btn-glow-hover">
                    {isHydrated ? t('about.redesigned.cta.button') : 'Start Your Reading'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
