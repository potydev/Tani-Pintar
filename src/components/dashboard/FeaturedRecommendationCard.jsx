import React, { useState, useEffect } from "react";
import { CheckCircle2, MapPin, Truck, Clock } from "lucide-react";
import { RECOMMENDATION_FEATURED } from "../../data/mockData";
import { fetchAIRecommendations } from "../../utils/apiData";
import { ShippingModal } from "./ShippingModal";

export function FeaturedRecommendationCard({ originLocation = "Cilacap, Jateng", selectedDate }) {
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
      const liveRecs = await fetchAIRecommendations(provName, 'Cabai Merah');
      if (liveRecs && liveRecs.length > 0) {
        setData(liveRecs[0]);
      }
    }
    loadData();
  }, [originLocation, selectedDate]);

  return (
    <div className="tp-card p-6 border-emerald-200 bg-gradient-to-r from-emerald-50/30 via-white to-white mb-4">
      {/* Header Badge */}
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
              Kirim ke {data.city}
            </h3>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
          {data.badge}
        </span>
      </div>

      {/* Main Grid Details */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* AI Reasons Checklist */}
        <div className="md:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Alasan AI:
          </div>
          {data.aiReasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Price Comparison */}
        <div className="md:col-span-3 space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Harga di {originLocation}</div>
            <div className="font-heading font-bold text-slate-900 text-base">
              {data.originPrice} <span className="text-xs font-normal text-slate-500">/kg</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Harga di Bandung</div>
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
          <div className="text-xs font-medium text-slate-400">{data.netProfitQty}</div>
          <div className="text-[11px] text-slate-500 pt-2 space-y-0.5">
            <div className="flex justify-between">
              <span>Selisih Harga (500 kg):</span>
              <span className="font-semibold text-slate-700">{data.marginDiff}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimasi Biaya Kirim:</span>
              <span className="font-semibold text-slate-700">{data.shippingCost}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-slate-100">
              <span>Keuntungan Bersih:</span>
              <span>{data.netProfit}</span>
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
              <span>Jarak: <strong>{data.shippingInfo.distance}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck size={13} className="text-slate-400" />
              <span>Biaya Kirim: <strong>{data.shippingInfo.cost}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" />
              <span>Estimasi Waktu: <strong>{data.shippingInfo.duration}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ShippingModal
          destination={data.city}
          netProfit={data.netProfit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

