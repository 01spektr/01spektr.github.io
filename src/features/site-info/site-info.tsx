import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CircleHelp,
  Code2,
  Lightbulb,
  Mail,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { localeHomePath, localizedInfoPath } from "@/lib/i18n/config";
import { getToolBySlug } from "@/lib/tools/catalog";
import { seoHead } from "@/lib/seo";
import "./site-info.css";

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "azatspektr88@gmail.com";
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "";

type RequestType = "new-tool" | "improvement" | "bug" | "custom" | "other";

const requestTypes: RequestType[] = ["new-tool", "improvement", "bug", "custom", "other"];

export function aboutHead(locale: "ru" | "en" | "uz") {
  const copy = {
    ru: {
      title: "О нас — Toolboxi.uz",
      description:
        "Toolboxi.uz создаёт бесплатные онлайн-инструменты и разрабатывает индивидуальные веб-решения для работы и бизнеса.",
      path: "/ru/about",
    },
    en: {
      title: "About us — Toolboxi.uz",
      description:
        "Toolboxi.uz builds free online tools and custom web solutions for work, business and everyday tasks.",
      path: "/about",
    },
    uz: {
      title: "Biz haqimizda — Toolboxi.uz",
      description:
        "Toolboxi.uz ish, biznes va kundalik vazifalar uchun bepul onlayn vositalar va individual veb-yechimlar yaratadi.",
      path: "/uz/about",
    },
  }[locale];
  return seoHead({
    ...copy,
    alternates: [
      { hrefLang: "en", href: "https://toolboxi.uz/about/" },
      { hrefLang: "ru", href: "https://toolboxi.uz/ru/about/" },
      { hrefLang: "uz", href: "https://toolboxi.uz/uz/about/" },
      { hrefLang: "x-default", href: "https://toolboxi.uz/about/" },
    ],
  });
}

export function contactHead(locale: "ru" | "en" | "uz") {
  const copy = {
    ru: {
      title: "Обратная связь — Toolboxi.uz",
      description:
        "Предложите новый инструмент, сообщите об ошибке или закажите индивидуальное веб-решение у Toolboxi.uz.",
      path: "/ru/contact",
    },
    en: {
      title: "Contact and feedback — Toolboxi.uz",
      description:
        "Suggest a new tool, report a problem or request a custom web solution from Toolboxi.uz.",
      path: "/contact",
    },
    uz: {
      title: "Aloqa va takliflar — Toolboxi.uz",
      description:
        "Yangi vosita taklif qiling, xato haqida xabar bering yoki Toolboxi.uz’dan individual veb-yechim buyurtma qiling.",
      path: "/uz/contact",
    },
  }[locale];
  return seoHead({
    ...copy,
    alternates: [
      { hrefLang: "en", href: "https://toolboxi.uz/contact/" },
      { hrefLang: "ru", href: "https://toolboxi.uz/ru/contact/" },
      { hrefLang: "uz", href: "https://toolboxi.uz/uz/contact/" },
      { hrefLang: "x-default", href: "https://toolboxi.uz/contact/" },
    ],
  });
}

export function AboutPage() {
  const { locale, t } = useI18n();
  const contactPath = localizedInfoPath("contact", locale);

  return (
    <div className="site-info-page tool-page-frame">
      <nav className="site-info-breadcrumbs" aria-label={t("breadcrumb.home")}>
        <Link to={localeHomePath(locale)}>{t("breadcrumb.home")}</Link>
        <span>/</span>
        <span>{t("about.crumb")}</span>
      </nav>

      <section className="about-hero">
        <div className="about-hero-copy">
          <span className="site-info-eyebrow">
            <Sparkles /> {t("about.eyebrow")}
          </span>
          <h1>{t("about.title")}</h1>
          <p>{t("about.lead")}</p>
          <div className="about-actions">
            <Button asChild size="lg">
              <a href={contactPath}>
                {t("about.cta")} <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/tools">{t("about.tools")}</Link>
            </Button>
          </div>
        </div>
        <div className="about-hero-mark" aria-hidden="true">
          <img src="/toolboxi_uz_logo.svg" alt="" />
          <div><Code2 /><Wrench /><Lightbulb /></div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-mission-title">
        <div className="about-section-heading">
          <span>{t("about.missionKicker")}</span>
          <h2 id="about-mission-title">{t("about.missionTitle")}</h2>
          <p>{t("about.missionText")}</p>
        </div>
        <div className="about-principles">
          {([
            [<BadgeCheck key="icon" />, "simple"],
            [<ShieldCheck key="icon" />, "private"],
            [<Sparkles key="icon" />, "useful"],
          ] as const).map(([icon, key]) => (
            <article key={key}>
              <span>{icon}</span>
              <h3>{t(`about.principle.${key}.title`)}</h3>
              <p>{t(`about.principle.${key}.text`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-work-grid" aria-label={t("about.workTitle")}>
        <article className="about-work-card">
          <div className="about-work-icon"><MessageSquareText /></div>
          <div>
            <span>{t("about.publicLabel")}</span>
            <h2>{t("about.publicTitle")}</h2>
            <p>{t("about.publicText")}</p>
          </div>
        </article>
        <article className="about-work-card featured">
          <div className="about-work-icon"><BriefcaseBusiness /></div>
          <div>
            <span>{t("about.customLabel")}</span>
            <h2>{t("about.customTitle")}</h2>
            <p>{t("about.customText")}</p>
          </div>
        </article>
      </section>

      <section className="about-contact-band">
        <div>
          <span className="site-info-eyebrow"><CircleHelp /> {t("about.ideaKicker")}</span>
          <h2>{t("about.ideaTitle")}</h2>
          <p>{t("about.ideaText")}</p>
        </div>
        <Button asChild size="lg">
          <a href={contactPath}>{t("about.ideaAction")} <ArrowRight /></a>
        </Button>
      </section>
    </div>
  );
}

export function ContactPage() {
  const { locale, t } = useI18n();
  const [requestType, setRequestType] = useState<RequestType>("new-tool");
  const [toolSlug, setToolSlug] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "email">("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedType = params.get("type");
    if (requestTypes.includes(selectedType as RequestType)) setRequestType(selectedType as RequestType);
    setToolSlug(params.get("tool") || "");
  }, []);

  const tool = useMemo(() => (toolSlug ? getToolBySlug(toolSlug) : undefined), [toolSlug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      type: requestType,
      typeLabel: t(`contact.type.${requestType}`),
      tool: tool?.name[locale] || toolSlug,
      message: String(data.get("message") || ""),
      locale,
      page: window.location.href,
    };

    setStatus("sending");
    if (CONTACT_ENDPOINT) {
      try {
        const response = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Contact endpoint returned ${response.status}`);
        form.reset();
        setRequestType("new-tool");
        setStatus("success");
      } catch {
        setStatus("error");
      }
      return;
    }

    const subject = `[Toolboxi.uz] ${payload.typeLabel}${payload.tool ? ` — ${payload.tool}` : ""}`;
    const body = [
      `${t("contact.name")}: ${payload.name}`,
      `${t("contact.email")}: ${payload.email}`,
      `${t("contact.topic")}: ${payload.typeLabel}`,
      payload.tool ? `${t("contact.tool")}: ${payload.tool}` : "",
      "",
      payload.message,
    ].filter(Boolean).join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("email");
  }

  return (
    <div className="site-info-page contact-page tool-page-frame">
      <nav className="site-info-breadcrumbs" aria-label={t("breadcrumb.home")}>
        <Link to={localeHomePath(locale)}>{t("breadcrumb.home")}</Link>
        <span>/</span>
        <span>{t("contact.crumb")}</span>
      </nav>

      <header className="contact-heading">
        <span className="site-info-eyebrow"><MessageSquareText /> {t("contact.eyebrow")}</span>
        <h1>{t("contact.title")}</h1>
        <p>{t("contact.lead")}</p>
      </header>

      <div className="contact-layout">
        <aside className="contact-guide">
          <h2>{t("contact.helpTitle")}</h2>
          <p>{t("contact.helpText")}</p>
          <ul>
            {(["tool", "improvement", "bug", "custom"] as const).map((key) => (
              <li key={key}><CheckCircle2 /><span>{t(`contact.help.${key}`)}</span></li>
            ))}
          </ul>
          <div className="contact-note">
            <ShieldCheck />
            <div><b>{t("contact.privacyTitle")}</b><p>{t("contact.privacyText")}</p></div>
          </div>
        </aside>

        <form className="contact-form" onSubmit={submit}>
          <div className="contact-form-heading">
            <div className="about-work-icon"><Mail /></div>
            <div><h2>{t("contact.formTitle")}</h2><p>{t("contact.formText")}</p></div>
          </div>

          <label>
            <span>{t("contact.topic")}</span>
            <select value={requestType} onChange={(event) => setRequestType(event.target.value as RequestType)}>
              {requestTypes.map((type) => <option value={type} key={type}>{t(`contact.type.${type}`)}</option>)}
            </select>
          </label>

          <div className="contact-fields-row">
            <label><span>{t("contact.name")}</span><Input name="name" autoComplete="name" required placeholder={t("contact.namePlaceholder")} /></label>
            <label><span>{t("contact.email")}</span><Input name="email" type="email" autoComplete="email" required placeholder="name@example.com" /></label>
          </div>

          {tool && (
            <div className="contact-tool-context">
              <Wrench /> <span>{t("contact.tool")}: <b>{tool.name[locale]}</b></span>
            </div>
          )}

          <label>
            <span>{t("contact.message")}</span>
            <Textarea name="message" required minLength={20} maxLength={4000} placeholder={t("contact.messagePlaceholder")} />
            <small>{t("contact.messageHint")}</small>
          </label>

          <label className="contact-consent">
            <input type="checkbox" required />
            <span>{t("contact.consent")}</span>
          </label>

          {status !== "idle" && (
            <div className={`contact-status ${status}`} role="status">
              {status === "sending" && t("contact.sending")}
              {status === "success" && t("contact.success")}
              {status === "error" && t("contact.error")}
              {status === "email" && t("contact.emailOpened")}
            </div>
          )}

          <Button type="submit" size="lg" disabled={status === "sending"}>
            <Send /> {status === "sending" ? t("contact.sending") : t("contact.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function ToolFeedbackPrompt({ slug }: { slug: string }) {
  const { locale, t } = useI18n();
  const href = `${localizedInfoPath("contact", locale)}?type=improvement&tool=${encodeURIComponent(slug)}`;
  return (
    <aside className="tool-feedback-prompt tool-page-frame">
      <span><Lightbulb /></span>
      <div><b>{t("feedback.title")}</b><p>{t("feedback.text")}</p></div>
      <Button asChild variant="outline"><a href={href}>{t("feedback.action")} <ArrowRight /></a></Button>
    </aside>
  );
}

