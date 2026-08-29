import React from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { FormulaExplanation, UnitDefinition } from '../../engine/types';

interface FormulaPanelProps {
  explanation: FormulaExplanation;
  fromUnit?: UnitDefinition;
  toUnit?: UnitDefinition;
  onCopy: (text: string, label: string) => void;
  copiedEquation: boolean;
}

export const FormulaPanel: React.FC<FormulaPanelProps> = ({
  explanation,
  onCopy,
  copiedEquation,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          Formula & Step-by-Step Derivation
        </div>
        <button
          onClick={() => onCopy(explanation.formula, 'Formula')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Copy formula equation"
        >
          {copiedEquation ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Equation</span>
            </>
          )}
        </button>
      </div>

      {/* Main formula display box */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm font-mono text-sm sm:text-base text-slate-900 dark:text-indigo-200 flex items-center justify-between overflow-x-auto">
        <div className="font-semibold">{explanation.formula}</div>
        <div className="hidden sm:block text-xs font-sans text-slate-400 dark:text-slate-500 pl-4 shrink-0">
          {explanation.unitRatioText}
        </div>
      </div>

      {/* Step by step list */}
      <div className="mt-3 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        {explanation.steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-indigo-500 font-mono select-none font-bold mt-0.5">•</span>
            <span className="leading-relaxed font-mono">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
