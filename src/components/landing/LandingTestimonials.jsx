import React from "react";
import { Star, MapPin, BadgeCheck, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Pak Sugiarto",
    role: "Petani Cabai Merah",
    location: "Cilacap, Jawa Tengah",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "Sebelumnya saya jual panen cabai hanya ke tengkulak lokal. Sejak pakai rekomendasi AI TaniPintar, saya tahu harga di Bandung lebih tinggi. Keuntungan bersih panen saya naik hampir 30% per bulan!",
    rating: 5,
    impactBadge: "+28% Profit Panen",
    verified: true,
  },
  {
    name: "Bu Siti Rahayu",
    role: "Petani Bawang Merah",
    location: "Brebes, Jawa Tengah",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    quote: "Notifikasi AI tentang tren harga sangat membantu. Saya tidak lagi terburu-buru jual saat harga anjlok, tapi bisa tunggu 3 hari sesuai rekomendasi waktu optimal TaniPintar.",
    rating: 5,
    impactBadge: "Hemat Biaya Logistik",
    verified: true,
  },
  {
    name: "Pak Hendra Kurnia",
    role: "Petani Kentang & Sayur",
    location: "Garut, Jawa Barat",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote: "TaniPintar langsung menghubungkan saya dengan pembeli terverifikasi di Jakarta. Transaksi aman, pembayaran langsung masuk, dan pasar jadi jauh lebih transparan.",
    rating: 5,
    impactBadge: "Pasar Terverifikasi",
    verified: true,
  },
];

export function LandingTestimonials() {
  return (
    <section className="bg-[#f7f6f2] py-20 sm:py-24 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="text-emerald-700 text-xs font-extrabold tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Cerita Petani & Dampak Nyata
          </div>
          <h2
            className="text-[#0b1f13] text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Dipercaya Oleh Ribuan Petani di Indonesia
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Dengar langsung bagaimana TaniPintar membantu petani meningkatkan margin keuntungan dan kepastian pasar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 relative group"
            >
              <Quote size={32} className="absolute top-6 right-6 text-emerald-100 group-hover:text-emerald-200 transition-colors pointer-events-none" />

              <div>
                {/* Rating Stars & Impact Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span
                    className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200/80 shadow-sm"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {t.impactBadge}
                  </span>
                </div>

                {/* Quote Story */}
                <blockquote
                  className="text-slate-700 text-sm leading-relaxed mb-6 font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              {/* Farmer Profile Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-slate-900 font-extrabold text-sm truncate"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {t.name}
                    </span>
                    {t.verified && (
                      <BadgeCheck size={15} className="text-emerald-600 fill-emerald-100 shrink-0" title="Petani Terverifikasi" />
                    )}
                  </div>
                  <div className="text-slate-500 text-xs truncate font-medium">
                    {t.role}
                  </div>
                  <div className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
