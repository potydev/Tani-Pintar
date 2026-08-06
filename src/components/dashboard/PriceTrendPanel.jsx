import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PRICE_TREND_DATA } from "../../data/mockData";

export function PriceTrendPanel() {
  return (
    <div className="tp-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-heading font-bold text-slate-900 text-sm">Tren Harga Cabai Merah</h4>
          <div className="text-[11px] text-slate-400">Garis solid: Harga Aktual · Garis putus: Prediksi AI</div>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
          Sumber: Bapanas
        </span>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={PRICE_TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} domain={[25000, 45000]} />
            <Tooltip
              contentStyle={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
              formatter={(val) => val ? `Rp ${val.toLocaleString('id-ID')}` : '-'}
            />
            <Line
              type="monotone"
              dataKey="aktual"
              name="Harga Aktual"
              stroke="#00875A"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#00875A' }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="prediksi"
              name="Prediksi AI"
              stroke="#7C3AED"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#7C3AED' }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-slate-600 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Harga Aktual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Prediksi AI
          </span>
        </div>
        <a href="#" className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
          Lihat Analisis Lengkap &rarr;
        </a>
      </div>
    </div>
  );
}
