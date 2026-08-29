import React, { useState, useRef } from 'react';
import {
  History,
  Search,
  Trash2,
  Download,
  Upload,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { useHistory } from '../../context/HistoryContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { getCategoryById } from '../../units';

interface HistoryViewProps {
  onSelectHistoryItem: (categoryId: string, fromUnitId: string, toUnitId: string, value: string) => void;
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectHistoryItem, onToast }) => {
  const {
    history,
    deleteHistoryItem,
    clearHistory,
    exportHistoryJSON,
    exportHistoryCSV,
    importHistoryJSON,
  } = useHistory();

  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredHistory = history.filter(
    (item) =>
      item.categoryName.toLowerCase().includes(query.toLowerCase()) ||
      item.fromUnitName.toLowerCase().includes(query.toLowerCase()) ||
      item.toUnitName.toLowerCase().includes(query.toLowerCase()) ||
      String(item.inputValue).includes(query) ||
      String(item.formattedOutput).includes(query)
  );

  const handleCopy = (item: (typeof history)[0]) => {
    const text = `${item.inputValue} ${item.fromUnitSymbol} = ${item.formattedOutput} ${item.toUnitSymbol}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    onToast(`Copied conversion to clipboard`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importHistoryJSON(content);
        if (success) {
          onToast('History imported successfully!', 'success');
        } else {
          onToast('Failed to import JSON history: invalid format', 'error');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Conversion History ({history.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Privacy-first local logs stored exclusively on your device
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={exportHistoryCSV}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-40"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            CSV
          </button>

          <button
            onClick={exportHistoryJSON}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-40"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
            JSON
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Import JSON history"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all conversion history?')) {
                  clearHistory();
                  onToast('History cleared', 'info');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search Filter */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recent conversions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3 stroke-1" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Recent Conversions
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Your recent calculations will be recorded here automatically.
          </p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          No conversions match your search query &quot;{query}&quot;.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const category = getCategoryById(item.categoryId);
            const isCopied = copiedId === item.id;
            const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    <CategoryIcon name={category?.iconName || 'Ruler'} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">
                        {item.categoryName}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                      <span>{String(item.inputValue)}</span>
                      <span className="text-xs font-normal text-slate-500">{item.fromUnitSymbol}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-indigo-600 dark:text-indigo-400">{item.formattedOutput}</span>
                      <span className="text-xs font-normal text-indigo-500/80">{item.toUnitSymbol}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    title="Copy conversion"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() =>
                      onSelectHistoryItem(
                        item.categoryId,
                        item.fromUnitId,
                        item.toUnitId,
                        String(item.inputValue)
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Reopen
                  </button>

                  <button
                    onClick={() => {
                      deleteHistoryItem(item.id);
                      onToast('Entry removed', 'info');
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
