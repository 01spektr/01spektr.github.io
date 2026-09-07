import { defaultQrState, type QrContentType, type QrState } from "./state";

const TYPE_SET = new Set<QrContentType>([
  "url",
  "text",
  "contact",
  "wifi",
  "email",
  "phone",
  "sms",
]);

function compactColor(hex: string): string {
  return hex.replace("#", "");
}

function expandColor(raw: string | null, fallback: string): string {
  if (!raw) return fallback;
  const v = raw.startsWith("#") ? raw : `#${raw}`;
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ? v : fallback;
}

export function serializeQrState(state: QrState): URLSearchParams {
  const d = defaultQrState();
  const p = new URLSearchParams();
  p.set("t", state.type);

  switch (state.type) {
    case "url":
      if (state.url) p.set("d", state.url);
      break;
    case "text":
      if (state.text) p.set("d", state.text.slice(0, 800));
      break;
    case "contact":
      if (state.contact.firstName) p.set("fn", state.contact.firstName);
      if (state.contact.lastName) p.set("ln", state.contact.lastName);
      if (state.contact.company) p.set("org", state.contact.company);
      if (state.contact.phone) p.set("tel", state.contact.phone);
      if (state.contact.email) p.set("em", state.contact.email);
      if (state.contact.website) p.set("web", state.contact.website);
      break;
    case "wifi":
      if (state.wifi.ssid) p.set("ss", state.wifi.ssid);
      if (state.wifi.password) p.set("pw", state.wifi.password);
      if (state.wifi.encryption !== "WPA") p.set("enc", state.wifi.encryption);
      if (state.wifi.hidden) p.set("hid", "1");
      break;
    case "email":
      if (state.email.to) p.set("em", state.email.to);
      if (state.email.subject) p.set("sub", state.email.subject);
      if (state.email.body) p.set("body", state.email.body.slice(0, 400));
      break;
    case "phone":
      if (state.phone) p.set("tel", state.phone);
      break;
    case "sms":
      if (state.sms.phone) p.set("tel", state.sms.phone);
      if (state.sms.message) p.set("msg", state.sms.message.slice(0, 400));
      break;
  }

  if (state.foregroundColor !== d.foregroundColor) p.set("fg", compactColor(state.foregroundColor));
  if (state.backgroundColor !== d.backgroundColor) p.set("bg", compactColor(state.backgroundColor));
  if (state.dotStyle !== d.dotStyle) p.set("dot", state.dotStyle);
  if (state.eyeStyle !== d.eyeStyle) p.set("eye", state.eyeStyle);
  if (state.frame !== d.frame) p.set("frm", state.frame);
  if (state.captionEnabled) p.set("cap", state.caption.slice(0, 80));
  if (state.errorCorrection !== d.errorCorrection) p.set("ecc", state.errorCorrection);
  if (state.size !== d.size) p.set("sz", String(state.size));
  if (state.margin !== d.margin) p.set("m", String(state.margin));
  if (!state.quietZone) p.set("qz", "0");
  if (state.transparentBackground) p.set("tr", "1");
  if (state.typeBadge !== d.typeBadge) p.set("badge", state.typeBadge ? "1" : "0");

  const encoded = p.toString();
  if (encoded.length > 1800) {
    p.delete("d");
    p.delete("body");
    p.delete("msg");
    p.delete("pw");
  }
  return p;
}

export function deserializeQrState(params: URLSearchParams): Partial<QrState> {
  const patch: Partial<QrState> = {};
  const t = params.get("t");
  if (t && TYPE_SET.has(t as QrContentType)) patch.type = t as QrContentType;

  const type = patch.type ?? "url";
  if (type === "url" && params.get("d")) patch.url = params.get("d") ?? "";
  if (type === "text" && params.get("d")) patch.text = params.get("d") ?? "";
  if (type === "contact") {
    patch.contact = {
      ...defaultQrState().contact,
      firstName: params.get("fn") ?? "",
      lastName: params.get("ln") ?? "",
      company: params.get("org") ?? "",
      phone: params.get("tel") ?? "",
      email: params.get("em") ?? "",
      website: params.get("web") ?? "",
    };
  }
  if (type === "wifi") {
    const enc = params.get("enc");
    patch.wifi = {
      ...defaultQrState().wifi,
      ssid: params.get("ss") ?? "",
      password: params.get("pw") ?? "",
      encryption: enc === "WEP" || enc === "nopass" ? enc : "WPA",
      hidden: params.get("hid") === "1",
    };
  }
  if (type === "email") {
    patch.email = {
      to: params.get("em") ?? "",
      subject: params.get("sub") ?? "",
      body: params.get("body") ?? "",
    };
  }
  if (type === "phone" && params.get("tel")) patch.phone = params.get("tel") ?? "";
  if (type === "sms") {
    patch.sms = {
      phone: params.get("tel") ?? "",
      message: params.get("msg") ?? "",
    };
  }

  const d = defaultQrState();
  if (params.get("fg")) patch.foregroundColor = expandColor(params.get("fg"), d.foregroundColor);
  if (params.get("bg")) patch.backgroundColor = expandColor(params.get("bg"), d.backgroundColor);
  const dot = params.get("dot");
  if (dot === "square" || dot === "rounded" || dot === "soft" || dot === "dots") patch.dotStyle = dot;
  const eye = params.get("eye");
  if (eye === "square" || eye === "rounded") patch.eyeStyle = eye;
  const frm = params.get("frm");
  if (frm === "none" || frm === "simple" || frm === "rounded") patch.frame = frm;
  if (params.has("cap")) {
    patch.captionEnabled = true;
    patch.caption = params.get("cap") ?? "";
  }
  const ecc = params.get("ecc");
  if (ecc === "L" || ecc === "M" || ecc === "Q" || ecc === "H") patch.errorCorrection = ecc;
  const sz = Number(params.get("sz"));
  if (Number.isFinite(sz) && sz >= 128 && sz <= 4096) patch.size = Math.round(sz);
  const m = Number(params.get("m"));
  if (Number.isFinite(m) && m >= 0 && m <= 16) patch.margin = Math.round(m);
  if (params.get("qz") === "0") patch.quietZone = false;
  if (params.get("tr") === "1") patch.transparentBackground = true;
  if (params.get("badge") === "0") patch.typeBadge = false;
  if (params.get("badge") === "1") patch.typeBadge = true;
  return patch;
}

export function historyParams(state: QrState): Record<string, string> {
  const p = serializeQrState(state);
  const obj: Record<string, string> = {};
  p.forEach((value, key) => {
    if (key === "pw") return;
    obj[key] = value;
  });
  return obj;
}
