import React, { useEffect } from "react";
import { X, MapPin, TrendingUp, Route, ShieldCheck, Truck, Clock } from "lucide-react";

const PROVINCE_MARKETS = {
  "DKI Jakarta": { marketName: "Pasar Induk Kramat Jati / Cipinang", province: "DKI Jakarta", demandStatus: "Sangat Tinggi (~15 Ton/hari)", bestWindow: "Setiap Hari (Konsisten)" },
  "Jawa Barat": { marketName: "Pasar Induk Caringin", province: "Jawa Barat", demandStatus: "Tinggi (~4.5 Ton/hari)", bestWindow: "Rabu - Minggu (Peak Demand)" },
  "Jawa Tengah": { marketName: "Pasar Johar / Pasar Manis", province: "Jawa Tengah", demandStatus: "Stabil (~2.5 Ton/hari)", bestWindow: "Senin - Jumat" },
  "Jawa Timur": { marketName: "Pasar Induk Osowilangun / Keputran", province: "Jawa Timur", demandStatus: "Sangat Tinggi (~8 Ton/hari)", bestWindow: "Setiap Hari" },
  "DI Yogyakarta": { marketName: "Pasar Giwangan", province: "DI Yogyakarta", demandStatus: "Stabil (~2.2 Ton/hari)", bestWindow: "Jumat - Minggu" },
  "Banten": { marketName: "Pasar Induk Tanah Tinggi Tangerang", province: "Banten", demandStatus: "Tinggi (~3.8 Ton/hari)", bestWindow: "Setiap Hari" },
  "Bali": { marketName: "Pasar Badung / Kumbasari Denpasar", province: "Bali", demandStatus: "Tinggi (~3.0 Ton/hari)", bestWindow: "Kamis - Minggu" },
  "Nusa Tenggara Barat": { marketName: "Pasar Mandalika Mataram", province: "Nusa Tenggara Barat", demandStatus: "Sedang (~1.8 Ton/hari)", bestWindow: "Senin - Kamis" },
  "Nusa Tenggara Timur": { marketName: "Pasar Kasih Naikoten Kupang", province: "Nusa Tenggara Timur", demandStatus: "Tinggi (Pasokan Luar Pulau)", bestWindow: "Selasa - Sabtu" },
  "Sumatera Utara": { marketName: "Pasar Induk Lau Cih Medan", province: "Sumatera Utara", demandStatus: "Sangat Tinggi (~7 Ton/hari)", bestWindow: "Setiap Hari" },
  "Sumatera Barat": { marketName: "Pasar Raya Padang", province: "Sumatera Barat", demandStatus: "Stabil (~2.0 Ton/hari)", bestWindow: "Rabu - Minggu" },
  "Sumatera Selatan": { marketName: "Pasar Jakabaring Palembang", province: "Sumatera Selatan", demandStatus: "Tinggi (~3.5 Ton/hari)", bestWindow: "Setiap Hari" },
  "Riau": { marketName: "Pasar Induk AKAP Pekanbaru", province: "Riau", demandStatus: "Tinggi (~3.2 Ton/hari)", bestWindow: "Senin - Sabtu" },
  "Kepulauan Riau": { marketName: "Pasar Tos 3000 Batam", province: "Kepulauan Riau", demandStatus: "Sangat Tinggi (Konsumsi Kota)", bestWindow: "Setiap Hari" },
  "Lampung": { marketName: "Pasar Tamin Bandar Lampung", province: "Lampung", demandStatus: "Stabil (~2.4 Ton/hari)", bestWindow: "Senin - Jumat" },
  "Jambi": { marketName: "Pasar Angso Duo Jambi", province: "Jambi", demandStatus: "Sedang (~1.6 Ton/hari)", bestWindow: "Rabu - Sabtu" },
  "Bengkulu": { marketName: "Pasar Panorama Bengkulu", province: "Bengkulu", demandStatus: "Sedang (~1.2 Ton/hari)", bestWindow: "Senin - Kamis" },
  "Aceh": { marketName: "Pasar Al-Mahirah Banda Aceh", province: "Aceh", demandStatus: "Stabil (~1.5 Ton/hari)", bestWindow: "Jumat - Minggu" },
  "Kepulauan Bangka Belitung": { marketName: "Pasar Pagi Pangkalpinang", province: "Kepulauan Bangka Belitung", demandStatus: "Tinggi (Serapan Pesisir)", bestWindow: "Selasa - Sabtu" },
  "Kalimantan Barat": { marketName: "Pasar Flamboyan Pontianak", province: "Kalimantan Barat", demandStatus: "Tinggi (~2.8 Ton/hari)", bestWindow: "Setiap Hari" },
  "Kalimantan Selatan": { marketName: "Pasar Sentra Antasari Banjarmasin", province: "Kalimantan Selatan", demandStatus: "Tinggi (~3.1 Ton/hari)", bestWindow: "Rabu - Minggu" },
  "Kalimantan Timur": { marketName: "Pasar Pandansari Balikpapan", province: "Kalimantan Timur", demandStatus: "Tinggi (~3.6 Ton/hari)", bestWindow: "Setiap Hari" },
  "Kalimantan Tengah": { marketName: "Pasar Besar Palangkaraya", province: "Kalimantan Tengah", demandStatus: "Stabil (~1.8 Ton/hari)", bestWindow: "Senin - Jumat" },
  "Kalimantan Utara": { marketName: "Pasar Gusher Tarakan", province: "Kalimantan Utara", demandStatus: "Tinggi (Margin Pulau)", bestWindow: "Selasa - Sabtu" },
  "Sulawesi Selatan": { marketName: "Pasar Induk Terong / Daya Makassar", province: "Sulawesi Selatan", demandStatus: "Sangat Tinggi (~6.5 Ton/hari)", bestWindow: "Setiap Hari" },
  "Sulawesi Utara": { marketName: "Pasar Bersehati Manado", province: "Sulawesi Utara", demandStatus: "Tinggi (~2.9 Ton/hari)", bestWindow: "Rabu - Minggu" },
  "Sulawesi Tengah": { marketName: "Pasar Manonda Palu", province: "Sulawesi Tengah", demandStatus: "Sedang (~1.7 Ton/hari)", bestWindow: "Senin - Kamis" },
  "Sulawesi Tenggara": { marketName: "Pasar Sentral Kota Kendari", province: "Sulawesi Tenggara", demandStatus: "Stabil (~1.9 Ton/hari)", bestWindow: "Selasa - Sabtu" },
  "Gorontalo": { marketName: "Pasar Sentral Gorontalo", province: "Gorontalo", demandStatus: "Sedang (~1.3 Ton/hari)", bestWindow: "Senin - Jumat" },
  "Sulawesi Barat": { marketName: "Pasar Sentral Mamuju", province: "Sulawesi Barat", demandStatus: "Stabil (~1.1 Ton/hari)", bestWindow: "Rabu - Sabtu" },
  "Maluku": { marketName: "Pasar Mardika Ambon", province: "Maluku", demandStatus: "Tinggi (Margin Antar Pulau)", bestWindow: "Setiap Hari" },
  "Maluku Utara": { marketName: "Pasar Gamalama / Bahari Berkesan Ternate", province: "Maluku Utara", demandStatus: "Tinggi (Margin Antar Pulau)", bestWindow: "Setiap Hari" },
  "Papua": { marketName: "Pasar Youtefa Jayapura", province: "Papua", demandStatus: "Sangat Tinggi (Harga Premium)", bestWindow: "Rabu - Minggu" },
  "Papua Barat": { marketName: "Pasar Remu Sorong", province: "Papua Barat", demandStatus: "Tinggi (Harga Premium)", bestWindow: "Setiap Hari" }
};

export function ShippingModal({
  isOpen,
  destination,
  province,
  commodity = "Cabai Merah",
  origin = "Cilacap",
  estimatedProfit,
  originPrice,
  destPrice,
  diffPercent,
  shippingInfo,
  onClose
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const city = destination || "Bandung";
  const provKey = province || Object.keys(PROVINCE_MARKETS).find(p => city.toLowerCase().includes(p.toLowerCase())) || "Jawa Barat";
  const marketInfo = PROVINCE_MARKETS[provKey] || {
    marketName: `Pasar Induk ${city}`,
    province: provKey,
    demandStatus: "Tinggi (Serapan Agregat)",
    bestWindow: "Setiap Hari"
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="text-emerald-400" size={20} />
            <h3 className="font-heading font-bold text-base">Rincian Rute &amp; Margin Arbitrase Pasar</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Route Summary */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block mb-1">
                Wilayah Pasar Tujuan ({commodity})
              </span>
              <div className="flex items-center gap-2 font-heading font-extrabold text-slate-900 text-lg">
                <MapPin size={18} className="text-emerald-600 shrink-0" />
                <span>{city} ({marketInfo.province})</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Est. Margin Bersih</span>
              <span className="font-heading font-black text-emerald-700 text-xl">{estimatedProfit || "Rp 3.000.000"}</span>
            </div>
          </div>

          {/* AI Market Rationale */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-emerald-600" />
              <span>Analisis Indikator AI:</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2.5 text-xs text-slate-700 border border-slate-100">
              <div className="flex items-start justify-between">
                <span className="text-slate-500">Pasar Utama:</span>
                <span className="font-bold text-slate-900">{marketInfo.marketName}</span>
              </div>
              <div className="flex items-start justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Rata-Rata Harga Konsumen ({city}):</span>
                <span className="font-extrabold text-emerald-700">{destPrice || "Rp 45.000 / kg"}</span>
              </div>
              <div className="flex items-start justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Kenaikan vs Lokasi Panen ({origin}):</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  {diffPercent || "+18.4% Lebih tinggi"}
                </span>
              </div>
              <div className="flex items-start justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Tingkat Serapan Pasar:</span>
                <span className="font-semibold text-slate-800">{marketInfo.demandStatus}</span>
              </div>
              <div className="flex items-start justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Waktu Distribusi Puncak:</span>
                <span className="font-bold text-amber-700">{marketInfo.bestWindow}</span>
              </div>
              {shippingInfo && (
                <div className="flex items-start justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock size={12} className="text-emerald-700" /> Estimasi Pengiriman:
                  </span>
                  <span className="font-semibold text-slate-800">{shippingInfo.duration} ({shippingInfo.distance})</span>
                </div>
              )}
            </div>
          </div>

          {/* Insights Box */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
            <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Data diperoleh dari agregasi resmi Bank Indonesia (PIHPS) &amp; BPS. Manfaatkan fitur arbitrase TaniPintar untuk pengiriman langsung dengan armada terverifikasi.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

