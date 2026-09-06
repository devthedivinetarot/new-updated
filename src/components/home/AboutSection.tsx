'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AboutSection() {
  const { t, isHydrated } = useLanguage();

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-[#0B0B0F] to-background overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(244,197,66,0.2)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-wider mb-6">
              <Sparkles className="h-4 w-4" />
              <span>{isHydrated ? t('about.redesigned.hero.title') : 'About The Divine Tarot'}</span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-6 leading-tight">
              {isHydrated ? t('about.redesigned.hero.subtitle') : 'A sacred space for clarity, healing, and transformation.'}
            </h2>

            <p className="text-foreground-secondary/80 leading-relaxed mb-6 text-lg">
              {isHydrated ? t('about.redesigned.intro') : "I'm Bharti Singh. For over a decade, I've been honored to guide thousands of seekers through life's most profound moments of uncertainty. What began as a personal calling evolved into a mission — to make the ancient wisdom of tarot accessible, relatable, and deeply transformative for every soul seeking light."}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-gold" />
                </div>
                <span className="text-sm text-foreground-secondary">
                  {isHydrated ? t('about.redesigned.authority.badge1.title') : "India's No.1 Psychic Tarot Reader"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-gold text-sm font-bold">7L+</span>
                </div>
                <span className="text-sm text-foreground-secondary">
                  {isHydrated ? t('about.redesigned.authority.badge2.title') : '7 Lakh+ YouTube Community'}
                </span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors group"
              >
                <span className="font-medium">{isHydrated ? t('nav.about') : 'Explore the full journey'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              {/* Glow background */}
              <div className="absolute -inset-8 bg-gradient-to-br from-gold/20 via-purple-500/10 to-gold/20 rounded-full blur-3xl" />

              {/* Image container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Image
src="/img-01.png"
alt="About The Divine Tarot"
                  fill
                  className="object-cover rounded-full ring-2 ring-gold/20"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-surface/80 backdrop-blur-md border border-gold/30 rounded-2xl p-4 shadow-xl">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
