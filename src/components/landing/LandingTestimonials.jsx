import React from "react";
import { Star, MapPin } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Pak Sugiarto",
    location: "Cilacap, Jawa Tengah",
    commodity: "Cabai Merah",
    quote: "Sebelum pakai TaniPintar saya jual cabai ke pasar lokal saja. Sekarang saya kirim ke Bandung dan profit saya naik hampir 30% per bulan.",
    rating: 5,
    profit: "+28% profit",
  },
  {
    name: "Bu Siti Rahayu",
    location: "Brebes, Jawa Tengah",
    commodity: "Bawang Merah",
    quote: "Notifikasi harganya sangat membantu. Saya bisa menunggu sampai harga naik sebelum jual. Tidak lagi rugi karena salah waktu.",
    rating: 5,
    profit: "+19% profit",
  },
  {
    name: "Pak Hendra",
    location: "Garut, Jawa Barat",
    commodity: "Kentang",
    quote: "AI-nya rekomendasikan Jakarta Selatan sebagai tujuan jual. Margin bersih saya Rp 850 ribu lebih tinggi dari biasanya. Luar biasa.",
    rating: 5,
    profit: "+22% profit",
  },
];

export function LandingTestimonials() {
  return (
    <section className="bg-[#f7f6f2] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <div
            className="text-emerald-600 text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Cerita Petani
          </div>
          <h2
            className="text-[#0b1f13] text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Petani yang Sudah Merasakan Manfaatnya
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 flex flex-col gap-5 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote
                className="text-[#0b1f13] text-sm leading-relaxed flex-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-end justify-between pt-3 border-t border-slate-200/60">
                <div>
                  <div
                    className="text-[#0b1f13] font-bold text-sm"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-[#6b7a6f] text-xs mt-0.5 flex items-center gap-1"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <MapPin size={10} /> {t.location}
                  </div>
                  <div
                    className="text-emerald-600 text-[11px] font-medium mt-0.5"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {t.commodity}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {t.profit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
