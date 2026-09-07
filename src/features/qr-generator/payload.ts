import type { QrState } from "./state";

function vcardEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildVCard(state: QrState): string {
  const c = state.contact;
  const first = c.firstName.trim();
  const last = c.lastName.trim();
  const fn = [first, last].filter(Boolean).join(" ") || c.company.trim();
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${vcardEscape(last)};${vcardEscape(first)};;;`,
    `FN:${vcardEscape(fn)}`,
  ];
  if (c.company.trim()) lines.push(`ORG:${vcardEscape(c.company.trim())}`);
  if (c.phone.trim()) lines.push(`TEL:${vcardEscape(c.phone.trim())}`);
  if (c.email.trim()) lines.push(`EMAIL:${vcardEscape(c.email.trim())}`);
  if (c.website.trim()) lines.push(`URL:${vcardEscape(normalizeUrl(c.website))}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function wifiEscape(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function buildPayload(state: QrState): string {
  switch (state.type) {
    case "url":
      return normalizeUrl(state.url);
    case "text":
      return state.text;
    case "contact":
      return buildVCard(state);
    case "wifi": {
      const enc = state.wifi.encryption;
      const ssid = wifiEscape(state.wifi.ssid);
      const pass = enc === "nopass" ? "" : wifiEscape(state.wifi.password);
      const hidden = state.wifi.hidden ? "true" : "false";
      return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden};;`;
    }
    case "email": {
      const to = state.email.to.trim();
      const params = new URLSearchParams();
      if (state.email.subject) params.set("subject", state.email.subject);
      if (state.email.body) params.set("body", state.email.body);
      const qs = params.toString();
      return qs ? `mailto:${to}?${qs}` : `mailto:${to}`;
    }
    case "phone":
      return `tel:${state.phone.replace(/\s/g, "")}`;
    case "sms": {
      const num = state.sms.phone.replace(/\s/g, "");
      const msg = state.sms.message;
      return msg ? `SMSTO:${num}:${msg}` : `SMSTO:${num}`;
    }
    default:
      return "";
  }
}

export function isPayloadEmpty(state: QrState): boolean {
  switch (state.type) {
    case "url":
      return !state.url.trim();
    case "text":
      return !state.text.trim();
    case "contact":
      return !(
        state.contact.firstName.trim() ||
        state.contact.lastName.trim() ||
        state.contact.phone.trim() ||
        state.contact.email.trim() ||
        state.contact.company.trim()
      );
    case "wifi":
      return !state.wifi.ssid.trim();
    case "email":
      return !state.email.to.trim();
    case "phone":
      return !state.phone.trim();
    case "sms":
      return !state.sms.phone.trim();
    default:
      return true;
  }
}

export function payloadLabel(state: QrState): string {
  switch (state.type) {
    case "url":
      return state.url.trim() || "URL";
    case "text":
      return state.text.trim().slice(0, 48) || "Text";
    case "contact": {
      const name = [state.contact.firstName, state.contact.lastName].filter(Boolean).join(" ");
      return name || state.contact.company || "vCard";
    }
    case "wifi":
      return state.wifi.ssid || "Wi-Fi";
    case "email":
      return state.email.to || "Email";
    case "phone":
      return state.phone || "Phone";
    case "sms":
      return state.sms.phone || "SMS";
    default:
      return "QR";
  }
}
