import React from "react";
import { Leaf, ArrowRight, UserCheck } from "lucide-react";

export function LandingHeader({ onLoginClick }) {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center shadow-md">
            <Leaf size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl text-slate-900 tracking-tight leading-none">
                TaniPintar
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                Mitra Supplier
              </span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 tracking-widest uppercase mt-0.5">
              AI Market Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#beranda" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors">Beranda Mitra</a>
          <a href="#keuntungan" className="hover:text-emerald-700 transition-colors">Keuntungan 5T</a>
          <a href="#fitur" className="hover:text-emerald-700 transition-colors">Fitur Platform</a>
          <a href="#cara-kerja" className="hover:text-emerald-700 transition-colors">Cara Bergabung</a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLoginClick}
            className="hidden sm:inline-flex px-4 py-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Masuk Akun
          </button>
          <button
            onClick={onLoginClick}
            className="tp-btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <UserCheck size={16} />
            <span>Daftar Mitra Now</span>
          </button>
        </div>
      </div>
    </header>
  );
}
