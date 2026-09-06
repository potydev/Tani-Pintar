import React from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export function LandingFooter() {
  const footerGroups = [
    {
      title: "Produk & Fitur",
      links: [
        { label: "Fitur Utama AI", to: "/fitur" },
        { label: "Arbitrase Pasar", to: "/fitur" },
        { label: "Prediksi Harga BI", to: "/fitur" },
        { label: "Marketplace Hasil Panen", to: "/marketplace" }
      ],
    },
    {
      title: "Edukasi & Petani",
      links: [
        { label: "Panduan Sukses Petani", to: "/panduan" },
        { label: "Waktu Panen Ideal", to: "/panduan" },
        { label: "Tips Kargo & Susut", to: "/panduan" },
        { label: "FAQ Agribisnis", to: "/panduan" }
      ],
    },
    {
      title: "Akses Akun",
      links: [
        { label: "Masuk Akun Petani", to: "/login" },
        { label: "Daftar Akun Baru", to: "/login" },
        { label: "Dashboard Ringkasan", to: "/dashboard" },
        { label: "Katalog Komoditas", to: "/marketplace" }
      ],
    },
  ];

  return (
    <footer className="bg-[#0b1f13] py-16 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span
                className="text-white font-bold text-base"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                TaniPintar
              </span>
            </div>
            <p
              className="text-white/45 text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Platform AI penjualan hasil panen terpercaya untuk petani Indonesia.
            </p>
          </div>

          {footerGroups.map((col) => (
            <div key={col.title}>
              <div
                className="text-white font-semibold text-sm mb-4"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {col.title}
              </div>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-white/45 hover:text-white/80 text-sm transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/30 text-xs"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            © 2026 TaniPintar. Hak Cipta Dilindungi.
          </p>
          <p
            className="text-white/20 text-xs flex items-center gap-1.5"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Sistem Aktif · 99.9% Uptime
          </p>
        </div>
      </div>
    </footer>
  );
}
