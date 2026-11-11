'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Smartphone, ShieldCheck, Sparkles, Sun, Moon, Star, UserCheck, Apple } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

/** Shown on the button; keep in step with the APK in the `android-app` GitHub release. */
const APP_VERSION = '1.0.0';
const APP_SIZE = '73 MB';
/** Served by app/download-app/android/route.ts (redirects to the current APK file). */
const DOWNLOAD_HREF = '/download-app/android';

type Device = 'android' | 'ios' | 'other';

export default function DownloadApp() {
  const { t } = useLanguage();
  // Which button matters most is decided on the visitor's device (no server guess, so no flash on Android)
  const [device, setDevice] = useState<Device | null>(null);
  useEffect(() => {
    const ua = navigator.userAgent || '';
    const ipadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    setDevice(/android/i.test(ua) ? 'android' : /iphone|ipad|ipod/i.test(ua) || ipadOS ? 'ios' : 'other');
  }, []);

  const features = [
    { icon: Sparkles, key: 'app.f.ginni' },
    { icon: Sun, key: 'app.f.cotd' },
    { icon: Star, key: 'app.f.horoscope' },
    { icon: Moon, key: 'app.f.kundli' },
    { icon: UserCheck, key: 'app.f.account' },
  ];
  const steps = ['app.step1', 'app.step2', 'app.step3', 'app.step4'];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(244,197,66,0.12)_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl px-6 py-14 md:py-20">
        {/* Hero + the install button */}
        <section className="flex flex-col items-center text-center">
          <Image
            src="/app-icon.png"
            alt="The Divine Tarot app icon"
            width={112}
            height={112}
            priority
            className="rounded-[28px] shadow-glow-gold border border-gold/30"
          />
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gold/80">{t('app.eyebrow')}</p>
          <h1 className="mt-3 font-heading text-3xl md:text-4xl leading-tight text-foreground">{t('app.title')}</h1>
          <p className="mt-4 max-w-xl text-foreground-secondary leading-relaxed">{t('app.subtitle')}</p>

          <div className="mt-8 flex w-full max-w-sm flex-col items-center gap-3">
            {device === 'ios' && (
              <p className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm text-foreground-secondary">
                <Apple className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" aria-hidden />
                <span>{t('app.iphone')}</span>
              </p>
            )}
            <a
              href={DOWNLOAD_HREF}
              className={`flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-semibold transition-all duration-300 ${
                device === 'ios'
                  ? 'border border-gold/40 text-gold hover:bg-gold/10'
                  : 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 hover:bg-amber-400 hover:scale-[1.02]'
              }`}
            >
              <Download className="h-5 w-5" aria-hidden />
              {t('app.download')}
            </a>
            <p className="text-xs text-foreground-muted">
              {t('app.fileInfo', { size: APP_SIZE })} · v{APP_VERSION}
            </p>
            {device === 'other' && (
              <p className="flex items-start gap-2 text-left text-sm text-foreground-secondary">
                <Smartphone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" aria-hidden />
                <span>{t('app.desktop')}</span>
              </p>
            )}
          </div>
        </section>

        {/* What's inside */}
        <section className="mt-16">
          <h2 className="font-heading text-2xl text-foreground mb-5">{t('app.featuresTitle')}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {features.map(({ icon: Icon, key }) => (
              <li key={key} className="flex items-start gap-3 rounded-2xl border border-gold/15 bg-white/[0.03] p-4">
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" aria-hidden />
                <span className="text-foreground-secondary text-[15px] leading-relaxed">{t(key)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How to install */}
        <section className="mt-14">
          <h2 className="font-heading text-2xl text-foreground mb-5">{t('app.howTitle')}</h2>
          <ol className="space-y-3">
            {steps.map((key, i) => (
              <li key={key} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold">
                  {i + 1}
                </span>
                <span className="text-foreground-secondary text-[15px] leading-relaxed">{t(key)}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold/20 bg-gold/[0.05] p-4 text-sm text-foreground-secondary leading-relaxed">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" aria-hidden />
            <div className="space-y-2">
              <p>{t('app.safe')}</p>
              <p>{t('app.oldVersion')}</p>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <a
              href={DOWNLOAD_HREF}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold hover:bg-gold/10 transition-colors"
            >
              <Download className="h-4 w-4" aria-hidden />
              {t('app.download')}
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-foreground-muted">
            <Link href="/privacy" className="hover:text-gold underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
