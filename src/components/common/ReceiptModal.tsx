import React from 'react';
import { usePos } from '../../store/posStore';
import { Printer, X, CheckCircle, Download, Share2 } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceiptOrder, closeReceiptModal, storeProfile } = usePos();

  if (!selectedReceiptOrder) return null;

  const order = selectedReceiptOrder;
  const is58mm = storeProfile.printerPaperSize === '58mm';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#16181d] border border-[#2b2f3a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242732] bg-[#121418]">
          <div className="flex items-center gap-2 text-white">
            <Printer className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold">Struk Pembayaran Thermal</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#252833] text-[#8e95a5] font-mono">
              {storeProfile.printerPaperSize}
            </span>
          </div>
          <button
            onClick={closeReceiptModal}
            className="p-1 rounded-lg text-[#8e95a5] hover:text-white hover:bg-[#20232c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Container Preview (Simulates paper receipt) */}
        <div className="p-6 overflow-y-auto flex justify-center bg-[#0d0e11]">
          <div
            id="printable-receipt"
            className={`bg-white text-black p-6 font-mono text-xs leading-relaxed shadow-lg ${
              is58mm ? 'w-[260px]' : 'w-[320px]'
            }`}
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            {/* Header */}
            <div className="text-center pb-3 border-b border-dashed border-gray-400">
              <h2 className="text-sm font-black uppercase tracking-wider">{storeProfile.name}</h2>
              <p className="text-[11px] text-gray-700">{storeProfile.tagline}</p>
              <p className="text-[10px] text-gray-600 mt-1 leading-tight">{storeProfile.address}</p>
              <p className="text-[10px] text-gray-600">Telp: {storeProfile.phone}</p>
            </div>

            {/* Order Meta */}
            <div className="py-2.5 border-b border-dashed border-gray-400 text-[11px] space-y-0.5">
              <div className="flex justify-between">
                <span>No. Transaksi</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal</span>
                <span>{new Date(order.date).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir</span>
                <span>{order.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan</span>
                <span>{order.customerName}</span>
              </div>
            </div>

            {/* Items */}
            <div className="py-2.5 border-b border-dashed border-gray-400">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-1">Item</th>
                    <th className="text-center py-1">Qty</th>
                    <th className="text-right py-1">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dotted divide-gray-200">
                  {order.items.map((item, idx) => {
                    const lineTotal = item.product.sellingPrice * item.quantity - (item.itemDiscount || 0);
                    return (
                      <tr key={idx} className="align-top">
                        <td className="py-1 pr-1">
                          <div className="font-semibold">{item.product.name}</div>
                          <div className="text-[10px] text-gray-500">
                            @ Rp {item.product.sellingPrice.toLocaleString('id-ID')}
                            {item.itemDiscount > 0 && ` (-Rp ${item.itemDiscount.toLocaleString('id-ID')})`}
                          </div>
                          {item.notes && <div className="text-[9px] text-gray-500 italic">*{item.notes}</div>}
                        </td>
                        <td className="py-1 text-center font-bold">{item.quantity}</td>
                        <td className="py-1 text-right font-bold tabular-nums">
                          Rp {lineTotal.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="py-2.5 border-b border-dashed border-gray-400 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Diskon</span>
                  <span className="tabular-nums">- Rp {order.discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {order.serviceCharge > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Biaya Layanan ({storeProfile.serviceChargeRate}%)</span>
                  <span className="tabular-nums">Rp {order.serviceCharge.toLocaleString('id-ID')}</span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>PPN ({storeProfile.taxRate}%)</span>
                  <span className="tabular-nums">Rp {order.taxAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black pt-1 border-t border-gray-400">
                <span>TOTAL AKHIR</span>
                <span className="tabular-nums">Rp {order.grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-2.5 border-b border-dashed border-gray-400 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="uppercase">Metode: {order.paymentMethod}</span>
                <span className="font-semibold text-emerald-700">LUNAS</span>
              </div>
              {order.paymentMethod === 'cash' && (
                <>
                  <div className="flex justify-between">
                    <span>Uang Diterima</span>
                    <span className="tabular-nums">Rp {order.tenderAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembalian</span>
                    <span className="tabular-nums">Rp {order.changeAmount.toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
              {order.splitDetails && (
                <div className="text-[10px] text-gray-600 bg-gray-50 p-1.5 rounded">
                  <div>Tunai: Rp {order.splitDetails.cashAmount.toLocaleString('id-ID')}</div>
                  <div>
                    {order.splitDetails.nonCashMethod.toUpperCase()}: Rp{' '}
                    {order.splitDetails.nonCashAmount.toLocaleString('id-ID')}
                  </div>
                  {order.splitDetails.referenceNo && <div>Ref: {order.splitDetails.referenceNo}</div>}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 text-center text-[10px] text-gray-600 space-y-1">
              <p className="font-medium">{storeProfile.receiptHeader}</p>
              <p className="text-[9px] leading-tight">{storeProfile.receiptFooter}</p>
              <div className="pt-2 font-mono text-[9px] text-gray-400">
                *** TERIMA KASIH ***
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#242732] bg-[#121418]">
          <span className="text-xs text-[#8e95a5]">
            Ukuran Kertas: <strong className="text-white">{storeProfile.printerPaperSize}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={closeReceiptModal}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#20232c] text-[#a6adb8] hover:text-white transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Struk (Ctrl+P)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
