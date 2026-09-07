import type { ReactNode } from "react";
import {
  Link2,
  Type,
  Users,
  Wifi,
  Mail,
  Phone,
  MessageCircle,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { QrContentType, QrState } from "../state";

const TYPES: { id: QrContentType; icon: typeof Link2; label: string }[] = [
  { id: "url", icon: Link2, label: "qr.type.url" },
  { id: "text", icon: Type, label: "qr.type.text" },
  { id: "contact", icon: Users, label: "qr.type.contact" },
  { id: "wifi", icon: Wifi, label: "qr.type.wifi" },
  { id: "email", icon: Mail, label: "qr.type.email" },
  { id: "phone", icon: Phone, label: "qr.type.phone" },
  { id: "sms", icon: MessageCircle, label: "qr.type.sms" },
];

interface Props {
  state: QrState;
  patch: (next: Partial<QrState>) => void;
}

export function ContentTypePanel({ state, patch }: Props) {
  const { t } = useI18n();

  return (
    <section className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t("qr.section.content")}</h2>
      <div
        role="tablist"
        aria-label={t("qr.section.content")}
        className="grid grid-cols-4 gap-2 sm:grid-cols-7"
      >
        {TYPES.map((item) => {
          const Icon = item.icon;
          const selected = state.type === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => patch({ type: item.id })}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-xs font-medium transition-colors",
                selected
                  ? "bg-accent text-accent-foreground shadow-[0_0_0_1.5px_var(--primary)]"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {t(item.label)}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {state.type === "url" ? (
          <Field label={t("qr.url.label")} htmlFor="qr-url">
            <div className="relative">
              <Input
                id="qr-url"
                type="url"
                inputMode="url"
                autoComplete="url"
                value={state.url}
                placeholder={t("qr.url.placeholder")}
                onChange={(e) => patch({ url: e.target.value })}
                className="pr-10"
              />
              {state.url ? (
                <button
                  type="button"
                  aria-label={t("common.close")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => patch({ url: "" })}
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </Field>
        ) : null}

        {state.type === "text" ? (
          <Field label={t("qr.text.label")} htmlFor="qr-text">
            <Textarea
              id="qr-text"
              value={state.text}
              placeholder={t("qr.text.placeholder")}
              onChange={(e) => patch({ text: e.target.value })}
              rows={6}
            />
          </Field>
        ) : null}

        {state.type === "contact" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("qr.contact.first")} htmlFor="qr-fn">
              <Input
                id="qr-fn"
                value={state.contact.firstName}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, firstName: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.contact.last")} htmlFor="qr-ln">
              <Input
                id="qr-ln"
                value={state.contact.lastName}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, lastName: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.contact.company")} htmlFor="qr-org">
              <Input
                id="qr-org"
                value={state.contact.company}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, company: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.contact.phone")} htmlFor="qr-cphone">
              <Input
                id="qr-cphone"
                type="tel"
                value={state.contact.phone}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, phone: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.contact.email")} htmlFor="qr-cemail">
              <Input
                id="qr-cemail"
                type="email"
                value={state.contact.email}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, email: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.contact.website")} htmlFor="qr-cweb">
              <Input
                id="qr-cweb"
                value={state.contact.website}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, website: e.target.value } })
                }
              />
            </Field>
          </div>
        ) : null}

        {state.type === "wifi" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("qr.wifi.ssid")} htmlFor="qr-ssid">
              <Input
                id="qr-ssid"
                value={state.wifi.ssid}
                onChange={(e) => patch({ wifi: { ...state.wifi, ssid: e.target.value } })}
              />
            </Field>
            <Field label={t("qr.wifi.password")} htmlFor="qr-wpass">
              <Input
                id="qr-wpass"
                type="password"
                autoComplete="off"
                disabled={state.wifi.encryption === "nopass"}
                value={state.wifi.password}
                onChange={(e) =>
                  patch({ wifi: { ...state.wifi, password: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.wifi.encryption")} htmlFor="qr-enc">
              <Select
                value={state.wifi.encryption}
                onValueChange={(v) =>
                  patch({
                    wifi: {
                      ...state.wifi,
                      encryption: v as QrState["wifi"]["encryption"],
                    },
                  })
                }
              >
                <SelectTrigger id="qr-enc">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">{t("qr.wifi.wpa")}</SelectItem>
                  <SelectItem value="WEP">{t("qr.wifi.wep")}</SelectItem>
                  <SelectItem value="nopass">{t("qr.wifi.none")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-end pb-2">
              <label className="flex min-h-11 items-center gap-3 text-sm">
                <Switch
                  checked={state.wifi.hidden}
                  onCheckedChange={(v) => patch({ wifi: { ...state.wifi, hidden: v } })}
                />
                {t("qr.wifi.hidden")}
              </label>
            </div>
          </div>
        ) : null}

        {state.type === "email" ? (
          <div className="grid gap-3">
            <Field label={t("qr.email.to")} htmlFor="qr-eto">
              <Input
                id="qr-eto"
                type="email"
                value={state.email.to}
                onChange={(e) => patch({ email: { ...state.email, to: e.target.value } })}
              />
            </Field>
            <Field label={t("qr.email.subject")} htmlFor="qr-esub">
              <Input
                id="qr-esub"
                value={state.email.subject}
                onChange={(e) =>
                  patch({ email: { ...state.email, subject: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.email.body")} htmlFor="qr-ebody">
              <Textarea
                id="qr-ebody"
                value={state.email.body}
                onChange={(e) => patch({ email: { ...state.email, body: e.target.value } })}
                rows={4}
              />
            </Field>
          </div>
        ) : null}

        {state.type === "phone" ? (
          <Field label={t("qr.phone.label")} htmlFor="qr-phone">
            <Input
              id="qr-phone"
              type="tel"
              value={state.phone}
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </Field>
        ) : null}

        {state.type === "sms" ? (
          <div className="grid gap-3">
            <Field label={t("qr.sms.phone")} htmlFor="qr-sphone">
              <Input
                id="qr-sphone"
                type="tel"
                value={state.sms.phone}
                onChange={(e) => patch({ sms: { ...state.sms, phone: e.target.value } })}
              />
            </Field>
            <Field label={t("qr.sms.body")} htmlFor="qr-sbody">
              <Textarea
                id="qr-sbody"
                value={state.sms.message}
                onChange={(e) => patch({ sms: { ...state.sms, message: e.target.value } })}
                rows={4}
              />
            </Field>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
