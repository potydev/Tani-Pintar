import React, { useState } from "react";
import { Tag, ShieldAlert, CheckCircle, Info, Calculator, ArrowRight } from "lucide-react";

export function PriceRecommendationPage() {
  const [commodity, setCommodity] = useState("Cabai Merah Besar");
  const [costPerKg, setCostPerKg] = useState(24000);
  const [expectedMarginPct, setExpectedMarginPct] = useState(35);

  const minFloorPrice = Math.round(costPerKg * 1.15); // +15% minimum safety floor
  const targetFairPrice = Math.round(costPerKg * (1 + expectedMarginPct / 100)); // target margin
  const maxCeilingPrice = Math.round(costPerKg * 1.85); // maximum market limit

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Tag size={14} /> AI Price Band Engine
        </div>
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
          Rekomendasi Batas Harga Jual Panen
        </h1>
        <p className="text-emerald-100 text-sm mt-1">
          Kalkulator batas harga bawah (mencegah rugi) dan harga wajar target agar Anda memiliki posisi tawar yang kuat di hadapan pedagang/pengepul.
        </p>
      </div>

      {/* Main Grid Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Input Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 font-heading font-bold text-slate-900 text-lg pb-3 border-b border-slate-100">
            <Calculator size={20} className="text-emerald-700" />
            <span>Parameter Biaya Panen</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Komoditas Utama</label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-emerald-500"
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Estimasi Modal Produksi (HPP) per kg: <span className="font-bold text-emerald-800">Rp {costPerKg.toLocaleString('id-ID')}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="50000"
                step="1000"
                value={costPerKg}
                onChange={(e) => setCostPerKg(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Rp 10.000</span>
                <span>Rp 50.000</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Target Margin Keuntungan Bersih: <span className="font-bold text-emerald-800">{expectedMarginPct}%</span>
              </label>
              <input
                type="range"
                min="15"
                max="80"
                step="5"
                value={expectedMarginPct}
                onChange={(e) => setExpectedMarginPct(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>15% (Minimal)</span>
                <span>80% (Maksimal)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Recommended Price Output Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Target Fair Price Card */}
          <div className="bg-emerald-800 text-white p-6 rounded-xl shadow-md border border-emerald-700 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-emerald-700 text-emerald-100 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                  ⭐ Target Harga Ideal AI
                </span>
                <div className="text-3xl md:text-4xl font-extrabold text-white mt-3">
                  Rp {targetFairPrice.toLocaleString('id-ID')} <span className="text-sm font-normal text-emerald-200">/ kg</span>
                </div>
                <p className="text-xs text-emerald-100 mt-2">
                  Harga penawaran terbaik ke tengkulak/pasar untuk memperoleh margin laba bersih {expectedMarginPct}%.
                </p>
              </div>
            </div>
          </div>

          {/* Price Range Limits Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Minimum Floor Price */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase">
                <ShieldAlert size={16} /> Batas Bawah (Floor Price)
              </div>
              <div className="text-2xl font-bold text-slate-900">
                Rp {minFloorPrice.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                **Jangan menjual di bawah angka ini!** Menjual di bawah harga ini akan menyebabkan kerugian modal produksi Anda.
              </p>
            </div>

            {/* Maximum Ceiling Price */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase">
                <CheckCircle size={16} /> Batas Atas (Ceiling Price)
              </div>
              <div className="text-2xl font-bold text-slate-900">
                Rp {maxCeilingPrice.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Batas maksimal harga pasar konsumen. Lebih tinggi dari ini risikonya barang sulit diserap pasar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
