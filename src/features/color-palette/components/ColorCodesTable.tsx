import React, { useState } from 'react';
import { ColorItem } from '../types';
import { Copy, Check } from 'lucide-react';

interface ColorCodesTableProps {
  colors: ColorItem[];
  onCopyText: (text: string) => void;
}

export const ColorCodesTable: React.FC<ColorCodesTableProps> = ({ colors, onCopyText }) => {
  const [copiedRowId, setCopiedRowId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyRow = (item: ColorItem) => {
    const summary = `${item.role || 'Цвет'}: HEX ${item.hex}, RGB(${item.rgb.r}, ${item.rgb.g}, ${item.rgb.b}), HSL(${item.hsl.h}°, ${item.hsl.s}%, ${item.hsl.l}%), CMYK(${item.cmyk.c}%, ${item.cmyk.m}%, ${item.cmyk.y}%, ${item.cmyk.k}%)`;
    onCopyText(summary);
    setCopiedRowId(item.id);
    setTimeout(() => setCopiedRowId(null), 1500);
  };

  const handleCopySingle = (text: string, id: string) => {
    onCopyText(text);
    setCopiedRowId(id);
    setTimeout(() => setCopiedRowId(null), 1500);
  };

  const handleCopyAllCodes = () => {
    const fullText = colors
      .map(
        (c) =>
          `${c.role}: HEX ${c.hex} | RGB(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}) | HSL(${c.hsl.h}°, ${c.hsl.s}%, ${c.hsl.l}%) | CMYK(${c.cmyk.c}%, ${c.cmyk.m}%, ${c.cmyk.y}%, ${c.cmyk.k}%)`
      )
      .join('\n');
    onCopyText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Цветовые коды</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Точные значения для веб-дизайна и полиграфии</p>
          </div>
          <button
            type="button"
            onClick={handleCopyAllCodes}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors cursor-pointer"
            title="Скопировать все значения таблицы"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Скопировать всё</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-2.5 pl-1 w-10 font-medium">Цвет</th>
                <th className="pb-2.5 font-medium">Роль</th>
                <th className="pb-2.5 font-medium">HEX</th>
                <th className="pb-2.5 font-medium">RGB</th>
                <th className="pb-2.5 font-medium">HSL</th>
                <th className="pb-2.5 font-medium">CMYK</th>
                <th className="pb-2.5 pr-1 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {colors.map((item) => {
                const isCopied = copiedRowId === item.id;
                const rgbStr = `${item.rgb.r}, ${item.rgb.g}, ${item.rgb.b}`;
                const hslStr = `${item.hsl.h}°, ${item.hsl.s}%, ${item.hsl.l}%`;
                const cmykStr = `${item.cmyk.c}, ${item.cmyk.m}, ${item.cmyk.y}, ${item.cmyk.k}`;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => handleCopySingle(item.hex, item.id)}
                    title="Нажмите, чтобы скопировать HEX"
                  >
                    {/* Swatch */}
                    <td className="py-2.5 pl-1">
                      <div
                        className="w-5 h-5 rounded-md shadow-2xs border border-black/5"
                        style={{ backgroundColor: item.hex }}
                      />
                    </td>

                    {/* Role */}
                    <td className="py-2.5 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-700">
                        {item.role}
                      </span>
                    </td>

                    {/* HEX */}
                    <td className="py-2.5 font-mono font-bold text-slate-900">
                      {item.hex}
                    </td>

                    {/* RGB */}
                    <td className="py-2.5 font-mono text-slate-600">
                      {rgbStr}
                    </td>

                    {/* HSL */}
                    <td className="py-2.5 font-mono text-slate-600">
                      {hslStr}
                    </td>

                    {/* CMYK */}
                    <td className="py-2.5 font-mono text-slate-600">
                      {cmykStr}
                    </td>

                    {/* Copy Button */}
                    <td className="py-2.5 pr-1 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyRow(item);
                        }}
                        title="Скопировать все коды цвета"
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
