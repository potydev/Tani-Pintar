import React, { useState, useEffect } from "react";
import { DEMAND_REGION_DATA } from "../../data/mockData";
import { fetchRegionalDemand } from "../../utils/apiData";
import { TeaserCardOverlay } from "./TeaserCardOverlay";

export function DemandRegionPanel({ isVerifiedFarmer, onOpenUpgrade }) {
  const [demandData, setDemandData] = useState(DEMAND_REGION_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchRegionalDemand();
      if (isMounted && data && data.length > 0) {
        // Show top 5 and compute relative bar width
        const top5 = data.slice(0, 5);
        const maxPrice = Math.max(...top5.map(d => d.price));
        const normalized = top5.map(d => ({
          ...d,
          val: Math.round((d.price / maxPrice) * 100)
        }));
        setDemandData(normalized);
      }
      if (isMounted) setLoading(false);
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="tp-card p-5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-heading font-bold text-slate-900 text-sm">Permintaan per Wilayah</h4>
          <div className="text-[11px] text-slate-400">Harga & tren real-time dari Supabase</div>
        </div>
        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
          Live
        </span>
      </div>

      <div className="relative min-h-[160px] flex-1">
        <div className={`space-y-3 transition-all ${
          !isVerifiedFarmer ? "select-none blur-[5px] opacity-40 pointer-events-none" : ""
        }`}>
          {loading ? (
            <div className="text-xs text-slate-400 text-center py-4">Memuat data pasar...</div>
          ) : (
            demandData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-700">
                      {isVerifiedFarmer ? `Rp ${Number(item.price).toLocaleString('id-ID')}` : 'Rp •••••'}
                    </span>
                    <span className={`font-semibold text-[10px] ${item.status === 'Tinggi' ? 'text-emerald-700' : item.status === 'Sedang' ? 'text-amber-700' : 'text-rose-600'}`}>
                      {isVerifiedFarmer ? item.percent : '+••%'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.val}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {!isVerifiedFarmer && (
          <TeaserCardOverlay
            onOpenUpgrade={onOpenUpgrade}
            title="Data Permintaan Wilayah Terkunci"
            description="Buka indikator permintaan & harga komoditas per provinsi."
          />
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-right">
        <button
          onClick={() => !isVerifiedFarmer && onOpenUpgrade && onOpenUpgrade()}
          className="font-bold text-emerald-700 hover:text-emerald-800 text-xs inline-flex items-center gap-1"
        >
          Lihat Semua Wilayah &rarr;
        </button>
      </div>
    </div>
  );
}


