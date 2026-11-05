import React, { useState } from 'react';
import { usePos } from '../../store/posStore';
import { PaymentMethod, SplitPaymentDetail, Order } from '../../types/pos';
import {
  CreditCard,
  QrCode,
  Banknote,
  Split,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    cartGrandTotal,
    processCheckout,
    customerName,
    cartSubtotal,
    cartTax,
    cartServiceCharge,
  } = usePos();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [tenderCash, setTenderCash] = useState<number>(cartGrandTotal);
  const [cardRefNo, setCardRefNo] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Split bill states
  const [splitCashAmount, setSplitCashAmount] = useState<number>(Math.floor(cartGrandTotal / 2));
  const [splitNonCashMethod, setSplitNonCashMethod] = useState<'qris' | 'debit_card' | 'credit_card'>('qris');

  if (!isOpen) return null;

  const splitRemaining = Math.max(0, cartGrandTotal - splitCashAmount);
  const cashChange = paymentMethod === 'cash' ? Math.max(0, tenderCash - cartGrandTotal) : 0;
  const isCashInsufficient = paymentMethod === 'cash' && tenderCash < cartGrandTotal;

  // Quick money suggestions
  const quickCashOptions = [
    { label: 'Uang Pas', value: cartGrandTotal },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '150.000', value: 150000 },
    { label: '200.000', value: 200000 },
    { label: '500.000', value: 500000 },
  ].filter((opt) => opt.value >= cartGrandTotal || opt.label === 'Uang Pas');

  const handleConfirmPayment = () => {
    let order: Order;

    if (paymentMethod === 'split') {
      const splitDetails: SplitPaymentDetail = {
        cashAmount: splitCashAmount,
        nonCashAmount: splitRemaining,
        nonCashMethod: splitNonCashMethod,
        referenceNo: cardRefNo || `SPLIT-${Date.now().toString().slice(-4)}`,
      };
      order = processCheckout('split', cartGrandTotal, splitDetails, orderNotes);
    } else {
      order = processCheckout(
        paymentMethod,
        paymentMethod === 'cash' ? tenderCash : cartGrandTotal,
        undefined,
        orderNotes
      );
    }

    onSuccess(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#15171c] border border-[#272b36] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232630] bg-[#111317]">
          <div>
            <h3 className="text-base font-bold text-white">Proses Pembayaran</h3>
            <p className="text-xs text-[#8e95a5]">
              Pelanggan: <span className="text-white font-semibold">{customerName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#8e95a5] hover:text-white hover:bg-[#20232c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Big Amount Card */}
          <div className="bg-[#1b1e26] border border-[#2b2f3d] rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-[#8e95a5] uppercase tracking-wider">
              Total Tagihan
            </span>
            <p className="text-3xl md:text-4xl font-black text-white font-mono mt-1">
              Rp {cartGrandTotal.toLocaleString('id-ID')}
            </p>
          </div>

          {/* Payment Method Selector Pills */}
          <div>
            <label className="text-xs font-bold text-[#8e95a5] mb-2 block">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cash', label: 'Tunai', icon: <Banknote className="w-4 h-4" /> },
                { id: 'qris', label: 'QRIS', icon: <QrCode className="w-4 h-4" /> },
                { id: 'debit_card', label: 'Kartu Debit', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'split', label: 'Split Bill', icon: <Split className="w-4 h-4" /> },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-md font-bold'
                        : 'bg-[#181a21] text-[#9ca3af] border-[#262934] hover:bg-[#21242e] hover:text-white'
                    }`}
                  >
                    {m.icon}
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Specific Content */}
          {/* 1. TUNAI */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4 bg-[#121419] p-4 rounded-2xl border border-[#242732]">
              <div>
                <label className="text-xs font-bold text-[#8e95a5] mb-1.5 block">
                  Nominal Uang Diterima (Rp)
                </label>
                <input
                  type="number"
                  value={tenderCash || ''}
                  onChange={(e) => setTenderCash(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[#191b22] border border-[#2c303c] rounded-xl text-xl font-mono font-bold text-white focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-2">
                {quickCashOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTenderCash(opt.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#20232c] hover:bg-[#2a2e3a] text-xs font-mono font-semibold text-white border border-[#2c303d] transition-colors cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Kembalian Calculation */}
              <div className="pt-3 border-t border-[#232630] flex items-center justify-between">
                <span className="text-xs text-[#8e95a5]">Uang Kembalian:</span>
                <span
                  className={`text-xl font-mono font-black ${
                    isCashInsufficient ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {isCashInsufficient
                    ? `Kurang Rp ${(cartGrandTotal - tenderCash).toLocaleString('id-ID')}`
                    : `Rp ${cashChange.toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>
          )}

          {/* 2. QRIS */}
          {paymentMethod === 'qris' && (
            <div className="bg-[#121419] p-5 rounded-2xl border border-[#242732] flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-white rounded-2xl shadow-md">
                {/* Simulated dynamic QR code preview */}
                <div className="w-44 h-44 bg-neutral-900 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="w-full h-full border-4 border-white flex flex-col items-center justify-center bg-white text-black p-2">
                    <QrCode className="w-24 h-24 text-black" />
                    <p className="text-[9px] font-black tracking-widest mt-1">QRIS CORBEL POS</p>
                    <p className="text-[8px] font-mono text-gray-500">NMID: ID1029384819</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-white">Scan dengan GoPay, OVO, Dana, BCA, atau Livin</p>
                <p className="text-[11px] text-[#8e95a5] mt-1">
                  Nominal otomatis terkunci: <strong className="text-white font-mono">Rp {cartGrandTotal.toLocaleString('id-ID')}</strong>
                </p>
              </div>

              <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasi QRIS Aktif & Siap Diterima</span>
              </div>
            </div>
          )}

          {/* 3. KARTU DEBIT / KREDIT */}
          {paymentMethod === 'debit_card' && (
            <div className="bg-[#121419] p-4 rounded-2xl border border-[#242732] space-y-4">
              <div>
                <label className="text-xs font-bold text-[#8e95a5] mb-1.5 block">
                  Nomor Referensi EDC / Approval Code (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: EDC-BCA-98218..."
                  value={cardRefNo}
                  onChange={(e) => setCardRefNo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#191b22] border border-[#2c303c] rounded-xl text-xs font-mono text-white focus:outline-hidden focus:border-white transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#8e95a5]">
                Gesek atau masukkan kartu pada mesin EDC eksternal. Setelah struk EDC tercetak, klik konfirmasi pembayaran di bawah.
              </p>
            </div>
          )}

          {/* 4. SPLIT BILL */}
          {paymentMethod === 'split' && (
            <div className="bg-[#121419] p-4 rounded-2xl border border-[#242732] space-y-4">
              <div>
                <label className="text-xs font-bold text-[#8e95a5] mb-1.5 block">
                  1. Pembayaran Tunai (Rp)
                </label>
                <input
                  type="number"
                  value={splitCashAmount}
                  onChange={(e) => setSplitCashAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#191b22] border border-[#2c303c] rounded-xl text-base font-mono font-bold text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#8e95a5] mb-1.5 block">
                  2. Sisa Pembayaran Non-Tunai: <strong className="text-white font-mono">Rp {splitRemaining.toLocaleString('id-ID')}</strong>
                </label>
                <div className="flex gap-2">
                  {(['qris', 'debit_card', 'credit_card'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSplitNonCashMethod(m)}
                      className={`flex-1 py-2 px-3 text-xs rounded-xl border capitalize cursor-pointer transition-colors ${
                        splitNonCashMethod === m
                          ? 'bg-white text-black font-bold border-white'
                          : 'bg-[#181a21] text-[#8e95a5] border-[#292c38]'
                      }`}
                    >
                      {m.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Catatan Transaksi */}
          <div>
            <label className="text-xs font-bold text-[#8e95a5] mb-1 block">
              Catatan Transaksi (Opsional)
            </label>
            <input
              type="text"
              placeholder="Catatan pesanan, meja nomor, dsb..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#171920] border border-[#262934] rounded-xl text-xs text-white focus:outline-hidden focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#232630] bg-[#111317]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#8e95a5] hover:text-white transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            disabled={isCashInsufficient}
            onClick={handleConfirmPayment}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isCashInsufficient
                ? 'bg-[#292c37] text-[#6b7282] cursor-not-allowed'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Selesaikan Transaksi (Rp {cartGrandTotal.toLocaleString('id-ID')})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
