import React, { useState, useEffect } from "react";
import { ArrowUpRight, Route, ShieldCheck } from "lucide-react";
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
    <div className={`space-y-3 mb-6 relative transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>Rute Alternatif Lainnya Berdasarkan Data Pasar Terkini</span>
        <span className="text-[11px] text-emerald-700 font-bold">2 Pilihan Teratas</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.rank}
            className="tp-card p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 hover:shadow-sm transition-all duration-200 bg-white"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200">
                #{item.rank}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                    Rute ke {item.city} {item.province ? `(${item.province})` : ''}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                    {item.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Dari sentra {displayOriginCity} • Rute kargo darat/laut
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 sm:gap-6 text-xs flex-wrap sm:flex-nowrap">
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Harga Asal &rarr; Tujuan</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-bold text-slate-700">{item.originPrice}</span>
                  <span className="text-slate-400">&rarr;</span>
                  <span className="font-extrabold text-emerald-800">{item.destPrice}</span>
                  <span className="ml-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {item.diffPercent}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Est. Laba Bersih</span>
                <span className="font-black text-emerald-800 text-sm">{item.netProfit}</span>
              </div>

              <button
                onClick={() => setSelectedItem(item)}
                className="tp-btn-outline px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 flex items-center gap-1 shrink-0 transition-all"
              >
                <span>Simulasi</span>
                <ArrowUpRight size={13} />
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
          province={selectedItem.province}
          estimatedProfit={selectedItem.netProfit}
          origin={displayOriginCity}
          commodity={selectedItem.commodity || commodity}
          originPrice={selectedItem.originPrice}
          destPrice={selectedItem.destPrice}
          diffPercent={selectedItem.diffPercent}
          shippingInfo={selectedItem.shippingInfo}
        />
      )}
    </div>
  );
}

