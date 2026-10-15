export type FuelType = 'diesel' | 'petrol95' | 'petrol92' | 'lpg' | 'cng';

export type TerrainType = 'mixed' | 'flat' | 'hilly' | 'mountainous';

export type MountainCondition = 'none' | 'moderate' | 'high' | 'extreme';

export type SeasonType = 'summer' | 'transition' | 'winter_mild' | 'winter_severe';

export type RoadCondition = 'good' | 'medium' | 'bad' | 'offroad';

export type WindCondition = 'none' | 'moderate' | 'strong';

export type EquipmentCondition = 'none' | 'ac' | 'refrigeration' | 'pto';

export type CalcMode = 'quick' | 'freight' | 'normative';

export type DistanceUnit = 'km' | 'miles';

export type CurrencyCode = 'USD' | 'EUR' | 'UZS' | 'RUB' | 'KZT';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUsd: number; // For currency conversions
}

export interface CalculatorState {
  mode: CalcMode;
  distanceUnit: DistanceUnit;
  currency: CurrencyCode;
  
  // Section 1: Main parameters
  fuelType: FuelType;
  avgConsumption: number; // l/100km
  totalDistance: number; // km
  fuelPrice: number; // per liter in chosen currency
  
  // Section 2: Loading & Route
  loadedDistance: number; // km
  emptyDistance: number; // km
  cargoWeight: number; // tons
  trailerWeight: number; // tons
  
  // Section 3: Relief & Elevation
  terrainType: TerrainType;
  totalAscent: number; // meters
  totalDescent: number; // meters
  mountainCondition: MountainCondition;
  
  // Section 4: Additional conditions
  season: SeasonType;
  temperature: number; // Celsius
  roadCondition: RoadCondition;
  idleHours: number; // hours
  cityCyclePercent: number; // %
  additionalCoeffPercent: number; // %
  headwind: WindCondition;
  equipment: EquipmentCondition;

  // Selected Truck Model (for Normative mode)
  selectedTruckModel?: string;
}

export interface CalculationResult {
  totalFuel: number; // liters or gallons
  totalCost: number; // currency
  effectiveAvgConsumption: number; // l/100km or mpg
  loadedFuel: number;
  loadedCost: number;
  emptyFuel: number;
  emptyCost: number;
  idleFuel: number;
  idleCost: number;
  tonKilometers: number;
  co2EmissionsKg: number;
  costPerKm: number;
  appliedCoeffsSummary: {
    name: string;
    value: string;
  }[];
}

export interface SavedCalculation {
  id: string;
  date: string;
  title: string;
  state: CalculatorState;
  result: CalculationResult;
}

export interface TruckPreset {
  id: string;
  brand: string;
  model: string;
  category?: 'tractor' | 'dump' | 'medium' | 'light';
  wheelFormula?: string;
  baseConsumption: number; // l/100km unladen
  cargoNormPerTon: number; // l/100km per ton
  enginePowerHp: number;
  fuelType: FuelType;
}
