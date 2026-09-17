import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Heart, History, Menu, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import "@/features/home/home.css";
export function SiteHeader({ onSearch }: { onSearch: () => void }) {
  const { locale, setLocale } = useI18n(),
    navigate = useNavigate();
  const en = locale === "en";
  const [menu, setMenu] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="tc-header">
      <div className="tc-header-inner">
        <Link to={en ? "/en" : "/"} className="tc-brand">
          <img src="/toolboxi_uz_logo.svg" alt="Toolboxi.uz" />
        </Link>
        <nav className="tc-nav">
          <Link to="/tools">{en ? "Tools" : "Инструменты"}</Link>
          <a href={en ? "/en/#categories" : "/#categories"}>{en ? "Categories" : "Категории"}</a>
          <Link to="/about">{en ? "About" : "О проекте"}</Link>
        </nav>
        <div className="tc-header-actions">
          <button
            className="tc-search-button"
            onClick={onSearch}
            aria-label={en ? "Search tools" : "Поиск инструментов"}
          >
            <Search />
          </button>
          <Link to="/favorites" className="tc-utility">
            <Heart />
            <span>{en ? "Favorites" : "Избранное"}</span>
          </Link>
          <Link to="/history" className="tc-utility">
            <History />
            <span>{en ? "History" : "История"}</span>
          </Link>
          <label className="tc-language">
            <span className="sr-only">{en ? "Language" : "Язык"}</span>
            <select
              value={locale}
              onChange={(e) => {
                const next = e.target.value as "ru" | "en";
                setLocale(next);
                if (path === "/" || path.replace(/\/$/, "") === "/en")
                  void navigate({ to: next === "en" ? "/en" : "/" });
              }}
            >
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
            <ChevronDown />
          </label>
          <button
            className="tc-menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={en ? "Menu" : "Меню"}
          >
            <Menu />
          </button>
        </div>
      </div>
      {menu && (
        <nav className="tc-mobile-nav" onClick={() => setMenu(false)}>
          <Link to="/tools">{en ? "All tools" : "Все инструменты"}</Link>
          <a href={en ? "/en/#categories" : "/#categories"}>{en ? "Categories" : "Категории"}</a>
          <Link to="/favorites">{en ? "Favorites" : "Избранное"}</Link>
          <Link to="/history">{en ? "History" : "История"}</Link>
          <Link to="/about">{en ? "About" : "О проекте"}</Link>
        </nav>
      )}
    </header>
  );
}
export function SiteFooter() {
  const { locale } = useI18n(),
    en = locale === "en";
  return (
    <footer className="tc-footer">
      <div className="tc-footer-top">
        <div>
          <Link to={en ? "/en" : "/"} className="tc-brand">
            <img src="/toolboxi_uz_logo.svg" alt="Toolboxi.uz" />
          </Link>
          <p>
            {en
              ? "Useful tools. More time for what matters."
              : "Полезные инструменты. Больше времени на важное."}
          </p>
        </div>
        <nav aria-label={en ? "Site information" : "Информация о сайте"}>
          <Link to="/about">{en ? "About Toolboxi" : "О проекте"}</Link>
          <Link to="/tools">{en ? "All tools" : "Все инструменты"}</Link>
          <Link to="/privacy">{en ? "Privacy policy" : "Конфиденциальность"}</Link>
          <Link to="/terms">{en ? "Terms of use" : "Условия использования"}</Link>
        </nav>
      </div>
      <div className="tc-footer-bottom">
        <span>© {new Date().getFullYear()} Toolboxi.uz</span>
        <span>{en ? "Free tools. No account required." : "Бесплатно. Без регистрации."}</span>
      </div>
    </footer>
  );
}
