import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, ChevronDown, ChevronUp, Sparkles, TrendingUp, Tag } from "lucide-react";

export function LandingHero({ onLoginClick }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const quickChips = [
    { label: "Cabai Merah", cat: "cabai" },
    { label: "Bawang Merah", cat: "bawang" },
    { label: "Beras Premium", cat: "beras" },
    { label: "Tomat Fresh", cat: "sayuran" }
  ];

  const handleSearchSubmit = (searchVal) => {
    const q = searchVal || query;
    if (q) {
      navigate(`/marketplace?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/marketplace');
    }
  };

  const handleChipClick = (chip) => {
    setQuery(chip.label);
    navigate(`/marketplace?search=${encodeURIComponent(chip.label)}`);
  };

  return (
    <section
      id="beranda"
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #051510 0%, #0b2e1a 45%, #0d5c3a 100%)",
      }}
    >
      {/* Organic Agricultural Background Image with Blend Mask */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-overlay bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      {/* Atmospheric Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.14] rounded-full px-4 py-1.5 w-fit backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span
              className="text-white/90 text-xs font-semibold tracking-wide"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Platform Intelijen Pasar &amp; Distribusi Hasil Panen Indonesia
            </span>
          </div>

          <h1
            className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Jual Panen di<br />
            <span className="text-emerald-400">Waktu &amp; Tempat</span><br />
            yang Tepat
          </h1>

          <p
            className="text-white/70 text-base leading-relaxed max-w-md"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            TaniPintar memetakan disparitas harga pasar induk, permintaan komoditas antardaerah, dan kalkulasi logistik kargo secara transparan untuk keuntungan maksimal petani.
          </p>

          {/* Prominent Search Input & Action */}
          <div className="flex flex-col gap-2.5 max-w-lg">
            <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }} className="flex gap-2">
              <div className="flex-1 flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/[0.25] rounded-2xl px-4 py-1 shadow-lg shadow-black/20 focus-within:border-emerald-400 focus-within:bg-white/20 transition-all">
                <Search size={18} className="text-emerald-400 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari komoditas panen: Cabai, Bawang, Beras..."
                  className="flex-1 bg-transparent text-white placeholder-white/50 text-xs sm:text-sm py-3 outline-none font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>

              {/* Primary Accent CTA */}
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/25 shrink-0 hover:scale-[1.02] cursor-pointer"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Cek Peluang <ArrowRight size={15} />
              </button>
            </form>

            {/* Quick Commodity Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-white/50 font-semibold flex items-center gap-1">
                <Tag size={11} className="text-emerald-400" /> Populer:
              </span>
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleChipClick(chip)}
                  className="text-[11px] font-bold text-white/80 hover:text-white bg-white/10 hover:bg-emerald-500/30 border border-white/15 hover:border-emerald-400/50 px-2.5 py-1 rounded-full backdrop-blur-sm transition-all cursor-pointer"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  #{chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 pt-2">
            {[
              { val: "12.450+", label: "Petani Terhubung" },
              { val: "38", label: "Provinsi Dipantau" },
              { val: "+9.2%", label: "Rata-rata Tambahan Margin", accent: true },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className={`text-2xl font-extrabold ${s.accent ? "text-emerald-400" : "text-white"}`}
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  {s.val}
                </div>
                <div
                  className="text-white/50 text-xs mt-0.5 font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Arbitrage Simulation Card */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/50 border border-slate-100/50 backdrop-blur-sm">
            {/* Header Insight Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <TrendingUp size={16} />
                </div>
                <span
                  className="text-xs font-bold text-slate-600 uppercase tracking-wider"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  Simulasi Arbitrase Harga
                </span>
              </div>
              <span
                className="bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                +9.2% Margin
              </span>
            </div>

            {/* Primary Insight Highlight */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 mb-4">
              <div className="text-xs text-slate-500 font-medium mb-1">Peluang Penjualan Hari Ini:</div>
              <div className="text-slate-900 font-extrabold text-lg sm:text-xl flex items-center gap-2">
                <span>Cabai Merah → Bandung</span>
                <TrendingUp size={18} className="text-emerald-600 shrink-0" />
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold">Estimasi Keuntungan Bersih:</span>
                <span className="font-extrabold text-emerald-700 text-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  Rp 1.250.000 <span className="text-slate-400 font-normal text-[10px]">/ 500kg</span>
                </span>
              </div>
            </div>

            {/* Progressive Disclosure Toggle Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-colors mb-4"
            >
              <span>{showDetails ? "Sembunyikan Detail Simulasi" : "Lihat Detail Simulasi & Rincian Harga"}</span>
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Progressive Disclosure Hidden Content */}
            {showDetails && (
              <div className="flex flex-col gap-2.5 mb-4 pt-1 animate-fadeIn">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Harga Asal (Cilacap)</span>
                  <span className="font-bold text-slate-800" style={{ fontFamily: "JetBrains Mono, monospace" }}>Rp 38.000 /kg</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Harga Tujuan (Bandung)</span>
                  <span className="font-bold text-slate-800" style={{ fontFamily: "JetBrains Mono, monospace" }}>Rp 41.500 /kg</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Pasar Alternatif</span>
                  <span className="font-bold text-emerald-600" style={{ fontFamily: "JetBrains Mono, monospace" }}>Surabaya (+7.1%)</span>
                </div>
              </div>
            )}

            {/* CTA Action */}
            <button
              onClick={onLoginClick}
              className="w-full flex items-center justify-center gap-2 bg-[#0d5c3a] hover:bg-[#0b4f31] text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Buka Simulasi Lengkap <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
