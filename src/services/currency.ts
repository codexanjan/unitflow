import { CurrencyRateData } from '../engine/types';

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const POPULAR_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', flag: '🇨🇱' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', flag: '🇨🇴' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
];

const CURRENCY_CACHE_KEY = 'unitflow_currency_rates_cache';
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

// Baseline fallback rates relative to USD if completely offline
const BASELINE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 154.5,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.90,
  CNY: 7.24,
  INR: 83.5,
  SGD: 1.35,
  NZD: 1.64,
  HKD: 7.82,
  SEK: 10.65,
  NOK: 10.75,
  DKK: 6.87,
  KRW: 1375.0,
  BRL: 5.15,
  MXN: 16.95,
  ZAR: 18.4,
  AED: 3.67,
  SAR: 3.75,
  TRY: 32.5,
  PLN: 3.98,
  THB: 36.8,
  IDR: 16200.0,
  MYR: 4.75,
  PHP: 57.5,
  TWD: 32.4,
  ILS: 3.72,
  CLP: 940.0,
  COP: 3900.0,
  EGP: 47.8,
  VND: 25400.0,
  NGN: 1400.0,
};

export async function fetchExchangeRates(): Promise<CurrencyRateData> {
  // Check cached data first
  const cachedRaw = localStorage.getItem(CURRENCY_CACHE_KEY);
  let cachedData: CurrencyRateData | null = null;

  if (cachedRaw) {
    try {
      cachedData = JSON.parse(cachedRaw) as CurrencyRateData;
    } catch {
      // ignore parse error
    }
  }

  // If cached data is fresh (less than CACHE_TTL_MS old) and valid, return it
  if (cachedData && cachedData.rates && Date.now() - (cachedData.cacheTimestamp || 0) < CACHE_TTL_MS) {
    return cachedData;
  }

  // If online, try fetching fresh rates
  if (navigator.onLine) {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD', {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.rates && typeof data.rates === 'object') {
          const freshData: CurrencyRateData = {
            base: data.base_code || 'USD',
            rates: data.rates,
            lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
            cached: false,
            cacheTimestamp: Date.now(),
            source: 'open.er-api.com',
          };
          // Save to cache
          localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify(freshData));
          return freshData;
        }
      }
    } catch (err) {
      console.warn('Live currency fetch failed, falling back to cache:', err);
    }
  }

  // If cache exists, use cache with status
  if (cachedData && cachedData.rates) {
    return {
      ...cachedData,
      cached: true,
    };
  }

  // Final fallback to bundled baseline rates
  return {
    base: 'USD',
    rates: BASELINE_RATES,
    lastUpdated: 'Offline standard baseline',
    cached: true,
    cacheTimestamp: Date.now(),
    source: 'Bundled baseline',
  };
}

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>
): { result: number; rate: number; inverseRate: number } {
  if (!amount || amount === 0) {
    return { result: 0, rate: 1, inverseRate: 1 };
  }

  const fromRate = rates[fromCode] || 1;
  const toRate = rates[toCode] || 1;

  // Since rates are relative to base (USD), fromCode -> USD -> toCode:
  const directRate = toRate / fromRate;
  const inverseRate = fromRate / toRate;
  const result = amount * directRate;

  return {
    result,
    rate: directRate,
    inverseRate,
  };
}
