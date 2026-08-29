import React from "react";
import { Lock, Sparkles } from "lucide-react";

export function TeaserCardOverlay({
  onOpenUpgrade,
  title = "Fitur Terkunci Khusus Petani Terverifikasi",
  description = "Daftarkan komoditas & lokasi panen Anda untuk membuka estimasi keuntungan, analisis biaya kirim, dan rekomendasi AI."
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-emerald-500/20 transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-emerald-200 max-w-sm text-center space-y-3 animate-in zoom-in-95 duration-200">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <Lock size={20} />
        </div>
        <div>
          <h4 className="font-heading font-extrabold text-slate-900 text-sm flex items-center justify-center gap-1.5">
            <span>{title}</span>
          </h4>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            {description}
          </p>
        </div>
        <button
          onClick={onOpenUpgrade}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles size={14} className="text-emerald-200" />
          <span>Daftar Jadi Petani untuk Lihat Detail</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
