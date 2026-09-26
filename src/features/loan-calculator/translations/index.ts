export type Language = "ru" | "en" | "uz";

export interface Translations {
  nav: {
    brandSubtitle: string;
    searchPlaceholder: string;
    searchShortcut: string;
    history: string;
    language: string;
    themeLight: string;
    themeDark: string;
    login: string;
  };
  hero: {
    title: string;
    subtitle: string;
    badge1Title: string;
    badge1Desc: string;
    badge2Title: string;
    badge2Desc: string;
    badge3Title: string;
    badge3Desc: string;
  };
  form: {
    step1Title: string;
    annuityTitle: string;
    annuityDesc: string;
    diffTitle: string;
    diffDesc: string;
    step2Title: string;
    loanAmount: string;
    currencyLabel: string;
    quick: string;
    loanTerm: string;
    monthsUnit: string;
    yearsUnit: string;
    interestRate: string;
    worldRates: string;
    roundToInteger: string;
    step3Title: string;
    downPayment: string;
    loanPurpose: string;
    loanPurposePlaceholder: string;
    loanNotes: string;
    loanNotesPlaceholder: string;
    oneTimeFees: string;
    annualInsurance: string;
    calculate: string;
    reset: string;
  };
  result: {
    title: string;
    copy: string;
    copied: string;
    download: string;
    exportPdf: string;
    exportCsv: string;
    printReport: string;
    successBanner: string;
    monthlyPayment: string;
    differentiatedNote: string;
    overpayment: string;
    ofAmount: string;
    totalWithInterest: string;
    effectiveApr: string;
    detailsTitle: string;
    indicatorCol: string;
    valueCol: string;
    loanAmount: string;
    downPayment: string;
    loanTerm: string;
    monthsWord: string;
    ratePerAnnum: string;
    paymentType: string;
    annuityFull: string;
    diffFull: string;
    overpaymentSum: string;
    totalToRepay: string;
    purposeOrName: string;
    defaultPurpose: string;
    amountInWords: string;
    formulaTitle: string;
    inYourCase: string;
    firstMonth: string;
    lastMonth: string;
    toggleScheduleShow: string;
    toggleScheduleHide: string;
  };
  chart: {
    title: string;
    principal: string;
    interest: string;
    balance: string;
    month: string;
    payment: string;
  };
  table: {
    title: string;
    subtitle: string;
    allYears: string;
    yearSuffix: string;
    colNum: string;
    colPayment: string;
    colPrincipal: string;
    colInterest: string;
    colBalance: string;
    totalRow: string;
    exportCsv: string;
    exportPdf: string;
    showingRows: string;
  };
  rates: {
    title: string;
    ratesCountSuffix: string;
    description: string;
    filterMortgage: string;
    filterConsumer: string;
    filterAuto: string;
    filterAll: string;
    searchPlaceholder: string;
    noRatesFound: string;
    setRateTitle: string;
    examplesTitle: string;
    examplesTabConsumer: string;
    examplesTabAuto: string;
    examplesTabMortgage: string;
    colAmount: string;
    colTerm: string;
    colPayment: string;
    examplesHint: string;
    categoryMortgage: string;
    categoryConsumer: string;
    categoryAuto: string;
  };
  bottom: {
    headerTitle: string;
    headerSubtitle: string;
    infoTabTitle: string;
    infoTabSubtitle: string;
    faqTabTitle: string;
    faqTabSubtitle: string;
    tipsTabTitle: string;
    tipsTabSubtitle: string;
    infoSection: {
      annuityHeading: string;
      annuityText: string;
      diffHeading: string;
      diffText: string;
      dtiHeading: string;
      dtiText: string;
      aprHeading: string;
      aprText: string;
      currencyHeading: string;
      currencyText: string;
    };
    faqItems: { q: string; a: string }[];
    tipsSection: {
      tip1Title: string;
      tip1Desc: string;
      tip2Title: string;
      tip2Desc: string;
      tip3Title: string;
      tip3Desc: string;
      tip4Title: string;
      tip4Desc: string;
      tip5Title: string;
      tip5Desc: string;
    };
  };
  modals: {
    searchTitle: string;
    searchPlaceholder: string;
    toolsNotFound: string;
    currentTag: string;
    historyTitle: string;
    historySubtitle: string;
    historyEmpty: string;
    loadBtn: string;
    deleteBtn: string;
    clearAllBtn: string;
    totalRecords: string;
    pdfModalTitle: string;
    pdfModalSubtitle: string;
    pdfDownloadBtn: string;
    pdfGenerating: string;
    pdfDownloaded: string;
    pdfPrintBtn: string;
    pdfServiceTag: string;
    pdfDocTitle: string;
    pdfCreatedDate: string;
    pdfSec1Title: string;
    pdfSec2Title: string;
    pdfSec3Title: string;
    pdfFirst12Months: string;
    pdfSignBank: string;
    pdfSignBorrower: string;
    pdfDisclaimer: string;
  };
  toasts: {
    rateSet: string;
    exampleLoaded: string;
    historyLoaded: string;
    historyCleared: string;
    calcSaved: string;
    copiedClipboard: string;
    paramsReset: string;
  };
  mobile: {
    tabCalc: string;
    tabResult: string;
    tabRates: string;
    tabInfo: string;
    viewModeTabs: string;
    viewModeAll: string;
    perMonth: string;
    viewResult: string;
    applyRateAndCalc: string;
    autoRatesFirstNotice: string;
    quickSummary: string;
    editParams: string;
    monthlyPaymentShort: string;
    swipeTableHint: string;
  };
  meta: {
    pageTitle: string;
    pageDescription: string;
  };
}

export const translations: Record<Language, Translations> = {
  ru: {
    nav: {
      brandSubtitle: "Инструменты и расчёты",
      searchPlaceholder: "Поиск инструментов: калькуляторы, конвертеры, финансы...",
      searchShortcut: "Ctrl K",
      history: "История",
      language: "Русский",
      themeLight: "Переключить на светлую тему",
      themeDark: "Переключить на тёмную тему",
      login: "Войти",
    },
    hero: {
      title: "Кредитный калькулятор",
      subtitle:
        "Точный расчёт ежемесячного платежа, переплаты, эффективной ставки (APR) и графика выплат. Подходит для потребительских кредитов, автокредитов и ипотеки.",
      badge1Title: "Актуальные данные",
      badge1Desc: "Мировые ставки 2026",
      badge2Title: "Мгновенный отчёт",
      badge2Desc: "Экспорт в PDF и печать",
      badge3Title: "2 типа платежей",
      badge3Desc: "Аннуитет и дифференц.",
    },
    form: {
      step1Title: "1. Выберите режим расчёта",
      annuityTitle: "Аннуитетный",
      annuityDesc: "Равные платежи каждый месяц",
      diffTitle: "Дифференцир.",
      diffDesc: "Платежи уменьшаются",
      step2Title: "2. Введите данные",
      loanAmount: "Сумма кредита",
      currencyLabel: "Валюта кредита",
      quick: "Быстро:",
      loanTerm: "Срок кредита",
      monthsUnit: "месяцев",
      yearsUnit: "г.",
      interestRate: "Ставка по кредиту (% годовых)",
      worldRates: "Мировые ставки",
      roundToInteger: "Округлять до целых значений",
      step3Title: "3. Дополнительно (необязательно)",
      downPayment: "Первоначальный взнос",
      loanPurpose: "Цель кредита / Наименование",
      loanPurposePlaceholder: "Например: Покупка жилья или Автокредит",
      loanNotes: "Примечание к расчёту",
      loanNotesPlaceholder: "Номер договора, банк или условия субсидии...",
      oneTimeFees: "Разовые комиссии",
      annualInsurance: "Страхование (в год)",
      calculate: "Рассчитать",
      reset: "Сбросить",
    },
    result: {
      title: "Результат",
      copy: "Скопировать",
      copied: "Скопировано",
      download: "Скачать",
      exportPdf: "Экспорт в PDF",
      exportCsv: "Таблица CSV (Excel)",
      printReport: "Печать отчёта",
      successBanner: "Расчёт выполнен успешно!",
      monthlyPayment: "Ежемесячный платёж",
      differentiatedNote: "(дифференцированный)",
      overpayment: "Переплата",
      ofAmount: "% от суммы",
      totalWithInterest: "Итого с процентами",
      effectiveApr: "полная стоимость (ПСК)",
      detailsTitle: "ДЕТАЛИЗАЦИЯ РАСЧЁТА",
      indicatorCol: "Показатель",
      valueCol: "Значение",
      loanAmount: "Сумма кредита",
      downPayment: "Первоначальный взнос",
      loanTerm: "Срок кредита",
      monthsWord: "месяцев",
      ratePerAnnum: "% годовых",
      paymentType: "Тип платежей",
      annuityFull: "Аннуитетный (равными долями)",
      diffFull: "Дифференцированный (убывающий)",
      overpaymentSum: "Сумма переплаты",
      totalToRepay: "Итого к выплате",
      purposeOrName: "Наименование",
      defaultPurpose: "Потребительский кредит / Авто / Ипотека",
      amountInWords: "сумма прописью:",
      formulaTitle: "ФОРМУЛА РАСЧЁТА",
      inYourCase: "В вашем случае:",
      firstMonth: "первый месяц",
      lastMonth: "последний",
      toggleScheduleShow: "Показать график и подробную таблицу выплат",
      toggleScheduleHide: "Скрыть график и таблицу выплат",
    },
    chart: {
      title: "График платежей",
      principal: "Основной долг",
      interest: "Проценты",
      balance: "Остаток",
      month: "Месяц",
      payment: "Платёж",
    },
    table: {
      title: "Детальный график платежей",
      subtitle: "Помесячная раскладка основного долга и процентов на весь срок",
      allYears: "Все",
      yearSuffix: "г.",
      colNum: "№",
      colPayment: "Платёж",
      colPrincipal: "Основной долг",
      colInterest: "Проценты",
      colBalance: "Остаток долга",
      totalRow: "Итого за весь срок:",
      exportCsv: "Скачать CSV",
      exportPdf: "Экспорт PDF",
      showingRows: "Отображено месяцев:",
    },
    rates: {
      title: "Ставки по кредитам в мире",
      ratesCountSuffix: "ставок",
      description:
        "Все мировые ставки полностью развёрнуты. Кликните по любой ставке, чтобы применить её в расчёте:",
      filterMortgage: "Ипотека",
      filterConsumer: "Потребительская",
      filterAuto: "Авто",
      filterAll: "Все",
      searchPlaceholder: "Быстрый поиск страны или займа...",
      noRatesFound: "Ставки не найдены по запросу",
      setRateTitle: "Установить ставку",
      examplesTitle: "Примеры расчёта",
      examplesTabConsumer: "Потреб.",
      examplesTabAuto: "Авто",
      examplesTabMortgage: "Ипотека",
      colAmount: "Сумма...",
      colTerm: "Срок...",
      colPayment: "Платёж...",
      examplesHint: "Кликните по строке для загрузки параметров",
      categoryMortgage: "Ипотека",
      categoryConsumer: "Потреб",
      categoryAuto: "Авто",
    },
    bottom: {
      headerTitle: "Справочные материалы и рекомендации финансистов",
      headerSubtitle: "Международные финансовые стандарты расчёта",
      infoTabTitle: "Полезная информация",
      infoTabSubtitle: "Стандарты расчётов, формулы, APR",
      faqTabTitle: "Частые вопросы (FAQ)",
      faqTabSubtitle: "8 экспертных ответов на важные вопросы",
      tipsTabTitle: "Советы финансистов",
      tipsTabSubtitle: "Практические правила экономии на кредите",
      infoSection: {
        annuityHeading: "Аннуитетный платёж (Fixed Amortized)",
        annuityText:
          "Международный стандарт (США, ЕС, Азия, СНГ). Сумма ежемесячного взноса постоянна. Формула: P = S × (r × (1+r)ⁿ) / ((1+r)ⁿ - 1). Удобно для планирования семейного бюджета, но в первой трети срока заёмщик выплачивает преимущественно начисленные банком проценты.",
        diffHeading: "Дифференцированный платёж (Reducing Balance)",
        diffText:
          "Тело кредита гасится строго равными долями: S / n, а проценты начисляются на остаток. В результате платёж уменьшается каждый месяц. Совокупная переплата на 10-25% ниже, чем при аннуитете, но начальные платежи заметно выше.",
        dtiHeading: "Показатель долговой нагрузки (DTI / ПДН)",
        dtiText:
          "Отношение всех ежемесячных выплат по займам к чистому доходу семьи. Безопасным уровнем считается показатель до 35-40%. При превышении 50% резко возрастает риск дефолта, а банки отказывают в выдаче или повышают ставку.",
        aprHeading: "Полная стоимость кредита (APR / ПСК)",
        aprText:
          "Реальная эффективная процентная ставка с учётом всех скрытых банковских комиссий, сборов за выдачу и обязательного ежегодного страхования залога и жизни.",
        currencyHeading: "Валютные риски и девальвация",
        currencyText:
          "Золотое правило финансистов: брать кредит только в той валюте, в которой вы стабильно получаете заработную плату. Низкая номинальная ставка в валюте (USD/EUR) не компенсирует риски скачка курса.",
      },
      faqItems: [
        {
          q: "1. В чём ключевое отличие аннуитетного платежа от дифференцированного?",
          a: "При аннуитетном графике сумма ежемесячного платежа остаётся строго одинаковой на протяжении всего срока кредита. В первой трети срока до 70-80% платежа уходит на погашение начисленных процентов банка, и лишь малая часть — на уменьшение основного долга. При дифференцированном платеже сумма основного долга делится равными долями на весь срок, а проценты начисляются на фактический остаток задолженности. Поэтому в первые месяцы платёж максимален, но затем снижается с каждым месяцем.",
        },
        {
          q: "2. Какой график выплат финансово выгоднее выбрать?",
          a: "Дифференцированный график математически всегда выгоднее по совокупной переплате: экономия на процентах составляет от 10% до 25% в зависимости от срока и ставки. Однако аннуитет проще планировать в семейном бюджете, и он требует меньшего подтверждённого дохода на этапе одобрения в банке, так как первый платёж не завышен.",
        },
        {
          q: "3. Что выгоднее при досрочном погашении: сокращать срок или уменьшать платёж?",
          a: "Сокращение срока кредита даёт максимальную финансовую экономию, так как проценты перестают начисляться за отрезанные будущие месяцы. Уменьшение суммы платежа при сохранении срока даёт меньшую экономию на процентах, но снижает ежемесячную долговую нагрузку и освобождает денежный поток, что безопаснее при нестабильном доходе.",
        },
        {
          q: "4. Как валюта кредита влияет на процентную ставку и риски?",
          a: "Кредиты в стабильных мировых валютах (USD, EUR) обычно имеют более низкую процентную ставку (3-7%), отражая монетарную политику ФРС и ЕЦБ. Ставки в национальных валютах с более высокой инфляцией (рубли, тенге, сумы) выше (14-25%). Главное правило личных финансов: брать кредит только в той валюте, в которой вы получаете основной доход. Иначе девальвация национальной валюты может кратно увеличить платёж в пересчёте на зарплату.",
        },
        {
          q: "5. Что такое показатель долговой нагрузки (DTI / ПДН)?",
          a: "DTI (Debt-to-Income ratio) — это отношение ежемесячных выплат по всем кредитам заёмщика к его чистому ежемесячному доходу. Международные банковские стандарты рекомендуют удерживать DTI ниже 35-40%. Если показатель превышает 50%, банк сочтёт заёмщика высокорискованным и может отказать в выдаче или повысить процентную ставку.",
        },
        {
          q: "6. Почему при ипотеке на 20-30 лет переплата может превысить сумму займа?",
          a: "При длительном сроке работает эффект сложного процента: банк начисляет проценты на непогашенный остаток каждый месяц в течение сотен периодов (240-360 месяцев). Даже при умеренной ставке 7-9% годовых за 25-30 лет заёмщик суммарно выплачивает банку в 1.5–2.5 раза больше, чем брал изначально. Именно поэтому досрочные платежи даже небольшими суммами на ранних стадиях дают колоссальный эффект.",
        },
        {
          q: "7. Как учитываются комиссии и ежегодная страховка в полной стоимости (APR)?",
          a: "Полная стоимость кредита (APR / ПСК) включает не только базовую ставку, но и разовые сборы (рассмотрение заявки, оценка имущества, выдача наличных) и периодические платежи (страхование залога и жизни заёмщика). Наш калькулятор распределяет эти затраты по всему сроку кредита и показывает реальную эффективную ставку, позволяя честно сравнивать предложения разных банков.",
        },
        {
          q: "8. Как банки начисляют проценты: по дням или по месяцам?",
          a: "Большинство мировых банков ведут начисление процентов по фактическому количеству дней (метод Actual/365 или Actual/360). Процент рассчитывается ежедневно на остаток задолженности на конец операционного дня: ОД × (Ставка / Количество дней в году) × Количество дней в расчётном периоде. В месяцах с 31 днём начисленный процент чуть выше, чем в феврале с 28 днями.",
        },
      ],
      tipsSection: {
        tip1Title: "Первоначальный взнос 20-30%",
        tip1Desc:
          "Уменьшает размер займа, ставку банка и избавляет от необходимости оформления дорогостоящей дополнительной страховки залога.",
        tip2Title: "Платежи не более 30% дохода",
        tip2Desc:
          "Комфортный уровень долговой нагрузки защищает семейный бюджет от непредвиденных кризисов, потери работы или изменения расходов.",
        tip3Title: "Досрочные погашения в первые годы",
        tip3Desc:
          "Даже лишние $50 или 500 000 сум в месяц, внесённые в первый год кредита, срезают сотни тысяч процентов на финише за счёт сокращения базы.",
        tip4Title: "Финансовая подушка на 3-6 месяцев",
        tip4Desc:
          "Никогда не тратьте все сбережения на первоначальный взнос. Держите неприкосновенный запас на случай непредвиденных обстоятельств.",
        tip5Title: "Сравнение полной стоимости (APR / ПСК)",
        tip5Desc:
          "Никогда не ориентируйтесь только на рекламную баннерную ставку. Всегда запрашивайте у банка официальный график с учётом комиссий и страховок.",
      },
    },
    modals: {
      searchTitle: "Поиск инструментов",
      searchPlaceholder: "Поиск инструментов: калькуляторы, конвертеры, финансы...",
      toolsNotFound: "Инструменты не найдены",
      currentTag: "Текущий",
      historyTitle: "История расчётов",
      historySubtitle: "Автоматически сохранённые варианты расчёта кредита",
      historyEmpty:
        "История пока пуста. После каждого нажатия «Рассчитать» результаты сохраняются здесь.",
      loadBtn: "Загрузить",
      deleteBtn: "Удалить",
      clearAllBtn: "Очистить историю",
      totalRecords: "Всего записей:",
      pdfModalTitle: "Экспорт отчёта в PDF",
      pdfModalSubtitle: "Официальный расчётный лист кредита и график выплат",
      pdfDownloadBtn: "Скачать PDF файл",
      pdfGenerating: "Создание PDF...",
      pdfDownloaded: "Файл скачан!",
      pdfPrintBtn: "Печать",
      pdfServiceTag: "Глобальный финансовый сервис расчёта кредитных обязательств",
      pdfDocTitle: "РАСЧЁТНЫЙ ЛИСТ И ГРАФИК ПЛАТЕЖЕЙ",
      pdfCreatedDate: "Дата формирования:",
      pdfSec1Title: "1. Параметры кредитования",
      pdfSec2Title: "2. Финансовые результаты",
      pdfSec3Title: "3. График платежей (первые 12 месяцев)",
      pdfFirst12Months: "первые 12 месяцев",
      pdfSignBank: "Отметка банка / кредитора:",
      pdfSignBorrower: "Подпись заёмщика:",
      pdfDisclaimer:
        "Настоящий документ сформирован в ознакомительных и расчётных целях на платформе Toolboxi.uz в соответствии с международными формулами аннуитетного и дифференцированного кредитования. Итоговые условия зависят от банка.",
    },
    toasts: {
      rateSet: "Установлена ставка:",
      exampleLoaded: "Загружен пример:",
      historyLoaded: "Загружен расчёт:",
      historyCleared: "История расчётов очищена",
      calcSaved: "Расчёт выполнен и сохранён в историю!",
      copiedClipboard: "Результат скопирован в буфер обмена",
      paramsReset: "Параметры сброшены до стандартных",
    },
    mobile: {
      tabCalc: "Расчёт",
      tabResult: "Итог",
      tabRates: "Ставки",
      tabInfo: "Инфо",
      viewModeTabs: "По вкладкам",
      viewModeAll: "Все блоки",
      perMonth: "в месяц",
      viewResult: "Смотреть результат",
      applyRateAndCalc: "Применить ставку",
      autoRatesFirstNotice: "Автокредиты активны",
      quickSummary: "Разделы",
      editParams: "Параметры",
      monthlyPaymentShort: "в мес.",
      swipeTableHint: "Прокрутите вправо для просмотра всех колонок →",
    },
    meta: {
      pageTitle: "Кредитный калькулятор – расчёт платежа, переплаты и ставки мира",
      pageDescription:
        "Точный расчёт ежемесячного платежа, переплаты, эффективной ставки (APR) и графика выплат с досрочным погашением и экспортом в PDF.",
    },
  },

  en: {
    nav: {
      brandSubtitle: "Tools & Financial Calculators",
      searchPlaceholder: "Search tools: calculators, converters, finance...",
      searchShortcut: "Ctrl K",
      history: "History",
      language: "English",
      themeLight: "Switch to light theme",
      themeDark: "Switch to dark theme",
      login: "Sign In",
    },
    hero: {
      title: "Loan Calculator",
      subtitle:
        "Accurate calculation of monthly payments, total overpayment, effective annual percentage rate (APR), and repayment schedules. Suitable for consumer loans, auto loans, and mortgages.",
      badge1Title: "Up-to-Date Rates",
      badge1Desc: "Global Benchmarks 2026",
      badge2Title: "Instant Report",
      badge2Desc: "PDF Export & Print",
      badge3Title: "2 Payment Modes",
      badge3Desc: "Annuity & Differentiated",
    },
    form: {
      step1Title: "1. Select Calculation Mode",
      annuityTitle: "Annuity",
      annuityDesc: "Equal monthly installments",
      diffTitle: "Differentiated",
      diffDesc: "Declining monthly payments",
      step2Title: "2. Enter Loan Parameters",
      loanAmount: "Loan Amount",
      currencyLabel: "Loan Currency",
      quick: "Quick:",
      loanTerm: "Loan Term",
      monthsUnit: "months",
      yearsUnit: "yrs",
      interestRate: "Interest Rate (% per year)",
      worldRates: "World Rates",
      roundToInteger: "Round to whole numbers",
      step3Title: "3. Additional Options (Optional)",
      downPayment: "Down Payment",
      loanPurpose: "Loan Purpose / Title",
      loanPurposePlaceholder: "e.g.: Home Purchase or Auto Loan",
      loanNotes: "Calculation Notes",
      loanNotesPlaceholder: "Contract ID, bank name, subsidy terms...",
      oneTimeFees: "One-Time Fees",
      annualInsurance: "Annual Insurance",
      calculate: "Calculate",
      reset: "Reset",
    },
    result: {
      title: "Results",
      copy: "Copy Summary",
      copied: "Copied",
      download: "Download",
      exportPdf: "Export to PDF",
      exportCsv: "CSV Table (Excel)",
      printReport: "Print Report",
      successBanner: "Calculation completed successfully!",
      monthlyPayment: "Monthly Payment",
      differentiatedNote: "(differentiated)",
      overpayment: "Overpayment",
      ofAmount: "% of loan amount",
      totalWithInterest: "Total to Repay",
      effectiveApr: "total cost (APR)",
      detailsTitle: "CALCULATION BREAKDOWN",
      indicatorCol: "Parameter",
      valueCol: "Value",
      loanAmount: "Principal Loan Amount",
      downPayment: "Down Payment",
      loanTerm: "Loan Term",
      monthsWord: "months",
      ratePerAnnum: "% per annum",
      paymentType: "Payment Method",
      annuityFull: "Annuity (equal monthly payments)",
      diffFull: "Differentiated (decreasing balance)",
      overpaymentSum: "Total Interest Overpayment",
      totalToRepay: "Total Repayment Amount",
      purposeOrName: "Description",
      defaultPurpose: "Personal Loan / Auto / Mortgage",
      amountInWords: "amount in words:",
      formulaTitle: "CALCULATION FORMULA",
      inYourCase: "In your case:",
      firstMonth: "first month",
      lastMonth: "last month",
      toggleScheduleShow: "Show payment chart & detailed schedule",
      toggleScheduleHide: "Hide payment chart & detailed schedule",
    },
    chart: {
      title: "Monthly Payment Chart",
      principal: "Principal Debt",
      interest: "Interest",
      balance: "Balance",
      month: "Month",
      payment: "Payment",
    },
    table: {
      title: "Detailed Amortization Schedule",
      subtitle: "Monthly breakdown of principal and interest throughout the full term",
      allYears: "All",
      yearSuffix: "yr.",
      colNum: "#",
      colPayment: "Payment",
      colPrincipal: "Principal",
      colInterest: "Interest",
      colBalance: "Remaining Balance",
      totalRow: "Full Term Total:",
      exportCsv: "Download CSV",
      exportPdf: "Export PDF",
      showingRows: "Months displayed:",
    },
    rates: {
      title: "World Loan Rates",
      ratesCountSuffix: "rates",
      description:
        "All world benchmark rates are fully expanded. Click any rate to apply it to your calculation:",
      filterMortgage: "Mortgage",
      filterConsumer: "Consumer",
      filterAuto: "Auto",
      filterAll: "All",
      searchPlaceholder: "Quick search by country or loan type...",
      noRatesFound: "No loan rates found matching",
      setRateTitle: "Apply rate",
      examplesTitle: "Calculation Examples",
      examplesTabConsumer: "Consumer",
      examplesTabAuto: "Auto",
      examplesTabMortgage: "Mortgage",
      colAmount: "Amount...",
      colTerm: "Term...",
      colPayment: "Payment...",
      examplesHint: "Click any row to load calculation parameters",
      categoryMortgage: "Mortgage",
      categoryConsumer: "Consumer",
      categoryAuto: "Auto",
    },
    bottom: {
      headerTitle: "Reference Materials & Financial Guidelines",
      headerSubtitle: "International financial calculation standards",
      infoTabTitle: "Useful Information",
      infoTabSubtitle: "Standards, formulas, and APR rules",
      faqTabTitle: "Frequently Asked Questions (FAQ)",
      faqTabSubtitle: "8 expert answers to essential borrower questions",
      tipsTabTitle: "Financial Advice",
      tipsTabSubtitle: "Practical tips to minimize interest costs",
      infoSection: {
        annuityHeading: "Annuity Payment (Fixed Amortized)",
        annuityText:
          "International standard (USA, EU, Asia). Monthly installments remain strictly constant. Formula: P = S × (r × (1+r)ⁿ) / ((1+r)ⁿ - 1). Ideal for predictable monthly budgeting, though in early years most payments cover accrued interest.",
        diffHeading: "Differentiated Payment (Reducing Balance)",
        diffText:
          "Principal is repaid in equal portions: S / n, while interest is computed only on remaining debt. Monthly payments decline consistently. Overall interest savings range from 10% to 25%, but requires higher starting income.",
        dtiHeading: "Debt-to-Income Ratio (DTI)",
        dtiText:
          "The ratio of all monthly debt obligations to net monthly income. Financial regulators recommend keeping DTI below 35-40%. A ratio exceeding 50% triggers high-risk classification by lenders.",
        aprHeading: "Annual Percentage Rate (APR)",
        aprText:
          "The true effective borrowing cost factoring in not only the base interest rate, but also origination fees, appraisal, processing charges, and required annual insurance policies.",
        currencyHeading: "Currency Risk & Exchange Rate Shifts",
        currencyText:
          "Golden personal finance rule: borrow strictly in the currency in which your primary income is earned. Favorable foreign interest rates do not protect against sudden currency devaluations.",
      },
      faqItems: [
        {
          q: "1. What is the key difference between annuity and differentiated loans?",
          a: "With an annuity schedule, your monthly payment remains constant. During the initial term, up to 75% of your payment covers bank interest. Under differentiated schedules, the principal is divided evenly across all months, and interest is computed solely on the remaining debt. Payments are highest initially and decrease monthly.",
        },
        {
          q: "2. Which payment method is financially more advantageous?",
          a: "Differentiated schedules are always mathematically superior in total interest paid, typically saving 10% to 25% over the entire duration. However, annuity payments are easier to budget and have lower income eligibility thresholds.",
        },
        {
          q: "3. For early prepayment: is it better to reduce term or monthly payment?",
          a: "Shortening the loan term yields the greatest financial savings because it eliminates future interest compounding. Lowering the monthly installment provides smaller total savings but reduces monthly debt pressure, providing a safety buffer during uncertain times.",
        },
        {
          q: "4. How does loan currency affect rates and personal financial risk?",
          a: "Loans in major global currencies (USD, EUR) carry lower interest rates (3-7%) reflecting monetary policy of the Fed and ECB. Local currencies with higher inflation have higher rates (14-25%). The golden rule is to borrow solely in the currency of your regular income.",
        },
        {
          q: "5. What is the Debt-to-Income (DTI) ratio?",
          a: "DTI measures total monthly debt repayments against gross or net monthly income. Banks generally require DTI to remain below 35-40%. Higher values indicate vulnerability to financial shocks.",
        },
        {
          q: "6. Why can 20-30 year mortgage interest exceed the original loan amount?",
          a: "Over extended durations, compounding takes effect: interest accrues monthly across hundreds of payment periods (240-360 months). Even at 6-8%, the total interest paid can easily exceed 100-150% of the initial principal.",
        },
        {
          q: "7. How are bank fees and insurance included in effective APR?",
          a: "The effective APR encompasses both standard interest charges and additional mandatory expenses (processing fees, collateral appraisal, property and life insurance). Our calculator displays the full transparent APR.",
        },
        {
          q: "8. Do banks calculate interest on a daily or monthly basis?",
          a: "Most global banks use the Actual/365 or Actual/360 day-count convention. Interest accrues daily on the outstanding principal balance at close of business and is billed monthly.",
        },
      ],
      tipsSection: {
        tip1Title: "Aim for a 20-30% Down Payment",
        tip1Desc:
          "Reduces the total borrowing need, secures lower interest margins, and removes mandatory mortgage private insurance fees.",
        tip2Title: "Keep Total Repayments Below 30% of Income",
        tip2Desc:
          "A comfortable debt service burden guards your family budget against unexpected layoffs, inflation, and healthcare expenses.",
        tip3Title: "Make Early Extra Payments in Initial Years",
        tip3Desc:
          "Even modest extra payments ($50-$100) during the first 24-36 months drastically reduce total interest by cutting into base principal.",
        tip4Title: "Maintain a 3-6 Month Emergency Fund",
        tip4Desc:
          "Never exhaust your entire cash savings on the down payment. Preserve liquid reserves to comfortably weather potential disruptions.",
        tip5Title: "Compare Real APR Rather Than Promotional Rates",
        tip5Desc:
          "Never judge loan options purely by billboard teaser rates. Always request the full truth-in-lending disclosure with all mandatory add-ons.",
      },
    },
    modals: {
      searchTitle: "Search Tools",
      searchPlaceholder: "Search tools: calculators, converters, finance...",
      toolsNotFound: "No matching tools found",
      currentTag: "Active",
      historyTitle: "Calculation History",
      historySubtitle: "Automatically saved loan calculation records",
      historyEmpty:
        "History is currently empty. Each time you click Calculate, results are saved here.",
      loadBtn: "Load",
      deleteBtn: "Delete",
      clearAllBtn: "Clear History",
      totalRecords: "Total records:",
      pdfModalTitle: "Export Loan Report to PDF",
      pdfModalSubtitle: "Official bank calculation sheet and payment schedule",
      pdfDownloadBtn: "Download PDF File",
      pdfGenerating: "Generating PDF...",
      pdfDownloaded: "PDF Downloaded!",
      pdfPrintBtn: "Print",
      pdfServiceTag: "Global Financial Calculation & Loan Amortization Service",
      pdfDocTitle: "LOAN AMORTIZATION SCHEDULE & SUMMARY",
      pdfCreatedDate: "Generated on:",
      pdfSec1Title: "1. Loan Parameters",
      pdfSec2Title: "2. Financial Results",
      pdfSec3Title: "3. Repayment Schedule (First 12 Months)",
      pdfFirst12Months: "first 12 months",
      pdfSignBank: "Bank / Lender Signature & Stamp:",
      pdfSignBorrower: "Borrower Signature:",
      pdfDisclaimer:
        "This official calculation statement is generated for estimation purposes on the Toolboxi.uz platform in accordance with international amortization standards. Actual final loan terms depend on lending institution underwriting.",
    },
    toasts: {
      rateSet: "Applied interest rate:",
      exampleLoaded: "Loaded calculation example:",
      historyLoaded: "Loaded historical calculation:",
      historyCleared: "Calculation history cleared",
      calcSaved: "Calculation completed and saved to history!",
      copiedClipboard: "Summary copied to clipboard",
      paramsReset: "Parameters reset to defaults",
    },
    mobile: {
      tabCalc: "Calc",
      tabResult: "Result",
      tabRates: "Rates",
      tabInfo: "Info",
      viewModeTabs: "Tabs View",
      viewModeAll: "All Blocks",
      perMonth: "per month",
      viewResult: "View Results",
      applyRateAndCalc: "Apply Rate",
      autoRatesFirstNotice: "Auto Loans Active",
      quickSummary: "Navigation",
      editParams: "Terms",
      monthlyPaymentShort: "/mo",
      swipeTableHint: "Swipe right to view full table columns →",
    },
    meta: {
      pageTitle: "Loan Calculator – Monthly Payment, Overpayment & World Rates",
      pageDescription:
        "Accurate loan calculator with annuity & differentiated schedules, early repayment savings, APR, world interest rates, and PDF export.",
    },
  },

  uz: {
    nav: {
      brandSubtitle: "Asboblar va moliyaviy hisob-kitoblar",
      searchPlaceholder: "Asboblarni qidirish: kalkulyatorlar, konvertorlar, moliya...",
      searchShortcut: "Ctrl K",
      history: "Tarix",
      language: "O'zbekcha",
      themeLight: "Yorug' mavzuga o'tish",
      themeDark: "Qorong'i mavzuga o'tish",
      login: "Kirish",
    },
    hero: {
      title: "Kredit kalkulyatori",
      subtitle:
        "Oylik to'lov, ortiqcha foiz to'lovi, haqiqiy foiz stavkasi (APR) va to'lovlar jadvalining aniq hisob-kitobi. Iste'mol kreditlari, avtokreditlar va ipoteka uchun to'liq mos keladi.",
      badge1Title: "Dolzarb ma'lumotlar",
      badge1Desc: "Jahon stavkalari 2026",
      badge2Title: "Tezkor hisobot",
      badge2Desc: "PDF eksport va chop etish",
      badge3Title: "2 xil to'lov turi",
      badge3Desc: "Annuitet va differensial",
    },
    form: {
      step1Title: "1. Hisoblash tartibini tanlang",
      annuityTitle: "Annuitet",
      annuityDesc: "Har oy bir xil teng to'lov",
      diffTitle: "Differensial",
      diffDesc: "Oydan oyga kamayib boruvchi to'lov",
      step2Title: "2. Ma'lumotlarni kiriting",
      loanAmount: "Kredit miqdori",
      currencyLabel: "Kredit valyutasi",
      quick: "Tezkor:",
      loanTerm: "Kredit muddati",
      monthsUnit: "oy",
      yearsUnit: "yil",
      interestRate: "Yillik foiz stavkasi (%)",
      worldRates: "Jahon stavkalari",
      roundToInteger: "Butun songacha yaxlitlash",
      step3Title: "3. Qo'shimcha parametrlar (ixtiyoriy)",
      downPayment: "Boshlang'ich to'lov",
      loanPurpose: "Kredit maqsadi / Nomi",
      loanPurposePlaceholder: "Masalan: Uy xaridi yoki Avtokredit",
      loanNotes: "Hisob-kitob izohi",
      loanNotesPlaceholder: "Shartnoma raqami, bank yoki subsidiya shartlari...",
      oneTimeFees: "Bir martalik komissiyalar",
      annualInsurance: "Yillik sugurta",
      calculate: "Hisoblash",
      reset: "Tiklash",
    },
    result: {
      title: "Natija",
      copy: "Nusxalash",
      copied: "Nusxalandi",
      download: "Yuklab olish",
      exportPdf: "PDF ga eksport",
      exportCsv: "CSV jadval (Excel)",
      printReport: "Hisobotni chop etish",
      successBanner: "Hisoblash muvaffaqiyatli bajarildi!",
      monthlyPayment: "Oylik to'lov",
      differentiatedNote: "(differensial)",
      overpayment: "Ortiqcha to'lov",
      ofAmount: "kredit miqdorining % qismi",
      totalWithInterest: "Jami to'lov (foizlar bilan)",
      effectiveApr: "to'liq qiymat (APR)",
      detailsTitle: "HISOBLASH TAFSILOTLARI",
      indicatorCol: "Ko'rsatkich",
      valueCol: "Qiymat",
      loanAmount: "Kredit summasi",
      downPayment: "Boshlang'ich to'lov",
      loanTerm: "Kredit muddati",
      monthsWord: "oy",
      ratePerAnnum: "yillik %",
      paymentType: "To'lov turi",
      annuityFull: "Annuitet (teng oylik to'lovlar)",
      diffFull: "Differensial (kamayib boruvchi)",
      overpaymentSum: "Ortiqcha foiz to'lovi",
      totalToRepay: "Qaytariladigan jami to'lov",
      purposeOrName: "Kredit maqsadi",
      defaultPurpose: "Iste'mol krediti / Avto / Ipoteka",
      amountInWords: "so'z bilan summa:",
      formulaTitle: "HISOBLASH FORMULASI",
      inYourCase: "Sizning holatingizda:",
      firstMonth: "birinchi oy",
      lastMonth: "oxirgi oy",
      toggleScheduleShow: "Grafik va to'lovlar jadvalini ko'rsatish",
      toggleScheduleHide: "Grafik va to'lovlar jadvalini yashirish",
    },
    chart: {
      title: "To'lovlar grafigi",
      principal: "Asosiy qarz",
      interest: "Foizlar",
      balance: "Qoldiq",
      month: "Oy",
      payment: "To'lov",
    },
    table: {
      title: "Batafsil to'lovlar jadvali",
      subtitle: "Butun muddat uchun asosiy qarz va hisoblangan foizlarning oylik taqsimoti",
      allYears: "Barchasi",
      yearSuffix: "yil",
      colNum: "№",
      colPayment: "To'lov",
      colPrincipal: "Asosiy qarz",
      colInterest: "Foizlar",
      colBalance: "Qarz qoldig‘i",
      totalRow: "Jami butun muddat uchun:",
      exportCsv: "CSV yuklab olish",
      exportPdf: "PDF eksport",
      showingRows: "Ko'rsatilgan oylar:",
    },
    rates: {
      title: "Dunyo bo'yicha kredit stavkalari",
      ratesCountSuffix: "ta stavka",
      description:
        "Barcha jahon stavkalari to'liq ochilgan. Hisoblashda qo'llash uchun istalgan stavkani bosing:",
      filterMortgage: "Ipoteka",
      filterConsumer: "Iste'mol",
      filterAuto: "Avto",
      filterAll: "Barchasi",
      searchPlaceholder: "Mamlakat yoki kredit turini tezkor qidirish...",
      noRatesFound: "So'rov bo'yicha stavkalar topilmadi",
      setRateTitle: "Stavkani o'rnatish",
      examplesTitle: "Hisoblash namunalari",
      examplesTabConsumer: "Iste'mol",
      examplesTabAuto: "Avto",
      examplesTabMortgage: "Ipoteka",
      colAmount: "Miqdor...",
      colTerm: "Muddat...",
      colPayment: "To'lov...",
      examplesHint: "Parametrlarni yuklash uchun qatorni bosing",
      categoryMortgage: "Ipoteka",
      categoryConsumer: "Iste'mol",
      categoryAuto: "Avto",
    },
    bottom: {
      headerTitle: "Ma’lumotnoma materiallari va moliyachilar tavsiyalari",
      headerSubtitle: "Xalqaro moliyaviy hisob-kitob standartlari",
      infoTabTitle: "Foydali ma'lumotlar",
      infoTabSubtitle: "Hisoblash standartlari, formulalar, APR",
      faqTabTitle: "Ko'p beriladigan savollar (FAQ)",
      faqTabSubtitle: "Muhim kredit savollariga 8 ta ekspert javobi",
      tipsTabTitle: "Moliyachilar maslahatlari",
      tipsTabSubtitle: "Kreditda ortiqcha xarajatlarni tejash bo'yicha amaliy qoidalar",
      infoSection: {
        annuityHeading: "Annuitet to'lovi (Fixed Amortized)",
        annuityText:
          "Xalqaro standart (AQSH, Yevropa, Osiyo). Oylik to'lov summasi butun muddat davomida qat'iy bir xil bo'lib qoladi. Formula: P = S × (r × (1+r)ⁿ) / ((1+r)ⁿ - 1). Oila byudjetini rejalashtirish uchun juda qulay, ammo dastlabki yillarda to'lovning asosiy qismi bank foizlariga yo'naltiriladi.",
        diffHeading: "Differensial to'lov (Reducing Balance)",
        diffText:
          "Asosiy qarz har oy teng ulushlarda: S / n tarzida so'ndiriladi, foizlar esa faqat qolgan qarz qoldig'iga hisoblanadi. Oqibatda to'lovlar har oy kamayib boradi. Umumiy ortiqcha foiz to'lovi annuitetga nisbatan 10-25% kamroq bo'ladi.",
        dtiHeading: "Qarz yuki ko‘rsatkichi (DTI / ПДН)",
        dtiText:
          "Barcha oylik kredit to'lovlarining oilaning sof oylik daromadiga nisbati. Xalqaro me'yorlarga ko'ra, xavfsiz daraja 35-40% dan oshmasligi lozim. 50% dan oshganda banklar kredit berishdan bosh tortishi yoki foiz stavkasini oshirishi mumkin.",
        aprHeading: "Kreditning to'liq qiymati (APR / ПСК)",
        aprText:
          "Faqatgina e'lon qilingan foiz emas, balki shartnoma bo'yicha barcha qo'shimcha xarajatlar: bir martalik bank komissiyalari, baholash va majburiy sug'urta badallarini hisobga olgan haqiqiy yillik foiz stavkasi.",
        currencyHeading: "Valyuta xatarlari va devalvatsiya",
        currencyText:
          "Moliyachilarning oltin qoidasi: kreditni faqat doimiy daromad olayotgan valyutangizda oling. Chet el valyutasidagi (USD/EUR) past stavka milliy valyuta devalvatsiyasidan kelib chiqadigan xatarlarni qoplamaydi.",
      },
      faqItems: [
        {
          q: "1. Annuitet va differensial to‘lovlarning asosiy farqi nimada?",
          a: "Annuitetda har oy to'lanadigan mablag' qat'iy bir xil bo'ladi. Dastlabki davrda to'lovning 70-80% qismi foizlarni to'lashga ketadi. Differensial usulda esa asosiy qarz har oy teng ulushda kamayadi, foiz esa qoldiqqa hisoblanadi. Shuning uchun dastlabki oylarda to'lov yuqori bo'lib, oydan-oyga sezilarli kamayib boradi.",
        },
        {
          q: "2. Qaysi to‘lov usulini tanlash moliyaviy jihatdan foydaliroq?",
          a: "Differensial grafik umumiy foiz to'lovi bo'yicha har doim foydaliroq: umumiy muddat davomida 10% dan 25% gacha pulni tejash imkonini beradi. Ammo annuitet oila byudjetini rejalashtirishni osonlashtiradi va bankdan tasdiqlash olish uchun kamroq boshlang'ich daromad talab qiladi.",
        },
        {
          q: "3. Muddatidan oldin to‘lashda nima yaxshiroq: muddatni qisqartirishmi yoki oylik to‘lovni kamaytirish?",
          a: "Kredit muddatini qisqartirish eng katta moliyaviy tejamkorlikni beradi, chunki keyingi oylar uchun foiz hisoblanishi to'xtatiladi. Oylik to'lovni kamaytirish esa oylik qarz yukini yengillashtiradi va kutilmagan vaziyatlar uchun moliyaviy erkinlik beradi.",
        },
        {
          q: "4. Kredit valyutasi foiz stavkasi va xatarlarga qanday ta’sir qiladi?",
          a: "Dunyoning barqaror valyutalarida (USD, EUR) stavkalar pastroq (3-7%) bo'ladi. Inflyatsiyasi yuqoriroq bo'lgan milliy valyutalarda esa stavkalar 14-25% atrofida. Eng muhim qoida: qarzni faqat oylik maosh olayotgan valyutada olish kerak.",
        },
        {
          q: "5. Qarz yuki ko‘rsatkichi (DTI) nima va u nega muhim?",
          a: "DTI (Debt-to-Income) — barcha kredit to'lovlarining oylik sof daromadga nisbati. Banklar ushbu ko'rsatkich 35-40% dan oshmasligini talab qiladi. Agar u 50% dan yuqori bo'lsa, bank kredit berishni rad etishi mumkin.",
        },
        {
          q: "6. Nima uchun 20-30 yillik ipotekada ortiqcha foiz kredit summasidan oshib ketishi mumkin?",
          a: "Uzoq muddatda murakkab foiz ta'siri kuchayadi: bank yuzlab oylar (240-360 oy) davomida qarz qoldig'iga foiz hisoblaydi. Hatto 7-9% stavkada ham 25-30 yil ichida to'langan umumiy foiz qarz olingan asosiy summadan 1.5–2 barobar ko'p bo'lishi mumkin.",
        },
        {
          q: "7. Bank komissiyalari va sug‘urta to‘liq qiymatda (APR) qanday aks etadi?",
          a: "Kreditning to'liq qiymati (APR / ПСК) nafaqat e'lon qilingan stavkani, balki bir martalik komissiyalar, garovni baholash va yillik sug'urta to'lovlarini ham o'z ichiga oladi. Bizning kalkulyator ushbu xarajatlarni to'liq hisobga oladi.",
        },
        {
          q: "8. Banklar foizni qanday hisoblaydi: kunlikmi yoki oylik?",
          a: "Ko'pgina xalqaro banklar foizlarni har kuni amaldagi qarz qoldig'iga (Actual/365 metodi) qarab hisoblaydi. Shuning uchun 31 kunlik oylarda hisoblangan foiz 28 kunlik fevral oyiga nisbatan bir oz ko'proq bo'ladi.",
        },
      ],
      tipsSection: {
        tip1Title: "Boshlang'ich to'lov 20-30% bo'lishiga intiling",
        tip1Desc:
          "Bu kredit summasini va foiz stavkasini pasaytiradi hamda ortiqcha sug'urta badallaridan xalos etadi.",
        tip2Title: "Oylik to'lov daromadning 30% idan oshmasin",
        tip2Desc:
          "Qulay qarz yuki oila byudjetini kutilmagan iqtisodiy qiyinchiliklar va narxlar oshishidan himoya qiladi.",
        tip3Title: "Dastlabki yillarda muddatidan oldin to'lov qiling",
        tip3Desc:
          "Kreditning dastlabki yillarida har oy ortiqcha 500 000 so'm yoki $50 to'lash keyingi yillarda millionlab foizlarni tejab qoladi.",
        tip4Title: "3-6 oylik favqulodda zaxira jamg'armasini saqlang",
        tip4Desc:
          "Barcha jamg'armangizni boshlang'ich to'lovga sarflamang. Kutilmagan vaziyatlar uchun kamida 3-6 oylik xarajatlar zaxirasini asrab qo'ying.",
        tip5Title: "Faqat reklama stavkasiga emas, APR ga qarang",
        tip5Desc:
          "Hech qachon faqat reklamadagi past foizga aldanmang. Doimo barcha komissiyalar va sug'urtalar kiritilgan to'liq qiymatni so'rang.",
      },
    },
    modals: {
      searchTitle: "Asboblarni qidirish",
      searchPlaceholder: "Asboblarni qidirish: kalkulyatorlar, konvertorlar, moliya...",
      toolsNotFound: "Mos asboblar topilmadi",
      currentTag: "Joriy",
      historyTitle: "Hisob-kitoblar tarixi",
      historySubtitle: "Avtomatik saqlangan kredit hisoblari",
      historyEmpty:
        "Tarix hozircha bo‘sh. Har safar «Hisoblash» tugmasi bosilganda natijalar shu yerda saqlanadi.",
      loadBtn: "Yuklash",
      deleteBtn: "O'chirish",
      clearAllBtn: "Tarixni tozalash",
      totalRecords: "Jami yozuvlar:",
      pdfModalTitle: "Kredit hisobotini PDF ga eksport qilish",
      pdfModalSubtitle: "Rasmiy kredit hisob-kitob varaqasi va to'lovlar jadvali",
      pdfDownloadBtn: "PDF faylni yuklab olish",
      pdfGenerating: "PDF yaratilmoqda...",
      pdfDownloaded: "Fayl yuklab olindi!",
      pdfPrintBtn: "Chop etish",
      pdfServiceTag: "Kredit majburiyatlarini hisoblash bo‘yicha global moliyaviy xizmat",
      pdfDocTitle: "HISOBLASH VARAQASI VA TO'LOVLAR JADVALI",
      pdfCreatedDate: "Tuzilgan sana:",
      pdfSec1Title: "1. Kredit parametrlari",
      pdfSec2Title: "2. Moliyaviy natijalar",
      pdfSec3Title: "3. To'lovlar jadvali (dastlabki 12 oy)",
      pdfFirst12Months: "dastlabki 12 oy",
      pdfSignBank: "Bank / Kreditor imzosi va muhri:",
      pdfSignBorrower: "Qarz oluvchi imzosi:",
      pdfDisclaimer:
        "Ushbu rasmiy hisob-kitob hujjati Toolboxi.uz platformasida xalqaro annuitet va differensial standartlar asosida axborot-hisob maqsadida shakllantirilgan. Yakuniy shartlar bank tomonidan belgilanadi.",
    },
    toasts: {
      rateSet: "Foiz stavkasi o'rnatildi:",
      exampleLoaded: "Namuna yuklandi:",
      historyLoaded: "Hisob yuklandi:",
      historyCleared: "Hisoblar tarixi tozalandi",
      calcSaved: "Hisob-kitob bajarildi va tarixga saqlindi!",
      copiedClipboard: "Natija xotiraga nusxalandi",
      paramsReset: "Parametrlar standart holatga keltirildi",
    },
    mobile: {
      tabCalc: "Hisob",
      tabResult: "Natija",
      tabRates: "Stavka",
      tabInfo: "Maʼlumot",
      viewModeTabs: "Vkladkalar",
      viewModeAll: "Barcha bloklar",
      perMonth: "oyiga",
      viewResult: "Natijani ko‘rish",
      applyRateAndCalc: "Stavkani qo‘llash",
      autoRatesFirstNotice: "Avtokreditlar faol",
      quickSummary: "Bo‘limlar",
      editParams: "Parametrlar",
      monthlyPaymentShort: "/oy",
      swipeTableHint: "Barcha ustunlarni ko‘rish uchun o‘ngga suring →",
    },
    meta: {
      pageTitle: "Kredit kalkulyatori – oylik toʻlov, ortiqcha toʻlov va jahon stavkalari",
      pageDescription:
        "Oylik to'lov, ortiqcha to'lov, annuitet va differensial grafik hamda PDF eksport uchun zamonaviy kredit kalkulyatori.",
    },
  },
};
