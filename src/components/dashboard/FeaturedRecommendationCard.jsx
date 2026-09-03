import React, { useState, useEffect } from "react";
import { CheckCircle2, MapPin, Truck, Clock, ArrowRight, TrendingUp, ShieldCheck, Route } from "lucide-react";
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
    <div className={`tp-card p-6 border-emerald-200/90 bg-white mb-4 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
            #{data.rank || 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Route size={14} className="text-emerald-700" />
                Rekomendasi Rute Arbitrase Unggulan
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                {displayCommodity}
              </span>
            </div>
            <h3 className="font-heading text-xl font-extrabold text-slate-900 mt-0.5">
              Rute {displayOriginCity} &rarr; {data.city} {data.province ? `(${data.province})` : ''}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {data.badge || "Margin Tertinggi"}
          </span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-center">
        {/* Price Comparison Box (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Harga di {displayOriginCity} (Sentra Asal)
            </div>
            <div className="font-heading font-bold text-slate-800 text-lg mt-0.5">
              {data.originPrice} <span className="text-xs font-medium text-slate-500">/kg</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Harga di {data.city} (Pasar Induk Tujuan)
            </div>
            <div className="font-heading font-black text-emerald-700 text-xl flex items-center justify-between gap-2 mt-0.5">
              <span>{data.destPrice} <span className="text-xs font-medium text-slate-500">/kg</span></span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                {data.diffPercent}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-2 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
          <div className="text-xs font-semibold text-slate-500">Estimasi Laba Bersih (Net Profit)</div>
          <div className="font-heading text-2xl font-black text-emerald-800">
            {data.netProfit}
          </div>
          <div className="text-xs font-medium text-slate-500">{data.netProfitQty || "Muatan standar 500 kg"}</div>
          <div className="pt-2 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Selisih Nilai Jual (500 kg):</span>
              <span className="font-bold text-slate-800">{data.marginDiff}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimasi Biaya Logistik:</span>
              <span className="font-bold text-rose-600">-{data.shippingCost}</span>
            </div>
          </div>
        </div>

        {/* Market Indicators & Action (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dasar Analisis Pasar:
            </div>
            {(data.aiReasons || [
              "Selisih harga jual komoditas signifikan terhadap pasar lokal",
              "Biaya logistik kargo terkompensasi dengan margin penjualan tinggi",
              "Permintaan komoditas di pasar induk tujuan konsisten tinggi"
            ]).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="tp-btn-primary w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-emerald-900 transition-all"
          >
            <span>Simulasi Rute &amp; Pengiriman Kargo</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Logistics & Source Bar */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-slate-400" />
            <span>Jarak Tempuh: <strong className="text-slate-700">{data.shippingInfo?.distance || "312 km"}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" />
            <span>Estimasi Durasi: <strong className="text-slate-700">{data.shippingInfo?.duration || "8-10 jam"}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck size={13} className="text-slate-400" />
            <span>Tarif Kargo: <strong className="text-slate-700">{data.shippingInfo?.cost || data.shippingCost}</strong></span>
          </div>
        </div>

        <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-700" />
          Data harga terverifikasi BI PIHPS
        </div>
      </div>

      {/* Shipping Arrangement Modal */}
      <ShippingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        destination={data.city}
        province={data.province}
        estimatedProfit={data.netProfit}
        origin={displayOriginCity}
        commodity={displayCommodity}
        originPrice={data.originPrice}
        destPrice={data.destPrice}
        diffPercent={data.diffPercent}
        shippingInfo={data.shippingInfo}
      />
    </div>
  );
}

