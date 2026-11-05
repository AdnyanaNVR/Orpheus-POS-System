import React from 'react';
import { Bell, MessageSquare, AlertTriangle, CheckCircle2, PackageCheck } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const messages = [
    {
      id: 1,
      sender: 'Sistem Inventaris',
      role: 'Automasi',
      time: '15 menit lalu',
      content: 'Stok Peach Blossom Tea tersisa 4 Cup. Batas minimum tercapai, segera lakukan restock dari supplier.',
      unread: true,
      type: 'warning',
    },
    {
      id: 2,
      sender: 'Rama Pratama',
      role: 'Owner',
      time: '1 jam lalu',
      content: 'Shift pagi berjalan sangat baik. Target omzet harian Rp 40jt sudah tercapai lebih awal!',
      unread: true,
      type: 'success',
    },
    {
      id: 3,
      sender: 'Kasir Budi',
      role: 'Kasir',
      time: '2 jam lalu',
      content: 'Mesin EDC BCA sudah dikalibrasi dan rol kertas thermal 58mm sudah diganti baru.',
      unread: true,
      type: 'info',
    },
  ];

  return (
    <div className="space-y-6 pb-16 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Pesan & Notifikasi Toko</h2>
          <p className="text-xs text-[#8e8e93] mt-1">
            Komunikasi internal tim kasir, manajer, dan peringatan sistem otomatis
          </p>
        </div>
      </div>

      <div className="bg-[#131416] border border-[#222327] rounded-[24px] p-6 space-y-4 max-w-3xl">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl border transition-colors ${
              m.unread
                ? 'bg-[#18191d] border-[#2e313b]'
                : 'bg-[#141416] border-[#222327]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{m.sender}</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#27272a] text-[#a1a1aa] font-mono">
                  {m.role}
                </span>
                {m.unread && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </div>
              <span className="text-[11px] text-[#71717a]">{m.time}</span>
            </div>
            <p className="text-xs text-[#d4d4d8] leading-relaxed">{m.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
