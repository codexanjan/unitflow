import React from 'react';
import { ShieldCheck, WifiOff, Cpu } from 'lucide-react';
import { NavTab } from './Header';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectCategory: (categoryId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onSelectCategory }) => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 mt-16 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Privacy Statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                U
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                UNIT<span className="text-indigo-600 dark:text-indigo-400">FLOW</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Fast, accurate, and privacy-first unit and currency conversion engine. Computations are processed 100% locally in your browser.
            </p>

            {/* Privacy & Offline Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Tracking
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60">
                <WifiOff className="w-3.5 h-3.5" />
                100% Offline Ready
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Cpu className="w-3.5 h-3.5" />
                64-Bit Float Precision
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Popular Converters
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onSelectCategory('length')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Length & Distance Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('mass')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Weight & Mass Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('temperature')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Temperature Scale Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pressure')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Pressure & PSI Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('data_storage')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Digital Data & Byte Converter
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('converter')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Unit Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('currency')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Currency Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Saved Favorites
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Conversion History
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  About & Validation
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} UNITFLOW. Formulated according to NIST & BIPM SI standards.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Privacy First • No Cookies • Clean Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
