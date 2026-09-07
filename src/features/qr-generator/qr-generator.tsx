import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Lock, QrCode, Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { ContentTypePanel } from "./components/content-type";
import { DesignSettings } from "./components/design-settings";
import { Examples } from "./components/examples";
import { ExportControls } from "./components/export-controls";
import { ExtraOptions } from "./components/extra-options";
import { QrPreview } from "./components/qr-preview";
import { payloadLabel } from "./payload";
import { deserializeQrState, historyParams, serializeQrState } from "./serializer";
import { defaultQrState, type QrState } from "./state";
import { useQrModel } from "./use-qr-model";
import "./qr-generator.css";

export function QrGeneratorPage() {
  const { t, locale } = useI18n();
  const [state, setState] = useState<QrState>(() => defaultQrState());
  const [fav, setFav] = useState(false);
  const restored = useRef(false);
  const { svg, empty, error, contrast } = useQrModel(state);

  const patch = useCallback((next: Partial<QrState>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const params = new URLSearchParams(window.location.search);
    if ([...params.keys()].length === 0) return;
    const fromUrl = deserializeQrState(params);
    setState((prev) => ({
      ...prev,
      ...fromUrl,
      contact: fromUrl.contact ?? prev.contact,
      wifi: fromUrl.wifi ?? prev.wifi,
      email: fromUrl.email ?? prev.email,
      sms: fromUrl.sms ?? prev.sms,
    }));
  }, []);

  useEffect(() => {
    const sync = () => setFav(isFavorite("qr-generator"));
    sync();
    return subscribeFavorites(sync);
  }, []);

  const sharePath = useMemo(() => {
    const params = serializeQrState(state);
    return buildShareUrl("/tools/qr-generator", params);
  }, [state]);

  const persistUse = useCallback(() => {
    if (empty) return;
    recordHistory({
      toolId: "qr-generator",
      title: t("qr.hist", { label: payloadLabel(state) }),
      params: historyParams(state),
    });
  }, [empty, state, t]);

  async function onShare() {
    const result = await shareUrl(sharePath, t("qr.title"));
    if (result === "copied") toast.success(t("share.copied"));
    if (result === "failed") toast.error(t("share.failed"));
    persistUse();
  }

  const disabled = empty || error === "overflow";
  const categoryName = locale === "ru" ? "Дизайн и полиграфия" : "Design & print";

  return (
    <div className="qr-generator pb-10">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            {t("breadcrumb.home")}
          </Link>
          <ChevronRight className="size-3.5" />
          <Link to="/categories/$id" params={{ id: "design-print" }} className="hover:text-foreground">
            {categoryName}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{t("qr.crumb")}</span>
        </nav>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setFav(toggleFavorite("qr-generator"))}
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

      <header className="mb-6 grid gap-4 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="flex gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#6d5ef6] text-primary-foreground">
            <QrCode className="size-7" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
              {t("qr.title")}
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t("qr.subtitle")}
            </p>
          </div>
        </div>
        <aside className="rounded-2xl bg-[#eef0ff] px-4 py-3 text-sm text-[#4c3fd4] dark:bg-accent dark:text-accent-foreground">
          <p className="font-medium leading-relaxed">{t("qr.tip")}</p>
        </aside>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <div className="grid gap-5">
          <ContentTypePanel state={state} patch={patch} />
          <DesignSettings state={state} patch={patch} contrast={contrast} />
          <ExtraOptions state={state} patch={patch} />
        </div>

        <aside className="surface-card p-5 lg:sticky lg:top-20">
          <ExportControls
            state={state}
            patch={patch}
            svg={svg}
            disabled={disabled}
            onUsed={persistUse}
            preview={
              <QrPreview svg={svg} empty={empty} error={error} contrast={contrast} />
            }
          />
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/60 px-3 py-3 text-xs leading-relaxed text-muted-foreground">
            <Lock className="mt-0.5 size-3.5 shrink-0" />
            <p>
              <span className="font-medium text-foreground">{t("qr.privacyTitle")}. </span>
              {t("qr.privacyBody")}
            </p>
          </div>
        </aside>
      </div>

      <Examples onApply={patch} />
    </div>
  );
}
