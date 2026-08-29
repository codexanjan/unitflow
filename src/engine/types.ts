export type CategoryGroup =
  | 'Basic'
  | 'Physics & Engineering'
  | 'Electrical'
  | 'Data'
  | 'Light & Sound'
  | 'Specialized';

export type UnitSystem = 'metric' | 'imperial' | 'us_customary' | 'si' | 'astronomical' | 'nautical' | 'cgs' | 'other';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: string;
  factor?: number; // baseValue = (val + (offset || 0)) * factor
  offset?: number;
  // For specialized/non-linear units (e.g. Fuel Economy, Wire Gauge, Numeral Systems, Decibels, Pace)
  customToUnit?: (baseValue: number | string) => number | string;
  customFromUnit?: (value: number | string) => number | string;
  aliases: string[];
  system?: UnitSystem;
  description?: string;
  baseUnit?: boolean;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  group: CategoryGroup;
  iconName: string;
  description: string;
  baseUnitId: string;
  units: UnitDefinition[];
  popularPairs?: [string, string][];
}

export interface FormulaExplanation {
  formula: string;
  steps: string[];
  unitRatioText: string;
  directFactor?: number;
}

export interface ConversionResult {
  input: number | string;
  output: number | string;
  formattedOutput: string;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  category: CategoryDefinition;
  explanation: FormulaExplanation;
}

export type PrecisionMode = 'auto' | 'fixed' | 'sigfigs';
export type ThousandsSeparator = 'comma' | 'space' | 'dot' | 'none';
export type NotationMode = 'standard' | 'scientific' | 'engineering';

export interface FormatOptions {
  mode: PrecisionMode;
  decimals: number;
  significantFigures: number;
  thousandsSeparator: ThousandsSeparator;
  notation: NotationMode;
}

export interface FavoriteItem {
  id: string;
  categoryId: string;
  fromUnitId: string;
  toUnitId: string;
  customLabel?: string;
  defaultInput?: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  categoryId: string;
  categoryName: string;
  fromUnitId: string;
  fromUnitName: string;
  fromUnitSymbol: string;
  toUnitId: string;
  toUnitName: string;
  toUnitSymbol: string;
  inputValue: string | number;
  outputValue: string | number;
  formattedOutput: string;
  timestamp: number;
}

export interface CurrencyRateData {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  cached: boolean;
  cacheTimestamp: number;
  source?: string;
}
