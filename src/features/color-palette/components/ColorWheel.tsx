import React, { useRef, useEffect, useCallback } from 'react';
import { ColorItem, HarmonyMode } from '../types';
import { hslToRgb, rgbToHex } from '../utils/colorUtils';

interface ColorWheelProps {
  colors: ColorItem[];
  selectedIndex: number;
  harmony: HarmonyMode;
  onSelectHue: (hue: number, sat: number) => void;
  onSelectColorIndex: (index: number) => void;
}

export const ColorWheel: React.FC<ColorWheelProps> = ({
  colors,
  selectedIndex,
  onSelectHue,
  onSelectColorIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Draw the HSL Color Wheel
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    // Draw radial hue and saturation
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
          // Angle in degrees [0, 360)
          let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
          if (angle < 0) angle += 360;

          const sat = Math.min(100, Math.round((dist / radius) * 100));
          const rgb = hslToRgb({ h: angle, s: sat, l: 50 });

          const idx = (y * size + x) * 4;
          data[idx] = rgb.r;
          data[idx + 1] = rgb.g;
          data[idx + 2] = rgb.b;
          data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Draw subtle outer border ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw harmony lines connecting the color points
    if (colors.length > 1) {
      ctx.beginPath();
      colors.forEach((c, i) => {
        const rad = ((c.hsl.h - 90) * Math.PI) / 180;
        const r = (c.hsl.s / 100) * radius;
        const cx = center + r * Math.cos(rad);
        const cy = center + r * Math.sin(rad);

        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [colors]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Handle interaction with wheel
  const handleInteraction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const center = rect.width / 2;
    const radius = center - 8;
    const dx = x - center;
    const dy = y - center;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    const sat = Math.min(100, Math.max(5, Math.round((dist / radius) * 100)));
    onSelectHue(Math.round(angle), sat);
  };

  const currentColor = colors[selectedIndex] || colors[0];

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-4">
      <div className="w-full flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-slate-800">Цветовой круг гармоний</span>
          <span className="block text-[11px] text-slate-500">Кликните по кругу для выбора тона</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-mono text-[11px] text-slate-700">
          <span>{currentColor.hsl.h}°</span>
          <span className="text-slate-400">/</span>
          <span>{currentColor.hsl.s}%</span>
        </div>
      </div>

      {/* Wheel Canvas Container */}
      <div
        ref={containerRef}
        className="relative cursor-crosshair select-none touch-none my-auto"
        style={{ width: 220, height: 220 }}
        onMouseDown={(e) => {
          isDraggingRef.current = true;
          handleInteraction(e);
        }}
        onMouseMove={(e) => {
          if (isDraggingRef.current) handleInteraction(e);
        }}
        onMouseUp={() => {
          isDraggingRef.current = false;
        }}
        onMouseLeave={() => {
          isDraggingRef.current = false;
        }}
        onTouchStart={(e) => {
          isDraggingRef.current = true;
          handleInteraction(e);
        }}
        onTouchMove={(e) => {
          if (isDraggingRef.current) handleInteraction(e);
        }}
        onTouchEnd={() => {
          isDraggingRef.current = false;
        }}
      >
        <canvas
          ref={canvasRef}
          width={220}
          height={220}
          className="rounded-full shadow-inner"
        />

        {/* Render interactive color pins on top of canvas */}
        {colors.map((c, i) => {
          const isSelected = i === selectedIndex;
          const center = 110;
          const radius = center - 8;
          const rad = ((c.hsl.h - 90) * Math.PI) / 180;
          const r = (c.hsl.s / 100) * radius;
          const posX = center + r * Math.cos(rad);
          const posY = center + r * Math.sin(rad);

          return (
            <button
              key={c.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectColorIndex(i);
              }}
              title={`${c.role}: ${c.hex} (${c.hsl.h}°, ${c.hsl.s}%)`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform cursor-pointer ${
                isSelected
                  ? 'w-6 h-6 ring-3 ring-blue-500 ring-offset-2 scale-110 z-20 shadow-md'
                  : 'w-4.5 h-4.5 ring-2 ring-white hover:scale-125 z-10 shadow-xs'
              }`}
              style={{
                left: posX,
                top: posY,
                backgroundColor: c.hex,
              }}
            />
          );
        })}
      </div>

      {/* Bottom info strip with color markers */}
      <div className="w-full flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
        {colors.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectColorIndex(i)}
            className={`flex-1 flex flex-col items-center p-1 rounded-lg transition-all text-[10px] cursor-pointer ${
              i === selectedIndex
                ? 'bg-blue-50/80 border border-blue-200 font-bold text-blue-700'
                : 'hover:bg-slate-50 text-slate-500'
            }`}
          >
            <div
              className="w-3.5 h-3.5 rounded-full shadow-2xs border border-black/10 mb-0.5"
              style={{ backgroundColor: c.hex }}
            />
            <span className="font-mono truncate w-full text-center">{c.hsl.h}°</span>
          </button>
        ))}
      </div>
    </div>
  );
};
