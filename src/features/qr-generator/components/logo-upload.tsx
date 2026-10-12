import { ImagePlus, Trash2, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { PRESET_LOGOS, svgToDataUrl } from "../preset-logos";
import { clampLogoSize, type QrState } from "../state";

interface Props {
  state: QrState;
  patch: (next: Partial<QrState>) => void;
}

const ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml,.svg";

export function LogoUpload({ state, patch }: Props) {
  const { t, locale } = useI18n();

  const labels = {
    ru: {
      presetsTitle: "Готовые логотипы популярных сервисов",
      uploadCustom: "Или загрузите свой файл",
    },
    uz: {
      presetsTitle: "Ommabop xizmatlarning tayyor logotiplari",
      uploadCustom: "Yoki o‘zingizning faylingizni yuklang",
    },
    en: {
      presetsTitle: "Pre-set Popular Service Logos",
      uploadCustom: "Or upload your custom logo",
    },
  }[locale as "ru" | "uz" | "en"] || {
    presetsTitle: "Pre-set Popular Service Logos",
    uploadCustom: "Or upload your custom logo",
  };

  function onFile(file: File | undefined) {
    if (!file) return;
    const ok =
      /image\/(png|jpeg|jpg|webp|svg\+xml)/.test(file.type) ||
      /\.(png|jpe?g|webp|svg)$/i.test(file.name);
    if (!ok || file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      patch({
        logoEnabled: true,
        logoDataUrl: String(reader.result),
        logoName: file.name,
        typeBadge: false,
      });
    };
    reader.readAsDataURL(file);
  }

  function selectPreset(preset: (typeof PRESET_LOGOS)[number]) {
    patch({
      logoEnabled: true,
      logoDataUrl: svgToDataUrl(preset.svg),
      logoName: preset.name,
      typeBadge: false,
    });
  }

  return (
    <div className="grid gap-5">
      <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
        <span>{t("qr.logo.enable")}</span>
        <Switch
          checked={state.logoEnabled}
          onCheckedChange={(v) => patch({ logoEnabled: v })}
        />
      </label>

      {/* Preset Logos Library */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          {labels.presetsTitle}
        </h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {PRESET_LOGOS.map((p) => {
            const isSelected = state.logoEnabled && state.logoName === p.name;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPreset(p)}
                className={`relative group flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                    : "border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                }`}
                title={p.name}
              >
                <div
                  className="size-7 flex items-center justify-center shrink-0 [&_svg]:size-7 [&_svg]:max-w-full [&_svg]:max-h-full"
                  dangerouslySetInnerHTML={{ __html: p.svg }}
                />
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-full mt-1.5">
                  {p.name}
                </span>
                {isSelected && (
                  <div className="absolute top-1 right-1 size-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom File Upload */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          {labels.uploadCustom}
        </h4>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-muted/50 px-4 py-6 text-sm text-muted-foreground hover:bg-muted transition-colors border border-dashed border-slate-300 dark:border-slate-700">
          <ImagePlus className="size-6 text-slate-500" />
          <span className="font-medium text-foreground">{t("qr.logo.upload")}</span>
          <span className="text-xs text-muted-foreground">{t("qr.logo.hint")}</span>
          <input
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      {/* Currently Selected Logo Preview and controls */}
      {state.logoDataUrl ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <img
            src={state.logoDataUrl}
            alt=""
            className="size-12 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-800"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
              {state.logoName || "Логотип"}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ECC High (30%) включён автоматически
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            aria-label={t("qr.logo.remove")}
            onClick={() =>
              patch({
                logoDataUrl: null,
                logoEnabled: false,
                logoName: "",
                typeBadge: true,
              })
            }
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="grid gap-2">
        <div className="flex items-center justify-between text-sm">
          <Label>{t("qr.logo.size")}</Label>
          <span className="tabular-nums text-muted-foreground font-semibold">
            {Math.round(clampLogoSize(state.logoSize) * 100)}%
          </span>
        </div>
        <Slider
          min={8}
          max={28}
          step={1}
          value={[Math.round(clampLogoSize(state.logoSize) * 100)]}
          onValueChange={([v]) => patch({ logoSize: (v ?? 18) / 100, logoEnabled: true })}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between text-sm">
          <Label>{t("qr.logo.padding")}</Label>
          <span className="tabular-nums text-muted-foreground font-semibold">
            {Math.round(state.logoPadding * 100)}%
          </span>
        </div>
        <Slider
          min={0}
          max={40}
          step={1}
          value={[Math.round(state.logoPadding * 100)]}
          onValueChange={([v]) => patch({ logoPadding: (v ?? 18) / 100 })}
        />
      </div>
    </div>
  );
}
