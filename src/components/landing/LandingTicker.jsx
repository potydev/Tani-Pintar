import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TICKER_DATA } from "../../data/mockData";
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
  // Try live data first, then fallback to design data
  const liveItems = getLiveTickerItems();

  // Convert live items to the design format if available
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
    <div className="bg-[#0b1f13] border-b border-white/[0.08] overflow-hidden py-2.5">
      <div
        className="flex gap-10 whitespace-nowrap tp-ticker-track"
        style={{
          willChange: "transform",
        }}
      >
        {items.map((c, i) => (
          <div key={i} className="flex items-center gap-2.5 shrink-0">
            <span
              className="text-white/50 text-xs font-medium tracking-wide uppercase"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {c.name}
            </span>
            <span
              className="text-white text-xs font-semibold"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {c.price}{c.unit}
            </span>
            {c.change !== 0 && (
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  c.change > 0 ? "text-emerald-400" : "text-red-400"
                }`}
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {c.change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(c.change)}%
              </span>
            )}
            <span className="text-white/15 text-xs">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
