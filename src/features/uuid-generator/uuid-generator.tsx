import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Braces, Check, ChevronDown, ChevronRight, Clipboard, Download, FileDown, FileText,
  Fingerprint, Hash, Info, KeyRound, Lock, QrCode, Share2, Star, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
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
        title: `UUID v4: ${count} шт.`,
        params: { amount: String(count), format, uppercase: String(uppercase) },
      });
      toast.success(count === 1 ? "UUID создан" : `Создано UUID: ${count}`);
    } catch {
      toast.error("В этом браузере недоступна безопасная генерация UUID.");
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1400);
      toast.success("Скопировано в буфер обмена");
    } catch {
      toast.error("Не удалось скопировать. Выделите текст вручную.");
    }
  }

  function exportList(extension: "txt" | "csv") {
    if (!uuids.length) return;
    const createdAt = timestamp ? `Создано: ${new Date().toLocaleString("ru-RU")}\n` : "";
    const content = extension === "csv" ? `UUID\n${uuids.join("\n")}` : `${createdAt}${uuids.join("\n")}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `toolbox-uuid-v4.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function onShare() {
    const result = await shareUrl(buildShareUrl("/tools/uuid-generator", new URLSearchParams()), "Генератор UUID");
    if (result === "copied") toast.success("Ссылка скопирована");
    if (result === "failed") toast.error("Не удалось поделиться ссылкой");
  }

  const current = uuids[0];
  return (
    <div className="uuid-generator uuid-reference-layout pb-10">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <ChevronRight className="size-3.5" />
          <Link to="/categories/$id" params={{ id: "developers" }} className="hover:text-foreground">Для разработчиков</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">Генератор UUID</span>
        </nav>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setFav(toggleFavorite("uuid-generator"))} aria-pressed={fav}>
            <Star className={fav ? "fill-primary text-primary" : ""} />
            {fav ? "В избранном" : "В избранное"}
          </Button>
          <Button variant="outline" onClick={() => void onShare()}><Share2 />Поделиться</Button>
        </div>
      </div>

      <header className="uuid-page-header mb-7 grid gap-4 lg:grid-cols-[1fr_28.75rem] lg:items-start">
        <div className="flex gap-4">
          <span className="uuid-title-icon"><Braces className="size-7" /></span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">Генератор UUID</h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Создавайте уникальные идентификаторы UUID разных версий. Быстро. Удобно. Бесплатно.</p>
          </div>
        </div>
        <aside className="uuid-privacy-tip flex gap-3 rounded-2xl px-5 py-4 text-sm leading-relaxed">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>UUID создаются прямо в браузере. Данные не отправляются на сервер.</p>
        </aside>
      </header>

      <div className="uuid-main-grid grid items-start gap-4 xl:grid-cols-[minmax(20rem,.43fr)_minmax(0,.57fr)]">
        <section className="uuid-panel uuid-settings-panel surface-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Настройки генерации</h2>
          <div className="mt-5">
            <span className="text-sm font-semibold">Версия UUID</span>
            <div className="uuid-version-grid mt-2">
              <button type="button" className="uuid-version is-active"><strong>UUID v4</strong><small>Случайный</small></button>
              <span className="uuid-version is-disabled"><strong>UUID v1</strong><small>По времени</small></span>
              <span className="uuid-version is-disabled"><strong>UUID v3</strong><small>На основе имени (MD5)</small></span>
              <span className="uuid-version is-disabled"><strong>UUID v5</strong><small>На основе имени (SHA-1)</small></span>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">Количество UUID
              <input className="uuid-field" type="number" min="1" max="100" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
              <span className="text-xs font-normal text-muted-foreground">От 1 до 100 за раз</span>
            </label>
            <label className="grid gap-2 text-sm font-semibold">Формат вывода
              <select className="uuid-field" value={format} onChange={(event) => setFormat(event.target.value as Format)}>
                <option value="standard">Стандартный</option>
                <option value="compact">Без дефисов</option>
              </select>
              <span className="text-xs font-normal text-muted-foreground">{format === "compact" ? "32 символа без дефисов" : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"}</span>
            </label>
          </div>
          <div className="uuid-options mt-5">
            <div className="uuid-options-title"><span><Fingerprint />Дополнительные параметры</span><ChevronDown className="size-4 rotate-180" /></div>
            <div className="uuid-switch-row"><button type="button" role="switch" aria-checked={uppercase} className={uppercase ? "uuid-switch is-on" : "uuid-switch"} onClick={() => setUppercase((value) => !value)}><span /></button><span>Преобразовать в верхний регистр (UUID)</span></div>
            <div className="uuid-switch-row"><button type="button" role="switch" aria-checked={timestamp} className={timestamp ? "uuid-switch is-on" : "uuid-switch"} onClick={() => setTimestamp((value) => !value)}><span /></button><span>Добавить время создания в экспорт</span></div>
          </div>
          <Button size="lg" className="uuid-generate-button mt-5 w-full" onClick={generate}><Fingerprint />Сгенерировать UUID</Button>
        </section>

        <section className="uuid-panel uuid-result-panel surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Результат</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{uuids.length ? `Создано: ${uuids.length} UUID` : "Пока нет UUID"}</span>
              <Button variant="outline" size="sm" disabled={!uuids.length} onClick={() => setUuids([])}><Trash2 />Очистить</Button>
            </div>
          </div>
          <div className="uuid-result mt-5">
            <span className="uuid-result-file"><FileText /></span>
            {current ? <code>{current}</code> : <p>Настройте формат и нажмите «Сгенерировать UUID».</p>}
            {current && <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button onClick={() => void copy(current, "current")}>{copied === "current" ? <Check /> : <Clipboard />}{copied === "current" ? "Скопировано" : "Копировать"}</Button>
              <Button variant="outline" onClick={() => void copy(uuids.join("\n"), "all")}><Clipboard />Скопировать все</Button>
              <Button variant="outline" onClick={() => exportList("txt")}><ChevronDown />Другие форматы</Button>
              <Button variant="outline" onClick={() => toast.info("QR-код для UUID добавим следующим шагом.")}><QrCode />QR-код</Button>
            </div>}
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Список сгенерированных UUID {uuids.length ? `(${uuids.length})` : ""}</h3><Button variant="outline" size="sm" onClick={() => exportList("csv")} disabled={!uuids.length}><FileDown />Экспорт<ChevronDown /></Button></div>
            <div className="uuid-list mt-3">
              {uuids.length ? uuids.map((uuid, index) => <div className="uuid-row" key={`${uuid}-${index}`}><span>{index + 1}</span><code>{uuid}</code><Button aria-label="Скопировать UUID" size="icon-sm" variant="ghost" onClick={() => void copy(uuid, uuid)}>{copied === uuid ? <Check /> : <Clipboard />}</Button><Button aria-label="Удалить UUID" size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setUuids((all) => all.filter((_, i) => i !== index))}><Trash2 /></Button></div>) : <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">Здесь появится список после генерации.</p>}
            </div>
          </div>
        </section>
      </div>

      <div className="uuid-bottom-grid mt-4 grid gap-4 lg:grid-cols-[1fr_.83fr_1.1fr]">
        <section className="uuid-bottom-card surface-card p-5 sm:p-6"><div className="uuid-section-heading"><Info /><h2 className="text-lg font-semibold">Информация</h2></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">UUID (Universally Unique Identifier) — это 128-битный уникальный идентификатор, который используется в программировании, базах данных и различных системах.</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary">Узнать больше <ChevronRight className="size-4" /></span></section>
        <section className="uuid-bottom-card surface-card p-5 sm:p-6"><div className="uuid-section-heading"><Braces /><h2 className="text-lg font-semibold">Примеры использования</h2></div><ul className="uuid-uses mt-4 text-sm text-muted-foreground"><li>Уникальные идентификаторы в базах данных</li><li>Идентификаторы пользователей</li><li>API и микросервисы</li><li>Файловые имена</li><li>Токены и сессии</li><li>Тестовые данные</li></ul></section>
        <section className="uuid-bottom-card surface-card p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div className="uuid-section-heading"><Hash /><h2 className="text-lg font-semibold">Похожие инструменты</h2></div><Link to="/tools" className="text-xs font-medium text-primary hover:underline">Смотреть все <ChevronRight className="inline size-3" /></Link></div><div className="uuid-related mt-5"><Link to="/tools/$slug" params={{ slug: "password-generator" }}><span className="bg-violet-100 text-violet-600"><KeyRound /></span><strong>Генератор паролей</strong><small>Надёжные пароли</small></Link><Link to="/tools/$slug" params={{ slug: "base64" }}><span className="bg-emerald-100 text-emerald-600"><Hash /></span><strong>Генератор хэшей</strong><small>MD5, SHA и др.</small></Link><Link to="/tools/$slug" params={{ slug: "qr-generator" }}><span className="bg-blue-100 text-blue-600"><QrCode /></span><strong>Генератор QR-кодов</strong><small>Ссылки, текст, Wi‑Fi</small></Link><Link to="/tools/$slug" params={{ slug: "json-formatter" }}><span className="bg-orange-100 text-orange-600"><Braces /></span><strong>Конвертер данных</strong><small>JSON, XML, Base64</small></Link></div></section>
      </div>
    </div>
  );
}
