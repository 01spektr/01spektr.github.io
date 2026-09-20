export const TOOL_ACCENTS: Record<string, string> = {
  "qr-generator": "#2869ee",
  "cargo-volume": "#16b86e",
  "loan-calculator": "#30b879",
  "color-palette": "#8b5cf6",
  "image-resize": "#20b96b",
  "barcode-generator": "#6549dd",
  "cmyk-convert": "#e85e92",
  "shipping-cost": "#1f9fe8",
  "vat-calculator": "#0bad77",
  "invoice-number": "#2b78e9",
  "word-counter": "#d94eaa",
  "case-converter": "#b25be5",
  "text-symbol-generator": "#8b5cf6",
  "password-generator": "#e94f66",
  "unit-converter": "#f39a24",
  "world-timezones": "#f59e0b",
  "json-formatter": "#15a5c9",
  base64: "#3078ea",
  "roof-calculator": "#f68b28",
  "uuid-generator": "#7c5cf4",
  "area-calculator": "#2d88f4",
  "scale-converter": "#546fe8",
};

export function toolAccent(slug: string, fallback = "#2869ee") {
  return TOOL_ACCENTS[slug] ?? fallback;
}
