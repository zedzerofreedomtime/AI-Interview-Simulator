"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "th";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  isThai: boolean;
  isLanguageReady: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = "intervue-language-v1";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    queueMicrotask(() => {
      if (saved === "en" || saved === "th") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
      setIsLanguageReady(true);
    });
  }, []);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(storageKey, nextLanguage);
    document.documentElement.lang = nextLanguage;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isThai: language === "th",
        isLanguageReady,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
