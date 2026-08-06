import React from "react";
import { METRICS_DATA } from "../../data/mockData";

export function MetricCardsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {METRICS_DATA.map((item, idx) => (
        <div key={idx} className="tp-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{item.title}</span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: item.iconBg, color: item.iconColor }}
              >
                <item.icon size={16} />
              </div>
            </div>
            <div className="font-heading text-2xl font-extrabold text-slate-900">
              {item.value} <span className="text-sm font-semibold text-slate-500">{item.unit}</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <span>{item.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
