import React from "react";
import {
  BookOpenCheck,
  ChevronDown,
  CircleCheck,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

type ContentTranslations = {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  how: {
    title: string;
    summary: string;
    steps: Array<{ title: string; description: string }>;
    methodologyTitle: string;
    methodology: string;
  };
  tips: {
    title: string;
    summary: string;
    items: string[];
  };
  faq: {
    title: string;
    summary: string;
    items: Array<{ question: string; answer: string }>;
  };
};

interface InfoSectionsProps {
  content: ContentTranslations;
}

const sectionIcons = {
  how: BookOpenCheck,
  tips: Lightbulb,
  faq: HelpCircle,
};

function SectionHeader({
  type,
  title,
  summary,
}: {
  type: keyof typeof sectionIcons;
  title: string;
  summary: string;
}) {
  const Icon = sectionIcons[type];
  return (
    <summary className="currency-info-summary">
      <span className={`currency-info-icon currency-info-icon-${type}`}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="currency-info-title">{title}</span>
        <span className="currency-info-description">{summary}</span>
      </span>
      <ChevronDown className="currency-info-chevron size-5" aria-hidden="true" />
    </summary>
  );
}

export const InfoSections: React.FC<InfoSectionsProps> = ({ content }) => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="currency-info-section" aria-labelledby="currency-info-heading">
      <div className="currency-info-heading">
        <span className="currency-info-kicker">{content.sectionLabel}</span>
        <h2 id="currency-info-heading">{content.sectionTitle}</h2>
        <p>{content.sectionDescription}</p>
      </div>

      <div className="currency-info-grid">
        <details className="currency-info-card">
          <SectionHeader type="how" title={content.how.title} summary={content.how.summary} />
          <div className="currency-info-body">
            <ol className="currency-steps">
              {content.how.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="currency-step-number">{index + 1}</span>
                  <span>
                    <strong>{step.title}</strong>
                    <span>{step.description}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="currency-methodology">
              <ShieldCheck className="size-5" aria-hidden="true" />
              <span>
                <strong>{content.how.methodologyTitle}</strong>
                <span>{content.how.methodology}</span>
              </span>
            </div>
          </div>
        </details>

        <details className="currency-info-card">
          <SectionHeader type="tips" title={content.tips.title} summary={content.tips.summary} />
          <div className="currency-info-body">
            <ul className="currency-tips">
              {content.tips.items.map((item) => (
                <li key={item}>
                  <CircleCheck className="size-4" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <details className="currency-info-card">
          <SectionHeader type="faq" title={content.faq.title} summary={content.faq.summary} />
          <div className="currency-info-body currency-faq-list">
            {content.faq.items.map((item) => (
              <details className="currency-faq-item" key={item.question}>
                <summary>
                  <span>{item.question}</span>
                  <ChevronDown className="currency-faq-chevron size-4" aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </details>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </section>
  );
};
