import React, { useState } from "react";
import { Building2, MapPin, Search, BarChart3, TrendingUp, Clock, Info } from "lucide-react";

export function TopBuyersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const marketHubs = [
    {
      id: 1,
      name: "Pasar Induk Cipinang Jaya",
      category: "Pasar Induk Utama",
      location: "Jakarta Timur, DKI Jakarta",
      commodities: "Beras, Cabai Merah, Bawang Merah",
      avgDailyPrice: "Rp 46.500 / kg",
      dailyAbsorption: "15.000 kg / hari",
      operatingHours: "24 Jam (Puncak 02:00 - 08:00 WIB)",
      demandTrend: "+4.2% Pekan Ini",
      notes: "Pusat distribusi grosir komoditas pangan terbesar wilayah Jabodetabek."
    },
    {
      id: 2,
      name: "Pasar Induk Caringin",
      category: "Pasar Induk Regional",
      location: "Bandung, Jawa Barat",
      commodities: "Cabai Merah, Bawang Merah, Sayur Mayur",
      avgDailyPrice: "Rp 45.000 / kg",
      dailyAbsorption: "8.500 kg / hari",
      operatingHours: "03:00 - 18:00 WIB",
      demandTrend: "+2.8% Pekan Ini",
      notes: "Hub penyerapan hasil panen utama dari sentra Jawa Tengah & Jawa Barat."
    },
    {
      id: 3,
      name: "Pasar Induk Johar",
      category: "Pasar Induk Jawa Tengah",
      location: "Semarang, Jawa Tengah",
      commodities: "Cabai Rawit, Bawang Merah, Beras",
      avgDailyPrice: "Rp 42.000 / kg",
      dailyAbsorption: "6.000 kg / hari",
      operatingHours: "04:00 - 16:00 WIB",
      demandTrend: "Stabil (0.0%)",
      notes: "Pasar rujukan penentuan harga komoditas hortikultura Jawa Tengah."
    },
    {
      id: 4,
      name: "Pasar Induk Osowilangun",
      category: "Pasar Induk Jawa Timur",
      location: "Surabaya, Jawa Timur",
      commodities: "Beras Medium, Cabai Merah, Daging Ayam",
      avgDailyPrice: "Rp 44.200 / kg",
      dailyAbsorption: "11.000 kg / hari",
      operatingHours: "24 Jam",
      demandTrend: "+1.5% Pekan Ini",
      notes: "Pusat serapan komoditas utama pengiriman Jawa Timur & Indonesia Timur."
    }
  ];

  const filtered = marketHubs.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.location.toLowerCase().includes(search.toLowerCase()) ||
    m.commodities.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Building2 size={14} /> National Food Distribution Hubs
        </div>
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
          Direktori Pusat Pasar Induk Pangan
        </h1>
        <p className="text-teal-100 text-sm mt-1">
          Informasi analitik kapasitas serapan pasar, jam puncak aktivitas distribusi, dan statistik harga grosir di pasar induk utama Indonesia.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pasar induk, wilayah, atau komoditas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Kategori:</span>
          {["Semua", "Pasar Induk Utama", "Pasar Induk Regional"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                category === cat ? "bg-emerald-700 text-white border-emerald-700 font-bold" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Market Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((market) => (
          <div key={market.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">{market.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-slate-400" /> {market.location}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {market.category}
                </span>
              </div>

              {/* Analytics Summary */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Rata-Rata Harga Grosir</div>
                  <div className="font-extrabold text-emerald-700 text-base mt-0.5">{market.avgDailyPrice}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Kapasitas Serapan Harian</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{market.dailyAbsorption}</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1.5">
                <div><span className="font-semibold text-slate-700">Komoditas Utama:</span> {market.commodities}</div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock size={13} className="text-slate-400" />
                  <span>Jam Operasional Puncak: <strong>{market.operatingHours}</strong></span>
                </div>
                <div className="text-slate-500 italic pt-1 border-t border-slate-100">"{market.notes}"</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <TrendingUp size={14} /> Tren Permintaan: {market.demandTrend}
              </span>
              <span className="text-[11px] bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 font-medium">
                Data Terverifikasi
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
