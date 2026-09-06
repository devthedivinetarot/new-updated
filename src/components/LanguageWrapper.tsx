"use client";

import { useLanguageStore } from "@/store/languageStore";

export function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageStore();
  return <div key={language}>{children}</div>;
}
