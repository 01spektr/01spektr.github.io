import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "toolbox:theme";

let theme: Theme = "light";
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function apply(next: Theme) {
  theme = next;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", next === "dark");
  }
}

function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

if (typeof window !== "undefined") {
  apply(readTheme());
}

export function getTheme() {
  return theme;
}

export function setTheme(next: Theme) {
  apply(next);
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, next);
  emit();
}

export function toggleTheme() {
  setTheme(theme === "dark" ? "light" : "dark");
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);
  const toggle = useCallback(() => {
    setTheme(current === "dark" ? "light" : "dark");
  }, [current]);
  const value = useMemo(
    () => ({ theme: current, setTheme, toggleTheme: toggle }),
    [current, toggle],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
