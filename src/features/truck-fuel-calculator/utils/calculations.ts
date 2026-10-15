import { CalculatorState, CalculationResult, DistanceUnit } from '../types/calculator';

export function calculateFuel(state: CalculatorState): CalculationResult {
  // 1. Distance checks & base resolution
  const totalDist = Math.max(0, state.totalDistance || (state.loadedDistance + state.emptyDistance) || 0);
  const loadedDist = Math.max(0, state.loadedDistance || 0);
  const emptyDist = Math.max(0, state.emptyDistance || 0);
  const price = Math.max(0, state.fuelPrice || 0);
  const baseAvg = Math.max(0, state.avgConsumption || 0);

  // 2. Multipliers & coefficients calculation
  let terrainFactor = 0;
  if (state.terrainType === 'hilly') terrainFactor += 0.05;
  if (state.terrainType === 'mountainous') terrainFactor += 0.12;

  // Mountain condition
  if (state.mountainCondition === 'moderate') terrainFactor += 0.05;
  if (state.mountainCondition === 'high') terrainFactor += 0.10;
  if (state.mountainCondition === 'extreme') terrainFactor += 0.20;

  // Elevation net ascent impact (e.g. 800m up, 600m down -> net 200m)
  const netElevationKm = Math.max(0, (state.totalAscent - state.totalDescent) / 1000);
  const elevationAdditionLiters = netElevationKm * 1.5; // slight fuel spent climbing

  // Road condition factor
  let roadFactor = 0;
  if (state.roadCondition === 'medium') roadFactor = 0.04;
  if (state.roadCondition === 'bad') roadFactor = 0.10;
  if (state.roadCondition === 'offroad') roadFactor = 0.20;

  // Season / temperature factor
  let seasonFactor = 0;
  if (state.season === 'transition') seasonFactor += 0.03;
  if (state.season === 'winter_mild') seasonFactor += 0.08;
  if (state.season === 'winter_severe') seasonFactor += 0.15;
  if (state.temperature < 0) {
    seasonFactor += Math.min(0.15, Math.abs(state.temperature) * 0.005);
  }

  // City cycle factor (extra 15% on city percentage)
  const cityFactor = (Math.max(0, Math.min(100, state.cityCyclePercent || 0)) / 100) * 0.15;

  // Wind factor
  let windFactor = 0;
  if (state.headwind === 'moderate') windFactor = 0.05;
  if (state.headwind === 'strong') windFactor = 0.12;

  // Equipment / AC factor
  let equipFactor = 0;
  if (state.equipment === 'ac') equipFactor = 0.06;
  if (state.equipment === 'refrigeration') equipFactor = 0.12;
  if (state.equipment === 'pto') equipFactor = 0.08;

  // User manual extra percent
  const manualFactor = (state.additionalCoeffPercent || 0) / 100;

  // Aggregate multiplier for external environmental conditions
  const environmentalMultiplier = 1 + terrainFactor + roadFactor + seasonFactor + cityFactor + windFactor + equipFactor + manualFactor;

  // Idle engine consumption (heavy commercial diesel engine consumes approx 2.0 - 2.5 L/hr)
  const idleLiters = Math.max(0, state.idleHours || 0) * 2.2;

  let loadedFuel = 0;
  let emptyFuel = 0;

  if (state.mode === 'quick') {
    // Quick Mode: Matches the benchmark screenshot behavior exactly!
    // In screenshot with 32 L/100km, 350 loaded, 100 empty:
    // Loaded fuel = 350 * 0.32 = 112.0 L
    // Empty fuel = 100 * 0.32 = 32.0 L
    // Total = 144.0 L ($172.80)
    // Multipliers apply if user chooses non-defaults.
    const effectiveRate = baseAvg * environmentalMultiplier;
    loadedFuel = (loadedDist * effectiveRate) / 100;
    emptyFuel = (emptyDist * effectiveRate) / 100;
  } else if (state.mode === 'freight') {
    // Freight Mode: Differentiates loaded vs empty based on cargo and trailer weight
    // Base tractor + trailer empty consumption
    const trailerWeight = Math.max(0, state.trailerWeight || 0);
    const cargoWeight = Math.max(0, state.cargoWeight || 0);

    // Approximate unladen base (tractor + trailer)
    const unladenBaseRate = Math.max(18, baseAvg * 0.75 + trailerWeight * 0.25);
    // Norm for cargo: ~0.42 L per ton per 100 km
    const ladenExtraRate = cargoWeight * 0.42;

    const ladenRateWithCoeff = (unladenBaseRate + ladenExtraRate) * environmentalMultiplier;
    const unladenRateWithCoeff = unladenBaseRate * environmentalMultiplier;

    loadedFuel = (loadedDist * ladenRateWithCoeff) / 100;
    emptyFuel = (emptyDist * unladenRateWithCoeff) / 100;
  } else {
    // Normative mode (Ministry of Transport formula):
    // Q_norm = 0.01 * (H_san * S + H_w * W) * (1 + 0.01 * D)
    const cargoWeight = Math.max(0, state.cargoWeight || 0);
    const trailerWeight = Math.max(0, state.trailerWeight || 0);
    const tonKm = cargoWeight * loadedDist; // W in ton-km
    
    // H_san: unladen base rate
    const hSan = Math.max(20, baseAvg * 0.8 + trailerWeight * 0.2);
    // H_w: 1.3 L diesel per 100 t*km = 0.013 L per 1 t*km
    const cargoFuel = tonKm * 0.013;

    const baseDistanceFuel = (totalDist * hSan) / 100;
    const normBaseFuel = (baseDistanceFuel + cargoFuel) * environmentalMultiplier;

    // Distribute proportionally to loaded and empty segments
    const totalSegmentDist = loadedDist + emptyDist || totalDist || 1;
    const loadedRatio = loadedDist / totalSegmentDist;
    const emptyRatio = emptyDist / totalSegmentDist;

    loadedFuel = (normBaseFuel * loadedRatio) + (cargoFuel * (1 - loadedRatio));
    emptyFuel = normBaseFuel * emptyRatio;
  }

  // Add elevation net fuel to loaded section
  loadedFuel += elevationAdditionLiters;

  const totalFuelLiters = loadedFuel + emptyFuel + idleLiters;
  const totalCost = totalFuelLiters * price;
  const loadedCost = loadedFuel * price;
  const emptyCost = emptyFuel * price;
  const idleCost = idleLiters * price;

  // Effective average consumption per 100 km
  const effectiveAvg = totalDist > 0 ? (totalFuelLiters / totalDist) * 100 : baseAvg;

  // Ton-kilometers calculation (W = cargo * loadedDistance)
  const tonKilometers = Math.round((state.cargoWeight || 0) * loadedDist);

  // Carbon footprint: ~2.68 kg CO2 per 1 liter of diesel fuel
  const co2EmissionsKg = Math.round(totalFuelLiters * 2.68);

  const costPerKm = totalDist > 0 ? totalCost / totalDist : 0;

  // List of active coefficients applied
  const appliedCoeffsSummary: { name: string; value: string }[] = [];
  if (terrainFactor > 0) appliedCoeffsSummary.push({ name: 'Рельеф местности', value: `+${Math.round(terrainFactor * 100)}%` });
  if (roadFactor > 0) appliedCoeffsSummary.push({ name: 'Дорожные условия', value: `+${Math.round(roadFactor * 100)}%` });
  if (seasonFactor > 0) appliedCoeffsSummary.push({ name: 'Сезон и климат', value: `+${Math.round(seasonFactor * 100)}%` });
  if (cityFactor > 0) appliedCoeffsSummary.push({ name: 'Городской цикл', value: `+${Math.round(cityFactor * 100)}%` });
  if (windFactor > 0) appliedCoeffsSummary.push({ name: 'Встречный ветер', value: `+${Math.round(windFactor * 100)}%` });
  if (equipFactor > 0) appliedCoeffsSummary.push({ name: 'Доп. оборудование', value: `+${Math.round(equipFactor * 100)}%` });
  if (manualFactor !== 0) appliedCoeffsSummary.push({ name: 'Ручной коэффициент', value: `${manualFactor > 0 ? '+' : ''}${Math.round(manualFactor * 100)}%` });
  if (idleLiters > 0) appliedCoeffsSummary.push({ name: 'Простой двигателя', value: `+${idleLiters.toFixed(1)} л` });

  return {
    totalFuel: round1(totalFuelLiters),
    totalCost: round2(totalCost),
    effectiveAvgConsumption: round1(effectiveAvg),
    loadedFuel: round1(loadedFuel),
    loadedCost: round2(loadedCost),
    emptyFuel: round1(emptyFuel),
    emptyCost: round2(emptyCost),
    idleFuel: round1(idleLiters),
    idleCost: round2(idleCost),
    tonKilometers,
    co2EmissionsKg,
    costPerKm: round2(costPerKm),
    appliedCoeffsSummary,
  };
}

function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

function round2(val: number): number {
  return Math.round(val * 100) / 100;
}

export function formatDistance(dist: number, unit: DistanceUnit): string {
  if (unit === 'miles') {
    return `${Math.round(dist * 0.621371)} миль`;
  }
  return `${dist} км`;
}

export function formatFuel(liters: number, unit: DistanceUnit): string {
  if (unit === 'miles') {
    const gallons = liters * 0.264172;
    return `${gallons.toFixed(1)} gal`;
  }
  return `${liters.toFixed(1)} л`;
}

export function formatConsumption(val: number, unit: DistanceUnit): string {
  if (unit === 'miles') {
    // l/100km to mpg US: 235.215 / val
    const mpg = val > 0 ? 235.215 / val : 0;
    return `${mpg.toFixed(1)} mpg`;
  }
  return `${val.toFixed(1)} л/100 км`;
}

export function formatMoney(amount: number, symbol: string, forceDecimals?: boolean): string {
  // Uzbek sum (сум) doesn't use decimals for large freight amounts (standard accounting practice)
  const isUzs = symbol === 'сум' || symbol.toLowerCase().includes('сум');
  const decimals = isUzs && !forceDecimals ? 0 : 2;
  
  const formatted = amount.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  if (symbol === '$' || symbol === '€') {
    return `${symbol}${formatted}`;
  }
  return `${formatted}\u00A0${symbol}`;
}
