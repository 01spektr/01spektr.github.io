import { Globe2, MapPin, Plus } from "lucide-react";
import type { CityTimezone } from "../types";

export function TimezoneMap({
  cities,
  allCities,
  timelineCityIds,
  onSelectCity,
  onSelectForConverter,
}: {
  cities: CityTimezone[];
  allCities: CityTimezone[];
  timelineCityIds: string[];
  onSelectCity: (city: CityTimezone) => void;
  onSelectForConverter: (city: CityTimezone) => void;
}) {
  const shown = cities.slice(0, 12);
  return (
    <article className="wt-card wt-map-card">
      <header className="wt-card-head">
        <div><Globe2 /><div><h2>Карта часовых поясов</h2><p>Выберите город для конвертации времени</p></div></div>
        <span>{allCities.length} городов</span>
      </header>
      <div className="wt-map" aria-label="Интерактивная карта часовых поясов">
        <div className="wt-map-grid" aria-hidden="true" />
        {shown.map((city) => (
          <button
            key={city.id}
            className="wt-map-pin"
            style={{ left: `${((city.lng + 180) / 360) * 92 + 4}%`, top: `${((90 - city.lat) / 180) * 78 + 9}%` }}
            title={`${city.cityRu}, ${city.countryRu}`}
            onClick={() => onSelectForConverter(city)}
          ><MapPin /><span>{city.cityRu}</span></button>
        ))}
      </div>
      <div className="wt-map-cities">
        {allCities.slice(0, 10).map((city) => (
          <button key={city.id} onClick={() => timelineCityIds.includes(city.id) ? onSelectForConverter(city) : onSelectCity(city)}>
            <span>{city.flag} {city.cityRu}</span>{timelineCityIds.includes(city.id) ? <MapPin /> : <Plus />}
          </button>
        ))}
      </div>
    </article>
  );
}
