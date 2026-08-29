import React from 'react';
import { Sparkles, ArrowRight, Grid } from 'lucide-react';

interface LandingHeroProps {
  onStartConverting: () => void;
  onExploreUnits: () => void;
  onSelectQuickPair: (categoryId: string, fromUnitId: string, toUnitId: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartConverting,
  onExploreUnits,
  onSelectQuickPair,
}) => {
  const quickConversions = [
    { label: 'km → mi', categoryId: 'length', from: 'kilometer', to: 'mile' },
    { label: 'kg → lb', categoryId: 'mass', from: 'kilogram', to: 'pound' },
    { label: '°C → °F', categoryId: 'temperature', from: 'celsius', to: 'fahrenheit' },
    { label: 'L → gal', categoryId: 'volume', from: 'liter', to: 'us_gallon' },
    { label: 'MB → GB', categoryId: 'data_storage', from: 'megabyte', to: 'gigabyte' },
    { label: 'bar → psi', categoryId: 'pressure', from: 'bar', to: 'psi' },
  ];

  return (
    <div className="w-full text-center space-y-6 pt-4 pb-6">
      {/* Top pill badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>36+ Categories • 300+ Units • 100% Offline Ready</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
        Convert Anything.{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
          Instantly.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Fast, accurate and privacy-first unit conversion for everyday measurements, science and engineering.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <button
          onClick={onStartConverting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
        >
          <span>Start Converting</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onExploreUnits}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold shadow-sm transition-all"
        >
          <Grid className="w-4 h-4 text-slate-400" />
          <span>Explore Units</span>
        </button>
      </div>

      {/* Popular Quick Conversion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
          Popular:
        </span>
        {quickConversions.map((q) => (
          <button
            key={q.label}
            onClick={() => onSelectQuickPair(q.categoryId, q.from, q.to)}
            className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-xs"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
};
