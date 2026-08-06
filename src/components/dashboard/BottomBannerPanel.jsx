import React from "react";
import { Leaf, Target, TrendingUp, BarChart3, Sparkles, ArrowRight } from "lucide-react";

export function BottomBannerPanel() {
  return (
    <div className="grid lg:grid-cols-12 gap-5 mt-6">
      {/* Green Banner Left */}
      <div className="lg:col-span-8 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={20} className="text-emerald-300" />
            <h3 className="font-heading text-lg font-extrabold text-white">
              TaniPintar AI Market Intelligence
            </h3>
          </div>
          <p className="text-emerald-100 text-xs leading-relaxed mb-6 max-w-xl">
            Membantu petani menjual hasil panen dengan keputusan cerdas berbasis data pasar yang akurat dan real-time.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-700/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0">
              <Target size={14} className="text-emerald-300" />
            </div>
            <div>
              <div className="font-bold text-white">Keputusan Tepat</div>
              <div className="text-[10px] text-emerald-200">Jual ke tempat terbaik</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0">
              <TrendingUp size={14} className="text-emerald-300" />
            </div>
            <div>
              <div className="font-bold text-white">Keuntungan Maksimal</div>
              <div className="text-[10px] text-emerald-200">Dapatkan profit tinggi</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0">
              <BarChart3 size={14} className="text-emerald-300" />
            </div>
            <div>
              <div className="font-bold text-white">Analisis Real-time</div>
              <div className="text-[10px] text-emerald-200">Data selalu update</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-emerald-300" />
            </div>
            <div>
              <div className="font-bold text-white">Mudah Digunakan</div>
              <div className="text-[10px] text-emerald-200">AI siap membantu 24/7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Farmer Photo Right */}
      <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-md group min-h-[160px]">
        <img
          src="/assets/farmer_banner.png"
          alt="Petani TaniPintar"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent p-5 flex flex-col justify-end text-white">
          <div className="font-heading font-extrabold text-base mb-2">
            Jual lebih pintar, untung lebih besar!
          </div>
          <button className="self-start px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all">
            <span>Pelajari Cara Kerja AI</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
