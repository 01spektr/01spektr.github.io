const STORAGE_KEY = "toolbox:history";
const MAX_ENTRIES = 80;
const EMPTY: HistoryEntry[] = [];
let cachedRaw: string | null = null;
let cachedEntries: HistoryEntry[] = EMPTY;

export interface HistoryEntry {
  id: string;
  toolId: string;
  at: number;
  title: string;
  params: Record<string, string>;
}

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

export function subscribeHistory(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedEntries;
    if (!raw) {
      cachedRaw = null;
      cachedEntries = EMPTY;
      return cachedEntries;
    }
    const parsed = JSON.parse(raw) as HistoryEntry[];
    cachedRaw = raw;
    cachedEntries = Array.isArray(parsed) ? parsed : EMPTY;
    return cachedEntries;
  } catch {
    cachedRaw = null;
    cachedEntries = EMPTY;
    return cachedEntries;
  }
}

function write(entries: HistoryEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  emit();
}

export function getHistory(): HistoryEntry[] {
  return read();
}

export function recordHistory(entry: Omit<HistoryEntry, "id" | "at"> & { id?: string; at?: number }) {
  if (typeof window === "undefined") return;
  const next: HistoryEntry = {
    id: entry.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: entry.at ?? Date.now(),
    toolId: entry.toolId,
    title: entry.title.slice(0, 140),
    params: entry.params,
  };
  const prev = read().filter(
    (e) => !(e.toolId === next.toolId && JSON.stringify(e.params) === JSON.stringify(next.params)),
  );
  write([next, ...prev]);
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  write([]);
}
