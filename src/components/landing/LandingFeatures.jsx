import React from "react";
import { BarChart2, Zap, Truck, Bell, Shield, MapPin } from "lucide-react";

const FEATURES = [
  {
    icon: BarChart2,
    title: "Analitik Harga Real-Time",
    desc: "Pantau pergerakan harga komoditas dari 38 provinsi secara langsung. Data terintegrasi Bank Indonesia PIHPS dan pasar induk nasional.",
    highlight: "38 Provinsi Terpantau",
  },
  {
    icon: Zap,
    title: "Optimasi Rute Arbitrase Pasar",
    desc: "Algoritma cerdas menganalisis disparitas harga, jarak tempuh kargo, dan toleransi susut muatan untuk menghasilkan rekomendasi pasar berkeuntungan tertinggi.",
    highlight: "+9.2% Rata-rata Profit",
  },
  {
    icon: Truck,
    title: "Kalkulasi Biaya Logistik",
    desc: "Hitung biaya pengiriman ke berbagai kota secara otomatis dan bandingkan margin bersih untuk keputusan penjualan yang optimal.",
    highlight: "Estimasi Akurat 97%",
  },
  {
    icon: Bell,
    title: "Notifikasi Harga Optimal",
    desc: "Terima peringatan WhatsApp saat harga komoditas Anda menyentuh target jual. Jangan lewatkan momentum terbaik.",
    highlight: "Alert Instan",
  },
  {
    icon: Shield,
    title: "Data Terverifikasi",
    desc: "Semua data harga bersumber langsung dari BPSP, Kemendag, dan jaringan 450+ pedagang mitra kami yang terverifikasi.",
    highlight: "450+ Mitra Pedagang",
  },
  {
    icon: MapPin,
    title: "Peta Pasar Interaktif",
    desc: "Visualisasikan harga berdasarkan wilayah untuk menemukan pasar dengan demand tertinggi mendekati musim panen Anda.",
    highlight: "Peta Wilayah Lengkap",
  },
];

export function LandingFeatures() {
  return (
    <section id="fitur" className="bg-[#f7f6f2] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <div
            className="text-emerald-600 text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Fitur Unggulan
          </div>
          <h2
            className="text-[#0b1f13] text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight max-w-lg"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Semua yang Petani Butuhkan untuk Jual Lebih Mahal
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white p-7 flex flex-col gap-4 group hover:bg-[#f7f6f2] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Icon size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h3
                    className="text-[#0b1f13] font-bold text-base mb-2"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-[#6b7a6f] text-sm leading-relaxed"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {f.desc}
                  </p>
                </div>
                <div className="mt-auto pt-2">
                  <span
                    className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                    {f.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
