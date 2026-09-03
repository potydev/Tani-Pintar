import React, { useState, useEffect } from "react";
import { TrendingUp, Compass, Wallet, Building2, Loader2, ArrowUpRight } from "lucide-react";
import { apiGet } from "../../utils/apiClient.js";

export function MetricCardsGrid({ originLocation = "Cilacap, Jateng" }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [datesRes, latestRes, demandRes, recsRes] = await Promise.all([
          apiGet(`/api/dates`),
          apiGet(`/api/prices/latest`),
          apiGet(`/api/demand/regional?commodity=Cabai+Merah`),
          apiGet(`/api/recommendations?origin=${encodeURIComponent(originLocation)}&commodity=Cabai+Merah`)
        ]);

        const datesData = datesRes.ok ? datesRes.data : null;
        const latestData = latestRes.ok ? latestRes.data : null;
        const demandData = demandRes.ok ? demandRes.data : null;
        const recsData = recsRes.ok ? recsRes.data : null;

        const latestDate = datesData?.data?.[0]?.label || "Hari Ini";
        const cabaiItem = latestData?.data?.find(c => c.commodity_name?.includes('Cabai Merah')) || {};
        const topRec = recsData?.data?.[0];
        const nationalAvg = cabaiItem.national_avg ? Math.round(cabaiItem.national_avg) : 49300;
        const profitDisplay = topRec ? topRec.netProfit : "Rp 14.449.000";

        setMetrics([
          {
            title: "Harga Rata-Rata Nasional",
            value: `Rp ${nationalAvg.toLocaleString('id-ID')}`,
            unit: "/kg",
            subtext: `Cabai Merah • ${latestDate}`,
            badge: "BI PIHPS",
            icon: TrendingUp,
            accent: "emerald"
          },
          {
            title: "Peluang Arbitrase Tertinggi",
            value: topRec ? topRec.city : "Jayapura",
            unit: "",
            subtext: topRec ? `Potensi selisih ${topRec.diffPercent}` : "Margin tertinggi luar pulau",
            badge: topRec?.diffPercent || "+164.8%",
            icon: Compass,
            accent: "amber"
          },
          {
            title: "Estimasi Laba Bersih",
            value: profitDisplay,
            unit: "",
            subtext: `Simulasi rute ${topRec?.city || 'Jayapura'} (500 kg)`,
            badge: "Net Profit",
            icon: Wallet,
            accent: "blue"
          },
          {
            title: "Cakupan Pantauan Pasar",
            value: "38",
            unit: "Provinsi",
            subtext: "Terhubung otomatis BI PIHPS",
            badge: "Real-time",
            icon: Building2,
            accent: "slate"
          }
        ]);
      } catch (err) {
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [originLocation]);

  const defaultMetrics = [
    {
      title: "Harga Rata-Rata Nasional",
      value: "Rp 50.900",
      unit: "/kg",
      subtext: "Cabai Merah • 38 Provinsi",
      badge: "BI PIHPS",
      icon: TrendingUp,
      accent: "emerald"
    },
    {
      title: "Peluang Arbitrase Tertinggi",
      value: "Jayapura",
      unit: "",
      subtext: "Potensi selisih margin +164.8%",
      badge: "+164.8%",
      icon: Compass,
      accent: "amber"
    },
    {
      title: "Estimasi Laba Bersih",
      value: "Rp 14.449.000",
      unit: "",
      subtext: `Simulasi rute muatan 500 kg`,
      badge: "Net Profit",
      icon: Wallet,
      accent: "blue"
    },
    {
      title: "Cakupan Pantauan Pasar",
      value: "38",
      unit: "Provinsi",
      subtext: "Terhubung otomatis BI PIHPS",
      badge: "Real-time",
      icon: Building2,
      accent: "slate"
    }
  ];

  const displayMetrics = metrics || defaultMetrics;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {defaultMetrics.map((_, idx) => (
          <div key={idx} className="tp-card p-5 flex items-center justify-center h-28 animate-pulse bg-white">
            <Loader2 size={24} className="animate-spin text-slate-300" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {displayMetrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="tp-card p-5 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.title}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-2xl font-black text-slate-900 tracking-tight">
                  {item.value}
                </span>
                {item.unit && (
                  <span className="text-xs font-bold text-slate-500">{item.unit}</span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium truncate">{item.subtext}</span>
              <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                {item.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


