import React, { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, Star, MapPin, TrendingUp, TrendingDown,
  ShoppingCart, BadgeCheck, Flame, ChevronDown, Package, ArrowRight,
  Leaf, Filter, X, Heart, Eye, ArrowLeft, Home, User, LayoutDashboard
} from "lucide-react";
import { COMMODITY_CATEGORIES, MARKETPLACE_PRODUCTS, SORT_OPTIONS } from "../data/marketplaceData";

function ProductCard({ product, onView }) {
  const [liked, setLiked] = useState(false);
  const priceUp = product.priceChange > 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-200/60 transition-all duration-300">
      {/* Image Area */}
      <div className="relative h-44 overflow-hidden" style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-500">
            {COMMODITY_CATEGORIES.find(c => c.id === product.category)?.icon || "🌿"}
          </span>
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.trending && (
            <span className="flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Flame size={10} /> Trending
            </span>
          )}
          {product.grade && (
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {product.grade}
            </span>
          )}
        </div>
        {/* Like */}
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <Heart size={14} className={liked ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
        </button>
        {/* Price Change */}
        <div className="absolute bottom-3 right-3">
          <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${priceUp ? "bg-emerald-100/90 text-emerald-700" : "bg-rose-100/90 text-rose-600"}`} style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {priceUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {priceUp ? "+" : ""}{product.priceChange}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {product.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 ml-2">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{product.location}</span>
          {product.sellerVerified && <BadgeCheck size={12} className="text-blue-500 shrink-0" />}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 2).map(tag => (
            <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="flex items-end justify-between pt-2 border-t border-slate-100">
          <div>
            <div className="text-lg font-extrabold text-emerald-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              Rp {product.price.toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-400" style={{ fontFamily: "Inter, sans-serif" }}>
              per {product.unit} · Min. {product.minOrder} {product.unit}
            </div>
          </div>
          <button onClick={() => onView(product)} className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-sm">
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailModal({ product, onClose }) {
  if (!product) return null;
  const priceUp = product.priceChange > 0;
  const catIcon = COMMODITY_CATEGORIES.find(c => c.id === product.category)?.icon || "🌿";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header Image */}
        <div className="relative h-52" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0)" }}>
          <span className="absolute inset-0 flex items-center justify-center text-8xl opacity-50">{catIcon}</span>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow"><X size={18} /></button>
          <div className="absolute bottom-3 left-4 flex gap-2">
            {product.trending && <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full"><Flame size={12} />Trending</span>}
            <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full">{product.grade}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{product.name}</h2>
            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${priceUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
              {priceUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {priceUp ? "+" : ""}{product.priceChange}%
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <MapPin size={14} /> {product.location}
            {product.sellerVerified && <><span className="text-slate-300">·</span><BadgeCheck size={14} className="text-blue-500" /><span className="text-blue-600 font-medium text-xs">Terverifikasi</span></>}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>{product.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Harga", val: `Rp ${product.price.toLocaleString("id-ID")}/${product.unit}` },
              { label: "Min. Order", val: `${product.minOrder} ${product.unit}` },
              { label: "Stok", val: `${product.stock.toLocaleString("id-ID")} ${product.unit}` },
              { label: "Terjual", val: `${product.totalSold.toLocaleString("id-ID")} ${product.unit}` },
              { label: "Penjual", val: product.seller },
              { label: "Kesegaran", val: product.freshness },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 font-medium mb-0.5">{item.label}</div>
                <div className="text-xs font-bold text-slate-800">{item.val}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.tags.map(t => <span key={t} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full border border-emerald-100">{t}</span>)}
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-700/20" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <ShoppingCart size={16} /> Hubungi Penjual
            </button>
            <button onClick={onClose} className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MarketplacePage({ onNavigate, isLoggedIn, userName, onLoginClick }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewProduct, setViewProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let items = [...MARKETPLACE_PRODUCTS];
    if (category !== "all") items = items.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "price_low": items.sort((a, b) => a.price - b.price); break;
      case "price_high": items.sort((a, b) => b.price - a.price); break;
      case "newest": items.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate)); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      default: items.sort((a, b) => b.totalSold - a.totalSold);
    }
    return items;
  }, [search, category, sortBy]);

  const stats = [
    { label: "Total Produk", val: MARKETPLACE_PRODUCTS.length, icon: Package },
    { label: "Petani Aktif", val: "450+", icon: Leaf },
    { label: "Kota Jangkauan", val: "34", icon: MapPin },
    { label: "Transaksi/Bulan", val: "2.8rb", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate && onNavigate("landing")} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <ArrowLeft size={16} /> Beranda
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-700 rounded-lg flex items-center justify-center">
                <Leaf size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Marketplace</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button onClick={() => onNavigate && onNavigate("dashboard")} className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  <LayoutDashboard size={14} /> Dashboard
                </button>
                <div className="flex items-center gap-1.5 ml-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User size={14} className="text-emerald-700" />
                  </div>
                  <span className="text-xs font-medium text-slate-600 hidden sm:block">{userName}</span>
                </div>
              </>
            ) : (
              <button onClick={onLoginClick} className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Masuk <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #051510 0%, #0d5c3a 60%, #16a34a 120%)" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-12 pb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-full px-4 py-1.5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-xs font-semibold tracking-wide" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Marketplace Komoditas Pertanian</span>
            </div>
            <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Beli Langsung dari <span className="text-emerald-400">Petani Terpercaya</span>
            </h1>
            <p className="text-white/50 text-sm max-w-lg mx-auto">Temukan komoditas segar berkualitas dari petani terverifikasi di seluruh Indonesia dengan harga transparan.</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/[0.15] rounded-xl px-4">
                <Search size={18} className="text-white/40 shrink-0" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari komoditas, petani, atau lokasi..." className="flex-1 bg-transparent text-white placeholder-white/35 text-sm py-3.5 outline-none" />
                {search && <button onClick={() => setSearch("")} className="text-white/40 hover:text-white/70"><X size={14} /></button>}
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 bg-white/10 border border-white/[0.15] text-white/70 hover:text-white hover:bg-white/15 font-semibold text-sm px-4 py-3 rounded-xl transition-colors">
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mt-6">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-center backdrop-blur-sm">
                  <Icon size={16} className="text-emerald-400 mx-auto mb-1" />
                  <div className="text-white font-extrabold text-lg" style={{ fontFamily: "JetBrains Mono, monospace" }}>{s.val}</div>
                  <div className="text-white/40 text-[10px] font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 flex gap-1 overflow-x-auto mb-6 shadow-sm">
          {COMMODITY_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${category === cat.id ? "bg-emerald-700 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">{filtered.length}</span> produk ditemukan
            {category !== "all" && <span className="text-emerald-600 font-medium"> · {COMMODITY_CATEGORIES.find(c => c.id === category)?.label}</span>}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">Urutkan:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {filtered.map(p => <ProductCard key={p.id} product={p} onView={setViewProduct} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-40">🔍</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Produk tidak ditemukan</h3>
            <p className="text-sm text-slate-400">Coba ubah kata kunci atau kategori pencarian Anda.</p>
            <button onClick={() => { setSearch(""); setCategory("all"); }} className="mt-4 text-sm font-bold text-emerald-700 hover:text-emerald-800">Reset Pencarian</button>
          </div>
        )}
      </div>

      {viewProduct && <ProductDetailModal product={viewProduct} onClose={() => setViewProduct(null)} />}
    </div>
  );
}
