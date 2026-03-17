import { createContext, useContext, useState, type ReactNode } from "react";

export type AppLanguage = "en" | "hi" | "kn";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  speechLang: string;
  voiceTooltip: string;
}

const LANG_MAP: Record<AppLanguage, { speechLang: string; voiceTooltip: string }> = {
  en: { speechLang: "en-IN", voiceTooltip: "✨ Voice Guide (Accessibility)" },
  hi: { speechLang: "hi-IN", voiceTooltip: "वॉयस गाइड (Voice Guide)" },
  kn: { speechLang: "kn-IN", voiceTooltip: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ (Voice Guide)" },
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  speechLang: "en-IN",
  voiceTooltip: "✨ Voice Guide (Accessibility)",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<AppLanguage>("en");
  const { speechLang, voiceTooltip } = LANG_MAP[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, speechLang, voiceTooltip }}>
      {children}
    </LanguageContext.Provider>
  );
};
