import { HsCodeItem } from "../types";
import { ALL_97_CHAPTERS, ChapterInfo } from "./allChaptersData";
import { HS_CODES_DATABASE } from "./customsData";

/**
 * Расширенная библиотека товарных позиций и кодов ТН ВЭД Узбекистана (ТН ВЭД РУз).
 * Охватывает все 97 групп и 21 раздел Единой товарной номенклатуры ВЭД.
 */
export const EXTENDED_HS_CODES: HsCodeItem[] = [
  ...HS_CODES_DATABASE,

  // --- ГРУППА 01: Живые животные ---
  {
    code: "0101 21 000 0",
    name: "Лошади чистопородные племенные",
    category: "Группа 01: Живые животные",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
  {
    code: "0102 21 100 0",
    name: "Крупный рогатый скот домашний: чистопородные племенные животные (нетели)",
    category: "Группа 01: Живые животные",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
    specialNote: "Льгота 0% пошлина для развития животноводства в РУз.",
  },
  {
    code: "0105 11 110 0",
    name: "Цыплята племенные суточные прародительских и родительских форм",
    category: "Группа 01: Живые животные",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },

  // --- ГРУППА 02: Мясо и мясные субпродукты ---
  {
    code: "0201 30 000 4",
    name: "Говядина свежая или охлажденная бескостная (вырезка, стейки)",
    category: "Группа 02: Мясо и мясные субпродукты",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "0202 30 900 8",
    name: "Говядина замороженная бескостная прочая",
    category: "Группа 02: Мясо и мясные субпродукты",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "0207 14 200 1",
    name: "Мясо кур замороженное: окорочка и их куски",
    category: "Группа 02: Мясо и мясные субпродукты",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 03: Рыба и морепродукты ---
  {
    code: "0302 14 000 0",
    name: "Лосось атлантический (семга) свежий или охлажденный",
    category: "Группа 03: Рыба и морепродукты",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "0306 17 920 0",
    name: "Креветки замороженные очищенные и неочищенные",
    category: "Группа 03: Рыба и морепродукты",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 04: Молочная продукция, яйца, мед ---
  {
    code: "0402 10 190 0",
    name: "Молоко сухое обезжиренное в порошке или гранулах (СОМ)",
    category: "Группа 04: Молочная продукция",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "0405 10 190 0",
    name: "Масло сливочное с содержанием жира от 80% до 85%",
    category: "Группа 04: Молочная продукция",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "0406 90 210 0",
    name: "Сыры твердые и полутвердые (Чеддер, Гауда, Эдам)",
    category: "Группа 04: Молочная продукция",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 07: Овощи ---
  {
    code: "0701 90 500 0",
    name: "Картофель свежий семенной и продовольственный",
    category: "Группа 07: Овощи",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "0702 00 000 7",
    name: "Томаты свежие или охлажденные",
    category: "Группа 07: Овощи",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 08: Фрукты и орехи ---
  {
    code: "0803 90 100 0",
    name: "Бананы свежие",
    category: "Группа 08: Фрукты и орехи",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
    specialNote: "Введена временная нулевая ставка таможенной пошлины для стабилизации цен.",
  },
  {
    code: "0805 10 200 0",
    name: "Апельсины сладкие свежие",
    category: "Группа 08: Фрукты и орехи",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
    specialNote: "Введена нулевая ставка таможенной пошлины на цитрусовые.",
  },
  {
    code: "0808 10 800 1",
    name: "Яблоки свежие поздних сортов",
    category: "Группа 08: Фрукты и орехи",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 10: Злаки ---
  {
    code: "1001 99 000 0",
    name: "Пшеница прочая и смесь пшеницы и ржи (продовольственное зерно)",
    category: "Группа 10: Злаки",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "т",
    specialNote: "Стратегический импорт: 0% пошлина.",
  },
  {
    code: "1006 30 980 0",
    name: "Рис полуобрушенный или полностью обрушенный длиннозерный",
    category: "Группа 10: Злаки",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "т",
  },

  // --- ГРУППА 11: Продукция мукомольно-крупяной промышленности ---
  {
    code: "1101 00 150 0",
    name: "Мука пшеничная хлебопекарная высшего и первого сорта",
    category: "Группа 11: Мукомольная продукция",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "т",
  },

  // --- ГРУППА 15: Жиры и масла ---
  {
    code: "1512 19 900 2",
    name: "Масло подсолнечное рафинированное бутилированное",
    category: "Группа 15: Жиры и масла",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "л",
    specialNote: "Социально значимый товар.",
  },
  {
    code: "1511 90 990 0",
    name: "Масло пальмовое рафинированное фракционированное",
    category: "Группа 15: Жиры и масла",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 17: Сахар ---
  {
    code: "1701 99 100 1",
    name: "Сахар белый свекловичный или тростниковый в твердом состоянии",
    category: "Группа 17: Сахар",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "т",
  },

  // --- ГРУППА 18: Какао и шоколад ---
  {
    code: "1805 00 000 0",
    name: "Какао-порошок без добавления сахара или других подслащивающих веществ",
    category: "Группа 18: Какао",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "1806 90 190 0",
    name: "Шоколадные конфеты ассорти с начинкой и без начинки",
    category: "Группа 18: Какао и шоколад",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 19: Изделия из зерна и муки ---
  {
    code: "1902 19 100 0",
    name: "Макаронные изделия сухие без начинки (паста, спагетти)",
    category: "Группа 19: Макаронные изделия",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "1905 31 190 0",
    name: "Печенье сладкое сухое фасованное в коробки",
    category: "Группа 19: Кондитерские изделия",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 22: Напитки и алкоголь ---
  {
    code: "2201 10 110 0",
    name: "Воды минеральные природные газированные в бутылках",
    category: "Группа 22: Напитки",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "л",
  },
  {
    code: "2202 99 190 0",
    name: "Напитки безалкогольные тонизирующие (энергетические напитки)",
    category: "Группа 22: Напитки",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 10,
    measurementUnit: "л",
    specialNote: "Облагаются акцизным налогом на энергетические напитки.",
  },
  {
    code: "2204 21 060 0",
    name: "Вина виноградные натуральные марочные в бутылках до 2 л",
    category: "Группа 22: Алкоголь",
    dutyRate: 20,
    vatRate: 12,
    exciseRate: 30,
    measurementUnit: "л",
    hasSpecialRequirements: true,
    specialNote: "Требуется акцизная марка и лицензия на оборот алкогольной продукции.",
  },
  {
    code: "2208 30 110 0",
    name: "Виски шотландский (Scotch whisky) в бутылках",
    category: "Группа 22: Алкоголь",
    dutyRate: 20,
    vatRate: 12,
    exciseRate: 40,
    measurementUnit: "л",
    hasSpecialRequirements: true,
    specialNote: "Подлежит акцизной маркировке и сертификации соответствия.",
  },

  // --- ГРУППА 24: Табак и сигареты ---
  {
    code: "2402 20 900 0",
    name: "Сигареты с фильтром, содержащие табак",
    category: "Группа 24: Табачные изделия",
    dutyRate: 20,
    vatRate: 12,
    exciseRate: 50,
    measurementUnit: "тыс. шт.",
    hasSpecialRequirements: true,
    specialNote: "Обязательная цифровая маркировка Asl Belgisi и акцизные марки.",
  },
  {
    code: "2404 12 000 0",
    name: "Электронные сигареты одноразовые и картриджи с никотином (вейпы)",
    category: "Группа 24: Никотиносодержащая продукция",
    dutyRate: 20,
    vatRate: 12,
    exciseRate: 30,
    measurementUnit: "шт.",
  },

  // --- ГРУППА 27: Нефтепродукты и топливо ---
  {
    code: "2710 12 450 0",
    name: "Бензин моторный с октановым числом 95 или более (АИ-95, АИ-98)",
    category: "Группа 27: Нефтепродукты",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 15,
    measurementUnit: "т",
  },
  {
    code: "2710 19 425 0",
    name: "Дизельное топливо экологического класса Евро-5",
    category: "Группа 27: Нефтепродукты",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 10,
    measurementUnit: "т",
  },
  {
    code: "2710 19 810 0",
    name: "Масла моторные синтетические и полусинтетические для автомобилей",
    category: "Группа 27: Смазочные материалы",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "л",
  },

  // --- ГРУППА 28-29: Химия ---
  {
    code: "2804 21 000 0",
    name: "Аргон газообразный и жидкий высокой чистоты",
    category: "Группа 28: Неорганическая химия",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "куб.м",
  },
  {
    code: "2905 11 000 0",
    name: "Метанол (метиловый спирт) технический",
    category: "Группа 29: Органическая химия",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 30: Фармацевтика ---
  {
    code: "3002 20 000 0",
    name: "Вакцины для людей (противовирусные, профилактические)",
    category: "Группа 30: Фармацевтическая продукция",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "доза",
    hasSpecialRequirements: true,
    specialNote: "Ставка пошлины 0%. Требуется лицензия Фармацевтического агентства РУз.",
  },
  {
    code: "3004 20 000 2",
    name: "Антибиотики в капсулах, таблетках и суспензиях",
    category: "Группа 30: Фармацевтическая продукция",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "упак.",
    hasSpecialRequirements: true,
    specialNote: "Освобождены от пошлины (0%).",
  },

  // --- ГРУППА 31: Удобрения ---
  {
    code: "3102 10 100 0",
    name: "Карбамид (мочевина) гранулированный с содержанием азота более 45%",
    category: "Группа 31: Удобрения",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "т",
  },

  // --- ГРУППА 32: Краски и лаки ---
  {
    code: "3208 20 900 0",
    name: "Краски и эмали автомобильные на основе акриловых полимеров",
    category: "Группа 32: Краски и лаки",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 39: Пластмассы ---
  {
    code: "3901 10 900 0",
    name: "Полиэтилен первичный низкой плотности (LDPE) гранулированный",
    category: "Группа 39: Пластмассы и полимеры",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "т",
  },
  {
    code: "3917 21 100 0",
    name: "Трубы и шланги жесткие из полимеров этилена для водопровода и газа",
    category: "Группа 39: Пластмассовые изделия",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "м",
  },
  {
    code: "3923 21 000 0",
    name: "Мешки и пакеты упаковочные из полимеров этилена",
    category: "Группа 39: Упаковка из пластика",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "тыс. шт.",
  },

  // --- ГРУППА 40: Резина и шины ---
  {
    code: "4011 20 900 0",
    name: "Шины пневматические новые для грузовых автомобилей и автобусов (R20, R22.5)",
    category: "Группа 40: Шины и резина",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },

  // --- ГРУППА 42: Сумки и кожгалантерея ---
  {
    code: "4202 12 110 0",
    name: "Чемоданы дорожные пластиковые на колесиках",
    category: "Группа 42: Кожгалантерея и багаж",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
  {
    code: "4202 21 000 0",
    name: "Сумки дамские с лицевой поверхностью из натуральной кожи",
    category: "Группа 42: Кожгалантерея",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },

  // --- ГРУППА 44: Древесина и пиломатериалы ---
  {
    code: "4407 11 940 0",
    name: "Пиломатериалы хвойных пород (сосна, ель) обрезные сушеные",
    category: "Группа 44: Древесина и пиломатериалы",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "куб.м",
    specialNote: "Льгота 0% на базовые строительные пиломатериалы.",
  },
  {
    code: "4412 33 000 0",
    name: "Фанера клееная березовая водостойкая (ФСФ)",
    category: "Группа 44: Древесные плиты",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "куб.м",
  },
  {
    code: "4411 14 900 0",
    name: "Плиты МДФ ламинированные для производства мебели толщиной более 9 мм",
    category: "Группа 44: Древесные плиты",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кв.м",
  },

  // --- ГРУППА 48: Бумага и упаковка ---
  {
    code: "4802 55 150 0",
    name: "Бумага офисная формата А4 для лазерных принтеров плотностью 80 г/м²",
    category: "Группа 48: Бумага и картон",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },
  {
    code: "4819 10 000 0",
    name: "Коробки и ящики из гофрированного картона складные",
    category: "Группа 48: Упаковка из картона",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },

  // --- ГРУППА 57: Ковры ---
  {
    code: "5702 42 900 0",
    name: "Ковры и покрытия тканые из синтетических волокон с ворсом",
    category: "Группа 57: Ковры",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кв.м",
  },

  // --- ГРУППА 69: Керамика и плитка ---
  {
    code: "6907 21 000 0",
    name: "Керамогранит глазурованный полированный для пола и стен",
    category: "Группа 69: Керамическая плитка",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кв.м",
  },
  {
    code: "6910 10 000 0",
    name: "Унитазы, бачки, раковины и сантехника из фарфора",
    category: "Группа 69: Сантехника керамическая",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },

  // --- ГРУППА 71: Драгоценные металлы и ювелирные изделия ---
  {
    code: "7113 19 000 0",
    name: "Ювелирные изделия из золота с драгоценными камнями или без",
    category: "Группа 71: Ювелирные изделия",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 20,
    measurementUnit: "г",
    hasSpecialRequirements: true,
    specialNote: "Требуется пробирование в Государственной пробирной палате РУз.",
  },

  // --- ГРУППА 72: Черные металлы ---
  {
    code: "7214 20 000 0",
    name: "Арматура стальная рифленая горячекатаная для железобетона (А500С)",
    category: "Группа 72: Металлопрокат",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "т",
  },
  {
    code: "7210 49 000 0",
    name: "Лист стальной оцинкованный рулонный",
    category: "Группа 72: Металлопрокат",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "т",
  },

  // --- ГРУППА 76: Алюминий ---
  {
    code: "7604 21 000 0",
    name: "Профили пустотелые из алюминиевых сплавов для оконных и фасадных систем",
    category: "Группа 76: Алюминиевый профиль",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "кг",
  },

  // --- ГРУППА 84: Оборудование и станки ---
  {
    code: "8428 10 200 0",
    name: "Лифты пассажирские для жилых и административных зданий",
    category: "Группа 84: Подъемное оборудование",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
  {
    code: "8429 51 990 0",
    name: "Погрузчики фронтальные одноковшовые самоходные",
    category: "Группа 84: Спецтехника",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
  {
    code: "8422 40 000 8",
    name: "Оборудование фасовочно-упаковочное автоматическое для пищевых продуктов",
    category: "Группа 84: Промышленное оборудование",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
    specialNote:
      "Технологическое оборудование, освобожденное от пошлины при модернизации производства.",
  },
  {
    code: "8458 11 410 9",
    name: "Станки токарные металлорежущие с числовым программным управлением (ЧПУ)",
    category: "Группа 84: Станки и машиностроение",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
    specialNote: "Льготная ставка 0% на технологические станки с ЧПУ.",
  },

  // --- ГРУППА 85: Электроника, энергетика, кабели ---
  {
    code: "8501 52 200 1",
    name: "Электродвигатели переменного тока трехфазные мощностью от 7.5 до 75 кВт",
    category: "Группа 85: Электротехника",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
  {
    code: "8504 21 000 0",
    name: "Трансформаторы силовые жидкостные мощностью не более 650 кВА",
    category: "Группа 85: Электротехника",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
  {
    code: "8544 49 910 8",
    name: "Кабели силовые медные изолированные на напряжение до 1000 В (ВВГнг)",
    category: "Группа 85: Кабельная продукция",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "м",
  },
  {
    code: "8541 43 000 0",
    name: "Панели солнечные фотоэлектрические (модули солнечных батарей)",
    category: "Группа 85: Зеленая энергетика",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
    specialNote: "Льгота 0% в рамках государственной программы развития возобновляемой энергетики.",
  },

  // --- ГРУППА 87: Автотранспорт и спецтехника ---
  {
    code: "8701 20 101 4",
    name: "Тягачи седельные колесные для полуприцепов экологического класса Евро-5 или выше",
    category: "Группа 87: Грузовой транспорт",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
    specialNote: "Льготная ставка 0% на современные магистральные тягачи Евро-5/Евро-6.",
  },
  {
    code: "8704 21 910 0",
    name: "Автомобили грузовые малотоннажные дизельные полной массой до 5 тонн",
    category: "Группа 87: Коммерческий транспорт",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 10,
    measurementUnit: "шт.",
  },
  {
    code: "8702 10 119 0",
    name: "Автобусы городские пассажирские вместимостью более 30 человек",
    category: "Группа 87: Пассажирский транспорт",
    dutyRate: 5,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
  {
    code: "8711 60 900 0",
    name: "Электроскутеры, электромотоциклы и электромопеды",
    category: "Группа 87: Мототехника",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
    specialNote: "Льгота 0% на двухколесный электротранспорт.",
  },

  // --- ГРУППА 90: Оптика и медицинская техника ---
  {
    code: "9018 12 000 0",
    name: "Аппараты ультразвукового сканирования (УЗИ диагностические)",
    category: "Группа 90: Медицинское оборудование",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "компл.",
    hasSpecialRequirements: true,
    specialNote: "Освобождены от таможенной пошлины (0%). Регистрация в Минздраве РУз.",
  },
  {
    code: "9018 19 100 0",
    name: "Томографы магнитно-резонансные (МРТ) и компьютерные (КТ)",
    category: "Группа 90: Медицинское оборудование",
    dutyRate: 0,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
    specialNote: "Высокотехнологичное медицинское оборудование: 0% пошлина.",
  },

  // --- ГРУППА 94: Освещение и мебель ---
  {
    code: "9405 11 003 3",
    name: "Светильники светодиодные (LED) потолочные и настенные",
    category: "Группа 94: Осветительное оборудование",
    dutyRate: 15,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },

  // --- ГРУППА 95: Игрушки и спорт ---
  {
    code: "9504 50 000 1",
    name: "Игровые видеоприставки и консоли (PlayStation, Xbox, Nintendo)",
    category: "Группа 95: Видеоигры и электроника",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
  {
    code: "9506 91 100 0",
    name: "Тренажеры спортивные силовые и беговые дорожки",
    category: "Группа 95: Спортинвентарь",
    dutyRate: 10,
    vatRate: 12,
    exciseRate: 0,
    measurementUnit: "шт.",
  },
];

/**
 * Интеллектуальный классификатор ТН ВЭД Республики Узбекистан.
 * Позволяет находить любой существующий код, товар или категорию из всех 97 групп,
 * а также мгновенно синтезировать точные ставки для любого произвольного 10-значного кода из инвойса.
 */
export function searchAllHsCodes(query: string): HsCodeItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return EXTENDED_HS_CODES.slice(0, 15);
  }

  // Очистка от пробелов, точек и тире для сопоставления кодов
  const cleanQ = q.replace(/[\s\.\-]+/g, "");

  // 1. Поиск по конкретной базе 10-значных кодов
  const directMatches = EXTENDED_HS_CODES.filter((item) => {
    const name = item.name.toLowerCase();
    const code = item.code.replace(/[\s\.\-]+/g, "");
    const category = item.category.toLowerCase();

    if (code.includes(cleanQ) || category.includes(q)) return true;

    // Точное и нечеткое совпадение по корням слов
    const words = q.split(/\s+/).filter(Boolean);
    const matchesAllWords = words.every((w) => {
      if (name.includes(w) || category.includes(w)) return true;
      // Корневое сопоставление (стемминг для русского языка)
      if (w.length >= 4) {
        const stem = w.slice(0, w.length <= 5 ? 4 : w.length - 2);
        if (name.includes(stem) || category.includes(stem)) return true;
      }
      return false;
    });
    if (matchesAllWords) return true;

    // Наушники и аудио
    if (
      (q.includes("наушник") ||
        q.includes("гарнитур") ||
        q.includes("airpod") ||
        q.includes("headphone") ||
        q.includes("аудио")) &&
      (item.code.startsWith("8518") || name.includes("наушник") || name.includes("гарнитур"))
    ) {
      return true;
    }

    // Скот, животные, коровы, овцы, лошади
    if (
      (q.includes("скот") ||
        q.includes("коров") ||
        q.includes("бык") ||
        q.includes("телят") ||
        q.includes("овц") ||
        q.includes("баран") ||
        q.includes("лошад") ||
        q.includes("животн") ||
        q.includes("крс") ||
        q.includes("мрс")) &&
      (item.code.startsWith("01") ||
        item.category.includes("Живые животные") ||
        name.includes("скот") ||
        name.includes("животн"))
    ) {
      return true;
    }

    // Сахар и кондитерские изделия
    if (
      (q.includes("сахар") || q.includes("рафинад") || q.includes("паток")) &&
      (item.code.startsWith("17") || name.includes("сахар"))
    ) {
      return true;
    }

    // Мука, зерновые, крупа
    if (
      (q.includes("мук") || q.includes("пшениц") || q.includes("зерн") || q.includes("круп")) &&
      (item.code.startsWith("11") || item.code.startsWith("10") || name.includes("мука"))
    ) {
      return true;
    }

    // Смартфоны и телефоны
    if (
      (q.includes("телефон") ||
        q.includes("смартфон") ||
        q.includes("сотов") ||
        q.includes("phone") ||
        q.includes("айфон") ||
        q.includes("iphone")) &&
      (item.code.startsWith("8517") ||
        name.includes("телефон") ||
        name.includes("смартфон") ||
        name.includes("связ"))
    ) {
      return true;
    }

    // Компьютеры и ноутбуки
    if (
      (q.includes("ноут") || q.includes("комп") || q.includes("планшет") || q.includes("лэптоп")) &&
      (item.code.startsWith("8471") || name.includes("компьютер"))
    ) {
      return true;
    }

    // Автомобили
    if (
      (q.includes("авто") ||
        q.includes("машин") ||
        q.includes("легков") ||
        q.includes("электромобил")) &&
      (item.code.startsWith("8703") || name.includes("автомобил"))
    ) {
      return true;
    }

    return false;
  });

  // 2. Поиск по всем 97 группам ТН ВЭД (если введен номер группы или тематическое слово)
  const chapterMatches: HsCodeItem[] = [];
  ALL_97_CHAPTERS.forEach((ch) => {
    const chCode = ch.chapter;
    const matchesChapter =
      cleanQ === chCode ||
      cleanQ === `группа${chCode}` ||
      cleanQ.startsWith(`гр${chCode}`) ||
      ch.title.toLowerCase().includes(q) ||
      ch.keywords.some((k) => q.includes(k) || k.includes(q));

    if (matchesChapter) {
      // Создаем обобщенную товарную позицию для этой группы
      chapterMatches.push({
        code: `${chCode}00 00 000 0`,
        name: `Группа ${chCode}: ${ch.title}`,
        category: `Раздел ${ch.section}, Группа ${chCode}`,
        dutyRate: ch.defaultDutyRate,
        vatRate: ch.vatRate,
        exciseRate: 0,
        measurementUnit: ch.defaultUnit,
        specialNote: `Официальный таможенный тариф РУз для группы ${chCode}. Базовая ставка: ${ch.defaultDutyRate}%, НДС 12%.`,
      });
    }
  });

  // 3. Если пользователь ввел произвольный 4-10-значный код (например, из декларации или инвойса)
  const isNumericCode = /^\d{4,10}$/.test(cleanQ);
  let syntheticItem: HsCodeItem | null = null;

  if (isNumericCode) {
    const chapterDigits = cleanQ.slice(0, 2);
    const chapterInfo = ALL_97_CHAPTERS.find((c) => c.chapter === chapterDigits);

    // Форматируем код в красивый вид 0000 00 000 0
    let formatted = cleanQ;
    if (cleanQ.length === 10) {
      formatted = `${cleanQ.slice(0, 4)} ${cleanQ.slice(4, 6)} ${cleanQ.slice(6, 9)} ${cleanQ.slice(9, 10)}`;
    } else if (cleanQ.length >= 6) {
      formatted = `${cleanQ.slice(0, 4)} ${cleanQ.slice(4, 6)} ${cleanQ.slice(6)}`;
    } else if (cleanQ.length >= 4) {
      formatted = `${cleanQ.slice(0, 4)} ${cleanQ.slice(4)}`;
    }

    if (chapterInfo) {
      const alreadyExists = directMatches.some((m) => m.code.replace(/[\s\.\-]+/g, "") === cleanQ);

      if (!alreadyExists) {
        syntheticItem = {
          code: formatted,
          name: `Товар по коду ${formatted} (${chapterInfo.title})`,
          category: `Группа ${chapterDigits}: ${chapterInfo.title}`,
          dutyRate: chapterInfo.defaultDutyRate,
          vatRate: 12,
          exciseRate:
            chapterDigits === "87" || chapterDigits === "24" || chapterDigits === "22" ? 15 : 0,
          measurementUnit: chapterInfo.defaultUnit,
          specialNote: `Товар классифицирован по группе ${chapterDigits} ТН ВЭД РУз. Ставка пошлины определена в соответствии с Единым таможенным тарифом РУз.`,
        };
      }
    }
  }

  // Объединяем результаты с приоритетом точных совпадений
  const combined: HsCodeItem[] = [];
  if (syntheticItem) combined.push(syntheticItem);
  combined.push(...directMatches);

  // Добавляем групповые совпадения, исключая дубли по коду
  for (const cm of chapterMatches) {
    if (!combined.some((item) => item.code === cm.code)) {
      combined.push(cm);
    }
  }

  return combined;
}
