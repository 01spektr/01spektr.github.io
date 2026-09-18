import { type ReactNode, useEffect, useRef } from "react";

const EN: Record<string, string> = {
  "ЦВЕТОВЫЕ СХЕМЫ": "COLOR HARMONIES",
  "БЫСТРЫЕ ПАЛИТРЫ": "QUICK PALETTES",
  "Произвольная": "Custom",
  "Создайте свою палитру": "Create your own palette",
  "Гармоничная": "Harmonious",
  "Сбалансированные цвета": "Balanced colors",
  "Контрастная": "High contrast",
  "Высокий контраст": "High contrast colors",
  "Аналоговая": "Analogous",
  "Схожие оттенки": "Related hues",
  "Комплементарная": "Complementary",
  "Противоположные цвета": "Opposite colors",
  "Триада": "Triadic",
  "Три цвета на круге": "Three colors on the wheel",
  "Тетрада": "Tetradic",
  "Четыре гармоничных цвета": "Four harmonious colors",
  "Монохромная": "Monochromatic",
  "Один цвет, разные оттенки": "One color, multiple shades",
  "Популярные": "Popular",
  "Минимализм": "Minimal",
  "Природа": "Nature",
  "Технологии": "Technology",
  "Пастель": "Pastel",
  "Яркие": "Vibrant",
  "Чёрно-белые": "Black & white",
  "Отменить (Ctrl+Z)": "Undo (Ctrl+Z)",
  "Повторить (Ctrl+Y)": "Redo (Ctrl+Y)",
  "Сохранить текущую палитру в избранное": "Save the current palette",
  "Просмотреть сохраненные палитры": "View saved palettes",
  "Симулятор нарушений зрения": "Color vision simulator",
  "ВЫБРАН": "SELECTED",
  "Зафиксировать цвет": "Lock color",
  "Случайный оттенок для этого слота": "Randomize this color",
  "Сдвинуть вправо": "Move right",
  "Сдвинуть влево": "Move left",
  "Заблокировать": "Lock",
  "Копировать HEX": "Copy HEX",
  "Основной": "Primary",
  "Вторичный": "Secondary",
  "Фоновый": "Background",
  "Светлый": "Light",
  "Тёмный": "Dark",
  "Выбор цвета": "Color picker",
  "Круг": "Wheel",
  "Слайдеры": "Sliders",
  "Ввод значения": "Values",
  "Недавние цвета": "Recent colors",
  "Очистить историю": "Clear history",
  "Настройки": "Settings",
  "Автогенерация": "Auto generation",
  "Автоматически создаёт гармоничную палитру": "Automatically creates a harmonious palette",
  "Количество цветов": "Number of colors",
  "Стиль": "Style",
  "Современный": "Modern",
  "Пастельный": "Pastel",
  "Винтажный": "Vintage",
  "Неоновый": "Neon",
  "Корпоративный": "Corporate",
  "Тёплый": "Warm",
  "Холодный": "Cool",
  "Минималистичный": "Minimal",
  "Насыщенность": "Saturation",
  "Яркость": "Brightness",
  "Сгенерировать палитру": "Generate palette",
  "Сбросить": "Reset",
  "Предпросмотр": "Preview",
  "Переключить на тёмную тему": "Switch preview to dark theme",
  "Логотип": "Logo",
  "Веб-сайт": "Website",
  "Приложение": "Application",
  "Визитка": "Business card",
  "UI Интерфейс": "UI interface",
  "Простые инструменты для больших задач": "Simple tools for important tasks",
  "Начать": "Get started",
  "Инструменты": "Tools",
  "Категории": "Categories",
  "О проекте": "About",
  "Цвета в макете:": "Colors in preview:",
  "Цветовые коды": "Color codes",
  "Точные значения для веб-дизайна и полиграфии": "Exact values for web design and print",
  "Скопировать всё": "Copy all",
  "Скопировать все значения таблицы": "Copy all table values",
  "Цвет": "Color",
  "Роль": "Role",
  "Нажмите, чтобы скопировать HEX": "Click to copy HEX",
  "Скопировать все коды цвета": "Copy all color codes",
  "Экспорт": "Export",
  "Сохранение палитры в файлы или код": "Save the palette as files or code",
  "Скачать": "Download",
  "Быстрое копирование в буфер": "Quick copy",
  "CSS переменные": "CSS variables",
  "Tailwind токены": "Tailwind tokens",
  "Ссылка на палитру": "Palette link",
  "Поделиться с командой": "Share with your team",
  "Скопировать строку HEX": "Copy HEX list",
  "Готовые палитры": "Curated palettes",
  "Вдохновляющие подборки для быстрого старта": "Curated combinations for a quick start",
  "Смотреть все": "View all",
  "Цветовые схемы": "Color harmonies",
  "Быстрые палитры": "Quick palettes",
  "Выбран": "Selected",
  "Следующие палитры": "Next palettes",
  "Синий": "Blue",
  "Теплый": "Warm",
  "Зеленый": "Green",
  "Фиолетовый": "Purple",
  "Скандинавский": "Scandinavian",
  "Неон": "Neon",
  "синий": "blue",
  "теплый": "warm",
  "зеленый": "green",
  "фиолетовый": "purple",
  "скандинавский": "Scandinavian",
  "неон": "neon",
  "Палитра загружена по ссылке!": "Palette loaded from link!",
  "Отменено": "Undone",
  "Повторено": "Redone",
  "Новая палитра сгенерирована!": "New palette generated!",
  "Палитра сброшена к исходным цветам": "Palette reset to the original colors",
  "Палитра сохранена в избранное!": "Palette saved to favorites!",
  "Изображение PNG успешно скачано!": "PNG image downloaded!",
  "Векторный файл SVG скачан!": "SVG file downloaded!",
  "Файл JSON скачан!": "JSON file downloaded!",
  "Файл CSS скачан!": "CSS file downloaded!",
  "Tailwind конфиг скачан!": "Tailwind config downloaded!",
  "CSS переменные скопированы в буфер!": "CSS variables copied!",
  "JSON палитры скопирован в буфер!": "Palette JSON copied!",
  "Tailwind токены скопированы в буфер!": "Tailwind tokens copied!",
  "Ссылка на палитру скопирована в буфер обмена!": "Palette link copied!",
  "Цвета успешно извлечены из фото!": "Colors extracted from the image!",
  "Не удалось извлечь цвета из этого изображения": "Could not extract colors from this image",
  "Палитра применена в проект!": "Palette applied!",
  "Текущая палитра сохранена в избранное!": "Current palette saved to favorites!",
};

function translate(value: string) {
  const trimmed = value.trim();
  if (EN[trimmed]) return value.replace(trimmed, EN[trimmed]);
  return value
    .replace(/Смотреть все/g, "View all")
    .replace(/Нажмите, чтобы редактировать/g, "Click to edit")
    .replace(/Скачать палитру в формате/g, "Download palette as")
    .replace(/^Слот (\d+) обновлен$/, "Slot $1 updated")
    .replace(/^Загружена палитра: /, "Loaded palette: ")
    .replace(/^Выбрана схема: /, "Selected harmony: ")
    .replace(/^Режим симуляции: /, "Simulation mode: ")
    .replace(/^Включен режим: /, "Enabled mode: ")
    .replace(/^Скопировано: /, "Copied: ")
    .replace(/^HEX коды скопированы: /, "HEX codes copied: ")
    .replace(/^Скопирован оттенок /, "Copied shade ")
    .replace(/^Скопирован /, "Copied ")
    .replace(/^Палитра «(.+)» применена!$/, "Palette “$1” applied!")
    .replace(/^Насыщенность\b/, "Saturation")
    .replace(/^Яркость\b/, "Brightness")
    .replace(/^Все форматы поддерживают/, "All formats support")
    .replace(/цветов$/, "colors");
}

function translateTree(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.textContent) {
      const translated = translate(node.textContent);
      if (translated !== node.textContent) node.textContent = translated;
    }
    node = walker.nextNode();
  }
  root.querySelectorAll<HTMLElement>("[title], [aria-label], [placeholder]").forEach((element) => {
    for (const attr of ["title", "aria-label", "placeholder"]) {
      const value = element.getAttribute(attr);
      if (value) {
        const translated = translate(value);
        if (translated !== value) element.setAttribute(attr, translated);
      }
    }
  });
}

export function PaletteLocaleBoundary({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    translateTree(root);
    const observer = new MutationObserver(() => translateTree(root));
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [enabled]);
  return <div ref={ref}>{children}</div>;
}
