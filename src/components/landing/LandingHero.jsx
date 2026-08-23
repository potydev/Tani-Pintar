import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

export function LandingHero({ onLoginClick }) {
  const [query, setQuery] = useState("");

  return (
    <section
      id="beranda"
      className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #051510 0%, #0b2e1a 40%, #0d5c3a 100%)",
      }}
    >
      {/* Grid overlay */}
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #16a34a 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-full px-4 py-1.5 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span
              className="text-white/80 text-xs font-semibold tracking-wide"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Platform AI Penjualan Hasil Panen #1 di Indonesia
            </span>
          </div>

          <h1
            className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Jual Panen di<br />
            <span className="text-emerald-400">Waktu & Tempat</span><br />
            yang Tepat
          </h1>

          <p
            className="text-white/60 text-base leading-relaxed max-w-md"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            TaniPintar menganalisis harga, permintaan pasar, dan biaya logistik secara real-time untuk merekomendasikan keputusan penjualan paling menguntungkan bagi petani.
          </p>

          {/* Search */}
          <div className="flex gap-2 max-w-md">
            <div className="flex-1 flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/[0.15] rounded-xl px-4">
              <Search size={16} className="text-white/40 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari komoditas: Cabai Merah, Bawang..."
                className="flex-1 bg-transparent text-white placeholder-white/35 text-sm py-3.5 outline-none"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shrink-0"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Cek Peluang <ArrowRight size={14} />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { val: "12.450+", label: "Petani Terhubung" },
              { val: "34", label: "Kota Dipantau" },
              { val: "9.2%", label: "Rata-rata Profit Tambahan", accent: true },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className={`text-2xl font-extrabold ${s.accent ? "text-emerald-400" : "text-white"}`}
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  {s.val}
                </div>
                <div
                  className="text-white/45 text-xs mt-0.5"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — AI Card */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span
                      className="text-[10px] font-bold text-emerald-700"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      #1
                    </span>
                  </div>
                  <span
                    className="text-xs text-[#6b7a6f] font-medium"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Rekomendasi AI Hari Ini
                  </span>
                </div>
                <h3
                  className="text-[#0b1f13] font-bold text-xl"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  Kirim ke Bandung
                </h3>
              </div>
              <span
                className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                +9.2% Margin
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: "Harga Asal (Cilacap)", val: "Rp 38.000 /kg", bold: false },
                { label: "Harga Tujuan (Bandung)", val: "Rp 41.500 /kg", bold: false },
                { label: "Estimasi Profit Bersih", val: "Rp 1.250.000 /500kg", bold: true, green: true },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-2.5 border-b border-[#f0eeea] last:border-0"
                >
                  <span
                    className="text-[#6b7a6f] text-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {row.label}
                  </span>
                  <span
                    className={`text-sm font-semibold ${row.green ? "text-emerald-600" : "text-[#0b1f13]"}`}
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {row.val}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onLoginClick}
              className="w-full flex items-center justify-center gap-2 bg-[#0d5c3a] hover:bg-[#0b4f31] text-white font-semibold py-3.5 rounded-xl transition-colors"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Lihat Simulasi Lengkap <ArrowRight size={15} />
            </button>
          </div>

          {/* Secondary cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Pasar Alternatif", val: "Surabaya", sub: "+7.1% margin" },
              { label: "Waktu Jual Optimal", val: "3–5 hari lagi", sub: "Harga diprediksi naik" },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white/10 border border-white/[0.12] rounded-xl p-3.5 backdrop-blur-sm"
              >
                <div
                  className="text-white/45 text-[10px] font-medium mb-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {c.label}
                </div>
                <div
                  className="text-white font-bold text-base"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  {c.val}
                </div>
                <div
                  className="text-emerald-400 text-[11px] font-medium mt-0.5"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {c.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
