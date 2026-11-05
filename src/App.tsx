import React, { useEffect } from 'react';
import { PosProvider, usePos } from './store/posStore';
import { Navbar } from './components/common/Navbar';
import { SidebarDock } from './components/common/SidebarDock';
import { ReceiptModal } from './components/common/ReceiptModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { ReportsView } from './components/dashboard/ReportsView';
import { CashierView } from './components/cashier/CashierView';
import { ProductsView } from './components/products/ProductsView';
import { CustomersView } from './components/customers/CustomersView';
import { MessagesView } from './components/messages/MessagesView';
import { SettingsView } from './components/settings/SettingsView';
import { SupabaseMigrationView } from './components/supabase/SupabaseMigrationView';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = usePos();

  // Keyboard shortcut helpers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveTab('dashboard');
      } else if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('cashier');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setActiveTab('products');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveTab('reports');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#f2f4f7] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* 1:1 Top Header Navbar */}
      <Navbar />

      {/* Floating Left Sidebar Dock */}
      <SidebarDock />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1580px] w-full mx-auto px-4 md:px-8 md:pl-20 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {(activeTab === 'orders' || activeTab === 'cashier') && <CashierView />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'customers' && <CustomersView />}
        {activeTab === 'messages' && <MessagesView />}
        {(activeTab === 'analytics' || activeTab === 'reports') && <ReportsView />}
        {(activeTab === 'automations' || activeTab === 'settings') && <SettingsView />}
        {activeTab === 'supabase' && <SupabaseMigrationView />}
      </main>

      {/* Global Thermal Receipt Modal */}
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <PosProvider>
      <MainLayout />
    </PosProvider>
  );
}
