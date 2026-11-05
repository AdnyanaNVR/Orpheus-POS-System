import React from 'react';
import { usePos } from '../../store/posStore';
import { Search, ShoppingBag, Sliders, Clock, Sparkles, Sun } from 'lucide-react';

export const SidebarDock: React.FC = () => {
  const { activeTab, setActiveTab, cart } = usePos();

  return (
    <aside className="fixed left-3 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-3 bg-[#141416]/95 backdrop-blur-md p-2 rounded-full border border-[#27272a] shadow-2xl">
      {/* 1. Search Icon */}
      <button
        onClick={() => setActiveTab('products')}
        className="p-2 text-[#71717a] hover:text-white transition-colors cursor-pointer rounded-full"
        title="Search Catalog"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* 2. Store / Register with badge 1 */}
      <button
        onClick={() => setActiveTab('cashier')}
        className={`relative p-2 transition-colors cursor-pointer rounded-full ${
          activeTab === 'cashier' || activeTab === 'orders'
            ? 'text-white bg-[#27272a]'
            : 'text-[#71717a] hover:text-white'
        }`}
        title="POS Cashier Register"
      >
        <ShoppingBag className="w-4 h-4" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#3f3f46] text-white text-[9px] font-bold flex items-center justify-center">
          {cart.length > 0 ? cart.length : 1}
        </span>
      </button>

      {/* 3. Sliders / Settings */}
      <button
        onClick={() => setActiveTab('settings')}
        className={`p-2 transition-colors cursor-pointer rounded-full ${
          activeTab === 'settings' ? 'text-white bg-[#27272a]' : 'text-[#71717a] hover:text-white'
        }`}
        title="Settings & Preferences"
      >
        <Sliders className="w-4 h-4" />
      </button>

      {/* 4. Clock / History */}
      <button
        onClick={() => setActiveTab('reports')}
        className={`p-2 transition-colors cursor-pointer rounded-full ${
          activeTab === 'reports' || activeTab === 'analytics'
            ? 'text-white bg-[#27272a]'
            : 'text-[#71717a] hover:text-white'
        }`}
        title="Analytics & Shift History"
      >
        <Clock className="w-4 h-4" />
      </button>

      {/* 5. Sparkles / Automations */}
      <button
        onClick={() => setActiveTab('supabase')}
        className={`p-2 transition-colors cursor-pointer rounded-full ${
          activeTab === 'supabase' ? 'text-white bg-[#27272a]' : 'text-[#71717a] hover:text-white'
        }`}
        title="Supabase Database & Automations"
      >
        <Sparkles className="w-4 h-4" />
      </button>

      {/* 6. Sun / Theme */}
      <button
        onClick={() => {}}
        className="p-2 text-[#71717a] hover:text-white transition-colors cursor-pointer rounded-full"
        title="Theme Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
    </aside>
  );
};
