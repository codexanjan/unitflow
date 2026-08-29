import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { allCategories } from '../../units';
import { CategoryIcon } from '../common/CategoryIcon';
import { CategoryGroup } from '../../engine/types';

interface CategoryHubViewProps {
  onSelectCategory: (categoryId: string, fromUnitId?: string, toUnitId?: string) => void;
}

export const CategoryHubView: React.FC<CategoryHubViewProps> = ({ onSelectCategory }) => {
  const [filter, setFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  const groups: ('All' | CategoryGroup)[] = [
    'All',
    'Basic',
    'Physics & Engineering',
    'Electrical',
    'Data',
    'Light & Sound',
    'Specialized',
  ];

  const filteredCategories = allCategories.filter((cat) => {
    const matchesGroup = selectedGroup === 'All' || cat.group === selectedGroup;
    const matchesQuery =
      cat.name.toLowerCase().includes(filter.toLowerCase()) ||
      cat.description.toLowerCase().includes(filter.toLowerCase()) ||
      cat.units.some((u) => u.name.toLowerCase().includes(filter.toLowerCase()) || u.symbol.toLowerCase().includes(filter.toLowerCase()));
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="w-full space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 py-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Unit Categories
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Comprehensive, validated conversion standards for everyday metrics, physics, electrical engineering, data, and chemistry.
        </p>
      </div>

      {/* Filter & Group Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Groups pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 scrollbar-none">
          {groups.map((g) => {
            const isSelected = selectedGroup === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter category or unit..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          return (
            <div
              key={category.id}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <CategoryIcon name={category.iconName} className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {category.group}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>

                {/* Units chips preview */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {category.units.slice(0, 6).map((u) => (
                    <span
                      key={u.id}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
                    >
                      {u.symbol}
                    </span>
                  ))}
                  {category.units.length > 6 && (
                    <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium text-slate-400">
                      +{category.units.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {category.units.length} total units
                </span>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform"
                >
                  Convert
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
