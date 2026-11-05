import React, { useState } from 'react';
import { usePos } from '../../store/posStore';
import { ActiveNavTab, UserRole } from '../../types/pos';
import { Bell, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    switchUser,
    orders,
  } = usePos();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  // Exact tabs as shown in image_15c12804.png
  const navTabs: { id: ActiveNavTab; label: string; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Orders', badge: orders.length > 0 ? orders.length : 14 },
    { id: 'products', label: 'Products' },
    { id: 'customers', label: 'Customers' },
    { id: 'messages', label: 'Messages', badge: 3 },
    { id: 'analytics', label: 'Analytics' },
    { id: 'automations', label: 'Automations' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c0d0e]/95 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-[1580px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Lockup 1:1 */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 shrink-0 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-base shadow-sm">
            F
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight font-sans">
              Corbel Supply Co.
            </h1>
            <p className="text-[11px] text-[#71717a] font-normal leading-tight">
              Pro trial, 9 days left
            </p>
          </div>
        </div>

        {/* Center Pill Nav Bar 1:1 */}
        <nav className="flex items-center gap-1 bg-[#18181b]/90 border border-[#27272a] p-1 rounded-full overflow-x-auto max-w-full no-scrollbar shadow-sm">
          {navTabs.map((tab) => {
            const isTabActive =
              activeTab === tab.id ||
              (tab.id === 'orders' && activeTab === 'cashier') ||
              (tab.id === 'analytics' && activeTab === 'reports') ||
              (tab.id === 'automations' && (activeTab === 'settings' || activeTab === 'supabase'));

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'orders') setActiveTab('cashier');
                  else if (tab.id === 'analytics') setActiveTab('reports');
                  else if (tab.id === 'automations') setActiveTab('settings');
                  else setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full transition-all whitespace-nowrap cursor-pointer select-none ${
                  isTabActive
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded-full ${
                      isTabActive
                        ? 'bg-black/10 text-black'
                        : 'bg-[#27272a] text-[#d4d4d8]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Notification, Team Avatars, Profile Avatar 1:1 */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notification Bell with Red Indicator Dot */}
          <div className="relative w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-white cursor-pointer transition-colors">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
          </div>

          {/* Group Avatars Pill: MR, JO, AP, +2 */}
          <div className="hidden sm:flex items-center bg-[#18181b] border border-[#27272a] rounded-full p-0.5 px-1.5 gap-1 text-[11px] font-bold text-[#d4d4d8]">
            <span className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-[10px] font-semibold text-white">
              MR
            </span>
            <span className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-[10px] font-semibold text-white">
              JO
            </span>
            <span className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-[10px] font-semibold text-white">
              AP
            </span>
            <span className="text-[10px] text-[#a1a1aa] font-medium pr-1">
              +2
            </span>
          </div>

          {/* Standalone User Avatar (MR) with Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="w-8 h-8 rounded-full bg-[#27272a] border border-[#3f3f46] text-white text-xs font-bold flex items-center justify-center hover:border-white transition-colors cursor-pointer shadow-xs"
              title="Profil Pengguna & Ganti Role"
            >
              MR
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="px-2.5 py-1.5 border-b border-[#27272a] mb-1">
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-400">
                    Role: {currentUser.role}
                  </p>
                </div>
                {(['owner', 'admin', 'cashier'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchUser(r);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between cursor-pointer ${
                      currentUser.role === r
                        ? 'bg-white text-black font-bold'
                        : 'text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                    }`}
                  >
                    <span className="capitalize">{r}</span>
                    {currentUser.role === r && <span className="text-[10px]">Aktif</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
