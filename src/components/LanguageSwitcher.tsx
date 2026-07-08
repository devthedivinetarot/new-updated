'use client';

import { useLanguageStore, type Language } from "@/store/languageStore";
import { cn } from "@/lib/utils";

const OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिंदी" },
  { code: "hinglish", label: "Hinglish" },
];

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div
      role="group"
      aria-label="Select language"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-white/5 p-0.5 backdrop-blur-sm",
        className
      )}
    >
      {OPTIONS.map((opt) => {
        const active = language === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap",
              active
                ? "bg-[#FFD700] text-black"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
