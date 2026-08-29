import React from 'react';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  RotateCcw,
  Sliders,
  Database,
} from 'lucide-react';
import { useSettings, ThemeMode } from '../../context/SettingsContext';
import { allCategories } from '../../units';
import { PrecisionMode, ThousandsSeparator, NotationMode } from '../../engine/types';

interface SettingsViewProps {
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onToast }) => {
  const {
    theme,
    setTheme,
    formatOptions,
    setFormatOptions,
    defaultCategory,
    setDefaultCategory,
    autoCopy,
    setAutoCopy,
    resetSettings,
  } = useSettings();

  const handlePrecisionModeChange = (mode: PrecisionMode) => {
    setFormatOptions((prev) => ({ ...prev, mode }));
    onToast(`Precision mode set to ${mode}`, 'info');
  };

  const handleDecimalsChange = (decimals: number) => {
    setFormatOptions((prev) => ({ ...prev, decimals }));
  };

  const handleSigFigsChange = (significantFigures: number) => {
    setFormatOptions((prev) => ({ ...prev, significantFigures }));
  };

  const handleSeparatorChange = (thousandsSeparator: ThousandsSeparator) => {
    setFormatOptions((prev) => ({ ...prev, thousandsSeparator }));
    onToast(`Thousands separator set to ${thousandsSeparator}`, 'info');
  };

  const handleNotationChange = (notation: NotationMode) => {
    setFormatOptions((prev) => ({ ...prev, notation }));
    onToast(`Notation style set to ${notation}`, 'info');
  };

  return (
    <div className="w-full space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Preferences & Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize precision, notation, themes, and application behaviors
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all settings to default configuration?')) {
              resetSettings();
              onToast('Settings reset to defaults', 'info');
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* SECTION 1: APPEARANCE */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <Sun className="w-4 h-4 text-amber-500" />
          Appearance & Theme
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Laptop },
          ].map((item) => {
            const isSelected = theme === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTheme(item.id as ThemeMode);
                  onToast(`Theme set to ${item.label}`, 'info');
                }}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2.5 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs sm:text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: NUMBER FORMATTING & PRECISION */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <Sliders className="w-4 h-4 text-indigo-500" />
          Number Format & Display Precision
        </div>

        {/* Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Precision Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'auto', title: 'Auto Precision', desc: 'Optimal smart digits' },
              { id: 'fixed', title: 'Fixed Decimals', desc: 'Exact decimal count' },
              { id: 'sigfigs', title: 'Significant Figures', desc: 'Scientific sig digits' },
            ].map((m) => {
              const isSelected = formatOptions.mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handlePrecisionModeChange(m.id as PrecisionMode)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold">{m.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fixed Decimals Slider (if fixed) */}
        {formatOptions.mode === 'fixed' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Decimal Places</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {formatOptions.decimals} decimals
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={formatOptions.decimals}
              onChange={(e) => handleDecimalsChange(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Integers)</span>
              <span>4</span>
              <span>8</span>
              <span>12</span>
            </div>
          </div>
        )}

        {/* Sig Figs Slider (if sigfigs) */}
        {formatOptions.mode === 'sigfigs' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Significant Digits</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {formatOptions.significantFigures} digits
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={formatOptions.significantFigures}
              onChange={(e) => handleSigFigsChange(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1</span>
              <span>6</span>
              <span>10</span>
              <span>15</span>
            </div>
          </div>
        )}

        {/* Thousands Separators */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Thousands Separator
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'comma', label: 'Comma (1,234.56)' },
              { id: 'space', label: 'Space (1 234.56)' },
              { id: 'dot', label: 'Dot (1.234,56)' },
              { id: 'none', label: 'None (1234.56)' },
            ].map((s) => {
              const isSelected = formatOptions.thousandsSeparator === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSeparatorChange(s.id as ThousandsSeparator)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notation Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Notation Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'standard', label: 'Standard', example: '12,345.67' },
              { id: 'scientific', label: 'Scientific', example: '1.2345 × 10⁴' },
              { id: 'engineering', label: 'Engineering', example: '12.345 × 10³' },
            ].map((n) => {
              const isSelected = formatOptions.notation === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNotationChange(n.id as NotationMode)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="text-xs font-bold">{n.label}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{n.example}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: BEHAVIOR & DEFAULTS */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <Database className="w-4 h-4 text-emerald-500" />
          Application Behaviors & Defaults
        </div>

        {/* Default Category */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Default Category on Startup
            </div>
            <div className="text-xs text-slate-400">
              Select which category loads when opening the application
            </div>
          </div>
          <select
            value={defaultCategory}
            onChange={(e) => {
              setDefaultCategory(e.target.value);
              onToast(`Default category set to ${e.target.value}`, 'info');
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
          >
            {allCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Auto-copy toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Auto-Copy Result to Clipboard
            </div>
            <div className="text-xs text-slate-400">
              Automatically copy calculated results upon computation
            </div>
          </div>
          <button
            onClick={() => {
              setAutoCopy(!autoCopy);
              onToast(`Auto-copy ${!autoCopy ? 'enabled' : 'disabled'}`, 'info');
            }}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              autoCopy ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                autoCopy ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
