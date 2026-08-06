import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { TICKER_DATA } from "../../data/mockData";

export function LandingTicker() {
  const items = [...TICKER_DATA, ...TICKER_DATA];
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white overflow-hidden">
      <div className="tp-ticker-container">
        <div className="tp-ticker-track py-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 px-6 border-r border-slate-800 text-xs font-medium">
              <span className="text-slate-400">{item.name}</span>
              <span className="text-white font-bold">{item.price}</span>
              <span className={`flex items-center gap-0.5 font-bold ${item.up ? "text-emerald-400" : "text-rose-400"}`}>
                {item.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(item.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
