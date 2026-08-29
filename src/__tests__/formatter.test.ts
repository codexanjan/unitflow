import { describe, it, expect } from 'vitest';
import { formatNumber } from '../engine/formatter';

describe('Number Formatter', () => {
  it('should format in auto mode cleanly', () => {
    expect(formatNumber(1234.56, { mode: 'auto' })).toBe('1,234.56');
    expect(formatNumber(0, { mode: 'auto' })).toBe('0');
    expect(formatNumber(1000000, { mode: 'auto' })).toBe('1,000,000');
  });

  it('should format in fixed decimals mode', () => {
    expect(formatNumber(3.14159265, { mode: 'fixed', decimals: 2 })).toBe('3.14');
    expect(formatNumber(3.1, { mode: 'fixed', decimals: 4 })).toBe('3.1000');
    expect(formatNumber(100, { mode: 'fixed', decimals: 0 })).toBe('100');
  });

  it('should format in significant figures mode', () => {
    expect(formatNumber(123.456, { mode: 'sigfigs', significantFigures: 3 })).toBe('123');
    expect(formatNumber(0.0012345, { mode: 'sigfigs', significantFigures: 2 })).toBe('0.0012');
  });

  it('should support thousands separators (comma, space, dot, none)', () => {
    const num = 1234567.89;
    expect(formatNumber(num, { thousandsSeparator: 'comma' })).toBe('1,234,567.89');
    expect(formatNumber(num, { thousandsSeparator: 'space' })).toBe('1 234 567.89');
    expect(formatNumber(num, { thousandsSeparator: 'dot' })).toBe('1.234.567,89');
    expect(formatNumber(num, { thousandsSeparator: 'none' })).toBe('1234567.89');
  });

  it('should format in scientific notation', () => {
    const res = formatNumber(1234567, { notation: 'scientific' });
    expect(res).toContain('× 10⁶');
  });

  it('should format in engineering notation (multiples of 3)', () => {
    const res1 = formatNumber(12345, { notation: 'engineering' });
    expect(res1).toContain('12.35 × 10³');

    const res2 = formatNumber(1234567, { notation: 'engineering' });
    expect(res2).toContain('1.235 × 10⁶');
  });
});
