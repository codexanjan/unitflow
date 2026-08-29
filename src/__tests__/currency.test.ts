import { describe, it, expect } from 'vitest';
import { convertCurrency } from '../services/currency';

describe('Currency Conversion Calculations', () => {
  const mockRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 155.0,
  };

  it('converts base currency to foreign currency accurately', () => {
    const res = convertCurrency(100, 'USD', 'EUR', mockRates);
    expect(res.result).toBe(92);
    expect(res.rate).toBe(0.92);
    expect(res.inverseRate).toBeCloseTo(1 / 0.92, 5);
  });

  it('converts between two non-base foreign currencies via cross-rate', () => {
    // 100 EUR to GBP => 100 * (0.79 / 0.92)
    const res = convertCurrency(100, 'EUR', 'GBP', mockRates);
    expect(res.result).toBeCloseTo(85.8695, 3);
  });

  it('handles zero input', () => {
    const res = convertCurrency(0, 'USD', 'JPY', mockRates);
    expect(res.result).toBe(0);
  });
});
