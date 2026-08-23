import React, { useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";

export function LandingHero({ onLoginClick }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section id="beranda" className="relative overflow-hidden bg-slate-950 text-white py-24 px-6">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/homepage.jpg"
          alt="TaniPintar Background"
          className="w-full h-full object-cover opacity-25 filter brightness-90 contrast-110"
          onError={(e) => { e.target.src = "/homepage.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/85 to-slate-950/95" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/30 to-slate-950/80" />
      </div>

      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 -left-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none z-0" />

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

        {/* Hero Card Visual Preview */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-2xl transform rotate-3 scale-95" />
            
            <div className="tp-card p-6 bg-white text-slate-900 shadow-2xl relative rounded-2xl border border-white/20">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    #1
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500">Rekomendasi AI Hari Ini</div>
                    <div className="font-heading font-bold text-slate-900">Kirim ke Bandung</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  +9.2% Margin
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Harga Asal (Cilacap)</span>
                  <span className="font-semibold text-slate-700">Rp 38.000 /kg</span>
                </div>
                <div className="flex justify-between text-sm py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Harga Tujuan (Bandung)</span>
                  <span className="font-bold text-emerald-700">Rp 41.500 /kg</span>
                </div>
                <div className="flex justify-between text-sm py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Estimasi Profit Clean</span>
                  <span className="font-extrabold text-emerald-800">Rp 1.250.000 /500kg</span>
                </div>
              </div>

              <button
                onClick={onLoginClick}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Lihat Simulasi Lengkap</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
