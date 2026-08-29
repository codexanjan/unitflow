import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Hash } from 'lucide-react';
import { searchUnitsGlobally, allCategories } from '../../units';
import { CategoryIcon } from '../common/CategoryIcon';
import { convertUnits } from '../../engine/converter';
import { evaluateExpression } from '../../engine/expressionParser';
import { formatNumber } from '../../engine/formatter';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit: (categoryId: string, fromUnitId: string, toUnitId?: string, initialValue?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUnit,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global hotkey Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Check for natural language conversion query (e.g. "100 km to mi", "50 celsius in fahrenheit")
  const parseNaturalLanguage = () => {
    const match = query.match(/^([0-9+\-*/().\s]+)\s+([a-zA-Z°µ/0-9²³]+)\s+(?:to|in|into|->)\s+([a-zA-Z°µ/0-9²³]+)$/i);
    if (!match) return null;

    const [, rawVal, fromStr, toStr] = match;
    const parsedVal = evaluateExpression(rawVal);
    if (!parsedVal.success || parsedVal.value === undefined) return null;

    // Search units
    const fromResults = searchUnitsGlobally(fromStr.trim());
    const toResults = searchUnitsGlobally(toStr.trim());

    if (fromResults.length === 0 || toResults.length === 0) return null;

    // Find category intersection
    for (const f of fromResults) {
      const matchingTo = toResults.find((t) => t.category.id === f.category.id);
      if (matchingTo) {
        const conv = convertUnits(parsedVal.value, f.unit, matchingTo.unit);
        return {
          categoryId: f.category.id,
          categoryName: f.category.name,
          iconName: f.category.iconName,
          fromUnit: f.unit,
          toUnit: matchingTo.unit,
          inputValue: parsedVal.value,
          formattedOutput: conv.formattedOutput,
        };
      }
    }
    return null;
  };

  const naturalConversion = parseNaturalLanguage();
  const searchResults = searchUnitsGlobally(query).slice(0, 10);

  const handleSelect = (categoryId: string, fromUnitId: string, toUnitId?: string, initialValue?: string) => {
    onSelectUnit(categoryId, fromUnitId, toUnitId, initialValue);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (naturalConversion) {
        handleSelect(
          naturalConversion.categoryId,
          naturalConversion.fromUnit.id,
          naturalConversion.toUnit.id,
          String(naturalConversion.inputValue)
        );
      } else if (searchResults[selectedIndex]) {
        const res = searchResults[selectedIndex];
        handleSelect(res.category.id, res.unit.id);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search units, symbols, or type '100 km to mi'..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none text-base sm:text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Live Natural Language Conversion Quick-Card */}
        {naturalConversion && (
          <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Instant Smart Conversion
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {naturalConversion.categoryName}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                <span>
                  {formatNumber(naturalConversion.inputValue, { mode: 'auto' })}{' '}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    {naturalConversion.fromUnit.symbol}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400">
                  {naturalConversion.formattedOutput}{' '}
                  <span className="text-sm font-normal text-indigo-500/80">
                    {naturalConversion.toUnit.symbol}
                  </span>
                </span>
              </div>
              <button
                onClick={() =>
                  handleSelect(
                    naturalConversion.categoryId,
                    naturalConversion.fromUnit.id,
                    naturalConversion.toUnit.id,
                    String(naturalConversion.inputValue)
                  )
                }
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Open in Converter
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {query.trim() === '' ? (
            <div className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-2">
                Popular Categories
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allCategories.slice(0, 9).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.id, cat.units[0].id)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {cat.name}
                      </div>
                      <div className="text-xs text-slate-400">{cat.units.length} units</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((res, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={`${res.category.id}-${res.unit.id}`}
                  onClick={() => handleSelect(res.category.id, res.unit.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <CategoryIcon name={res.category.iconName} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{res.unit.name}</span>
                        <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                          {res.unit.symbol}
                        </span>
                        {res.unit.system && (
                          <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {res.unit.system}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {res.category.name} • {res.unit.aliases.slice(0, 3).join(', ')}
                      </div>
                    </div>
                  </div>
                  <kbd className="hidden sm:flex items-center text-xs font-mono text-slate-400">
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </kbd>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <Hash className="w-8 h-8 mx-auto mb-2 text-slate-400 stroke-1" />
              <div className="text-sm font-medium">No matching units found</div>
              <div className="text-xs text-slate-400 mt-1">
                Try searching by abbreviation, symbol (e.g. &quot;km&quot;, &quot;°F&quot;, &quot;psi&quot;), or full name.
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200/70 dark:bg-slate-800 rounded font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-200/70 dark:bg-slate-800 rounded font-mono">↓</kbd> Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200/70 dark:bg-slate-800 rounded font-mono">↵</kbd> Select
            </span>
          </div>
          <div className="text-[11px] font-medium text-slate-400">
            36+ Categories • 300+ Units
          </div>
        </div>
      </div>
    </div>
  );
};
