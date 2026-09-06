import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { gsap } from "../../utils/gsapSetup";

const STEPS = [
  { num: "01", title: "Pilih Komoditas", desc: "Masukkan jenis hasil panen dan lokasi kebun Anda." },
  { num: "02", title: "AI Analisis Pasar", desc: "Sistem kami memproses harga, permintaan, dan biaya logistik secara otomatis." },
  { num: "03", title: "Terima Rekomendasi", desc: "Dapatkan daftar pasar tujual terbaik diurutkan berdasarkan estimasi profit bersih." },
  { num: "04", title: "Jual & Profit", desc: "Hubungi pembeli langsung atau gunakan jaringan mitra logistik kami." },
];

export function LandingHowItWorks() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
            clearProps: "transform,opacity",
          }
        );
      }

      if (stepsRef.current?.children) {
        gsap.fromTo(
          Array.from(stepsRef.current.children),
          { y: 35, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 82%",
              once: true,
            },
            clearProps: "transform,opacity",
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              once: true,
            },
            clearProps: "transform,opacity",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0b1f13] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-16">
          <div
            className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Cara Kerja
          </div>
          <h2
            className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Mulai dalam 60 Detik
          </h2>
        </div>

        <div ref={stepsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] rounded-2xl overflow-hidden border border-white/[0.08]">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="bg-[#0b1f13] p-8 relative group hover:bg-[#0d2617] transition-colors"
            >
              <div
                className="text-emerald-400/20 text-7xl font-extrabold leading-none mb-5 select-none"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {step.num}
              </div>
              <h3
                className="text-white font-bold text-lg mb-3"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {step.title}
              </h3>
              <p
                className="text-white/50 text-sm leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {step.desc}
              </p>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                  <ChevronRight size={18} className="text-emerald-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="mt-14 text-center">
          <Link
            to="/panduan"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            <span>Baca Panduan Petani Lengkap &amp; Praktis</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
