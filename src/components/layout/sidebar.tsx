import { Link, useRouterState } from "@tanstack/react-router";
import {
  Clock3,
  Heart,
  Home,
  LayoutGrid,
  Moon,
  Sun,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ToolboxLogo, ToolboxMark } from "@/components/brand/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { CATEGORIES } from "@/lib/tools/catalog";
import { iconByName } from "@/lib/icons";
import { localeHomePath } from "@/lib/i18n/config";

const NAV = [
  { to: "/", icon: Home, key: "nav.home" as const, exact: true },
  { to: "/tools", icon: LayoutGrid, key: "nav.all" as const, exact: false },
  { to: "/favorites", icon: Heart, key: "nav.favorites" as const, exact: false },
  { to: "/history", icon: Clock3, key: "nav.history" as const, exact: false },
];

export function Sidebar({ onNavigate, compact = false, onToggle }: { onNavigate?: () => void; compact?: boolean; onToggle?: () => void }) {
  const { t, locale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const homePath = localeHomePath(locale);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex items-center py-5", compact ? "justify-center px-3" : "justify-between px-5")}>
        <Link to={homePath} onClick={onNavigate} className="block" aria-label="Toolboxi.uz">
          {compact ? <ToolboxMark /> : <ToolboxLogo />}
        </Link>
        {!compact && onToggle ? <button type="button" onClick={onToggle} className="rounded-lg p-2 text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground" aria-label="Свернуть меню"><PanelLeftClose className="size-4" /></button> : null}
      </div>

      <ScrollArea className={cn("flex-1", compact ? "px-2" : "px-3")}>
        <nav className="grid gap-1 pb-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const target = item.exact ? homePath : item.to;
            const active = item.exact
              ? pathname.replace(/\/$/, "") === target.replace(/\/$/, "")
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={target}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-11 items-center rounded-xl text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground",
                  compact ? "justify-center px-2" : "gap-3 px-3",
                  active && "bg-sidebar-active text-sidebar-foreground",
                )}
              >
                <Icon className="size-4" />
                {compact ? <span className="sr-only">{t(item.key)}</span> : t(item.key)}
              </Link>
            );
          })}
          <Link
            to={homePath}
            hash="categories"
            onClick={onNavigate}
            className={cn("flex min-h-11 items-center rounded-xl text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground", compact ? "justify-center px-2" : "gap-3 px-3")}
          >
            <LayoutGrid className="size-4" />
            {compact ? <span className="sr-only">{t("nav.categories")}</span> : t("nav.categories")}
          </Link>
        </nav>

        {!compact ? <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">{t("nav.categories")}</p> : null}
        <nav className="grid gap-1 pb-6">
          {CATEGORIES.map((cat) => {
            const Icon = iconByName(cat.icon);
            const to = `/categories/${cat.slug}`;
            const active = pathname === to;
            return (
              <Link
                key={cat.id}
                to="/categories/$id"
                params={{ id: cat.slug }}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-11 items-center rounded-xl text-sm text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground",
                  compact ? "justify-center px-2" : "gap-3 px-3",
                  active && "bg-sidebar-active text-sidebar-foreground",
                )}
              >
                <span
                  className="flex size-7 items-center justify-center rounded-lg"
                  style={{ background: `${cat.tint}22`, color: cat.tint }}
                >
                  <Icon className="size-3.5" />
                </span>
                {compact ? <span className="sr-only">{cat.name[locale]}</span> : <span className="leading-tight">{cat.name[locale]}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-3">
        {!compact ? <div className="sidebar-promo relative overflow-hidden rounded-2xl p-4">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgb(9 20 39 / 10%) 0%, rgb(4 12 25 / 96%) 80%)",
            }}
          />
          <p className="relative text-sm font-semibold">{t("nav.promoTitle")}</p>
          <p className="relative mt-1 text-xs leading-relaxed text-sidebar-muted">
            {t("nav.promoBody")}
          </p>
          <Link
            to="/tools"
            onClick={onNavigate}
            className="relative mt-3 inline-flex min-h-10 items-center gap-1 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            {t("nav.explore")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div> : null}
        {compact && onToggle ? <button type="button" onClick={onToggle} className="mb-2 flex min-h-11 w-full items-center justify-center rounded-xl text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground" aria-label="Развернуть меню"><PanelLeftOpen className="size-4" /></button> : null}
        <button
          type="button"
          onClick={toggleTheme}
          className={cn("flex min-h-11 w-full items-center rounded-xl px-3 text-sm text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground", compact ? "justify-center" : "mt-3 justify-between")}
        >
          <span className="inline-flex items-center gap-2">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {compact ? <span className="sr-only">{theme === "dark" ? t("nav.theme.light") : t("nav.theme.dark")}</span> : theme === "dark" ? t("nav.theme.light") : t("nav.theme.dark")}
          </span>
        </button>
      </div>
    </div>
  );
}
