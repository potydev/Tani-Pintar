import React, { useState, useEffect } from "react";
import { RECOMMENDATIONS_COMPACT } from "../../data/mockData";
import { fetchAIRecommendations } from "../../utils/apiData";
import { ShippingModal } from "./ShippingModal";

export function CompactRecommendationCards({
  originLocation = "Cilacap, Jateng",
  selectedDate,
  commodity = "Cabai Merah"
}) {
  const [items, setItems] = useState(RECOMMENDATIONS_COMPACT);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const liveRecs = await fetchAIRecommendations(originLocation, commodity, selectedDate);
      if (isMounted) {
        if (liveRecs && liveRecs.length > 1) {
          setItems(liveRecs.slice(1, 3));
        }
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [originLocation, selectedDate, commodity]);

  const displayOriginCity = originLocation ? originLocation.split(',')[0] : "Cilacap";

  return (
    <div className={`space-y-3 mb-6 relative transition-opacity ${loading ? 'opacity-70' : 'opacity-100'}`}>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.rank} className="tp-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
                {item.rank}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-slate-900 text-base">
                    Kirim ke {item.city} {item.province ? `(${item.province})` : ''}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm flex-wrap sm:flex-nowrap">
              <div>
                <span className="text-xs text-slate-400 block">Harga Jual</span>
                <span className="font-bold text-slate-700">{item.originPrice}</span> &rarr; <span className="font-extrabold text-emerald-700">{item.destPrice}</span>
                <span className="ml-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">{item.diffPercent}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Laba Bersih Est.</span>
                <span className="font-extrabold text-emerald-700">{item.netProfit}</span>
              </div>
              <button
                onClick={() => setSelectedItem(item)}
                className="tp-btn-outline px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <ShippingModal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          destination={selectedItem.city}
          estimatedProfit={selectedItem.netProfit}
          origin={displayOriginCity}
          commodity={selectedItem.commodity || commodity}
        />
      )}
    </div>
  );
}
