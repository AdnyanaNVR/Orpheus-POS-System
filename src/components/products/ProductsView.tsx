import React, { useState, useRef } from 'react';
import { usePos } from '../../store/posStore';
import { Product } from '../../types/pos';
import { ProductModal } from './ProductModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, categories, deleteProduct, addProduct, currentUser } = usePos();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.stock <= p.minStockAlert && p.stock > 0;
    if (stockFilter === 'out') matchesStock = p.stock <= 0;

    return matchesSearch && matchesCat && matchesStock;
  });

  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  // Export to Excel / CSV
  const handleExportCSV = () => {
    const headers = 'SKU,Barcode,Nama Produk,Kategori,Harga Modal,Harga Jual,Stok,Batas Min,Unit,Status\n';
    const rows = products
      .map(
        (p) =>
          `"${p.sku}","${p.barcode}","${p.name}","${p.categoryId}",${p.costPrice},${p.sellingPrice},${p.stock},${p.minStockAlert},"${p.unit}","${p.isActive ? 'Aktif' : 'Nonaktif'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `katalog-produk-corbel-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import from Excel / CSV
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      let importedCount = 0;

      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 6) {
          const sku = cols[0] || `IMP-${Date.now()}-${i}`;
          const barcode = cols[1] || `8992${Math.floor(10000000 + Math.random() * 90000000)}`;
          const name = cols[2];
          const costPrice = Number(cols[4]) || 10000;
          const sellingPrice = Number(cols[5]) || 20000;
          const stock = Number(cols[6]) || 10;
          const minStockAlert = Number(cols[7]) || 5;
          const unit = cols[8] || 'Pcs';

          if (name) {
            addProduct({
              sku,
              barcode,
              name,
              description: 'Imported via CSV',
              categoryId: categories[0]?.id || 'cat-coffee',
              costPrice,
              sellingPrice,
              stock,
              minStockAlert,
              unit,
              isActive: true,
            });
            importedCount++;
          }
        }
      }
      alert(`Berhasil mengimpor ${importedCount} produk baru!`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Katalog Produk & Stok</h2>
          <p className="text-xs text-[#8e95a5] mt-1">
            Kelola master data produk, harga jual, margin, dan pemantauan level stok barang
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden File input for CSV Import */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv, text/csv"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a1c22] border border-[#2b2e3a] text-xs font-semibold text-white hover:bg-[#22252e] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Import Excel / CSV</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a1c22] border border-[#2b2e3a] text-xs font-semibold text-white hover:bg-[#22252e] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#656c7d]" />
          <input
            type="text"
            placeholder="Cari SKU, Barcode, atau nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#14161b] border border-[#242732] rounded-xl text-xs text-white placeholder-[#606778] focus:outline-hidden focus:border-white transition-colors"
          />
        </div>

        {/* Category & Stock Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#14161b] border border-[#242732] rounded-xl text-xs text-white focus:outline-hidden"
          >
            <option value="all">Semua Kategori ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center p-1 rounded-xl bg-[#14161b] border border-[#232630]">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold cursor-pointer ${
                stockFilter === 'all' ? 'bg-[#292c36] text-white' : 'text-[#8e95a5]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold cursor-pointer flex items-center gap-1 ${
                stockFilter === 'low'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-[#8e95a5]'
              }`}
            >
              <span>Menipis</span>
              {lowStockCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center">
                  {lowStockCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold cursor-pointer flex items-center gap-1 ${
                stockFilter === 'out'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'text-[#8e95a5]'
              }`}
            >
              <span>Habis</span>
              {outOfStockCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                  {outOfStockCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#14161b] border border-[#232630] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181a20] text-[#8e95a5] border-b border-[#232630]">
              <tr>
                <th className="px-4 py-3 font-semibold">SKU / Barcode</th>
                <th className="px-4 py-3 font-semibold">Nama Produk</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold text-right">Harga Modal</th>
                <th className="px-4 py-3 font-semibold text-right">Harga Jual</th>
                <th className="px-4 py-3 font-semibold text-center">Margin</th>
                <th className="px-4 py-3 font-semibold text-center">Stok Fisik</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2129]">
              {filteredProducts.map((p) => {
                const category = categories.find((c) => c.id === p.categoryId);
                const isOutOfStock = p.stock <= 0;
                const isLow = p.stock <= p.minStockAlert && !isOutOfStock;
                const margin =
                  p.sellingPrice > 0
                    ? (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(0)
                    : 0;

                return (
                  <tr key={p.id} className="hover:bg-[#191c23] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-white">{p.sku}</div>
                      <div className="font-mono text-[10px] text-[#737a8c]">{p.barcode}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-xs">{p.name}</div>
                      {p.description && (
                        <div className="text-[10px] text-[#737a8c] truncate max-w-xs">
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#1e2027] text-[#a0a7b5] text-[10px] font-medium border border-[#2b2e38]">
                        {category?.name || 'Umum'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[#8e95a5]">
                      Rp {p.costPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white">
                      Rp {p.sellingPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-emerald-400 font-bold">
                      {margin}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="font-mono font-bold text-white">
                        {p.stock} {p.unit}
                      </div>
                      <div className="text-[10px] text-[#737a8c]">Min: {p.minStockAlert}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isOutOfStock
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isLow
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isOutOfStock ? 'Stok Habis' : isLow ? 'Stok Menipis' : 'Tersedia'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedProductForStock(p);
                            setIsStockModalOpen(true);
                          }}
                          title="Atur Stok (Opname)"
                          className="px-2 py-1 rounded-lg bg-[#1f222a] hover:bg-[#282c37] text-white text-[10px] font-bold cursor-pointer"
                        >
                          Atur Stok
                        </button>
                        <button
                          onClick={() => {
                            setProductToEdit(p);
                            setIsProductModalOpen(true);
                          }}
                          title="Edit Produk"
                          className="p-1 rounded-lg text-[#8e95a5] hover:text-white hover:bg-[#232630] cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus ${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          title="Hapus Produk"
                          className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-[#6c7283]">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-semibold">Tidak ada produk yang sesuai filter</p>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        product={selectedProductForStock}
      />
    </div>
  );
};
