import { ChevronDown, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n";
import type { ErrorCorrection, QrState } from "../state";

interface Props {
  state: QrState;
  patch: (next: Partial<QrState>) => void;
}

export function ExtraOptions({ state, patch }: Props) {
  const { t } = useI18n();

  return (
    <section className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t("qr.section.extra")}</h2>
      <div className="grid gap-4">
        <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
          <span>{t("qr.caption")}</span>
          <Switch
            checked={state.captionEnabled}
            onCheckedChange={(v) => patch({ captionEnabled: v })}
          />
        </label>
        {state.captionEnabled ? (
          <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
            <Input
              value={state.caption}
              placeholder={t("qr.caption.placeholder")}
              onChange={(e) => patch({ caption: e.target.value })}
            />
            <Select
              value={state.captionFont}
              onValueChange={(captionFont) => patch({ captionFont })}
            >
              <SelectTrigger aria-label={t("qr.caption.font")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Plus Jakarta Sans">Jakarta</SelectItem>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="system-ui">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5">
            {t("qr.svgQuality")}
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground" aria-label={t("qr.svgQuality.hint")}>
                  <HelpCircle className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">{t("qr.svgQuality.hint")}</TooltipContent>
            </Tooltip>
          </span>
          <Switch
            checked={state.highQualitySvg}
            onCheckedChange={(v) =>
              patch({ highQualitySvg: v, exportFormat: v ? "svg" : "png" })
            }
          />
        </label>

        <Collapsible>
          <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between rounded-xl bg-muted/50 px-3 text-sm font-medium">
            {t("qr.section.advanced")}
            <ChevronDown className="size-4 text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent className="grid gap-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="qr-ecc">{t("qr.ecc")}</Label>
              <Select
                value={state.errorCorrection}
                onValueChange={(v) => patch({ errorCorrection: v as ErrorCorrection })}
              >
                <SelectTrigger id="qr-ecc">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">L — 7%</SelectItem>
                  <SelectItem value="M">M — 15%</SelectItem>
                  <SelectItem value="Q">Q — 25%</SelectItem>
                  <SelectItem value="H">H — 30%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="qr-margin">{t("qr.margin")}</Label>
              <Input
                id="qr-margin"
                type="number"
                min={0}
                max={16}
                value={state.margin}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) patch({ margin: Math.min(16, Math.max(0, n)) });
                }}
              />
            </div>
            <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
              <span>{t("qr.quiet")}</span>
              <Switch
                checked={state.quietZone}
                onCheckedChange={(v) => patch({ quietZone: v })}
              />
            </label>
            <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
              <span>{t("qr.transparent")}</span>
              <Switch
                checked={state.transparentBackground}
                onCheckedChange={(v) => patch({ transparentBackground: v })}
              />
            </label>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}
