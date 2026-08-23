import React from "react";
import { Leaf, PhoneCall, ShieldCheck, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
        {/* Company Bio */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <Leaf size={22} />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl text-white tracking-tight">
                TaniPintar
              </div>
              <div className="text-[10px] font-semibold text-emerald-400 tracking-widest uppercase">
                Mitra Supplier &amp; AI Intelligence
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            TaniPintar hadir untuk memudahkan penjualan komoditas pangan di Indonesia. Mengintegrasikan kecerdasan buatan dengan data BI PIHPS real-time untuk menghadirkan komoditas pangan yang murah, adil, dan transparan bagi petani &amp; pasar.
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck size={16} />
              <span>Data Terverifikasi Supabase</span>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
            Pintasan Mitra
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#beranda" className="hover:text-emerald-400 transition-colors">Beranda Supplier</a></li>
            <li><a href="#keuntungan" className="hover:text-emerald-400 transition-colors">Keuntungan 5T Mitra</a></li>
            <li><a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur Platform AI</a></li>
            <li><a href="#cara-kerja" className="hover:text-emerald-400 transition-colors">Syarat &amp; Ketentuan</a></li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
            Layanan Bantuan Mitra
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Untuk pertanyaan, bantuan pendaftaran supplier, dan kerjasama pasar induk:
          </p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <PhoneCall size={16} className="text-emerald-400 shrink-0" />
              <span>Halo TaniPintar: 1500-692 (Bebas Pulsa)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-emerald-400 shrink-0" />
              <span>mitra@tanipintar.potydev.cloud</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © 2026 TaniPintar AI Market Intelligence. All rights reserved. Powered by Supabase &amp; BI PIHPS Data.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Syarat &amp; Ketentuan Supplier</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Bantuan</a>
        </div>
      </div>
    </footer>
  );
}
