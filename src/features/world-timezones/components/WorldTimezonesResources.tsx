import { useState } from "react";
import { BookOpen, ChevronDown, CircleHelp, Lightbulb } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const infoKeys = ["utc", "iana", "dst", "meeting"] as const;
const faqKeys = ["difference", "dst", "accuracy", "meeting", "travel"] as const;
const tipKeys = ["city", "date", "work", "dst", "calendar"] as const;

export function WorldTimezonesResources() {
  const { t } = useI18n();
  const [open, setOpen] = useState({ info: false, faq: false, tips: false });
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <section className="wt-resources" aria-labelledby="wt-resources-title">
      <div className="wt-resources-heading">
        <h2 id="wt-resources-title">{t("worldTime.resourcesTitle")}</h2>
        <span>{t("worldTime.resourcesSubtitle")}</span>
      </div>
      <div className="wt-resource-grid">
        <article className="wt-resource-card">
          <button
            type="button"
            onClick={() => setOpen((current) => ({ ...current, info: !current.info }))}
            aria-expanded={open.info}
          >
            <span className="wt-resource-title">
              <BookOpen />
              <span>
                <b>{t("worldTime.infoTitle")}</b>
                <small>{t("worldTime.infoSubtitle")}</small>
              </span>
            </span>
            <ChevronDown className={open.info ? "open" : ""} />
          </button>
          {open.info && (
            <div className="wt-resource-content">
              {infoKeys.map((key) => (
                <div className="wt-info-item" key={key}>
                  <h3>{t(`worldTime.info.${key}.title`)}</h3>
                  <p>{t(`worldTime.info.${key}.text`)}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="wt-resource-card">
          <button
            type="button"
            onClick={() => setOpen((current) => ({ ...current, faq: !current.faq }))}
            aria-expanded={open.faq}
          >
            <span className="wt-resource-title">
              <CircleHelp />
              <span>
                <b>{t("worldTime.faqTitle")}</b>
                <small>{t("worldTime.faqSubtitle")}</small>
              </span>
            </span>
            <ChevronDown className={open.faq ? "open" : ""} />
          </button>
          {open.faq && (
            <div className="wt-resource-content wt-faq-list">
              {faqKeys.map((key, index) => (
                <div className="wt-faq-item" key={key}>
                  <button
                    type="button"
                    onClick={() => setFaq(faq === index ? null : index)}
                    aria-expanded={faq === index}
                  >
                    <span>{t(`worldTime.faq.${key}.question`)}</span>
                    <ChevronDown className={faq === index ? "open" : ""} />
                  </button>
                  {faq === index && <p>{t(`worldTime.faq.${key}.answer`)}</p>}
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="wt-resource-card">
          <button
            type="button"
            onClick={() => setOpen((current) => ({ ...current, tips: !current.tips }))}
            aria-expanded={open.tips}
          >
            <span className="wt-resource-title">
              <Lightbulb />
              <span>
                <b>{t("worldTime.tipsTitle")}</b>
                <small>{t("worldTime.tipsSubtitle")}</small>
              </span>
            </span>
            <ChevronDown className={open.tips ? "open" : ""} />
          </button>
          {open.tips && (
            <div className="wt-resource-content wt-tips-list">
              {tipKeys.map((key, index) => (
                <div key={key}>
                  <span>{index + 1}</span>
                  <p>
                    <b>{t(`worldTime.tip.${key}.title`)}</b>
                    {t(`worldTime.tip.${key}.text`)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
