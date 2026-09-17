import type { RoofInput } from "./model.ts";
export function validate(i: RoofInput) {
  const errors: Partial<Record<keyof RoofInput, string>> = {};
  function range(key: keyof RoofInput, min: number, max: number) {
    const n = i[key];
    if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max)
      errors[key] = `Введите число от ${min} до ${max}`;
  }
  range("length", 0.5, 100);
  range("width", 0.5, 100);
  range("eaves", 0, 2);
  if (i.type !== "hip") range("gable", 0, 2);
  if (i.mode === "angle" || i.type === "mansard") range("angle", 5, 75);
  else range("height", 0.1, 30);
  if (i.type === "hip" && i.length < i.width)
    errors.length = "Для вальмовой крыши A должно быть не меньше B";
  if (i.type === "mansard") {
    range("lowerAngle", 30, 80);
    range("breakRun", 0.1, Math.max(0.1, i.width / 2 - 0.1));
    if (i.lowerAngle <= i.angle) errors.lowerAngle = "Нижний скат должен быть круче верхнего";
  }
  if (
    i.mode === "height" &&
    i.type !== "mansard" &&
    Number.isFinite(i.height) &&
    Number.isFinite(i.width)
  ) {
    const angle =
      (Math.atan(i.height / (i.type === "shed" ? i.width : i.width / 2)) * 180) / Math.PI;
    if (angle < 5 || angle > 75)
      errors.height = "Получается угол вне диапазона 5–75°. Измените высоту или ширину.";
  }
  range("sheetWidth", 0.3, 2);
  range("sheetLength", 0.5, 12);
  range("overlap", 0, 0.5);
  range("waste", 0, 40);
  range("screws", 1, 20);
  if (i.overlap >= i.sheetLength) errors.overlap = "Нахлёст должен быть меньше длины листа";
  for (const key of ["sheetPrice", "ridgePrice", "screwPrice"] as const) range(key, 0, 100000000);
  return errors;
}
