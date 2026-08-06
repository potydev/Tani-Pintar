import React from "react";
import { Target, TrendingUp, ShoppingCart, Wallet } from "lucide-react";

export function LandingFeatures() {
  const features = [
    {
      icon: Target,
      color: "bg-emerald-100 text-emerald-700",
      title: "Peluang Penjualan AI",
      desc: "Rekomendasi otomatis pasar dan kota mana yang memberikan keuntungan bersih tertinggi untuk hasil panen Anda."
    },
    {
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-700",
      title: "Prediksi Harga 5-14 Hari",
      desc: "Model prediksi berbasis AI untuk membantu Anda memutuskan apakah harus langsung panen atau menunggu harga naik."
    },
    {
      icon: ShoppingCart,
      color: "bg-amber-100 text-amber-700",
      title: "Analisis Pembeli Terbaik",
      desc: "Informasi lengkap pedagang besar, pasar induk, dan pembeli dengan permintaan tertinggi di berbagai wilayah."
    },
    {
      icon: Wallet,
      color: "bg-blue-100 text-blue-700",
      title: "Kalkulator Keuntungan Bersih",
      desc: "Hitung secara otomatis selisih harga dikurangi biaya transportasi, komisi, dan penyusutan logistik."
    }
  ];

  return (
    <section id="fitur" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="text-xs font-extrabold tracking-widest text-emerald-700 uppercase mb-3">Fitur Unggulan</div>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
          Solusi Cerdas Penjualan Hasil Panen
        </h2>
        <p className="text-slate-600 mt-4 text-base">
          Dirancang khusus untuk membantu petani Indonesia memaksimalkan keuntungan dari setiap kilogram hasil panen.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => (
          <div key={idx} className="tp-card p-6 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color}`}>
              <item.icon size={24} />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
