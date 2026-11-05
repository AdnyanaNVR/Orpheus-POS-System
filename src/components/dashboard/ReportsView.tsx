import React, { useState } from 'react';
import { usePos } from '../../store/posStore';
import {
  FileText,
  Download,
  Calendar,
  Layers,
  Users,
  Wallet,
  Printer,
  TrendingUp,
  PackageCheck,
  Search,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, products, categories, currentShift, storeProfile, users } = usePos();
  const [reportSubTab, setReportSubTab] = useState<'sales' | 'products' | 'categories' | 'cashiers' | 'stock' | 'shifts'>('sales');
  const [timeFilter, setTimeFilter] = useState<'daily' | 'monthly'>('daily');
  const [searchTerm, setSearchTerm] = useState('');

  // Total summary figures
  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalDiscount = orders.reduce((acc, o) => acc + o.discountAmount, 0);
  const totalTax = orders.reduce((acc, o) => acc + o.taxAmount, 0);

  // Group by product sales
  const productSalesMap = new Map<string, { product: (typeof products)[0]; qty: number; total: number }>();
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      const existing = productSalesMap.get(item.product.id) || {
        product: item.product,
        qty: 0,
        total: 0,
      };
      existing.qty += item.quantity;
      existing.total += item.product.sellingPrice * item.quantity;
      productSalesMap.set(item.product.id, existing);
    });
  });
  const productSalesList = Array.from(productSalesMap.values()).sort((a, b) => b.total - a.total);

  // Group by category sales
  const categorySalesMap = new Map<string, number>();
  categories.forEach((c) => categorySalesMap.set(c.id, 0));
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      const catId = item.product.categoryId;
      const current = categorySalesMap.get(catId) || 0;
      categorySalesMap.set(catId, current + item.product.sellingPrice * item.quantity);
    });
  });

  // Group by cashier sales
  const cashierSalesMap = new Map<string, { name: string; transactions: number; total: number }>();
  orders.forEach((ord) => {
    const existing = cashierSalesMap.get(ord.cashierId) || {
      name: ord.cashierName,
      transactions: 0,
      total: 0,
    };
    existing.transactions += 1;
    existing.total += ord.grandTotal;
    cashierSalesMap.set(ord.cashierId, existing);
  });
  const cashierSalesList = Array.from(cashierSalesMap.values());

  // Export Excel / CSV
  const handleExportCSV = () => {
    let csvHeader = '';
    let csvRows = '';

    if (reportSubTab === 'sales') {
      csvHeader = 'No Transaksi,Tanggal,Kasir,Pelanggan,Metode,Subtotal,Diskon,Pajak,Total\n';
      csvRows = orders
        .map(
          (o) =>
            `"${o.orderNumber}","${new Date(o.date).toLocaleString('id-ID')}","${o.cashierName}","${o.customerName}","${o.paymentMethod}",${o.subtotal},${o.discountAmount},${o.taxAmount},${o.grandTotal}`
        )
        .join('\n');
    } else if (reportSubTab === 'products') {
      csvHeader = 'SKU,Nama Produk,Kategori,Unit,Terjual (Qty),Total Omzet\n';
      csvRows = productSalesList
        .map(
          (p) =>
            `"${p.product.sku}","${p.product.name}","${p.product.unit}",${p.qty},${p.total}`
        )
        .join('\n');
    } else if (reportSubTab === 'stock') {
      csvHeader = 'SKU,Barcode,Nama Produk,Kategori,Harga Modal,Harga Jual,Stok Saat Ini,Batas Min,Nilai Aset\n';
      csvRows = products
        .map(
          (p) =>
            `"${p.sku}","${p.barcode}","${p.name}","${p.categoryId}",${p.costPrice},${p.sellingPrice},${p.stock},${p.minStockAlert},${p.costPrice * p.stock}`
        )
        .join('\n');
    } else {
      csvHeader = 'ID Kasir,Nama Kasir,Jumlah Transaksi,Total Omzet\n';
      csvRows = cashierSalesList
        .map((c) => `"${c.name}",${c.transactions},${c.total}`)
        .join('\n');
    }

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `corbel-laporan-${reportSubTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Laporan & Analitika</h2>
          <p className="text-xs text-[#8e95a5] mt-1">
            Data pembukuan penjualan, mutasi stok barang, dan rekapitulasi shift kasir
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e2129] border border-[#2c303c] text-xs font-semibold text-white hover:bg-[#272b36] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel / CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF / Struk</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl p-4">
          <p className="text-xs text-[#8e95a5]">Total Omzet Terverifikasi</p>
          <p className="text-xl font-extrabold text-white font-mono mt-1">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold">
            {orders.length} Transaksi Selesai
          </span>
        </div>
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl p-4">
          <p className="text-xs text-[#8e95a5]">Total Diskon Diberikan</p>
          <p className="text-xl font-extrabold text-amber-400 font-mono mt-1">
            Rp {totalDiscount.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-[#8e95a5]">Promo & Voucher</span>
        </div>
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl p-4">
          <p className="text-xs text-[#8e95a5]">Total Pajak (PPN 11%)</p>
          <p className="text-xl font-extrabold text-[#9da5b5] font-mono mt-1">
            Rp {totalTax.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-[#8e95a5]">Kewajiban Faktur</span>
        </div>
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl p-4">
          <p className="text-xs text-[#8e95a5]">Total Item Terjual</p>
          <p className="text-xl font-extrabold text-white font-mono mt-1">
            {productSalesList.reduce((acc, p) => acc + p.qty, 0)} Item
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold">Stok Aman Terpantau</span>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232630] pb-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'sales', label: 'Penjualan Transaksi' },
            { id: 'products', label: 'Per Produk' },
            { id: 'categories', label: 'Per Kategori' },
            { id: 'cashiers', label: 'Per Kasir' },
            { id: 'stock', label: 'Valuasi & Stok' },
            { id: 'shifts', label: 'Kas & Shift Kasir' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                reportSubTab === tab.id
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-[#8e95a5] hover:text-white hover:bg-[#1a1d24]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {reportSubTab === 'sales' && (
          <div className="flex items-center p-0.5 rounded-lg bg-[#15171c] border border-[#242732]">
            <button
              onClick={() => setTimeFilter('daily')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
                timeFilter === 'daily' ? 'bg-[#292c36] text-white' : 'text-[#8e95a5]'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
                timeFilter === 'monthly' ? 'bg-[#292c36] text-white' : 'text-[#8e95a5]'
              }`}
            >
              Bulanan
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Sales Transactions List */}
      {reportSubTab === 'sales' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181a20] text-[#8e95a5] border-b border-[#232630]">
                <tr>
                  <th className="px-4 py-3 font-semibold">No. Transaksi</th>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold">Kasir</th>
                  <th className="px-4 py-3 font-semibold">Pelanggan</th>
                  <th className="px-4 py-3 font-semibold">Metode</th>
                  <th className="px-4 py-3 font-semibold text-right">Subtotal</th>
                  <th className="px-4 py-3 font-semibold text-right">Diskon</th>
                  <th className="px-4 py-3 font-semibold text-right">Pajak</th>
                  <th className="px-4 py-3 font-semibold text-right">Grand Total</th>
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
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[#a0a7b5]">
                      Rp {ord.subtotal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-amber-400">
                      {ord.discountAmount > 0
                        ? `-Rp ${ord.discountAmount.toLocaleString('id-ID')}`
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[#8e95a5]">
                      Rp {ord.taxAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-white">
                      Rp {ord.grandTotal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Sales Per Product */}
      {reportSubTab === 'products' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#232630] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Peringkat Penjualan Produk Terlaris</h3>
            <span className="text-xs text-[#8e95a5]">{productSalesList.length} Produk Terjual</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181a20] text-[#8e95a5] border-b border-[#232630]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Peringkat</th>
                  <th className="px-4 py-3 font-semibold">SKU / Barcode</th>
                  <th className="px-4 py-3 font-semibold">Nama Produk</th>
                  <th className="px-4 py-3 font-semibold text-center">Unit</th>
                  <th className="px-4 py-3 font-semibold text-right">Qty Terjual</th>
                  <th className="px-4 py-3 font-semibold text-right">Harga Jual Rata-rata</th>
                  <th className="px-4 py-3 font-semibold text-right">Total Kontribusi Omzet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2129]">
                {productSalesList.map((item, idx) => (
                  <tr key={item.product.id} className="hover:bg-[#191c23] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-center w-12 text-[#8e95a5]">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#8e95a5]">{item.product.sku}</td>
                    <td className="px-4 py-3 font-bold text-white">{item.product.name}</td>
                    <td className="px-4 py-3 text-center text-[#8e95a5]">{item.product.unit}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                      {item.qty}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[#a0a7b5]">
                      Rp {item.product.sellingPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white">
                      Rp {item.total.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Sales Per Category */}
      {reportSubTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const catTotal = categorySalesMap.get(cat.id) || 0;
            const percentage = totalRevenue > 0 ? ((catTotal / totalRevenue) * 100).toFixed(1) : '0';
            return (
              <div
                key={cat.id}
                className="bg-[#14161b] border border-[#232630] rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: cat.color }}
                        className="w-3 h-3 rounded-full"
                      ></span>
                      <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#8e95a5]">{percentage}%</span>
                  </div>

                  <p className="text-2xl font-black text-white font-mono mt-4">
                    Rp {catTotal.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#20232c] h-2 rounded-full overflow-hidden mt-4">
                  <div
                    style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                    className="h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: Sales Per Cashier */}
      {reportSubTab === 'cashiers' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181a20] text-[#8e95a5] border-b border-[#232630]">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama Kasir</th>
                <th className="px-4 py-3 font-semibold text-center">Jumlah Transaksi</th>
                <th className="px-4 py-3 font-semibold text-right">Rata-rata Transaksi</th>
                <th className="px-4 py-3 font-semibold text-right">Total Omzet Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2129]">
              {cashierSalesList.map((cashier, idx) => (
                <tr key={idx} className="hover:bg-[#191c23] transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{cashier.name}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-[#8e95a5]">
                    {cashier.transactions}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[#a0a7b5]">
                    Rp{' '}
                    {cashier.transactions > 0
                      ? Math.round(cashier.total / cashier.transactions).toLocaleString('id-ID')
                      : '0'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white">
                    Rp {cashier.total.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Stock & Valuation */}
      {reportSubTab === 'stock' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#232630] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white">Laporan Nilai Aset Inventaris</h3>
            <div className="text-xs text-[#8e95a5]">
              Total Nilai Modal:{' '}
              <strong className="text-emerald-400 font-mono font-bold">
                Rp{' '}
                {products
                  .reduce((acc, p) => acc + p.costPrice * p.stock, 0)
                  .toLocaleString('id-ID')}
              </strong>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181a20] text-[#8e95a5] border-b border-[#232630]">
                <tr>
                  <th className="px-4 py-3 font-semibold">SKU</th>
                  <th className="px-4 py-3 font-semibold">Produk</th>
                  <th className="px-4 py-3 font-semibold text-right">Harga Modal</th>
                  <th className="px-4 py-3 font-semibold text-right">Harga Jual</th>
                  <th className="px-4 py-3 font-semibold text-center">Stok</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Valuasi Aset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2129]">
                {products.map((p) => {
                  const isLow = p.stock <= p.minStockAlert;
                  return (
                    <tr key={p.id} className="hover:bg-[#191c23] transition-colors">
                      <td className="px-4 py-3 font-mono text-[#8e95a5]">{p.sku}</td>
                      <td className="px-4 py-3 font-bold text-white">{p.name}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#a0a7b5]">
                        Rp {p.costPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#a0a7b5]">
                        Rp {p.sellingPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-white">
                        {p.stock} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isLow
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isLow ? 'Stok Menipis' : 'Aman'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-white">
                        Rp {(p.costPrice * p.stock).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Shifts & Cash Rekap */}
      {reportSubTab === 'shifts' && (
        <div className="bg-[#14161b] border border-[#232630] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Sesi Shift Kasir Saat Ini</h3>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                currentShift?.status === 'open'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-[#292c36] text-[#8e95a5]'
              }`}
            >
              {currentShift?.status === 'open' ? 'Shift Sedang Berjalan' : 'Shift Ditutup'}
            </span>
          </div>

          {currentShift ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="bg-[#181a20] p-4 rounded-xl border border-[#262933]">
                <p className="text-xs text-[#8e95a5]">Kas Awal (Modal)</p>
                <p className="text-lg font-bold font-mono text-white mt-1">
                  Rp {currentShift.initialCash.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-[#8e95a5] mt-1">
                  Buka: {new Date(currentShift.openedAt).toLocaleTimeString('id-ID')}
                </p>
              </div>
              <div className="bg-[#181a20] p-4 rounded-xl border border-[#262933]">
                <p className="text-xs text-[#8e95a5]">Penjualan Tunai</p>
                <p className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  Rp {currentShift.totalSalesCash.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-[#8e95a5] mt-1">Masuk laci kasir</p>
              </div>
              <div className="bg-[#181a20] p-4 rounded-xl border border-[#262933]">
                <p className="text-xs text-[#8e95a5]">Penjualan Non-Tunai (QRIS/Kartu)</p>
                <p className="text-lg font-bold font-mono text-blue-400 mt-1">
                  Rp {currentShift.totalSalesNonCash.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-[#8e95a5] mt-1">Transfer langsung</p>
              </div>
              <div className="bg-[#181a20] p-4 rounded-xl border border-[#262933]">
                <p className="text-xs text-[#8e95a5]">Ekspektasi Kas Fisik</p>
                <p className="text-lg font-bold font-mono text-white mt-1">
                  Rp {currentShift.expectedCash.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-[#8e95a5] mt-1">Modal + Tunai Masuk</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8e95a5]">Belum ada shift yang dibuka.</p>
          )}
        </div>
      )}
    </div>
  );
};
