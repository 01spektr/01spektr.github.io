import React, { useState } from "react";
import { PaymentScheduleItem, Currency } from "../types";
import { formatCurrencyNumber } from "../utils/loanCalculations";
import { useLanguage } from "../context/LanguageContext";

interface PaymentChartProps {
  schedule: PaymentScheduleItem[];
  currency: Currency;
}

export const PaymentChart: React.FC<PaymentChartProps> = ({ schedule, currency }) => {
  const { t, language } = useLanguage();
  const [hoveredItem, setHoveredItem] = useState<{
    item: PaymentScheduleItem;
    x: number;
    y: number;
  } | null>(null);

  if (!schedule || schedule.length === 0) return null;

  // Find max monthly payment to scale Y-axis
  const maxPayment = Math.max(...schedule.map((s) => s.payment), 1);
  // Round up to nice number for Y axis
  const yMax = Math.ceil(maxPayment * 1.15);

  const formatYLabel = (val: number) => {
    const bSuffix = language === "en" ? "B" : language === "uz" ? " mlrd" : " млрд";
    const mSuffix = language === "en" ? "M" : language === "uz" ? " mln" : " млн";
    const kSuffix = language === "en" ? "k" : language === "uz" ? " ming" : " тыс";
    if (val >= 1_000_000_000) {
      return `${(val / 1_000_000_000).toFixed(1)}${bSuffix}`;
    }
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}${mSuffix}`;
    }
    if (val >= 1_000) {
      return `${(val / 1_000).toFixed(0)}${kSuffix}`;
    }
    return val.toString();
  };

  const yTicks = [yMax, yMax * 0.66, yMax * 0.33, 0];

  // Pick tick labels for X-axis
  // E.g. for 36: 1, 6, 12, 18, 24, 30, 36
  const totalMonths = schedule.length;
  let tickStep = 6;
  if (totalMonths <= 12) tickStep = 2;
  else if (totalMonths <= 24) tickStep = 4;
  else if (totalMonths <= 48) tickStep = 6;
  else if (totalMonths <= 120) tickStep = 12;
  else if (totalMonths <= 240) tickStep = 24;
  else tickStep = 60;

  // We limit the number of rendered bars to at most ~120 for extreme terms so SVG remains performant and legible
  let sampledSchedule = schedule;
  let sampleGroup = 1;
  if (totalMonths > 120) {
    sampleGroup = Math.ceil(totalMonths / 72);
    sampledSchedule = [];
    for (let i = 0; i < totalMonths; i += sampleGroup) {
      sampledSchedule.push(schedule[i]);
    }
  }

  const chartHeight = 180;

  return (
    <div className="mt-6">
      {/* Chart Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
          {t.chart.title}
        </h3>
        <div className="flex items-center gap-4 text-xs font-body">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {t.chart.principal}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-200 dark:bg-blue-400"></span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {t.chart.interest}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Box */}
      <div className="relative bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 p-3 pt-4 transition-colors">
        {/* Hover Tooltip */}
        {hoveredItem && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/95 text-white text-xs rounded-lg p-2.5 shadow-xl transition-transform duration-75 backdrop-blur-xs min-w-44"
            style={{
              left: `${Math.min(hoveredItem.x, 80)}%`,
              top: "-10px",
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="font-bold border-b border-slate-700 pb-1 mb-1.5 flex justify-between">
              <span>
                {t.chart.month} {hoveredItem.item.month}
              </span>
              <span className="text-blue-300">
                {formatCurrencyNumber(hoveredItem.item.payment)} {currency}
              </span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                  {t.chart.principal}:
                </span>
                <span className="font-semibold text-white">
                  {formatCurrencyNumber(hoveredItem.item.principal)} {currency}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-200 inline-block"></span>
                  {t.chart.interest}:
                </span>
                <span className="font-semibold text-white">
                  {formatCurrencyNumber(hoveredItem.item.interest)} {currency}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                <span>{t.chart.balance}:</span>
                <span>
                  {formatCurrencyNumber(hoveredItem.item.remainingBalance)} {currency}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {/* Y Axis Labels */}
          <div className="flex flex-col justify-between text-right text-[10px] text-slate-400 font-medium py-1 select-none w-11 shrink-0 h-44">
            {yTicks.map((tick, i) => (
              <span key={i} className="leading-none">
                {formatYLabel(tick)}
              </span>
            ))}
          </div>

          {/* Chart Bars Area */}
          <div className="flex-1 relative h-44 flex flex-col justify-end">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yTicks.map((_, i) => (
                <div
                  key={i}
                  className={`w-full border-b ${
                    i === yTicks.length - 1
                      ? "border-slate-300 dark:border-slate-700"
                      : "border-slate-100 dark:border-slate-800"
                  }`}
                />
              ))}
            </div>

            {/* Stacked Bars Container */}
            <div
              className="relative z-10 w-full h-full flex items-end justify-between gap-0.5 sm:gap-1 px-1"
              onMouseLeave={() => setHoveredItem(null)}
            >
              {sampledSchedule.map((item, idx) => {
                const totalHeightPct = Math.min(100, (item.payment / yMax) * 100);
                const principalRatio = item.payment > 0 ? item.principal / item.payment : 0;
                const interestRatio = item.payment > 0 ? item.interest / item.payment : 0;

                const principalHeightPct = totalHeightPct * principalRatio;
                const interestHeightPct = totalHeightPct * interestRatio;

                const percentX = (idx / (sampledSchedule.length - 1 || 1)) * 100;

                return (
                  <div
                    key={item.month}
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                    onMouseEnter={() =>
                      setHoveredItem({
                        item,
                        x: percentX,
                        y: totalHeightPct,
                      })
                    }
                  >
                    <div
                      className="w-full max-w-[12px] flex flex-col justify-end rounded-t-[3px] overflow-hidden transition-all duration-150 group-hover:brightness-110 group-hover:scale-x-125"
                      style={{ height: `${totalHeightPct}%` }}
                    >
                      {/* Top portion: Interest (light blue) */}
                      <div
                        className="w-full bg-blue-200 transition-colors"
                        style={{
                          height: `${(interestRatio / (interestRatio + principalRatio || 1)) * 100}%`,
                        }}
                      />
                      {/* Bottom portion: Principal debt (vibrant blue) */}
                      <div
                        className="w-full bg-blue-600 transition-colors"
                        style={{
                          height: `${(principalRatio / (interestRatio + principalRatio || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X Axis Month Numbers */}
        <div className="flex ml-13 mr-1 mt-2 text-[10px] text-slate-400 font-medium justify-between select-none">
          <span>1</span>
          {schedule.length >= 6 && <span>6</span>}
          {schedule.length >= 12 && <span>12</span>}
          {schedule.length >= 18 && <span>18</span>}
          {schedule.length >= 24 && <span>24</span>}
          {schedule.length >= 30 && <span>30</span>}
          {schedule.length > 30 && <span>{schedule.length}</span>}
        </div>
      </div>
    </div>
  );
};
