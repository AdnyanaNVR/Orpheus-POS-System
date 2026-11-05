import React, { useState, useRef } from 'react';
import { usePos } from '../../store/posStore';
import { UserRole } from '../../types/pos';
import {
  Store,
  Users,
  CreditCard,
  Percent,
  Printer,
  Database,
  History,
  Save,
  RotateCcw,
  Upload,
  Download,
  CheckCircle2,
  Shield,
  Trash2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    storeProfile,
    updateStoreProfile,
    users,
    currentUser,
    switchUser,
    auditLogs,
    exportDataJSON,
    importDataJSON,
    resetToSampleData,
  } = usePos();

  const [settingsTab, setSettingsTab] = useState<'profile' | 'users' | 'payments' | 'tax' | 'printer' | 'backup' | 'audit'>('profile');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Form states initialized with storeProfile
  const [name, setName] = useState(storeProfile.name);
  const [tagline, setTagline] = useState(storeProfile.tagline);
  const [address, setAddress] = useState(storeProfile.address);
  const [phone, setPhone] = useState(storeProfile.phone);
  const [email, setEmail] = useState(storeProfile.email);
  const [taxRate, setTaxRate] = useState(storeProfile.taxRate);
  const [taxEnabled, setTaxEnabled] = useState(storeProfile.taxEnabled);
  const [serviceChargeRate, setServiceChargeRate] = useState(storeProfile.serviceChargeRate);
  const [serviceChargeEnabled, setServiceChargeEnabled] = useState(storeProfile.serviceChargeEnabled);
  const [receiptHeader, setReceiptHeader] = useState(storeProfile.receiptHeader);
  const [receiptFooter, setReceiptFooter] = useState(storeProfile.receiptFooter);
  const [printerPaperSize, setPrinterPaperSize] = useState<'58mm' | '80mm'>(storeProfile.printerPaperSize);
  const [autoOpenDrawer, setAutoOpenDrawer] = useState(storeProfile.autoOpenDrawer);

  const restoreFileRef = useRef<HTMLInputElement>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreProfile({
      name,
      tagline,
      address,
      phone,
      email,
      taxRate,
      taxEnabled,
      serviceChargeRate,
      serviceChargeEnabled,
      receiptHeader,
      receiptFooter,
      printerPaperSize,
      autoOpenDrawer,
    });
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && importDataJSON(text)) {
        alert('Berhasil memulihkan database dari file cadangan JSON!');
      } else {
        alert('Gagal memulihkan file. Format JSON tidak sesuai.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Pengaturan Sistem POS</h2>
          <p className="text-xs text-[#8e95a5] mt-1">
            Konfigurasi profil usaha, pajak, format struk printer thermal, hak akses, dan log aktivitas
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#232630] pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Profil Toko', icon: <Store className="w-3.5 h-3.5" /> },
          { id: 'users', label: 'Pengguna & Hak Akses', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'tax', label: 'Pajak & Layanan', icon: <Percent className="w-3.5 h-3.5" /> },
          { id: 'printer', label: 'Printer & Struk', icon: <Printer className="w-3.5 h-3.5" /> },
          { id: 'backup', label: 'Backup & Restore', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'audit', label: 'Audit Log', icon: <History className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isActive = settingsTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-[#8e95a5] hover:text-white hover:bg-[#181a21]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFIL TOKO */}
      {settingsTab === 'profile' && (
        <form onSubmit={handleSaveSettings} className="bg-[#14161b] border border-[#232630] rounded-3xl p-6 space-y-4 max-w-3xl text-xs">
          <div className="border-b border-[#232630] pb-4">
            <h3 className="text-sm font-bold text-white">Informasi Badan Usaha & Outlet</h3>
            <p className="text-xs text-[#8e95a5] mt-0.5">
              Data ini akan dicetak pada kepala struk kasir dan faktur penjualan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Nama Toko / Resto *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#191b22] border border-[#262934] rounded-xl text-white font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Tagline Toko</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#191b22] border border-[#262934] rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#8e95a5] mb-1 block">Alamat Lengkap</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#191b22] border border-[#262934] rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">No. Telepon / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#262934] rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Email Kontak</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#262934] rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#232630] flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer shadow flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil Toko</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: PENGGUNA & HAK AKSES */}
      {settingsTab === 'users' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-3xl p-6 space-y-5 max-w-3xl">
          <div className="border-b border-[#232630] pb-4">
            <h3 className="text-sm font-bold text-white">Manajemen Pengguna & Peran Akses</h3>
            <p className="text-xs text-[#8e95a5] mt-0.5">
              Multi-role RBAC: Owner (Akses Penuh), Admin (Katalog & Laporan), Kasir (Penjualan Kasir)
            </p>
          </div>

          <div className="space-y-3">
            {users.map((u) => {
              const isCurrent = currentUser.id === u.id;
              return (
                <div
                  key={u.id}
                  className="bg-[#191b22] border border-[#262934] rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                      {u.role[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{u.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500 text-black text-[9px] font-black">
                            Sedang Digunakan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8e95a5]">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#242732] text-white text-xs font-mono uppercase font-bold">
                      {u.role}
                    </span>
                    {!isCurrent && (
                      <button
                        onClick={() => switchUser(u.role)}
                        className="px-3 py-1 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        Beralih Akun
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PAJAK & BIAYA LAYANAN */}
      {settingsTab === 'tax' && (
        <form onSubmit={handleSaveSettings} className="bg-[#14161b] border border-[#232630] rounded-3xl p-6 space-y-5 max-w-2xl text-xs">
          <div className="border-b border-[#232630] pb-4">
            <h3 className="text-sm font-bold text-white">Tarif Pajak (PPN) & Biaya Layanan</h3>
            <p className="text-xs text-[#8e95a5] mt-0.5">
              Atur persentase pajak dan biaya servis yang otomatis dihitung pada setiap transaksi
            </p>
          </div>

          <div className="space-y-4">
            {/* PPN Switch */}
            <div className="p-4 bg-[#191b22] border border-[#262934] rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">Pajak Pertambahan Nilai (PPN)</p>
                <p className="text-[11px] text-[#8e95a5] mt-0.5">
                  Aktifkan pemungutan PPN pada keranjang kasir
                </p>
              </div>
              <input
                type="checkbox"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {taxEnabled && (
              <div>
                <label className="font-bold text-[#8e95a5] mb-1 block">Tarif PPN (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-32 px-3.5 py-2 bg-[#191b22] border border-[#262934] rounded-xl text-white font-mono font-bold"
                />
              </div>
            )}

            {/* Service Charge Switch */}
            <div className="p-4 bg-[#191b22] border border-[#262934] rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">Biaya Layanan (Service Charge)</p>
                <p className="text-[11px] text-[#8e95a5] mt-0.5">
                  Biasanya digunakan untuk restoran / cafe dine-in
                </p>
              </div>
              <input
                type="checkbox"
                checked={serviceChargeEnabled}
                onChange={(e) => setServiceChargeEnabled(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {serviceChargeEnabled && (
              <div>
                <label className="font-bold text-[#8e95a5] mb-1 block">Tarif Biaya Layanan (%)</label>
                <input
                  type="number"
                  value={serviceChargeRate}
                  onChange={(e) => setServiceChargeRate(Number(e.target.value))}
                  className="w-32 px-3.5 py-2 bg-[#191b22] border border-[#262934] rounded-xl text-white font-mono font-bold"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#232630] flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer shadow"
            >
              Simpan Pengaturan Pajak
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: PRINTER & TEMPLATE STRUK */}
      {settingsTab === 'printer' && (
        <form onSubmit={handleSaveSettings} className="bg-[#14161b] border border-[#232630] rounded-3xl p-6 space-y-5 max-w-2xl text-xs">
          <div className="border-b border-[#232630] pb-4">
            <h3 className="text-sm font-bold text-white">Printer Thermal & Template Struk</h3>
            <p className="text-xs text-[#8e95a5] mt-0.5">
              Pilih ukuran kertas thermal dan kustomisasi teks pembuka/penutup struk
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-[#8e95a5] mb-1.5 block">Ukuran Kertas Thermal</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: '58mm', label: '58mm (Kecil / Mobile POS / Bluetooth)' },
                  { id: '80mm', label: '80mm (Lebar / Desktop POS Standard)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPrinterPaperSize(p.id as any)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-colors ${
                      printerPaperSize === p.id
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-[#181a21] text-[#8e95a5] border-[#262934] hover:bg-[#20232c]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Teks Sambutan Header Struk</label>
              <input
                type="text"
                value={receiptHeader}
                onChange={(e) => setReceiptHeader(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#262934] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Teks Footer Struk (Catatan / IG / Kebijakan)</label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#262934] rounded-xl text-white"
              />
            </div>

            <div className="p-4 bg-[#191b22] border border-[#262934] rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">Otomatis Buka Laci Kasir (Cash Drawer)</p>
                <p className="text-[11px] text-[#8e95a5] mt-0.5">
                  Kirim perintah sinyal RJ-11 ke laci uang saat transaksi tunai selesai
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoOpenDrawer}
                onChange={(e) => setAutoOpenDrawer(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#232630] flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer shadow"
            >
              Simpan Pengaturan Printer
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: BACKUP & RESTORE */}
      {settingsTab === 'backup' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-3xl p-6 space-y-6 max-w-2xl text-xs">
          <div className="border-b border-[#232630] pb-4">
            <h3 className="text-sm font-bold text-white">Cadangan & Pemulihan Basis Data (Backup & Restore)</h3>
            <p className="text-xs text-[#8e95a5] mt-0.5">
              Simpan seluruh rekaman transaksi, produk, dan log ke file JSON lokal atau pulihkan saat dibutuhkan
            </p>
          </div>

          <div className="space-y-4">
            {/* Export */}
            <div className="p-4 bg-[#191b22] border border-[#262934] rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Unduh File Cadangan (JSON)</h4>
                <p className="text-xs text-[#8e95a5] mt-0.5">
                  Cadangkan master produk, seluruh riwayat transaksi, dan profil toko
                </p>
              </div>
              <button
                onClick={exportDataJSON}
                className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Backup</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 bg-[#191b22] border border-[#262934] rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Pulihkan Cadangan (Restore JSON)</h4>
                <p className="text-xs text-[#8e95a5] mt-0.5">
                  Unggah file `.json` cadangan yang sebelumnya diunduh
                </p>
              </div>
              <input
                type="file"
                ref={restoreFileRef}
                accept=".json"
                onChange={handleRestoreFile}
                className="hidden"
              />
              <button
                onClick={() => restoreFileRef.current?.click()}
                className="px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah & Restore</span>
              </button>
            </div>

            {/* Reset */}
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-red-300 text-sm">Reset ke Data Sampel Default</h4>
                <p className="text-xs text-[#8e95a5] mt-0.5">
                  Hapus transaksi dan kembalikan produk ke data awal toko Corbel Supply Co.
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Yakin ingin mereset seluruh data toko ke sampel default?')) {
                    resetToSampleData();
                    alert('Data toko telah direset ke sampel awal!');
                  }
                }}
                className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOG */}
      {settingsTab === 'audit' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#232630] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Log Audit Keamanan & Aktivitas Toko</h3>
            <span className="text-xs text-[#8e95a5]">{auditLogs.length} Aktivitas Tercatat</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181a20] text-[#8e95a5] border-b border-[#232630]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold">Pengguna</th>
                  <th className="px-4 py-3 font-semibold">Peran</th>
                  <th className="px-4 py-3 font-semibold">Tindakan</th>
                  <th className="px-4 py-3 font-semibold">Modul</th>
                  <th className="px-4 py-3 font-semibold">Rincian Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2129]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#191c23] transition-colors">
                    <td className="px-4 py-3 text-[#8e95a5] font-mono whitespace-nowrap">
                      {new Date(log.date).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#20232c] text-[#8e95a5] uppercase font-mono text-[10px]">
                        {log.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-400 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-[#a0a7b5] whitespace-nowrap">{log.entity}</td>
                    <td className="px-4 py-3 text-[#c5cbd6]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
