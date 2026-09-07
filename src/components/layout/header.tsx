import { Globe, Menu, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

interface Props {
  onMenu: () => void;
  onSearch: () => void;
}

export function Header({ onMenu, onSearch }: Props) {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background/90 px-4 backdrop-blur-md lg:px-8">
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
        className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full bg-card px-4 text-left text-sm text-muted-foreground shadow-[var(--shadow-border)]"
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">{t("search.placeholder")}</span>
        <kbd className="ml-auto hidden rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
          Ctrl K
        </kbd>
      </button>

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
        className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
      >
        A
      </span>
    </header>
  );
}
