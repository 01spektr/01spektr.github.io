import { Globe, LogIn, Menu, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useRouterState } from "@tanstack/react-router";

interface Props {
  onMenu: () => void;
  onSearch: () => void;
}

export function Header({ onMenu, onSearch }: Props) {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isHome = useRouterState({ select: (state) => state.location.pathname === "/" });

  return (
    <header className={`sticky top-0 z-30 flex h-16 items-center gap-3 px-4 backdrop-blur-md lg:px-8 ${isHome ? "home-header" : "bg-background/90"}`}>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenu}
        aria-label={t("common.menu")}
      >
        <Menu className="size-5" />
      </Button>

      <button
        type="button"
        onClick={onSearch}
        className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl bg-card px-4 text-left text-sm text-muted-foreground shadow-[var(--shadow-border)] lg:max-w-[760px]"
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">{t("search.placeholder")}</span>
        <kbd className="ml-auto hidden rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-1.5 px-2.5" aria-label={t("lang.ru")}>
            <Globe className="size-4" />
            <span className="hidden sm:inline">{locale.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setLocale("ru")}>{t("lang.ru")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setLocale("en")}>{t("lang.en")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:inline-flex"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? t("nav.theme.light") : t("nav.theme.dark")}
      >
        {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>

      <span
        aria-hidden="true"
        className="home-login flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        <LogIn className="size-4" />
        <span className="hidden sm:inline">Войти</span>
      </span>
      </div>
    </header>
  );
}
