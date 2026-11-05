import React, { useState, useEffect } from 'react';
import { usePos } from '../../store/posStore';
import { Product } from '../../types/pos';
import { X, CheckCircle, Package } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { categories, addProduct, updateProduct } = usePos();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [unit, setUnit] = useState('Pcs');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setBarcode(productToEdit.barcode);
      setDescription(productToEdit.description || '');
      setCategoryId(productToEdit.categoryId);
      setCostPrice(productToEdit.costPrice);
      setSellingPrice(productToEdit.sellingPrice);
      setStock(productToEdit.stock);
      setMinStockAlert(productToEdit.minStockAlert);
      setUnit(productToEdit.unit);
    } else {
      setName('');
      setSku(`CRB-${Date.now().toString().slice(-4)}`);
      setBarcode(`8992${Math.floor(10000000 + Math.random() * 90000000)}`);
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      setCostPrice(10000);
      setSellingPrice(25000);
      setStock(20);
      setMinStockAlert(5);
      setUnit('Pcs');
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        sku,
        barcode,
        description,
        categoryId,
        costPrice,
        sellingPrice,
        stock,
        minStockAlert,
        unit,
      });
    } else {
      addProduct({
        name,
        sku,
        barcode,
        description,
        categoryId,
        costPrice,
        sellingPrice,
        stock,
        minStockAlert,
        unit,
        isActive: true,
      });
    }
    onClose();
  };

  const marginPercent =
    sellingPrice > 0 ? (((sellingPrice - costPrice) / sellingPrice) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#15171c] border border-[#272b36] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232630] bg-[#111317]">
          <div className="flex items-center gap-2 text-white">
            <Package className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold">
              {productToEdit ? 'Edit Data Produk' : 'Tambah Produk Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#8e95a5] hover:text-white hover:bg-[#20232c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Nama Produk */}
          <div>
            <label className="font-bold text-[#8e95a5] mb-1 block">Nama Produk *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Double Espresso Romano"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#191b22] border border-[#272a35] rounded-xl text-white focus:outline-hidden focus:border-white transition-colors"
            />
          </div>

          {/* SKU & Barcode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">SKU / Kode Barang *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Barcode EAN *</label>
              <input
                type="text"
                required
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white font-mono"
              />
            </div>
          </div>

          {/* Kategori & Satuan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Satuan (Unit)</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white"
              >
                {['Pcs', 'Cup', 'Botol', 'Porsi', 'Pack', 'Kg', 'Gram'].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Harga Modal & Harga Jual */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Harga Modal (Rp)</label>
              <input
                type="number"
                value={costPrice || ''}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Harga Jual (Rp) *</label>
              <input
                type="number"
                required
                value={sellingPrice || ''}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Margin indicator */}
          <div className="p-3 bg-[#181a21] rounded-xl border border-[#262934] flex items-center justify-between text-xs">
            <span className="text-[#8e95a5]">Estimasi Margin Keuntungan:</span>
            <span className="font-mono font-bold text-emerald-400">
              {marginPercent}% (Rp {(sellingPrice - costPrice).toLocaleString('id-ID')})
            </span>
          </div>

          {/* Stok Awal & Batas Minimum */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Stok Saat Ini</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-[#8e95a5] mb-1 block">Batas Minimum Alert</label>
              <input
                type="number"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white font-mono"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="font-bold text-[#8e95a5] mb-1 block">Deskripsi Singkat</label>
            <textarea
              rows={2}
              placeholder="Catatan bahan, varian, atau spesifikasi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#191b22] border border-[#272a35] rounded-xl text-white"
            />
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
              {productToEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
