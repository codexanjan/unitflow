import React, { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Search,
  Globe,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  POPULAR_CURRENCIES,
  fetchExchangeRates,
  convertCurrency,
} from '../../services/currency';
import { CurrencyRateData } from '../../engine/types';
import { formatNumber } from '../../engine/formatter';
import { evaluateExpression } from '../../engine/expressionParser';

interface CurrencyConverterProps {
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onToast }) => {
  const [ratesData, setRatesData] = useState<CurrencyRateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [amountInput, setAmountInput] = useState('100');
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('EUR');
  const [isSwapping, setIsSwapping] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [tableFilter, setTableFilter] = useState('');

  // Load exchange rates
  const loadRates = async () => {
    setLoading(true);
    try {
      const data = await fetchExchangeRates();
      setRatesData(data);
    } catch (err) {
      console.error('Failed to load currency rates:', err);
      onToast('Failed to fetch latest currency rates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  // Expression evaluation for amount
  const evaluatedAmount = evaluateExpression(amountInput);
  const amountNumber = evaluatedAmount.success && evaluatedAmount.value !== undefined ? evaluatedAmount.value : 0;

  const calculation = ratesData
    ? convertCurrency(amountNumber, fromCode, toCode, ratesData.rates)
    : { result: 0, rate: 1, inverseRate: 1 };

  const fromInfo = POPULAR_CURRENCIES.find((c) => c.code === fromCode) || {
    code: fromCode,
    name: fromCode,
    symbol: fromCode,
    flag: '🌐',
  };

  const toInfo = POPULAR_CURRENCIES.find((c) => c.code === toCode) || {
    code: toCode,
    name: toCode,
    symbol: toCode,
    flag: '🌐',
  };

  const handleCopy = () => {
    const text = `${formatNumber(amountNumber, { mode: 'auto' })} ${fromCode} = ${formatNumber(calculation.result, { decimals: 2, mode: 'fixed' })} ${toCode}`;
    navigator.clipboard.writeText(text);
    setCopiedResult(true);
    onToast(`Copied ${text}`, 'success');
    setTimeout(() => setCopiedResult(false), 2000);
  };

  // Build combined list of all currency codes
  const allCurrencyCodes = ratesData
    ? Array.from(new Set([...POPULAR_CURRENCIES.map((c) => c.code), ...Object.keys(ratesData.rates)]))
    : POPULAR_CURRENCIES.map((c) => c.code);

  const filteredComparisonCurrencies = POPULAR_CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(tableFilter.toLowerCase()) ||
      c.name.toLowerCase().includes(tableFilter.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Header Info & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Live Currency Exchange
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              {ratesData?.cached ? (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <WifiOff className="w-3.5 h-3.5" />
                  Cached Rates (Offline / Fallback mode)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <Wifi className="w-3.5 h-3.5" />
                  Live Market Rates
                </span>
              )}
              {ratesData && (
                <span className="text-[11px] text-slate-400">
                  • Updated {ratesData.lastUpdated.slice(0, 16)}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={loadRates}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Rates'}
        </button>
      </div>

      {/* Main Currency Conversion Card */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
          {/* FROM AMOUNT & CURRENCY */}
          <div className="lg:col-span-5 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Amount ({fromInfo.name})
            </label>

            <div className="relative rounded-2xl border-2 border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 bg-slate-50/50 dark:bg-slate-950/50 transition-all">
              <input
                type="text"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="Enter amount..."
                className="w-full px-4 pt-3 pb-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-slate-100 bg-transparent outline-none"
              />
              <div className="px-4 pb-2 text-xs text-slate-400 flex items-center justify-between">
                <span>{fromInfo.name}</span>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                  {fromInfo.symbol}
                </span>
              </div>
            </div>

            {/* From currency select */}
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
            >
              {allCurrencyCodes.map((code) => {
                const info = POPULAR_CURRENCIES.find((c) => c.code === code);
                return (
                  <option key={code} value={code}>
                    {info ? `${info.flag} ${info.code} — ${info.name}` : `${code}`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div className="lg:col-span-1 flex items-center justify-center py-2">
            <button
              onClick={handleSwap}
              className={`p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 shadow-sm transition-all duration-300 ${
                isSwapping ? 'rotate-180 scale-110' : 'hover:scale-105'
              }`}
              title="Swap currencies"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>

          {/* TO CONVERTED AMOUNT & CURRENCY */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              <span>Converted To ({toInfo.name})</span>
              <span className="text-[11px] text-slate-400 font-normal normal-case">
                1 {fromCode} = {formatNumber(calculation.rate, { decimals: 4, mode: 'fixed' })} {toCode}
              </span>
            </div>

            <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 px-4 pt-3 pb-2 transition-all">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate select-all">
                {formatNumber(calculation.result, { decimals: 2, mode: 'fixed' })}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{toInfo.name}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {toInfo.symbol}
                </span>
              </div>
            </div>

            {/* To currency select */}
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
            >
              {allCurrencyCodes.map((code) => {
                const info = POPULAR_CURRENCIES.find((c) => c.code === code);
                return (
                  <option key={code} value={code}>
                    {info ? `${info.flag} ${info.code} — ${info.name}` : `${code}`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Action bar and rate info */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            <div>
              1 {fromCode} = <span className="font-bold text-slate-900 dark:text-slate-100">{formatNumber(calculation.rate, { decimals: 4, mode: 'fixed' })}</span> {toCode}
            </div>
            <div className="text-[11px] text-slate-400">
              1 {toCode} = {formatNumber(calculation.inverseRate, { decimals: 4, mode: 'fixed' })} {fromCode}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
          >
            {copiedResult ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedResult ? 'Copied' : 'Copy Conversion'}
          </button>
        </div>
      </div>

      {/* Multi-Currency Exchange Comparison Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              Convert {formatNumber(amountNumber, { mode: 'auto' })} {fromCode} to Major World Currencies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live calculated exchange rates based on current market data
            </p>
          </div>

          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              placeholder="Search currency..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredComparisonCurrencies.map((c) => {
            const isSelected = c.code === fromCode;
            const conv = ratesData ? convertCurrency(amountNumber, fromCode, c.code, ratesData.rates) : { result: 0, rate: 1 };

            return (
              <div
                key={c.code}
                className={`flex items-center justify-between px-4 py-3 sm:px-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                  isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl select-none">{c.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {c.code}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {c.name}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      1 {fromCode} = {formatNumber(conv.rate, { decimals: 4, mode: 'fixed' })} {c.code}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 select-all">
                    {c.symbol} {formatNumber(conv.result, { decimals: 2, mode: 'fixed' })}
                  </div>
                  <button
                    onClick={() => setToCode(c.code)}
                    className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Select as target
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
