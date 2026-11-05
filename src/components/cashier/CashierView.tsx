import React, { useState } from 'react';
import { usePos } from '../../store/posStore';
import { Product, CartItem, Order } from '../../types/pos';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { PaymentModal } from './PaymentModal';
import {
  Search,
  ScanBarcode,
  Plus,
  Minus,
  Trash2,
  Tag,
  FileEdit,
  RotateCcw,
  Printer,
  ShoppingBag,
  User,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CashierView: React.FC = () => {
  const {
    products,
    categories,
    cart,
    addToCart,
    updateCartQuantity,
    updateCartItemDiscount,
    updateCartItemNotes,
    removeFromCart,
    clearCart,
    cartDiscount,
    setCartDiscount,
    cartDiscountPercent,
    setCartDiscountPercent,
    customerName,
    setCustomerName,
    cartSubtotal,
    cartTax,
    cartServiceCharge,
    cartGrandTotal,
    orders,
    openReceiptModal,
    storeProfile,
  } = usePos();

  const [activeCashierSubTab, setActiveCashierSubTab] = useState<'register' | 'history'>('register');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [editingItemDiscountId, setEditingItemDiscountId] = useState<string | null>(null);
  const [itemDiscountInput, setItemDiscountInput] = useState<number>(0);
  const [editingItemNotesId, setEditingItemNotesId] = useState<string | null>(null);
  const [itemNotesInput, setItemNotesInput] = useState<string>('');

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBarcodeScanned = (barcode: string) => {
    const match = products.find(
      (p) => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase()
    );
    if (match) {
      addToCart(match);
    }
  };

  const handlePaymentSuccess = (completedOrder: Order) => {
    setIsPaymentOpen(false);
    openReceiptModal(completedOrder);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Kasir Top Navigation / Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232630] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveCashierSubTab('register')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCashierSubTab === 'register'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#8e95a5] hover:text-white hover:bg-[#181a21]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Penjualan Baru</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] font-black flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveCashierSubTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCashierSubTab === 'history'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#8e95a5] hover:text-white hover:bg-[#181a21]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Riwayat Transaksi</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#20232c] text-[#8e95a5] text-[10px] font-mono">
              {orders.length}
            </span>
          </button>
        </div>

        {activeCashierSubTab === 'register' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1e2027] border border-[#2b2e3a] text-xs font-bold text-white hover:bg-[#252833] transition-colors cursor-pointer"
            >
              <ScanBarcode className="w-4 h-4 text-emerald-400" />
              <span>Scan Barcode (F2)</span>
            </button>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Keranjang</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* VIEW 1: REGISTER PENJUALAN BARU */}
      {activeCashierSubTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Product Catalog & Search (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Search Input Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#646b7c]" />
                <input
                  type="text"
                  placeholder="Cari produk berdasarkan nama, SKU, atau barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#14161b] border border-[#242732] rounded-2xl text-xs text-white placeholder-[#606778] focus:outline-hidden focus:border-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8e95a5] hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#15171c] text-[#8e95a5] border border-[#232630] hover:text-white'
                }`}
              >
                Semua Kategori
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#15171c] text-[#8e95a5] border border-[#232630] hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock <= p.minStockAlert && !isOutOfStock;
                const cartQty = cart.find((item) => item.product.id === p.id)?.quantity || 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`relative bg-[#14161b] border rounded-2xl p-3.5 flex flex-col justify-between transition-all select-none ${
                      isOutOfStock
                        ? 'border-red-900/30 opacity-60 cursor-not-allowed'
                        : 'border-[#232630] hover:border-[#3e4354] hover:bg-[#181a21] cursor-pointer group active:scale-[0.98]'
                    }`}
                  >
                    {/* Top badging */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-mono text-[#737a8c] truncate">
                        {p.sku}
                      </span>
                      {cartQty > 0 && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] font-black flex items-center justify-center">
                          {cartQty}
                        </span>
                      )}
                    </div>

                    {/* Product Name & Details */}
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-[#737a8c] mt-0.5 line-clamp-1">
                        {p.description}
                      </p>
                    </div>

                    {/* Price and Stock Indicator */}
                    <div className="mt-4 pt-2 border-t border-[#1f222a] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono font-black text-white">
                          Rp {p.sellingPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isOutOfStock
                            ? 'bg-red-500/20 text-red-300'
                            : isLowStock
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-[#20232c] text-[#8e95a5]'
                        }`}
                      >
                        {isOutOfStock ? 'Habis' : `Stok: ${p.stock}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-[#14161b] border border-[#232630] rounded-2xl">
                <p className="text-sm font-semibold text-white">Tidak ada produk ditemukan</p>
                <p className="text-xs text-[#8e95a5] mt-1">Coba kata kunci lain atau ubah kategori</p>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Cart Panel (4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#14161b] border border-[#232630] rounded-3xl p-5 shadow-xl flex flex-col justify-between sticky top-20 min-h-[580px]">
            <div>
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-[#232630] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Keranjang Pesanan</h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#8e95a5]">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </div>

              {/* Customer Name Selector */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-[#8e95a5] mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Nama Pelanggan
                </label>
                <input
                  type="text"
                  placeholder="Pelanggan Umum..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#191b22] border border-[#262934] rounded-xl text-xs text-white focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Cart Items List */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {cart.map((item) => {
                  const lineTotal =
                    item.product.sellingPrice * item.quantity - (item.itemDiscount || 0);

                  return (
                    <div
                      key={item.product.id}
                      className="bg-[#191b22] border border-[#262934] rounded-2xl p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-white leading-tight">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-[#8e95a5] font-mono mt-0.5">
                            @ Rp {item.product.sellingPrice.toLocaleString('id-ID')}
                          </p>
                          {item.itemDiscount > 0 && (
                            <p className="text-[10px] text-amber-400 font-mono">
                              Diskon: -Rp {item.itemDiscount.toLocaleString('id-ID')}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-[10px] text-emerald-300 italic">*{item.notes}</p>
                          )}
                        </div>

                        {/* Line Total */}
                        <p className="text-xs font-mono font-bold text-white">
                          Rp {lineTotal.toLocaleString('id-ID')}
                        </p>
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#232630]">
                        {/* Notes and Discount buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItemDiscountId(item.product.id);
                              setItemDiscountInput(item.itemDiscount || 0);
                            }}
                            title="Diskon Item"
                            className="p-1 rounded-lg text-[#8e95a5] hover:text-white hover:bg-[#252833] text-[10px] flex items-center gap-0.5 cursor-pointer"
                          >
                            <Tag className="w-3 h-3 text-amber-400" />
                            <span>Diskon</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingItemNotesId(item.product.id);
                              setItemNotesInput(item.notes || '');
                            }}
                            title="Tambah Catatan"
                            className="p-1 rounded-lg text-[#8e95a5] hover:text-white hover:bg-[#252833] text-[10px] flex items-center gap-0.5 cursor-pointer"
                          >
                            <FileEdit className="w-3 h-3 text-blue-400" />
                            <span>Catatan</span>
                          </button>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 bg-[#121418] px-2 py-0.5 rounded-lg border border-[#242732]">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="text-[#8e95a5] hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="text-[#8e95a5] hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-400 hover:text-red-300 ml-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Item Discount Popover */}
                      {editingItemDiscountId === item.product.id && (
                        <div className="p-2 bg-[#13151a] rounded-xl border border-[#2e323e] flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Nominal diskon (Rp)..."
                            value={itemDiscountInput || ''}
                            onChange={(e) => setItemDiscountInput(Number(e.target.value))}
                            className="flex-1 px-2 py-1 bg-[#1c1f27] border border-[#2e323e] rounded-lg text-xs text-white"
                          />
                          <button
                            onClick={() => {
                              updateCartItemDiscount(item.product.id, itemDiscountInput);
                              setEditingItemDiscountId(null);
                            }}
                            className="px-2.5 py-1 bg-white text-black text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Simpan
                          </button>
                        </div>
                      )}

                      {/* Inline Item Notes Popover */}
                      {editingItemNotesId === item.product.id && (
                        <div className="p-2 bg-[#13151a] rounded-xl border border-[#2e323e] flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Contoh: Less sugar / Extra ice..."
                            value={itemNotesInput}
                            onChange={(e) => setItemNotesInput(e.target.value)}
                            className="flex-1 px-2 py-1 bg-[#1c1f27] border border-[#2e323e] rounded-lg text-xs text-white"
                          />
                          <button
                            onClick={() => {
                              updateCartItemNotes(item.product.id, itemNotesInput);
                              setEditingItemNotesId(null);
                            }}
                            className="px-2.5 py-1 bg-white text-black text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Simpan
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {cart.length === 0 && (
                  <div className="text-center py-12 text-[#6c7283]">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-medium">Keranjang masih kosong</p>
                    <p className="text-[10px] mt-0.5">Pilih produk di sebelah kiri atau scan barcode</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Financial Summary & Checkout CTA */}
            <div className="mt-4 pt-3 border-t border-[#232630] space-y-2 text-xs">
              {/* Diskon Transaksi Manual */}
              <div className="flex items-center justify-between">
                <span className="text-[#8e95a5]">Diskon Manual (% / Rp):</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Rp"
                    value={cartDiscount || ''}
                    onChange={(e) => {
                      setCartDiscount(Number(e.target.value));
                      setCartDiscountPercent(0);
                    }}
                    className="w-20 px-2 py-0.5 bg-[#191b22] border border-[#262934] rounded-lg text-right font-mono text-xs text-amber-400"
                  />
                  <input
                    type="number"
                    placeholder="%"
                    value={cartDiscountPercent || ''}
                    onChange={(e) => {
                      setCartDiscountPercent(Number(e.target.value));
                      setCartDiscount(0);
                    }}
                    className="w-12 px-2 py-0.5 bg-[#191b22] border border-[#262934] rounded-lg text-right font-mono text-xs text-amber-400"
                  />
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between text-[#8e95a5]">
                <span>Subtotal Bersih</span>
                <span className="font-mono text-white tabular-nums">
                  Rp {cartSubtotal.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Biaya Layanan */}
              {storeProfile.serviceChargeEnabled && (
                <div className="flex justify-between text-[#8e95a5]">
                  <span>Biaya Layanan ({storeProfile.serviceChargeRate}%)</span>
                  <span className="font-mono text-white tabular-nums">
                    Rp {cartServiceCharge.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {/* PPN */}
              {storeProfile.taxEnabled && (
                <div className="flex justify-between text-[#8e95a5]">
                  <span>PPN ({storeProfile.taxRate}%)</span>
                  <span className="font-mono text-white tabular-nums">
                    Rp {cartTax.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {/* Grand Total */}
              <div className="flex justify-between text-sm font-black pt-2 border-t border-[#262934]">
                <span className="text-white">Total Tagihan</span>
                <span className="font-mono text-white text-base tabular-nums">
                  Rp {cartGrandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Bayar CTA */}
              <button
                disabled={cart.length === 0}
                onClick={() => setIsPaymentOpen(true)}
                className={`w-full mt-3 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  cart.length > 0
                    ? 'bg-white text-black hover:bg-neutral-200 active:scale-[0.99]'
                    : 'bg-[#20232c] text-[#555a69] cursor-not-allowed'
                }`}
              >
                <span>Bayar Sekarang (F9)</span>
                <span className="font-mono tabular-nums">
                  · Rp {cartGrandTotal.toLocaleString('id-ID')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: RIWAYAT TRANSAKSI & CETAK ULANG STRUK */}
      {activeCashierSubTab === 'history' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#232630] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Riwayat Transaksi Toko</h3>
              <p className="text-xs text-[#8e95a5]">
                Daftar seluruh pesanan yang telah selesai. Klik "Cetak Ulang Struk" untuk thermal receipt.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181a20] text-[#8e95a5] border-b border-[#232630]">
                <tr>
                  <th className="px-4 py-3 font-semibold">No. Transaksi</th>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold">Kasir</th>
                  <th className="px-4 py-3 font-semibold">Pelanggan</th>
                  <th className="px-4 py-3 font-semibold">Metode</th>
                  <th className="px-4 py-3 font-semibold text-center">Jumlah Item</th>
                  <th className="px-4 py-3 font-semibold text-right">Grand Total</th>
                  <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2129]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#191c23] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white">
                      {ord.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-[#8e95a5]">
                      {new Date(ord.date).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{ord.cashierName}</td>
                    <td className="px-4 py-3 text-[#a0a7b5]">{ord.customerName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#20232c] text-[#8e95a5] font-mono uppercase text-[10px]">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-[#a0a7b5]">
                      {ord.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-white">
                      Rp {ord.grandTotal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openReceiptModal(ord)}
                        className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Ulang Struk</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanMatch={handleBarcodeScanned}
      />

      {/* Payment Processing Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
