import React from "react";
import { Home, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { localeHomePath } from "@/lib/i18n/config";
import { useTranslation } from "../context/LanguageContext";

export const Breadcrumbs: React.FC = () => {
  const { t, language } = useTranslation();

  return (
    <nav
      className="flex items-center text-[12.5px] sm:text-[13px] text-slate-500 dark:text-slate-400 py-2.5 sm:py-4 font-secondary font-normal overflow-x-auto whitespace-nowrap scrollbar-none"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1.5 sm:space-x-2">
        <li className="flex items-center gap-1 sm:gap-1.5">
          <Link
            to={localeHomePath(language)}
            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-[#0066FF] dark:hover:text-blue-400 transition-colors"
            title={t("breadcrumbs.home")}
            id="breadcrumb-home"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={localeHomePath(language)}
            className="hover:text-[#0066FF] dark:hover:text-blue-400 transition-colors text-slate-600 dark:text-slate-300"
            id="breadcrumb-main"
          >
            {t("breadcrumbs.home")}
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 stroke-[1.8]" />
          <Link
            to="/categories/$id"
            params={{ id: "logistics" }}
            className="ml-1.5 sm:ml-2 hover:text-[#0066FF] dark:hover:text-blue-400 transition-colors text-slate-600 dark:text-slate-300"
            id="breadcrumb-logistics"
          >
            {t("breadcrumbs.logistics")}
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 stroke-[1.8]" />
          <span
            className="ml-1.5 sm:ml-2 font-bold text-slate-900 dark:text-slate-100"
            aria-current="page"
            id="breadcrumb-current"
          >
            {t("breadcrumbs.calculator")}
          </span>
        </li>
      </ol>
    </nav>
  );
};
