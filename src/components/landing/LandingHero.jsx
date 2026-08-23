import React, { useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";

export function LandingHero({ onLoginClick }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white py-24 px-6">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-6">
            <Sparkles size={14} className="text-amber-400" />
            <span>Platform AI Penjualan Hasil Panen #1 di Indonesia</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Jual Panen di Waktu &amp; Tempat yang Tepat
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
            TaniPintar menganalisis harga, permintaan pasar, dan biaya logistik secara real-time untuk merekomendasikan keputusan penjualan paling menguntungkan bagi petani.
          </p>

          {/* Quick Commodity Search */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-lg flex items-center gap-2 mb-8">
            <Search size={20} className="text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komoditas: Cabai Merah, Bawang Merah, Tomat..."
              className="w-full text-slate-800 text-sm py-2.5 outline-none bg-transparent placeholder:text-slate-400"
            />
            <button
              onClick={onLoginClick}
              className="tp-btn-primary px-6 py-3 rounded-xl text-sm font-semibold shrink-0"
            >
              Cek Peluang AI
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white">12.450+</div>
              <div className="text-slate-400 text-xs mt-1">Petani Terhubung</div>
            </div>
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white">34</div>
              <div className="text-slate-400 text-xs mt-1">Kota Dipantau</div>
            </div>
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-400">9.2%</div>
              <div className="text-slate-400 text-xs mt-1">Rata-rata Profit Tambahan</div>
            </div>
          </div>
        </div>

        {/* Hero Card Visual Preview with Branding Image */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-3xl blur-2xl transform rotate-2 scale-95" />
            
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 group">
              <img
                src="/assets/homepage.jpg"
                alt="TaniPintar AI Market Intelligence Dashboard"
                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.src = "/homepage.jpg"; }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
