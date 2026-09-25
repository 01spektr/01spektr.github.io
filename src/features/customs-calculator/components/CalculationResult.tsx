import React, { useState, useMemo } from "react";
import { RefreshCw, Check, Copy, Download, Share2, Info, ArrowRight, Loader2 } from "lucide-react";
import { CalculationBreakdown, CalculationInput } from "../types";
import { formatUSD, getIndividualDutyFreeLimits } from "../utils/calculator";
import { formatCustomCurrency, getCountryProfile } from "../utils/countryProfiles";
import { CountryFlag } from "./CountryFlag";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "../context/LanguageContext";

interface CalculationResultProps {
  result: CalculationBreakdown;
  input: CalculationInput;
  onRefreshRate: () => void;
  onOpenRateModal: () => void;
}

function getTransportLabel(
  type?: string,
  limits?: { limitUSD: number; limitKg: number },
  t?: (key: string, fallback?: any) => any,
): string {
  const dutyFreeTo = t ? t("result.dutyFreeTo", "duty-free up to") : "беспошлинно до";
  const kgText = t ? t("common.kg", "kg") : "кг";
  const limText = limits
    ? `(${dutyFreeTo} $${limits.limitUSD.toLocaleString("ru-RU")} / ${limits.limitKg} ${kgText})`
    : "";
  const airText = t ? t("calculator.air", "Air") : "Авиасообщение (аэропорт)";
  const postText = t
    ? t("calculator.post", "Postal / Courier")
    : "Международные почтовые / курьерские отправления";
  const autoText = t
    ? t("calculator.auto", "Road / pedestrian")
    : "Автодорожный / пешеходный переход";
  const railText = t ? t("calculator.rail", "Railway transport") : "Железнодорожный транспорт";
  switch (type) {
    case "air":
      return `${airText} ${limText}`;
    case "post":
      return `${postText} ${limText}`;
    case "auto":
      return `${autoText} ${limText}`;
    case "rail":
      return `${railText} ${limText}`;
    default:
      return `${airText} ${limText}`;
  }
}

function generateReportHTML(
  result: CalculationBreakdown,
  input: CalculationInput,
  t: (key: string, fallback?: any) => any,
): string {
  const isExport = input.operationType === "export";
  const isIndividual = input.declarantType === "individual";
  const targetCode = result.targetCountryCode || input.destinationCountry || "UZ";
  const profile = getCountryProfile(targetCode);
  const limits = getIndividualDutyFreeLimits(input.individualTransportType || "air", targetCode);
  const isExceeded =
    isIndividual && result.taxableExcessUSD !== undefined && result.taxableExcessUSD > 0;

  const currencyCode = result.targetCurrencyCode || profile.currencyCode || "USD";
  const currencySymbol = result.targetCurrencySymbol || profile.currencySymbol || "$";
  const targetRate = result.targetExchangeRate ?? result.usdToUzsRate;
  const formatReportCurr = (amt?: number) =>
    formatCustomCurrency(amt || 0, currencyCode, currencySymbol);

  const totalPayable =
    result.totalPayableTarget !== undefined ? result.totalPayableTarget : result.totalPayableUZS;
  const totalCustomsPayments =
    result.totalCustomsPaymentsTarget !== undefined
      ? result.totalCustomsPaymentsTarget
      : result.totalCustomsPaymentsUZS;
  const cifAmount = result.cifTarget !== undefined ? result.cifTarget : result.cifUZS;
  const dutyAmount = result.dutyTarget !== undefined ? result.dutyTarget : result.dutyUZS;
  const vatAmount = result.vatTarget !== undefined ? result.vatTarget : result.vatUZS;
  const exciseAmount = result.exciseTarget !== undefined ? result.exciseTarget : result.exciseUZS;
  const customsFeeAmount =
    result.customsFeeTarget !== undefined ? result.customsFeeTarget : result.customsFeeUZS;
  const additionalFeesAmount =
    result.additionalFeesTarget !== undefined
      ? result.additionalFeesTarget
      : result.additionalFeesUZS;
  const etpAmount = dutyAmount + vatAmount;

  const dutyUSD = targetRate > 0 ? dutyAmount / targetRate : 0;
  const vatUSD = targetRate > 0 ? vatAmount / targetRate : 0;
  const exciseUSD = targetRate > 0 ? exciseAmount / targetRate : 0;
  const customsFeeUSD = targetRate > 0 ? customsFeeAmount / targetRate : 0;
  const additionalFeesUSD = targetRate > 0 ? additionalFeesAmount / targetRate : 0;
  const etpUSD = dutyUSD + vatUSD;

  const countryName = t(`countries.${targetCode}`, result.targetCountryName || profile.name);
  const customsAuthority = t(
    `authorities.${targetCode}`,
    result.customsAuthority || profile.customsAuthority,
  );
  const deMinimisRule = t(`deMinimisRuleNames.${targetCode}`, profile.deMinimisRuleName);

  const reportProductName =
    input.manualProductName ||
    (() => {
      if (input.hsCode?.code) {
        const cleanCode = input.hsCode.code.replace(/\s+/g, "");
        const translated = t(`goods.${cleanCode}`);
        if (translated && translated !== `goods.${cleanCode}`) {
          return translated;
        }
      }
      return input.hsCode?.name || t("calculator.defaultProductName");
    })();

  return `
    <div style="padding: 10px; background: #ffffff; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0066FF; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <div style="display: inline-block; font-size: 11px; font-weight: 700; color: #0066FF; text-transform: uppercase; letter-spacing: 0.5px; background: #eff6ff; padding: 4px 8px; border-radius: 6px; margin-bottom: 6px;">
            Toolboxi Customs • ${t("result.title", "Customs Summary")}
          </div>
          <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2;">
            ${t("result.reportHeader", "CUSTOMS DUTY CALCULATION")}
          </h1>
          <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
            ${countryName} | ${customsAuthority}
          </div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #475569; line-height: 1.5;">
          <div>${t("result.calcDate", "Date")}: <strong>${result.date}</strong></div>
          <div>
            ${
              currencyCode === "USD"
                ? `<strong style="color: #0066FF;">${t("result.currencyLabel", "Currency")}: USD ($)</strong>`
                : `${t("result.currencyRate", "Rate")}: <strong style="color: #0066FF;">1 USD = ${targetRate.toLocaleString("ru-RU")} ${currencyCode}</strong>`
            }
          </div>
          <div style="margin-top: 4px;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; ${
              isExport
                ? "background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;"
                : "background: #eff6ff; color: #0066FF; border: 1px solid #bfdbfe;"
            }">
              ${(isIndividual ? t("result.individual", "INDIVIDUAL") : t("result.legal", "LEGAL ENTITY")).toUpperCase()} • ${(isExport ? t("result.export", "EXPORT") : t("result.import", "IMPORT")).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <!-- Info Meta Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 20px; font-size: 13px;">
        <div><span style="color: #64748b;">${t("result.declarantStatus", "Declarant Status")}:</span> <strong style="color: #0f172a;">${isIndividual ? t("result.individualPersonal", "Individual (personal needs)") : t("result.legalDeclaration", "Legal entity (declaration)")}</strong></div>
        <div><span style="color: #64748b;">${t("result.hsCode", "HS Code")}:</span> <strong style="color: #0066FF; font-size: 14px;">${input.hsCode.code}</strong></div>
        <div style="grid-column: span 2;"><span style="color: #64748b;">${t("result.productName", "Product")}:</span> <strong style="color: #0f172a;">${reportProductName}</strong></div>
        <div><span style="color: #64748b;">${t("result.quantity", "Quantity")}:</span> <strong>${input.quantity} ${t(`units.${input.unit}`, input.unit)}</strong></div>
        <div><span style="color: #64748b;">${t("result.grossWeight", "Gross Weight")}:</span> <strong>${input.grossWeightKg} ${t(`units.${input.weightUnit || "кг"}`, input.weightUnit || t("common.kg", "kg"))}</strong></div>
        <div><span style="color: #64748b;">${t("result.destinationCountry", "Destination Country")}:</span> <strong>${countryName}</strong></div>
        <div><span style="color: #64748b;">${t("calculator.departureCountry", "Departure")} / ${t("calculator.originCountry", "Origin")}:</span> <strong>${t("countries." + input.departureCountry, input.departureCountry)} / ${t("countries." + input.originCountry, input.originCountry)}</strong></div>
        ${isIndividual ? `<div style="grid-column: span 2;"><span style="color: #64748b;">${targetCode === "UZ" ? t("calculator.transportMethod", "Transport method:") : t("calculator.dutyFreeLimitLabel", "Duty-free limit:")}</span> <strong>${targetCode === "UZ" ? getTransportLabel(input.individualTransportType, limits, t) : `${t("result.upTo", "up to")} $${limits.limitUSD.toLocaleString("ru-RU")} (${limits.limitKg} ${t("common.kg", "kg")}) — ${deMinimisRule}`}</strong></div>` : ""}
      </div>

      ${
        isIndividual
          ? `
      <!-- Individual Entity Customs Status Banner -->
      <div style="margin-bottom: 20px; padding: 14px 16px; border-radius: 8px; font-size: 13px; ${
        !isExceeded
          ? "background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46;"
          : "background: #fffbeb; border: 1px solid #fde68a; color: #92400e;"
      }">
        <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">
          ${!isExceeded ? `✓ ${t("result.bannerWithinNorm", "Value is within duty-free limits")} (${countryName})` : `⚠ ${t("result.bannerExcess", "Duty-free limit exceeded by")} $${result.taxableExcessUSD?.toLocaleString("ru-RU") || 0}`}
        </div>
        <div style="font-size: 12px; line-height: 1.4;">
          ${
            targetCode === "UZ"
              ? !isExceeded
                ? `${t("result.bannerWithinNormDesc", "Weight and value do not exceed established limits")} ($${limits.limitUSD.toLocaleString("ru-RU")}, ${limits.limitKg} ${t("common.kg", "kg")})`
                : `${t("result.bannerExcessDesc", "Customs duty calculated from excess amount")} ($${result.taxableExcessUSD?.toLocaleString("ru-RU")})`
              : t(`deMinimisNotes.${targetCode}`, profile.deMinimisNote)
          }
        </div>
      </div>
      `
          : ""
      }

      <!-- Primary Calculations Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
        <thead>
          <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
            <th style="text-align: left; padding: 10px 12px; font-weight: 700; color: #475569;">${t("result.paymentType", "Payment type")}</th>
            <th style="text-align: right; padding: 10px 12px; font-weight: 700; color: #475569;">${currencyCode} (${currencySymbol})</th>
            <th style="text-align: right; padding: 10px 12px; font-weight: 700; color: #475569;">USD ($)</th>
            <th style="text-align: right; padding: 10px 12px; font-weight: 700; color: #475569;">%</th>
          </tr>
        </thead>
        <tbody>
          <!-- CIF -->
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px;"><strong>${isExport ? t("result.fobCost", "Invoice / FOB") : t("result.cifCost", "Customs Value (CIF)")}</strong></td>
            <td style="text-align: right; padding: 10px 12px; font-weight: 700;">${formatReportCurr(cifAmount)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${formatUSD(result.cifUSD)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${totalPayable > 0 ? ((cifAmount / totalPayable) * 100).toFixed(1) : 0}%</td>
          </tr>
          ${
            isIndividual
              ? `
          <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;">
            <td style="padding: 10px 12px;">
              <span>${t("result.itemInDutyFreeNorm", "Within duty-free norm")} (${t("result.upTo", "up to")} $${limits.limitUSD})</span>
              <span style="font-size: 10px; background: #ecfdf5; color: #059669; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">0%</span>
            </td>
            <td style="text-align: right; padding: 10px 12px; font-weight: 700; color: #059669;">0 ${currencySymbol}</td>
            <td style="text-align: right; padding: 10px 12px; color: #059669;">$0</td>
            <td style="text-align: right; padding: 10px 12px; color: #059669;">0.0%</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px;">
              <strong>${targetCode === "UZ" ? t("result.singlePayment", "Single customs payment (ETP 30%)") : t("result.excessPayment", "Duty / Import tax")}</strong>
            </td>
            <td style="text-align: right; padding: 10px 12px; font-weight: 700; color: #0f172a;">${formatReportCurr(etpAmount)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${formatUSD(etpUSD)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${totalPayable > 0 ? ((etpAmount / totalPayable) * 100).toFixed(1) : 0}%</td>
          </tr>
          `
              : `
          <!-- Duty -->
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px;">
              <span>${isExport ? t("result.exportFeePayable", "Export duty") : `${t("result.importDuty", "Import customs duty")} (${result.dutyRate}%)`}</span>
            </td>
            <td style="text-align: right; padding: 10px 12px; font-weight: 700;">${formatReportCurr(dutyAmount)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${formatUSD(dutyUSD)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${totalPayable > 0 ? ((dutyAmount / totalPayable) * 100).toFixed(1) : 0}%</td>
          </tr>
          <!-- VAT -->
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px;">
              <span>${isExport ? t("result.vatExport", "VAT (Export)") : `${result.vatName || t("result.vat", "VAT")} (${result.vatRate}%)`}</span>
            </td>
            <td style="text-align: right; padding: 10px 12px; font-weight: 700;">${formatReportCurr(vatAmount)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${formatUSD(vatUSD)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${totalPayable > 0 ? ((vatAmount / totalPayable) * 100).toFixed(1) : 0}%</td>
          </tr>
          <!-- Excise -->
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px;"><span>${t("result.excise", "Excise tax")}</span></td>
            <td style="text-align: right; padding: 10px 12px; font-weight: 700;">${formatReportCurr(exciseAmount)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${formatUSD(exciseUSD)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${totalPayable > 0 ? ((exciseAmount / totalPayable) * 100).toFixed(1) : 0}%</td>
          </tr>
          `
          }
          <!-- Customs Fee -->
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px;">
              <span>${isExport ? t("result.customsFeeExport", "Customs clearance fee") : targetCode === "US" ? t("result.customsFeeMpf", "Customs Fee (MPF)") : t("result.customsFee", "Customs clearance fee")}</span>
            </td>
            <td style="text-align: right; padding: 10px 12px; font-weight: 700;">${formatReportCurr(customsFeeAmount)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${formatUSD(customsFeeUSD)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${totalPayable > 0 ? ((customsFeeAmount / totalPayable) * 100).toFixed(1) : 0}%</td>
          </tr>
          <!-- Additional Fees -->
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px;"><span>${t("result.additionalFees", "Additional fees")}</span></td>
            <td style="text-align: right; padding: 10px 12px; font-weight: 700;">${formatReportCurr(additionalFeesAmount)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${formatUSD(additionalFeesUSD)}</td>
            <td style="text-align: right; padding: 10px 12px; color: #64748b;">${totalPayable > 0 ? ((additionalFeesAmount / totalPayable) * 100).toFixed(1) : 0}%</td>
          </tr>
          <!-- TOTAL CUSTOMS PAYMENTS -->
          <tr style="background: #eff6ff; border-top: 2px solid #0066FF; border-bottom: 2px solid #0066FF; font-size: 14px;">
            <td style="padding: 12px; font-weight: 800; color: #0066FF;">
              ${t("result.customsPaymentsPayable", "TOTAL CUSTOMS PAYMENTS")} (${countryName})
            </td>
            <td style="text-align: right; padding: 12px; font-weight: 800; color: #0066FF; font-size: 16px;">
              ${formatReportCurr(totalCustomsPayments)}
            </td>
            <td style="text-align: right; padding: 12px; font-weight: 700; color: #0066FF;">
              ${formatUSD(result.totalCustomsPaymentsUSD)}
            </td>
            <td style="text-align: right; padding: 12px; font-weight: 700; color: #0066FF;">
              ${totalPayable > 0 ? ((totalCustomsPayments / totalPayable) * 100).toFixed(1) : 0}%
            </td>
          </tr>
          <!-- TOTAL LANDED COST -->
          <tr style="background: #f8fafc; font-size: 14px;">
            <td style="padding: 12px; font-weight: 800; color: #0f172a;">
              ${t("result.fullLandedCost", "Full Landed Cost (CIF + Customs)")}
            </td>
            <td style="text-align: right; padding: 12px; font-weight: 800; color: #0f172a; font-size: 16px;">
              ${formatReportCurr(totalPayable)}
            </td>
            <td style="text-align: right; padding: 12px; font-weight: 700; color: #0f172a;">
              ${formatUSD(result.totalPayableUSD)}
            </td>
            <td style="text-align: right; padding: 12px; font-weight: 700; color: #0f172a;">
              100%
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Footer Note -->
      <div style="font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        <p style="margin: 0 0 4px 0;"><strong>${t("disclaimer.title", "Notice")}:</strong> ${t("disclaimer.text", "Calculation is informational and based on open customs tariffs. Exact fees are determined by the customs declaration.")}</p>
        <p style="margin: 0; color: #94a3b8;">${t("result.sourcePortal", "Toolboxi.uz Customs Portal")} • ${result.date} • ${customsAuthority}</p>
      </div>
    </div>
  `;
}

export const CalculationResult: React.FC<CalculationResultProps> = ({
  result,
  input,
  onRefreshRate,
  onOpenRateModal,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [shared, setShared] = useState(false);

  const isExport = input.operationType === "export";
  const isIndividual = input.declarantType === "individual";
  const targetCode = result.targetCountryCode || input.destinationCountry || "UZ";
  const profile = getCountryProfile(targetCode);
  const limits = getIndividualDutyFreeLimits(input.individualTransportType || "air", targetCode);
  const isExceeded =
    isIndividual && result.taxableExcessUSD !== undefined && result.taxableExcessUSD > 0;

  const currencyCode = result.targetCurrencyCode || profile.currencyCode || "USD";
  const currencySymbol = result.targetCurrencySymbol || profile.currencySymbol || "$";
  const targetRate = result.targetExchangeRate ?? result.usdToUzsRate;
  const formatCurr = (amt?: number) => formatCustomCurrency(amt || 0, currencyCode, currencySymbol);

  const totalPayable =
    result.totalPayableTarget !== undefined ? result.totalPayableTarget : result.totalPayableUZS;
  const totalCustomsPayments =
    result.totalCustomsPaymentsTarget !== undefined
      ? result.totalCustomsPaymentsTarget
      : result.totalCustomsPaymentsUZS;
  const cifAmount = result.cifTarget !== undefined ? result.cifTarget : result.cifUZS;
  const dutyAmount = result.dutyTarget !== undefined ? result.dutyTarget : result.dutyUZS;
  const vatAmount = result.vatTarget !== undefined ? result.vatTarget : result.vatUZS;
  const exciseAmount = result.exciseTarget !== undefined ? result.exciseTarget : result.exciseUZS;
  const customsFeeAmount =
    result.customsFeeTarget !== undefined ? result.customsFeeTarget : result.customsFeeUZS;
  const additionalFeesAmount =
    result.additionalFeesTarget !== undefined
      ? result.additionalFeesTarget
      : result.additionalFeesUZS;
  const etpAmount = dutyAmount + vatAmount;

  const totalForPercentages = totalPayable > 0 ? totalPayable : 1;
  const cifPct = ((cifAmount / totalForPercentages) * 100).toFixed(1);
  const dutyPct = ((dutyAmount / totalForPercentages) * 100).toFixed(1);
  const vatPct = ((vatAmount / totalForPercentages) * 100).toFixed(1);
  const excisePct = ((exciseAmount / totalForPercentages) * 100).toFixed(1);
  const feePct = ((customsFeeAmount / totalForPercentages) * 100).toFixed(1);
  const addPct = ((additionalFeesAmount / totalForPercentages) * 100).toFixed(1);
  const etpPct = ((etpAmount / totalForPercentages) * 100).toFixed(1);

  const localizedProductName = useMemo(() => {
    if (input.manualProductName) {
      return input.manualProductName;
    }
    if (input.hsCode?.code) {
      const cleanCode = input.hsCode.code.replace(/\s+/g, "");
      const translated = t(`goods.${cleanCode}`);
      if (translated && translated !== `goods.${cleanCode}`) {
        return translated;
      }
    }
    return input.hsCode?.name || t("calculator.defaultProductName");
  }, [input.manualProductName, input.hsCode, t]);

  const handleCopy = () => {
    const authorityStr = t(
      `authorities.${targetCode}`,
      result.customsAuthority || profile.customsAuthority,
    );
    const summary = `
${t("result.reportTitle")}: ${localizedProductName}
${t("result.hsCode")}: ${input.hsCode.code}
${t("result.destinationCountry")}: ${t(`countries.${targetCode}`, profile.name)} (${authorityStr})
${t("result.declarantStatus")}: ${isIndividual ? t("result.individual") : t("result.legal")} (${isExport ? t("result.export") : t("result.import")})
${t("result.quantity")}: ${input.quantity} ${t(`units.${input.unit}`, input.unit)}
${t("result.goodsCost")}: $${input.goodsCostUSD.toLocaleString("ru-RU")}
${t("result.customsPaymentsPayable")}: ${formatCurr(totalCustomsPayments)} (~${formatUSD(result.totalCustomsPaymentsUSD)})
${t("result.totalWithGoods")}: ${formatCurr(totalPayable)}
${t("result.calcDate")}: ${result.date}
Toolboxi.uz Customs Portal
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);

    try {
      const printContainer = document.createElement("div");
      printContainer.style.position = "fixed";
      printContainer.style.left = "-9999px";
      printContainer.style.top = "0";
      printContainer.style.width = "794px";
      printContainer.style.backgroundColor = "#ffffff";
      printContainer.style.color = "#0f172a";
      printContainer.style.padding = "36px 40px";
      printContainer.style.boxSizing = "border-box";
      printContainer.style.zIndex = "-9999";

      printContainer.innerHTML = generateReportHTML(result, input, t);
      document.body.appendChild(printContainer);

      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(printContainer);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(pdfHeight, 297));

      const safeCode = input.hsCode.code.replace(/[\s\.\-]+/g, "_");
      const filename = `Customs_Report_${profile.code}_${safeCode}.pdf`;

      pdf.save(filename);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${t("pageHeader.title")} — Toolboxi`,
          text: `${t("result.reportTitle")}: ${localizedProductName} (${t(`countries.${targetCode}`, profile.name)}): ${formatCurr(totalCustomsPayments)}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-6 flex flex-col h-full transition-colors"
      id="calculation-result-card"
    >
      {/* Card Header with Country Flag and Authority */}
      <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
            <CountryFlag code={targetCode} className="w-5 h-3.5 rounded-xs shadow-2xs" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-base sm:text-[19px] font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                {t("result.title")}
              </h2>
              <span
                className={`text-[10.5px] sm:text-[11px] font-secondary font-semibold px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1.5 ${
                  isIndividual
                    ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    : isExport
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                }`}
              >
                <span>{t(`countries.${targetCode}`, profile.shortName || profile.name)}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>
                  {isIndividual
                    ? t("result.individual")
                    : isExport
                      ? t("result.export")
                      : t("result.legal")}
                </span>
              </span>
            </div>
            <p className="text-[11px] sm:text-[11.5px] font-secondary text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {t(`authorities.${targetCode}`, result.customsAuthority || profile.customsAuthority)}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Total Customs Payments Section */}
      <div className="pt-4 sm:pt-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="text-[12px] sm:text-[12.5px] font-medium text-slate-500 dark:text-slate-400 break-words">
              {isIndividual
                ? `${t("result.customsPaymentsPayable")} (${t(`countries.${targetCode}`, profile.shortName || profile.name)})`
                : isExport
                  ? `${t("result.exportFeePayable")} (${t(`countries.${targetCode}`, profile.shortName || profile.name)})`
                  : `${t("result.customsPaymentsPayable")} (${t(`countries.${targetCode}`, profile.shortName || profile.name)})`}
            </div>
            <div className="flex flex-wrap items-baseline gap-2 mt-1.5 min-w-0">
              <span
                className={`text-2xl sm:text-[32px] md:text-[36px] font-bold tracking-tight leading-none break-words ${
                  totalCustomsPayments === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-[#0066FF] dark:text-blue-400"
                }`}
                id="result-total-customs-payments"
              >
                {formatCurr(totalCustomsPayments)}
              </span>
              {totalCustomsPayments === 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-[11.5px] font-medium bg-[#ecfdf5] dark:bg-emerald-950/60 text-[#16a34a] dark:text-emerald-400 border border-[#bbf7d0] dark:border-emerald-800 shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  {t("result.dutyFreeExempt")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-[11.5px] font-medium bg-[#ecfdf5] dark:bg-emerald-950/60 text-[#16a34a] dark:text-emerald-400 border border-[#bbf7d0] dark:border-emerald-800 shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  {t("result.estimatedCalculation")}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] sm:text-[13px] text-slate-500 dark:text-slate-400 mt-2">
              {currencyCode !== "USD" && (
                <>
                  <span>≈ {formatUSD(result.totalCustomsPaymentsUSD)}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                </>
              )}
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {t("result.totalWithGoods")}{" "}
                <strong className="text-slate-900 dark:text-white font-semibold">
                  {formatCurr(totalPayable)}
                </strong>
                {currencyCode !== "USD" && (
                  <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">
                    ({formatUSD(result.totalPayableUSD)})
                  </span>
                )}
              </span>
            </div>
          </div>

          <p className="text-[11px] sm:text-[11.5px] text-slate-400 dark:text-slate-500 max-w-[240px] leading-relaxed sm:text-right hidden sm:block">
            {isIndividual ? t("result.disclaimerPersonal") : t("result.disclaimerCommercial")}
          </p>
        </div>

        {/* Individual Entity Status Banner */}
        {isIndividual && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-[12px] sm:text-[12.5px] ${
              !isExceeded
                ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  !isExceeded ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span className="truncate">
                {!isExceeded
                  ? `${t("result.bannerWithinNorm")} (${t(`countries.${targetCode}`, profile.name)})`
                  : `${t("result.bannerExcess")} $${result.taxableExcessUSD?.toLocaleString("ru-RU") || 0}`}
              </span>
            </div>
            <div className="text-[11.5px] sm:text-[12px] opacity-90 leading-relaxed">
              {t(`deMinimisNotes.${targetCode}`, result.deMinimisNote || profile.deMinimisNote) ? (
                <span>
                  {t(`deMinimisNotes.${targetCode}`, result.deMinimisNote || profile.deMinimisNote)}
                </span>
              ) : !isExceeded ? (
                <>
                  {t("result.bannerWithinNormDesc")} (${limits.limitUSD.toLocaleString("ru-RU")},{" "}
                  {limits.limitKg} {t("common.kg")})
                </>
              ) : (
                <>
                  {t("result.bannerExcessDesc")} ($
                  {result.taxableExcessUSD?.toLocaleString("ru-RU")})
                </>
              )}
            </div>
          </div>
        )}

        {/* Currency Exchange Rate Bar */}
        <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50/90 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 mt-4 mb-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
            <span className="text-slate-500 dark:text-slate-400">{t("result.calcCurrency")}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {currencyCode} ({currencySymbol})
            </span>
            {currencyCode !== "USD" && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {t("result.officialRate")}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  1 USD = {targetRate.toLocaleString("ru-RU")} {currencyCode}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenRateModal}
              className="text-[11.5px] font-semibold text-[#0066FF] dark:text-blue-400 hover:underline cursor-pointer"
              title={t("result.changeRate")}
              id="btn-edit-exchange-rate"
            >
              {t("result.changeRate")}
            </button>
            <button
              type="button"
              onClick={onRefreshRate}
              className="text-slate-400 dark:text-slate-500 hover:text-[#0066FF] dark:hover:text-blue-400 transition-colors p-1 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
              title={t("result.refreshRate")}
              id="btn-refresh-exchange-rate"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Cost Breakdown Table */}
        <div className="mt-4 sm:mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5">
          {/* Row 1: CIF */}
          <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                {isExport ? t("result.fobCost") : t("result.cifCost")}
              </span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
              {formatCurr(cifAmount)}
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 w-9 sm:w-11 text-right">
                {cifPct}%
              </span>
              <div className="w-10 xs:w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#0066FF] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Number(cifPct))}%` }}
                />
              </div>
            </div>
          </div>

          {isIndividual ? (
            <>
              {/* Row 2 (Individual): Duty-free allowance */}
              <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                      {t("result.itemInDutyFreeNorm")} ({t("result.upTo")} ${limits.limitUSD})
                    </span>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                      0%
                    </span>
                  </div>
                </div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-right whitespace-nowrap">
                  0 {currencySymbol}
                </div>
                <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
                  <span className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 w-9 sm:w-11 text-right">
                    0.0%
                  </span>
                  <div className="w-10 xs:w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>

              {/* Row 3 (Individual): Excess tax / ETP */}
              <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0" />
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                      {targetCode === "UZ" ? t("result.singlePayment") : t("result.excessPayment")}
                    </span>
                    {isExceeded ? (
                      <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded border border-purple-200 dark:border-purple-800 shrink-0">
                        {t("result.excessDutyLabel")}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded shrink-0">
                        0%
                      </span>
                    )}
                  </div>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
                  {formatCurr(etpAmount)}
                </div>
                <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 w-9 sm:w-11 text-right">
                    {etpPct}%
                  </span>
                  <div className="w-10 xs:w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#8B5CF6] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Number(etpPct))}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Row 2: Duty */}
              <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0" />
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                      {isExport
                        ? t("result.exportFeePayable")
                        : `${t("result.importDuty")} (${result.dutyRate}%)`}
                    </span>
                    {isExport && (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded shrink-0">
                        0%
                      </span>
                    )}
                  </div>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
                  {formatCurr(dutyAmount)}
                </div>
                <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 w-9 sm:w-11 text-right">
                    {dutyPct}%
                  </span>
                  <div className="w-10 xs:w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#8B5CF6] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Number(dutyPct))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: VAT */}
              <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] shrink-0" />
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                      {isExport
                        ? t("result.vatExport")
                        : `${result.vatName || t("result.vat")} (${result.vatRate}%)`}
                    </span>
                    {isExport && (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded shrink-0">
                        0%
                      </span>
                    )}
                  </div>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
                  {formatCurr(vatAmount)}
                </div>
                <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 w-9 sm:w-11 text-right">
                    {vatPct}%
                  </span>
                  <div className="w-10 xs:w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#EC4899] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Number(vatPct))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Excise */}
              <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {t("result.excise")}
                  </span>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
                  {formatCurr(exciseAmount)}
                </div>
                <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 w-9 sm:w-11 text-right">
                    {excisePct}%
                  </span>
                  <div className="w-10 xs:w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#94A3B8] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Number(excisePct))}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Row 5: Customs Fee */}
          <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                {isExport
                  ? t("result.customsFeeExport")
                  : targetCode === "US"
                    ? t("result.customsFeeMpf")
                    : t("result.customsFee")}
              </span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
              {formatCurr(customsFeeAmount)}
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 w-9 sm:w-11 text-right">
                {feePct}%
              </span>
              <div className="w-10 xs:w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#F97316] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Number(feePct))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Row 6: Additional Fees */}
          <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                {t("result.additionalFees")}
              </span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
              {formatCurr(additionalFeesAmount)}
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 w-9 sm:w-11 text-right">
                {addPct}%
              </span>
              <div className="w-10 xs:w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#10B981] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Number(addPct))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Row 7: Total Customs Payments Highlighted Row */}
          <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[13.5px] py-2 px-2.5 sm:px-3 bg-[#eef6ff] dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/60 rounded-xl mt-2">
            <div className="font-bold text-[#0066FF] dark:text-blue-400 truncate">
              {t("result.customsPaymentsPayable")} ({t(`countries.${targetCode}`, profile.name)})
            </div>
            <div className="font-bold text-[#0066FF] dark:text-blue-400 text-right whitespace-nowrap">
              {formatCurr(totalCustomsPayments)}
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
              <span className="text-[11px] sm:text-xs font-bold text-[#0066FF] dark:text-blue-400 w-9 sm:w-11 text-right">
                {totalPayable > 0 ? ((totalCustomsPayments / totalPayable) * 100).toFixed(1) : "0"}%
              </span>
              <div className="w-10 xs:w-16 sm:w-24 bg-blue-200/80 dark:bg-blue-900/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#0066FF] dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, totalPayable > 0 ? (totalCustomsPayments / totalPayable) * 100 : 0)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Row 8: Full Landed Cost (Goods CIF + Customs) */}
          <div className="grid grid-cols-[1fr_auto_70px] xs:grid-cols-[1fr_auto_100px] sm:grid-cols-[1fr_130px_136px] items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] py-1.5 px-2.5 sm:px-3 bg-slate-100/80 dark:bg-slate-800 rounded-xl mt-1 text-slate-700 dark:text-slate-300">
            <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {t("result.fullLandedCost")}
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
              {formatCurr(totalPayable)}
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-3 w-16 xs:w-24 sm:w-36 shrink-0">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 w-9 sm:w-11 text-right">
                100%
              </span>
              <div className="w-10 xs:w-16 sm:w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-700 dark:bg-slate-400 h-full w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Mini Cards: Параметры расчёта & Важно знать */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto pt-1 pb-4">
        {/* Card 1: Параметры расчёта */}
        <div className="bg-[#f8fafc] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 text-[12px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
            <div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
              i
            </div>
            <span>{t("result.calcParams")}</span>
          </div>
          <div className="space-y-1 font-normal">
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.destinationCountry")}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 truncate">
                <CountryFlag code={targetCode} className="w-4 h-2.5 rounded-xs shrink-0" />
                <span className="truncate">{t(`countries.${targetCode}`, profile.name)}</span>
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.declarantStatus")}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {isIndividual ? t("result.individual") : t("result.legal")}
              </span>
            </div>
            {isIndividual && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">
                  {t("result.transportMode")}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-right">
                  {input.individualTransportType === "air"
                    ? `${t("result.air")} ($${limits.limitUSD} / ${limits.limitKg} ${t("common.kg")})`
                    : input.individualTransportType === "post"
                      ? `${t("result.post")} ($${limits.limitUSD} / ${limits.limitKg} ${t("common.kg")})`
                      : input.individualTransportType === "auto"
                        ? `${t("result.auto")} ($${limits.limitUSD} / ${limits.limitKg} ${t("common.kg")})`
                        : `${t("result.rail")} ($${limits.limitUSD} / ${limits.limitKg} ${t("common.kg")})`}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.customsRegime")}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {isExport ? t("result.export") : t("result.import")}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.hsCode")}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11.5px] truncate">
                {input.hsCode.code}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.productName")}
              </span>
              <span
                className="text-slate-800 dark:text-slate-200 truncate max-w-[150px] text-right"
                title={localizedProductName}
              >
                {localizedProductName}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.quantity")}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {input.quantity} {t(`units.${input.unit}`, input.unit)} × $
                {input.unitPriceUSD ??
                  Math.round(((input.goodsCostUSD || 0) / (input.quantity || 1)) * 100) / 100}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.invoiceValue")}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                ${input.goodsCostUSD.toLocaleString("ru-RU")}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.grossWeight")}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {input.grossWeightKg}{" "}
                {t(`units.${input.weightUnit || "кг"}`, input.weightUnit || t("common.kg"))}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {isIndividual ? t("result.excessDutyLabel") : t("result.dutyRateLabel")}
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {isIndividual
                  ? isExceeded
                    ? targetCode === "UZ"
                      ? t("result.etp30")
                      : t("result.countryTariff")
                    : t("result.inNormZero")
                  : isExport
                    ? t("result.exportZero")
                    : `${result.dutyRate}%`}
              </span>
            </div>
            {!isIndividual && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">
                  {result.vatName || t("result.vat")}
                </span>
                <span className="text-slate-800 dark:text-slate-200">
                  {isExport ? "0%" : `${result.vatRate}%`}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.currencyLabel")}
              </span>
              <span className="text-slate-800 dark:text-slate-200 truncate">
                {currencyCode === "USD"
                  ? "USD ($)"
                  : `USD → ${currencyCode} (${targetRate.toLocaleString("ru-RU")})`}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                {t("result.calcDate")}
              </span>
              <span className="text-slate-800 dark:text-slate-200">{result.date}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Важно знать */}
        <div className="bg-[#f0f7ff] dark:bg-blue-950/40 border border-[#dbeafe] dark:border-blue-900/60 rounded-xl p-3 text-[12px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              <div className="w-4 h-4 rounded-full border border-[#0066FF] dark:border-blue-400 text-[#0066FF] dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                i
              </div>
              <span className="truncate">
                {t("result.importantToKnow")} ({t(`countries.${targetCode}`, profile.name)})
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] sm:text-[11.5px]">
              {t(`deMinimisNotes.${targetCode}`, result.deMinimisNote || profile.deMinimisNote)
                ? t(`deMinimisNotes.${targetCode}`, result.deMinimisNote || profile.deMinimisNote)
                : isIndividual
                  ? targetCode === "UZ"
                    ? t("result.disclaimerPersonal")
                    : t(
                        `deMinimisNotes.${targetCode}`,
                        profile.deMinimisNote || t("result.disclaimerPersonal"),
                      )
                  : isExport
                    ? t("result.disclaimerCommercial")
                    : `${t(`authorities.${targetCode}`, result.customsAuthority || profile.customsAuthority)}. ${t("result.disclaimerCommercial")}`}
            </p>
          </div>
          <a
            href={profile.customsWebsite || "https://customs.uz"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#0066FF] dark:text-blue-400 hover:underline font-medium text-[11.5px] mt-2 group truncate"
          >
            <span className="truncate">
              {t(
                `authorities.${targetCode}`,
                result.customsAuthority || profile.customsAuthority,
              ) || t("result.officialCustomsSite")}
            </span>
            <span className="group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
          </a>
        </div>
      </div>

      {/* Action Buttons: Скопировать расчёт, Скачать PDF, Поделиться */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-2.5 sm:py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl text-[12.5px] font-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
          id="btn-copy-result"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                {t("result.copied")}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{t("result.copy")}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloadingPdf}
          className="flex items-center justify-center gap-2 py-2.5 sm:py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-[0.99] rounded-xl text-[12.5px] font-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs disabled:opacity-80"
          id="btn-download-pdf"
          title={t("result.downloadPdf")}
        >
          {isDownloadingPdf ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-[#0066FF] dark:text-blue-400 animate-spin" />
              <span className="text-[#0066FF] dark:text-blue-400 font-medium">
                {t("result.creatingPdf")}
              </span>
            </>
          ) : downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                {t("result.pdfDownloaded")}
              </span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{t("result.downloadPdf")}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-2.5 sm:py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl text-[12.5px] font-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
          id="btn-share-result"
        >
          {shared ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                {t("result.linkCopied")}
              </span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{t("result.share")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
