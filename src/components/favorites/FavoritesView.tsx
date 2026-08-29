import React, { useState } from 'react';
import { Star, ArrowRight, Trash2, Edit2, Check, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { getCategoryById } from '../../units';
import { CategoryIcon } from '../common/CategoryIcon';

interface FavoritesViewProps {
  onSelectFavorite: (categoryId: string, fromUnitId: string, toUnitId: string, value?: string) => void;
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onSelectFavorite, onToast }) => {
  const { favorites, removeFavorite, reorderFavorites, renameFavorite } = useFavorites();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const handleStartEdit = (id: string, currentLabel: string) => {
    setEditingId(id);
    setEditLabel(currentLabel);
  };

  const handleSaveEdit = (id: string) => {
    if (editLabel.trim()) {
      renameFavorite(id, editLabel.trim());
      onToast('Favorite renamed', 'success');
    }
    setEditingId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= favorites.length) return;

    const copy = [...favorites];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    reorderFavorites(copy);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Saved Favorites ({favorites.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pin your most frequently used unit pairs for instant one-click access
            </p>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <Star className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3 stroke-1" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Favorites Saved Yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click the star icon next to any conversion to pin it here for quick access anytime.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((fav, index) => {
            const category = getCategoryById(fav.categoryId);
            const fromUnit = category?.units.find((u) => u.id === fav.fromUnitId);
            const toUnit = category?.units.find((u) => u.id === fav.toUnitId);

            const isEditing = editingId === fav.id;

            return (
              <div
                key={fav.id}
                className="group relative p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <CategoryIcon name={category?.iconName || 'Ruler'} className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {category?.name || fav.categoryId}
                      </span>
                    </div>

                    {/* Order controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 rounded"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === favorites.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 rounded"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title / Label */}
                  {isEditing ? (
                    <div className="flex items-center gap-2 my-2">
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="flex-1 px-3 py-1 text-sm rounded-lg border border-indigo-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(fav.id)}
                        className="p-1.5 bg-indigo-600 text-white rounded-lg"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {fav.customLabel || `${fromUnit?.name || fav.fromUnitId} to ${toUnit?.name || fav.toUnitId}`}
                      </h4>
                      <button
                        onClick={() => handleStartEdit(fav.id, fav.customLabel || '')}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Rename Favorite"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Unit Pair details */}
                  <div className="flex items-center gap-2 mt-2 font-mono text-sm text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">
                      {fromUnit?.symbol || fav.fromUnitId}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-indigo-600 dark:text-indigo-400">
                      {toUnit?.symbol || fav.toUnitId}
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectFavorite(fav.categoryId, fav.fromUnitId, fav.toUnitId, fav.defaultInput)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3 h-3" />
                    Open in Converter
                  </button>

                  <button
                    onClick={() => {
                      removeFavorite(fav.id);
                      onToast('Favorite removed', 'info');
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                    title="Delete favorite"
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
