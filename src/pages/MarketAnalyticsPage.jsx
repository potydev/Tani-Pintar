import React, { useState, useEffect } from "react";
import { BarChart3, Globe, MapPin, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { fetchRegionalDemand } from "../utils/apiData";

export function MarketAnalyticsPage() {
  const [commodity, setCommodity] = useState("Cabai Merah");
  const [regionalData, setRegionalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchRegionalDemand(commodity);
      if (data && Array.isArray(data)) {
        setRegionalData(data);
      }
      setLoading(false);
    }
    loadData();
  }, [commodity]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 rounded-2xl p-6 text-white shadow-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <BarChart3 size={14} /> National Market Intelligence
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            Analitik Pasar &amp; Sebaran Wilayah
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Data pemetaan sebaran tingkat harga konsumen dan status indeks permintaan di 38 provinsi di Indonesia.
          </p>
        </div>
      </div>

      {/* Commodity Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Globe size={18} className="text-emerald-700" />
          <span className="text-sm font-semibold text-slate-700">Komoditas Analitik:</span>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg px-3.5 py-2 font-bold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Cabai Merah">Cabai Merah</option>
            <option value="Cabai Rawit">Cabai Rawit</option>
            <option value="Bawang Merah">Bawang Merah</option>
            <option value="Bawang Putih">Bawang Putih</option>
            <option value="Beras">Beras</option>
            <option value="Daging Ayam">Daging Ayam</option>
            <option value="Daging Sapi">Daging Sapi</option>
            <option value="Telur Ayam">Telur Ayam</option>
            <option value="Minyak Goreng">Minyak Goreng</option>
            <option value="Gula Pasir">Gula Pasir</option>
          </select>
        </div>

        <button
          onClick={() => setCommodity(commodity)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={14} /> Refresh Analytics
        </button>
      </div>

      {/* Regional Analytics Table Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm font-medium">Memuat analitik sebaran harga wilayah...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Peringkat Harga Tertinggi per Provinsi ({commodity})
            </h3>
            <span className="text-xs text-slate-500">Sumber: Bank Indonesia (PIHPS)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Provinsi / Wilayah Pasar</th>
                  <th className="px-6 py-3">Harga Rata-Rata (Rp/kg)</th>
                  <th className="px-6 py-3">Perubahan Harga</th>
                  <th className="px-6 py-3">Status Indeks Permintaan</th>
                  <th className="px-6 py-3 text-right">Tingkat Penyerapan Pasar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionalData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <MapPin size={14} className="text-emerald-700" />
                      <span>{item.city}</span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-800 text-sm">
                      Rp {item.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-md text-[11px] ${
                        item.percent.includes('↑') ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {item.percent.includes('↑') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {item.percent}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase ${
                        item.status === 'Tinggi' ? 'bg-emerald-100 text-emerald-800' : item.status === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="w-32 bg-slate-100 rounded-full h-2.5 ml-auto overflow-hidden">
                        <div
                          className="h-2.5 rounded-full"
                          style={{ width: `${item.val}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">{item.val}% Serapan</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
