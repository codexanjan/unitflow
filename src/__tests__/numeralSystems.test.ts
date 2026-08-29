import { describe, it, expect } from 'vitest';
import { convertUnits } from '../engine/converter';
import { getCategoryById } from '../units';

describe('Numeral Systems & Radix Conversion', () => {
  const cat = getCategoryById('numeral_systems')!;
  const dec = cat.units.find((u) => u.id === 'decimal')!;
  const bin = cat.units.find((u) => u.id === 'binary')!;
  const oct = cat.units.find((u) => u.id === 'octal')!;
  const hex = cat.units.find((u) => u.id === 'hexadecimal')!;
  const roman = cat.units.find((u) => u.id === 'roman')!;

  it('decimal to binary, octal, hex', () => {
    expect(convertUnits(255, dec, hex).output).toBe('FF');
    expect(convertUnits(255, dec, bin).output).toBe('11111111');
    expect(convertUnits(255, dec, oct).output).toBe('377');
  });

  it('hex and binary back to decimal', () => {
    expect(convertUnits('FF', hex, dec).output).toBe('255');
    expect(convertUnits('1010', bin, dec).output).toBe('10');
  });

  it('roman numeral conversions', () => {
    expect(convertUnits(2026, dec, roman).output).toBe('MMXXVI');
    expect(convertUnits('MMXXVI', roman, dec).output).toBe('2026');
    expect(convertUnits(49, dec, roman).output).toBe('XLIX');
    expect(convertUnits('XLIX', roman, dec).output).toBe('49');
  });
});
