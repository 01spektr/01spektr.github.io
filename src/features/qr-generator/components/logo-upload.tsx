import { ImagePlus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { clampLogoSize, type QrState } from "../state";

interface Props {
  state: QrState;
  patch: (next: Partial<QrState>) => void;
}

const ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml,.svg";

export function LogoUpload({ state, patch }: Props) {
  const { t } = useI18n();

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

  return (
    <div className="grid gap-4">
      <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
        <span>{t("qr.logo.enable")}</span>
        <Switch
          checked={state.logoEnabled}
          onCheckedChange={(v) => patch({ logoEnabled: v })}
        />
      </label>
      <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
        <span>{t("qr.logo.badge")}</span>
        <Switch
          checked={state.typeBadge && !(state.logoEnabled && state.logoDataUrl)}
          disabled={state.logoEnabled && Boolean(state.logoDataUrl)}
          onCheckedChange={(v) => patch({ typeBadge: v })}
        />
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-muted/50 px-4 py-8 text-sm text-muted-foreground hover:bg-muted">
        <ImagePlus className="size-6" />
        <span className="font-medium text-foreground">{t("qr.logo.upload")}</span>
        <span>{t("qr.logo.hint")}</span>
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

      {state.logoDataUrl ? (
        <div className="flex items-center gap-3">
          <img
            src={state.logoDataUrl}
            alt=""
            className="size-14 rounded-xl object-contain shadow-[var(--shadow-border)]"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{state.logoName || "logo"}</p>
            <p className="text-xs text-muted-foreground">{t("qr.logo.tooBig")}</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
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
          <span className="tabular-nums text-muted-foreground">
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
          <span className="tabular-nums text-muted-foreground">
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
