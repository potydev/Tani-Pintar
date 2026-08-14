import React, { useState, useEffect } from "react";
import { DEMAND_REGION_DATA } from "../../data/mockData";
import { fetchRegionalDemand } from "../../utils/apiData";

export function DemandRegionPanel() {
  const [demandData, setDemandData] = useState(DEMAND_REGION_DATA);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const data = await fetchRegionalDemand();
      if (isMounted && data && data.length > 0) {
        setDemandData(data);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="tp-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-heading font-bold text-slate-900 text-sm">Permintaan per Wilayah (MySQL Data)</h4>
          <div className="text-[11px] text-slate-400">Tingkat konsumsi &amp; perubahan tren real-time</div>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
          MySQL Live
        </span>
      </div>

      <div className="space-y-3">
        {demandData.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">{item.city}</span>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${item.status === 'Tinggi' ? 'text-emerald-700' : item.status === 'Sedang' ? 'text-amber-700' : 'text-rose-600'}`}>
                  {item.status}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">{item.percent}</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.val}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-right">
        <button className="font-bold text-emerald-700 hover:text-emerald-800 text-xs inline-flex items-center gap-1">
          Lihat Semua Wilayah &rarr;
        </button>
      </div>
    </div>
  );
}

