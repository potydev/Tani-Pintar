import React, { useState, useEffect } from "react";
import { CheckCircle2, MapPin, Truck, Clock } from "lucide-react";
import { RECOMMENDATION_FEATURED } from "../../data/mockData";
import { fetchAIRecommendations } from "../../utils/apiData";
import { ShippingModal } from "./ShippingModal";
import { TeaserCardOverlay } from "./TeaserCardOverlay";

export function FeaturedRecommendationCard({ originLocation = "Cilacap, Jateng", selectedDate, isVerifiedFarmer, onOpenUpgrade }) {
  const [data, setData] = useState(RECOMMENDATION_FEATURED);
  const [showModal, setShowModal] = useState(false);

  // Extract province from origin string (e.g. "Cilacap, Jateng" -> "Jawa Tengah")
  const provMap = {
    "Jateng": "Jawa Tengah",
    "Jabar": "Jawa Barat",
    "Jatim": "Jawa Timur",
    "Sumut": "Sumatera Utara"
  };
  const provKey = Object.keys(provMap).find(k => originLocation.includes(k));
  const provName = provKey ? provMap[provKey] : "Jawa Tengah";

  useEffect(() => {
    async function loadData() {
      const liveRecs = await fetchAIRecommendations(originLocation, 'Cabai Merah', selectedDate);
      if (liveRecs && liveRecs.length > 0) {
        setData(liveRecs[0]);
      }
    }
    loadData();
  }, [originLocation, selectedDate]);

  const displayOriginCity = data.originCity || originLocation.split(',')[0];

  const originPriceDisplay = isVerifiedFarmer ? data.originPrice : "Rp •••••";
  const destPriceDisplay = isVerifiedFarmer ? data.destPrice : "Rp •••••";
  const netProfitDisplay = isVerifiedFarmer ? data.netProfit : "Rp ••••••";
  const marginDiffDisplay = isVerifiedFarmer ? data.marginDiff : "Rp •••••";
  const shippingCostDisplay = isVerifiedFarmer ? data.shippingCost : "Rp •••••";
  const diffPercentDisplay = isVerifiedFarmer ? data.diffPercent : "+••%";

  return (
    <div className="tp-card p-6 border-emerald-200 bg-gradient-to-r from-emerald-50/30 via-white to-white mb-4 relative overflow-hidden">
      {/* Header Badge (Always Visible as Teaser Headline) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
            {data.rank}
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Rekomendasi Terbaik AI
            </div>
            <h3 className="font-heading text-xl font-extrabold text-slate-900">
              Kirim ke {data.city} {isVerifiedFarmer ? "" : "— Potensi Margin Tinggi Terdeteksi"}
            </h3>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
          {data.badge}
        </span>
      </div>

      {/* Main Grid Details Container */}
      <div className="relative min-h-[160px]">
        {/* Content details layer (blurred & masked if not verified) */}
        <div className={`grid md:grid-cols-12 gap-6 items-center transition-all ${
          !isVerifiedFarmer ? "select-none blur-[6px] opacity-40 pointer-events-none" : ""
        }`}>
          {/* AI Reasons Checklist */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Alasan AI:
            </div>
            {data.aiReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{isVerifiedFarmer ? reason : reason.replace(/[\d.,]+/g, '•••')}</span>
              </div>
            ))}
          </div>

          {/* Price Comparison */}
          <div className="md:col-span-3 space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <div className="text-[11px] font-medium text-slate-500">Harga di {displayOriginCity} (Anda)</div>
              <div className="font-heading font-bold text-slate-900 text-base">
                {originPriceDisplay} <span className="text-xs font-normal text-slate-500">/kg</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[11px] font-medium text-slate-500">Harga di {data.city}</div>
              <div className="font-heading font-extrabold text-emerald-700 text-lg flex items-center gap-1.5">
                <span>{destPriceDisplay}</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {diffPercentDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Profit breakdown */}
          <div className="md:col-span-3 space-y-1">
            <div className="text-xs font-medium text-slate-500">Estimasi Keuntungan Bersih</div>
            <div className="font-heading text-2xl font-black text-emerald-700">
              {netProfitDisplay}
            </div>
            <div className="text-xs font-medium text-slate-400">{data.netProfitQty}</div>
            <div className="text-[11px] text-slate-500 pt-2 space-y-0.5">
              <div className="flex justify-between">
                <span>Selisih Harga (500 kg):</span>
                <span className="font-semibold text-slate-700">{marginDiffDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Biaya Kirim:</span>
                <span className="font-semibold text-slate-700">{shippingCostDisplay}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-slate-100">
                <span>Keuntungan Bersih:</span>
                <span>{netProfitDisplay}</span>
              </div>
            </div>
          </div>

          {/* Shipping info & CTA */}
          <div className="md:col-span-2 flex flex-col justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
            <div className="font-bold text-slate-800 border-b border-slate-100 pb-1.5">
              Informasi Pengiriman
            </div>
            <div className="space-y-1 text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                <span>Jarak: <strong>{isVerifiedFarmer ? data.shippingInfo.distance : "••• km"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={13} className="text-slate-400" />
                <span>Biaya Kirim: <strong>{shippingCostDisplay}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400" />
                <span>Estimasi Waktu: <strong>{isVerifiedFarmer ? data.shippingInfo.duration : "•• jam"}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Teaser Overlay for Unverified Role */}
        {!isVerifiedFarmer && (
          <TeaserCardOverlay
            onOpenUpgrade={onOpenUpgrade}
            title="Analisis Margin & Keuntungan Bersih Terkunci"
            description="Buka estimasi angka Rupiah keuntungan bersih, rincian biaya kirim, dan rekomendasi AI dengan mendaftar jadi petani terverifikasi."
          />
        )}
      </div>

      {showModal && isVerifiedFarmer && (
        <ShippingModal
          destination={data.city}
          netProfit={data.netProfit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}


