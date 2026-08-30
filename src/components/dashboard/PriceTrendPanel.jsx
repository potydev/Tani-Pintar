import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PRICE_TREND_DATA } from "../../data/mockData";
import { fetchPriceHistory } from "../../utils/apiData";

export function PriceTrendPanel({ originLocation = "Cilacap, Jateng", selectedDate, onNavigateAnalytics }) {
  const [commodity, setCommodity] = useState("Cabai Merah");
  const [chartData, setChartData] = useState(PRICE_TREND_DATA);
  const [loading, setLoading] = useState(false);

  const originCity = originLocation ? originLocation.split(',')[0] : "Cilacap";

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchPriceHistory(commodity);
      if (isMounted) {
        if (data && data.length > 0) {
          setChartData(data);
        } else {
          setChartData(PRICE_TREND_DATA);
        }
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [commodity, originLocation, selectedDate]);

  return (
    <div className="tp-card p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-heading font-bold text-slate-900 text-sm">Tren Harga Pasar Real-Time</h4>
          <div className="text-[11px] text-slate-400">Data Historis BI PIHPS per Wilayah</div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="Cabai Merah">Cabai Merah</option>
            <option value="Beras">Beras Medium I</option>
            <option value="Bawang">Bawang Merah</option>
            <option value="Minyak">Minyak Goreng</option>
          </select>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
            BI PIHPS
          </span>
        </div>
      </div>

      <div className="h-48 w-full relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10 text-xs font-bold text-emerald-700">
            Memuat Data...
          </div>
        )}
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 11 }}
                formatter={(val) => val ? `Rp ${Number(val).toLocaleString('id-ID')}` : '-'}
              />
              {chartData[0] && chartData[0]["Cilacap (Asal)"] !== undefined ? (
                <>
                  <Line type="monotone" dataKey="Cilacap (Asal)" name={`${originCity} (Asal)`} stroke="#00875A" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Bandung" name="Bandung" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Jakarta" name="Jakarta" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="RataNasional" name="Rata-rata Nasional" stroke="#7C3AED" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                </>
              ) : (
                <>
                  <Line type="monotone" dataKey="aktual" name="Harga Aktual" stroke="#00875A" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="prediksi" name="Prediksi AI" stroke="#7C3AED" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4 }} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600" /> {originCity} (Asal)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Bandung</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600" /> Jakarta</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600" /> Nasional</span>
        </div>
      </div>
    </div>
  );
}



