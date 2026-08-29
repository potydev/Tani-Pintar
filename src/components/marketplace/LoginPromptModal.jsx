import React from "react";
import { Lock, LogIn, ShieldCheck } from "lucide-react";

export function LoginPromptModal({ onClose, onLoginClick }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden text-center">
        <div className="p-8 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-emerald-700" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Masuk untuk Membeli
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Anda harus masuk atau daftar terlebih dahulu untuk melakukan pembelian di marketplace TaniPintar.
          </p>
        </div>
        <div className="px-8 pb-6 space-y-3">
          <button
            onClick={() => { onClose(); onLoginClick(); }}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            <LogIn size={16} /> Masuk / Daftar Sekarang
          </button>
          <button onClick={onClose} className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            Lanjut Lihat-lihat Dulu
          </button>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck size={11} className="text-slate-300" />
            <span className="text-[10px] text-slate-400">Transaksi aman & terenkripsi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
