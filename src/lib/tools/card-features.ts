import type { Localized } from "@/lib/tools/catalog";

type ToolCardFeatureSet = [Localized, Localized, Localized];

const feature = (ru: string, en: string, uz: string): Localized => ({ ru, en, uz });

export const TOOL_CARD_FEATURES: Record<string, ToolCardFeatureSet> = {
  "qr-generator": [
    feature("Ссылки, Wi-Fi и контакты", "Links, Wi-Fi & contacts", "Havola, Wi-Fi va kontaktlar"),
    feature("Цвета и логотип", "Colors & logo", "Ranglar va logotip"),
    feature("PNG, SVG и PDF", "PNG, SVG & PDF", "PNG, SVG va PDF"),
  ],
  "color-palette": [
    feature("Гармоничные схемы", "Harmony schemes", "Uyg‘un rang sxemalari"),
    feature("HEX, RGB и HSL", "HEX, RGB & HSL", "HEX, RGB va HSL"),
    feature("Экспорт палитры", "Palette export", "Palitrani eksport qilish"),
  ],
  "image-resize": [
    feature("Размер и обрезка", "Resize & crop", "O‘lcham va qirqish"),
    feature("JPG, PNG и WebP", "JPG, PNG & WebP", "JPG, PNG va WebP"),
    feature("Сжатие файла", "File compression", "Faylni siqish"),
  ],
  "barcode-generator": [
    feature("EAN, Code128 и Code39", "EAN, Code128 & Code39", "EAN, Code128 va Code39"),
    feature("Размер и подписи", "Size & labels", "O‘lcham va yozuvlar"),
    feature("SVG, PNG и PDF", "SVG, PNG & PDF", "SVG, PNG va PDF"),
  ],
  "cmyk-convert": [
    feature("RGB, HEX и HSL", "RGB, HEX & HSL", "RGB, HEX va HSL"),
    feature("Симуляция печати", "Print simulation", "Bosmani simulyatsiya qilish"),
    feature("Подбор Pantone", "Pantone matching", "Pantone tanlash"),
  ],
  "cargo-volume": [
    feature("Коробки и паллеты", "Boxes & pallets", "Qutilar va tagliklar"),
    feature("Объём и вес", "Volume & weight", "Hajm va og‘irlik"),
    feature("План загрузки", "Loading plan", "Yuklash rejasi"),
  ],
  "shipping-cost": [
    feature("Вес и расстояние", "Weight & distance", "Og‘irlik va masofa"),
    feature("Тарифы и доплаты", "Rates & surcharges", "Tariflar va qo‘shimchalar"),
    feature("Оценка стоимости", "Cost estimate", "Narxni baholash"),
  ],
  "route-planner": [
    feature("Несколько остановок", "Multiple stops", "Bir nechta bekat"),
    feature("Время и расстояние", "Time & distance", "Vaqt va masofa"),
    feature("Оптимальный маршрут", "Optimized route", "Optimal yo‘nalish"),
  ],
  "customs-calculator": [
    feature("Пошлина, НДС и сборы", "Duty, VAT & fees", "Boj, QQS va yig‘imlar"),
    feature("Несколько валют", "Multiple currencies", "Bir nechta valyuta"),
    feature("Полная стоимость", "Landed cost", "To‘liq qiymat"),
  ],
  "vat-calculator": [
    feature("Начисление НДС", "Add VAT", "QQS qo‘shish"),
    feature("Выделение НДС", "Extract VAT", "QQSni ajratish"),
    feature("Своя ставка", "Custom rate", "Maxsus stavka"),
  ],
  "currency-rates": [
    feature("Официальные курсы ЦБ", "Official CBU rates", "MB rasmiy kurslari"),
    feature("Конвертер валют", "Currency converter", "Valyuta konverteri"),
    feature("График изменений", "Change chart", "O‘zgarish grafigi"),
  ],
  "invoice-number": [
    feature("Гибкий шаблон", "Flexible template", "Moslashuvchan shablon"),
    feature("Префикс и дата", "Prefix & date", "Prefiks va sana"),
    feature("Сквозная нумерация", "Number sequence", "Ketma-ket raqamlash"),
  ],
  "invoice-generator": [
    feature("Товары и услуги", "Goods & services", "Tovarlar va xizmatlar"),
    feature("Налоги и итоги", "Taxes & totals", "Soliqlar va yakunlar"),
    feature("Экспорт в PDF", "PDF export", "PDF eksport"),
  ],
  "workday-calculator": [
    feature("Рабочие дни", "Working days", "Ish kunlari"),
    feature("Выходные и праздники", "Weekends & holidays", "Dam olish va bayramlar"),
    feature("Расчёт срока", "Deadline calculation", "Muddatni hisoblash"),
  ],
  "smart-calendar": [
    feature("Производственный календарь", "Production calendar", "Ishlab chiqarish taqvimi"),
    feature("Рабочие дни и сроки", "Workdays & deadlines", "Ish kunlari va muddatlar"),
    feature("PDF и нормы часов", "PDF & labor-hour norms", "PDF va ish vaqti me’yorlari"),
  ],
  "text-symbol-generator": [
    feature("Более 30 стилей", "30+ text styles", "30 dan ortiq uslub"),
    feature("Символы и эмодзи", "Symbols & emoji", "Belgilar va emoji"),
    feature("Копирование текста", "Instant copy", "Matnni nusxalash"),
  ],
  "word-counter": [
    feature("Слова и символы", "Words & characters", "So‘zlar va belgilar"),
    feature("Время чтения", "Reading time", "O‘qish vaqti"),
    feature("Статистика текста", "Text statistics", "Matn statistikasi"),
  ],
  "case-converter": [
    feature("UPPER и lower case", "UPPER & lower case", "UPPER va lower case"),
    feature("Заголовки и предложения", "Title & sentence case", "Sarlavha va gap registri"),
    feature("Мгновенная правка", "Instant conversion", "Tezkor o‘zgartirish"),
  ],
  "password-generator": [
    feature("Длина и сложность", "Length & strength", "Uzunlik va murakkablik"),
    feature("Цифры и символы", "Numbers & symbols", "Raqamlar va belgilar"),
    feature("Локальная генерация", "Local generation", "Mahalliy yaratish"),
  ],
  "unit-converter": [
    feature("Длина и вес", "Length & weight", "Uzunlik va og‘irlik"),
    feature("Температура и объём", "Temperature & volume", "Harorat va hajm"),
    feature("Быстрый пересчёт", "Instant conversion", "Tezkor o‘girish"),
  ],
  "world-timezones": [
    feature("Точное местное время", "Live local time", "Aniq mahalliy vaqt"),
    feature("Планировщик встреч", "Meeting planner", "Uchrashuv rejalashtirgichi"),
    feature("Карта часовых поясов", "Time-zone map", "Vaqt mintaqalari xaritasi"),
  ],
  "json-formatter": [
    feature("Форматирование JSON", "JSON formatting", "JSON formatlash"),
    feature("Проверка синтаксиса", "Syntax validation", "Sintaksisni tekshirish"),
    feature("Минификация и копия", "Minify & copy", "Siqish va nusxalash"),
  ],
  base64: [
    feature("Кодирование", "Encoding", "Kodlash"),
    feature("Декодирование", "Decoding", "Dekodlash"),
    feature("Текст и файлы", "Text & files", "Matn va fayllar"),
  ],
  "uuid-generator": [
    feature("UUID v1, v3, v4 и v5", "UUID v1, v3, v4 & v5", "UUID v1, v3, v4 va v5"),
    feature("Пакетная генерация", "Batch generation", "Ommaviy yaratish"),
    feature("Копия и экспорт", "Copy & export", "Nusxa va eksport"),
  ],
  "roof-calculator": [
    feature("Четыре типа крыши", "Four roof types", "To‘rt xil tom turi"),
    feature("Расчёт материалов", "Material calculation", "Materiallar hisobi"),
    feature("Предварительная смета", "Cost estimate", "Dastlabki smeta"),
  ],
  "area-calculator": [
    feature("Комнаты и стены", "Rooms & walls", "Xonalar va devorlar"),
    feature("Двери и окна", "Doors & windows", "Eshiklar va derazalar"),
    feature("Количество материалов", "Material quantity", "Materiallar miqdori"),
  ],
  "scale-converter": [
    feature("Масштаб чертежа", "Drawing scale", "Chizma masshtabi"),
    feature("Перевод размеров", "Dimension conversion", "O‘lchamlarni o‘girish"),
    feature("Популярные масштабы", "Common scales", "Ommabop masshtablar"),
  ],
};
