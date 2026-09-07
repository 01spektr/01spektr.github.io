import { Link, useRouterState } from "@tanstack/react-router";
import {
  Clock3,
  Heart,
  Home,
  LayoutGrid,
  Moon,
  Sun,
  ArrowRight,
} from "lucide-react";
import { ToolboxLogo } from "@/components/brand/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { CATEGORIES } from "@/lib/tools/catalog";
import { iconByName } from "@/lib/icons";

const NAV = [
  { to: "/", icon: Home, key: "nav.home" as const, exact: true },
  { to: "/tools", icon: LayoutGrid, key: "nav.all" as const, exact: false },
  { to: "/favorites", icon: Heart, key: "nav.favorites" as const, exact: false },
  { to: "/history", icon: Clock3, key: "nav.history" as const, exact: false },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t, locale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-5">
        <Link to="/" onClick={onNavigate} className="block">
          <ToolboxLogo />
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="grid gap-1 pb-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground",
                  active && "bg-sidebar-active text-sidebar-foreground",
                )}
              >
                <Icon className="size-4" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">
          {t("nav.categories")}
        </p>
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
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground",
                  active && "bg-sidebar-active text-sidebar-foreground",
                )}
              >
                <span
                  className="flex size-7 items-center justify-center rounded-lg"
                  style={{ background: `${cat.tint}22`, color: cat.tint }}
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="leading-tight">{cat.name[locale]}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-3">
        <div className="relative overflow-hidden rounded-2xl bg-sidebar-active p-4">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, #0c1222 70%), radial-gradient(120% 80% at 50% 0%, #3b6ff555, transparent)",
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
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="mt-3 flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-sm text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
        >
          <span className="inline-flex items-center gap-2">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {theme === "dark" ? t("nav.theme.light") : t("nav.theme.dark")}
          </span>
        </button>
      </div>
    </div>
  );
}
