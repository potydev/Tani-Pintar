import React from "react";
import { ArrowDownRight, Lightbulb } from "lucide-react";

export function SupplyStatusPanel() {
  return (
    <div className="tp-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-heading font-bold text-slate-900 text-sm">Pasokan di Pasar (Nasional)</h4>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
            Sumber: BPS
          </span>
        </div>

        <div className="mb-3">
          <div className="text-xs font-semibold text-slate-500">Cabai Merah</div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-heading text-xl font-extrabold text-amber-600">Sedang</span>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5">
              <ArrowDownRight size={14} /> -4.2% (vs kemarin)
            </span>
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Total Pasokan: <strong>12.450 ton</strong>
          </div>
        </div>

        {/* Highlight Callout Box */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <span>
            Pasokan sedang menurun, harga berpotensi naik dalam beberapa hari ke depan.
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-right">
        <a href="#" className="font-bold text-emerald-700 hover:text-emerald-800 text-xs inline-flex items-center gap-1">
          Lihat Detail Pasokan &rarr;
        </a>
      </div>
    </div>
  );
}
