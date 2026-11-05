import React, { useState } from 'react';
import { usePos } from '../../store/posStore';
import { Users, Search, Plus, Phone, Mail, Award, ShoppingBag, ArrowRight } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: 'Gold Member' | 'Silver' | 'Reguler';
  totalSpent: number;
  ordersCount: number;
  lastVisit: string;
}

export const CustomersView: React.FC = () => {
  const { setActiveTab } = usePos();
  const [search, setSearch] = useState('');

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'c-1',
      name: 'Aditya Nugraha',
      phone: '+62 812-9988-7711',
      email: 'aditya@gmail.com',
      tier: 'Gold Member',
      totalSpent: 1845000,
      ordersCount: 16,
      lastVisit: 'Hari ini, 08:14',
    },
    {
      id: 'c-2',
      name: 'Maya Kusuma',
      phone: '+62 813-4455-6677',
      email: 'maya.kusuma@yahoo.com',
      tier: 'Silver',
      totalSpent: 920000,
      ordersCount: 8,
      lastVisit: 'Hari ini, 09:30',
    },
    {
      id: 'c-3',
      name: 'Kevin Wijaya',
      phone: '+62 819-2233-4455',
      email: 'kevin.w@company.id',
      tier: 'Gold Member',
      totalSpent: 2450000,
      ordersCount: 22,
      lastVisit: 'Hari ini, 11:15',
    },
    {
      id: 'c-4',
      name: 'Rina Amanda',
      phone: '+62 856-1122-3344',
      email: 'rina.amanda@outlook.com',
      tier: 'Reguler',
      totalSpent: 380000,
      ordersCount: 4,
      lastVisit: 'Kemarin',
    },
  ]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Data Pelanggan & Loyalitas</h2>
          <p className="text-xs text-[#8e8e93] mt-1">
            Kelola profil pelanggan, poin reward, dan riwayat transaksi loyalitas
          </p>
        </div>

        <button
          onClick={() => {
            const name = prompt('Nama Pelanggan Baru:');
            const phone = prompt('Nomor Telepon:');
            if (name) {
              setCustomers([
                {
                  id: `c-${Date.now()}`,
                  name,
                  phone: phone || '+62 812-0000-0000',
                  email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
                  tier: 'Reguler',
                  totalSpent: 0,
                  ordersCount: 0,
                  lastVisit: 'Baru mendaftar',
                },
                ...customers,
              ]);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
        <input
          type="text"
          placeholder="Cari nama pelanggan, nomor telepon, atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#141416] border border-[#222327] rounded-xl text-xs text-white placeholder-[#71717a] focus:outline-hidden focus:border-white transition-colors"
        />
      </div>

      <div className="bg-[#131416] border border-[#222327] rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#18181b] text-[#71717a] border-b border-[#222327]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Nama Pelanggan</th>
                <th className="px-5 py-3.5 font-semibold">Kontak</th>
                <th className="px-5 py-3.5 font-semibold">Tier Member</th>
                <th className="px-5 py-3.5 font-semibold text-center">Transaksi</th>
                <th className="px-5 py-3.5 font-semibold text-right">Total Belanja</th>
                <th className="px-5 py-3.5 font-semibold">Kunjungan Terakhir</th>
                <th className="px-5 py-3.5 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1f24]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#18191d] transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white">{c.name}</td>
                  <td className="px-5 py-3.5 text-[#a1a1aa]">
                    <div>{c.phone}</div>
                    <div className="text-[10px] text-[#71717a]">{c.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.tier === 'Gold Member'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : c.tier === 'Silver'
                          ? 'bg-neutral-200/20 text-neutral-300 border border-neutral-400/30'
                          : 'bg-[#27272a] text-[#a1a1aa]'
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono font-bold text-white">
                    {c.ordersCount}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-white">
                    Rp {c.totalSpent.toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-3.5 text-[#8e8e93]">{c.lastVisit}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => setActiveTab('cashier')}
                      className="px-3 py-1 bg-[#27272a] hover:bg-white hover:text-black rounded-lg text-[11px] font-semibold text-white transition-colors cursor-pointer"
                    >
                      Buat Pesanan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
