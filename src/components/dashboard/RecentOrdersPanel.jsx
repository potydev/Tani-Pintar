import React from "react";
import { Truck, MapPin } from "lucide-react";
import { RECENT_ORDERS_DATA } from "../../data/mockData";

export function RecentOrdersPanel() {
  return (
    <div className="tp-card p-5 mt-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading font-bold text-slate-900 text-sm">Pesanan Masuk Terbaru</h4>
        <a href="#" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
          Lihat Semua &rarr;
        </a>
      </div>

      <div className="space-y-3">
        {RECENT_ORDERS_DATA.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                <Truck size={18} className="text-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.statusType === 'green' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-0.5">{order.commodity}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin size={10} /> {order.location} · {order.time}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-heading font-extrabold text-slate-900 text-sm">{order.price}</div>
              <span className="text-[11px] font-bold text-slate-500 block mt-0.5">{order.actionState}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
