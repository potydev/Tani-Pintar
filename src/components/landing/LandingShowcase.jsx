import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function LandingShowcase({ onLoginClick }) {
  return (
    <section className="py-16 px-6 bg-slate-900 text-white relative overflow-hidden border-t border-b border-emerald-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles size={14} />
            <span>Pratinjau Antarmuka Utama</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Dashboard AI Market Intelligence TaniPintar
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            Pantau pergerakan harga pangan real-time dari 34 provinsi, analisis rekomendasi penjualan berbasis AI, dan hitung estimasi keuntungan bersih dalam satu antarmuka modern.
          </p>
        </div>

        {/* Big Branding Image Banner Showcase */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 p-2 sm:p-4 group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60 pointer-events-none" />
          
          <img
            src="/assets/homepage.jpg"
            alt="Pratinjau Dashboard TaniPintar"
            className="w-full h-auto rounded-2xl object-cover shadow-inner transform transition-transform duration-700 group-hover:scale-[1.01]"
            onError={(e) => { e.target.src = "/homepage.jpg"; }}
          />

          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-lg p-5 sm:p-6 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>Integrasi Live Supabase Database</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>Data BI PIHPS Real-Time</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>Algoritma AI Rekomendasi Profit</span>
              </div>
            </div>

            <button
              onClick={onLoginClick}
              className="tp-btn-primary px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-emerald-500/20 transition-all shrink-0 w-full sm:w-auto text-center"
            >
              Coba Dashboard Sekarang
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
