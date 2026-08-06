import React from "react";
import { Leaf, ArrowRight } from "lucide-react";

export function LandingHeader({ onLoginClick }) {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-md">
            <Leaf size={22} className="text-white" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-xl text-slate-900 tracking-tight leading-none">
              TaniPintar
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 tracking-widest uppercase mt-0.5">
              AI Market Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#beranda" className="text-slate-900 font-semibold hover:text-emerald-700 transition-colors">Beranda</a>
          <a href="#fitur" className="hover:text-emerald-700 transition-colors">Fitur Utama</a>
          <a href="#analitik" className="hover:text-emerald-700 transition-colors">Analitik AI</a>
          <a href="#panduan" className="hover:text-emerald-700 transition-colors">Panduan Petani</a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onLoginClick}
            className="tp-btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
