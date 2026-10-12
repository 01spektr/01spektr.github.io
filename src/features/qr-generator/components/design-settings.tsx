import { Check, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { COLOR_PRESETS, type QrState } from "../state";
import { DESIGN_PRESETS, type DesignPreset } from "../design-presets";
import type { ContrastLevel } from "../contrast";
import { LogoUpload } from "./logo-upload";

interface Props {
  state: QrState;
  patch: (next: Partial<QrState>) => void;
  contrast: ContrastLevel;
}

export function DesignSettings({ state, patch, contrast }: Props) {
  const { t, locale } = useI18n();

  const labels = {
    ru: {
      gradientToggle: "Градиент цвета",
      gradientColor2: "Второй цвет градиента",
      gradientType: "Тип градиента",
      linear: "Линейный",
      radial: "Радиальный",
      gradientAngle: "Угол градиента",
      customEyesToggle: "Отдельный цвет для углов (глаз)",
      eyeOuter: "Внешняя рамка угла",
      eyeInner: "Внутренняя точка угла",
      presetsTab: "Готовые стили",
      quickPresets: "Дизайнерские стили в 1 клик",
    },
    uz: {
      gradientToggle: "Rang gradienti",
      gradientColor2: "Ikkinchi gradient rangi",
      gradientType: "Gradient turi",
      linear: "Chiziqli",
      radial: "Radial",
      gradientAngle: "Gradient burchagi",
      customEyesToggle: "Burchaklar uchun alohida rang",
      eyeOuter: "Tashqi burchak ramkasi",
      eyeInner: "Ichki burchak nuqtasi",
      presetsTab: "Tayyor uslublar",
      quickPresets: "1 bosishda dizaynerlik uslublari",
    },
    en: {
      gradientToggle: "Color Gradient",
      gradientColor2: "Gradient End Color",
      gradientType: "Gradient Type",
      linear: "Linear",
      radial: "Radial",
      gradientAngle: "Gradient Angle",
      customEyesToggle: "Custom Eye Marker Colors",
      eyeOuter: "Eye Outer Frame",
      eyeInner: "Eye Inner Ball",
      presetsTab: "Style Presets",
      quickPresets: "1-Click Designer Styles",
    },
  }[locale as "ru" | "uz" | "en"] || {
    gradientToggle: "Color Gradient",
    gradientColor2: "Gradient End Color",
    gradientType: "Gradient Type",
    linear: "Linear",
    radial: "Radial",
    gradientAngle: "Gradient Angle",
    customEyesToggle: "Custom Eye Marker Colors",
    eyeOuter: "Eye Outer Frame",
    eyeInner: "Eye Inner Ball",
    presetsTab: "Style Presets",
    quickPresets: "1-Click Designer Styles",
  };

  function applyPreset(p: DesignPreset) {
    patch({
      dotStyle: p.dotStyle,
      eyeStyle: p.eyeStyle,
      foregroundColor: p.fg,
      gradientEnabled: p.gradientEnabled,
      gradientColor2: p.gradientColor2,
      gradientType: p.gradientType,
      gradientAngle: p.gradientAngle,
      customEyeColor: p.customEyeColor,
      eyeOuterColor: p.eyeOuterColor,
      eyeInnerColor: p.eyeInnerColor,
      backgroundColor: p.bg,
    });
  }

  return (
    <section className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t("qr.section.design")}</h2>
      <Tabs defaultValue="colors">
        <TabsList className="max-w-full overflow-x-auto">
          <TabsTrigger value="colors">{t("qr.tab.colors")}</TabsTrigger>
          <TabsTrigger value="presets">{labels.presetsTab}</TabsTrigger>
          <TabsTrigger value="logo">{t("qr.tab.logo")}</TabsTrigger>
          <TabsTrigger value="style">{t("qr.tab.style")}</TabsTrigger>
          <TabsTrigger value="shape">{t("qr.tab.shape")}</TabsTrigger>
          <TabsTrigger value="frame">{t("qr.tab.frame")}</TabsTrigger>
        </TabsList>

        {/* 1. Colors Tab (Single color, Gradients, Custom Eye colors) */}
        <TabsContent value="colors" className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              label={t("qr.fg")}
              value={state.foregroundColor}
              onChange={(foregroundColor) => patch({ foregroundColor })}
            />
            <ColorField
              label={t("qr.bg")}
              value={state.backgroundColor}
              onChange={(backgroundColor) => patch({ backgroundColor })}
            />
          </div>

          {/* Quick Color Swatches */}
          <div className="flex flex-wrap items-center gap-2.5">
            {COLOR_PRESETS.map((p) => {
              const active = state.foregroundColor.toLowerCase() === p.fg.toLowerCase();
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-label={p.id}
                  aria-pressed={active}
                  onClick={() => patch({ foregroundColor: p.fg, backgroundColor: p.bg })}
                  className={cn(
                    "relative size-9 rounded-full cursor-pointer transition-transform hover:scale-105",
                    active && "ring-2 ring-primary ring-offset-2 ring-offset-card scale-105",
                  )}
                  style={{ background: p.fg }}
                >
                  {active ? (
                    <Check className="absolute inset-0 m-auto size-4 text-primary-foreground" />
                  ) : null}
                </button>
              );
            })}
            <label className="relative size-9 cursor-pointer overflow-hidden rounded-full shadow-[var(--shadow-border)] transition-transform hover:scale-105">
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "conic-gradient(#ef4444,#f59e0b,#22c55e,#06b6d4,#3b82f6,#8b5cf6,#ef4444)",
                }}
              />
              <input
                type="color"
                aria-label={t("qr.fg")}
                className="absolute inset-0 cursor-pointer opacity-0"
                value={state.foregroundColor}
                onChange={(e) => patch({ foregroundColor: e.target.value })}
              />
            </label>
          </div>

          {/* Color Gradient Section (like QRCode Monkey) */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 space-y-3.5">
            <label className="flex items-center justify-between gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide cursor-pointer">
              <span>{labels.gradientToggle}</span>
              <Switch
                checked={state.gradientEnabled}
                onCheckedChange={(gradientEnabled) => patch({ gradientEnabled })}
              />
            </label>

            {state.gradientEnabled && (
              <div className="space-y-3 pt-2 border-t border-slate-200/70 dark:border-slate-800 animate-in fade-in duration-150">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ColorField
                    label={labels.gradientColor2}
                    value={state.gradientColor2}
                    onChange={(gradientColor2) => patch({ gradientColor2 })}
                  />
                  <div>
                    <Label className="text-xs font-medium block mb-2">{labels.gradientType}</Label>
                    <Select
                      value={state.gradientType}
                      onValueChange={(v) => patch({ gradientType: v as "linear" | "radial" })}
                    >
                      <SelectTrigger className="h-10 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">{labels.linear}</SelectItem>
                        <SelectItem value="radial">{labels.radial}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {state.gradientType === "linear" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{labels.gradientAngle}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{state.gradientAngle}°</span>
                    </div>
                    <Slider
                      min={0}
                      max={360}
                      step={15}
                      value={[state.gradientAngle]}
                      onValueChange={([a]) => patch({ gradientAngle: a })}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Custom Eye Colors Section (like QRCode Monkey) */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 space-y-3.5">
            <label className="flex items-center justify-between gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide cursor-pointer">
              <span>{labels.customEyesToggle}</span>
              <Switch
                checked={state.customEyeColor}
                onCheckedChange={(customEyeColor) => patch({ customEyeColor })}
              />
            </label>

            {state.customEyeColor && (
              <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-slate-200/70 dark:border-slate-800 animate-in fade-in duration-150">
                <ColorField
                  label={labels.eyeOuter}
                  value={state.eyeOuterColor}
                  onChange={(eyeOuterColor) => patch({ eyeOuterColor })}
                />
                <ColorField
                  label={labels.eyeInner}
                  value={state.eyeInnerColor}
                  onChange={(eyeInnerColor) => patch({ eyeInnerColor })}
                />
              </div>
            )}
          </div>

          {contrast !== "ok" ? (
            <p role="status" className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
              {t("qr.contrast.warn")}
            </p>
          ) : null}
        </TabsContent>

        {/* 2. Style Presets Tab (1-Click Templates like QRCode Monkey) */}
        <TabsContent value="presets" className="grid gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              {labels.quickPresets}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DESIGN_PRESETS.map((dp) => {
                const displayName = locale === "ru" ? dp.nameRu : locale === "uz" ? dp.nameUz : dp.name;
                const isMatching = state.foregroundColor.toLowerCase() === dp.fg.toLowerCase() && state.dotStyle === dp.dotStyle;
                return (
                  <button
                    key={dp.id}
                    type="button"
                    onClick={() => applyPreset(dp)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[90px] transition-all cursor-pointer ${
                      isMatching
                        ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-4 rounded-full border border-black/10"
                          style={{
                            background: dp.gradientEnabled
                              ? `linear-gradient(135deg, ${dp.fg}, ${dp.gradientColor2})`
                              : dp.fg,
                          }}
                        />
                        {dp.customEyeColor && (
                          <span
                            className="size-3 rounded-full border border-black/10"
                            style={{ background: dp.eyeOuterColor }}
                          />
                        )}
                      </div>
                      {isMatching && (
                        <span className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="size-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {displayName}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {dp.dotStyle} · {dp.eyeStyle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* 3. Logo Tab */}
        <TabsContent value="logo">
          <LogoUpload state={state} patch={patch} />
        </TabsContent>

        {/* 4. Dots Style Tab */}
        <TabsContent value="style">
          <OptionGrid
            label={t("qr.dots")}
            value={state.dotStyle}
            onChange={(dotStyle) => patch({ dotStyle })}
            options={[
              { id: "square", label: t("qr.dot.square") },
              { id: "rounded", label: t("qr.dot.rounded") },
              { id: "soft", label: t("qr.dot.soft") },
              { id: "dots", label: t("qr.dot.dots") },
            ]}
          />
        </TabsContent>

        {/* 5. Eye Marker Shape Tab */}
        <TabsContent value="shape">
          <OptionGrid
            label={t("qr.eyes")}
            value={state.eyeStyle}
            onChange={(eyeStyle) => patch({ eyeStyle })}
            options={[
              { id: "square", label: t("qr.eye.square") },
              { id: "rounded", label: t("qr.eye.rounded") },
            ]}
          />
        </TabsContent>

        {/* 6. Frame Tab */}
        <TabsContent value="frame">
          <OptionGrid
            label={t("qr.frame.label")}
            value={state.frame}
            onChange={(frame) => patch({ frame })}
            options={[
              { id: "none", label: t("qr.frame.none") },
              { id: "simple", label: t("qr.frame.simple") },
              { id: "rounded", label: t("qr.frame.rounded") },
            ]}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <label className="relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-xl border">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 size-14 cursor-pointer opacity-0"
          />
          <span className="block size-full" style={{ background: value }} />
        </label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function OptionGrid<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "h-12 rounded-xl text-xs font-semibold cursor-pointer transition-colors",
                active
                  ? "bg-accent text-accent-foreground shadow-[0_0_0_1.5px_var(--primary)]"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
