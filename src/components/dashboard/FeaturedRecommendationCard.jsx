import React, { useState, useEffect } from "react";
import { CheckCircle2, MapPin, Truck, Clock, ArrowRight, Sparkles, Tag } from "lucide-react";
import { RECOMMENDATION_FEATURED } from "../../data/mockData";
import { fetchAIRecommendations } from "../../utils/apiData";
import { ShippingModal } from "./ShippingModal";

export function FeaturedRecommendationCard({
  originLocation = "Cilacap, Jateng",
  selectedDate,
  commodity = "Cabai Merah"
}) {
  const [data, setData] = useState(RECOMMENDATION_FEATURED);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const liveRecs = await fetchAIRecommendations(originLocation, commodity, selectedDate);
      if (isMounted) {
        if (liveRecs && liveRecs.length > 0) {
          setData(liveRecs[0]);
        }
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [originLocation, selectedDate, commodity]);

  const displayOriginCity = data.originCity || originLocation.split(',')[0];
  const displayCommodity = data.commodity || commodity;

  return (
    <div className={`tp-card p-6 border-emerald-200 bg-gradient-to-r from-emerald-50/40 via-white to-white mb-4 relative overflow-hidden shadow-sm hover:shadow-md transition-all ${loading ? 'opacity-70' : 'opacity-100'}`}>
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
            {data.rank || 1}
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-emerald-600" />
              <span>Rekomendasi Terbaik AI Arbitrase</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200/60">
                {displayCommodity}
              </span>
            </div>
            <h3 className="font-heading text-xl font-extrabold text-slate-900 mt-0.5">
              Kirim ke {data.city} {data.province ? `(${data.province})` : ''}
            </h3>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
          {data.badge || "Sangat Direkomendasikan"}
        </span>
      </div>

      {/* Main Grid Details Container */}
      <div className="relative">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          {/* AI Reasons Checklist */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Alasan Rekomendasi AI:
            </div>
            {(data.aiReasons || []).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          {/* Price Comparison */}
          <div className="md:col-span-3 space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <div className="text-[11px] font-medium text-slate-500">Harga di {displayOriginCity} (Asal Panen)</div>
              <div className="font-heading font-bold text-slate-900 text-base">
                {data.originPrice} <span className="text-xs font-normal text-slate-500">/kg</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[11px] font-medium text-slate-500">Harga di {data.city} (Pasar Tujuan)</div>
              <div className="font-heading font-extrabold text-emerald-700 text-lg flex items-center gap-1.5">
                <span>{data.destPrice}</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {data.diffPercent}
                </span>
              </div>
            </div>
          </div>

          {/* Profit breakdown */}
          <div className="md:col-span-3 space-y-1">
            <div className="text-xs font-medium text-slate-500">Estimasi Keuntungan Bersih</div>
            <div className="font-heading text-2xl font-black text-emerald-700">
              {data.netProfit}
            </div>
            <div className="text-xs font-medium text-slate-400">{data.netProfitQty || "Kapasitas 500 kg muatan"}</div>
            <div className="text-[11px] text-slate-500 pt-2 space-y-0.5">
              <div className="flex justify-between">
                <span>Selisih Harga (500 kg):</span>
                <span className="font-semibold text-slate-700">{data.marginDiff}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Biaya Kirim:</span>
                <span className="font-semibold text-rose-600">-{data.shippingCost}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="tp-btn-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              <span>Atur Pengiriman</span>
              <ArrowRight size={14} />
            </button>
            <div className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
              <Truck size={12} />
              <span>Mitra Logistik Siap</span>
            </div>
          </div>
        </div>

        {/* Logistics Information Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin size={13} className="text-emerald-700" />
              <span>Jarak: <strong>{data.shippingInfo?.distance || "312 km"}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={13} className="text-emerald-700" />
              <span>Estimasi Waktu: <strong>{data.shippingInfo?.duration || "8-10 jam"}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Truck size={13} className="text-emerald-700" />
              <span>Biaya Armada: <strong>{data.shippingInfo?.cost || data.shippingCost}</strong></span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Harga live pasar berdasarkan data harian BI PIHPS
          </div>
        </div>
      </div>

      {/* Shipping Arrangement Modal */}
      <ShippingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        destination={data.city}
        estimatedProfit={data.netProfit}
        origin={displayOriginCity}
        commodity={displayCommodity}
      />
    </div>
  );
}
