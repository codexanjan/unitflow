import React, { useState } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { HistoryProvider } from './context/HistoryContext';
import { Header, NavTab } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingHero } from './components/landing/LandingHero';
import { ConverterCard } from './components/converter/ConverterCard';
import { CurrencyConverter } from './components/currency/CurrencyConverter';
import { FavoritesView } from './components/favorites/FavoritesView';
import { HistoryView } from './components/history/HistoryView';
import { CategoryHubView } from './components/seo/CategoryHubView';
import { SettingsView } from './components/settings/SettingsView';
import { AboutView } from './components/about/AboutView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { defaultCategory } = useSettings();
  const [activeTab, setActiveTab] = useState<NavTab>('converter');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Conversion pre-fill state
  const [convCategory, setConvCategory] = useState<string>(defaultCategory || 'length');
  const [convFrom, setConvFrom] = useState<string | undefined>(undefined);
  const [convTo, setConvTo] = useState<string | undefined>(undefined);
  const [convValue, setConvValue] = useState<string | undefined>('100');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectFromSearch = (
    categoryId: string,
    fromUnitId: string,
    toUnitId?: string,
    initialVal?: string
  ) => {
    setConvCategory(categoryId);
    setConvFrom(fromUnitId);
    if (toUnitId) setConvTo(toUnitId);
    if (initialVal) setConvValue(initialVal);
    setActiveTab('converter');
  };

  const handleSelectCategoryFromHub = (
    categoryId: string,
    fromUnitId?: string,
    toUnitId?: string
  ) => {
    setConvCategory(categoryId);
    if (fromUnitId) setConvFrom(fromUnitId);
    if (toUnitId) setConvTo(toUnitId);
    setActiveTab('converter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'converter' && (
          <div className="space-y-6">
            <LandingHero
              onStartConverting={() => {
                const el = document.getElementById('main-converter');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreUnits={() => setActiveTab('categories')}
              onSelectQuickPair={(cat, from, to) => {
                setConvCategory(cat);
                setConvFrom(from);
                setConvTo(to);
              }}
            />

            <div id="main-converter">
              <ConverterCard
                key={`${convCategory}-${convFrom}-${convTo}`}
                initialCategoryId={convCategory}
                initialFromUnitId={convFrom}
                initialToUnitId={convTo}
                initialValue={convValue}
                onToast={addToast}
              />
            </div>
          </div>
        )}

        {activeTab === 'currency' && (
          <CurrencyConverter onToast={addToast} />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            onSelectFavorite={(cat, from, to, val) => {
              setConvCategory(cat);
              setConvFrom(from);
              setConvTo(to);
              if (val) setConvValue(val);
              setActiveTab('converter');
            }}
            onToast={addToast}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            onSelectHistoryItem={(cat, from, to, val) => {
              setConvCategory(cat);
              setConvFrom(from);
              setConvTo(to);
              setConvValue(val);
              setActiveTab('converter');
            }}
            onToast={addToast}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryHubView onSelectCategory={handleSelectCategoryFromHub} />
        )}

        {activeTab === 'settings' && (
          <SettingsView onToast={addToast} />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onSelectCategory={handleSelectCategoryFromHub}
      />

      {/* Global Search Modal (Ctrl + K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectUnit={handleSelectFromSearch}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export function App() {
  return (
    <SettingsProvider>
      <FavoritesProvider>
        <HistoryProvider>
          <AppContent />
        </HistoryProvider>
      </FavoritesProvider>
    </SettingsProvider>
  );
}

export default App;
