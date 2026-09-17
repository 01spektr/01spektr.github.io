import { DEFAULTS, type RoofInput } from "./model.ts";
import { validate } from "./validation.ts";
export const STORAGE_KEY = "toolboxi-roof-projects-v1";
export type SavedRoof = {
  id: string;
  at: number;
  input: RoofInput;
  area: number;
  favorite: boolean;
};
export function serialize(i: RoofInput): Record<string, string> {
  return Object.fromEntries(
    Object.keys(DEFAULTS)
      .filter((k) => k !== "name")
      .map((k) => [k, String(i[k as keyof RoofInput])]),
  );
}
export function deserialize(p: URLSearchParams): RoofInput | null {
  if (!p.has("type")) return null;
  const i = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS) as (keyof RoofInput)[]) {
    const value = p.get(key);
    if (value === null) continue;
    if (typeof DEFAULTS[key] === "number")
      Object.assign(i, { [key]: value.trim() === "" ? NaN : Number(value) });
  }
  const type = p.get("type");
  if (type === "gable" || type === "hip" || type === "shed" || type === "mansard") i.type = type;
  else return null;
  i.mode = p.get("mode") === "height" ? "height" : "angle";
  i.material = p.get("material") === "profile" ? "profile" : "tile";
  return Object.keys(validate(i)).length ? null : i;
}
export function readProjects(): SavedRoof[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed
          .filter(
            (p) =>
              p &&
              typeof p.id === "string" &&
              Number.isFinite(p.at) &&
              Number.isFinite(p.area) &&
              p.input &&
              deserialize(new URLSearchParams(serialize(p.input))),
          )
          .slice(0, 30)
      : [];
  } catch {
    return [];
  }
}
export function writeProjects(projects: SavedRoof[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.slice(0, 30)));
}
