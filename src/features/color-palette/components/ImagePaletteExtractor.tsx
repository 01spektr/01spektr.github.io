import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Check, ArrowRight } from 'lucide-react';
import { extractColorsFromImage } from '../utils/imageExtractor';

interface ImagePaletteExtractorProps {
  onApplyPalette: (colors: string[]) => void;
  onNotify: (msg: string) => void;
}

const DEMO_PRESETS = [
  {
    name: 'Закат',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=300&auto=format&fit=crop&q=80',
    colors: ['#F97316', '#FB923C', '#F43F5E', '#8B5CF6', '#1E1B4B'],
  },
  {
    name: 'Океан',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    colors: ['#0284C7', '#38BDF8', '#7DD3FC', '#F0F9FF', '#0F172A'],
  },
  {
    name: 'Лес',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop&q=80',
    colors: ['#15803D', '#22C55E', '#86EFAC', '#FEF3C7', '#14532D'],
  },
];

export const ImagePaletteExtractor: React.FC<ImagePaletteExtractorProps> = ({
  onApplyPalette,
  onNotify,
}) => {
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onNotify('Пожалуйста, выберите файл изображения (PNG, JPG, WebP)');
      return;
    }

    setIsLoading(true);
    try {
      // Create local preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      const colors = await extractColorsFromImage(file, 5);
      setExtractedColors(colors);
      onNotify('Цвета успешно извлечены из фото!');
    } catch (err) {
      onNotify('Не удалось извлечь цвета из этого изображения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleApply = () => {
    if (extractedColors.length > 0) {
      onApplyPalette(extractedColors);
      onNotify('Палитра применена в проект!');
    }
  };

  const handleApplyPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setPreviewImage(preset.url);
    setExtractedColors(preset.colors);
    onApplyPalette(preset.colors);
    onNotify(`Палитра «${preset.name}» применена!`);
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-3">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Извлечение из фото</h3>
            <p className="text-[11px] text-slate-500">Загрузите логотип или фото для подбора палитры</p>
          </div>
          {extractedColors.length > 0 && (
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Применить</span>
            </button>
          )}
        </div>

        {/* Upload Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/60'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewImage ? (
            <div className="relative h-28 w-full rounded-lg overflow-hidden border border-black/5 bg-slate-100 flex items-center justify-center">
              <img
                src={previewImage}
                alt="Превью"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-[11px] font-medium text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Нажмите для смены фото
                </span>
              </div>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center justify-center space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-slate-700">
                Перетащите фото сюда или нажмите
              </div>
              <div className="text-[10px] text-slate-400">PNG, JPG, WebP до 10MB</div>
            </div>
          )}
        </div>

        {/* Extracted Swatches preview */}
        {extractedColors.length > 0 && (
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">Извлеченные оттенки:</span>
            <div className="flex rounded-lg overflow-hidden h-9 shadow-2xs border border-slate-200">
              {extractedColors.map((hex, i) => (
                <div
                  key={i}
                  className="flex-1 h-full flex items-center justify-center text-[10px] font-mono text-white/90 group cursor-pointer"
                  style={{ backgroundColor: hex }}
                  title={`Цвет ${i + 1}: ${hex}`}
                  onClick={() => {
                    navigator.clipboard.writeText(hex);
                    onNotify(`Скопирован ${hex}`);
                  }}
                >
                  <span className="opacity-0 group-hover:opacity-100 bg-black/40 px-1 rounded text-[9px]">
                    {hex.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Demo photo presets for instant testing */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[10px] font-medium text-slate-400 block mb-1.5">Быстрые примеры:</span>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="flex flex-col items-center p-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-left transition-all cursor-pointer group"
            >
              <div className="flex w-full h-3 rounded-sm overflow-hidden mb-1">
                {p.colors.map((c, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-slate-700 group-hover:text-blue-600">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
