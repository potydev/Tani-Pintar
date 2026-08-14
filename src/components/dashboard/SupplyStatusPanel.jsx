import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Lightbulb } from "lucide-react";

export function SupplyStatusPanel() {
  const [selectedCommodity, setSelectedCommodity] = useState("Cabai Merah");

  const supplyData = {
    "Cabai Merah": {
      status: "Sedang",
      statusColor: "text-amber-600",
      change: "-4.2%",
      isDown: true,
      totalSupply: "12.450 ton",
      insight: "Pasokan sedang menurun, harga berpotensi naik dalam beberapa hari ke depan."
    },
    "Beras Medium I": {
      status: "Melimpah",
      statusColor: "text-emerald-600",
      change: "+8.1%",
      isDown: false,
      totalSupply: "45.200 ton",
      insight: "Pasokan nasional melimpah menjelang puncak panen raya daerah."
    },
    "Bawang Merah": {
      status: "Terbatas",
      statusColor: "text-rose-600",
      change: "-12.5%",
      isDown: true,
      totalSupply: "6.800 ton",
      insight: "Pasokan sangat terbatas karena cuaca hujan, harga pasar naik pesat."
    }
  };

  const current = supplyData[selectedCommodity] || supplyData["Cabai Merah"];

  return (
    <div className="tp-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-heading font-bold text-slate-900 text-sm">Pasokan di Pasar (Nasional)</h4>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
            Sumber: BPS
          </span>
        </div>

        {/* Commodity Tabs */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {Object.keys(supplyData).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCommodity(c)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedCommodity === c
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-3 mt-1">
            <span className={`font-heading text-xl font-extrabold ${current.statusColor}`}>
              {current.status}
            </span>
            <span className={`text-xs font-bold flex items-center gap-0.5 ${current.isDown ? "text-rose-600" : "text-emerald-600"}`}>
              {current.isDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />} {current.change} (vs kemarin)
            </span>
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Total Pasokan: <strong>{current.totalSupply}</strong>
          </div>
        </div>

        {/* Highlight Callout Box */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <span>{current.insight}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-right">
        <button className="font-bold text-emerald-700 hover:text-emerald-800 text-xs inline-flex items-center gap-1">
          Lihat Detail Pasokan &rarr;
        </button>
      </div>
    </div>
  );
}

