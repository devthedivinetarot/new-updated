import Link from 'next/link';

const READING_URL = 'https://ginni-ki-baatein-buddy.lovable.app';

export default function ReadingPage() {
  return (
    <div className="min-h-[calc(100vh-0px)] bg-[#0B0B0F] text-white">
      <main className="min-h-[100vh] flex">
        {/* Centered 80% viewport iframe */}
        <section className="w-[80vw] h-[80vh] max-w-5xl mx-auto my-auto">
          <iframe
            src={READING_URL}
            title="Tarot Reading Buddy"
            className="h-full w-full border-none rounded-2xl shadow-[0_0_60px_rgba(139,92,246,0.15)]"
            loading="lazy"
            referrerPolicy="no-referrer"
            allowFullScreen
            allow="autoplay; clipboard-write; microphone; camera"
            // Sandbox is required for security; adjust if the embedded app needs extra capabilities.
            sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
          />
        </section>

        {/* Remaining 20% for clean UI */}
        <aside className="w-[20vw] hidden md:block bg-gradient-to-b from-[#0B0B0F] to-[#12121A] border-l border-white/5">
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C9A962] shadow-[0_0_20px_rgba(201,169,98,0.35)]" />
              <p className="text-xs tracking-wide text-[#C9A962] uppercase">Reading</p>
            </div>

            <div className="mt-10">
              <h1 className="text-lg font-semibold">Tarot Guidance</h1>
              <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA] max-w-[16rem]">
                Your answers are ready—enter the room and let the cards speak.
              </p>

              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm transition"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>

            <div className="mt-auto">
              <div className="text-[11px] text-white/50">
                {/* Subtle mystical note */}
                <span className="text-[#C9A962]">✦</span> Keep an open mind.
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile fallback: place button below iframe */}
      <div className="md:hidden px-4 pb-6">
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm transition w-full max-w-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

