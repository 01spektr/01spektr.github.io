import { useEffect, useState } from "react";
import { ChevronRight, Clock3, Globe2, Heart, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ToolIcon } from "@/components/tool-icon";
import { useI18n } from "@/lib/i18n";
import { toggleFavorite, isFavorite } from "@/lib/tools/favorites";
import { shareUrl } from "@/lib/tools/share";
import { MainTimeConverter } from "./components/MainTimeConverter";
import { MeetingPlanner } from "./components/MeetingPlanner";
import { TimezoneDirectory } from "./components/TimezoneDirectory";
import { TimezoneMap } from "./components/TimezoneMap";
import { AddCityModal } from "./components/AddCityModal";
import { TimezoneLocaleBoundary } from "./components/TimezoneLocaleBoundary";
import { INITIAL_TIMELINE_CITIES, ALL_WORLD_CITIES } from "./data/cities";
import type { CityTimezone } from "./types";
import "./world-timezones.css";

const text = {
  ru: { category: "Повседневные инструменты", title: "Часовые пояса мира", subtitle: "Сравнивайте время в городах, конвертируйте даты и находите удобное время для международных встреч.", private: "Точное местное время рассчитывается прямо в браузере.", favorite: "В избранное", share: "Поделиться", footer: "Живое время по стандарту UTC" },
  en: { category: "Everyday tools", title: "World time zones", subtitle: "Compare city times, convert dates and find a convenient time for international meetings.", private: "Accurate local time is calculated directly in your browser.", favorite: "Add to favorites", share: "Share", footer: "Live time based on UTC" },
  uz: { category: "Kundalik vositalar", title: "Dunyo vaqt mintaqalari", subtitle: "Shaharlar vaqtini solishtiring, sanalarni o‘giring va xalqaro uchrashuvlar uchun qulay vaqtni toping.", private: "Aniq mahalliy vaqt bevosita brauzerda hisoblanadi.", favorite: "Sevimlilarga", share: "Ulashish", footer: "UTC standarti bo‘yicha jonli vaqt" },
} as const;

export function WorldTimezonesPage() {
  const { locale } = useI18n();
  const copy = text[locale];
  const slug = "world-timezones";
  const [fav, setFav] = useState(() => isFavorite(slug));
  const [timelineCities, setTimelineCities] = useState<CityTimezone[]>(() => {
    if (typeof window === "undefined") return INITIAL_TIMELINE_CITIES;
    try { return JSON.parse(localStorage.getItem("worldclock_timeline_cities") || "null") || INITIAL_TIMELINE_CITIES; } catch { return INITIAL_TIMELINE_CITIES; }
  });
  const [meetingCities, setMeetingCities] = useState<CityTimezone[]>(INITIAL_TIMELINE_CITIES.slice(0, 5));
  const [favoriteIds, setFavoriteIds] = useState<string[]>(["london", "tashkent"]);
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [converterToCityId, setConverterToCityId] = useState("london");

  useEffect(() => { localStorage.setItem("worldclock_timeline_cities", JSON.stringify(timelineCities)); }, [timelineCities]);
  const addCity = (city: CityTimezone) => {
    setTimelineCities((prev) => prev.some((c) => c.id === city.id) ? prev : [...prev, city]);
    setMeetingCities((prev) => prev.some((c) => c.id === city.id) ? prev : [...prev, city]);
    setIsAddCityOpen(false);
  };
  const selectConverter = (city: CityTimezone) => {
    setConverterToCityId(city.id);
    document.getElementById("time-converter-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <div className="world-timezones-page">
    <nav className="wt-breadcrumb"><Link to="/">{locale === "ru" ? "Главная" : locale === "uz" ? "Bosh sahifa" : "Home"}</Link><ChevronRight /><Link to="/categories/$id" params={{ id: "everyday" }}>{copy.category}</Link><ChevronRight /><span>{copy.title}</span></nav>
    <section className="wt-heading">
      <ToolIcon tool={{ slug, icon: "Clock3" }} size="hero" />
      <div><h1>{copy.title}</h1><p>{copy.subtitle}</p></div>
      <div className="wt-heading-note"><Clock3 /><span>{copy.private}</span></div>
      <div className="wt-actions">
        <button onClick={() => { setFav(toggleFavorite(slug)); }} className={fav ? "active" : ""}><Heart />{copy.favorite}</button>
        <button onClick={() => void shareUrl(window.location.href, copy.title)}><Share2 />{copy.share}</button>
      </div>
    </section>
    <section className="wt-summary"><div><Globe2 /><b>{ALL_WORLD_CITIES.length}+</b><span>{locale === "ru" ? "городов" : locale === "uz" ? "shahar" : "cities"}</span></div><p>{copy.footer}</p></section>
    <TimezoneLocaleBoundary key={locale} locale={locale}><section className="wt-main-grid">
      <div id="time-converter-section"><MainTimeConverter allCities={ALL_WORLD_CITIES} externalToCityId={converterToCityId} onOpenAddModal={() => setIsAddCityOpen(true)} /></div>
      <div className="wt-planner"><MeetingPlanner allCities={ALL_WORLD_CITIES} selectedCities={meetingCities} onAddCity={(city) => setMeetingCities((p) => p.some((c) => c.id === city.id) ? p : [...p, city])} onRemoveCity={(id) => setMeetingCities((p) => p.length > 1 ? p.filter((c) => c.id !== id) : p)} onOpenAddModal={() => setIsAddCityOpen(true)} /></div>
    </section>
    <section id="timezone-directory-section"><TimezoneDirectory allCities={ALL_WORLD_CITIES} timelineCityIds={timelineCities.map((c) => c.id)} favoriteCityIds={favoriteIds} onToggleFavorite={(id) => setFavoriteIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])} onAddToTimeline={addCity} onSelectForConverter={selectConverter} /></section>
    <section id="timezone-map-section"><TimezoneMap cities={timelineCities} allCities={ALL_WORLD_CITIES} timelineCityIds={timelineCities.map((c) => c.id)} onSelectCity={addCity} onSelectForConverter={selectConverter} /></section>
    <AddCityModal isOpen={isAddCityOpen} onClose={() => setIsAddCityOpen(false)} allCities={ALL_WORLD_CITIES} timelineCityIds={timelineCities.map((c) => c.id)} onAddCity={addCity} /></TimezoneLocaleBoundary>
  </div>;
}
