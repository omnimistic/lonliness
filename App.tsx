import React, { useState } from 'react';
import { NAV_ITEMS } from './constants';
import { AppView } from './types';
import Dashboard from './components/Dashboard';
import ChatCompanion from './components/ChatCompanion';
import CommunityFinder from './components/CommunityFinder';
import { HeartHandshake } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.COMPANION:
        return <ChatCompanion />;
      case AppView.COMMUNITY:
        return <CommunityFinder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <HeartHandshake size={32} />
            <span className="font-bold text-xl tracking-tight text-slate-900">ConnectAI</span>
          </div>
          <nav className="hidden md:flex gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as AppView)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        {renderView()}
      </main>

      {/* Mobile Navigation (Sticky Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 pb-safe z-50">
        <div className="flex justify-around">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AppView)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full ${
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
