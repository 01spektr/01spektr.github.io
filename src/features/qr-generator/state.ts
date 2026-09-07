export type QrContentType =
  | "url"
  | "text"
  | "contact"
  | "wifi"
  | "email"
  | "phone"
  | "sms";

export type DotStyle = "square" | "rounded" | "soft" | "dots";
export type EyeStyle = "square" | "rounded";
export type FrameStyle = "none" | "simple" | "rounded";
export type ErrorCorrection = "L" | "M" | "Q" | "H";
export type ExportFormat = "png" | "svg" | "jpg" | "webp";
export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface ContactData {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
  website: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface QrState {
  type: QrContentType;
  url: string;
  text: string;
  contact: ContactData;
  wifi: WifiData;
  email: EmailData;
  phone: string;
  sms: SmsData;
  foregroundColor: string;
  backgroundColor: string;
  transparentBackground: boolean;
  logoEnabled: boolean;
  logoDataUrl: string | null;
  logoName: string;
  logoSize: number;
  logoPadding: number;
  typeBadge: boolean;
  dotStyle: DotStyle;
  eyeStyle: EyeStyle;
  frame: FrameStyle;
  captionEnabled: boolean;
  caption: string;
  captionFont: string;
  size: number;
  errorCorrection: ErrorCorrection;
  margin: number;
  quietZone: boolean;
  highQualitySvg: boolean;
  exportFormat: ExportFormat;
}

export const COLOR_PRESETS = [
  { fg: "#1F2937", bg: "#FFFFFF", id: "ink" },
  { fg: "#2563EB", bg: "#FFFFFF", id: "blue" },
  { fg: "#7C3AED", bg: "#FFFFFF", id: "violet" },
  { fg: "#DC2626", bg: "#FFFFFF", id: "red" },
  { fg: "#EA580C", bg: "#FFFFFF", id: "orange" },
  { fg: "#16A34A", bg: "#FFFFFF", id: "green" },
] as const;

export const SIZE_PRESETS = [300, 500, 1000] as const;

export const MAX_LOGO_RATIO = 0.28;
export const MIN_LOGO_RATIO = 0.08;

export const defaultQrState = (): QrState => ({
  type: "url",
  url: "https://www.example.com",
  text: "",
  contact: {
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    email: "",
    website: "",
  },
  wifi: {
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  },
  email: { to: "", subject: "", body: "" },
  phone: "",
  sms: { phone: "", message: "" },
  foregroundColor: "#1F2937",
  backgroundColor: "#FFFFFF",
  transparentBackground: false,
  logoEnabled: false,
  logoDataUrl: null,
  logoName: "",
  logoSize: 0.18,
  logoPadding: 0.18,
  typeBadge: true,
  dotStyle: "rounded",
  eyeStyle: "rounded",
  frame: "none",
  captionEnabled: false,
  caption: "Отсканируйте меня",
  captionFont: "Plus Jakarta Sans",
  size: 300,
  errorCorrection: "M",
  margin: 4,
  quietZone: true,
  highQualitySvg: true,
  exportFormat: "png",
});

export function effectiveEcc(state: QrState): ErrorCorrection {
  if (state.logoEnabled && state.logoDataUrl) return "H";
  return state.errorCorrection;
}

export function clampLogoSize(size: number): number {
  return Math.min(MAX_LOGO_RATIO, Math.max(MIN_LOGO_RATIO, size));
}
