import React from 'react';
import { Cpu, WifiOff, Code2, CheckCircle2, Zap, Lock } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          <Zap className="w-3.5 h-3.5" /> Built for Precision & Speed
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About UNITFLOW
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A fast, accurate, and privacy-first unit and currency conversion engine built for students, engineers, developers, and professionals.
        </p>
      </div>

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Accurate & Full Precision
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every physical conversion factor is centrally defined according to NIST, BIPM, and ISO standard metrics. Calculations are performed at full available 64-bit precision and rounded only at the final display stage.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            100% Private & Account-Free
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your conversion history, favorite unit pairs, and preferences never leave your browser. No accounts, no cookies, no tracking telemetry, and no third-party behavioral analytics.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <WifiOff className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Offline-First Architecture
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All 36+ physical categories and 300+ units run entirely client-side without requiring internet access. Progressive Web App (PWA) caching enables installable desktop and mobile usage anywhere.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Safe Expression Engine
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Evaluate complex mathematical arithmetic like <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">(50 + 25) / 5</code> directly in conversion fields using a secure, zero-eval recursive descent parser.
          </p>
        </div>
      </div>

      {/* Categories Summary Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Conversion Capabilities at a Glance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>36+ Unit Categories</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>300+ Validated Units</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>160+ World Currencies</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Safe Math Expression Parser</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Custom Precision & Formatting</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Local CSV & JSON Data Export</span>
          </div>
        </div>
      </div>
    </div>
  );
};
