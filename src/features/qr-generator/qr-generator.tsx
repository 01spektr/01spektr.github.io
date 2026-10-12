import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
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
import { QrHeroBanner } from "./components/HeroBanner";
import { QrMetricsCards } from "./components/MetricsCards";
import { copyQrPng } from "./export";
import { payloadLabel } from "./payload";
import { deserializeQrState, historyParams, serializeQrState } from "./serializer";
import { defaultQrState, type QrState } from "./state";
import { useQrModel } from "./use-qr-model";
import "./qr-generator.css";

export function QrGeneratorPage() {
  const { t } = useI18n();
  const [state, setState] = useState<QrState>(() => defaultQrState());
  const [fav, setFav] = useState(false);
  const restored = useRef(false);
  const { svg, empty, error, contrast, payload } = useQrModel(state);

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

  const handleCopyQr = useCallback(async () => {
    if (!svg || disabled) return;
    try {
      await copyQrPng(svg, state.size, state.backgroundColor, state.transparentBackground);
      toast.success(t("qr.copy.ok"));
      persistUse();
    } catch {
      toast.error(t("qr.copy.fail"));
    }
  }, [svg, disabled, state.size, state.backgroundColor, state.transparentBackground, t, persistUse]);

  return (
    <div className="w-full max-w-[1380px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 text-slate-800 dark:text-slate-100 font-body transition-colors duration-200">
      {/* 1. Sleek Global Hero Banner */}
      <QrHeroBanner
        fav={fav}
        onToggleFav={() => setFav(toggleFavorite("qr-generator"))}
        onShare={onShare}
      />

      {/* 2. Top Metric Cards */}
      <div className="mb-6">
        <QrMetricsCards
          state={state}
          payloadLength={payload.length}
          contrast={contrast}
          error={error}
          empty={empty}
          onCopyAll={handleCopyQr}
        />
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left column: Controls & Customization */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5 min-w-0">
          <ContentTypePanel state={state} patch={patch} />
          <DesignSettings state={state} patch={patch} contrast={contrast} />
          <ExtraOptions state={state} patch={patch} />
        </div>

        {/* Right column: Live Preview & Export */}
        <aside className="lg:col-span-5 xl:col-span-4 surface-card min-w-0 p-5 lg:sticky lg:top-20">
          <ExportControls
            state={state}
            patch={patch}
            svg={svg}
            disabled={disabled}
            onUsed={persistUse}
            preview={<QrPreview svg={svg} empty={empty} error={error} contrast={contrast} />}
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

      {/* 4. Examples Gallery */}
      <div className="mt-8">
        <Examples onApply={patch} />
      </div>
    </div>
  );
}
