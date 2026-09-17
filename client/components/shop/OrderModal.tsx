'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
}

export default function OrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [gameId, setGameId] = useState('');
  const [note, setNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ displayName: string; avatarUrl: string } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleVerify() {
    if (!gameId.trim()) return setError('Vui lòng nhập Game ID');
    setVerifying(true);
    setError('');
    try {
      const data = await api.get(`/products/roblox/verify?username=${encodeURIComponent(gameId)}`);
      setVerifyResult({ displayName: data.displayName, avatarUrl: data.avatarUrl });
    } catch (err: any) {
      setVerifyResult(null);
      setError(err.message || 'Không tìm thấy tài khoản Roblox này');
    } finally {
      setVerifying(false);
    }
  }

  async function submitOrder(payNow: boolean) {
    if (!checked || !verifyResult) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/orders/checkout', {
        productId: product._id,
        gameId,
        robloxVerified: { verified: true, ...verifyResult },
        noteForAdmin: note,
        couponCode: couponCode || undefined,
        payNow,
      });
      setSuccess(payNow ? 'Thanh toán thành công! Đơn hàng đang được xử lý.' : 'Đã thêm vào giỏ hàng.');
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message || 'Đặt hàng thất bại');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-neutral-900 border border-fuchsia-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_-10px_rgba(217,70,239,0.4)] max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Mua Vật Phẩm: {product.name}</h2>
            <button onClick={onClose}><X className="text-neutral-400 hover:text-white" /></button>
          </div>

          <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm rounded-lg p-3 mb-4">
            Chú ý: Khách Nhập Tên Vào Là Tên Đăng Nhập Không Phải Tên Hiển Thị.
            Nhập Sai Shop Không Chịu Trách Nhiệm, Không Hoàn Tiền!!!
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4 text-neutral-300">
            <div>Sản phẩm: <span className="text-white">{product.name}</span></div>
            <div>Giá gốc: <span className="text-white">{product.price.toLocaleString()}đ</span></div>
            <div>Giảm giá: <span className="text-emerald-400">{product.discountPercent}%</span></div>
            <div>Giá cuối: <span className="text-fuchsia-400 font-semibold">{product.finalPrice.toLocaleString()}đ</span></div>
          </div>

          <label className="text-sm text-neutral-300">Nhập Game ID <span className="text-red-400">*</span></label>
          <div className="flex gap-2 mb-1">
            <input
              value={gameId}
              onChange={(e) => { setGameId(e.target.value); setVerifyResult(null); }}
              className="flex-1 bg-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="username Roblox"
            />
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="px-3 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm whitespace-nowrap flex items-center gap-1"
            >
              {verifying ? <Loader2 size={14} className="animate-spin" /> : 'Kiểm tra'}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
          {verifyResult && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 mb-3">
              {verifyResult.avatarUrl && <img src={verifyResult.avatarUrl} className="w-8 h-8 rounded-full" />}
              <span className="text-emerald-300 text-sm flex items-center gap-1">
                <CheckCircle2 size={14} /> {verifyResult.displayName}
              </span>
            </div>
          )}

          <label className="text-sm text-neutral-300">Mã giảm giá (tuỳ chọn)</label>
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white mb-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="VD: SALE50"
          />

          <label className="text-sm text-neutral-300">Ghi chú cho admin (tuỳ chọn)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white mb-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
            rows={2}
          />

          <label className="flex items-center gap-2 text-sm text-neutral-300 mb-4">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            Tôi đã nhập đúng Game ID
          </label>

          {success && <p className="text-emerald-400 text-sm mb-3">{success}</p>}

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 border border-neutral-600 rounded-lg py-2 text-neutral-300">Huỷ</button>
            <button
              disabled={!checked || !verifyResult || submitting}
              onClick={() => submitOrder(false)}
              className="flex-1 flex items-center justify-center gap-1 border border-fuchsia-500 rounded-lg py-2 text-fuchsia-400 disabled:opacity-40"
            >
              <ShoppingCart size={16} /> Thêm vào giỏ
            </button>
            <button
              disabled={!checked || !verifyResult || submitting}
              onClick={() => submitOrder(true)}
              className="flex-1 flex items-center justify-center gap-1 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg py-2 text-white disabled:opacity-40"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />} Thanh Toán
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
