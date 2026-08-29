import React, { useState } from 'react';
import { Copy, Check, Search, ArrowRightLeft, Sparkles } from 'lucide-react';
import { CategoryDefinition, FormatOptions, UnitDefinition } from '../../engine/types';
import { convertToAllUnits } from '../../engine/converter';

interface MultiUnitTableProps {
  inputValue: number | string;
  fromUnit: UnitDefinition;
  category: CategoryDefinition;
  formatOptions: FormatOptions;
  onSelectToUnit: (unitId: string) => void;
  onCopy: (text: string, label: string) => void;
}

export const MultiUnitTable: React.FC<MultiUnitTableProps> = ({
  inputValue,
  fromUnit,
  category,
  formatOptions,
  onSelectToUnit,
  onCopy,
}) => {
  const [filter, setFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allConversions = convertToAllUnits(inputValue, fromUnit, category, formatOptions);

  const filtered = allConversions.filter(
    (item) =>
      item.unit.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.unit.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      item.unit.aliases.some((a) => a.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleCopyRow = (item: (typeof allConversions)[0]) => {
    const textToCopy = `${item.formatted} ${item.unit.symbol}`;
    onCopy(textToCopy, `${item.unit.name} result`);
    setCopiedId(item.unit.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Convert to All Units in {category.name}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant comparison for {String(inputValue)} {fromUnit.symbol} across {category.units.length} units
          </p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter units..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table / Grid */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {filtered.map((item) => {
          const isCopied = copiedId === item.unit.id;

          return (
            <div
              key={item.unit.id}
              className={`flex items-center justify-between px-4 py-3 sm:px-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group ${
                item.isSource ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
              }`}
            >
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {item.unit.name}
                  </span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.unit.symbol}
                  </span>
                  {item.isSource && (
                    <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded">
                      Source
                    </span>
                  )}
                  {item.unit.system && (
                    <span className="hidden md:inline-block text-[10px] uppercase font-medium text-slate-400">
                      {item.unit.system}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 select-all">
                  {item.formatted}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyRow(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title={`Copy ${item.formatted} ${item.unit.symbol}`}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {!item.isSource && (
                    <button
                      onClick={() => onSelectToUnit(item.unit.id)}
                      className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                      title="Set as target unit"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
