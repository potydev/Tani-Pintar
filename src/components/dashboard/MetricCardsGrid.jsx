import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Globe, Wallet, Building2, Loader2 } from "lucide-react";

const ICON_MAP = { Target, TrendingUp, Globe, Wallet, Building2 };

export function MetricCardsGrid({ originLocation = "Cilacap, Jateng" }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL ||
          (typeof window !== 'undefined' && window.location.port === '3000' ? 'http://localhost:5000/api' : '/api');
        
        const [datesRes, latestRes, demandRes] = await Promise.all([
          fetch(`${baseUrl}/dates`),
          fetch(`${baseUrl}/prices/latest`),
          fetch(`${baseUrl}/demand/regional?commodity=Cabai+Merah`)
        ]);

        const datesData = datesRes.ok ? await datesRes.json() : null;
        const latestData = latestRes.ok ? await latestRes.json() : null;
        const demandData = demandRes.ok ? await demandRes.json() : null;

        const latestDate = datesData?.data?.[0]?.label || "Hari Ini";
        const cabaiItem = latestData?.data?.find(c => c.commodity_name?.includes('Cabai Merah')) || {};
        const topDemand = demandData?.data?.[0];
        const nationalAvg = cabaiItem.national_avg ? Math.round(cabaiItem.national_avg) : 49300;

        setMetrics([
          {
            title: "Pasar Terpantau",
            value: "38",
            unit: "provinsi",
            change: "Live Data BI PIHPS",
            iconName: "Building2",
            iconBg: "#DCFCE7",
            iconColor: "#16A34A"
          },
          {
            title: "Harga Rata-rata Nasional",
            value: `Rp ${nationalAvg.toLocaleString('id-ID')}`,
            unit: "",
            change: `Cabai Merah — ${latestDate}`,
            iconName: "TrendingUp",
            iconBg: "#F3E8FF",
            iconColor: "#7C3AED"
          },
          {
            title: "Permintaan Tertinggi",
            value: topDemand?.city || "Kalimantan Selatan",
            unit: "",
            change: topDemand ? `${topDemand.percent} vs kemarin` : "Permintaan Pasar Tinggi",
            iconName: "Globe",
            iconBg: "#FFEDD5",
            iconColor: "#EA580C"
          },
          {
            title: "Estimasi Keuntungan",
            value: "Rp 14.850.000",
            unit: "",
            change: `Rute dari ${originLocation.split(',')[0]} (500kg)`,
            iconName: "Wallet",
            iconBg: "#DBEAFE",
            iconColor: "#2563EB"
          },
          {
            title: "Tanggal Data Terbaru",
            value: datesData?.data?.[0]?.date || "2026-08-28",
            unit: "",
            change: latestDate,
            iconName: "Target",
            iconBg: "#DCFCE7",
            iconColor: "#16A34A"
          }
        ]);
      } catch (err) {
        // Fallback to statics
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [originLocation]);

  // Default static fallback
  const defaultMetrics = [
    { title: "Pasar Terpantau", value: "38", unit: "provinsi", change: "Live Data BI PIHPS", iconName: "Building2", iconBg: "#DCFCE7", iconColor: "#16A34A" },
    { title: "Harga Rata-rata Nasional", value: "Rp 50.900", unit: "", change: "Cabai Merah", iconName: "TrendingUp", iconBg: "#F3E8FF", iconColor: "#7C3AED" },
    { title: "Permintaan Tertinggi", value: "Kalimantan Selatan", unit: "", change: "↑ 18% dari kemarin", iconName: "Globe", iconBg: "#FFEDD5", iconColor: "#EA580C" },
    { title: "Estimasi Keuntungan", value: "Rp 14.850.000", unit: "", change: `Rute dari ${originLocation.split(',')[0]}`, iconName: "Wallet", iconBg: "#DBEAFE", iconColor: "#2563EB" },
    { title: "Tanggal Data Terbaru", value: "2026-08-28", unit: "", change: "Data Terupdate", iconName: "Target", iconBg: "#DCFCE7", iconColor: "#16A34A" }
  ];

  const displayMetrics = metrics || defaultMetrics;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {defaultMetrics.map((_, idx) => (
          <div key={idx} className="tp-card p-4 flex items-center justify-center h-24 animate-pulse">
            <div className="w-6 h-6 text-slate-300"><Loader2 size={24} className="animate-spin" /></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {displayMetrics.map((item, idx) => {
        const IconComp = ICON_MAP[item.iconName] || Target;
        return (
          <div
            key={idx}
            className="tp-card p-4 flex flex-col justify-between hover:shadow-sm hover:border-emerald-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">{item.title}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                >
                  <IconComp size={16} />
                </div>
              </div>
              <div className="font-heading text-xl font-extrabold text-slate-900 truncate">
                {item.value} <span className="text-sm font-semibold text-slate-500">{item.unit}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-emerald-700 truncate">
              <span className="truncate">{item.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

