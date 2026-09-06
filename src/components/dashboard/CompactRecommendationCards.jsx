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
      <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1.5 pb-0.5">
        <div className="flex items-center gap-2">
          <Route size={14} className="text-emerald-700" />
          <span>Rute Alternatif Lainnya Berdasarkan Data Pasar Terkini</span>
        </div>
        <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-bold">
          2 Pilihan Teratas
        </span>
      </div>

      {/* Balanced 2-Column Grid Layout (Eliminates edge-hugging and central void) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.rank}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            {/* Header: Rank + Title + Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                    #{item.rank}
                  </div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-sm truncate">
                    Rute ke {item.city}
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0 whitespace-nowrap">
                  {item.badge || "Direkomendasikan"}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 mb-3.5 flex items-center gap-1.5 font-medium pl-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="truncate">Dari sentra {displayOriginCity} • {item.province ? `Prov. ${item.province}` : "Kargo Laut/Darat"}</span>
              </div>

              {/* Price Comparison Box */}
              <div className="bg-slate-50/90 hover:bg-slate-100/70 transition-colors p-3.5 rounded-xl border border-slate-200/80 mb-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  <span>Harga Sentra &rarr; Tujuan</span>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-1.5 py-0.5 rounded">
                    {item.diffPercent}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-slate-700">{item.originPrice}</span>
                  <span className="text-slate-400 font-bold">&rarr;</span>
                  <span className="font-extrabold text-emerald-800">{item.destPrice}</span>
                </div>
              </div>
            </div>

            {/* Bottom: Est Laba & Simulasi Action Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Est. Laba Bersih
                </span>
                <span className="font-black text-emerald-800 text-sm sm:text-base leading-tight block">
                  {item.netProfit}
                </span>
              </div>

              <button
                onClick={() => setSelectedItem(item)}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-800 text-emerald-800 hover:text-white border border-emerald-300 hover:border-emerald-800 font-extrabold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
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

