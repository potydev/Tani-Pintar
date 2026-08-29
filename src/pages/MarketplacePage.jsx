import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Star, MapPin, ShoppingCart, Leaf, Filter, X,
  ArrowLeft, ArrowRight, User, LayoutDashboard, Package,
  Loader2, RefreshCw, Plus, Store
} from "lucide-react";
import { COMMODITY_CATEGORIES, SORT_OPTIONS, fetchProducts, fetchMarketplaceStats } from "../data/marketplaceData";
import { ProductCard } from "../components/marketplace/ProductCard";
import { ProductDetailModal } from "../components/marketplace/ProductDetailModal";
import { OrderModal } from "../components/marketplace/OrderModal";
import { LoginPromptModal } from "../components/marketplace/LoginPromptModal";

export function MarketplacePage({ onNavigate, isLoggedIn, userName, onLoginClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stats, setStats] = useState({ totalProducts: 0, totalSellers: 0, totalLocations: 0 });

  // Modal states
  const [viewProduct, setViewProduct] = useState(null);
  const [orderProduct, setOrderProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(50);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // User from localStorage
  const getUser = () => {
    try { return JSON.parse(localStorage.getItem("tanipintar_user")); } catch { return null; }
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetchProducts({ category, search, sort: sortBy, page });
    if (res.success) {
      setProducts(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalProducts(res.total || 0);
    } else {
      setProducts([]);
    }
    setLoading(false);
  }, [category, search, sortBy, page]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    fetchMarketplaceStats().then(res => {
      if (res.success) setStats(res.data);
    });
  }, []);

  // Debounced search
  const handleSearchChange = (val) => {
    setSearch(val);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => { setPage(1); }, 400));
  };

  const handleCategoryChange = (cat) => { setCategory(cat); setPage(1); };
  const handleSortChange = (s) => { setSortBy(s); setPage(1); };

  // Buy flow: check login first
  const handleBuyClick = (product, qty) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setOrderProduct(product);
    setOrderQty(qty || product.min_order || 50);
    setViewProduct(null);
  };

  const handleOrderSuccess = () => {
    setOrderProduct(null);
    loadProducts(); // refresh stock
  };

  const statItems = [
    { label: "Total Produk", val: stats.totalProducts || totalProducts, icon: Package },
    { label: "Petani Aktif", val: stats.totalSellers || 0, icon: Leaf },
    { label: "Kota Jangkauan", val: stats.totalLocations || 0, icon: MapPin },
    { label: "Transaksi", val: stats.totalTransactions || 0, icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate && onNavigate("landing")} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Beranda</span>
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-700 rounded-lg flex items-center justify-center"><Store size={14} className="text-white" /></div>
              <span className="font-bold text-sm text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Marketplace</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button onClick={() => onNavigate && onNavigate("dashboard")} className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  <LayoutDashboard size={14} /> <span className="hidden sm:inline">Dashboard</span>
                </button>
                <div className="flex items-center gap-1.5 ml-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center"><User size={14} className="text-emerald-700" /></div>
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

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #051510 0%, #0d5c3a 60%, #16a34a 120%)" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 pb-14 sm:pb-16">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-full px-4 py-1.5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-xs font-semibold tracking-wide" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Marketplace Komoditas Pertanian</span>
            </div>
            <h1 className="text-white text-2xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Beli Langsung dari <span className="text-emerald-400">Petani Terpercaya</span>
            </h1>
            <p className="text-white/50 text-sm max-w-lg mx-auto">Temukan komoditas segar berkualitas dari petani terverifikasi di seluruh Indonesia.</p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/[0.15] rounded-xl px-4">
                <Search size={18} className="text-white/40 shrink-0" />
                <input value={search} onChange={e => handleSearchChange(e.target.value)} placeholder="Cari komoditas, petani, atau lokasi..." className="flex-1 bg-transparent text-white placeholder-white/35 text-sm py-3.5 outline-none" />
                {search && <button onClick={() => { setSearch(""); setPage(1); }} className="text-white/40 hover:text-white/70"><X size={14} /></button>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mt-6">
            {statItems.map(s => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        {/* Categories */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 flex gap-1 overflow-x-auto mb-6 shadow-sm">
          {COMMODITY_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${category === cat.id ? "bg-emerald-700 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">{totalProducts}</span> produk
              {category !== "all" && <span className="text-emerald-600 font-medium"> · {COMMODITY_CATEGORIES.find(c => c.id === category)?.label}</span>}
            </p>
            {!loading && <button onClick={loadProducts} className="text-slate-400 hover:text-emerald-600 transition-colors"><RefreshCw size={14} /></button>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">Urutkan:</span>
            <select value={sortBy} onChange={e => handleSortChange(e.target.value)} className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-emerald-600 mb-3" />
            <span className="text-sm text-slate-400">Memuat produk dari database...</span>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onView={setViewProduct} onBuy={(prod) => handleBuyClick(prod)} />
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pb-12">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">← Sebelumnya</button>
                <span className="text-xs text-slate-500 px-3">Hal. {page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">Selanjutnya →</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-40">📦</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {search || category !== "all" ? "Produk tidak ditemukan" : "Belum ada produk di marketplace"}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {search || category !== "all"
                ? "Coba ubah kata kunci atau kategori pencarian."
                : "Jadilah yang pertama menjual komoditas Anda!"}
            </p>
            {(search || category !== "all") && (
              <button onClick={() => { setSearch(""); setCategory("all"); setPage(1); }} className="text-sm font-bold text-emerald-700 hover:text-emerald-800">Reset Pencarian</button>
            )}
            {isLoggedIn && !search && category === "all" && (
              <p className="text-xs text-slate-400 mt-2">Gunakan SQL Editor Supabase untuk menambahkan produk ke tabel <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700">marketplace_products</code></p>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {viewProduct && (
        <ProductDetailModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          onBuy={(prod, qty) => handleBuyClick(prod, qty)}
          isLoggedIn={isLoggedIn}
        />
      )}
      {orderProduct && (
        <OrderModal
          product={orderProduct}
          quantity={orderQty}
          user={getUser()}
          onClose={() => setOrderProduct(null)}
          onSuccess={handleOrderSuccess}
        />
      )}
      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          onLoginClick={onLoginClick}
        />
      )}
    </div>
  );
}
