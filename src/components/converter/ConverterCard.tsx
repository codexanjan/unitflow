import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowUpDown,
  Copy,
  Check,
  Star,
  Share2,
  ChevronDown,
  Search,
  CheckCheck,
  Calculator,
  Grid,
  X,
  Sparkles,
} from 'lucide-react';
import { CategoryDefinition, CategoryGroup } from '../../engine/types';
import { allCategories, getCategoryById } from '../../units';
import { convertUnits } from '../../engine/converter';
import { evaluateExpression } from '../../engine/expressionParser';
import { formatNumber } from '../../engine/formatter';
import { useSettings } from '../../context/SettingsContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useHistory } from '../../context/HistoryContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { FormulaPanel } from './FormulaPanel';
import { MultiUnitTable } from './MultiUnitTable';

interface ConverterCardProps {
  initialCategoryId?: string;
  initialFromUnitId?: string;
  initialToUnitId?: string;
  initialValue?: string;
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({
  initialCategoryId,
  initialFromUnitId,
  initialToUnitId,
  initialValue,
  onToast,
}) => {
  const { formatOptions, autoCopy } = useSettings();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addHistory } = useHistory();

  // Active category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    () => initialCategoryId || 'length'
  );

  const currentCategory: CategoryDefinition = useMemo(() => {
    return getCategoryById(selectedCategoryId) || allCategories[0];
  }, [selectedCategoryId]);

  // Group filter & Category Search
  const [selectedGroup, setSelectedGroup] = useState<string>(() => currentCategory.group || 'All');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  // Active units
  const [fromUnitId, setFromUnitId] = useState<string>(() => {
    if (initialFromUnitId && currentCategory.units.some((u) => u.id === initialFromUnitId)) {
      return initialFromUnitId;
    }
    return currentCategory.units[0]?.id || '';
  });

  const [toUnitId, setToUnitId] = useState<string>(() => {
    if (initialToUnitId && currentCategory.units.some((u) => u.id === initialToUnitId)) {
      return initialToUnitId;
    }
    return currentCategory.units[1]?.id || currentCategory.units[0]?.id || '';
  });

  // Input expression state
  const [rawInput, setRawInput] = useState<string>(() => initialValue || '100');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showFormula, setShowFormula] = useState(true);
  const [showAllUnits, setShowAllUnits] = useState(true);
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedEquation, setCopiedEquation] = useState(false);

  // Dropdown states
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');

  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  // Sync with prop changes if provided
  useEffect(() => {
    if (initialCategoryId && initialCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(initialCategoryId);
      const cat = getCategoryById(initialCategoryId);
      if (cat) {
        setSelectedGroup(cat.group);
        setFromUnitId(initialFromUnitId || cat.units[0]?.id || '');
        setToUnitId(initialToUnitId || cat.units[1]?.id || cat.units[0]?.id || '');
      }
    }
  }, [initialCategoryId, initialFromUnitId, initialToUnitId, selectedCategoryId]);

  useEffect(() => {
    if (initialValue !== undefined && initialValue !== rawInput) {
      setRawInput(initialValue);
    }
  }, [initialValue, rawInput]);

  // When category changes, reset units safely
  const handleCategoryChange = (newCatId: string) => {
    setSelectedCategoryId(newCatId);
    const cat = getCategoryById(newCatId);
    if (cat && cat.units.length > 0) {
      setSelectedGroup(cat.group);
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1]?.id || cat.units[0].id);
    }
    setIsCategoryPickerOpen(false);
  };

  // When group tab is clicked, filter AND auto-select the first category of that group if needed
  const handleGroupChange = (grp: 'All' | CategoryGroup) => {
    setSelectedGroup(grp);
    if (grp !== 'All' && currentCategory.group !== grp) {
      const firstInGroup = allCategories.find((c) => c.group === grp);
      if (firstInGroup) {
        handleCategoryChange(firstInGroup.id);
      }
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(e.target as Node)) {
        setIsFromOpen(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(e.target as Node)) {
        setIsToOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fromUnit = useMemo(() => {
    return currentCategory.units.find((u) => u.id === fromUnitId) || currentCategory.units[0];
  }, [currentCategory, fromUnitId]);

  const toUnit = useMemo(() => {
    return currentCategory.units.find((u) => u.id === toUnitId) || currentCategory.units[1] || currentCategory.units[0];
  }, [currentCategory, toUnitId]);

  // Expression evaluation
  const evaluatedInput = useMemo(() => {
    if (currentCategory.id === 'numeral_systems' && fromUnit.id !== 'decimal') {
      return { success: true, value: rawInput, isExpression: false };
    }
    return evaluateExpression(rawInput);
  }, [rawInput, currentCategory.id, fromUnit.id]);

  // Conversion calculation
  const conversionResult = useMemo(() => {
    if (!evaluatedInput.success || evaluatedInput.value === undefined) {
      return null;
    }
    try {
      return convertUnits(evaluatedInput.value, fromUnit, toUnit, formatOptions);
    } catch (err) {
      console.warn('Conversion error:', err);
      return null;
    }
  }, [evaluatedInput, fromUnit, toUnit, formatOptions]);

  // Record history (debounced)
  useEffect(() => {
    if (!conversionResult || rawInput.trim() === '') return;

    const timer = setTimeout(() => {
      addHistory({
        categoryId: currentCategory.id,
        categoryName: currentCategory.name,
        fromUnitId: fromUnit.id,
        fromUnitName: fromUnit.name,
        fromUnitSymbol: fromUnit.symbol,
        toUnitId: toUnit.id,
        toUnitName: toUnit.name,
        toUnitSymbol: toUnit.symbol,
        inputValue: rawInput,
        outputValue: conversionResult.output,
        formattedOutput: conversionResult.formattedOutput,
      });

      if (autoCopy && conversionResult.formattedOutput) {
        navigator.clipboard.writeText(conversionResult.formattedOutput).catch(() => {});
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [conversionResult, currentCategory, fromUnit, toUnit, rawInput, addHistory, autoCopy]);

  // Swap units handler
  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);

    const prevFrom = fromUnitId;
    const prevTo = toUnitId;
    setFromUnitId(prevTo);
    setToUnitId(prevFrom);

    if (conversionResult && typeof conversionResult.output === 'number' && Number.isFinite(conversionResult.output)) {
      setRawInput(String(conversionResult.output));
    }
  };

  // Copy actions
  const handleCopyResult = () => {
    if (!conversionResult) return;
    navigator.clipboard.writeText(conversionResult.formattedOutput);
    setCopiedResult(true);
    onToast(`Copied ${conversionResult.formattedOutput} to clipboard!`, 'success');
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const handleCopyFullStatement = () => {
    if (!conversionResult) return;
    const text = `${rawInput} ${fromUnit.symbol} = ${conversionResult.formattedOutput} ${toUnit.symbol}`;
    navigator.clipboard.writeText(text);
    onToast(`Copied conversion statement!`, 'success');
  };

  const handleShare = async () => {
    if (!conversionResult) return;
    const shareText = `${rawInput} ${fromUnit.name} (${fromUnit.symbol}) = ${conversionResult.formattedOutput} ${toUnit.name} (${toUnit.symbol}) — converted with UNITFLOW`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'UNITFLOW Conversion',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareText);
    onToast('Conversion copied to clipboard for sharing!', 'info');
  };

  const isCurrentFavorite = isFavorite(currentCategory.id, fromUnit.id, toUnit.id);

  // Group definitions
  const groups: ('All' | CategoryGroup)[] = [
    'All',
    'Basic',
    'Physics & Engineering',
    'Electrical',
    'Data',
    'Light & Sound',
    'Specialized',
  ];

  // Filtered categories
  const visibleCategories = useMemo(() => {
    return allCategories.filter((cat) => {
      const matchGroup = selectedGroup === 'All' || cat.group === selectedGroup;
      const matchSearch =
        categorySearch === '' ||
        cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
        cat.units.some(
          (u) =>
            u.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
            u.symbol.toLowerCase().includes(categorySearch.toLowerCase())
        );
      return matchGroup && matchSearch;
    });
  }, [selectedGroup, categorySearch]);

  // Filtered unit options for dropdowns
  const filteredFromUnits = currentCategory.units.filter(
    (u) =>
      u.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
      u.symbol.toLowerCase().includes(fromSearch.toLowerCase()) ||
      u.aliases.some((a) => a.toLowerCase().includes(fromSearch.toLowerCase()))
  );

  const filteredToUnits = currentCategory.units.filter(
    (u) =>
      u.name.toLowerCase().includes(toSearch.toLowerCase()) ||
      u.symbol.toLowerCase().includes(toSearch.toLowerCase()) ||
      u.aliases.some((a) => a.toLowerCase().includes(toSearch.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6">
      {/* Category Section: Group Tabs & Category Grid */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top Control Bar: Group Tabs + Search + Browse All Modal */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          {/* Group Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {groups.map((grp) => {
              const isActive = selectedGroup === grp;
              const count = grp === 'All' ? allCategories.length : allCategories.filter((c) => c.group === grp).length;
              return (
                <button
                  key={grp}
                  onClick={() => handleGroupChange(grp)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 ring-2 ring-indigo-400/40'
                      : 'bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{grp}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search input + Browse All Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search 35+ categories..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 shadow-xs"
              />
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCategoryPickerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0 cursor-pointer shadow-xs"
              title="Open full category visual grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All ({allCategories.length})</span>
            </button>
          </div>
        </div>

        {/* Categories Flex Wrap Container (Fully Visible, No Hidden Overflow) */}
        <div className="flex flex-wrap items-center gap-2">
          {visibleCategories.map((cat) => {
            const isActive = cat.id === currentCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/50 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <CategoryIcon name={cat.iconName} className="w-4 h-4 shrink-0" />
                <span className="whitespace-normal text-left">{cat.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.units.length}
                </span>
              </button>
            );
          })}
          {visibleCategories.length === 0 && (
            <div className="w-full text-center py-4 text-xs text-slate-400">
              No categories found matching "{categorySearch}".{' '}
              <button
                onClick={() => {
                  setCategorySearch('');
                  setSelectedGroup('All');
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold underline ml-1"
              >
                Reset filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Converter Card */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        {/* Card Header: Category info and quick presets */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <CategoryIcon name={currentCategory.iconName} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {currentCategory.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {currentCategory.group}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {currentCategory.description}
              </p>
            </div>
          </div>

          {/* Quick preset unit pairs */}
          {currentCategory.popularPairs && currentCategory.popularPairs.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">
                Presets:
              </span>
              {currentCategory.popularPairs.map(([fromId, toId]) => {
                const uFrom = currentCategory.units.find((u) => u.id === fromId);
                const uTo = currentCategory.units.find((u) => u.id === toId);
                if (!uFrom || !uTo) return null;
                const isSelected = fromUnit.id === fromId && toUnit.id === toId;

                return (
                  <button
                    key={`${fromId}-${toId}`}
                    onClick={() => {
                      setFromUnitId(fromId);
                      setToUnitId(toId);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                    }`}
                  >
                    {uFrom.symbol} → {uTo.symbol}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Converter Conversion Inputs Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
          {/* FROM BOX */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              <span>From</span>
              {evaluatedInput.isExpression && (
                <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 normal-case font-mono bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                  <Calculator className="w-3 h-3" />
                  = {formatNumber(evaluatedInput.value || 0, { mode: 'auto' })}
                </span>
              )}
            </div>

            {/* Input field */}
            <div className="relative rounded-2xl border-2 border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 bg-slate-50/50 dark:bg-slate-950/50 transition-all">
              <input
                type="text"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Enter value or math expression (e.g. 50 + 25)..."
                className="w-full px-4 pt-3 pb-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-slate-100 bg-transparent outline-none"
              />
              <div className="px-4 pb-2 text-xs text-slate-400 flex items-center justify-between">
                <span>{fromUnit.name}</span>
                {rawInput && (
                  <button
                    onClick={() => setRawInput('')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* From Unit Dropdown Selector */}
            <div className="relative" ref={fromDropdownRef}>
              <button
                onClick={() => {
                  setIsFromOpen(!isFromOpen);
                  setIsToOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                    {fromUnit.name}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold shrink-0">
                    {fromUnit.symbol}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isFromOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover list */}
              {isFromOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 max-h-72 flex flex-col">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={fromSearch}
                      onChange={(e) => setFromSearch(e.target.value)}
                      placeholder="Search unit name or symbol..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto space-y-1">
                    {filteredFromUnits.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => {
                          setFromUnitId(unit.id);
                          setIsFromOpen(false);
                          setFromSearch('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                          unit.id === fromUnit.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{unit.name}</span>
                        <span className="font-mono text-xs text-slate-400 shrink-0 ml-2">{unit.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SWAP BUTTON (Middle) */}
          <div className="lg:col-span-1 flex items-center justify-center py-2">
            <button
              onClick={handleSwap}
              className={`p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 shadow-sm transition-all duration-300 cursor-pointer ${
                isSwapping ? 'rotate-180 scale-110' : 'hover:scale-105'
              }`}
              title="Swap units"
              aria-label="Swap units"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>

          {/* TO BOX */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              <span>To</span>
              <span className="text-[11px] text-slate-400 font-normal normal-case">
                {formatOptions.mode === 'auto' ? 'Auto precision' : `${formatOptions.mode} formatting`}
              </span>
            </div>

            {/* Result display field */}
            <div className="relative rounded-2xl border-2 border-indigo-500/40 bg-indigo-50/20 dark:bg-indigo-950/20 px-4 pt-3 pb-2 transition-all">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 truncate select-all">
                {conversionResult ? conversionResult.formattedOutput : '—'}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{toUnit.name}</span>
                <span className="font-mono font-bold text-indigo-500">{toUnit.symbol}</span>
              </div>
            </div>

            {/* To Unit Dropdown Selector */}
            <div className="relative" ref={toDropdownRef}>
              <button
                onClick={() => {
                  setIsToOpen(!isToOpen);
                  setIsFromOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                    {toUnit.name}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold shrink-0">
                    {toUnit.symbol}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isToOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover list */}
              {isToOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 max-h-72 flex flex-col">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={toSearch}
                      onChange={(e) => setToSearch(e.target.value)}
                      placeholder="Search unit name or symbol..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto space-y-1">
                    {filteredToUnits.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => {
                          setToUnitId(unit.id);
                          setIsToOpen(false);
                          setToSearch('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                          unit.id === toUnit.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{unit.name}</span>
                        <span className="font-mono text-xs text-slate-400 shrink-0 ml-2">{unit.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar Footer (Copy, Share, Favorite, Reset) */}
        <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyResult}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              {copiedResult ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedResult ? 'Copied' : 'Copy Result'}
            </button>

            <button
              onClick={handleCopyFullStatement}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Copy Equation
            </button>

            <button
              onClick={() => toggleFavorite(currentCategory.id, fromUnit.id, toUnit.id, `${fromUnit.symbol} → ${toUnit.symbol}`)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors shadow-sm cursor-pointer ${
                isCurrentFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
              {isCurrentFavorite ? 'Favorited' : 'Favorite'}
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFormula(!showFormula)}
              className={`text-xs font-semibold transition-colors cursor-pointer ${
                showFormula ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {showFormula ? 'Hide Formula' : 'Show Formula'}
            </button>

            <button
              onClick={() => setShowAllUnits(!showAllUnits)}
              className={`text-xs font-semibold transition-colors cursor-pointer ${
                showAllUnits ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {showAllUnits ? 'Hide All Units' : 'Show All Units'}
            </button>
          </div>
        </div>
      </div>

      {/* Formula & Step-by-Step Derivation Panel */}
      {showFormula && conversionResult && (
        <FormulaPanel
          explanation={conversionResult.explanation}
          fromUnit={fromUnit}
          toUnit={toUnit}
          copiedEquation={copiedEquation}
          onCopy={(text) => {
            navigator.clipboard.writeText(text);
            setCopiedEquation(true);
            onToast('Formula copied!', 'success');
            setTimeout(() => setCopiedEquation(false), 2000);
          }}
        />
      )}

      {/* Multi-Unit Convert-to-All Table */}
      {showAllUnits && (
        <MultiUnitTable
          inputValue={evaluatedInput.value !== undefined ? evaluatedInput.value : rawInput}
          fromUnit={fromUnit}
          category={currentCategory}
          formatOptions={formatOptions}
          onSelectToUnit={(id) => setToUnitId(id)}
          onCopy={(_text, label) => onToast(`Copied ${label}!`, 'success')}
        />
      )}

      {/* Full Visual Category Picker Modal */}
      {isCategoryPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    All Categories ({allCategories.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select any category to convert instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryPickerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Group Filter */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-50/50 dark:bg-slate-950/30">
              {groups.map((grp) => (
                <button
                  key={grp}
                  onClick={() => handleGroupChange(grp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedGroup === grp
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>

            {/* Modal Grid of Categories */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {visibleCategories.map((cat) => {
                const isActive = cat.id === currentCategory.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm ring-2 ring-indigo-400/40'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between mt-0.5">
                        <span className="truncate">{cat.group}</span>
                        <span className="font-mono font-medium ml-1 shrink-0">{cat.units.length} units</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
