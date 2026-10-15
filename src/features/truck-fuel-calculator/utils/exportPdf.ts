import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { CURRENCIES } from './constants';
import { formatConsumption, formatDistance, formatFuel, formatMoney } from './calculations';
import { LanguageCode } from '../locales/i18n';

export async function exportCalculationToPdf(
  state: CalculatorState,
  result: CalculationResult,
  lang: LanguageCode = 'ru'
): Promise<void> {
  const currencySymbol = CURRENCIES[state.currency].symbol;
  const now = new Date();
  const dateLocale = lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-US' : 'ru-RU';
  const dateStr = now.toLocaleDateString(dateLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString(dateLocale, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const docId = `TB-${Math.floor(100000 + Math.random() * 900000)}`;

  // Create an offscreen HTML node styled cleanly to represent the A4 report
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = "'Montserrat', 'Inter', system-ui, sans-serif";
  container.style.color = '#0f172a';
  container.style.padding = '36px 40px';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.4';

  const tPdf = {
    ru: {
      subtitle: 'Онлайн-сервис инструментов логистики и грузоперевозок',
      reportTitle: 'ОТЧЁТ О РАСХОДЕ ТОПЛИВА',
      docNum: 'Номер:',
      genDate: 'Дата формирования:',
      statusTitle: 'Результат расчёта рейса успешно сформирован',
      truckLabel: 'Модель:',
      defaultTruck: 'Грузовой автопоезд (тягач с полуприцепом)',
      badge: 'Официальный расчёт',
      mFuel: 'Общий расход топлива',
      mFuelSub: 'с учётом всех условий рейса',
      mCost: 'Общая стоимость топлива',
      mCostSub: `по цене ${formatMoney(state.fuelPrice, currencySymbol)}/л`,
      mAvg: 'Эффективный средний расход',
      mAvgSub: 'на 100 км пробега',
      breakdownTitle: 'Расход топлива по участкам рейса',
      loadedLeg: 'Пробег с грузом',
      emptyLeg: 'Пробег без груза',
      detailsTitle: 'Детализация параметров рейса и автопоезда',
      rowTotalDist: 'Общий пробег рейса',
      rowFuelType: 'Тип используемого топлива',
      rowCargoWeight: 'Масса перевозимого груза',
      rowTrailerWeight: 'Собственная масса полуприцепа',
      rowWork: 'Транспортная работа (тонно-километры)',
      rowCostKm: 'Себестоимость топлива на 1 км пробега',
      rowRelief: 'Рельеф местности / Перепад высот',
      rowRoad: 'Дорожные условия и сезонность',
      rowCo2: 'Расчётный экологический след (CO₂)',
      tons: 'тонн',
      tonKm: 'т·км',
      co2Text: 'кг выбросов углекислого газа',
      ascent: 'Подъём:',
      descent: 'Спуск:',
      footerGen: 'Сформировано сервисом Toolboxi.uz',
      footerStandard: 'Все расчёты произведены по нормативам Минтранса и заводским спецификациям автопроизводителей.',
      signature: 'Подпись диспетчера / логиста: ___________________',
      page: 'Страница 1 из 1',
    },
    uz: {
      subtitle: 'Logistika va yuk tashish onlayn servis asboblari',
      reportTitle: "YOQILG'I SARFI HISOBOTI",
      docNum: 'Raqam:',
      genDate: 'Shakllantirilgan sana:',
      statusTitle: 'Reys hisob-kitob natijasi muvaffaqiyatli shakllantirildi',
      truckLabel: 'Model:',
      defaultTruck: 'Yuk avtopoyezdi (tyagach yarim tirkama bilan)',
      badge: 'Rasmiy hisob-kitob',
      mFuel: "Jami yoqilg'i sarfi",
      mFuelSub: 'barcha reys sharoitlarini hisobga olgan holda',
      mCost: "Jami yoqilg'i narxi",
      mCostSub: `${formatMoney(state.fuelPrice, currencySymbol)}/l narxida`,
      mAvg: "Samarali o'rtacha sarf",
      mAvgSub: '100 km masofaga',
      breakdownTitle: "Reys qismlari bo'yicha yoqilg'i sarfi",
      loadedLeg: 'Yuk bilan',
      emptyLeg: 'Yuksiz',
      detailsTitle: 'Reys va avtopoyezd parametrlari tafsilotlari',
      rowTotalDist: 'Jami reys masofasi',
      rowFuelType: "Yoqilg'i turi",
      rowCargoWeight: 'Tashilayotgan yuk vazni',
      rowTrailerWeight: 'Pritsepning o‘z vazni',
      rowWork: 'Transport ishi (tonna-kilometr)',
      rowCostKm: '1 km masofaga yoqilg‘i tannarxi',
      rowRelief: 'Joy relyefi / Balandlik farqi',
      rowRoad: 'Yo‘l sharoiti va mavsum',
      rowCo2: 'Hisoblangan CO₂ ekologik izi',
      tons: 'tonna',
      tonKm: 't·km',
      co2Text: 'kg karbonat angidrid chiqindisi',
      ascent: 'Ko‘tarilish:',
      descent: 'Tushish:',
      footerGen: 'Toolboxi.uz servisi tomonidan shakllantirildi',
      footerStandard: 'Barcha hisob-kitoblar me’yoriy standartlar va zavod ma’lumotlari asosida amalga oshirildi.',
      signature: 'Dispetcher / logist imzosi: ___________________',
      page: 'Sahifa 1 / 1',
    },
    en: {
      subtitle: 'Freight & Fleet Management Online Engineering Tools',
      reportTitle: 'FUEL CONSUMPTION REPORT',
      docNum: 'Doc ID:',
      genDate: 'Generated At:',
      statusTitle: 'Trip fuel assessment successfully generated',
      truckLabel: 'Vehicle Model:',
      defaultTruck: 'Commercial Tractor-Trailer Combination',
      badge: 'Official Fleet Audit',
      mFuel: 'Total Fuel Burn',
      mFuelSub: 'adjusted for terrain & operating factors',
      mCost: 'Total Fuel Cost',
      mCostSub: `at ${formatMoney(state.fuelPrice, currencySymbol)}/unit`,
      mAvg: 'Effective Average Consumption',
      mAvgSub: 'per 100 km / 62 miles',
      breakdownTitle: 'Consumption by Trip Segments',
      loadedLeg: 'Loaded Leg',
      emptyLeg: 'Empty Leg',
      detailsTitle: 'Technical Specifications & Parameters',
      rowTotalDist: 'Total Distance',
      rowFuelType: 'Fuel Grade',
      rowCargoWeight: 'Payload Cargo Weight',
      rowTrailerWeight: 'Trailer Tare Weight',
      rowWork: 'Transport Work (Ton-Kilometers)',
      rowCostKm: 'Fuel Cost per Unit Distance',
      rowRelief: 'Terrain Gradient / Elevation Delta',
      rowRoad: 'Road Surface & Seasonality',
      rowCo2: 'Estimated CO₂ Carbon Footprint',
      tons: 'tons',
      tonKm: 't·km',
      co2Text: 'kg CO₂ emissions',
      ascent: 'Ascent:',
      descent: 'Descent:',
      footerGen: 'Generated via Toolboxi.uz online platform',
      footerStandard: 'Calculations adhere to transport ministry engineering norms and factory specifications.',
      signature: 'Fleet Manager / Logistics Sign-off: ___________________',
      page: 'Page 1 of 1',
    },
  }[lang] || tPdfLangRu();

  function tPdfLangRu() {
    return {
      subtitle: 'Онлайн-сервис инструментов логистики и грузоперевозок',
      reportTitle: 'ОТЧЁТ О РАСХОДЕ ТОПЛИВА',
      docNum: 'Номер:',
      genDate: 'Дата формирования:',
      statusTitle: 'Результат расчёта рейса успешно сформирован',
      truckLabel: 'Модель:',
      defaultTruck: 'Грузовой автопоезд (тягач с полуприцепом)',
      badge: 'Официальный расчёт',
      mFuel: 'Общий расход топлива',
      mFuelSub: 'с учётом всех условий рейса',
      mCost: 'Общая стоимость топлива',
      mCostSub: `по цене ${formatMoney(state.fuelPrice, currencySymbol)}/л`,
      mAvg: 'Эффективный средний расход',
      mAvgSub: 'на 100 км пробега',
      breakdownTitle: 'Расход топлива по участкам рейса',
      loadedLeg: 'Пробег с грузом',
      emptyLeg: 'Пробег без груза',
      detailsTitle: 'Детализация параметров рейса и автопоезда',
      rowTotalDist: 'Общий пробег рейса',
      rowFuelType: 'Тип используемого топлива',
      rowCargoWeight: 'Масса перевозимого груза',
      rowTrailerWeight: 'Собственная масса полуприцепа',
      rowWork: 'Транспортная работа (тонно-километры)',
      rowCostKm: 'Себестоимость топлива на 1 км пробега',
      rowRelief: 'Рельеф местности / Перепад высот',
      rowRoad: 'Дорожные условия и сезонность',
      rowCo2: 'Расчётный экологический след (CO₂)',
      tons: 'тонн',
      tonKm: 'т·км',
      co2Text: 'кг выбросов углекислого газа',
      ascent: 'Подъём:',
      descent: 'Спуск:',
      footerGen: 'Сформировано сервисом Toolboxi.uz',
      footerStandard: 'Все расчёты произведены по нормативам Минтранса и заводским спецификациям автопроизводителей.',
      signature: 'Подпись диспетчера / логиста: ___________________',
      page: 'Страница 1 из 1',
    };
  }

  const fuelTypeMap: Record<string, string> = {
    diesel: lang === 'uz' ? 'Dizel yoqilg‘isi (DT)' : lang === 'en' ? 'Diesel Fuel' : 'Дизельное топливо (ДТ)',
    petrol95: lang === 'uz' ? 'Benzin AI-95' : lang === 'en' ? 'Gasoline / Petrol 95' : 'Бензин АИ-95',
    petrol92: lang === 'uz' ? 'Benzin AI-92' : lang === 'en' ? 'Gasoline / Petrol 92' : 'Бензин АИ-92',
    lpg: lang === 'uz' ? 'Gaz (Propan / LPG)' : lang === 'en' ? 'Propane / LPG Gas' : 'Сжиженный газ (Пропан-бутан / LPG)',
    cng: lang === 'uz' ? 'Gaz (Metan / CNG)' : lang === 'en' ? 'Methane / CNG Gas' : 'Компримированный газ (Метан / CNG)',
  };

  const reliefMap: Record<string, string> = {
    mixed: lang === 'uz' ? 'Aralash' : lang === 'en' ? 'Mixed' : 'Смешанный',
    flat: lang === 'uz' ? 'Tekislik' : lang === 'en' ? 'Flat Highway' : 'Равнинный',
    hilly: lang === 'uz' ? 'Tepalikli (+5%)' : lang === 'en' ? 'Rolling Hills (+5%)' : 'Холмистый (+5%)',
    mountainous: lang === 'uz' ? 'Tog‘li (+12%)' : lang === 'en' ? 'Mountainous (+12%)' : 'Горный (+12%)',
  };

  const roadMap: Record<string, string> = {
    good: lang === 'uz' ? 'Yaxshi (magistral)' : lang === 'en' ? 'Paved Highway' : 'Хорошие (автомагистраль)',
    medium: lang === 'uz' ? 'O‘rtacha (asfalt)' : lang === 'en' ? 'Standard Asphalt' : 'Средние (асфальт)',
    bad: lang === 'uz' ? 'Yomon yo‘l' : lang === 'en' ? 'Rough / Potholed' : 'Плохие (разбитая дорога)',
    offroad: lang === 'uz' ? 'Tuproq / Yo‘lsizlik' : lang === 'en' ? 'Gravel / Off-road' : 'Грунтовые / бездорожье',
  };

  const seasonMap: Record<string, string> = {
    summer: lang === 'uz' ? 'Yozgi mavsum' : lang === 'en' ? 'Summer Season' : 'Летний период',
    transition: lang === 'uz' ? 'O‘tish (bahor/kuz)' : lang === 'en' ? 'Spring / Autumn' : 'Переходный (весна/осень)',
    winter_mild: lang === 'uz' ? 'Qishki mo‘tadil' : lang === 'en' ? 'Mild Winter' : 'Зимний умеренный',
    winter_severe: lang === 'uz' ? 'Qishki qattiq' : lang === 'en' ? 'Severe Sub-zero Winter' : 'Зимний суровый',
  };

  const formattedCost = formatMoney(result.totalCost, currencySymbol);
  const formattedFuel = formatFuel(result.totalFuel, state.distanceUnit);
  const formattedAvg = formatConsumption(result.effectiveAvgConsumption, state.distanceUnit);

  const sumFuel = result.loadedFuel + result.emptyFuel + result.idleFuel || 1;
  const loadedPct = Math.round((result.loadedFuel / sumFuel) * 100);
  const emptyPct = Math.round((result.emptyFuel / sumFuel) * 100);

  container.innerHTML = `
    <div style="border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
          <div style="width: 34px; height: 34px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 800; font-size: 18px;">
            T
          </div>
          <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
            Toolboxi<span style="color: #2563eb;">.uz</span>
          </div>
        </div>
        <div style="font-size: 13px; color: #64748b; font-weight: 500;">
          ${tPdf.subtitle}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${tPdf.reportTitle}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 3px;">${tPdf.docNum} <strong style="color: #2563eb;">${docId}</strong></div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${tPdf.genDate} ${dateStr} ${timeStr}</div>
      </div>
    </div>

    <!-- Status badge -->
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 22px; height: 22px; background: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">
          ✓
        </div>
        <div>
          <div style="font-size: 13px; font-weight: 700; color: #14532d;">${tPdf.statusTitle}</div>
          <div style="font-size: 11px; color: #15803d;">${tPdf.truckLabel} ${state.selectedTruckModel || tPdf.defaultTruck}</div>
        </div>
      </div>
      <div style="background: #ffffff; border: 1px solid #86efac; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; color: #166534;">
        ${tPdf.badge}
      </div>
    </div>

    <!-- 3 Metrics Tiles -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 6px;">${tPdf.mFuel}</div>
        <div style="font-size: 22px; font-weight: 800; color: #059669; letter-spacing: -0.5px;">${formattedFuel}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">${tPdf.mFuelSub}</div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 6px;">${tPdf.mCost}</div>
        <div style="font-size: 22px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px;">${formattedCost}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">${tPdf.mCostSub}</div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
        <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 6px;">${tPdf.mAvg}</div>
        <div style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">${formattedAvg}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">${tPdf.mAvgSub}</div>
      </div>
    </div>

    <!-- Trip breakdown bars -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">${tPdf.breakdownTitle}</div>
      
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
          <span style="font-weight: 600; color: #334155;">${tPdf.loadedLeg} (${formatDistance(state.loadedDistance, state.distanceUnit)}) — ${loadedPct}%</span>
          <span style="font-weight: 700; color: #0f172a;">${formatFuel(result.loadedFuel, state.distanceUnit)} (${formatMoney(result.loadedCost, currencySymbol)})</span>
        </div>
        <div style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;">
          <div style="width: ${loadedPct}%; height: 100%; background: #2563eb; border-radius: 4px;"></div>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
          <span style="font-weight: 600; color: #334155;">${tPdf.emptyLeg} (${formatDistance(state.emptyDistance, state.distanceUnit)}) — ${emptyPct}%</span>
          <span style="font-weight: 700; color: #0f172a;">${formatFuel(result.emptyFuel, state.distanceUnit)} (${formatMoney(result.emptyCost, currencySymbol)})</span>
        </div>
        <div style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;">
          <div style="width: ${emptyPct}%; height: 100%; background: #38bdf8; border-radius: 4px;"></div>
        </div>
      </div>
    </div>

    <!-- Detailed Parameters Table -->
    <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">${tPdf.detailsTitle}</div>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 24px;">
      <tbody>
        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600; width: 50%;">${tPdf.rowTotalDist}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">${formatDistance(state.totalDistance, state.distanceUnit)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600;">${tPdf.rowFuelType}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">${fuelTypeMap[state.fuelType] || state.fuelType}</td>
        </tr>
        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600;">${tPdf.rowCargoWeight}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">${state.cargoWeight} ${tPdf.tons}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600;">${tPdf.rowTrailerWeight}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">${state.trailerWeight} ${tPdf.tons}</td>
        </tr>
        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600;">${tPdf.rowWork}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">${result.tonKilometers.toLocaleString(dateLocale)} ${tPdf.tonKm}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600;">${tPdf.rowCostKm}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">${formatMoney(result.costPerKm, currencySymbol)}/${state.distanceUnit === 'miles' ? 'mile' : 'km'}</td>
        </tr>
        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600;">${tPdf.rowRelief}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">${reliefMap[state.terrainType] || state.terrainType} (${tPdf.ascent} +${state.totalAscent}m / ${tPdf.descent} -${state.totalDescent}m)</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600;">${tPdf.rowRoad}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">${roadMap[state.roadCondition] || state.roadCondition}, ${seasonMap[state.season] || state.season} (${state.temperature > 0 ? '+' : ''}${state.temperature}°C)</td>
        </tr>
        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 12px; color: #64748b; font-weight: 600;">${tPdf.rowCo2}</td>
          <td style="padding: 8px 12px; color: #0f172a; font-weight: 700;">~${result.co2EmissionsKg.toLocaleString(dateLocale)} ${tPdf.co2Text}</td>
        </tr>
      </tbody>
    </table>

    <!-- Footer sign off -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px; color: #94a3b8;">
      <div>
        <div style="font-weight: 600; color: #64748b;">${tPdf.footerGen}</div>
        <div>${tPdf.footerStandard}</div>
      </div>
      <div style="text-align: right;">
        <div style="margin-bottom: 24px; color: #64748b;">${tPdf.signature}</div>
        <div style="font-weight: 500;">${tPdf.page}</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Toolboxi_Otchet_Toplivo_${docId}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
