import React from "react";
import { RECOMMENDATIONS_COMPACT } from "../../data/mockData";

export function CompactRecommendationCards() {
  return (
    <div className="space-y-3 mb-6">
      {RECOMMENDATIONS_COMPACT.map((item) => (
        <div key={item.rank} className="tp-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
              {item.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-slate-900 text-base">Kirim ke {item.city}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  {item.badge}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Harga</span>
              <span className="font-bold text-slate-800">{item.originPrice}</span> &rarr; <span className="font-extrabold text-emerald-700">{item.destPrice}</span>
              <span className="ml-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">{item.diffPercent}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Keuntungan Bersih</span>
              <span className="font-extrabold text-emerald-700">{item.netProfit}</span>
            </div>
            <button className="tp-btn-outline px-4 py-2 rounded-lg text-xs font-semibold">
              Lihat Detail
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
