import React from "react";
import { X, User, Mail, MapPin, Sprout, ShieldCheck, LogOut, CheckCircle } from "lucide-react";

export function UserProfileModal({ isOpen, onClose, user, onLogout, onOpenUpgrade }) {
  if (!isOpen || !user) return null;

  const isVerifiedFarmer = user.role === "verified_farmer" || user.is_seller;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Banner & Avatar */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 pt-8 text-white relative">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
              alt={user.full_name || "Profile"}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-lg text-white leading-tight">
                  {user.full_name || "Pengguna TaniPintar"}
                </h3>
                {isVerifiedFarmer && (
                  <CheckCircle size={16} className="text-emerald-400 fill-emerald-400 text-slate-950 shrink-0" />
                )}
              </div>
              <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
                {user.email || "user@tanipintar.id"}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
                <ShieldCheck size={12} /> {isVerifiedFarmer ? "Petani Terverifikasi" : "Akun Pembeli Dasar"}
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Informasi Profil
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60">
              <span className="text-slate-500 flex items-center gap-2 font-medium">
                <User size={14} className="text-emerald-600" /> Nama Lengkap
              </span>
              <span className="font-bold text-slate-800">{user.full_name || "-"}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60">
              <span className="text-slate-500 flex items-center gap-2 font-medium">
                <Mail size={14} className="text-emerald-600" /> Email Registrasi
              </span>
              <span className="font-bold text-slate-800">{user.email || "-"}</span>
            </div>

            {isVerifiedFarmer ? (
              <>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <MapPin size={14} className="text-emerald-600" /> Wilayah Panen
                  </span>
                  <span className="font-bold text-slate-800">{user.farm_location || "Cilacap, Jawa Tengah"}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <Sprout size={14} className="text-emerald-600" /> Komoditas Utama
                  </span>
                  <span className="font-bold text-slate-800">{user.primary_commodity || "Cabai Merah Besar"}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <ShieldCheck size={14} className="text-emerald-600" /> Luas Lahan
                  </span>
                  <span className="font-bold text-slate-800">{user.land_size || "1.5 Hektar"}</span>
                </div>
              </>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sprout size={14} className="text-emerald-700" /> Ingin Menjual Hasil Panen?
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Daftarkan lokasi panen dan komoditas utama Anda untuk membuka analitik AI TaniPintar &amp; rekomendasi harga.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenUpgrade) onOpenUpgrade();
                  }}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-lg transition-colors shadow-sm mt-1"
                >
                  Daftar Jadi Petani / Penjual (Gratis)
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onLogout) onLogout();
              }}
              className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut size={14} /> Keluar Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
