import React, { useEffect, useRef, useState } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Plus,
  Minus,
  RotateCcw,
  MapPin,
  Maximize2,
  Clock,
  ArrowUpRight,
  Sun,
  Globe2
} from 'lucide-react';
import { CityTimezone } from '../types';
import { getTimeInTimezone, getUtcOffsetString } from '../utils/timezone';
import { useWorldTimezonesI18n } from '../i18n';

interface TimezoneMapProps {
  cities: CityTimezone[];
  allCities: CityTimezone[];
  timelineCityIds: string[];
  onSelectCity?: (city: CityTimezone) => void;
  onSelectForConverter?: (city: CityTimezone) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const TimezoneMap: React.FC<TimezoneMapProps> = ({
  cities,
  allCities,
  timelineCityIds,
  onSelectCity,
  onSelectForConverter,
  isExpanded,
  onToggleExpand,
}) => {
  const { t, tr, cityName, countryName } = useWorldTimezonesI18n();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Leaflet.Map | null>(null);
  const markersLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const timezoneLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);

  const [showTimezones, setShowTimezones] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'osm' | 'light' | 'streets'>('osm');
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let disposed = false;
    let map: L.Map | null = null;

    void import('leaflet').then((module) => {
      if (disposed || !mapContainerRef.current) return;
      const L = module;
      leafletRef.current = module;

    // Fix default marker icon issues in Leaflet with bundlers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Create map instance centered around world view
    map = L.map(mapContainerRef.current, {
      center: [26, 25],
      zoom: 2.2,
      minZoom: 1.5,
      maxZoom: 9,
      zoomControl: false,
      worldCopyJump: true,
      maxBounds: [
        [-85, -180],
        [85, 180],
      ],
      maxBoundsViscosity: 0.8,
    });

    mapInstanceRef.current = map;

    // Tile layers without API KEY required
    const getTileUrl = (style: string) => {
      if (style === 'light') {
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      }
      if (style === 'streets') {
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
      }
      // Standard OpenStreetMap (100% free, no watermarks)
      return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    };

    L.tileLayer(getTileUrl(activeLayer), {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Layer groups for markers and timezones
    const timezoneLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    timezoneLayerRef.current = timezoneLayer;
    markersLayerRef.current = markersLayer;
    setMapReady(true);

    // Force size invalidation
    setTimeout(() => {
      map?.invalidateSize();
    }, 250);
    });

    return () => {
      disposed = true;
      map?.remove();
      mapInstanceRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  // Update tile layer when activeLayer changes
  useEffect(() => {
    const L = leafletRef.current;
    if (!mapInstanceRef.current || !L) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (activeLayer === 'light') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ';
    } else if (activeLayer === 'streets') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri &mdash; Source: Esri, DeLorme, USGS, NPS';
    }

    L.tileLayer(url, {
      attribution: attr,
      maxZoom: 19,
    }).addTo(map);
  }, [activeLayer, mapReady]);

  // Render Timezone Bands & Lines
  useEffect(() => {
    const L = leafletRef.current;
    if (!timezoneLayerRef.current || !L) return;
    const layer = timezoneLayerRef.current;
    layer.clearLayers();

    if (!showTimezones) return;

    // Draw 24 timezone vertical segments across longitude (-180 to 180)
    for (let i = -12; i < 12; i++) {
      const westLng = i * 15;
      const eastLng = (i + 1) * 15;
      const utcOffset = i >= 0 ? `+${i}` : `${i}`;

      const hue = ((i + 12) * 15 + 200) % 360;
      const fillColor = `hsla(${hue}, 60%, 50%, 0.08)`;
      const strokeColor = `hsla(${hue}, 60%, 40%, 0.35)`;

      const polygon = L.polygon(
        [
          [85, westLng],
          [85, eastLng],
          [-85, eastLng],
          [-85, westLng],
        ],
        {
          fillColor,
          fillOpacity: 0.08,
          weight: 1,
          color: strokeColor,
          dashArray: '3, 4',
        }
      );

      polygon.bindTooltip(`${tr("Часовой пояс UTC")} ${utcOffset}`, {
        sticky: true,
        direction: 'top',
        className: 'custom-tz-tooltip',
      });

      layer.addLayer(polygon);
    }
  }, [showTimezones, mapReady, tr]);

  // Render City Markers
  useEffect(() => {
    const L = leafletRef.current;
    if (!markersLayerRef.current || !mapInstanceRef.current || !L) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    const now = new Date();

    allCities.forEach((city) => {
      const isInTimeline = timelineCityIds.includes(city.id);
      const isHome = city.id === 'tashkent' || city.isHome;
      const timeData = getTimeInTimezone(city.timezone, now);
      const timeStr = `${timeData.hour.toString().padStart(2, '0')}:${timeData.minute.toString().padStart(2, '0')}`;
      const utcStr = getUtcOffsetString(city.timezone, now);

      let iconHtml = '';
      let iconSize: [number, number] = [32, 32];
      let iconAnchor: [number, number] = [16, 32];

      if (isHome) {
        iconHtml = `
          <div class="relative flex flex-col items-center group cursor-pointer">
            <div class="bg-slate-900 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-lg whitespace-nowrap -mt-8 flex items-center gap-1 border border-slate-700">
              <span class="text-blue-400 font-mono">${utcStr}</span>
              <span>${cityName(city)}</span>
            </div>
            <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center animate-pulse">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        `;
        iconSize = [100, 40];
        iconAnchor = [50, 40];
      } else if (isInTimeline) {
        iconHtml = `
          <div class="relative flex flex-col items-center group cursor-pointer">
            <div class="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-sm flex items-center justify-center hover:scale-125 transition-transform">
              <div class="w-1 h-1 rounded-full bg-white"></div>
            </div>
            <div class="bg-white/95 text-slate-800 text-[10px] font-bold px-1.5 py-0.2 rounded shadow-xs border border-slate-200 whitespace-nowrap mt-0.5">
              ${cityName(city)} ${timeStr}
            </div>
          </div>
        `;
        iconSize = [80, 36];
        iconAnchor = [40, 18];
      } else {
        iconHtml = `
          <div class="w-3 h-3 rounded-full bg-slate-500 border-2 border-white shadow-xs hover:bg-blue-600 hover:scale-150 transition-all cursor-pointer"></div>
        `;
        iconSize = [12, 12];
        iconAnchor = [6, 6];
      }

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-city-marker',
        iconSize,
        iconAnchor,
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon });

      // Interactive Popup with Action Buttons
      const popupContent = `
        <div style="font-family: inherit; padding: 4px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <img src="https://flagcdn.com/${city.countryCode.toLowerCase()}.svg" alt="${countryName(city)}" style="width: 24px; height: 18px; object-fit: cover; border-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.1);" />
            <div>
              <strong style="font-size: 14px; color: #0f172a; display: block;">${cityName(city)}</strong>
              <div style="font-size: 11px; color: #64748b;">${countryName(city)} • ${tr(city.continent)}</div>
            </div>
          </div>
          <div style="margin-top: 6px; padding: 8px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">${tr("Текущее время:")}</span>
              <strong style="font-family: monospace; color: #2563eb; font-size: 13px;">${timeStr}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">${tr("Часовой пояс:")}</span>
              <strong style="font-family: monospace; color: #0f172a;">${utcStr}</strong>
            </div>
          </div>
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <button
              id="popup-conv-btn-${city.id}"
              style="flex: 1; padding: 6px 8px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
            >
              <span>${tr("В конвертер")} ↗</span>
            </button>
            <button
              id="popup-meet-btn-${city.id}"
              style="flex: 1; padding: 6px 8px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;"
            >
              <span>${tr("+ Встреча")}</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 240 });

      marker.on('popupopen', () => {
        const convBtn = document.getElementById(`popup-conv-btn-${city.id}`);
        if (convBtn && onSelectForConverter) {
          convBtn.onclick = () => {
            onSelectForConverter(city);
            marker.closePopup();
          };
        }

        const meetBtn = document.getElementById(`popup-meet-btn-${city.id}`);
        if (meetBtn && onSelectCity) {
          meetBtn.onclick = () => {
            onSelectCity(city);
            marker.closePopup();
          };
        }
      });

      layer.addLayer(marker);
    });
  }, [allCities, timelineCityIds, onSelectCity, onSelectForConverter, mapReady, tr, cityName, countryName]);

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.setView([26, 25], 2.2);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{tr("Интерактивная карта часовых поясов")}</h3>
            <p className="text-xs text-slate-500">
              {tr("Географическая панорама поясов UTC, меридианов и городов мира")}
            </p>
          </div>
        </div>

        {/* Map Layer Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTimezones(!showTimezones)}
            title={tr("Показать или скрыть границы поясов")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showTimezones
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tr("Пояса UTC")}
          </button>

          <select
            value={activeLayer}
            onChange={(e) => setActiveLayer(e.target.value as any)}
            aria-label={tr("Стиль карты")}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 hover:border-slate-300 cursor-pointer focus:outline-hidden shadow-2xs"
          >
            <option value="osm">OpenStreetMap ({tr("Четкая")})</option>
            <option value="light">{tr("Светлая (Минимализм)")}</option>
            <option value="streets">{tr("Топографическая")}</option>
          </select>

          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              title={isExpanded ? t("worldTime.collapseMap") : t("worldTime.expandMap")}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Panoramic Real Map Canvas */}
      <div className="relative h-[440px] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 z-0">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* Custom Zoom & Reset Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden z-400">
          <button
            onClick={handleZoomIn}
            title={tr("Приблизить карту")}
            className="p-2.5 hover:bg-slate-50 text-slate-700 transition-colors border-b border-slate-100"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title={tr("Отдалить карту")}
            className="p-2.5 hover:bg-slate-50 text-slate-700 transition-colors border-b border-slate-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title={tr("Сбросить масштаб (Весь мир)")}
            className="p-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Map Legend badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 shadow-md z-400 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white"></span>
            <span className="font-medium text-[11px]">{tr("На встрече / в фокусе")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 border border-white"></span>
            <span className="font-medium text-[11px]">{tr("Города мира")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <span>• {tr("Кликните на любой город для действий")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
