import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { getTranslation, type Language } from "../utils/i18n";

export type ThemeMode = "light" | "dark";

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  t: (key: string) => any;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const value = useMemo<AppContextValue>(
    () => ({
      language: locale,
      setLanguage: setLocale,
      theme,
      toggleTheme,
      t: (key: string) => getTranslation(key, locale),
    }),
    [locale, setLocale, theme, toggleTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
