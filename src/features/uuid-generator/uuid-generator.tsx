import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Download,
  FileDown,
  FileText,
  Fingerprint,
  Hash,
  Info,
  KeyRound,
  Lock,
  QrCode,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ToolIcon } from "@/components/tool-icon";
import { Button } from "@/components/ui/button";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { useI18n } from "@/lib/i18n";
import "./uuid-generator.css";

type Format = "standard" | "compact";

function secureUuid() {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new Error("Secure UUID generation is not supported in this browser.");
  }
  return crypto.randomUUID();
}

function formatUuid(uuid: string, format: Format) {
  if (format === "compact") return uuid.replaceAll("-", "");
  return uuid;
}

export function UuidGeneratorPage() {
  const { locale, t } = useI18n();
  const tr = (ru: string, en: string) => (locale === "ru" ? ru : en);
  const [amount, setAmount] = useState(1);
  const [format, setFormat] = useState<Format>("standard");
  const [uppercase, setUppercase] = useState(false);
  const [timestamp, setTimestamp] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setFav(isFavorite("uuid-generator"));
    sync();
    return subscribeFavorites(sync);
  }, []);

  useEffect(() => {
    try {
      setUuids([secureUuid()]);
    } catch {
      // The generation button retains the explanatory error for unsupported browsers.
    }
  }, []);

  function generate() {
    const count = Math.min(100, Math.max(1, Number.isFinite(amount) ? Math.round(amount) : 1));
    try {
      const next = Array.from({ length: count }, () => {
        const uuid = formatUuid(secureUuid(), format);
        return uppercase ? uuid.toUpperCase() : uuid;
      });
      setUuids(next);
      setAmount(count);
      recordHistory({
        toolId: "uuid-generator",
        title: `UUID v4: ${count} ${tr("шт.", "items")}`,
        params: { amount: String(count), format, uppercase: String(uppercase) },
      });
      toast.success(count === 1 ? tr("UUID создан", "UUID created") : tr(`Создано UUID: ${count}`, `UUIDs created: ${count}`));
    } catch {
      toast.error(tr("В этом браузере недоступна безопасная генерация UUID.", "Secure UUID generation is unavailable in this browser."));
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1400);
      toast.success(tr("Скопировано в буфер обмена", "Copied to clipboard"));
    } catch {
      toast.error(tr("Не удалось скопировать. Выделите текст вручную.", "Could not copy. Select the text manually."));
    }
  }

  function exportList(extension: "txt" | "csv") {
    if (!uuids.length) return;
    const createdAt = timestamp ? `${tr("Создано", "Created")}: ${new Date().toLocaleString(locale === "ru" ? "ru-RU" : "en-US")}\n` : "";
    const content =
      extension === "csv" ? `UUID\n${uuids.join("\n")}` : `${createdAt}${uuids.join("\n")}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `toolbox-uuid-v4.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function onShare() {
    const result = await shareUrl(
      buildShareUrl("/tools/uuid-generator", new URLSearchParams()),
      tr("Генератор UUID", "UUID generator"),
    );
    if (result === "copied") toast.success(t("share.copied"));
    if (result === "failed") toast.error(t("share.failed"));
  }

  const current = uuids[0];
  return (
    <div className="uuid-generator uuid-reference-layout tool-page-frame pb-10">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link to={locale === "en" ? "/en" : "/"} className="hover:text-foreground">
            {t("breadcrumb.home")}
          </Link>
          <ChevronRight className="size-3.5" />
          <Link
            to="/categories/$id"
            params={{ id: "developers" }}
            className="hover:text-foreground"
          >
            {tr("Для разработчиков", "For developers")}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{tr("Генератор UUID", "UUID generator")}</span>
        </nav>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setFav(toggleFavorite("uuid-generator"))}
            aria-pressed={fav}
          >
            <Star className={fav ? "fill-primary text-primary" : ""} />
            {fav ? t("fav.remove") : t("fav.add")}
          </Button>
          <Button variant="outline" onClick={() => void onShare()}>
            <Share2 />
            {t("share")}
          </Button>
        </div>
      </div>

      <header className="uuid-page-header mb-7 grid gap-4 lg:grid-cols-[1fr_28.75rem] lg:items-start">
        <div className="flex gap-4">
          <ToolIcon
            tool={{ slug: "uuid-generator", icon: "Fingerprint" }}
            size="hero"
            className="uuid-title-icon"
          />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-[1.75rem]">
              {tr("Генератор UUID", "UUID generator")}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {tr("Создавайте уникальные идентификаторы UUID разных версий. Быстро. Удобно. Бесплатно.", "Create unique UUID identifiers in your browser. Fast, convenient and free.")}
            </p>
          </div>
        </div>
        <aside className="uuid-privacy-tip flex gap-3 rounded-2xl px-5 py-4 text-sm leading-relaxed">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>{tr("UUID создаются прямо в браузере. Данные не отправляются на сервер.", "UUIDs are generated in your browser. No data is sent to a server.")}</p>
        </aside>
      </header>

      <div className="uuid-main-grid grid items-start gap-4 xl:grid-cols-[minmax(20rem,.43fr)_minmax(0,.57fr)]">
        <section className="uuid-panel uuid-settings-panel surface-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold">{tr("Настройки генерации", "Generation settings")}</h2>
          <div className="mt-5">
            <span className="text-sm font-semibold">{tr("Версия UUID", "UUID version")}</span>
            <div className="uuid-version-grid mt-2">
              <button type="button" className="uuid-version is-active">
                <strong>UUID v4</strong>
                <small>{tr("Случайный", "Random")}</small>
              </button>
              <span className="uuid-version is-disabled">
                <strong>UUID v1</strong>
                <small>{tr("По времени", "Time-based")}</small>
              </span>
              <span className="uuid-version is-disabled">
                <strong>UUID v3</strong>
                <small>{tr("На основе имени (MD5)", "Name-based (MD5)")}</small>
              </span>
              <span className="uuid-version is-disabled">
                <strong>UUID v5</strong>
                <small>{tr("На основе имени (SHA-1)", "Name-based (SHA-1)")}</small>
              </span>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              {tr("Количество UUID", "Number of UUIDs")}
              <input
                className="uuid-field"
                type="number"
                min="1"
                max="100"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
              <span className="text-xs font-normal text-muted-foreground">{tr("От 1 до 100 за раз", "From 1 to 100 at a time")}</span>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              {tr("Формат вывода", "Output format")}
              <select
                className="uuid-field"
                value={format}
                onChange={(event) => setFormat(event.target.value as Format)}
              >
                <option value="standard">{tr("Стандартный", "Standard")}</option>
                <option value="compact">{tr("Без дефисов", "Without hyphens")}</option>
              </select>
              <span className="text-xs font-normal text-muted-foreground">
                {format === "compact"
                  ? tr("32 символа без дефисов", "32 characters without hyphens")
                  : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"}
              </span>
            </label>
          </div>
          <div className="uuid-options mt-5">
            <div className="uuid-options-title">
              <span>
                <Fingerprint />
                {tr("Дополнительные параметры", "Additional options")}
              </span>
              <ChevronDown className="size-4 rotate-180" />
            </div>
            <div className="uuid-switch-row">
              <button
                type="button"
                role="switch"
                aria-checked={uppercase}
                className={uppercase ? "uuid-switch is-on" : "uuid-switch"}
                onClick={() => setUppercase((value) => !value)}
              >
                <span />
              </button>
              <span>{tr("Преобразовать в верхний регистр (UUID)", "Convert UUID to uppercase")}</span>
            </div>
            <div className="uuid-switch-row">
              <button
                type="button"
                role="switch"
                aria-checked={timestamp}
                className={timestamp ? "uuid-switch is-on" : "uuid-switch"}
                onClick={() => setTimestamp((value) => !value)}
              >
                <span />
              </button>
              <span>{tr("Добавить время создания в экспорт", "Add creation time to export")}</span>
            </div>
          </div>
          <Button size="lg" className="uuid-generate-button mt-5 w-full" onClick={generate}>
            <Fingerprint />
            {tr("Сгенерировать UUID", "Generate UUID")}
          </Button>
        </section>

        <section className="uuid-panel uuid-result-panel surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{tr("Результат", "Result")}</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{uuids.length ? tr(`Создано: ${uuids.length} UUID`, `Created: ${uuids.length} UUID`) : tr("Пока нет UUID", "No UUIDs yet")}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={!uuids.length}
                onClick={() => setUuids([])}
              >
                <Trash2 />
                {tr("Очистить", "Clear")}
              </Button>
            </div>
          </div>
          <div className="uuid-result mt-5">
            <span className="uuid-result-file">
              <FileText />
            </span>
            {current ? (
              <code>{current}</code>
            ) : (
              <p>{tr("Настройте формат и нажмите «Сгенерировать UUID».", "Choose a format and click “Generate UUID”.")}</p>
            )}
            {current && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button onClick={() => void copy(current, "current")}>
                  {copied === "current" ? <Check /> : <Clipboard />}
                  {copied === "current" ? tr("Скопировано", "Copied") : tr("Копировать", "Copy")}
                </Button>
                <Button variant="outline" onClick={() => void copy(uuids.join("\n"), "all")}>
                  <Clipboard />
                  {tr("Скопировать все", "Copy all")}
                </Button>
                <Button variant="outline" onClick={() => exportList("txt")}>
                  <ChevronDown />
                  {tr("Другие форматы", "Other formats")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info(tr("QR-код для UUID добавим следующим шагом.", "UUID QR code support is coming next."))}
                >
                  <QrCode />
                  QR-код
                </Button>
              </div>
            )}
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">
                {tr("Список сгенерированных UUID", "Generated UUID list")} {uuids.length ? `(${uuids.length})` : ""}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportList("csv")}
                disabled={!uuids.length}
              >
                <FileDown />
                {tr("Экспорт", "Export")}
                <ChevronDown />
              </Button>
            </div>
            <div className="uuid-list mt-3">
              {uuids.length ? (
                uuids.map((uuid, index) => (
                  <div className="uuid-row" key={`${uuid}-${index}`}>
                    <span>{index + 1}</span>
                    <code>{uuid}</code>
                    <Button
                      aria-label={tr("Скопировать UUID", "Copy UUID")}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => void copy(uuid, uuid)}
                    >
                      {copied === uuid ? <Check /> : <Clipboard />}
                    </Button>
                    <Button
                      aria-label={tr("Удалить UUID", "Delete UUID")}
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setUuids((all) => all.filter((_, i) => i !== index))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  {tr("Здесь появится список после генерации.", "Generated UUIDs will appear here.")}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="uuid-bottom-grid mt-4 grid gap-4 lg:grid-cols-[1fr_.83fr_1.1fr]">
        <section className="uuid-bottom-card surface-card p-5 sm:p-6">
          <div className="uuid-section-heading">
            <Info />
            <h2 className="text-lg font-semibold">{tr("Информация", "Information")}</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {tr("UUID (Universally Unique Identifier) — это 128-битный уникальный идентификатор, который используется в программировании, базах данных и различных системах.", "A UUID (Universally Unique Identifier) is a 128-bit identifier used in software, databases and distributed systems.")}
          </p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary">
            {tr("Узнать больше", "Learn more")} <ChevronRight className="size-4" />
          </span>
        </section>
        <section className="uuid-bottom-card surface-card p-5 sm:p-6">
          <div className="uuid-section-heading">
            <Braces />
            <h2 className="text-lg font-semibold">{tr("Примеры использования", "Use cases")}</h2>
          </div>
          <ul className="uuid-uses mt-4 text-sm text-muted-foreground">
            <li>{tr("Уникальные идентификаторы в базах данных", "Unique database identifiers")}</li>
            <li>{tr("Идентификаторы пользователей", "User identifiers")}</li>
            <li>{tr("API и микросервисы", "APIs and microservices")}</li>
            <li>{tr("Файловые имена", "File names")}</li>
            <li>{tr("Токены и сессии", "Tokens and sessions")}</li>
            <li>{tr("Тестовые данные", "Test data")}</li>
          </ul>
        </section>
        <section className="uuid-bottom-card surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="uuid-section-heading">
              <Hash />
              <h2 className="text-lg font-semibold">{tr("Похожие инструменты", "Related tools")}</h2>
            </div>
            <Link to="/tools" className="text-xs font-medium text-primary hover:underline">
              {tr("Смотреть все", "View all")} <ChevronRight className="inline size-3" />
            </Link>
          </div>
          <div className="uuid-related mt-5">
            <Link to="/tools/$slug" params={{ slug: "password-generator" }}>
              <span className="bg-violet-100 text-violet-600">
                <KeyRound />
              </span>
              <strong>{tr("Генератор паролей", "Password generator")}</strong>
              <small>{tr("Надёжные пароли", "Secure passwords")}</small>
            </Link>
            <Link to="/tools/$slug" params={{ slug: "base64" }}>
              <span className="bg-emerald-100 text-emerald-600">
                <Hash />
              </span>
              <strong>{tr("Генератор хэшей", "Hash generator")}</strong>
              <small>{tr("MD5, SHA и др.", "MD5, SHA and more")}</small>
            </Link>
            <Link to="/tools/$slug" params={{ slug: "qr-generator" }}>
              <span className="bg-blue-100 text-blue-600">
                <QrCode />
              </span>
              <strong>{tr("Генератор QR-кодов", "QR code generator")}</strong>
              <small>{tr("Ссылки, текст, Wi‑Fi", "Links, text, Wi‑Fi")}</small>
            </Link>
            <Link to="/tools/$slug" params={{ slug: "json-formatter" }}>
              <span className="bg-orange-100 text-orange-600">
                <Braces />
              </span>
              <strong>{tr("Конвертер данных", "Data converter")}</strong>
              <small>JSON, XML, Base64</small>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
