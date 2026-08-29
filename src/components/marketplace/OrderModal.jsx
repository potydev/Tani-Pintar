import React, { useState } from "react";
import { X, ShoppingCart, MapPin, Phone, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createOrder } from "../../data/marketplaceData";

export function OrderModal({ product, quantity, user, onClose, onSuccess }) {
  const [address, setAddress] = useState(user?.farm_location || "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const totalPrice = (quantity || product.min_order || 50) * Number(product.price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    const res = await createOrder({
      buyer_id: user.id,
      product_id: product.id,
      quantity: quantity || product.min_order || 50,
      shipping_address: address,
      buyer_phone: phone,
      notes,
    });
    setLoading(false);
    setResult(res);
    if (res.success && onSuccess) setTimeout(() => onSuccess(res), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center"><ShoppingCart size={18} className="text-emerald-700" /></div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Konfirmasi Pesanan</h3>
              <p className="text-[11px] text-slate-400">Lengkapi data pengiriman</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400"><X size={16} /></button>
        </div>

        {result ? (
          <div className="p-8 text-center">
            {result.success ? (
              <>
                <CheckCircle2 size={48} className="text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Pesanan Berhasil!</h3>
                <p className="text-sm text-slate-500 mb-1">{result.message}</p>
                <p className="text-xs text-slate-400">Penjual: {result.data?.seller_name}</p>
              </>
            ) : (
              <>
                <AlertCircle size={48} className="text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Gagal!</h3>
                <p className="text-sm text-rose-600">{result.error}</p>
                <button onClick={() => setResult(null)} className="mt-4 text-sm font-bold text-emerald-700">Coba Lagi</button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Order Summary */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">{product.name}</span>
                <span className="text-xs text-slate-400">{product.farmer_name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{quantity || product.min_order} {product.unit || "kg"} × Rp {Number(product.price).toLocaleString("id-ID")}</span>
                <span className="font-extrabold text-emerald-700 text-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Alamat Pengiriman *</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                <textarea required value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-600 resize-none" placeholder="Alamat lengkap..." />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Nomor HP</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-600" placeholder="08xxx" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Catatan (Opsional)</label>
              <div className="relative">
                <FileText size={14} className="absolute left-3 top-3 text-slate-400" />
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-600 resize-none" placeholder="Catatan untuk penjual..." />
              </div>
            </div>

            <button type="submit" disabled={loading || !address} className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : <><ShoppingCart size={16} /> Pesan Sekarang — Rp {totalPrice.toLocaleString("id-ID")}</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
