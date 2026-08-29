import React, { createContext, useContext, useEffect, useState } from 'react';
import { HistoryItem } from '../engine/types';

interface HistoryContextType {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  exportHistoryJSON: () => void;
  exportHistoryCSV: () => void;
  importHistoryJSON: (jsonString: string) => boolean;
}

const HISTORY_STORAGE_KEY = 'unitflow_history_v1';
const MAX_HISTORY_ITEMS = 100;

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const addHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    // Ignore invalid/empty conversions
    if (item.inputValue === '' || item.formattedOutput === '' || item.formattedOutput === 'Invalid value') {
      return;
    }

    setHistory((prev) => {
      // Avoid immediate identical duplicate
      if (
        prev.length > 0 &&
        prev[0].categoryId === item.categoryId &&
        prev[0].fromUnitId === item.fromUnitId &&
        prev[0].toUnitId === item.toUnitId &&
        String(prev[0].inputValue) === String(item.inputValue)
      ) {
        return prev;
      }

      const newItem: HistoryItem = {
        ...item,
        id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
      };

      return [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  const exportHistoryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `unitflow-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportHistoryCSV = () => {
    if (history.length === 0) return;

    const headers = ['ID', 'Category', 'Input Value', 'From Unit', 'Symbol', 'Output Value', 'To Unit', 'Symbol', 'Date Time'];
    const rows = history.map((item) => [
      `"${item.id}"`,
      `"${item.categoryName}"`,
      `"${item.inputValue}"`,
      `"${item.fromUnitName}"`,
      `"${item.fromUnitSymbol}"`,
      `"${item.formattedOutput}"`,
      `"${item.toUnitName}"`,
      `"${item.toUnitSymbol}"`,
      `"${new Date(item.timestamp).toISOString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `unitflow-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const importHistoryJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        // Validate items
        const validItems = parsed.filter(
          (item) => item.id && item.categoryId && item.fromUnitId && item.toUnitId
        );
        if (validItems.length > 0) {
          setHistory((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newToAdd = validItems.filter((i) => !existingIds.has(i.id));
            return [...newToAdd, ...prev].slice(0, MAX_HISTORY_ITEMS);
          });
          return true;
        }
      }
    } catch {
      return false;
    }
    return false;
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addHistory,
        deleteHistoryItem,
        clearHistory,
        exportHistoryJSON,
        exportHistoryCSV,
        importHistoryJSON,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
