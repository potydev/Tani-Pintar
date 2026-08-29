import React from "react";
import { TrendingUp, TrendingDown, Radio } from "lucide-react";
import { getLiveTickerItems } from "../../utils/apiData";

const DESIGN_COMMODITIES = [
  { name: "Cabai Merah Keriting", price: "Rp 51.650", unit: "/kg", change: +2.47 },
  { name: "Daging Sapi Kualitas 1", price: "Rp 151.950", unit: "/kg", change: 0 },
  { name: "Daging Ayam Ras Segar", price: "Rp 41.800", unit: "/kg", change: 0 },
  { name: "Beras Kualitas Medium", price: "Rp 16.500", unit: "/kg", change: 0 },
  { name: "Bawang Merah Sedang", price: "Rp 38.850", unit: "/kg", change: 0 },
  { name: "Cabai Rawit Merah", price: "Rp 70.450", unit: "/kg", change: -4.77 },
  { name: "Tomat Segar", price: "Rp 12.300", unit: "/kg", change: +1.8 },
  { name: "Kentang Granola", price: "Rp 18.750", unit: "/kg", change: -0.9 },
  { name: "Jagung Pipilan", price: "Rp 7.200", unit: "/kg", change: +0.5 },
];

export function LandingTicker() {
  const liveItems = getLiveTickerItems();

  const tickerItems = liveItems.length > 0
    ? liveItems.map(item => ({
        name: item.name,
        price: item.price.replace('/kg', ''),
        unit: "/kg",
        change: item.change,
      }))
    : DESIGN_COMMODITIES;

  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-[#071d12] border-b border-emerald-900/60 overflow-hidden py-3 relative flex items-center shadow-inner">
      {/* Live Badge Fixed Left Accent */}
      <div className="hidden sm:flex items-center gap-1.5 bg-[#0d5c3a] text-emerald-300 text-[10px] font-extrabold px-3 py-1.5 z-10 shrink-0 border-r border-emerald-800 shadow-md" style={{ fontFamily: "JetBrains Mono, monospace" }}>
        <Radio size={12} className="text-emerald-400 animate-pulse" />
        <span className="tracking-widest uppercase">LIVE HARGA</span>
      </div>

      {/* Infinite Ticker Track */}
      <div
        className="flex gap-8 whitespace-nowrap tp-ticker-track"
        style={{
          willChange: "transform",
        }}
      >
        {items.map((c, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            {/* High Contrast Commodity Name */}
            <span
              className="text-slate-200 text-xs font-bold tracking-wide uppercase"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {c.name}
            </span>

            {/* High Contrast Price */}
            <span
              className="text-emerald-300 text-xs font-extrabold"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {c.price}<span className="text-white/60 text-[10px] font-medium">{c.unit}</span>
            </span>

            {/* High Contrast Change Pill */}
            {c.change !== 0 ? (
              <span
                className={`flex items-center gap-0.5 text-[11px] font-extrabold px-1.5 py-0.5 rounded ${
                  c.change > 0
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {c.change > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {c.change > 0 ? `+${c.change}%` : `${c.change}%`}
              </span>
            ) : (
              <span className="text-slate-400 text-[10px] font-semibold bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50">
                Stabil
              </span>
            )}
            <span className="text-white/20 text-xs">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
