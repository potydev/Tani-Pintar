import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ArrowRight, Route, ShieldCheck, MapPin, Target, Compass } from "lucide-react";
import { RECOMMENDATIONS_COMPACT } from "../../data/mockData";
import { fetchAIRecommendations } from "../../utils/apiData";
import { ShippingModal } from "./ShippingModal";
import { gsap } from "../../utils/gsapSetup";

export function CompactRecommendationCards({
  originLocation = "Cilacap, Jateng",
  selectedDate,
  commodity = "Cabai Merah",
  onViewAllRegions
}) {
  const [items, setItems] = useState(RECOMMENDATIONS_COMPACT);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const gridRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!loading && gridRef.current?.children) {
      gsap.from(Array.from(gridRef.current.children), {
        y: 20,
        opacity: 0,
        scale: 0.98,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [loading, items]);

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
    <div className={`mb-8 relative transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1.5 pb-3">
        <div className="flex items-center gap-2">
          <Route size={14} className="text-emerald-700" />
          <span>Rute Alternatif Lainnya Berdasarkan Data Pasar Terkini</span>
        </div>
        <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-bold">
          2 Pilihan Teratas
        </span>
      </div>

      {/* Balanced 2-Column Grid Layout with generous bottom spacing */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      {/* Spacious, Elegant Action Card: Explore All 34 Regions in Sidebar (No more dempet!) */}
      {onViewAllRegions && (
        <div ref={bannerRef} className="p-6 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/40 rounded-2xl border border-emerald-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200/80 shadow-2xs mt-0.5 md:mt-0">
                <Compass size={24} className="text-emerald-800" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200/80 tracking-wider">
                    Peta Pasar Nasional
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    34+ Provinsi Terdata
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
                  Lihat Seluruh Pilihan Rute &amp; Daerah Tujuan Pasar
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xl">
                  Bandingkan peluang harga pangan, estimasi ongkir kargo, dan margin laba bersih ke seluruh pasar induk di Indonesia dari sentra panen Anda.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onViewAllRegions}
              className="w-full md:w-auto px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer group"
            >
              <Target size={16} className="text-emerald-300 group-hover:scale-110 transition-transform" />
              <span>Buka Semua Pilihan Daerah</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-white" />
            </button>
          </div>
        </div>
      )}

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
