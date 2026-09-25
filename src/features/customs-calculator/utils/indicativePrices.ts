import { HsCodeItem, IndicativeDefaults, DeclarantType } from "../types";

/**
 * Индикативные (контрольные) цены и параметры логистики Таможенного комитета РУз.
 * Содержат ориентировочные рыночные данные стоимости за единицу (USD), веса брутто (кг),
 * примерной доставки и страхования.
 *
 * Если передан параметр `quantity`, итоговые `typicalPriceUSD`, `typicalWeightKg`,
 * `typicalDeliveryUSD` и `typicalInsuranceUSD` рассчитываются пропорционально объёму.
 */
export function getIndicativeDefaults(
  item: HsCodeItem,
  declarantType: DeclarantType = "legal",
  quantity?: number,
): IndicativeDefaults {
  const cleanCode = item.code.replace(/\s+/g, "");
  const lowerName = item.name.toLowerCase();
  const isIndividual = declarantType === "individual";

  if (item.indicative) {
    const uPrice =
      item.indicative.unitPriceUSD ||
      (item.indicative.typicalQuantity > 0
        ? item.indicative.typicalPriceUSD / item.indicative.typicalQuantity
        : item.indicative.typicalPriceUSD);
    const uWeight =
      item.indicative.unitWeightKg ||
      (item.indicative.typicalQuantity > 0
        ? item.indicative.typicalWeightKg / item.indicative.typicalQuantity
        : item.indicative.typicalWeightKg);
    const effQty =
      typeof quantity === "number" && quantity > 0 ? quantity : item.indicative.typicalQuantity;
    const totPrice = Math.round(uPrice * effQty * 100) / 100;
    const totWeight = Number((uWeight * effQty).toFixed(2));
    const totDelivery = Math.max(
      5,
      Math.round(
        item.indicative.typicalDeliveryUSD * (effQty / (item.indicative.typicalQuantity || 1)),
      ),
    );
    const totInsurance = Math.max(1, Math.round(totPrice * 0.008));

    return {
      ...item.indicative,
      unitPriceUSD: uPrice,
      unitWeightKg: uWeight,
      typicalQuantity: effQty,
      typicalPriceUSD: totPrice,
      typicalWeightKg: totWeight,
      typicalDeliveryUSD: totDelivery,
      typicalInsuranceUSD: totInsurance,
    };
  }

  // Параметры для расчета
  let unitPriceUSD = 50;
  let unitWeightKg = 1.5;
  let defaultQty = isIndividual ? 1 : 10;
  let unit = item.measurementUnit || "шт.";
  let weightUnit = "кг";
  let categoryName = item.category || "Товары";
  let sourceNote = "Индикативная оценка ГТК РУз";
  let deliveryRateUSDPerKg = 3.5;
  let minDeliveryUSD = isIndividual ? 10 : 30;

  // 1. Зарядные устройства, адаптеры (8504 40)
  if (
    cleanCode.startsWith("850440") ||
    lowerName.includes("зарядн") ||
    lowerName.includes("адаптер")
  ) {
    unitPriceUSD = 15;
    unitWeightKg = 0.22;
    defaultQty = isIndividual ? 1 : 50;
    unit = "шт.";
    categoryName = "Зарядные устройства и адаптеры";
    sourceNote = "Индикативная цена: ~$12–$25 за единицу, вес ~0.22 кг";
    deliveryRateUSDPerKg = 4.5;
    minDeliveryUSD = 8;
  }
  // 2. Наушники, Bluetooth гарнитуры (8518 30)
  else if (
    cleanCode.startsWith("851830") ||
    lowerName.includes("наушник") ||
    lowerName.includes("гарнитур")
  ) {
    unitPriceUSD = 40;
    unitWeightKg = 0.28;
    defaultQty = isIndividual ? 1 : 30;
    unit = "шт.";
    categoryName = "Наушники и гарнитуры";
    sourceNote = "Индикативная цена: ~$25–$70 за единицу, вес ~0.28 кг";
    deliveryRateUSDPerKg = 5.0;
    minDeliveryUSD = 10;
  }
  // 3. Смартфоны и сотовые телефоны (8517 12 / 8517 13 / 8517 14)
  else if (
    cleanCode.startsWith("851712") ||
    cleanCode.startsWith("851713") ||
    cleanCode.startsWith("851714") ||
    lowerName.includes("смартфон") ||
    lowerName.includes("телефон сотов") ||
    lowerName.includes("iphone")
  ) {
    unitPriceUSD = 450;
    unitWeightKg = 0.45;
    defaultQty = isIndividual ? 1 : 10;
    unit = "шт.";
    categoryName = "Смартфоны";
    sourceNote = "Индикативная цена: ~$300–$800 за единицу, вес ~0.45 кг";
    deliveryRateUSDPerKg = 8.0;
    minDeliveryUSD = 15;
  }
  // 4. Электромобили (8703 80)
  else if (cleanCode.startsWith("870380") || lowerName.includes("электромобил")) {
    unitPriceUSD = 23000;
    unitWeightKg = 1950;
    defaultQty = 1;
    unit = "шт.";
    categoryName = "Электромобили (0% пошлина)";
    sourceNote = "Индикативная цена современного электромобиля: ~$18 000–$32 000, вес ~1950 кг";
    deliveryRateUSDPerKg = 0.72;
    minDeliveryUSD = 1400;
  }
  // 5. Автомобили бензиновые / дизельные (8703)
  else if (cleanCode.startsWith("8703") || lowerName.includes("автомобил")) {
    unitPriceUSD = 15500;
    unitWeightKg = 1480;
    defaultQty = 1;
    unit = "шт.";
    categoryName = "Легковые автомобили";
    sourceNote =
      "Индикативная цена седана/кроссовера 1.5–1.8 л: ~$13 000–$22 000, средний вес ~1480 кг";
    deliveryRateUSDPerKg = 0.81;
    minDeliveryUSD = 1200;
  }
  // 6. Ноутбуки и планшеты (8471 30)
  else if (
    cleanCode.startsWith("847130") ||
    lowerName.includes("ноутбук") ||
    lowerName.includes("планшет")
  ) {
    unitPriceUSD = 750;
    unitWeightKg = 2.4;
    defaultQty = isIndividual ? 1 : 10;
    unit = "шт.";
    categoryName = "Ноутбуки и планшеты";
    sourceNote = "Индикативная цена: ~$500–$1 200, вес упаковки с зарядным ~2.4 кг";
    deliveryRateUSDPerKg = 6.0;
    minDeliveryUSD = 20;
  }
  // 7. Мясо КРС (0201, 0202)
  else if (
    cleanCode.startsWith("0201") ||
    cleanCode.startsWith("0202") ||
    lowerName.includes("говядин") ||
    lowerName.includes("мясо крс")
  ) {
    unitPriceUSD = 5.5;
    unitWeightKg = 1.05;
    defaultQty = isIndividual ? 20 : 1000;
    unit = "кг";
    categoryName = "Мясо КРС";
    sourceNote = "Индикативная оптовая цена: ~$5.00–$6.20/кг, рефрижераторная доставка";
    deliveryRateUSDPerKg = 0.55;
    minDeliveryUSD = 25;
  }
  // 8. Мясо птицы (0207)
  else if (
    cleanCode.startsWith("0207") ||
    lowerName.includes("птиц") ||
    lowerName.includes("куриц") ||
    lowerName.includes("бройлер")
  ) {
    unitPriceUSD = 2.1;
    unitWeightKg = 1.04;
    defaultQty = isIndividual ? 20 : 1000;
    unit = "кг";
    categoryName = "Мясо птицы";
    sourceNote = "Индикативная оптовая цена: ~$1.90–$2.50/кг";
    deliveryRateUSDPerKg = 0.45;
    minDeliveryUSD = 20;
  }
  // 9. Живой скот (0102, 0104)
  else if (
    cleanCode.startsWith("0102") ||
    cleanCode.startsWith("0104") ||
    lowerName.includes("скот") ||
    lowerName.includes("животн")
  ) {
    unitPriceUSD = 1600;
    unitWeightKg = 520;
    defaultQty = isIndividual ? 1 : 10;
    unit = "шт.";
    categoryName = "Живой скот (племенной)";
    sourceNote = "Индикативная цена КРС: ~$1 400–$2 200 за голову, средний вес ~520 кг";
    deliveryRateUSDPerKg = 0.65;
    minDeliveryUSD = 300;
  }
  // 10. Сахар белый (1701 99)
  else if (cleanCode.startsWith("1701") || lowerName.includes("сахар")) {
    unitPriceUSD = 0.72;
    unitWeightKg = 1.02;
    defaultQty = isIndividual ? 50 : 1000;
    unit = "кг";
    categoryName = "Сахар белый";
    sourceNote = "Индикативная оптовая цена: ~$0.68–$0.75 за кг ($680–$750/т)";
    deliveryRateUSDPerKg = 0.12;
    minDeliveryUSD = 15;
  }
  // 11. Мука пшеничная (1101 00)
  else if (cleanCode.startsWith("1101") || lowerName.includes("мука")) {
    unitPriceUSD = 0.41;
    unitWeightKg = 1.02;
    defaultQty = isIndividual ? 50 : 1000;
    unit = "кг";
    categoryName = "Мука пшеничная";
    sourceNote = "Индикативная цена муки 1 сорта: ~$0.38–$0.44 за кг ($380–$440/т)";
    deliveryRateUSDPerKg = 0.1;
    minDeliveryUSD = 15;
  }
  // 12. Одежда (61, 62)
  else if (
    cleanCode.startsWith("61") ||
    cleanCode.startsWith("62") ||
    lowerName.includes("одежд") ||
    lowerName.includes("брюк") ||
    lowerName.includes("куртк")
  ) {
    unitPriceUSD = 28;
    unitWeightKg = 0.55;
    defaultQty = isIndividual ? 2 : 100;
    unit = "шт.";
    categoryName = "Одежда и текстиль";
    sourceNote = "Индикативная оценка: ~$15–$50 за единицу, вес ~0.55 кг";
    deliveryRateUSDPerKg = 3.5;
    minDeliveryUSD = 10;
  }
  // 13. Обувь (64)
  else if (
    cleanCode.startsWith("64") ||
    lowerName.includes("обув") ||
    lowerName.includes("кроссовк") ||
    lowerName.includes("туфл")
  ) {
    unitPriceUSD = 55;
    unitWeightKg = 1.2;
    defaultQty = isIndividual ? 2 : 50;
    unit = "пар";
    categoryName = "Обувь";
    sourceNote = "Индикативная цена: ~$35–$80 за пару, вес в коробке ~1.2 кг";
    deliveryRateUSDPerKg = 3.5;
    minDeliveryUSD = 12;
  }
  // 14. Телевизоры и мониторы (8528)
  else if (
    cleanCode.startsWith("8528") ||
    lowerName.includes("телевизор") ||
    lowerName.includes("монитор")
  ) {
    unitPriceUSD = 360;
    unitWeightKg = 13;
    defaultQty = isIndividual ? 1 : 10;
    unit = "шт.";
    categoryName = "Телевизоры и мониторы";
    sourceNote = "Индикативная цена: ~$280–$480, вес в коробке ~13 кг";
    deliveryRateUSDPerKg = 3.0;
    minDeliveryUSD = 35;
  }
  // 15. Холодильники (8418)
  else if (cleanCode.startsWith("8418") || lowerName.includes("холодильник")) {
    unitPriceUSD = 480;
    unitWeightKg = 68;
    defaultQty = 1;
    unit = "шт.";
    categoryName = "Холодильники";
    sourceNote = "Индикативная цена: ~$380–$650, вес ~68 кг";
    deliveryRateUSDPerKg = 1.1;
    minDeliveryUSD = 75;
  }
  // 16. Кондиционеры (8415)
  else if (
    cleanCode.startsWith("8415") ||
    lowerName.includes("кондиционер") ||
    lowerName.includes("сплит")
  ) {
    unitPriceUSD = 380;
    unitWeightKg = 42;
    defaultQty = 1;
    unit = "шт.";
    categoryName = "Кондиционеры";
    sourceNote = "Индикативная цена сплит-системы: ~$320–$480, вес ~42 кг";
    deliveryRateUSDPerKg = 1.2;
    minDeliveryUSD = 50;
  }
  // 17. Стиральные машины (8450)
  else if (cleanCode.startsWith("8450") || lowerName.includes("стиральн")) {
    unitPriceUSD = 350;
    unitWeightKg = 62;
    defaultQty = 1;
    unit = "шт.";
    categoryName = "Стиральные машины";
    sourceNote = "Индикативная цена: ~$300–$450, вес ~62 кг";
    deliveryRateUSDPerKg = 1.1;
    minDeliveryUSD = 65;
  }
  // 18. Автомобильные шины (4011)
  else if (
    cleanCode.startsWith("4011") ||
    lowerName.includes("шин") ||
    lowerName.includes("покрышк")
  ) {
    unitPriceUSD = 65;
    unitWeightKg = 9.5;
    defaultQty = 4;
    unit = "шт.";
    categoryName = "Шины автомобильные";
    sourceNote = "Индикативная цена шины R15–R17: ~$50–$85/шт (~9.5 кг)";
    deliveryRateUSDPerKg = 1.0;
    minDeliveryUSD = 30;
  }
  // 19. Чай и кофе (0901, 0902)
  else if (
    cleanCode.startsWith("0901") ||
    cleanCode.startsWith("0902") ||
    lowerName.includes("кофе") ||
    lowerName.includes("чай")
  ) {
    unitPriceUSD = 7.5;
    unitWeightKg = 1.08;
    defaultQty = isIndividual ? 5 : 100;
    unit = "кг";
    categoryName = "Чай и кофе";
    sourceNote = "Индикативная стоимость: ~$6.00–$9.50/кг";
    deliveryRateUSDPerKg = 1.0;
    minDeliveryUSD = 15;
  }
  // 20. Растительное масло (1512, 1507)
  else if (
    cleanCode.startsWith("1512") ||
    cleanCode.startsWith("1507") ||
    lowerName.includes("масло растительн") ||
    lowerName.includes("подсолнечн")
  ) {
    unitPriceUSD = 1.25;
    unitWeightKg = 0.95;
    defaultQty = isIndividual ? 10 : 1000;
    unit = "л";
    categoryName = "Растительное масло";
    sourceNote = "Индикативная стоимость: ~$1.15–$1.40 за литр";
    deliveryRateUSDPerKg = 0.14;
    minDeliveryUSD = 15;
  }
  // 21. Чехлы и защитные стёкла (3926, 7007)
  else if (
    cleanCode.startsWith("3926") ||
    cleanCode.startsWith("7007") ||
    lowerName.includes("чехол") ||
    lowerName.includes("стекло защитн")
  ) {
    unitPriceUSD = 4;
    unitWeightKg = 0.08;
    defaultQty = isIndividual ? 2 : 100;
    unit = "шт.";
    categoryName = "Защитные аксессуары";
    sourceNote = "Индикативная стоимость: ~$2–$7 за единицу, вес ~0.08 кг";
    deliveryRateUSDPerKg = 4.0;
    minDeliveryUSD = 5;
  } else {
    // Общие эвристики по главам
    const chapterNum = parseInt(cleanCode.slice(0, 2), 10);
    if (chapterNum >= 1 && chapterNum <= 24) {
      unitPriceUSD = 2.5;
      unitWeightKg = 1.05;
      defaultQty = isIndividual ? 10 : 500;
      unit = "кг";
      categoryName = "Сельхоз и продтовары";
      sourceNote = "Индикативная оптовая оценка продовольственной группы";
      deliveryRateUSDPerKg = 0.25;
      minDeliveryUSD = 20;
    } else if ((chapterNum >= 25 && chapterNum <= 40) || (chapterNum >= 72 && chapterNum <= 83)) {
      unitPriceUSD = 1.4;
      unitWeightKg = 1.0;
      defaultQty = isIndividual ? 25 : 1000;
      unit = "кг";
      categoryName = "Сырьё и материалы";
      sourceNote = "Индикативная промышленная оценка для оптовой партии";
      deliveryRateUSDPerKg = 0.18;
      minDeliveryUSD = 20;
    } else if (chapterNum === 84 || chapterNum === 85 || chapterNum === 90) {
      unitPriceUSD = 350;
      unitWeightKg = 8.0;
      defaultQty = 1;
      unit = "шт.";
      categoryName = "Оборудование и приборы";
      sourceNote = "Индикативная стоимость промышленно-бытовой техники";
      deliveryRateUSDPerKg = 3.0;
      minDeliveryUSD = 25;
    }
  }

  // Расчет общих значений с учетом количества
  const effQty = typeof quantity === "number" && quantity > 0 ? quantity : defaultQty;
  const typicalPriceUSD = Math.round(unitPriceUSD * effQty * 100) / 100;
  const typicalWeightKg = Number((unitWeightKg * effQty).toFixed(2));
  const typicalDeliveryUSD = Math.max(
    minDeliveryUSD,
    Math.round(typicalWeightKg * deliveryRateUSDPerKg),
  );
  const typicalInsuranceUSD = Math.max(1, Math.round(typicalPriceUSD * 0.008));

  return {
    unitPriceUSD,
    typicalPriceUSD,
    typicalQuantity: effQty,
    unitWeightKg,
    typicalWeightKg,
    typicalDeliveryUSD,
    typicalInsuranceUSD,
    unit,
    weightUnit,
    categoryName,
    sourceNote,
  };
}
