import React from 'react';
import {
  Calculator,
  Star,
  History,
  TrendingUp,
  Settings,
  Info,
  Search,
  Moon,
  Sun,
  Grid,
  Laptop,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useHistory } from '../../context/HistoryContext';

export type NavTab = 'converter' | 'currency' | 'favorites' | 'history' | 'categories' | 'settings' | 'about';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenSearch }) => {
  const { theme, setTheme } = useSettings();
  const { favorites } = useFavorites();
  const { history } = useHistory();

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'converter', label: 'Converter', icon: Calculator },
    { id: 'currency', label: 'Currency', icon: TrendingUp },
    { id: 'categories', label: 'Explore', icon: Grid },
    { id: 'favorites', label: 'Favorites', icon: Star, badge: favorites.length },
    { id: 'history', label: 'History', icon: History, badge: history.length },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
  ];

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <>
      {/* Desktop & Tablet Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('converter')}
            className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                <path d="M7 11h14M16 6l5 5-5 5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25 21H11M16 26l-5-5 5-5" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  UNIT<span className="text-indigo-600 dark:text-indigo-400">FLOW</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Smart Unit & Currency Engine</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar: Search modal trigger & Theme toggle */}
          <div className="flex items-center gap-2.5">
            {/* Global Search Hotkey Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 text-xs transition-all shadow-xs group cursor-pointer"
              title="Search units (Ctrl + K)"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span className="hidden sm:inline">Search units...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              title={`Current theme: ${theme}. Click to switch.`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Laptop className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 flex items-center justify-around shadow-2xl overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all relative shrink-0 cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <IconComponent className="w-4.5 h-4.5" />
              <span className="text-[10px]">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
