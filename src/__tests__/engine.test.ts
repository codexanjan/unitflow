import { describe, it, expect } from 'vitest';
import { convertUnits, convertToAllUnits } from '../engine/converter';
import { getCategoryById, allCategories } from '../units';

describe('Unit Conversion Engine', () => {
  it('should accurately convert length (km to miles and round-trip)', () => {
    const category = getCategoryById('length')!;
    const km = category.units.find((u) => u.id === 'kilometer')!;
    const mi = category.units.find((u) => u.id === 'mile')!;

    const result = convertUnits(100, km, mi);
    expect(Number(result.output)).toBeCloseTo(62.1371, 3);

    // Round-trip conversion: mi -> km
    const roundTrip = convertUnits(result.output, mi, km);
    expect(Number(roundTrip.output)).toBeCloseTo(100, 5);
  });

  it('should accurately convert mass (kg to lbs and round-trip)', () => {
    const category = getCategoryById('mass')!;
    const kg = category.units.find((u) => u.id === 'kilogram')!;
    const lb = category.units.find((u) => u.id === 'pound')!;

    const result = convertUnits(1, kg, lb);
    expect(Number(result.output)).toBeCloseTo(2.20462, 4);

    const roundTrip = convertUnits(result.output, lb, kg);
    expect(Number(roundTrip.output)).toBeCloseTo(1, 5);
  });

  it('should accurately convert volume (L to US Gallon and round-trip)', () => {
    const category = getCategoryById('volume')!;
    const liter = category.units.find((u) => u.id === 'liter')!;
    const usGal = category.units.find((u) => u.id === 'us_gallon')!;

    const result = convertUnits(3.785411784, liter, usGal);
    expect(Number(result.output)).toBeCloseTo(1.0, 5);

    const roundTrip = convertUnits(1, usGal, liter);
    expect(Number(roundTrip.output)).toBeCloseTo(3.78541, 4);
  });

  it('should accurately convert pressure (bar to psi)', () => {
    const category = getCategoryById('pressure')!;
    const bar = category.units.find((u) => u.id === 'bar')!;
    const psi = category.units.find((u) => u.id === 'psi')!;

    const result = convertUnits(1, bar, psi);
    expect(Number(result.output)).toBeCloseTo(14.5038, 3);
  });

  it('should accurately convert energy (Joules to Calories)', () => {
    const category = getCategoryById('energy')!;
    const joule = category.units.find((u) => u.id === 'joule')!;
    const cal = category.units.find((u) => u.id === 'calorie')!;

    const result = convertUnits(4.184, joule, cal);
    expect(Number(result.output)).toBeCloseTo(1.0, 5);
  });

  it('should accurately convert power (kW to metric and mechanical horsepower)', () => {
    const category = getCategoryById('power')!;
    const kw = category.units.find((u) => u.id === 'kilowatt')!;
    const hpM = category.units.find((u) => u.id === 'horsepower_metric')!;
    const hpI = category.units.find((u) => u.id === 'horsepower_imperial')!;

    const resM = convertUnits(100, kw, hpM);
    expect(Number(resM.output)).toBeCloseTo(135.962, 2);

    const resI = convertUnits(100, kw, hpI);
    expect(Number(resI.output)).toBeCloseTo(134.102, 2);
  });

  it('should handle zero input across categories', () => {
    const lengthCat = getCategoryById('length')!;
    const m = lengthCat.units.find((u) => u.id === 'meter')!;
    const ft = lengthCat.units.find((u) => u.id === 'foot')!;

    const res = convertUnits(0, m, ft);
    expect(Number(res.output)).toBe(0);
    expect(res.formattedOutput).toBe('0');
  });

  it('should handle negative values where valid', () => {
    const accelCat = getCategoryById('acceleration')!;
    const mps2 = accelCat.units.find((u) => u.id === 'meter_per_square_second')!;
    const g0 = accelCat.units.find((u) => u.id === 'standard_gravity')!;

    const res = convertUnits(-9.80665, mps2, g0);
    expect(Number(res.output)).toBeCloseTo(-1.0, 5);
  });

  it('should handle very large numbers without precision breakdown', () => {
    const lengthCat = getCategoryById('length')!;
    const ly = lengthCat.units.find((u) => u.id === 'light_year')!;
    const m = lengthCat.units.find((u) => u.id === 'meter')!;

    const res = convertUnits(1, ly, m);
    expect(Number(res.output)).toBeCloseTo(9.46073e15, -10);
  });

  it('should handle very small numbers', () => {
    const lengthCat = getCategoryById('length')!;
    const pm = lengthCat.units.find((u) => u.id === 'picometer')!;
    const m = lengthCat.units.find((u) => u.id === 'meter')!;

    const res = convertUnits(500, pm, m);
    expect(Number(res.output)).toBeCloseTo(5e-10, 15);
  });

  it('should convert to all units in category', () => {
    const cat = getCategoryById('speed')!;
    const kmh = cat.units.find((u) => u.id === 'kilometer_per_hour')!;

    const all = convertToAllUnits(100, kmh, cat);
    expect(all.length).toBe(cat.units.length);

    const mph = all.find((item) => item.unit.id === 'mile_per_hour')!;
    expect(Number(mph.value)).toBeCloseTo(62.1371, 3);
  });

  it('every registered category should have valid units and base unit', () => {
    for (const cat of allCategories) {
      expect(cat.units.length).toBeGreaterThan(1);
      const baseUnit = cat.units.find((u) => u.id === cat.baseUnitId);
      expect(baseUnit).toBeDefined();
    }
  });
});
