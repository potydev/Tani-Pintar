import React, { useState } from "react";
import { Leaf, X } from "lucide-react";

export function LoginModal({ onClose, onLogin }) {
  const [userName, setUserName] = useState("Koko Petani");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="tp-card w-full max-w-md p-8 relative bg-white shadow-2xl rounded-2xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
          <Leaf size={24} />
        </div>

        <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Masuk ke Dashboard</h3>
        <p className="text-slate-500 text-sm mb-6">
          Selamat datang kembali! Demo langsung masuk ke akun petani.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nama Petani / Akun
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none text-slate-900 text-sm font-medium"
              placeholder="Masukkan nama..."
            />
          </div>
        </div>

        <button
          onClick={() => onLogin(userName || "Koko Petani")}
          className="tp-btn-primary w-full py-3.5 rounded-xl font-bold text-sm shadow-md"
        >
          Masuk Sekarang &rarr;
        </button>
      </div>
    </div>
  );
}
