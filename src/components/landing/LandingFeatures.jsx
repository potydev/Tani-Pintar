import React from "react";
import { Target, TrendingUp, ShoppingCart, Wallet, ShieldCheck, Zap, Globe, Clock, BarChart3, ArrowRight } from "lucide-react";

export function LandingFeatures({ onLoginClick }) {
  const advantages5T = [
    {
      title: "1. Terjangkau & Efisien",
      desc: "Hitung otomatis estimasi ongkos kirim & penyusutan logistik antar wilayah untuk pengiriman hemat biaya.",
      icon: Wallet,
      badge: "Efisiensi Logistik",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "2. Transparan & Real-Time",
      desc: "Akses harga pangan riil yang bersumber langsung dari 34 provinsi BI PIHPS tanpa manipulasi tengkulak.",
      icon: Globe,
      badge: "BI PIHPS Data",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "3. Terpercaya & Akurat",
      desc: "Model analitik AI memberikan estimasi selisih harga bersih & rekomendasi pasar tujuan paling akurat.",
      icon: ShieldCheck,
      badge: "AI Algoritma",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "4. Terintegrasi Pasar Induk",
      desc: "Jaringan informasi komoditas terhubung dengan pasar induk utama seperti Kramat Jati & Caringin Bandung.",
      icon: ShoppingCart,
      badge: "Pasar Induk",
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "5. Tepat Waktu",
      desc: "Rekomendasi waktu terbaik panen dan penjualan untuk menghindari fluktuasi penurunan harga di pasar.",
      icon: Clock,
      badge: "Optimal Timing",
      color: "from-rose-500 to-pink-600"
    }
  ];

  const features = [
    {
      icon: Target,
      color: "bg-emerald-100 text-emerald-800",
      title: "Peluang Penjualan AI",
      desc: "Rekomendasi otomatis pasar dan kota mana yang memberikan keuntungan bersih tertinggi untuk hasil panen Anda."
    },
    {
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-800",
      title: "Prediksi Harga 5-14 Hari",
      desc: "Model prediksi berbasis AI untuk membantu Anda memutuskan apakah harus langsung panen atau menunggu harga naik."
    },
    {
      icon: ShoppingCart,
      color: "bg-amber-100 text-amber-800",
      title: "Analisis Pembeli Terbaik",
      desc: "Informasi lengkap pedagang besar, pasar induk, dan pembeli dengan permintaan tertinggi di berbagai wilayah."
    },
    {
      icon: Wallet,
      color: "bg-blue-100 text-blue-800",
      title: "Kalkulator Keuntungan Bersih",
      desc: "Hitung secara otomatis selisih harga dikurangi biaya transportasi, komisi, dan penyusutan logistik."
    }
  ];

  return (
    <div className="bg-slate-50">
      {/* 5T Value Proposition Section (Warung Pangan Inspired) */}
      <section id="keuntungan" className="py-20 px-6 max-w-7xl mx-auto border-b border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Zap size={14} />
            <span>Keuntungan Mitra 5T</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
            Mengapa Petani &amp; Supplier Memilih TaniPintar?
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Keunggulan utama 5T yang dirancang untuk memastikan setiap hasil panen Anda menghasilkan nilai ekonomi maksimal.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages5T.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-5 shadow-md`}>
                <item.icon size={24} />
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider mb-2 inline-block">
                {item.badge}
              </span>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}

          {/* Special CTA Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-2">Siap Mulai?</div>
              <h3 className="font-heading font-extrabold text-xl mb-3">
                Bergabung Sebagai Mitra Supplier Sekarang
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Dapatkan akses langsung ke dashboard analitik harga real-time tanpa biaya pendaftaran.
              </p>
            </div>
            <button
              onClick={onLoginClick}
              className="mt-6 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Daftar Mitra Gratis</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Platform Features */}
      <section id="fitur" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-extrabold tracking-widest text-emerald-700 uppercase mb-3">Fitur Utama Platform</div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
            Teknologi AI Khusus Pertanian Indonesia
          </h2>
          <p className="text-slate-600 mt-4 text-base">
            Fitur lengkap yang membantu mengambil keputusan penjualan tercepat dan paling menguntungkan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
