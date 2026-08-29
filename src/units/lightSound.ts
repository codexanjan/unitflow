import { CategoryDefinition } from '../engine/types';

export const lightSoundCategories: CategoryDefinition[] = [
  {
    id: 'illuminance',
    name: 'Illuminance',
    group: 'Light & Sound',
    iconName: 'Sun',
    description: 'Convert between Lux, Foot-candles, Phots, and Noxia.',
    baseUnitId: 'lux',
    popularPairs: [
      ['lux', 'foot_candle'],
      ['foot_candle', 'lux'],
    ],
    units: [
      { id: 'lux', name: 'Lux (lm/m²)', symbol: 'lx', category: 'illuminance', factor: 1, baseUnit: true, system: 'si', aliases: ['lux', 'lx', 'lumen/m2'] },
      { id: 'foot_candle', name: 'Foot-candle (lm/ft²)', symbol: 'fc', category: 'illuminance', factor: 10.763910416709722, system: 'imperial', aliases: ['foot-candle', 'foot candle', 'fc', 'ft-cd'] },
      { id: 'phot', name: 'Phot', symbol: 'ph', category: 'illuminance', factor: 10000, system: 'cgs', aliases: ['phot', 'ph'] },
      { id: 'nox', name: 'Nox', symbol: 'nx', category: 'illuminance', factor: 0.001, system: 'other', aliases: ['nox', 'nx'] },
    ],
  },
  {
    id: 'luminance',
    name: 'Luminance',
    group: 'Light & Sound',
    iconName: 'Sparkles',
    description: 'Convert between Candela per square meter (Nit), Foot-lamberts, Lamberts, and Stilbs.',
    baseUnitId: 'candela_per_sq_meter',
    popularPairs: [
      ['candela_per_sq_meter', 'foot_lambert'],
      ['candela_per_sq_meter', 'nit'],
    ],
    units: [
      { id: 'candela_per_sq_meter', name: 'Candela/m² (Nit)', symbol: 'cd/m²', category: 'luminance', factor: 1, baseUnit: true, system: 'si', aliases: ['nit', 'nits', 'cd/m2', 'cd/m^2', 'candela per square meter'] },
      { id: 'foot_lambert', name: 'Foot-lambert', symbol: 'fL', category: 'luminance', factor: 3.4262590996353, system: 'imperial', aliases: ['foot-lambert', 'foot lambert', 'fl', 'fL'] },
      { id: 'lambert', name: 'Lambert', symbol: 'L', category: 'luminance', factor: 3183.0988618379, system: 'cgs', aliases: ['lambert', 'L'] },
      { id: 'stilb', name: 'Stilb', symbol: 'sb', category: 'luminance', factor: 10000, system: 'cgs', aliases: ['stilb', 'sb'] },
    ],
  },
  {
    id: 'sound_level',
    name: 'Sound Level & Pressure',
    group: 'Light & Sound',
    iconName: 'Volume2',
    description: 'Convert between Decibels (dB SPL), Bels, Nepers, and Pascal RMS sound pressure.',
    baseUnitId: 'decibel',
    popularPairs: [
      ['decibel', 'bel'],
      ['decibel', 'neper'],
      ['decibel', 'sound_pressure_pascal'],
    ],
    units: [
      { id: 'decibel', name: 'Decibel SPL', symbol: 'dB SPL', category: 'sound_level', factor: 1, baseUnit: true, system: 'other', aliases: ['decibel', 'decibels', 'db', 'dB', 'dB SPL'] },
      { id: 'bel', name: 'Bel', symbol: 'B', category: 'sound_level', factor: 10, system: 'other', aliases: ['bel', 'bels', 'B'] },
      { id: 'neper', name: 'Neper', symbol: 'Np', category: 'sound_level', factor: 8.685889638, system: 'other', aliases: ['neper', 'nepers', 'Np'] },
      {
        id: 'sound_pressure_pascal',
        name: 'Sound Pressure (Pa RMS)',
        symbol: 'Pa (RMS)',
        category: 'sound_level',
        system: 'si',
        aliases: ['sound pressure', 'pa rms', 'pascal rms'],
        // dB = 20 * log10(p / 20e-6)  => p = 20e-6 * 10^(dB / 20)
        customFromUnit: (p) => 20 * Math.log10(Math.max(1e-12, Number(p)) / 0.00002),
        customToUnit: (db) => 0.00002 * Math.pow(10, Number(db) / 20),
      },
    ],
  },
];
