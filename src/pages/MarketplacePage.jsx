import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search, Star, MapPin, ShoppingCart, Leaf, Filter, X,
  ArrowLeft, ArrowRight, User, LayoutDashboard, Package,
  Loader2, RefreshCw, Store
} from "lucide-react";
import { COMMODITY_CATEGORIES, SORT_OPTIONS, fetchProducts, fetchMarketplaceStats } from "../data/marketplaceData";
import { ProductCard } from "../components/marketplace/ProductCard";
import { LandingHeader } from "../components/landing/LandingHeader";

export function MarketplacePage({ isLoggedIn, userName }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stats, setStats] = useState({ totalProducts: 0, totalSellers: 0, totalLocations: 0 });

  const [searchTimeout, setSearchTimeout] = useState(null);

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

  const handleSearchChange = (val) => {
    setSearch(val);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => { setPage(1); }, 400));
  };

  const handleCategoryChange = (cat) => { setCategory(cat); setPage(1); };
  const handleSortChange = (s) => { setSortBy(s); setPage(1); };

  // View detail page route
  const handleViewProduct = (product) => {
    navigate(`/marketplace/product/${product.id}`);
  };

  // Buy click flow: redirect to checkout if logged in, otherwise redirect to login with return URL
  const handleBuyClick = (product) => {
    const checkoutUrl = `/checkout/${product.id}?qty=${product.min_order || 50}`;
    if (!isLoggedIn) {
      navigate(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
    } else {
      navigate(checkoutUrl);
    }
  };

  const statItems = [
    { label: "Total Komoditas", val: stats.totalProducts || totalProducts, icon: Package },
    { label: "Petani Terverifikasi", val: stats.totalSellers || 10, icon: Leaf },
    { label: "Kabupaten / Kota", val: stats.totalLocations || 8, icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      
      {/* Full Universal Header Bar */}
      <LandingHeader isLoggedIn={isLoggedIn} userName={userName} bgSolid={true} />

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #051510 0%, #0d5c3a 60%, #16a34a 120%)" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-full px-4 py-1.5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/90 text-xs font-bold tracking-wide">Marketplace Hasil Tani Terverifikasi</span>
            </div>
            <h1 className="text-white text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Beli Komoditas Panen <span className="text-emerald-400">Langsung dari Petani</span>
            </h1>
            <p className="text-white/60 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Jaminan mutu produk pertanian kualitas premium dengan transparansi harga dan pengiriman aman.
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/[0.2] rounded-2xl px-4 shadow-lg">
                <Search size={18} className="text-white/60 shrink-0" />
                <input
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Cari cabai, bawang, beras, tomat, daerah..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 text-xs sm:text-sm py-3.5 outline-none font-medium"
                />
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1); }} className="text-white/60 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mt-6">
            {statItems.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white/[0.08] border border-white/[0.12] rounded-2xl px-4 py-3 text-center backdrop-blur-sm">
                  <Icon size={16} className="text-emerald-400 mx-auto mb-1" />
                  <div className="text-white font-extrabold text-base sm:text-lg">{s.val}</div>
                  <div className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        {/* Categories Pills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 flex gap-1.5 overflow-x-auto mb-6 shadow-sm">
          {COMMODITY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                category === cat.id
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Toolbar Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Menampilkan <span className="font-extrabold text-slate-900">{totalProducts}</span> komoditas
              {category !== "all" && (
                <span className="text-emerald-700 font-bold"> · Kategori: {COMMODITY_CATEGORIES.find(c => c.id === category)?.label}</span>
              )}
            </p>
            {!loading && (
              <button onClick={loadProducts} className="text-slate-400 hover:text-emerald-700 transition-colors p-1" title="Muat Ulang">
                <RefreshCw size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold hidden sm:block">Urutkan:</span>
            <select
              value={sortBy}
              onChange={e => handleSortChange(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 shadow-sm"
            >
              {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-emerald-700 mb-3" />
            <span className="text-xs font-bold text-slate-500">Memuat Komoditas Hasil Panen...</span>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-8">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onView={handleViewProduct}
                  onBuy={handleBuyClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pb-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  ← Sebelumnya
                </button>
                <span className="text-xs font-extrabold text-slate-600 px-3">Halaman {page} dari {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Selanjutnya →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-12">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              Tidak Ada Komoditas Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Coba gunakan kata kunci lain atau pilih kategori komoditas yang berbeda.
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("all"); setPage(1); }}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
