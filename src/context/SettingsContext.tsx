import React, { createContext, useContext, useEffect, useState } from 'react';
import { FormatOptions } from '../engine/types';
import { DEFAULT_FORMAT_OPTIONS } from '../engine/formatter';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  formatOptions: FormatOptions;
  setFormatOptions: React.Dispatch<React.SetStateAction<FormatOptions>>;
  defaultCategory: string;
  setDefaultCategory: (cat: string) => void;
  autoCopy: boolean;
  setAutoCopy: (val: boolean) => void;
  resetSettings: () => void;
}

const SETTINGS_STORAGE_KEY = 'unitflow_settings_v1';

const defaultSettings = {
  theme: 'system' as ThemeMode,
  formatOptions: DEFAULT_FORMAT_OPTIONS,
  defaultCategory: 'length',
  autoCopy: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.theme || 'system';
      }
    } catch {
      // ignore
    }
    return 'system';
  });

  const [formatOptions, setFormatOptions] = useState<FormatOptions>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_FORMAT_OPTIONS, ...(parsed.formatOptions || {}) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_FORMAT_OPTIONS;
  });

  const [defaultCategory, setDefaultCategoryState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.defaultCategory || 'length';
      }
    } catch {
      // ignore
    }
    return 'length';
  });

  const [autoCopy, setAutoCopyState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.autoCopy;
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Save settings on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          theme,
          formatOptions,
          defaultCategory,
          autoCopy,
        })
      );
    } catch {
      // ignore
    }
  }, [theme, formatOptions, defaultCategory, autoCopy]);

  // Handle Theme switching & System listener
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark =
        theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setDefaultCategory = (cat: string) => {
    setDefaultCategoryState(cat);
  };

  const setAutoCopy = (val: boolean) => {
    setAutoCopyState(val);
  };

  const resetSettings = () => {
    setThemeState(defaultSettings.theme);
    setFormatOptions(defaultSettings.formatOptions);
    setDefaultCategoryState(defaultSettings.defaultCategory);
    setAutoCopyState(defaultSettings.autoCopy);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        formatOptions,
        setFormatOptions,
        defaultCategory,
        setDefaultCategory,
        autoCopy,
        setAutoCopy,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
