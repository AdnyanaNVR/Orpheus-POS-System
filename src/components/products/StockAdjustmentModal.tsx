import React, { useState } from 'react';
import { usePos } from '../../store/posStore';
import { Product } from '../../types/pos';
import { X, Layers, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { adjustStock } = usePos();
  const [changeType, setChangeType] = useState<'restock' | 'adjustment' | 'damaged' | 'return'>('restock');
  const [qtyInput, setQtyInput] = useState<number>(10);
  const [reason, setReason] = useState<string>('Penerimaan dari supplier');

  if (!isOpen || !product) return null;

  const currentStock = product.stock;
  // If damaged, change is negative
  const actualQtyChange = changeType === 'damaged' ? -Math.abs(qtyInput) : qtyInput;
  const projectedStock = Math.max(0, currentStock + actualQtyChange);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustStock(product.id, actualQtyChange, changeType, reason || 'Penyesuaian stok opname');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#15171c] border border-[#272b36] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232630] bg-[#111317]">
          <div className="flex items-center gap-2 text-white">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold">Penyesuaian Stok (Opname)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#8e95a5] hover:text-white hover:bg-[#20232c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Product Summary */}
          <div className="p-3 bg-[#191b22] border border-[#272a35] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-xs">{product.name}</p>
              <p className="text-[10px] font-mono text-[#8e95a5]">{product.sku}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8e95a5]">Stok Sekarang</span>
              <p className="font-mono font-bold text-white text-sm">
                {currentStock} {product.unit}
              </p>
            </div>
          </div>

          {/* Type of Adjustment */}
          <div>
            <label className="font-bold text-[#8e95a5] mb-1.5 block">Jenis Mutasi Stok</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'restock', label: 'Barang Masuk (+)' },
                { id: 'adjustment', label: 'Koreksi Hitung (±)' },
                { id: 'damaged', label: 'Rusak / Kadaluarsa (-)' },
                { id: 'return', label: 'Retur Pelanggan (+)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setChangeType(t.id as any);
                    if (t.id === 'restock') setReason('Penerimaan dari supplier');
                    if (t.id === 'damaged') setReason('Barang rusak / bocor');
                    if (t.id === 'adjustment') setReason('Hasil stok opname mingguan');
                    if (t.id === 'return') setReason('Retur kondisi baik');
                  }}
                  className={`p-2 rounded-xl text-left border transition-colors cursor-pointer font-medium ${
                    changeType === t.id
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#181a21] text-[#8e95a5] border-[#262934] hover:bg-[#20232c]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Change Input */}
          <div>
            <label className="font-bold text-[#8e95a5] mb-1 block">
              Jumlah Perubahan ({product.unit})
            </label>
            <input
              type="number"
              required
              min={1}
              value={qtyInput || ''}
              onChange={(e) => setQtyInput(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#191b22] border border-[#272a35] rounded-xl text-base font-mono font-bold text-white focus:outline-hidden focus:border-white transition-colors"
            />
          </div>

          {/* Reason / Notes */}
          <div>
            <label className="font-bold text-[#8e95a5] mb-1 block">Alasan / Catatan Berita Acara</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white"
            />
          </div>

          {/* Projection Preview */}
          <div className="p-3 bg-[#111317] border border-[#232630] rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#8e95a5]">Proyeksi Stok Akhir:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#8e95a5] line-through">{currentStock}</span>
              <span className="text-white">→</span>
              <span className="font-mono font-black text-emerald-400 text-sm">
                {projectedStock} {product.unit}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#232630]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8e95a5] hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer shadow"
            >
              Konfirmasi Perubahan Stok
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
