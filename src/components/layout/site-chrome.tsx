import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Heart, History, Menu, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import {
  LOCALES,
  SUPPORTED_LOCALES,
  localeHomePath,
  localizedPathForLocale,
  type Locale,
} from "@/lib/i18n/config";
import "@/features/home/home.css";
export function SiteHeader({ onSearch }: { onSearch: () => void }) {
  const { locale, setLocale, t } = useI18n(),
    navigate = useNavigate();
  const homePath = localeHomePath(locale);
  const [menu, setMenu] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="tc-header">
      <div className="tc-header-inner">
        <Link to={homePath} className="tc-brand">
          <img src="/toolboxi_uz_logo.svg" alt="Toolboxi.uz" />
        </Link>
        <nav className="tc-nav">
          <Link to="/tools">{t("nav.tools")}</Link>
          <a href={`${homePath}#categories`}>{t("nav.categories")}</a>
          <Link to="/about">{t("nav.about")}</Link>
        </nav>
        <div className="tc-header-actions">
          <button
            className="tc-search-button"
            onClick={onSearch}
            aria-label={t("search.placeholder")}
          >
            <Search />
          </button>
          <Link to="/favorites" className="tc-utility">
            <Heart />
            <span>{t("nav.favorites")}</span>
          </Link>
          <Link to="/history" className="tc-utility">
            <History />
            <span>{t("nav.history")}</span>
          </Link>
          <label className="tc-language">
            <span className="sr-only">{t("common.language")}</span>
            <select
              value={locale}
              onChange={(e) => {
                const next = e.target.value as Locale;
                setLocale(next);
                const destination = localizedPathForLocale(path, next);
                if (destination) void navigate({ to: destination });
              }}
            >
              {SUPPORTED_LOCALES.map((code) => (
                <option key={code} value={code}>{LOCALES[code].shortLabel}</option>
              ))}
            </select>
            <ChevronDown />
          </label>
          <button
            className="tc-menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={t("common.menu")}
          >
            <Menu />
          </button>
        </div>
      </div>
      {menu && (
        <nav className="tc-mobile-nav" onClick={() => setMenu(false)}>
          <Link to="/tools">{t("nav.all")}</Link>
          <a href={`${homePath}#categories`}>{t("nav.categories")}</a>
          <Link to="/favorites">{t("nav.favorites")}</Link>
          <Link to="/history">{t("nav.history")}</Link>
          <Link to="/about">{t("nav.about")}</Link>
        </nav>
      )}
    </header>
  );
}
export function SiteFooter() {
  const { locale, t } = useI18n();
  return (
    <footer className="tc-footer">
      <div className="tc-footer-top">
        <div>
          <Link to={localeHomePath(locale)} className="tc-brand">
            <img src="/toolboxi_uz_logo.svg" alt="Toolboxi.uz" />
          </Link>
          <p>{t("footer.tagline")}</p>
        </div>
        <nav aria-label={t("footer.siteInfo")}>
          <Link to="/about">{t("footer.about")}</Link>
          <Link to="/tools">{t("nav.all")}</Link>
          <Link to="/privacy">{t("footer.privacy")}</Link>
          <Link to="/terms">{t("footer.terms")}</Link>
        </nav>
      </div>
      <div className="tc-footer-bottom">
        <span>© {new Date().getFullYear()} Toolboxi.uz</span>
        <span>{t("footer.free")}</span>
      </div>
    </footer>
  );
}
