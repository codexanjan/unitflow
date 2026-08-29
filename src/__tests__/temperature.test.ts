import { describe, it, expect } from 'vitest';
import { convertUnits } from '../engine/converter';
import { getCategoryById } from '../units';

describe('Temperature Conversion Accuracy', () => {
  const category = getCategoryById('temperature')!;
  const c = category.units.find((u) => u.id === 'celsius')!;
  const f = category.units.find((u) => u.id === 'fahrenheit')!;
  const k = category.units.find((u) => u.id === 'kelvin')!;
  const r = category.units.find((u) => u.id === 'rankine')!;
  const de = category.units.find((u) => u.id === 'delisle')!;
  const n = category.units.find((u) => u.id === 'newton')!;
  const re = category.units.find((u) => u.id === 'reaumur')!;
  const ro = category.units.find((u) => u.id === 'romer')!;

  it('freezing point of water: 0 °C = 32 °F = 273.15 K', () => {
    const toF = convertUnits(0, c, f);
    expect(Number(toF.output)).toBe(32);

    const toK = convertUnits(0, c, k);
    expect(Number(toK.output)).toBe(273.15);

    const fToC = convertUnits(32, f, c);
    expect(Number(fToC.output)).toBe(0);

    const kToC = convertUnits(273.15, k, c);
    expect(Number(kToC.output)).toBeCloseTo(0, 5);
  });

  it('boiling point of water: 100 °C = 212 °F = 373.15 K', () => {
    const toF = convertUnits(100, c, f);
    expect(Number(toF.output)).toBe(212);

    const toK = convertUnits(100, c, k);
    expect(Number(toK.output)).toBe(373.15);

    const fToK = convertUnits(212, f, k);
    expect(Number(fToK.output)).toBe(373.15);
  });

  it('crossing point: -40 °C = -40 °F', () => {
    const res = convertUnits(-40, c, f);
    expect(Number(res.output)).toBe(-40);

    const reverse = convertUnits(-40, f, c);
    expect(Number(reverse.output)).toBe(-40);
  });

  it('absolute zero: -273.15 °C = 0 K = -459.67 °F', () => {
    const toK = convertUnits(-273.15, c, k);
    expect(Number(toK.output)).toBeCloseTo(0, 5);

    const toF = convertUnits(-273.15, c, f);
    expect(Number(toF.output)).toBeCloseTo(-459.67, 2);
  });

  it('Rankine, Delisle, Newton, Réaumur, and Rømer conversions', () => {
    // 0 °C in Rankine = 491.67 °R
    expect(Number(convertUnits(0, c, r).output)).toBeCloseTo(491.67, 2);

    // 100 °C in Delisle = 0 °De
    expect(Number(convertUnits(100, c, de).output)).toBeCloseTo(0, 5);

    // 100 °C in Newton = 33 °N
    expect(Number(convertUnits(100, c, n).output)).toBeCloseTo(33, 5);

    // 100 °C in Réaumur = 80 °Ré
    expect(Number(convertUnits(100, c, re).output)).toBeCloseTo(80, 5);

    // 100 °C in Rømer = 60 °Rø
    expect(Number(convertUnits(100, c, ro).output)).toBeCloseTo(60, 5);
  });
});
