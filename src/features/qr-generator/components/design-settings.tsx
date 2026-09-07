import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { COLOR_PRESETS, type QrState } from "../state";
import type { ContrastLevel } from "../contrast";
import { LogoUpload } from "./logo-upload";

interface Props {
  state: QrState;
  patch: (next: Partial<QrState>) => void;
  contrast: ContrastLevel;
}

export function DesignSettings({ state, patch, contrast }: Props) {
  const { t } = useI18n();

  return (
    <section className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold">{t("qr.section.design")}</h2>
      <Tabs defaultValue="colors">
        <TabsList>
          <TabsTrigger value="colors">{t("qr.tab.colors")}</TabsTrigger>
          <TabsTrigger value="logo">{t("qr.tab.logo")}</TabsTrigger>
          <TabsTrigger value="style">{t("qr.tab.style")}</TabsTrigger>
          <TabsTrigger value="shape">{t("qr.tab.shape")}</TabsTrigger>
          <TabsTrigger value="frame">{t("qr.tab.frame")}</TabsTrigger>
        </TabsList>

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
                    "relative size-9 rounded-full",
                    active && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                  )}
                  style={{ background: p.fg }}
                >
                  {active ? (
                    <Check className="absolute inset-0 m-auto size-4 text-primary-foreground" />
                  ) : null}
                </button>
              );
            })}
            <label className="relative size-9 cursor-pointer overflow-hidden rounded-full shadow-[var(--shadow-border)]">
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
          {contrast !== "ok" ? (
            <p role="status" className="rounded-xl bg-warning-bg px-3 py-2 text-sm text-warning">
              {t("qr.contrast.warn")}
            </p>
          ) : null}
        </TabsContent>

        <TabsContent value="logo">
          <LogoUpload state={state} patch={patch} />
        </TabsContent>

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
        <input
          type="color"
          value={value}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          className="size-11 cursor-pointer rounded-xl border-0 bg-transparent p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="font-mono uppercase"
        />
      </div>
    </div>
  );
}

function OptionGrid<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "min-h-11 rounded-xl px-3 text-sm font-medium",
              value === opt.id
                ? "bg-accent text-accent-foreground shadow-[0_0_0_1.5px_var(--primary)]"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
