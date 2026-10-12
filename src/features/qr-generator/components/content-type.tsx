import type { ReactNode } from "react";
import {
  Link2,
  Share2,
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
import type { MessageKey } from "@/lib/i18n/messages";
import { PRESET_LOGOS, svgToDataUrl } from "../preset-logos";
import type { QrContentType, QrState, SocialPlatform } from "../state";

const TYPES: { id: QrContentType; icon: typeof Link2; label: MessageKey }[] = [
  { id: "url", icon: Link2, label: "qr.type.url" },
  { id: "social", icon: Share2, label: "qr.type.social" },
  { id: "text", icon: Type, label: "qr.type.text" },
  { id: "contact", icon: Users, label: "qr.type.contact" },
  { id: "wifi", icon: Wifi, label: "qr.type.wifi" },
  { id: "email", icon: Mail, label: "qr.type.email" },
  { id: "phone", icon: Phone, label: "qr.type.phone" },
  { id: "sms", icon: MessageCircle, label: "qr.type.sms" },
];

const SOCIAL_LIST: { id: SocialPlatform; name: string; placeholder: string; prefix: string }[] = [
  { id: "telegram", name: "Telegram", placeholder: "username или t.me/...", prefix: "t.me/" },
  { id: "instagram", name: "Instagram", placeholder: "username или instagram.com/...", prefix: "instagram.com/" },
  { id: "youtube", name: "YouTube", placeholder: "@channel или ссылка", prefix: "youtube.com/@" },
  { id: "whatsapp", name: "WhatsApp", placeholder: "+998901234567", prefix: "wa.me/" },
  { id: "tiktok", name: "TikTok", placeholder: "@username", prefix: "tiktok.com/@" },
  { id: "vk", name: "VK", placeholder: "id или username", prefix: "vk.com/" },
  { id: "linkedin", name: "LinkedIn", placeholder: "in/username", prefix: "linkedin.com/in/" },
  { id: "twitter", name: "X / Twitter", placeholder: "@handle", prefix: "x.com/" },
  { id: "github", name: "GitHub", placeholder: "username", prefix: "github.com/" },
];

interface Props {
  state: QrState;
  patch: (next: Partial<QrState>) => void;
}

export function ContentTypePanel({ state, patch }: Props) {
  const { t, locale } = useI18n();

  const typeTips: Record<QrContentType, { ru: string; uz: string; en: string }> = {
    url: {
      ru: "Введите полный веб-адрес (URL). Сканирование сразу откроет сайт в браузере.",
      uz: "To'liq veb-manzilni (URL) kiriting. Skanerlanganda brauzerda sayt darhol ochiladi.",
      en: "Enter a complete website URL. Scanning directly opens the page in a browser.",
    },
    social: {
      ru: "Прямой QR-код на ваш аккаунт или канал. Автоматически вставит логотип соцсети в центр кода!",
      uz: "Ijtimoiy tarmoqdagi sahifangizga to'g'ridan-to'g'ri QR-kod. Markazga tegishli logotipni avtomatik joylaydi!",
      en: "Direct link to your social profile or channel. Automatically embeds the official logo into the QR center!",
    },
    text: {
      ru: "Любой произвольный текст, пароль, заметка или инструкция до 1000 символов.",
      uz: "Ixtiyoriy matn, parol, eslatma yoki 1000 belgigacha bo'lgan ko'rsatma.",
      en: "Any plain text, password, note, or instructions up to 1,000 characters.",
    },
    contact: {
      ru: "Электронная визитка vCard: камера смартфона предложит в 1 клик сохранить контакт в телефонную книгу.",
      uz: "Elektron vCard vizitkasi: smartfon kamerasi kontaktni telefon kitobchasiga 1 bosishda saqlashni taklif qiladi.",
      en: "Electronic vCard contact: camera scans prompt to save directly to address book in one tap.",
    },
    wifi: {
      ru: "Мгновенное подключение к Wi-Fi: при сканировании смартфон сам подключится к сети без ввода пароля.",
      uz: "Wi-Fi tarmog'iga tezkor ulanish: skanerlanganda smartfon parolsiz darhol ulanadi.",
      en: "Instant Wi-Fi setup: scanning prompts the device to join the network without typing passwords.",
    },
    email: {
      ru: "Шаблон письма: откроет почтовую программу с уже заполненным адресом, темой и сообщением.",
      uz: "Xat andozasi: pochta dasturini kiritilgan manzil, mavzu va xabar bilan ochadi.",
      en: "Pre-filled email: opens the default email client with recipient, subject, and body ready.",
    },
    phone: {
      ru: "Номер телефона: при сканировании смартфон сразу наберёт номер или откроет экран вызова.",
      uz: "Telefon raqami: skanerlanganda smartfon darhol raqamni terish ekranini ochadi.",
      en: "Phone number: scanning launches dialer with the number ready to call.",
    },
    sms: {
      ru: "SMS-сообщение: откроет приложение сообщений с указанным номером и готовым текстом.",
      uz: "SMS-xabar: ko'rsatilgan raqam va tayyor matn bilan xabarlar dasturini ochadi.",
      en: "SMS text message: opens messenger with phone number and pre-composed message.",
    },
  };

  const currentTip = typeTips[state.type]?.[locale as "ru" | "uz" | "en"] || typeTips[state.type]?.ru;

  function selectSocialPlatform(platform: SocialPlatform) {
    const matchingPreset = PRESET_LOGOS.find((p) => p.id === platform);
    const updates: Partial<QrState> = { socialPlatform: platform };
    if (matchingPreset && (!state.logoEnabled || !state.logoDataUrl || PRESET_LOGOS.some((p) => p.name === state.logoName))) {
      updates.logoEnabled = true;
      updates.logoDataUrl = svgToDataUrl(matchingPreset.svg);
      updates.logoName = matchingPreset.name;
      updates.typeBadge = false;
    }
    patch(updates);
  }

  const currentSocialMeta = SOCIAL_LIST.find((s) => s.id === state.socialPlatform) || SOCIAL_LIST[0];

  return (
    <section className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t("qr.section.content")}</h2>
      <div
        role="tablist"
        aria-label={t("qr.section.content")}
        className="grid grid-cols-4 gap-2 sm:grid-cols-8"
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
                "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-xs font-medium transition-colors cursor-pointer",
                selected
                  ? "bg-accent text-accent-foreground shadow-[0_0_0_1.5px_var(--primary)] font-bold"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="truncate max-w-full">{t(item.label)}</span>
            </button>
          );
        })}
      </div>

      {/* Helpful context guidance banner for current content type */}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 px-3.5 py-2.5 text-xs text-blue-900 dark:text-blue-200">
        <p className="leading-relaxed font-medium">
          {currentTip}
        </p>
      </div>

      <div className="mt-4">
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

        {state.type === "social" ? (
          <div className="grid gap-4">
            <div>
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                {locale === "ru" ? "Выберите социальную сеть или мессенджер" : locale === "uz" ? "Ijtimoiy tarmoq yoki messenjerni tanlang" : "Choose platform"}
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {SOCIAL_LIST.map((soc) => {
                  const isSel = state.socialPlatform === soc.id;
                  const logoObj = PRESET_LOGOS.find((l) => l.id === soc.id);
                  return (
                    <button
                      key={soc.id}
                      type="button"
                      onClick={() => selectSocialPlatform(soc.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSel
                          ? "border-primary bg-primary/10 font-bold text-primary shadow-xs ring-2 ring-primary/30"
                          : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      {logoObj && (
                        <div
                          className="size-6 mb-1 [&_svg]:size-6"
                          dangerouslySetInnerHTML={{ __html: logoObj.svg }}
                        />
                      )}
                      <span className="truncate max-w-full text-[11px]">{soc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Field
              label={`${currentSocialMeta.name} — ${locale === "ru" ? "Имя пользователя или ссылка" : locale === "uz" ? "Foydalanuvchi nomi yoki havola" : "Username or URL"}`}
              htmlFor="qr-social-username"
            >
              <div className="relative">
                <Input
                  id="qr-social-username"
                  value={state.socialUsername}
                  placeholder={`Например: @username или ${currentSocialMeta.placeholder}`}
                  onChange={(e) => patch({ socialUsername: e.target.value })}
                  className="pr-10"
                />
                {state.socialUsername ? (
                  <button
                    type="button"
                    aria-label={t("common.close")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                    onClick={() => patch({ socialUsername: "" })}
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
            </Field>
          </div>
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
                placeholder={t("qr.contact.first.placeholder")}
                value={state.contact.firstName}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, firstName: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.contact.last")} htmlFor="qr-ln">
              <Input
                id="qr-ln"
                placeholder={t("qr.contact.last.placeholder")}
                value={state.contact.lastName}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, lastName: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.contact.company")} htmlFor="qr-org">
              <Input
                id="qr-org"
                placeholder={t("qr.contact.company.placeholder")}
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
                placeholder={t("qr.contact.phone.placeholder")}
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
                placeholder={t("qr.contact.email.placeholder")}
                value={state.contact.email}
                onChange={(e) =>
                  patch({ contact: { ...state.contact, email: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.contact.website")} htmlFor="qr-cweb">
              <Input
                id="qr-cweb"
                placeholder={t("qr.contact.website.placeholder")}
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
                placeholder={t("qr.wifi.ssid.placeholder")}
                value={state.wifi.ssid}
                onChange={(e) => patch({ wifi: { ...state.wifi, ssid: e.target.value } })}
              />
            </Field>
            <Field label={t("qr.wifi.password")} htmlFor="qr-wpass">
              <Input
                id="qr-wpass"
                type="password"
                autoComplete="off"
                placeholder={t("qr.wifi.password.placeholder")}
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
                placeholder={t("qr.email.to.placeholder")}
                value={state.email.to}
                onChange={(e) => patch({ email: { ...state.email, to: e.target.value } })}
              />
            </Field>
            <Field label={t("qr.email.subject")} htmlFor="qr-esub">
              <Input
                id="qr-esub"
                placeholder={t("qr.email.subject.placeholder")}
                value={state.email.subject}
                onChange={(e) =>
                  patch({ email: { ...state.email, subject: e.target.value } })
                }
              />
            </Field>
            <Field label={t("qr.email.body")} htmlFor="qr-ebody">
              <Textarea
                id="qr-ebody"
                placeholder={t("qr.email.body.placeholder")}
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
              placeholder={t("qr.phone.placeholder")}
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
                placeholder={t("qr.sms.phone.placeholder")}
                value={state.sms.phone}
                onChange={(e) => patch({ sms: { ...state.sms, phone: e.target.value } })}
              />
            </Field>
            <Field label={t("qr.sms.body")} htmlFor="qr-sbody">
              <Textarea
                id="qr-sbody"
                placeholder={t("qr.sms.body.placeholder")}
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
