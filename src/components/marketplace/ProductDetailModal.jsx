import React, { useState, useEffect } from "react";
import { X, Star, MapPin, BadgeCheck, TrendingUp, TrendingDown, Flame, ShoppingCart, Package, Leaf, Calendar, Award, Loader2, User } from "lucide-react";
import { CATEGORY_ICON, fetchProductDetail } from "../../data/marketplaceData";

export function ProductDetailModal({ productId, product: initialProduct, onClose, onBuy, isLoggedIn }) {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [qty, setQty] = useState(null);

  useEffect(() => {
    if (productId && !initialProduct) {
      setLoading(true);
      fetchProductDetail(productId).then(res => {
        if (res.success) setProduct(res.data);
        setLoading(false);
      });
    }
  }, [productId]);

  useEffect(() => {
    if (product) setQty(product.min_order || 50);
  }, [product]);

  if (!product && !loading) return null;

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-emerald-600" />
        <span className="text-sm text-slate-500">Memuat detail produk...</span>
      </div>
    </div>
  );

  const pc = parseFloat(product.price_change || 0);
  const priceUp = pc > 0;
  const catIcon = CATEGORY_ICON(product.category);
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const totalPrice = (qty || 0) * Number(product.price);

  const infoItems = [
    { label: "Harga", val: `Rp ${Number(product.price).toLocaleString("id-ID")}/${product.unit || "kg"}` },
    { label: "Min. Order", val: `${product.min_order || 50} ${product.unit || "kg"}` },
    { label: "Stok", val: `${(product.stock || 0).toLocaleString("id-ID")} ${product.unit || "kg"}` },
    { label: "Terjual", val: `${(product.total_sold || 0).toLocaleString("id-ID")} ${product.unit || "kg"}` },
    { label: "Kesegaran", val: product.freshness || "Segar" },
    { label: "Grade", val: product.grade || "-" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight: "92vh", overflowY: "auto" }}>
        {/* Header */}
        <div className="relative h-56" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0)" }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-8xl opacity-40">{catIcon}</span>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow"><X size={18} /></button>
          <div className="absolute bottom-3 left-4 flex gap-2">
            {product.trending && <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full"><Flame size={12} />Trending</span>}
            <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full">{product.grade || "Grade A"}</span>
          </div>
        </div>

        <div className="p-6">
          {/* Title */}
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{product.name}</h2>
            {pc !== 0 && (
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${priceUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
                {priceUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {priceUp ? "+" : ""}{pc}%
              </span>
            )}
          </div>

          {/* Seller */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <User size={13} /> <span className="font-semibold text-slate-700">{product.farmer_name}</span>
            {product.verified_seller && <><BadgeCheck size={14} className="text-blue-500" /><span className="text-blue-600 font-medium text-[11px]">Terverifikasi</span></>}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
            <MapPin size={13} /> {product.location}
            <span className="mx-1">·</span>
            <Star size={13} className="fill-amber-400 text-amber-400" /> {product.rating || "5.0"} ({product.reviews_count || 0} ulasan)
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>{product.description || "Produk komoditas segar langsung dari petani."}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {infoItems.map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-slate-400 font-medium mb-0.5">{item.label}</div>
                <div className="text-[11px] font-bold text-slate-800">{item.val}</div>
              </div>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {tags.map(t => <span key={t} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full border border-emerald-100">{t}</span>)}
            </div>
          )}

          {/* Order Section */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Jumlah Pemesanan</span>
              <span className="text-[10px] text-slate-400">Min. {product.min_order || 50} {product.unit || "kg"}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setQty(Math.max((product.min_order || 50), (qty || 0) - 50))} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50">−</button>
              <input type="number" value={qty || ""} onChange={e => setQty(Math.max(0, parseInt(e.target.value) || 0))} className="flex-1 text-center text-sm font-bold bg-white border border-slate-200 rounded-lg py-2 focus:outline-none focus:border-emerald-600" style={{ fontFamily: "JetBrains Mono, monospace" }} />
              <button onClick={() => setQty(Math.min(product.stock || 9999, (qty || 0) + 50))} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50">+</button>
              <span className="text-xs text-slate-500 font-medium">{product.unit || "kg"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Total Estimasi:</span>
              <span className="text-base font-extrabold text-emerald-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => onBuy(product, qty)} className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-700/20" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <ShoppingCart size={16} /> Beli Sekarang
            </button>
            <button onClick={onClose} className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  );
}
