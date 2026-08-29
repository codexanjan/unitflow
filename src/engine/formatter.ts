import { FormatOptions, ThousandsSeparator } from './types';

export const DEFAULT_FORMAT_OPTIONS: FormatOptions = {
  mode: 'auto',
  decimals: 4,
  significantFigures: 6,
  thousandsSeparator: 'comma',
  notation: 'standard',
};

/**
 * Applies thousands separator to integer portion
 */
function applyThousandsSeparator(integerStr: string, separator: ThousandsSeparator): string {
  if (separator === 'none') return integerStr;

  const sepChar = separator === 'comma' ? ',' : separator === 'space' ? ' ' : '.';

  // Handle negative sign
  const isNegative = integerStr.startsWith('-');
  const rawInt = isNegative ? integerStr.slice(1) : integerStr;

  const formatted = rawInt.replace(/\B(?=(\d{3})+(?!\d))/g, sepChar);
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format a number to engineering notation (exponent is multiple of 3)
 */
function toEngineeringNotation(val: number, precision: number = 4): string {
  if (val === 0) return '0';

  const isNeg = val < 0;
  const absVal = Math.abs(val);

  const exp = Math.floor(Math.log10(absVal));
  const engExp = Math.floor(exp / 3) * 3;
  const mantissa = absVal / Math.pow(10, engExp);

  // Round mantissa to precision
  const roundedMantissa = Number(mantissa.toPrecision(Math.max(1, precision)));
  const sign = isNeg ? '-' : '';

  if (engExp === 0) {
    return `${sign}${roundedMantissa}`;
  }

  return `${sign}${roundedMantissa} × 10${toSuperscript(engExp)}`;
}

/**
 * Converts numbers to unicode superscript (e.g. -3 -> ⁻³)
 */
export function toSuperscript(num: number): string {
  const supers: Record<string, string> = {
    '-': '⁻',
    '+': '⁺',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  };
  return num
    .toString()
    .split('')
    .map((c) => supers[c] || c)
    .join('');
}

/**
 * Main number formatting function
 */
export function formatNumber(
  value: number | string,
  options: Partial<FormatOptions> = {}
): string {
  if (typeof value === 'string') {
    // If it's a non-numeric string (e.g., Roman numerals, hex with prefix), return directly
    if (isNaN(Number(value)) || value.trim() === '') {
      return value;
    }
    // If it is numeric string, parse it
    value = Number(value);
  }

  if (Number.isNaN(value)) return 'Invalid value';
  if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';

  const opts: FormatOptions = { ...DEFAULT_FORMAT_OPTIONS, ...options };

  // Check special notations first
  if (opts.notation === 'engineering') {
    return toEngineeringNotation(value, opts.mode === 'sigfigs' ? opts.significantFigures : 4);
  }

  if (opts.notation === 'scientific') {
    if (value === 0) return '0';
    const sig = opts.mode === 'sigfigs' ? opts.significantFigures : 5;
    const expStr = value.toExponential(sig - 1);
    const [mantissa, expPart] = expStr.split('e');
    const expVal = parseInt(expPart, 10);
    return `${parseFloat(mantissa)} × 10${toSuperscript(expVal)}`;
  }

  let formattedNumStr: string;

  if (opts.mode === 'fixed') {
    formattedNumStr = value.toFixed(opts.decimals);
  } else if (opts.mode === 'sigfigs') {
    formattedNumStr = Number(value.toPrecision(opts.significantFigures)).toString();
  } else {
    // 'auto' mode
    const abs = Math.abs(value);
    if (abs === 0) {
      formattedNumStr = '0';
    } else if (abs >= 1e12 || (abs < 1e-6 && abs > 0)) {
      // Use scientific for extreme ranges
      const expStr = value.toExponential(6);
      const [mantissa, expPart] = expStr.split('e');
      const expVal = parseInt(expPart, 10);
      return `${parseFloat(mantissa)} × 10${toSuperscript(expVal)}`;
    } else {
      // Round to at most 10 decimal digits, stripping trailing zeros
      const rounded = Number(Math.round(Number(value + 'e+10')) + 'e-10');
      // If float representation still has tiny precision artifacts
      formattedNumStr = parseFloat(rounded.toFixed(10)).toString();
    }
  }

  // Handle separator insertion
  if (formattedNumStr.includes('e') || formattedNumStr.includes('E')) {
    return formattedNumStr;
  }

  const parts = formattedNumStr.split('.');
  const intPart = applyThousandsSeparator(parts[0], opts.thousandsSeparator);

  if (parts.length > 1) {
    const decimalSep = opts.thousandsSeparator === 'dot' ? ',' : '.';
    return `${intPart}${decimalSep}${parts[1]}`;
  }

  return intPart;
}
