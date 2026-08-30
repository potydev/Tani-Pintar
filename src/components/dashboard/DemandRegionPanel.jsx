import React, { useState, useEffect } from "react";
import { DEMAND_REGION_DATA } from "../../data/mockData";
import { fetchRegionalDemand } from "../../utils/apiData";

export function DemandRegionPanel() {
  const [demandData, setDemandData] = useState(DEMAND_REGION_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchRegionalDemand();
      if (isMounted && data && data.length > 0) {
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
    <div className="tp-card p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-heading font-bold text-slate-900 text-sm">Permintaan per Wilayah</h4>
          <div className="text-[11px] text-slate-400">Harga & tren real-time dari Supabase</div>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>

      <div className="relative min-h-[160px] flex-1">
        <div className="space-y-3">
          {loading ? (
            <div className="text-xs text-slate-400 text-center py-4">Memuat data pasar...</div>
          ) : (
            demandData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </span>
                    <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                      item.status === 'Tinggi' ? 'text-emerald-800 bg-emerald-100' : item.status === 'Sedang' ? 'text-amber-800 bg-amber-100' : 'text-rose-800 bg-rose-100'
                    }`}>
                      {item.percent}
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
      </div>
    </div>
  );
}



