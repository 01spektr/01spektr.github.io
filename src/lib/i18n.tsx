import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/tools/catalog";

const STORAGE_KEY = "toolbox:locale";

type Dict = Record<string, string>;

const RU: Dict = {
  "brand.tagline": "One place. Many tools.",
  "nav.home": "Главная",
  "nav.all": "Все инструменты",
  "nav.favorites": "Избранное",
  "nav.history": "История",
  "nav.categories": "Категории",
  "nav.theme.dark": "Тёмная тема",
  "nav.theme.light": "Светлая тема",
  "nav.explore": "Исследовать все",
  "nav.promoTitle": "Больше возможностей в одном месте",
  "nav.promoBody": "Быстрые, удобные и бесплатные инструменты для вашей работы.",
  "search.placeholder": "Поиск инструментов, например: QR, калькулятор, конвертер…",
  "search.empty": "Ничего не найдено",
  "search.hint": "Начните вводить название или ключевое слово",
  "home.kicker": "Универсальный набор онлайн-инструментов",
  "home.title": "Один сервис. Много инструментов.",
  "home.subtitle":
    "Генерируйте QR-коды, считайте, конвертируйте и готовьте документы — прямо в браузере, без регистрации и без отправки данных на сервер.",
  "home.cta": "Открыть генератор QR",
  "home.catalog": "Смотреть каталог",
  "home.featured": "Популярное",
  "home.categories": "Категории",
  "home.recent": "Недавно использовали",
  "home.privacy": "Данные остаются на вашем устройстве",
  "home.free": "Бесплатно и без регистрации",
  "home.offlineish": "Работает в браузере",
  "tools.title": "Все инструменты",
  "tools.subtitle": "Выберите категорию или найдите нужный инструмент по названию.",
  "tools.soon": "Скоро",
  "tools.available": "Доступен",
  "tools.open": "Открыть",
  "fav.title": "Избранное",
  "fav.empty": "Пока нет избранных инструментов",
  "fav.emptyHint": "Нажмите «В избранное» на странице инструмента.",
  "fav.add": "В избранное",
  "fav.remove": "В избранном",
  "hist.title": "История",
  "hist.empty": "История пока пуста",
  "hist.emptyHint": "Действия с инструментами сохраняются только в этом браузере.",
  "hist.clear": "Очистить историю",
  "hist.open": "Открыть",
  "share": "Поделиться",
  "share.copied": "Ссылка скопирована",
  "share.failed": "Не удалось скопировать ссылку",
  "coming.title": "Инструмент в разработке",
  "coming.body":
    "Этот инструмент появится в ближайших обновлениях. Пока можно пользоваться генератором QR-кодов — он уже полностью работает в браузере.",
  "coming.back": "К каталогу",
  "coming.qr": "Открыть QR-генератор",
  "lang.ru": "Русский",
  "lang.en": "English",
  "breadcrumb.home": "Главная",
  "common.close": "Закрыть",
  "common.menu": "Меню",
  "common.cancel": "Отмена",
  "common.save": "Сохранить",
  "qr.crumb": "QR-генератор",
  "qr.title": "Генератор QR-кодов",
  "qr.subtitle":
    "Создавайте стильные QR-коды с логотипом, настройкой цветов и экспортом в нужном формате. Быстро, удобно, бесплатно.",
  "qr.tip":
    "Создавайте QR-коды для ссылок, текста, контактов, Wi-Fi и многого другого.",
  "qr.privacyTitle": "Ваши данные остаются в браузере",
  "qr.privacyBody":
    "QR-коды создаются непосредственно на вашем устройстве. Данные не отправляются на сервер.",
  "qr.section.content": "1. Тип содержимого",
  "qr.section.design": "2. Настройка дизайна",
  "qr.section.extra": "3. Дополнительные опции",
  "qr.section.advanced": "Дополнительные настройки",
  "qr.type.url": "Ссылка",
  "qr.type.text": "Текст",
  "qr.type.contact": "Контакты",
  "qr.type.wifi": "Wi-Fi",
  "qr.type.email": "E-mail",
  "qr.type.phone": "Телефон",
  "qr.type.sms": "SMS",
  "qr.url.label": "Введите ссылку",
  "qr.url.placeholder": "https://www.example.com",
  "qr.text.label": "Текст",
  "qr.text.placeholder": "Введите любой текст",
  "qr.contact.first": "Имя",
  "qr.contact.last": "Фамилия",
  "qr.contact.company": "Компания",
  "qr.contact.phone": "Телефон",
  "qr.contact.email": "Email",
  "qr.contact.website": "Сайт",
  "qr.wifi.ssid": "Название сети",
  "qr.wifi.password": "Пароль",
  "qr.wifi.encryption": "Тип защиты",
  "qr.wifi.wpa": "WPA/WPA2",
  "qr.wifi.wep": "WEP",
  "qr.wifi.none": "Без защиты",
  "qr.wifi.hidden": "Скрытая сеть",
  "qr.email.to": "Email",
  "qr.email.subject": "Тема",
  "qr.email.body": "Сообщение",
  "qr.phone.label": "Номер телефона",
  "qr.sms.phone": "Номер телефона",
  "qr.sms.body": "Сообщение",
  "qr.tab.colors": "Цвета",
  "qr.tab.logo": "Логотип",
  "qr.tab.style": "Стиль",
  "qr.tab.shape": "Форма",
  "qr.tab.frame": "Рамка",
  "qr.fg": "Цвет QR-кода",
  "qr.bg": "Фон",
  "qr.contrast.warn":
    "Низкий контраст: такое сочетание цветов может плохо сканироваться.",
  "qr.contrast.ok": "Контраст достаточный для сканирования.",
  "qr.logo.enable": "Включить логотип",
  "qr.logo.upload": "Загрузить изображение",
  "qr.logo.hint": "PNG, JPG, WebP или SVG. Не больше 2 МБ.",
  "qr.logo.size": "Размер логотипа",
  "qr.logo.padding": "Отступ вокруг логотипа",
  "qr.logo.remove": "Удалить логотип",
  "qr.logo.badge": "Иконка типа в центре",
  "qr.logo.tooBig": "Логотип ограничен, чтобы QR оставался читаемым.",
  "qr.dot.square": "Квадрат",
  "qr.dot.rounded": "Округлённый",
  "qr.dot.soft": "Мягкий",
  "qr.dot.dots": "Точки",
  "qr.eye.square": "Квадрат",
  "qr.eye.rounded": "Округлённый",
  "qr.dots": "Форма точек",
  "qr.eyes": "Finder patterns",
  "qr.frame.none": "Без рамки",
  "qr.frame.simple": "Простая",
  "qr.frame.rounded": "Закруглённая",
  "qr.frame.label": "Рамка вокруг QR",
  "qr.caption": "Добавить подпись",
  "qr.caption.placeholder": "Например: Отсканируй меня",
  "qr.caption.font": "Шрифт",
  "qr.svgQuality": "Высокое качество (SVG)",
  "qr.svgQuality.hint":
    "Экспорт в SVG сохраняет вектор без потери качества при любом размере.",
  "qr.preview": "Предпросмотр",
  "qr.size": "Размер",
  "qr.size.custom": "Свой размер",
  "qr.scanHint": "Отсканируйте QR-код, чтобы проверить",
  "qr.download": "Скачать QR-код",
  "qr.copy": "Копировать QR",
  "qr.copy.ok": "QR-код скопирован",
  "qr.copy.fail": "Буфер обмена недоступен в этом браузере",
  "qr.empty": "Введите данные, чтобы сгенерировать QR-код",
  "qr.error": "Не удалось создать QR-код. Сократите данные и попробуйте снова.",
  "qr.ecc": "Уровень коррекции ошибок",
  "qr.margin": "Отступ",
  "qr.quiet": "Тихая зона QR",
  "qr.transparent": "Прозрачный фон",
  "qr.examples": "Примеры использования",
  "qr.examples.all": "Смотреть все примеры",
  "qr.ex.url": "Ссылка на сайт",
  "qr.ex.urlHint": "Открытие веб-страниц",
  "qr.ex.social": "Социальные сети",
  "qr.ex.socialHint": "Instagram, YouTube и др.",
  "qr.ex.text": "Текст",
  "qr.ex.textHint": "Любая текстовая информация",
  "qr.ex.contact": "Контакты",
  "qr.ex.contactHint": "Визитная карточка (vCard)",
  "qr.ex.wifi": "Wi-Fi",
  "qr.ex.wifiHint": "Быстрое подключение к сети",
  "qr.ex.email": "E-mail",
  "qr.ex.emailHint": "Написать письмо",
  "qr.ex.phone": "Телефон",
  "qr.ex.phoneHint": "Позвонить одним сканированием",
  "qr.hist": "QR: {label}",
  "qr.customSize": "Сторона, px",
};

const EN: Dict = {
  "brand.tagline": "One place. Many tools.",
  "nav.home": "Home",
  "nav.all": "All tools",
  "nav.favorites": "Favorites",
  "nav.history": "History",
  "nav.categories": "Categories",
  "nav.theme.dark": "Dark theme",
  "nav.theme.light": "Light theme",
  "nav.explore": "Explore all",
  "nav.promoTitle": "More power in one place",
  "nav.promoBody": "Fast, private, free tools for everyday work.",
  "search.placeholder": "Search tools, e.g. QR, calculator, converter…",
  "search.empty": "No tools found",
  "search.hint": "Start typing a name or keyword",
  "home.kicker": "A universal set of online tools",
  "home.title": "One place. Many tools.",
  "home.subtitle":
    "Generate QR codes, calculate, convert and prepare files — entirely in the browser, with no accounts and no data leaving your device.",
  "home.cta": "Open QR generator",
  "home.catalog": "Browse catalog",
  "home.featured": "Popular",
  "home.categories": "Categories",
  "home.recent": "Recently used",
  "home.privacy": "Data stays on your device",
  "home.free": "Free, no sign-in",
  "home.offlineish": "Runs in the browser",
  "tools.title": "All tools",
  "tools.subtitle": "Pick a category or search by name.",
  "tools.soon": "Soon",
  "tools.available": "Available",
  "tools.open": "Open",
  "fav.title": "Favorites",
  "fav.empty": "No favorites yet",
  "fav.emptyHint": "Tap “Add to favorites” on a tool page.",
  "fav.add": "Add to favorites",
  "fav.remove": "Favorited",
  "hist.title": "History",
  "hist.empty": "History is empty",
  "hist.emptyHint": "Tool actions are stored only in this browser.",
  "hist.clear": "Clear history",
  "hist.open": "Open",
  "share": "Share",
  "share.copied": "Link copied",
  "share.failed": "Could not copy the link",
  "coming.title": "This tool is on the way",
  "coming.body":
    "It will land in a later update. The QR generator is already fully available in the browser.",
  "coming.back": "Back to catalog",
  "coming.qr": "Open QR generator",
  "lang.ru": "Русский",
  "lang.en": "English",
  "breadcrumb.home": "Home",
  "common.close": "Close",
  "common.menu": "Menu",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "qr.crumb": "QR generator",
  "qr.title": "QR code generator",
  "qr.subtitle":
    "Create styled QR codes with a logo, custom colors and export in the format you need. Fast, simple, free.",
  "qr.tip": "Create QR codes for links, text, contacts, Wi-Fi and more.",
  "qr.privacyTitle": "Your data stays in the browser",
  "qr.privacyBody":
    "QR codes are created on your device. Nothing is sent to a server.",
  "qr.section.content": "1. Content type",
  "qr.section.design": "2. Design",
  "qr.section.extra": "3. Extra options",
  "qr.section.advanced": "Advanced settings",
  "qr.type.url": "Link",
  "qr.type.text": "Text",
  "qr.type.contact": "Contact",
  "qr.type.wifi": "Wi-Fi",
  "qr.type.email": "E-mail",
  "qr.type.phone": "Phone",
  "qr.type.sms": "SMS",
  "qr.url.label": "Enter a URL",
  "qr.url.placeholder": "https://www.example.com",
  "qr.text.label": "Text",
  "qr.text.placeholder": "Enter any text",
  "qr.contact.first": "First name",
  "qr.contact.last": "Last name",
  "qr.contact.company": "Company",
  "qr.contact.phone": "Phone",
  "qr.contact.email": "Email",
  "qr.contact.website": "Website",
  "qr.wifi.ssid": "Network name",
  "qr.wifi.password": "Password",
  "qr.wifi.encryption": "Security",
  "qr.wifi.wpa": "WPA/WPA2",
  "qr.wifi.wep": "WEP",
  "qr.wifi.none": "None",
  "qr.wifi.hidden": "Hidden network",
  "qr.email.to": "Email",
  "qr.email.subject": "Subject",
  "qr.email.body": "Message",
  "qr.phone.label": "Phone number",
  "qr.sms.phone": "Phone number",
  "qr.sms.body": "Message",
  "qr.tab.colors": "Colors",
  "qr.tab.logo": "Logo",
  "qr.tab.style": "Style",
  "qr.tab.shape": "Shape",
  "qr.tab.frame": "Frame",
  "qr.fg": "QR color",
  "qr.bg": "Background",
  "qr.contrast.warn":
    "Low contrast: this color pair may be hard to scan.",
  "qr.contrast.ok": "Contrast is good enough to scan.",
  "qr.logo.enable": "Enable logo",
  "qr.logo.upload": "Upload image",
  "qr.logo.hint": "PNG, JPG, WebP or SVG. 2 MB max.",
  "qr.logo.size": "Logo size",
  "qr.logo.padding": "Padding around logo",
  "qr.logo.remove": "Remove logo",
  "qr.logo.badge": "Type icon in the center",
  "qr.logo.tooBig": "Logo is capped so the QR stays readable.",
  "qr.dot.square": "Square",
  "qr.dot.rounded": "Rounded",
  "qr.dot.soft": "Soft",
  "qr.dot.dots": "Dots",
  "qr.eye.square": "Square",
  "qr.eye.rounded": "Rounded",
  "qr.dots": "Module shape",
  "qr.eyes": "Finder patterns",
  "qr.frame.none": "None",
  "qr.frame.simple": "Simple",
  "qr.frame.rounded": "Rounded",
  "qr.frame.label": "Frame around QR",
  "qr.caption": "Add a caption",
  "qr.caption.placeholder": "e.g. Scan me",
  "qr.caption.font": "Font",
  "qr.svgQuality": "High quality (SVG)",
  "qr.svgQuality.hint":
    "SVG export stays vector-sharp at any size.",
  "qr.preview": "Preview",
  "qr.size": "Size",
  "qr.size.custom": "Custom size",
  "qr.scanHint": "Scan the QR code to verify",
  "qr.download": "Download QR code",
  "qr.copy": "Copy QR",
  "qr.copy.ok": "QR code copied",
  "qr.copy.fail": "Clipboard is not available in this browser",
  "qr.empty": "Enter data to generate a QR code",
  "qr.error": "Could not build this QR code. Shorten the data and try again.",
  "qr.ecc": "Error correction",
  "qr.margin": "Margin",
  "qr.quiet": "Quiet zone",
  "qr.transparent": "Transparent background",
  "qr.examples": "Usage examples",
  "qr.examples.all": "See all examples",
  "qr.ex.url": "Website link",
  "qr.ex.urlHint": "Open a web page",
  "qr.ex.social": "Social",
  "qr.ex.socialHint": "Instagram, YouTube and more",
  "qr.ex.text": "Text",
  "qr.ex.textHint": "Any text payload",
  "qr.ex.contact": "Contact",
  "qr.ex.contactHint": "vCard business card",
  "qr.ex.wifi": "Wi-Fi",
  "qr.ex.wifiHint": "Join a network in one scan",
  "qr.ex.email": "E-mail",
  "qr.ex.emailHint": "Compose a message",
  "qr.ex.phone": "Phone",
  "qr.ex.phoneHint": "Call with one scan",
  "qr.hist": "QR: {label}",
  "qr.customSize": "Side, px",
};

const DICTS: Record<Locale, Dict> = { ru: RU, en: EN };

let locale: Locale = "ru";
const listeners = new Set<() => void>();

function readLocale(): Locale {
  if (typeof window === "undefined") return locale;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  return "ru";
}

locale = typeof window === "undefined" ? "ru" : readLocale();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setLocale(next: Locale) {
  locale = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }
  emit();
}

export function getLocale() {
  return locale;
}

function interpolate(template: string, vars?: Record<string, string>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");
}

const I18nContext = createContext<{
  locale: Locale;
  t: (key: string, vars?: Record<string, string>) => string;
  setLocale: (l: Locale) => void;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, getLocale, () => "ru" as Locale);
  const t = useCallback(
    (key: string, vars?: Record<string, string>) => {
      const dict = DICTS[current];
      return interpolate(dict[key] ?? DICTS.ru[key] ?? key, vars);
    },
    [current],
  );
  const value = useMemo(
    () => ({ locale: current, t, setLocale }),
    [current, t],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
