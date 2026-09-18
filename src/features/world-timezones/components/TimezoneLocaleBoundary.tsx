import { useEffect, useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { ALL_WORLD_CITIES } from "../data/cities";

const EN: Record<string, string> = {
  "Конвертер времени":"Time converter","Точный расчет времени между городами и часовыми поясами мира":"Accurate time conversion between cities and time zones","24 часа":"24 hours","12 часов":"12 hours","Сейчас (живое)":"Now (live)","Перейти к текущему времени":"Go to current time","ИСХОДНЫЙ ГОРОД (ИЗ)":"SOURCE CITY (FROM)","ЦЕЛЕВОЙ ГОРОД (В)":"DESTINATION CITY (TO)","Задайте время:":"Set time:","Поменять местами":"Swap cities","Точное время:":"Exact time:","Сегодня":"Today","сегодня":"today","Интерактивная шкала 24 часов:":"Interactive 24-hour timeline:","Перетащите ползунок для быстрого подбора":"Drag the slider to find a time quickly","Ночь (00-07)":"Night (00-07)","Утро/Вечер":"Morning / evening","Рабочие часы (09-18)":"Working hours (09-18)","ПРЕСЕТЫ:":"PRESETS:","Начало дня":"Start of day","Обед":"Lunch","Встреча":"Meeting","Конец дня":"End of day","Дополнительные города":"Additional cities","Удалить город из сравнения":"Remove city from comparison","Сравнить с еще одним городом":"Compare another city","Скопировать результат":"Copy result","Календарь":"Calendar","Время автоматически обновляется":"Time updates automatically","Удобное время для встречи":"Convenient meeting time","Выберите города и найдите общее удобное время":"Select cities and find a convenient shared time","Убрать город":"Remove city","Добавить":"Add","Рекомендуемое время":"Recommended time","Скопировать время":"Copy time","Открыть в Google Календаре":"Open in Google Calendar","Каталог городов и часовых поясов мира":"World city and time zone directory","Актуальное местное время, смещение UTC и статус рабочих часов в городах мира":"Current local time, UTC offset and working-hours status around the world","Найдено:":"Found:","из":"of","Избранные":"Favorites","Все":"All","Сейчас работают (09-18)":"Working now (09-18)","Все UTC":"All UTC","ГОРОД":"CITY","СТРАНА И КОНТИНЕНТ":"COUNTRY AND CONTINENT","ЧАСОВОЙ ПОЯС (IANA)":"TIME ZONE (IANA)","СМЕЩЕНИЕ UTC":"UTC OFFSET","ТЕКУЩЕЕ ВРЕМЯ":"CURRENT TIME","ДЕЙСТВИЯ":"ACTIONS","В избранном":"Favorite","Добавить в избранное":"Add to favorites","В конвертер":"To converter","Сравнить в конвертере времени":"Compare in time converter","Добавлен":"Added","Показаны города":"Showing cities","Карта часовых поясов":"Time zone map","Выберите город для конвертации времени":"Select a city for time conversion","городов":"cities","Ночь (отдых)":"Night (rest)","Рабочие часы":"Working hours"
};
const UZ: Record<string, string> = {
  "Конвертер времени":"Vaqt konverteri","Точный расчет времени между городами и часовыми поясами мира":"Shaharlar va vaqt mintaqalari orasidagi vaqtni aniq hisoblash","24 часа":"24 soat","12 часов":"12 soat","Сейчас (живое)":"Hozir (jonli)","Перейти к текущему времени":"Joriy vaqtga o‘tish","ИСХОДНЫЙ ГОРОД (ИЗ)":"BOSHLANG‘ICH SHAHAR","ЦЕЛЕВОЙ ГОРОД (В)":"MANZIL SHAHAR","Задайте время:":"Vaqtni kiriting:","Поменять местами":"Joyini almashtirish","Точное время:":"Aniq vaqt:","Сегодня":"Bugun","сегодня":"bugun","Интерактивная шкала 24 часов:":"24 soatlik interaktiv shkala:","Перетащите ползунок для быстрого подбора":"Vaqtni tez tanlash uchun slayderni suring","Ночь (00-07)":"Tun (00-07)","Утро/Вечер":"Ertalab / kechqurun","Рабочие часы (09-18)":"Ish vaqti (09-18)","ПРЕСЕТЫ:":"TAYYOR VAQTLAR:","Начало дня":"Kun boshlanishi","Обед":"Tushlik","Встреча":"Uchrashuv","Конец дня":"Kun oxiri","Дополнительные города":"Qo‘shimcha shaharlar","Удалить город из сравнения":"Shaharni taqqoslashdan olib tashlash","Сравнить с еще одним городом":"Yana bir shahar bilan solishtirish","Скопировать результат":"Natijani nusxalash","Календарь":"Taqvim","Время автоматически обновляется":"Vaqt avtomatik yangilanadi","Удобное время для встречи":"Uchrashuv uchun qulay vaqt","Выберите города и найдите общее удобное время":"Shaharlarni tanlang va umumiy qulay vaqtni toping","Убрать город":"Shaharni olib tashlash","Добавить":"Qo‘shish","Рекомендуемое время":"Tavsiya etilgan vaqt","Скопировать время":"Vaqtni nusxalash","Открыть в Google Календаре":"Google Taqvimda ochish","Каталог городов и часовых поясов мира":"Dunyo shaharlari va vaqt mintaqalari katalogi","Актуальное местное время, смещение UTC и статус рабочих часов в городах мира":"Dunyo shaharlaridagi mahalliy vaqt, UTC farqi va ish vaqti holati","Найдено:":"Topildi:","из":"dan","Избранные":"Sevimlilar","Все":"Barchasi","Сейчас работают (09-18)":"Hozir ish vaqti (09-18)","Все UTC":"Barcha UTC","ГОРОД":"SHAHAR","СТРАНА И КОНТИНЕНТ":"MAMLAKAT VA QIT’A","ЧАСОВОЙ ПОЯС (IANA)":"VAQT MINTAQASI (IANA)","СМЕЩЕНИЕ UTC":"UTC FARQI","ТЕКУЩЕЕ ВРЕМЯ":"JORIY VAQT","ДЕЙСТВИЯ":"AMALLAR","В избранном":"Sevimlilarda","Добавить в избранное":"Sevimlilarga qo‘shish","В конвертер":"Konverterga","Сравнить в конвертере времени":"Vaqt konverterida solishtirish","Добавлен":"Qo‘shilgan","Показаны города":"Ko‘rsatilgan shaharlar","Карта часовых поясов":"Vaqt mintaqalari xaritasi","Выберите город для конвертации времени":"Vaqtni o‘girish uchun shaharni tanlang","городов":"shahar","Ночь (отдых)":"Tun (dam olish)","Рабочие часы":"Ish vaqti"
};
const EN_EXTRA: Record<string, string> = {
  "Исходный город": "Source city", "Целевой город": "Destination city", "Часы": "Hours", "Минуты": "Minutes",
  "Текущее время": "Current time", "День": "Day", "Ночь": "Night", "Рабочее": "Working hours", "Утро / Вечер": "Morning / evening",
  "Европа": "Europe", "Азия": "Asia", "Северная Америка": "North America", "Южная Америка": "South America", "Африка": "Africa", "Океания": "Oceania",
  "Фильтр по смещению UTC": "UTC offset filter", "Интерактивная карта часовых поясов": "Interactive time zone map",
  "Добавить в планировщик встречи": "Add to meeting planner",
};
const UZ_EXTRA: Record<string, string> = {
  "Исходный город": "Boshlang‘ich shahar", "Целевой город": "Manzil shahar", "Часы": "Soat", "Минуты": "Daqiqa",
  "Текущее время": "Joriy vaqt", "День": "Kun", "Ночь": "Tun", "Рабочее": "Ish vaqti", "Утро / Вечер": "Ertalab / kechqurun",
  "Европа": "Yevropa", "Азия": "Osiyo", "Северная Америка": "Shimoliy Amerika", "Южная Америка": "Janubiy Amerika", "Африка": "Afrika", "Океания": "Okeaniya",
  "Фильтр по смещению UTC": "UTC farqi bo‘yicha filtr", "Интерактивная карта часовых поясов": "Interaktiv vaqt mintaqalari xaritasi",
  "Добавить в планировщик встречи": "Uchrashuv rejasiga qo‘shish",
};

function dictionary(locale: Locale) {
  if (locale === "ru") return {};
  const ui = locale === "en" ? { ...EN, ...EN_EXTRA } : { ...UZ, ...UZ_EXTRA };
  const cities: Record<string, string> = {};
  for (const city of ALL_WORLD_CITIES) {
    cities[city.cityRu] = city.city;
    cities[city.countryRu] = city.country;
  }
  return { ...ui, ...cities };
}
function translate(value: string, dict: Record<string, string>) {
  let output = value;
  for (const [from, to] of Object.entries(dict).sort((a,b) => b[0].length-a[0].length)) output = output.replaceAll(from, to);
  return output;
}
function translateTree(root: HTMLElement, dict: Record<string, string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.textContent) {
      const translated = translate(node.textContent, dict);
      if (translated !== node.textContent) node.textContent = translated;
    }
    node = walker.nextNode();
  }
  root.querySelectorAll<HTMLElement>("[title],[aria-label],[placeholder]").forEach((el) => ["title","aria-label","placeholder"].forEach((attr) => {
    const value=el.getAttribute(attr);
    if(value) {
      const translated=translate(value,dict);
      if(translated !== value) el.setAttribute(attr,translated);
    }
  }));
}
export function TimezoneLocaleBoundary({ locale, children }: { locale: Locale; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root=ref.current, dict=dictionary(locale); if(!root || locale==="ru") return;
    translateTree(root,dict); const observer=new MutationObserver(()=>translateTree(root,dict)); observer.observe(root,{childList:true,subtree:true,characterData:true}); return()=>observer.disconnect();
  },[locale]);
  return <div ref={ref}>{children}</div>;
}
