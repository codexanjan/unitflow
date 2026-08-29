import React, { createContext, useContext, useEffect, useState } from 'react';
import { FavoriteItem } from '../engine/types';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'timestamp'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (categoryId: string, fromUnitId: string, toUnitId: string) => boolean;
  toggleFavorite: (categoryId: string, fromUnitId: string, toUnitId: string, customLabel?: string) => void;
  reorderFavorites: (newOrder: FavoriteItem[]) => void;
  renameFavorite: (id: string, newLabel: string) => void;
}

const FAVORITES_STORAGE_KEY = 'unitflow_favorites_v1';

const DEFAULT_FAVORITES: FavoriteItem[] = [
  { id: 'fav-1', categoryId: 'length', fromUnitId: 'kilometer', toUnitId: 'mile', customLabel: 'km → mi', timestamp: Date.now() - 5000 },
  { id: 'fav-2', categoryId: 'mass', fromUnitId: 'kilogram', toUnitId: 'pound', customLabel: 'kg → lb', timestamp: Date.now() - 4000 },
  { id: 'fav-3', categoryId: 'temperature', fromUnitId: 'celsius', toUnitId: 'fahrenheit', customLabel: '°C → °F', timestamp: Date.now() - 3000 },
  { id: 'fav-4', categoryId: 'volume', fromUnitId: 'liter', toUnitId: 'us_gallon', customLabel: 'L → gal (US)', timestamp: Date.now() - 2000 },
  { id: 'fav-5', categoryId: 'data_storage', fromUnitId: 'megabyte', toUnitId: 'gigabyte', customLabel: 'MB → GB', timestamp: Date.now() - 1000 },
];

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_FAVORITES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const addFavorite = (item: Omit<FavoriteItem, 'id' | 'timestamp'>) => {
    const newItem: FavoriteItem = {
      ...item,
      id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    setFavorites((prev) => [newItem, ...prev]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorite = (categoryId: string, fromUnitId: string, toUnitId: string): boolean => {
    return favorites.some(
      (f) =>
        f.categoryId === categoryId &&
        f.fromUnitId === fromUnitId &&
        f.toUnitId === toUnitId
    );
  };

  const toggleFavorite = (
    categoryId: string,
    fromUnitId: string,
    toUnitId: string,
    customLabel?: string
  ) => {
    const existing = favorites.find(
      (f) =>
        f.categoryId === categoryId &&
        f.fromUnitId === fromUnitId &&
        f.toUnitId === toUnitId
    );
    if (existing) {
      removeFavorite(existing.id);
    } else {
      addFavorite({
        categoryId,
        fromUnitId,
        toUnitId,
        customLabel: customLabel || `${fromUnitId} → ${toUnitId}`,
      });
    }
  };

  const reorderFavorites = (newOrder: FavoriteItem[]) => {
    setFavorites(newOrder);
  };

  const renameFavorite = (id: string, newLabel: string) => {
    setFavorites((prev) =>
      prev.map((f) => (f.id === id ? { ...f, customLabel: newLabel } : f))
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        reorderFavorites,
        renameFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
