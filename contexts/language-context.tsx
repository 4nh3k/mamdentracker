"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language, TranslationKey } from "@/lib/translations"
import { translations } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, defaultValue?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = "game-language"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi")

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored === "vi" || stored === "en") {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }

  const t = (key: TranslationKey, defaultValue?: string): string => {
    return translations[language][key] || defaultValue || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

export function useTranslation() {
  const { t } = useLanguage()
  return t
}
