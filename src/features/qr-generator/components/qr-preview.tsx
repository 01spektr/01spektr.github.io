import { ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { ContrastLevel } from "../contrast";

interface Props {
  svg: string;
  empty: boolean;
  error: string | null;
  contrast: ContrastLevel;
}

export function QrPreview({ svg, empty, error, contrast }: Props) {
  const { t } = useI18n();
  const blocked = empty || error === "overflow" || contrast === "bad";

  return (
    <div className="rounded-2xl bg-muted/40 p-4">
      <div
        className={cn(
          "relative mx-auto flex aspect-square max-w-80 items-center justify-center overflow-hidden rounded-2xl bg-card",
          blocked && "opacity-70",
        )}
      >
        {svg && !empty ? (
          <div
            className="h-full w-full p-3 [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg.replace(/^<\?xml[^>]*>/, "") }}
          />
        ) : (
          <p className="px-6 text-center text-sm text-muted-foreground">{t("qr.empty")}</p>
        )}
      </div>
      {error === "overflow" ? (
        <p role="alert" className="mt-3 text-center text-sm text-destructive">
          {t("qr.error")}
        </p>
      ) : null}
      <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ScanLine className="size-3.5" />
        {t("qr.scanHint")}
      </p>
    </div>
  );
}
