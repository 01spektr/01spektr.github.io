import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { ToolIcon } from "@/components/tool-icon";
import { searchTools } from "@/lib/tools/catalog";
import { localizedToolPath } from "@/lib/i18n/config";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: Props) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      searchTools(query)
        .filter((tool) => tool.available)
        .slice(0, 12),
    [query],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <DialogContent className="p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{t("nav.all")}</DialogTitle>
          <DialogDescription>{t("search.hint")}</DialogDescription>
        </DialogHeader>
        <div className="px-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="pl-9"
            />
          </div>
        </div>
        <ul className="max-h-80 overflow-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              {t("search.empty")}
            </li>
          ) : (
            results.map((tool) => {
              return (
                <li key={tool.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted"
                    onClick={() => {
                      onOpenChange(false);
                      void navigate({ to: localizedToolPath(tool.slug, locale) });
                    }}
                  >
                    <ToolIcon tool={tool} size="compact" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {tool.name[locale]}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {tool.description[locale]}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
