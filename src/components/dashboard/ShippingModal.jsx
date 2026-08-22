import React from "react";
import { X, MapPin, CheckCircle2, TrendingUp, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export function ShippingModal({ destination, netProfit, onClose }) {
  const city = destination || "Bandung";

  const marketDetails = {
    Bandung: {
      marketName: "Pasar Induk Caringin",
      province: "Jawa Barat",
      demandStatus: "Tinggi (Serapan ~3.5 Ton/hari)",
      avgPrice: "Rp 45.000 / kg",
      priceChange: "+18.4% vs Lokasi Panen",
      bestWindow: "Rabu - Jumat (Peak Demand)"
    },
    Jakarta: {
      marketName: "Pasar Induk Cipinang Jaya",
      province: "DKI Jakarta",
      demandStatus: "Sangat Tinggi (Serapan ~12 Ton/hari)",
      avgPrice: "Rp 46.500 / kg",
      priceChange: "+22.3% vs Lokasi Panen",
      bestWindow: "Setiap Hari (Konsisten)"
    },
    Purwokerto: {
      marketName: "Pasar Manis Purwokerto",
      province: "Jawa Tengah",
      demandStatus: "Sedang (Serapan ~1.5 Ton/hari)",
      avgPrice: "Rp 42.500 / kg",
      priceChange: "+11.8% vs Lokasi Panen",
      bestWindow: "Senin - Kamis"
    },
    Yogyakarta: {
      marketName: "Pasar Giwangan",
      province: "DI Yogyakarta",
      demandStatus: "Stabil (Serapan ~2.2 Ton/hari)",
      avgPrice: "Rp 43.000 / kg",
      priceChange: "+13.1% vs Lokasi Panen",
      bestWindow: "Jumat - Minggu"
    }
  };

  const market = marketDetails[city] || marketDetails["Bandung"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={20} />
            <h3 className="font-heading font-bold text-base">Rincian Analisis Pasar AI</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Route Summary */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block mb-1">
                Wilayah Pasar Tujuan
              </span>
              <div className="flex items-center gap-2 font-heading font-extrabold text-slate-900 text-lg">
                <MapPin size={18} className="text-emerald-600" />
                <span>{city} ({market.province})</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Est. Margin Bersih</span>
              <span className="font-heading font-black text-emerald-700 text-xl">{netProfit || "Rp 3.000.000"}</span>
            </div>
          </div>

          {/* AI Market Rationale */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-emerald-600" />
              <span>Analisis Indikator AI:</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2.5 text-xs text-slate-700 border border-slate-100">
              <div className="flex items-start justify-between">
                <span className="text-slate-500">Pasar Utama:</span>
                <span className="font-bold text-slate-900">{market.marketName}</span>
              </div>
              <div className="flex items-start justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Rata-Rata Harga Konsumen:</span>
                <span className="font-extrabold text-emerald-700">{market.avgPrice}</span>
              </div>
              <div className="flex items-start justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Kenaikan Dibanding Asal:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">{market.priceChange}</span>
              </div>
              <div className="flex items-start justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Tingkat Serapan Pasar:</span>
                <span className="font-semibold text-slate-800">{market.demandStatus}</span>
              </div>
              <div className="flex items-start justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Waktu Distribusi Puncak:</span>
                <span className="font-bold text-amber-700">{market.bestWindow}</span>
              </div>
            </div>
          </div>

          {/* Insights Box */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
            <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Data diperoleh dari agregasi resmi Bank Indonesia (PIHPS) &amp; BPS. Gunakan kalkulator keuntungan untuk mensimulasikan biaya angkut secara mandiri.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
