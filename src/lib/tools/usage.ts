const STORAGE_KEY = "toolbox:tool-usage";

export type ToolUsage = Record<string, { count: number; lastAt: number }>;

const EMPTY: ToolUsage = {};
let cachedRaw: string | null = null;
let cachedUsage: ToolUsage = EMPTY;
const listeners = new Set<() => void>();

function read(): ToolUsage {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedUsage;
    if (!raw) {
      cachedRaw = null;
      cachedUsage = EMPTY;
      return cachedUsage;
    }
    const parsed = JSON.parse(raw) as ToolUsage;
    cachedRaw = raw;
    cachedUsage = parsed && typeof parsed === "object" ? parsed : EMPTY;
    return cachedUsage;
  } catch {
    cachedRaw = null;
    cachedUsage = EMPTY;
    return cachedUsage;
  }
}

export function getToolUsage() {
  return read();
}

export function subscribeToolUsage(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function recordToolVisit(toolId: string) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const previous = read();
  const current = previous[toolId];

  // React development mode can mount an effect twice. Count that as one visit.
  if (current && now - current.lastAt < 2_000) return;

  const next: ToolUsage = {
    ...previous,
    [toolId]: { count: (current?.count ?? 0) + 1, lastAt: now },
  };
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedUsage = next;
  listeners.forEach((listener) => listener());
}
