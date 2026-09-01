import React, { useState, useEffect } from "react";
import { Target, TrendingUp, MapPin, Truck, ShieldCheck, ArrowRight, RefreshCw, Filter } from "lucide-react";
import { fetchAIRecommendations } from "../utils/apiData";

export function SalesOpportunitiesPage({ originLocation = "Jawa Tengah" }) {
  const [selectedCommodity, setSelectedCommodity] = useState("Cabai Merah Besar");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchAIRecommendations(originLocation, selectedCommodity);
      if (data) {
        setOpportunities(data);
      } else {
        // Fallback default recommendations
        setOpportunities([
          {
            rank: 1,
            city: "Bandung",
            province: "Jawa Barat",
            badge: "Sangat Direkomendasikan",
            originPrice: "Rp 38.000",
            destPrice: "Rp 45.000",
            diffPercent: "+18.4% Lebih tinggi",
            marginDiff: "Rp 3.500.000",
            shippingCost: "Rp 500.000",
            netProfit: "Rp 3.000.000",
            aiReasons: [
              "Harga +18.4% lebih tinggi dibanding lokasi panen Anda",
              "Permintaan pasar tinggi di wilayah Bandung",
              "Margin paling optimal untuk armada Engkel Box"
            ],
            shippingInfo: { distance: "312 km", cost: "Rp 500.000", duration: "8-10 jam" }
          },
          {
            rank: 2,
            city: "Jakarta",
            province: "DKI Jakarta",
            badge: "Direkomendasikan",
            originPrice: "Rp 38.000",
            destPrice: "Rp 46.500",
            diffPercent: "+22.3% Lebih tinggi",
            marginDiff: "Rp 4.250.000",
            shippingCost: "Rp 650.000",
            netProfit: "Rp 3.600.000",
            aiReasons: [
              "Harga konsumen tertinggi di Pasar Induk Cipinang",
              "Permintaan serapan pasar besar (> 5 ton)"
            ],
            shippingInfo: { distance: "390 km", cost: "Rp 650.000", duration: "10-12 jam" }
          }
        ]);
      }
      setLoading(false);
    }
    loadData();
  }, [selectedCommodity, originLocation]);

  const commodities = [
    "Cabai Merah",
    "Cabai Rawit",
    "Bawang Merah",
    "Bawang Putih",
    "Beras",
    "Daging Ayam",
    "Daging Sapi",
    "Telur Ayam",
    "Minyak Goreng",
    "Gula Pasir"
  ];

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <Target size={240} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-600/50 backdrop-blur border border-emerald-400/30 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Target size={14} /> AI Sales Arbitrage Engine
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            Peluang Penjualan Lintas Wilayah
          </h1>
          <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
            Analisis real-time perbandingan harga pasar antar-provinsi untuk menemukan lokasi tujuan pengiriman dengan margin keuntungan tertinggi dari lokasi panen Anda ({originLocation}).
          </p>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <Filter size={18} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Pilih Komoditas Panen:</span>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none flex-1 max-w-xs"
          >
            {commodities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <MapPin size={12} /> Lokasi Asal: {originLocation}
          </span>
          <button
            onClick={() => setSelectedCommodity(selectedCommodity)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm font-medium">Memindai harga pasar di seluruh provinsi...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.rank}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    opp.rank === 1 ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    Peringkat #{opp.rank} • {opp.badge}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp size={14} /> {opp.diffPercent}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {opp.city} ({opp.province})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tujuan Pengiriman Produk Komoditas {selectedCommodity}
                </p>
              </div>

              {/* Price & Financial Metrics Body */}
              <div className="p-5 space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-xs">
                  <div>
                    <div className="text-slate-500">Harga Asal ({originLocation})</div>
                    <div className="font-bold text-slate-700 text-sm">{opp.originPrice}/kg</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Harga Tujuan ({opp.city})</div>
                    <div className="font-bold text-emerald-700 text-sm">{opp.destPrice}/kg</div>
                  </div>
                </div>

                {/* AI Rationale Checklist */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Analisis Alasan AI:</div>
                  {opp.aiReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Logistics breakdown */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] text-slate-500 text-center">
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="text-slate-400">Jarak</div>
                    <div className="font-bold text-slate-700">{opp.shippingInfo.distance}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="text-slate-400">Ongkir Est.</div>
                    <div className="font-bold text-slate-700">{opp.shippingInfo.cost}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="text-slate-400">Durasi</div>
                    <div className="font-bold text-slate-700">{opp.shippingInfo.duration}</div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-4 bg-emerald-50/50 border-t border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Estimasi Laba Bersih</div>
                  <div className="font-extrabold text-emerald-800 text-base">{opp.netProfit}</div>
                </div>
                <button className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                  <span>Pilih Rute</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
