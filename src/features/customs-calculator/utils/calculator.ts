import { CalculationInput, CalculationBreakdown, HsCodeItem } from "../types";
import { getCountryProfile, formatCustomCurrency } from "./countryProfiles";

export function formatUZS(amount: number): string {
  const rounded = Math.round(amount);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " UZS";
}

export function formatUSD(amount: number): string {
  const rounded = Math.round(amount);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " USD";
}

export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatTargetCurrency(
  amount: number,
  currencyCode: string = "UZS",
  currencySymbol: string = "UZS",
): string {
  return formatCustomCurrency(amount, currencyCode, currencySymbol);
}

// Лимиты беспошлинного ввоза для физических лиц по законодательству РУз (ПП-3512 / ПП-4470)
export function getIndividualDutyFreeLimits(
  transportType: string = "air",
  countryCode: string = "UZ",
): { limitUSD: number; limitKg: number; label: string } {
  const profile = getCountryProfile(countryCode);

  if (countryCode !== "UZ") {
    return {
      limitUSD: profile.individualDeMinimisUSD,
      limitKg: profile.individualDeMinimisKg,
      label: `${profile.name}: ${profile.deMinimisRuleName}`,
    };
  }

  switch (transportType) {
    case "air":
      return { limitUSD: 2000, limitKg: 50, label: "Авиасообщение (аэропорт)" };
    case "post":
      return {
        limitUSD: 1000,
        limitKg: 30,
        label: "Международные курьерские отправления (посылка)",
      };
    case "auto":
      return { limitUSD: 300, limitKg: 20, label: "Автодорожные и пешеходные пункты границы" };
    case "rail":
      return { limitUSD: 1000, limitKg: 50, label: "Железнодорожные пункты пропуска" };
    default:
      return { limitUSD: 2000, limitKg: 50, label: "Авиасообщение" };
  }
}

export function calculateCustoms(
  input: CalculationInput,
  usdRate: number = 12650,
): CalculationBreakdown {
  const isImport = input.operationType === "import";
  const declarantType = input.declarantType || "legal";
  const isIndividual = declarantType === "individual";
  const transportType = input.individualTransportType || "air";

  const targetCountryCode = (input.destinationCountry || "UZ").toUpperCase();
  const isUzbekistan = targetCountryCode === "UZ";
  const profile = getCountryProfile(targetCountryCode);

  // Target currency exchange rate to USD
  const targetExchangeRate = isUzbekistan ? usdRate : profile.defaultRateToUSD;
  const targetCurrencyCode = profile.currencyCode;
  const targetCurrencySymbol = profile.currencySymbol;

  const cleanCode = input.hsCode.code.replace(/\s+/g, "");
  const isMotorVehicle = cleanCode.startsWith("8703");

  // Base CIF calculation in USD
  const cifUSD =
    (input.goodsCostUSD || 0) + (input.deliveryCostUSD || 0) + (input.insuranceCostUSD || 0);
  const cifUZS = Math.round(cifUSD * usdRate);
  const cifTarget = Math.round(cifUSD * targetExchangeRate);

  let dutyTarget = 0;
  let dutyRate = input.hsCode.dutyRate ?? 0;
  let vatTarget = 0;
  let vatRate = isUzbekistan ? (input.hsCode.vatRate ?? 12) : profile.vatRate;
  let exciseTarget = 0;
  let exciseRate = isUzbekistan ? (input.hsCode.exciseRate ?? 0) : 0;
  let customsFeeTarget = 0;
  let additionalFeesTarget = 0;

  // Individual parameters
  const { limitUSD, limitKg } = getIndividualDutyFreeLimits(transportType, targetCountryCode);
  let isExemptFromCustomsDuty = false;
  let taxableExcessUSD = 0;
  let singleCustomsPaymentUSD = 0;

  if (!isImport) {
    // Режим ЭКСПОРТ
    dutyRate = 0;
    dutyTarget = 0;
    vatRate = 0;
    vatTarget = 0;
    exciseRate = 0;
    exciseTarget = 0;
    customsFeeTarget = Math.round(Math.min(Math.max(15, cifUSD * 0.001), 30) * targetExchangeRate);
    additionalFeesTarget = 0;
  } else if (isIndividual && !isMotorVehicle) {
    // Режим ИМПОРТ: ФИЗИЧЕСКОЕ ЛИЦО (товары для личных нужд)
    const goodsValue = input.goodsCostUSD || 0;
    const weight = input.grossWeightKg || 0;

    if (goodsValue <= limitUSD && weight <= limitKg) {
      // В пределах беспошлинного лимита страны назначения
      isExemptFromCustomsDuty = true;
      taxableExcessUSD = 0;
      singleCustomsPaymentUSD = 0;
      dutyRate = 0;
      dutyTarget = 0;
      vatRate = 0;
      vatTarget = 0;
      exciseRate = 0;
      exciseTarget = 0;
      customsFeeTarget = 0;
      additionalFeesTarget =
        isUzbekistan && input.hsCode.hasSpecialRequirements
          ? 75000 * Math.min(input.quantity || 1, 2)
          : 0;
    } else {
      // Превышение беспошлинного порога страны назначения
      isExemptFromCustomsDuty = false;
      taxableExcessUSD = Math.max(0, goodsValue - limitUSD);
      const weightExcess = Math.max(0, weight - limitKg);

      if (isUzbekistan) {
        // Правила Узбекистана: ЕТП 30%
        const costPayment = Math.round(taxableExcessUSD * 0.3);
        const weightPayment = Math.round(weightExcess * 3);
        singleCustomsPaymentUSD = Math.max(costPayment, weightPayment);
        dutyRate = 15;
        vatRate = 15;
        const totalPayment = Math.round(singleCustomsPaymentUSD * targetExchangeRate);
        dutyTarget = Math.round(totalPayment * 0.5);
        vatTarget = totalPayment - dutyTarget;
        customsFeeTarget = 0;
        additionalFeesTarget = input.hsCode.hasSpecialRequirements
          ? 75000 * Math.min(input.quantity || 1, 2)
          : 0;
      } else if (targetCountryCode === "US") {
        // Правила США (Section 321 De Minimis): свыше $800 начисляется пошлина по тарифу
        dutyRate = input.hsCode.dutyRate || 10;
        dutyTarget = Math.round(taxableExcessUSD * (dutyRate / 100));
        vatRate = 0; // Федеральный налог 0%
        vatTarget = 0;
        customsFeeTarget = Math.min(31.67, Math.max(5, taxableExcessUSD * 0.003464));
        singleCustomsPaymentUSD = Math.round(dutyTarget + customsFeeTarget);
      } else if (targetCountryCode === "KZ" || targetCountryCode === "RU") {
        // Правила ЕАЭС (Казахстан, РФ): 15% с суммы превышения (не менее €2 за кг)
        const costPayment = Math.round(taxableExcessUSD * 0.15);
        const weightPayment = Math.round(weightExcess * 2.2);
        singleCustomsPaymentUSD = Math.max(costPayment, weightPayment);
        const totalPayment = Math.round(singleCustomsPaymentUSD * targetExchangeRate);
        dutyRate = 15;
        dutyTarget = totalPayment;
        vatRate = 0;
        vatTarget = 0;
        // Фиксированный сбор за декларирование
        customsFeeTarget = targetCountryCode === "KZ" ? 20000 : 500;
      } else {
        // Другие страны: по ставке страны
        dutyRate = profile.individualExcessDutyRate;
        singleCustomsPaymentUSD = Math.round(taxableExcessUSD * (dutyRate / 100));
        dutyTarget = Math.round(singleCustomsPaymentUSD * targetExchangeRate);
        vatRate = profile.vatRate;
        vatTarget = Math.round(dutyTarget * (vatRate / 100));
        customsFeeTarget = Math.round(15 * targetExchangeRate);
      }
    }
  } else {
    // Режим ИМПОРТ: ЮРИДИЧЕСКОЕ ЛИЦО (коммерческий ввоз)
    // Пошлина
    dutyRate =
      input.customDutyRate !== undefined ? input.customDutyRate : (input.hsCode.dutyRate ?? 0);

    // Преференция СТ-1 для СНГ при ввозе в Узбекистан/Казахстан/РФ (если пользователь явно не задал ручную ставку)
    const isPreferentialCountry = ["RU", "KZ", "BY", "KG", "TJ", "UZ"].includes(
      input.originCountry,
    );
    if (
      input.customDutyRate === undefined &&
      ["UZ", "KZ", "RU"].includes(targetCountryCode) &&
      isPreferentialCountry
    ) {
      dutyRate = 0; // Соглашение о зоне свободной торговли СНГ
    }

    dutyTarget = Math.round(cifTarget * (dutyRate / 100));

    // Акциз
    exciseRate = isUzbekistan ? (input.hsCode.exciseRate ?? 0) : 0;
    exciseTarget = Math.round(cifTarget * (exciseRate / 100));

    // НДС страны назначения (или пользовательская ставка)
    vatRate = input.customVatRate !== undefined ? input.customVatRate : profile.vatRate;
    const vatBase = cifTarget + dutyTarget + exciseTarget;
    vatTarget = Math.round(vatBase * (vatRate / 100));

    // Таможенный сбор страны назначения
    const feeInfo = profile.legalCustomsFeeFormula(cifUSD, targetExchangeRate);
    customsFeeTarget = feeInfo.feeAmount;

    // Дополнительные сборы
    if (isUzbekistan && input.hsCode.hasSpecialRequirements) {
      const qty = input.quantity || 1;
      additionalFeesTarget = 63000 + qty * 56700;
    } else {
      additionalFeesTarget = 0;
    }
  }

  // Общие суммы в целевой валюте
  const totalCustomsPaymentsTarget =
    dutyTarget + vatTarget + exciseTarget + customsFeeTarget + additionalFeesTarget;
  const totalPayableTarget = cifTarget + totalCustomsPaymentsTarget;

  // Конвертация в USD
  const totalCustomsPaymentsUSD = Math.round(
    totalCustomsPaymentsTarget / (targetExchangeRate || 1),
  );
  const totalPayableUSD = Math.round(totalPayableTarget / (targetExchangeRate || 1));

  // Конвертация в UZS для сохранения обратной совместимости
  const totalCustomsPaymentsUZS = isUzbekistan
    ? totalCustomsPaymentsTarget
    : Math.round(totalCustomsPaymentsUSD * usdRate);
  const totalPayableUZS = isUzbekistan ? totalPayableTarget : Math.round(totalPayableUSD * usdRate);

  const dutyUZS = isUzbekistan
    ? dutyTarget
    : Math.round((dutyTarget / targetExchangeRate) * usdRate);
  const vatUZS = isUzbekistan ? vatTarget : Math.round((vatTarget / targetExchangeRate) * usdRate);
  const exciseUZS = isUzbekistan ? exciseTarget : 0;
  const customsFeeUZS = isUzbekistan
    ? customsFeeTarget
    : Math.round((customsFeeTarget / targetExchangeRate) * usdRate);
  const additionalFeesUZS = isUzbekistan ? additionalFeesTarget : 0;
  const singleCustomsPaymentUZS = Math.round(singleCustomsPaymentUSD * usdRate);

  return {
    declarantType,
    individualTransportType: transportType,
    dutyFreeLimitUSD: limitUSD,
    dutyFreeLimitKg: limitKg,
    isExemptFromCustomsDuty,
    taxableExcessUSD,
    singleCustomsPaymentUSD,
    singleCustomsPaymentUZS,
    cifUSD,
    cifUZS,
    dutyUZS,
    dutyRate,
    vatUZS,
    vatRate,
    exciseUZS,
    exciseRate,
    customsFeeUZS,
    additionalFeesUZS,
    totalCustomsPaymentsUZS,
    totalCustomsPaymentsUSD,
    totalPayableUZS,
    totalPayableUSD,
    usdToUzsRate: usdRate,
    date: "15.09.2026",

    // Adaptive profile fields
    targetCountryCode,
    targetCountryName: profile.name,
    targetCurrencyCode,
    targetCurrencySymbol,
    targetExchangeRate,
    customsAuthority: profile.customsAuthority,
    vatName: profile.vatName,
    deMinimisRuleName: profile.deMinimisRuleName,
    deMinimisNote: profile.deMinimisNote,
    isAdaptiveNonUzbekistan: !isUzbekistan,
    totalCustomsPaymentsTarget,
    totalPayableTarget,
    cifTarget,
    dutyTarget,
    vatTarget,
    exciseTarget,
    customsFeeTarget,
    additionalFeesTarget,
  };
}
