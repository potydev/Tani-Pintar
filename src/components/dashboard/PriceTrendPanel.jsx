import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PRICE_TREND_DATA } from "../../data/mockData";
import { fetchPriceHistory } from "../../utils/apiData";

export function PriceTrendPanel({ originLocation = "Cilacap, Jateng", selectedDate }) {
  const [commodity, setCommodity] = useState("Cabai Merah");
  const [chartData, setChartData] = useState(PRICE_TREND_DATA);
  const [loading, setLoading] = useState(false);

  const originCity = originLocation ? originLocation.split(',')[0] : "Cilacap";

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchPriceHistory(commodity, originLocation);
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

  // Extract dynamic line keys from chartData
  const sample = chartData && chartData[0] ? chartData[0] : {};
  const dataKeys = Object.keys(sample).filter(k => k !== 'date' && k !== 'RataNasional');
  const palette = ["#00875A", "#2563EB", "#D97706", "#0D9488", "#DC2626"];

  return (
    <div className="tp-card p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-heading font-bold text-slate-900 text-sm">Tren Harga Pasar Real-Time</h4>
          <div className="text-[11px] text-slate-400">Data Historis BI PIHPS per Wilayah (Asal: {originCity})</div>
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
              {dataKeys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={key.includes('(Asal)') ? "#00875A" : palette[(idx + 1) % palette.length]}
                  strokeWidth={key.includes('(Asal)') ? 3 : 2}
                  dot={{ r: 3 }}
                />
              ))}
              {sample.RataNasional !== undefined && (
                <Line
                  type="monotone"
                  dataKey="RataNasional"
                  name="Rata-rata Nasional"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[10px]">
          {dataKeys.slice(0, 3).map((k, i) => (
            <span key={k} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: k.includes('(Asal)') ? "#00875A" : palette[(i + 1) % palette.length] }}
              />
              {k}
            </span>
          ))}
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-600" /> Nasional
          </span>
        </div>
      </div>
    </div>
  );
}




