import { COLOR_PALETTE_EN } from "@/lib/i18n/legacy/color-palette.en";
import { type ReactNode, useEffect, useRef } from "react";

function translate(value: string) {
  const trimmed = value.trim();
  if (COLOR_PALETTE_EN[trimmed]) return value.replace(trimmed, COLOR_PALETTE_EN[trimmed]);
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
