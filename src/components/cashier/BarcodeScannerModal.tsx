import React, { useState } from 'react';
import { usePos } from '../../store/posStore';
import { ScanBarcode, X, Camera, Check, Search, Sparkles } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanMatch: (barcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanMatch,
}) => {
  const { products } = usePos();
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;
    triggerBarcode(manualBarcode.trim());
  };

  const triggerBarcode = (barcode: string) => {
    const found = products.find((p) => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase());
    if (found) {
      setScanStatus(`Berhasil mendeteksi: ${found.name}`);
      setTimeout(() => {
        onScanMatch(barcode);
        onClose();
      }, 500);
    } else {
      setScanStatus(`Barcode "${barcode}" tidak ditemukan di database produk.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#16181d] border border-[#2b2f3a] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242732] bg-[#121418]">
          <div className="flex items-center gap-2 text-white">
            <ScanBarcode className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">Pemindai Barcode Produk</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8e95a5] hover:text-white hover:bg-[#20232c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Simulation Window */}
        <div className="p-6 space-y-5 bg-[#0d0e11]">
          {/* Laser Scanner Viewfinder */}
          <div className="relative h-44 rounded-xl border-2 border-dashed border-[#343a49] bg-[#14161b] flex flex-col items-center justify-center overflow-hidden">
            {/* Animated Laser line */}
            <div className="absolute inset-x-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-bounce"></div>

            <div className="z-10 text-center px-4">
              <Camera className="w-8 h-8 text-[#555d6e] mx-auto mb-2" />
              <p className="text-xs font-semibold text-white">
                Arahkan Barcode ke Garis Merah
              </p>
              <p className="text-[11px] text-[#737a8c] mt-0.5">
                Mendukung EAN-13, Code 128, & USB Barcode Gun
              </p>
            </div>
          </div>

          {/* Feedback Status */}
          {scanStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                scanStatus.startsWith('Berhasil')
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {scanStatus}
            </div>
          )}

          {/* Manual Barcode Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="text-xs font-bold text-[#8e95a5]">
              Ketik Kode Barcode atau SKU
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#656c7d]" />
                <input
                  type="text"
                  placeholder="Contoh: 899276100101..."
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 bg-[#171920] border border-[#2b2e3a] rounded-xl text-xs text-white placeholder-[#5a6070] focus:outline-hidden focus:border-white transition-colors font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Scan
              </button>
            </div>
          </form>

          {/* Quick Click-to-Scan Barcode Chips from Existing Catalog */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#737a8c] mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Tes Cepat Barcode Produk:
            </p>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {products.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => triggerBarcode(p.barcode)}
                  className="p-2 rounded-lg bg-[#181a21] border border-[#262934] text-left hover:border-emerald-500/50 hover:bg-[#20232c] transition-colors cursor-pointer group"
                >
                  <p className="text-[11px] font-semibold text-white truncate group-hover:text-emerald-300">
                    {p.name}
                  </p>
                  <p className="text-[10px] font-mono text-[#737a8c]">{p.barcode}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
