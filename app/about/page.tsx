'use client';

// Image intentionally not used in hero; hero uses an <img> tag per design spec.

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/button';
import { Sparkles, Award, Users, Heart, Star, Eye, ArrowRight, Circle, Crown } from 'lucide-react';

export default function AboutPage() {
  const { t, isHydrated } = useLanguage();

  const authorityBadges = [
    {
      icon: Award,
      titleKey: 'about.redesigned.authority.badge1.title',
      descKey: 'about.redesigned.authority.badge1.desc',
      fallbackTitle: "India's No.1 Psychic Tarot Reader",
      fallbackDesc: 'Recognized nationally for intuitive accuracy',
    },
    {
      icon: Users,
      titleKey: 'about.redesigned.authority.badge2.title',
      descKey: 'about.redesigned.authority.badge2.desc',
      fallbackTitle: '7 Lakh+ YouTube Community',
      fallbackDesc: 'A family of seekers growing together',
    },
  ];

  const expertiseSections = [
    {
      icon: Sparkles,
      titleKey: 'about.redesigned.expertise.divination.title',
      itemsKey: 'about.redesigned.expertise.divination.items',
      fallbackTitle: 'Divination',
      fallbackItems: 'Hindi Tarot • Runes • Candle Wax • Dice • Tea Leaf Reading',
    },
    {
      icon: Star,
      titleKey: 'about.redesigned.expertise.astrology.title',
      itemsKey: 'about.redesigned.expertise.astrology.items',
      fallbackTitle: 'Astrology',
      fallbackItems: 'Vedic • Nadi • Prashanna • KP',
    },
    {
      icon: Heart,
      titleKey: 'about.redesigned.expertise.transformation.title',
      itemsKey: 'about.redesigned.expertise.transformation.items',
      fallbackTitle: 'Transformation',
      fallbackItems: 'Manifestation Coaching • Life Alignment',
    },
    {
      icon: Eye,
      titleKey: 'about.redesigned.expertise.esoteric.title',
      itemsKey: 'about.redesigned.expertise.esoteric.items',
      fallbackTitle: 'Esoteric Arts',
      fallbackItems: 'Numerology • Hoodoo • Tantra • Spells',
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Subtle elite glow background */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.14)_0%,transparent_55%),radial-gradient(ellipse_at_70%_20%,rgba(244,197,66,0.12)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* ========== HERO SECTION — ELITE SPLIT LAYOUT WITH IMAGE ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
        >
          {/* LEFT — TEXT CONTENT (first on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="order-1 md:order-1"
          >
            <div className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-widest mb-4 md:mb-6">
              <Sparkles className="h-4 w-4" />
              <span>{isHydrated ? t('about.redesigned.hero.title') : 'About The Divine Tarot'}</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground mb-4 md:mb-6 tracking-tight leading-tight">
              {isHydrated ? t('about.redesigned.hero.subtitle') : 'A sacred space for clarity, healing, and transformation.'}
            </h1>

            <div className="bg-surface/20 backdrop-blur-sm border border-gold/10 rounded-2xl p-5 md:p-8 mb-6">
              <p className="text-foreground/90 text-base sm:text-lg md:text-xl leading-relaxed font-sans">
                {isHydrated ? t('about.redesigned.intro') : "I'm Bharti Singh. For over a decade, I've been honored to guide thousands of seekers through life's most profound moments of uncertainty. What began as a personal calling evolved into a mission — to make the ancient wisdom of tarot accessible, relatable, and deeply transformative for every soul seeking light."}
              </p>
            </div>

            {/* Premium glass badges */}
            <div className="flex flex-wrap gap-3">
              {authorityBadges.map((badge, index) => (
                <div
                  key={index}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-gold/25 hover:border-gold/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <badge.icon className="h-4 w-4 text-gold" />
                  </div>
                  <span className="text-sm text-foreground-secondary/80 group-hover:text-gold transition-colors">
                    {isHydrated ? badge.fallbackTitle : badge.fallbackTitle}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — PREMIUM IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="order-2 md:order-2 relative mt-10 md:mt-0"
          >
            {/* Subtle gold framed aura */}
            <div className="absolute -inset-6 bg-[radial-gradient(circle_at_30%_30%,rgba(244,197,66,0.20)_0%,transparent_55%)] blur-2xl -z-10" />

            {/* Image frame */}
            <div className="relative rounded-2xl overflow-hidden">
              {/* Metallic-ish gold border (premium) */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[#F4C542]/60 via-[#FFD700]/20 to-[#C084FC]/30">
                <div className="absolute inset-0 rounded-2xl bg-[#0F0F14]" />
              </div>

              {/* Inner card with shadow */}
              <div className="relative rounded-2xl overflow-hidden border border-gold/15 bg-black/20 shadow-[0_18px_55px_rgba(0,0,0,0.55)]">
                {/* Dark blend overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Image as requested: use <img> tag + placeholder URL */}
                <div className="relative w-full aspect-[4/5] md:aspect-square">
                  <img
                    src="/img-02.png"
                    alt="About — Elite Tarot Experience"
                    className="w-full h-full object-cover rounded-2xl"
                    loading="eager"
                  />
                </div>

                {/* Floating badge bottom-left */}
                <div className="absolute bottom-5 left-5 z-20">
                  <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-gold/25">
                    <Crown className="h-4 w-4 text-gold" />
                    <span className="text-sm text-foreground/95 font-medium">
                      {isHydrated ? t('about.redesigned.authority.badge1.title') : "India's No.1 Psychic Tarot Reader"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ========== PHILOSOPHY ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-20 md:mb-28"
        >
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
              {isHydrated ? t('about.redesigned.philosophy.title') : 'Why This Space Exists'}
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto" />
          </div>

          <div className="bg-gradient-to-b from-surface/20 to-surface/10 border border-gold/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
            <p className="text-foreground/90 text-lg md:text-xl leading-relaxed font-serif text-center">
              {isHydrated ? t('about.redesigned.philosophy.text') : 'The cards don\'t predict your future — they help you remember what your soul already knows. This is a sanctuary where ancient symbolism meets modern intuition, where clarity emerges not from fortune-telling, but from deep inner knowing. Here, you\'re not just getting answers — you\'re reconnecting with your own wisdom.'}
            </p>
          </div>
        </motion.div>

        {/* ========== EXPERTISE ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-20 md:mb-28"
        >
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
              {isHydrated ? t('about.redesigned.expertise.title') : 'The Paths I Walk'}
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {expertiseSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.08 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-gold/10 via-purple-500/10 to-gold/10 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative bg-surface/20 border border-gold/10 rounded-2xl p-5 md:p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="inline-flex rounded-full p-2.5 md:p-3 bg-gold/10">
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-gold" />
                      </div>
                      <h3 className="font-heading text-base md:text-lg text-foreground">
                        {isHydrated ? t(section.titleKey) : section.fallbackTitle}
                      </h3>
                    </div>
                    <p className="text-foreground-secondary text-sm md:text-base leading-relaxed pl-0 md:pl-14">
                      {isHydrated ? t(section.itemsKey) : section.fallbackItems}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ========== UNIQUE DIFFERENTIATOR ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mb-20 md:mb-28"
        >
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
              {isHydrated ? t('about.redesigned.differentiator.title') : 'The Sacred Blend'}
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto" />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gold/5 via-purple-500/5 to-gold/5 border border-gold/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <p className="text-foreground/90 text-lg md:text-xl leading-relaxed font-serif text-center">
                {isHydrated ? t('about.redesigned.differentiator.p1') : 'Where ancient tradition meets intuitive innovation. I bridge the timeless wisdom of Eastern mysticism with a grounded, modern approach — creating a holistic experience that honors both spirit and practicality.'}
              </p>
            </div>
            <div className="bg-surface/20 border border-gold/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <p className="text-foreground-secondary text-center text-lg">
                {isHydrated ? t('about.redesigned.differentiator.p2') : 'Every reading is a sacred conversation, not a template. Your energy is unique; your guidance should be too.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========== CLOSING MESSAGE ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mb-20 md:mb-28"
        >
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-12 h-12 text-gold/20">
              <Circle className="w-full h-full" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 text-gold/20">
              <Circle className="w-full h-full" />
            </div>

            <div className="bg-gradient-to-br from-[#8B5CF6]/10 via-gold/5 to-[#8B5CF6]/10 border border-gold/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-center">
              <p className="text-foreground/90 text-xl md:text-2xl leading-relaxed font-serif italic mb-6">
                {isHydrated ? t('about.redesigned.closing.text') : 'The answers you seek already exist within you. Consider this space a mirror — reflecting back the clarity, the strength, and the divine wisdom that has always been your birthright. You are more powerful than you know.'}
              </p>
              <div className="flex justify-center">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========== FINAL CTA ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-8">
            {isHydrated ? t('about.redesigned.cta.title') : 'Step Into Your Power'}
          </h2>
          <Link href="/reading">
            <Button size="xl" className="group">
              {isHydrated ? t('about.redesigned.cta.button') : 'Start Your Reading'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
