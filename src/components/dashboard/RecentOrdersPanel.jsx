import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, MapPin, Bell, Loader2 } from "lucide-react";
import { apiGet } from "../../utils/apiClient.js";

export function RecentOrdersPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await apiGet(`/api/demand/regional?commodity=Cabai+Merah`);
        if (res.ok && res.data && res.data.data && res.data.data.length > 0) {
          const mapped = res.data.data.slice(0, 4).map((item, idx) => ({
            id: `ALT-0${idx + 1}`,
            commodity: "Cabai Merah",
            location: `${item.city}`,
            price: `Rp ${Number(item.price).toLocaleString('id-ID')} / kg`,
            change: item.percent,
            up: item.status !== 'Rendah',
            time: "Data real-time BI PIHPS"
          }));
          setAlerts(mapped);
          return;
        }
      } catch (e) {
        // Fallback
      }
      // Fallback static
      setAlerts([
        { id: "ALT-01", commodity: "Cabai Merah Besar", location: "Jakarta (Pasar Cipinang)", price: "Rp 46.500 / kg", change: "+4.2%", up: true, time: "Data fallback" },
        { id: "ALT-02", commodity: "Cabai Rawit Merah", location: "Bandung (Pasar Caringin)", price: "Rp 52.000 / kg", change: "+3.8%", up: true, time: "Data fallback" },
        { id: "ALT-03", commodity: "Bawang Merah", location: "Semarang (Pasar Johar)", price: "Rp 32.000 / kg", change: "-1.2%", up: false, time: "Data fallback" },
        { id: "ALT-04", commodity: "Beras Medium", location: "Surabaya (Osowilangun)", price: "Rp 14.500 / kg", change: "+0.5%", up: true, time: "Data fallback" }
      ]);
      setLoading(false);
    }
    fetchAlerts().finally(() => setLoading(false));
  }, []);

  return (
    <div className="tp-card p-5 mt-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-emerald-600" />
          <h4 className="font-heading font-bold text-slate-900 text-sm">Signal Pasar Real-Time</h4>
        </div>
        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 size={18} className="animate-spin mr-2" />
          <span className="text-xs">Memuat signal pasar...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                  item.up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}>
                  {item.up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.commodity}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-slate-400" /> {item.location}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-heading font-extrabold text-slate-900 text-xs">{item.price}</div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                  item.up ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                }`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
