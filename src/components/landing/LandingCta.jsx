import React from "react";
import { ArrowRight, Check } from "lucide-react";

export function LandingCta({ onLoginClick }) {
  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #051510 0%, #0d5c3a 60%, #16a34a 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div
          className="text-emerald-300 text-xs font-bold tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          Mulai Sekarang — Gratis
        </div>
        <h2
          className="text-white text-3xl sm:text-5xl font-extrabold leading-tight mb-5 tracking-tight"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Jangan Biarkan Panen Anda Terjual di Bawah Harga Terbaik
        </h2>
        <p
          className="text-white/60 text-base mb-10 max-w-xl mx-auto"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Bergabung dengan 12.450+ petani yang sudah meningkatkan penghasilan mereka dengan kecerdasan data pasar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onLoginClick}
            className="flex items-center justify-center gap-2 bg-white text-[#0d5c3a] font-bold px-7 py-4 rounded-xl hover:bg-emerald-50 transition-colors text-sm"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Coba Gratis 14 Hari <ArrowRight size={15} />
          </button>
          <button
            onClick={onLoginClick}
            className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl hover:bg-white/15 transition-colors text-sm"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Lihat Demo
          </button>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-white/45 text-xs"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {["Tidak perlu kartu kredit", "Setup dalam 2 menit", "Batalkan kapan saja"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check size={11} className="text-emerald-400" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
