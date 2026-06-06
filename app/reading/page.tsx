import Link from 'next/link';

const READING_URL = 'https://ginni-ki-baatein-buddy.lovable.app';

export default function ReadingPage() {
  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Extend section above footer: occupy ~80% of screen height */}
      <main className="h-[80vh] w-full flex flex-col items-center justify-center relative bg-[#0a0a0a]">

        {/* Premium "Back to Home" (top-left, above iframe) */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 inline-flex items-center justify-center border border-yellow-500/30 text-yellow-500/80 hover:bg-yellow-500 hover:text-black transition-all rounded-full px-4 py-1.5 text-sm bg-black/20 backdrop-blur-sm shadow-[0_0_20px_rgba(234,179,8,0.12)]"
        >
          ← Back to Home
        </Link>

        {/* Chat window section: iframe must be 90% x 90% of this parent section */}
        <div className="w-[90%] h-[90%] overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.15)]">
          <iframe
            src={READING_URL}
            title="Tarot Reading Buddy"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
            allowFullScreen
            allow="autoplay; clipboard-write; microphone; camera"
            sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
          />
        </div>
      </main>
    </div>
  );
}


