'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const READING_URL = 'https://ginni-ki-baatein-buddy.lovable.app';

export default function ReadingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050508] text-zinc-100">
      {/* Cosmic background (CSS-only) */}
      <div className="pointer-events-none absolute inset-0">
        {/* Base radial mesh */}
        <div className="absolute left-1/2 top-1/3 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.18),transparent_60%)] opacity-70 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),transparent_62%)] animate-[pulse_10s_ease-in-out_infinite]" />

        {/* Slow-pulsing center gradient */}
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_65%)] opacity-80 animate-[pulse_16s_ease-in-out_infinite]" />

        {/* Stardust twinkle */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.8) 0 1px, transparent 2px), radial-gradient(circle at 35% 80%, rgba(255,255,255,0.7) 0 1px, transparent 2px), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.8) 0 1px, transparent 2px), radial-gradient(circle at 90% 70%, rgba(255,255,255,0.6) 0 1px, transparent 2px), radial-gradient(circle at 55% 55%, rgba(255,255,255,0.7) 0 1px, transparent 2px)',
            backgroundSize: '320px 320px',
            animation: 'twinkle 9s ease-in-out infinite',
          }}
        />

        {/* subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Keyframes for background twinkle (kept local via inline <style>) */}
      <style jsx>{`
        @keyframes twinkle {
          0% {
            opacity: 0.05;
            transform: translate3d(0, 0, 0);
          }
          50% {
            opacity: 0.1;
            transform: translate3d(0, -6px, 0);
          }
          100% {
            opacity: 0.05;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes glowSweep {
          0% {
            opacity: 0.25;
            transform: translateX(-20%) rotate(12deg);
          }
          50% {
            opacity: 0.55;
            transform: translateX(20%) rotate(12deg);
          }
          100% {
            opacity: 0.25;
            transform: translateX(-20%) rotate(12deg);
          }
        }
      `}</style>

      <main className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 h-screen flex flex-col">
        {/* Premium Back to Home */}
        <div className="flex items-start justify-start">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-black/20 px-4 py-2 text-sm text-amber-200 backdrop-blur transition-all duration-500 hover:scale-105 hover:border-amber-500/35 hover:bg-black/30"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-100 ring-1 ring-amber-500/20 transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.35)]">
              ←
            </span>
            <span className="font-medium tracking-wide transition-transform duration-500 group-hover:-translate-x-0.5">Back to Home</span>
          </Link>
        </div>

        {/* Iframe container */}
        <div className="relative flex flex-1 items-stretch justify-center w-full">
          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-amber-500/20 bg-black/10 shadow-[0_0_50px_rgba(217,119,6,0.15),_0_0_100px_rgba(109,40,217,0.1)] backdrop-blur"
          >
            {/* Glow layers */}
            <div className="pointer-events-none absolute -inset-[2px] rounded-[calc(1.5rem+2px)] bg-[radial-gradient(circle_at_50%_0%,rgba(217,119,6,0.20),transparent_50%),radial-gradient(circle_at_80%_40%,rgba(109,40,217,0.12),transparent_55%)] blur-2xl" />

            {/* Corner accents */}
            <div className="pointer-events-none absolute inset-0">
              {/* top-left */}
              <div className="absolute left-4 top-4 h-10 w-10">
                <div className="absolute left-0 top-0 h-[1px] w-10 bg-amber-200/30" />
                <div className="absolute left-0 top-0 h-10 w-[1px] bg-amber-200/30" />
                <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-amber-300/70 shadow-[0_0_18px_rgba(234,179,8,0.35)]" />
              </div>
              {/* top-right */}
              <div className="absolute right-4 top-4 h-10 w-10">
                <div className="absolute right-0 top-0 h-[1px] w-10 bg-purple-200/25" />
                <div className="absolute right-0 top-0 h-10 w-[1px] bg-purple-200/25" />
                <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-purple-300/60 shadow-[0_0_18px_rgba(109,40,217,0.35)]" />
              </div>
              {/* bottom-left */}
              <div className="absolute left-4 bottom-4 h-10 w-10">
                <div className="absolute left-0 bottom-0 h-[1px] w-10 bg-purple-200/25" />
                <div className="absolute left-0 bottom-0 h-10 w-[1px] bg-purple-200/25" />
                <div className="absolute left-3 bottom-3 h-2 w-2 rounded-full bg-purple-300/60 shadow-[0_0_18px_rgba(109,40,217,0.35)]" />
              </div>
              {/* bottom-right */}
              <div className="absolute right-4 bottom-4 h-10 w-10">
                <div className="absolute right-0 bottom-0 h-[1px] w-10 bg-amber-200/30" />
                <div className="absolute right-0 bottom-0 h-10 w-[1px] bg-amber-200/30" />
                <div className="absolute right-3 bottom-3 h-2 w-2 rounded-full bg-amber-300/70 shadow-[0_0_18px_rgba(234,179,8,0.35)]" />
              </div>
            </div>

            {/* Loading overlay */}
            {!isLoaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <div className="relative flex items-center justify-center">
                  {/* Celestial ring system */}
                  <div className="absolute h-[160px] w-[160px] rounded-full border border-amber-500/30 shadow-[0_0_60px_rgba(234,179,8,0.18)] animate-spin" />
                  <div className="absolute h-[120px] w-[120px] rounded-full border border-purple-400/20 shadow-[0_0_60px_rgba(109,40,217,0.14)] opacity-80" style={{ animation: 'spin 3.2s linear infinite' }} />
                  <div className="absolute h-[70px] w-[70px] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.45),transparent_65%)] blur-[2px] animate-[glowSweep_3s_ease-in-out_infinite]" />

                  {/* Center core */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_24px_rgba(234,179,8,0.55)] animate-[pulse_1.6s_ease-in-out_infinite]" />
                    <div className="text-center text-sm text-amber-100/90">
                      <span className="inline-block rounded-full border border-amber-500/20 bg-black/20 px-3 py-1 backdrop-blur">
                        Tuning the mirror…
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Responsive iframe box */}
            <div className="relative w-full h-[90vh]">
              <iframe
                src={READING_URL}
                title="Tarot Reading Buddy"
                className="h-full w-full border-0 rounded-3xl"
                loading="lazy"
                referrerPolicy="no-referrer"
                allowFullScreen
                allow="autoplay; clipboard-write; microphone; camera"
                sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Ambient bottom haze */}
      <div className="pointer-events-none absolute bottom-[-120px] left-1/2 h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.18),transparent_60%)] blur-3xl" />
    </div>
  );
}

