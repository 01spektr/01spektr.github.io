import type { ReactNode } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { copyQrPng, downloadQr } from "../export";
import { SIZE_PRESETS, type ExportFormat, type QrState } from "../state";

interface Props {
  state: QrState;
  patch: (next: Partial<QrState>) => void;
  svg: string;
  disabled: boolean;
  onUsed: () => void;
  preview: ReactNode;
}

const FORMATS: ExportFormat[] = ["png", "svg", "jpg", "webp"];

export function ExportControls({ state, patch, svg, disabled, onUsed, preview }: Props) {
  const { t } = useI18n();
  const sizeValue = SIZE_PRESETS.includes(state.size as (typeof SIZE_PRESETS)[number])
    ? String(state.size)
    : "custom";

  async function handleDownload() {
    if (!svg || disabled) return;
    const format = state.highQualitySvg ? "svg" : state.exportFormat;
    try {
      await downloadQr(
        svg,
        format,
        state.size,
        state.backgroundColor,
        state.transparentBackground,
      );
      onUsed();
    } catch {
      toast.error(t("qr.error"));
    }
  }

  async function handleCopy() {
    if (!svg || disabled) return;
    try {
      await copyQrPng(svg, state.size, state.backgroundColor, state.transparentBackground);
      toast.success(t("qr.copy.ok"));
      onUsed();
    } catch {
      toast.error(t("qr.copy.fail"));
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{t("qr.preview")}</p>
        <Select
          value={sizeValue}
          onValueChange={(v) => {
            if (v === "custom") {
              const raw = window.prompt(t("qr.customSize"), String(state.size));
              const n = Number(raw);
              if (Number.isFinite(n) && n >= 128 && n <= 4096) patch({ size: Math.round(n) });
              return;
            }
            patch({ size: Number(v) });
          }}
        >
          <SelectTrigger className="h-9 w-[9.5rem] text-xs" aria-label={t("qr.size")}>
            <SelectValue placeholder={t("qr.size")} />
          </SelectTrigger>
          <SelectContent>
            {SIZE_PRESETS.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {t("qr.size")}: {s} × {s}
              </SelectItem>
            ))}
            <SelectItem value="custom">
              {t("qr.size.custom")}
              {sizeValue === "custom" ? ` (${state.size})` : ""}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {preview}

      <Button
        size="lg"
        className="h-12 w-full text-[15px]"
        disabled={disabled}
        onClick={() => void handleDownload()}
      >
        <Download className="size-4" />
        {t("qr.download")}
      </Button>
      <Button
        variant="outline"
        className="h-11 w-full"
        disabled={disabled}
        onClick={() => void handleCopy()}
      >
        <Copy className="size-4" />
        {t("qr.copy")}
      </Button>
      <div className="grid grid-cols-4 gap-2">
        {FORMATS.map((fmt) => {
          const active = state.exportFormat === fmt;
          return (
            <button
              key={fmt}
              type="button"
              onClick={() => patch({ exportFormat: fmt, highQualitySvg: fmt === "svg" })}
              className={cn(
                "h-10 rounded-xl text-xs font-semibold uppercase",
                active
                  ? "bg-accent text-accent-foreground shadow-[0_0_0_1.5px_var(--primary)]"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {fmt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
