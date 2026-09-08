import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Braces, Check, ChevronRight, Clipboard, Download, FileDown, Fingerprint, Hash,
  Info, KeyRound, Lock, QrCode, Share2, Star, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import "./uuid-generator.css";

type Format = "standard" | "upper" | "compact";

function secureUuid() {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new Error("Secure UUID generation is not supported in this browser.");
  }
  return crypto.randomUUID();
}

function formatUuid(uuid: string, format: Format) {
  if (format === "upper") return uuid.toUpperCase();
  if (format === "compact") return uuid.replaceAll("-", "");
  return uuid;
}

export function UuidGeneratorPage() {
  const [amount, setAmount] = useState(1);
  const [format, setFormat] = useState<Format>("standard");
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
      const next = Array.from({ length: count }, () => formatUuid(secureUuid(), format));
      setUuids(next);
      setAmount(count);
      recordHistory({
        toolId: "uuid-generator",
        title: `UUID v4: ${count} шт.`,
        params: { amount: String(count), format },
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
    const content = extension === "csv" ? `UUID\n${uuids.join("\n")}` : uuids.join("\n");
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
    <div className="uuid-generator pb-10">
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

      <header className="mb-6 grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="flex gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"><Fingerprint className="size-7" /></span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">Генератор UUID</h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Создавайте уникальные идентификаторы UUID v4. Быстро, удобно и полностью в браузере.</p>
          </div>
        </div>
        <aside className="flex gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-800 dark:bg-accent dark:text-accent-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>UUID создаются прямо в браузере. Данные не отправляются на сервер.</p>
        </aside>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(18rem,.86fr)_minmax(0,1.14fr)]">
        <section className="surface-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Настройки генерации</h2>
          <div className="mt-5">
            <span className="text-sm font-semibold">Версия UUID</span>
            <div className="uuid-version-grid mt-2">
              <button type="button" className="uuid-version is-active"><strong>UUID v4</strong><small>Случайный</small></button>
              <span className="uuid-version is-disabled"><strong>v1</strong><small>Скоро</small></span>
              <span className="uuid-version is-disabled"><strong>v3</strong><small>Скоро</small></span>
              <span className="uuid-version is-disabled"><strong>v5</strong><small>Скоро</small></span>
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
                <option value="upper">Верхний регистр</option>
                <option value="compact">Без дефисов</option>
              </select>
              <span className="text-xs font-normal text-muted-foreground">{format === "compact" ? "32 символа без дефисов" : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"}</span>
            </label>
          </div>
          <div className="uuid-safe-note mt-5"><Lock className="size-4" /><span><strong>Только безопасная генерация.</strong> Используется криптографический API вашего браузера.</span></div>
          <Button size="lg" className="mt-6 w-full" onClick={generate}><Fingerprint />Сгенерировать UUID</Button>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Результат</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{uuids.length ? `Создано: ${uuids.length} UUID` : "Пока нет UUID"}</span>
              <Button variant="outline" size="sm" disabled={!uuids.length} onClick={() => setUuids([])}><Trash2 />Очистить</Button>
            </div>
          </div>
          <div className="uuid-result mt-5">
            {current ? <code>{current}</code> : <p>Настройте формат и нажмите «Сгенерировать UUID».</p>}
            {current && <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button onClick={() => void copy(current, "current")}>{copied === "current" ? <Check /> : <Clipboard />}{copied === "current" ? "Скопировано" : "Копировать"}</Button>
              <Button variant="outline" onClick={() => void copy(uuids.join("\n"), "all")}><Clipboard />Скопировать все</Button>
              <Button variant="outline" onClick={() => exportList("txt")}><Download />TXT</Button>
              <Button variant="outline" onClick={() => exportList("csv")}><FileDown />CSV</Button>
            </div>}
          </div>
          <div className="mt-6">
            <h3 className="font-semibold">Список сгенерированных UUID {uuids.length ? `(${uuids.length})` : ""}</h3>
            <div className="uuid-list mt-3">
              {uuids.length ? uuids.map((uuid, index) => <div className="uuid-row" key={`${uuid}-${index}`}><span>{index + 1}</span><code>{uuid}</code><Button aria-label="Скопировать UUID" size="icon-sm" variant="ghost" onClick={() => void copy(uuid, uuid)}>{copied === uuid ? <Check /> : <Clipboard />}</Button><Button aria-label="Удалить UUID" size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setUuids((all) => all.filter((_, i) => i !== index))}><Trash2 /></Button></div>) : <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">Здесь появится список после генерации.</p>}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[.85fr_1fr_1.2fr]">
        <section className="surface-card p-5 sm:p-6"><div className="uuid-section-heading"><Info /><h2 className="text-lg font-semibold">Информация</h2></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">UUID — это 128-битный уникальный идентификатор. Версия v4 создаётся из криптографически случайных данных и подходит для идентификаторов в приложениях, базах данных и API.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">Работает без сервера <ChevronRight className="size-4" /></span></section>
        <section className="surface-card p-5 sm:p-6"><div className="uuid-section-heading"><Braces /><h2 className="text-lg font-semibold">Где пригодится UUID</h2></div><ul className="uuid-uses mt-3 text-sm text-muted-foreground"><li>Записи в базах данных и API</li><li>Идентификаторы пользователей и сессий</li><li>Имена файлов и тестовые данные</li><li>Микросервисы и интеграции</li></ul></section>
        <section className="surface-card p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div className="uuid-section-heading"><Hash /><h2 className="text-lg font-semibold">Похожие инструменты</h2></div><Link to="/tools" className="text-xs font-medium text-primary hover:underline">Смотреть все</Link></div><div className="uuid-related mt-4"><Link to="/tools/$slug" params={{ slug: "qr-generator" }}><span className="bg-blue-100 text-blue-600"><QrCode /></span><strong>Генератор QR</strong><small>Ссылки и текст</small></Link><Link to="/tools/$slug" params={{ slug: "password-generator" }}><span className="bg-violet-100 text-violet-600"><KeyRound /></span><strong>Пароли</strong><small>Скоро</small></Link><Link to="/tools/$slug" params={{ slug: "base64" }}><span className="bg-emerald-100 text-emerald-600"><Braces /></span><strong>Base64</strong><small>Скоро</small></Link></div></section>
      </div>
    </div>
  );
}
