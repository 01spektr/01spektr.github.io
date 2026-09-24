import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  detectBrowserLocale,
  DEFAULT_LOCALE,
  isLocale,
  localeFromPath,
  type Locale,
} from "@/lib/i18n/config";
import { messages, type MessageKey } from "@/lib/i18n/messages";

const STORAGE_KEY = "toolbox:locale-choice";

const DICTS = messages;

let locale: Locale = DEFAULT_LOCALE;
const listeners = new Set<() => void>();

export function getPreferredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }
  if (isLocale(stored)) return stored;
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return detectBrowserLocale(browserLanguages);
}

function readLocale(): Locale {
  if (typeof window === "undefined") return locale;
  const normalizedPath = window.location.pathname.replace(/\/$/, "");
  const pathLocale = localeFromPath(normalizedPath);
  if (pathLocale) return pathLocale;
  return getPreferredLocale();
}

locale = typeof window === "undefined" ? DEFAULT_LOCALE : readLocale();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setLocale(next: Locale) {
  locale = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Still switch languages when storage is blocked. */
    }
    document.documentElement.lang = next;
  }
  emit();
}

export function getLocale() {
  return locale;
}

function interpolate(template: string, vars?: Record<string, string>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");
}

const I18nContext = createContext<{
  locale: Locale;
  t: (key: MessageKey, vars?: Record<string, string>) => string;
  setLocale: (l: Locale) => void;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const path = useRouterState({
    select: (s) => s.location.pathname.replace(/\/$/, "") || "/",
  });
  const routeLocale = localeFromPath(path);
  const snapshot = useSyncExternalStore(subscribe, getLocale, () => routeLocale ?? DEFAULT_LOCALE);
  const current = routeLocale ?? snapshot;
  useEffect(() => {
    const preferred = routeLocale ?? readLocale();
    if (preferred !== current) {
      locale = preferred;
      emit();
      return;
    }
    document.documentElement.lang = current;
    locale = current;
  }, [current, path, routeLocale]);
  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string>) => {
      const dict = DICTS[current] as Record<string, string>;
      const fallback = DICTS.en as Record<string, string>;
      return interpolate(dict[key] ?? fallback[key] ?? key, vars);
    },
    [current],
  );
  const value = useMemo(() => ({ locale: current, t, setLocale }), [current, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
