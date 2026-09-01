import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Star, MapPin, Calendar, CheckCircle2, ShieldCheck,
  ShoppingBag, Minus, Plus, ChevronRight, Leaf, Info, Truck
} from "lucide-react";
import { fetchProductDetail, CATEGORY_ICON } from "../data/marketplaceData";

export function ProductDetailPage({ isLoggedIn }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(50);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchProductDetail(id);
      if (res.success && res.data) {
        setProduct(res.data);
        setQty(res.data.min_order || 50);
      } else {
        // Fallback fetch all
        const allRes = await fetch("/api/marketplace/products");
        const json = await allRes.json();
        if (json.success && json.data) {
          const found = json.data.find((p) => String(p.id) === String(id));
          if (found) {
            setProduct(found);
            setQty(found.min_order || 50);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const handleDecrease = () => {
    if (!product) return;
    const min = product.min_order || 1;
    if (qty > min) setQty(qty - 10 < min ? min : qty - 10);
  };

  const handleIncrease = () => {
    if (!product) return;
    if (qty < product.stock) setQty(qty + 10);
  };

  const handleBuyNow = () => {
    const checkoutUrl = `/checkout/${id}?qty=${qty}`;
    if (!isLoggedIn) {
      navigate(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
    } else {
      navigate(checkoutUrl);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-600" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Memuat Detail Komoditas...
          </span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Komoditas Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm mb-6">Produk yang Anda cari tidak tersedia atau telah habis.</p>
        <Link
          to="/marketplace"
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors"
        >
          Kembali ke Marketplace
        </Link>
      </div>
    );
  }

  const totalPrice = (product.price || 0) * qty;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-lg">TaniPintar</span>
          </Link>

          <Link
            to="/marketplace"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Marketplace
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-emerald-700">Beranda</Link>
          <ChevronRight size={12} />
          <Link to="/marketplace" className="hover:text-emerald-700">Marketplace</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 p-8 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner bg-slate-200 mb-6">
              <img
                src={product.image_url || "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80"}
                alt={product.name}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.grade && (
                  <span className="px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full shadow-md">
                    {product.grade.startsWith("Grade") ? product.grade : `Grade ${product.grade}`}
                  </span>
                )}
                {product.organic && (
                  <span className="px-3 py-1 bg-teal-700 text-white font-bold text-xs rounded-full shadow-md">
                    🌱 Organik
                  </span>
                )}
              </div>
            </div>

            {/* Seller Info Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-extrabold text-lg">
                  {product.farmer_name ? product.farmer_name.charAt(0) : "P"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">{product.farmer_name || "Petani Binaan TaniPintar"}</span>
                    {product.verified_seller && (
                      <ShieldCheck size={16} className="text-emerald-600 fill-emerald-100" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                    <MapPin size={12} className="text-emerald-600" />
                    <span>{product.location || "Nusantara"}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Petani Terverifikasi
              </span>
            </div>
          </div>

          {/* Right Column: Product Detail & Purchase */}
          <div className="lg:col-span-6 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wide">
                  {CATEGORY_ICON(product.category)} {product.category}
                </span>
                {product.harvest_date && (
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" /> Panen: {product.harvest_date}
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-3">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-baseline gap-3 mb-6 bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block mb-0.5">Harga per {product.unit || "kg"}</span>
                  <span className="text-3xl font-extrabold text-emerald-800">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="ml-auto text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={16} className="fill-amber-400" />
                    <span>{product.rating || 4.8}</span>
                    <span className="text-slate-400 font-normal text-xs">({product.reviews_count || 12} ulasan)</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium block mt-0.5">Stok: {product.stock ? product.stock.toLocaleString("id-ID") : "1.000"} {product.unit || "kg"}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Produk</h3>
                <p className="text-slate-700 text-xs lg:text-sm leading-relaxed">
                  {product.description || "Komoditas hasil pertanian berkualitas tinggi langsung dari petani binaan TaniPintar. Dipetik dengan standar penanganan pasca panen terbaik."}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="border-t border-b border-slate-100 py-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Jumlah Pemesanan</span>
                    <span className="text-xs text-slate-500">Minimum pembelian: {product.min_order || 50} {product.unit || "kg"}</span>
                  </div>
                  
                  <div className="flex items-center border border-slate-300 rounded-xl p-1 bg-slate-50">
                    <button
                      onClick={handleDecrease}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors disabled:opacity-40"
                      disabled={qty <= (product.min_order || 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-16 text-center font-extrabold text-sm text-slate-900">
                      {qty} {product.unit || "kg"}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors disabled:opacity-40"
                      disabled={qty >= product.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtotal calculation */}
                <div className="flex items-center justify-between pt-3">
                  <span className="text-xs text-slate-500 font-semibold">Total Estimasi Harga:</span>
                  <span className="text-xl font-extrabold text-emerald-800">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 mb-8 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Garansi kesegaran produk & jaminan kualitas grade unggulan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Pengiriman cepat langsung dari lokasi kebun petani</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group"
              >
                <ShoppingBag size={18} />
                <span>Beli Sekarang — Rp {totalPrice.toLocaleString("id-ID")}</span>
              </button>
              
              {!isLoggedIn && (
                <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
                  *Anda akan diarahkan ke halaman login terlebih dahulu untuk konfirmasi alamat pesanan.
                </p>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
