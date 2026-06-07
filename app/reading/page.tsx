"use client";

import { useEffect, useMemo, useState } from "react";

const READING_URL = "https://ginni-ki-baatein-buddy.lovable.app";

export default function ReadingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, []);

  // Keep the particles layer deterministic without depending on JS.
  const particleStyle = useMemo(() => {
    // 5% opacity requirement implemented via opacity on wrapper + faint dust.
    return {
      backgroundImage:
        "radial-gradient(circle at 10% 15%, rgba(255,255,255,0.9) 0 1px, transparent 2px), radial-gradient(circle at 25% 70%, rgba(255,255,255,0.8) 0 1px, transparent 2px), radial-gradient(circle at 45% 35%, rgba(255,255,255,0.75) 0 1px, transparent 2px), radial-gradient(circle at 60% 80%, rgba(255,255,255,0.85) 0 1px, transparent 2px), radial-gradient(circle at 80% 40%, rgba(255,255,255,0.7) 0 1px, transparent 2px), radial-gradient(circle at 90% 75%, rgba(255,255,255,0.65) 0 1px, transparent 2px)" as const,
      backgroundSize: "520px 520px",
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050508] text-zinc-100">
      {/*
        Ethereal background atmosphere:
        - subtle drifting stardust particles at ~5% opacity
        - centered radial mask that pulses between deep amethyst and midnight blue
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Dark atmospheric base */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_20%,rgba(109,40,217,0.18),transparent_55%),radial-gradient(900px_520px_at_20%_80%,rgba(234,179,8,0.10),transparent_55%),linear-gradient(to_bottom,rgba(5,5,8,1),rgba(6,6,12,1))]" />

        {/* Center pulsing radial mask (amethyst <-> midnight blue) */}
        <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2">
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.20)_0%,transparent_55%)] opacity-80 animate-[maskPulse_14s_ease-in-out_infinite]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16)_0%,transparent_60%)] opacity-60 animate-[maskPulse_18s_ease-in-out_infinite]" />
        </div>

        {/* Particle field (5% opacity) */}
        <div
          className="absolute inset-0 opacity-[0.05] animate-[dustDrift_28s_linear_infinite]"
          style={particleStyle}
        />

        {/* Slight vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.72)_100%)]" />

        {/* Local keyframes (kept inside page to avoid global churn) */}
        <style jsx>{`
          @keyframes dustDrift {
            0% {
              transform: translate3d(0, 0, 0);
              filter: blur(0px);
            }
            50% {
              transform: translate3d(-2.5%, 2.5%, 0);
              filter: blur(0.2px);
            }
            100% {
              transform: translate3d(0, 0, 0);
              filter: blur(0px);
            }
          }
          @keyframes maskPulse {
            0%, 100% {
              opacity: 0.65;
              transform: scale(1);
            }
            50% {
              opacity: 0.95;
              transform: scale(1.04);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-\[dustDrift_28s_linear_infinite\],
            .animate-\[maskPulse_14s_ease-in-out_infinite\],
            .animate-\[maskPulse_18s_ease-in-out_infinite\] {
              animation: none !important;
            }
          }
        `}</style>
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-0 py-0 min-h-screen flex flex-col items-center justify-center">
        {/* 90vw x 90vh chat wrapper (must fill exactly) */}
        <div id="reading-chat-wrapper" className="relative w-[90vw] h-[90vh] flex items-stretch justify-center overflow-hidden">
          <div className="relative chatbot-parent-container w-full h-full rounded-none border-none bg-black/10 backdrop-blur shadow-[0_0_70px_rgba(109,40,217,0.18)] overflow-hidden">
            {/* Inline style tag (no styled-jsx to avoid build tooling issues) */}
            <style>{`
              #reading-chat-iframe {
                display: block !important;
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                outline: none !important;
                box-sizing: border-box !important;
              }
              #reading-chat-wrapper,
              #reading-chat-wrapper * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
            `}</style>

            {/* Ambient glows stacked: amber halo over broader purple aura */}
            <div className="pointer-events-none absolute -inset-0.5 rounded-2xl">
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.22)_0%,transparent_55%)] blur-2xl opacity-70" />
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_40%_50%,rgba(109,40,217,0.22)_0%,transparent_60%)] blur-3xl opacity-60" />
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_60%_80%,rgba(234,179,8,0.14)_0%,transparent_55%)] blur-2xl opacity-55" />
            </div>

            {/* SVG corner accents framing the container */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {/* top-left */}
              <div className="absolute left-4 top-4">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 10H10V18"
                    stroke="rgba(234,179,8,0.55)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M46 10H54V18"
                    stroke="rgba(109,40,217,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 46V54H18"
                    stroke="rgba(109,40,217,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="18" cy="18" r="2.2" fill="rgba(234,179,8,0.75)" />
                  <path
                    d="M20 14L22 18L26 20L22 22L20 26L18 22L14 20L18 18L20 14Z"
                    fill="rgba(234,179,8,0.22)"
                  />
                </svg>
              </div>

              {/* top-right */}
              <div className="absolute right-4 top-4">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M46 10H54V18"
                    stroke="rgba(234,179,8,0.55)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 10H10V18"
                    stroke="rgba(109,40,217,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M54 46V54H46"
                    stroke="rgba(109,40,217,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="46" cy="18" r="2.2" fill="rgba(234,179,8,0.75)" />
                  <path
                    d="M44 14L42 18L38 20L42 22L44 26L46 22L50 20L46 18L44 14Z"
                    fill="rgba(109,40,217,0.20)"
                  />
                </svg>
              </div>

              {/* bottom-left */}
              <div className="absolute left-4 bottom-4">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 54H10V46"
                    stroke="rgba(234,179,8,0.55)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 18V10H18"
                    stroke="rgba(109,40,217,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M46 54H54V46"
                    stroke="rgba(109,40,217,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="18" cy="46" r="2.2" fill="rgba(234,179,8,0.75)" />
                  <path
                    d="M20 50L22 46L26 44L22 42L20 38L18 42L14 44L18 46L20 50Z"
                    fill="rgba(109,40,217,0.20)"
                  />
                </svg>
              </div>

              {/* bottom-right */}
              <div className="absolute right-4 bottom-4">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M46 54H54V46"
                    stroke="rgba(234,179,8,0.55)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 46V54H18"
                    stroke="rgba(109,40,217,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M54 18V10H46"
                    stroke="rgba(109,40,217,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="46" cy="46" r="2.2" fill="rgba(234,179,8,0.75)" />
                  <path
                    d="M44 50L42 46L38 44L42 42L44 38L46 42L50 44L46 46L44 50Z"
                    fill="rgba(234,179,8,0.22)"
                  />
                </svg>
              </div>

              {/* subtle divider shimmer */}
              <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(234,179,8,0.18),transparent)] opacity-0 group-hover:opacity-100" />
            </div>

            {/* Cosmic loader overlay (visual only) */}
            {!isLoaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                <div className="relative h-[180px] w-[180px]">
                  <div className="absolute inset-0 rounded-full border border-amber-500/25 animate-[spinFast_1.6s_linear_infinite]" />
                  <div className="absolute inset-6 rounded-full border border-purple-400/20 animate-[spinFast_2.6s_linear_infinite_reverse]" />
                  <div className="absolute inset-[46px] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.35)_0%,transparent_65%)] blur-[1px] animate-[pulseCore_1.8s_ease-in-out_infinite]" />

                  {/* Celestial crescent hint */}
                  <div className="absolute left-1/2 top-1/2 h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-[spinFast_3.2s_linear_infinite]" />
                    <div className="absolute -left-3 top-1/2 h-[70px] w-[70px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_30%_50%,rgba(109,40,217,0.22),transparent_60%)]" />
                  </div>

                  {/* Inner glow ring */}
                  <div className="absolute inset-[68px] rounded-full bg-amber-300/10 shadow-[0_0_40px_rgba(234,179,8,0.35)] animate-pulse" />
                </div>

                <style jsx>{`
                  @keyframes spinFast {
                    to {
                      transform: rotate(360deg);
                    }
                  }
                  @keyframes spinFastReverse {
                    to {
                      transform: rotate(-360deg);
                    }
                  }
                  @keyframes pulseCore {
                    0%, 100% {
                      transform: scale(1);
                      opacity: 0.9;
                    }
                    50% {
                      transform: scale(1.08);
                      opacity: 1;
                    }
                  }
                  .animate-\[spinFast_1.6s_linear_infinite\] {
                    animation: spinFast 1.6s linear infinite;
                  }
                  .animate-\[spinFast_2.6s_linear_infinite_reverse\] {
                    animation: spinFastReverse 2.6s linear infinite;
                  }
                  .animate-\[spinFast_3.2s_linear_infinite\] {
                    animation: spinFast 3.2s linear infinite;
                  }
                  .animate-\[pulseCore_1.8s_ease-in-out_infinite\] {
                    animation: pulseCore 1.8s ease-in-out infinite;
                  }

                  @media (prefers-reduced-motion: reduce) {
                    .animate-\[spinFast_1.6s_linear_infinite\],
                    .animate-\[spinFast_2.6s_linear_infinite_reverse\],
                    .animate-\[spinFast_3.2s_linear_infinite\],
                    .animate-\[pulseCore_1.8s_ease-in-out_infinite\],
                    .animate-pulse {
                      animation: none !important;
                    }
                  }
                `}</style>
              </div>
            )}

            {/* Iframe (config preserved) */}
            <div className="relative w-full h-full">
              <iframe
                id="reading-chat-iframe"
                src={READING_URL}
                title="Ginni Ki Baatein — Your Tarot Bestie 🌙"
                className="h-full w-full border-0 rounded-none"
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
      <div aria-hidden className="pointer-events-none absolute bottom-[-140px] left-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.16),transparent_60%)] blur-3xl" />
    </div>
  );
}

