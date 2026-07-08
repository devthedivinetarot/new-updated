import { create } from "zustand"
import { getDefaultLanguage } from "@/lib/i18n/getDefaultLanguage"

export type Language = "en" | "hi" | "hinglish"

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: getDefaultLanguage(),

  setLanguage: (lang: Language) => {
    // Update state first so the UI always switches, even if persistence fails
    // (private mode, storage disabled, etc.).
    set({ language: lang })
    try {
      localStorage.setItem("lang", lang)
    } catch {
      /* ignore storage failures */
    }
  },
}))