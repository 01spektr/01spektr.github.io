import {
  Link2,
  Instagram,
  FileText,
  Contact,
  Wifi,
  Mail,
  Phone,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { QrContentType, QrState } from "../state";
import { defaultQrState } from "../state";

interface Props {
  onApply: (patch: Partial<QrState>) => void;
}

export function Examples({ onApply }: Props) {
  const { t } = useI18n();

  const items: {
    id: QrContentType;
    icon: typeof Link2;
    title: string;
    hint: string;
    patch: Partial<QrState>;
  }[] = [
    {
      id: "url",
      icon: Link2,
      title: t("qr.ex.url"),
      hint: t("qr.ex.urlHint"),
      patch: { type: "url", url: "https://www.example.com" },
    },
    {
      id: "url",
      icon: Instagram,
      title: t("qr.ex.social"),
      hint: t("qr.ex.socialHint"),
      patch: { type: "url", url: "https://instagram.com/" },
    },
    {
      id: "text",
      icon: FileText,
      title: t("qr.ex.text"),
      hint: t("qr.ex.textHint"),
      patch: { type: "text", text: t("qr.ex.textHint") },
    },
    {
      id: "contact",
      icon: Contact,
      title: t("qr.ex.contact"),
      hint: t("qr.ex.contactHint"),
      patch: {
        type: "contact",
        contact: {
          ...defaultQrState().contact,
          firstName: "Anna",
          lastName: "Ivanova",
          company: "ToolBox",
          phone: "+1 555 0100",
          email: "hello@example.com",
          website: "https://example.com",
        },
      },
    },
    {
      id: "wifi",
      icon: Wifi,
      title: t("qr.ex.wifi"),
      hint: t("qr.ex.wifiHint"),
      patch: {
        type: "wifi",
        wifi: { ssid: "Guest-WiFi", password: "toolbox", encryption: "WPA", hidden: false },
      },
    },
    {
      id: "email",
      icon: Mail,
      title: t("qr.ex.email"),
      hint: t("qr.ex.emailHint"),
      patch: {
        type: "email",
        email: { to: "hello@example.com", subject: "Hello", body: "" },
      },
    },
    {
      id: "phone",
      icon: Phone,
      title: t("qr.ex.phone"),
      hint: t("qr.ex.phoneHint"),
      patch: { type: "phone", phone: "+1 555 0100" },
    },
  ];

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{t("qr.examples")}</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onApply(item.patch)}
              className="surface-card surface-card-hover flex min-h-32 flex-col items-start gap-3 p-4 text-left"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
