import { CategoryDefinition } from '../engine/types';

// Helper for Roman Numeral conversion
function toRoman(num: number): string {
  if (isNaN(num) || num <= 0 || num >= 4000 || !Number.isInteger(num)) {
    return 'N/A (1 - 3999 integers only)';
  }
  const romanMap: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let res = '';
  let n = num;
  for (const [val, char] of romanMap) {
    while (n >= val) {
      res += char;
      n -= val;
    }
  }
  return res;
}

function fromRoman(roman: string | number): number {
  if (typeof roman === 'number') return roman;
  const str = roman.trim().toUpperCase();
  const romanMap: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    const current = romanMap[str[i]] || 0;
    const next = romanMap[str[i + 1]] || 0;
    if (current < next) {
      sum -= current;
    } else {
      sum += current;
    }
  }
  return sum || 0;
}

export const specializedCategories: CategoryDefinition[] = [
  {
    id: 'fuel_economy',
    name: 'Fuel Economy & Consumption',
    group: 'Specialized',
    iconName: 'Fuel',
    description: 'Convert between MPG (US & Imperial), L/100km, and km/L.',
    baseUnitId: 'km_per_liter',
    popularPairs: [
      ['mpg_us', 'liters_per_100km'],
      ['mpg_us', 'mpg_imperial'],
      ['liters_per_100km', 'km_per_liter'],
    ],
    units: [
      { id: 'km_per_liter', name: 'Kilometers per Liter', symbol: 'km/L', category: 'fuel_economy', factor: 1, baseUnit: true, system: 'metric', aliases: ['km/l', 'km/L', 'kml', 'kilometer per liter'] },
      {
        id: 'mpg_us',
        name: 'Miles per US Gallon',
        symbol: 'mpg (US)',
        category: 'fuel_economy',
        system: 'us_customary',
        aliases: ['mpg', 'mpg us', 'miles per gallon'],
        customFromUnit: (mpg) => Number(mpg) * 0.425143707,
        customToUnit: (kml) => Number(kml) / 0.425143707,
      },
      {
        id: 'mpg_imperial',
        name: 'Miles per Imperial Gallon',
        symbol: 'mpg (UK)',
        category: 'fuel_economy',
        system: 'imperial',
        aliases: ['mpg uk', 'mpg imperial', 'imperial mpg'],
        customFromUnit: (mpg) => Number(mpg) * 0.35400619,
        customToUnit: (kml) => Number(kml) / 0.35400619,
      },
      {
        id: 'liters_per_100km',
        name: 'Liters per 100 Kilometers',
        symbol: 'L/100km',
        category: 'fuel_economy',
        system: 'metric',
        aliases: ['l/100km', 'l/100 km', 'liters per 100km'],
        customFromUnit: (l100) => (Number(l100) <= 0 ? 0 : 100 / Number(l100)),
        customToUnit: (kml) => (Number(kml) <= 0 ? 0 : 100 / Number(kml)),
      },
    ],
  },
  {
    id: 'concentration',
    name: 'Concentration & Solutions',
    group: 'Specialized',
    iconName: 'FlaskConical',
    description: 'Convert between Molar, millimolar, parts-per-million (ppm), and percentages.',
    baseUnitId: 'parts_per_million',
    popularPairs: [
      ['parts_per_million', 'percentage'],
      ['millimolar', 'micromolar'],
      ['parts_per_million', 'parts_per_billion'],
    ],
    units: [
      { id: 'parts_per_million', name: 'Parts per Million', symbol: 'ppm', category: 'concentration', factor: 1, baseUnit: true, system: 'si', aliases: ['ppm', 'parts per million', 'mg/l', 'mg/kg'] },
      { id: 'parts_per_billion', name: 'Parts per Billion', symbol: 'ppb', category: 'concentration', factor: 0.001, system: 'si', aliases: ['ppb', 'parts per billion', 'ug/l'] },
      { id: 'parts_per_trillion', name: 'Parts per Trillion', symbol: 'ppt', category: 'concentration', factor: 1e-6, system: 'si', aliases: ['ppt', 'parts per trillion'] },
      { id: 'percentage', name: 'Mass / Volume Percentage', symbol: '%', category: 'concentration', factor: 10000, system: 'other', aliases: ['%', 'percent', 'percentage'] },
      { id: 'gram_per_liter', name: 'Gram per Liter', symbol: 'g/L', category: 'concentration', factor: 1000, system: 'metric', aliases: ['g/l', 'g/L', 'gram/liter'] },
      { id: 'milligram_per_deciliter', name: 'Milligram per Deciliter (Blood Glucose / Chem)', symbol: 'mg/dL', category: 'concentration', factor: 10, system: 'other', aliases: ['mg/dl', 'mg/dL'] },
    ],
  },
  {
    id: 'wire_gauge',
    name: 'Wire Gauge (AWG / Diameter)',
    group: 'Specialized',
    iconName: 'Cable',
    description: 'Convert between American Wire Gauge (AWG), diameter in mm/inches, and cross-sectional area.',
    baseUnitId: 'diameter_mm',
    popularPairs: [
      ['diameter_mm', 'cross_section_mm2'],
      ['diameter_mm', 'diameter_inches'],
      ['diameter_mm', 'circular_mils'],
    ],
    units: [
      { id: 'diameter_mm', name: 'Diameter (mm)', symbol: 'mm', category: 'wire_gauge', factor: 1, baseUnit: true, system: 'metric', aliases: ['mm', 'diameter mm'] },
      { id: 'diameter_inches', name: 'Diameter (Inches)', symbol: 'in', category: 'wire_gauge', factor: 25.4, system: 'imperial', aliases: ['in', 'diameter in', 'diameter inches'] },
      {
        id: 'cross_section_mm2',
        name: 'Cross-Sectional Area (mm²)',
        symbol: 'mm²',
        category: 'wire_gauge',
        system: 'metric',
        aliases: ['mm2', 'mm^2', 'area mm2'],
        // Area = pi * (d/2)^2 => d = 2 * sqrt(Area / pi)
        customFromUnit: (area) => 2 * Math.sqrt(Math.max(0, Number(area)) / Math.PI),
        customToUnit: (d) => Math.PI * Math.pow(Math.max(0, Number(d)) / 2, 2),
      },
      {
        id: 'circular_mils',
        name: 'Circular Mils (kcmil / cmil)',
        symbol: 'cmil',
        category: 'wire_gauge',
        system: 'imperial',
        aliases: ['cmil', 'circular mils'],
        // 1 mil = 0.0254 mm. cmil = (d_mils)^2 => d_mils = sqrt(cmil) => d_mm = sqrt(cmil) * 0.0254
        customFromUnit: (cmil) => Math.sqrt(Math.max(0, Number(cmil))) * 0.0254,
        customToUnit: (d_mm) => Math.pow(Math.max(0, Number(d_mm)) / 0.0254, 2),
      },
    ],
  },
  {
    id: 'typography',
    name: 'Typography & Digital Layout',
    group: 'Specialized',
    iconName: 'Type',
    description: 'Convert between Points, Pixels (@96 DPI), Picas, EM, REM, and millimeters.',
    baseUnitId: 'point',
    popularPairs: [
      ['point', 'pixel'],
      ['pixel', 'rem'],
      ['point', 'pica'],
      ['pixel', 'millimeter'],
    ],
    units: [
      { id: 'point', name: 'Point (pt)', symbol: 'pt', category: 'typography', factor: 1, baseUnit: true, system: 'other', aliases: ['pt', 'point', 'points'] },
      { id: 'pixel', name: 'Pixel (px @96dpi)', symbol: 'px', category: 'typography', factor: 0.75, system: 'other', aliases: ['px', 'pixel', 'pixels'] },
      { id: 'pica', name: 'Pica (pc)', symbol: 'pc', category: 'typography', factor: 12, system: 'other', aliases: ['pc', 'pica', 'picas'] },
      { id: 'em', name: 'EM (@16px baseline)', symbol: 'em', category: 'typography', factor: 12, system: 'other', aliases: ['em'] },
      { id: 'rem', name: 'REM (@16px baseline)', symbol: 'rem', category: 'typography', factor: 12, system: 'other', aliases: ['rem'] },
      { id: 'millimeter', name: 'Millimeter (mm)', symbol: 'mm', category: 'typography', factor: 72 / 25.4, system: 'metric', aliases: ['mm', 'millimeter'] },
      { id: 'inch', name: 'Inch (in)', symbol: 'in', category: 'typography', factor: 72, system: 'imperial', aliases: ['in', 'inch'] },
      { id: 'twip', name: 'Twip (1/20 pt)', symbol: 'twip', category: 'typography', factor: 0.05, system: 'other', aliases: ['twip', 'twips'] },
    ],
  },
  {
    id: 'cooking',
    name: 'Cooking & Recipe Measurements',
    group: 'Specialized',
    iconName: 'Utensils',
    description: 'Convert between US/Metric cups, tablespoons, teaspoons, drops, and pinches.',
    baseUnitId: 'milliliter',
    popularPairs: [
      ['us_cup', 'milliliter'],
      ['us_tablespoon', 'us_teaspoon'],
      ['us_cup', 'us_fluid_ounce'],
      ['metric_cup', 'us_cup'],
    ],
    units: [
      { id: 'milliliter', name: 'Milliliter (mL)', symbol: 'mL', category: 'cooking', factor: 1, baseUnit: true, system: 'metric', aliases: ['ml', 'mL', 'milliliter'] },
      { id: 'us_cup', name: 'US Cup', symbol: 'cup (US)', category: 'cooking', factor: 236.5882365, system: 'us_customary', aliases: ['us cup', 'cup', 'cups'] },
      { id: 'metric_cup', name: 'Metric Cup (250 mL)', symbol: 'metric cup', category: 'cooking', factor: 250, system: 'metric', aliases: ['metric cup'] },
      { id: 'us_tablespoon', name: 'US Tablespoon (tbsp)', symbol: 'tbsp (US)', category: 'cooking', factor: 14.78676478125, system: 'us_customary', aliases: ['tbsp', 'tablespoon', 'tbsp us'] },
      { id: 'metric_tablespoon', name: 'Metric Tablespoon (15 mL)', symbol: 'metric tbsp', category: 'cooking', factor: 15, system: 'metric', aliases: ['metric tbsp', 'metric tablespoon'] },
      { id: 'us_teaspoon', name: 'US Teaspoon (tsp)', symbol: 'tsp (US)', category: 'cooking', factor: 4.92892159375, system: 'us_customary', aliases: ['tsp', 'teaspoon', 'tsp us'] },
      { id: 'metric_teaspoon', name: 'Metric Teaspoon (5 mL)', symbol: 'metric tsp', category: 'cooking', factor: 5, system: 'metric', aliases: ['metric tsp', 'metric teaspoon'] },
      { id: 'us_fluid_ounce', name: 'US Fluid Ounce', symbol: 'fl oz (US)', category: 'cooking', factor: 29.5735295625, system: 'us_customary', aliases: ['fl oz', 'fluid ounce'] },
      { id: 'pinch', name: 'Pinch (~1/16 tsp)', symbol: 'pinch', category: 'cooking', factor: 0.3080575996, system: 'other', aliases: ['pinch', 'pinches'] },
      { id: 'dash', name: 'Dash (~1/8 tsp)', symbol: 'dash', category: 'cooking', factor: 0.6161151992, system: 'other', aliases: ['dash', 'dashes'] },
      { id: 'drop', name: 'Drop (gtt)', symbol: 'drop', category: 'cooking', factor: 0.05, system: 'other', aliases: ['drop', 'drops', 'gtt'] },
    ],
  },
  {
    id: 'numeral_systems',
    name: 'Numeral Systems & Radix',
    group: 'Specialized',
    iconName: 'Binary',
    description: 'Convert between Decimal, Binary, Octal, Hexadecimal, Base36, and Roman Numerals.',
    baseUnitId: 'decimal',
    popularPairs: [
      ['decimal', 'hexadecimal'],
      ['decimal', 'binary'],
      ['binary', 'hexadecimal'],
      ['decimal', 'roman'],
    ],
    units: [
      {
        id: 'decimal',
        name: 'Decimal (Base 10)',
        symbol: 'DEC',
        category: 'numeral_systems',
        baseUnit: true,
        factor: 1,
        aliases: ['dec', 'decimal', 'base 10', 'base10'],
        customFromUnit: (val) => parseInt(String(val).trim(), 10) || 0,
        customToUnit: (dec) => Math.floor(Number(dec)).toString(10),
      },
      {
        id: 'binary',
        name: 'Binary (Base 2)',
        symbol: 'BIN',
        category: 'numeral_systems',
        aliases: ['bin', 'binary', 'base 2', 'base2'],
        customFromUnit: (val) => parseInt(String(val).trim().replace(/^0b/i, ''), 2) || 0,
        customToUnit: (dec) => (Number(dec) >= 0 ? Math.floor(Number(dec)).toString(2) : (Math.floor(Number(dec)) >>> 0).toString(2)),
      },
      {
        id: 'octal',
        name: 'Octal (Base 8)',
        symbol: 'OCT',
        category: 'numeral_systems',
        aliases: ['oct', 'octal', 'base 8', 'base8'],
        customFromUnit: (val) => parseInt(String(val).trim().replace(/^0o/i, ''), 8) || 0,
        customToUnit: (dec) => Math.floor(Number(dec)).toString(8),
      },
      {
        id: 'hexadecimal',
        name: 'Hexadecimal (Base 16)',
        symbol: 'HEX',
        category: 'numeral_systems',
        aliases: ['hex', 'hexadecimal', 'base 16', 'base16'],
        customFromUnit: (val) => parseInt(String(val).trim().replace(/^0x/i, ''), 16) || 0,
        customToUnit: (dec) => Math.floor(Number(dec)).toString(16).toUpperCase(),
      },
      {
        id: 'base36',
        name: 'Base 36 (Alphanumeric)',
        symbol: 'Base36',
        category: 'numeral_systems',
        aliases: ['base36', 'base 36'],
        customFromUnit: (val) => parseInt(String(val).trim(), 36) || 0,
        customToUnit: (dec) => Math.floor(Number(dec)).toString(36).toUpperCase(),
      },
      {
        id: 'roman',
        name: 'Roman Numerals',
        symbol: 'ROMAN',
        category: 'numeral_systems',
        aliases: ['roman', 'roman numerals', 'roman numeral'],
        customFromUnit: (val) => fromRoman(String(val)),
        customToUnit: (dec) => toRoman(Math.floor(Number(dec))),
      },
    ],
  },
];
