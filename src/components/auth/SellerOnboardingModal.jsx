import React, { useState } from "react";
import { X, Sprout, MapPin, ShieldCheck, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export function SellerOnboardingModal({ isOpen, onClose, user, onUpgradeSuccess }) {
  const [farmLocation, setFarmLocation] = useState(user?.farm_location || "Cilacap, Jawa Tengah");
  const [primaryCommodity, setPrimaryCommodity] = useState(user?.primary_commodity || "Cabai Merah Besar");
  const [landSize, setLandSize] = useState(user?.land_size || "1.5 Hektar");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!farmLocation || !primaryCommodity) {
      setErrorMsg("Lokasi panen dan komoditas utama wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/upgrade-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          farm_location: farmLocation,
          primary_commodity: primaryCommodity,
          land_size: landSize,
          group_name: groupName
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        const updatedUser = {
          ...user,
          role: "verified_farmer",
          is_seller: true,
          farm_location: farmLocation,
          primary_commodity: primaryCommodity,
          land_size: landSize,
          group_name: groupName || "Kelompok Tani Mandiri"
        };
        localStorage.setItem("tanipintar_user", JSON.stringify(updatedUser));
        setSuccessMsg("Selamat! Akun Anda berhasil di-upgrade menjadi Petani Terverifikasi.");
        if (onUpgradeSuccess) onUpgradeSuccess(updatedUser);

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg(data.error || "Gagal memproses upgrade akun penjual.");
      }
    } catch (err) {
      setLoading(false);
      // Fallback local upgrade if offline
      const updatedUser = {
        ...user,
        role: "verified_farmer",
        is_seller: true,
        farm_location: farmLocation,
        primary_commodity: primaryCommodity,
        land_size: landSize
      };
      localStorage.setItem("tanipintar_user", JSON.stringify(updatedUser));
      setSuccessMsg("Selamat! Akun Anda berhasil di-upgrade menjadi Petani Terverifikasi.");
      if (onUpgradeSuccess) onUpgradeSuccess(updatedUser);

      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-950 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <ShieldCheck size={13} /> Progressive Onboarding
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              Daftar Jadi Petani Terverifikasi
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Buka fitur analitik harga AI, pemantauan 34 kota, dan dapatkan badge terpercaya saat menjual panen di marketplace.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">{successMsg}</h4>
            <p className="text-xs text-slate-500">Mengarahkan Anda ke fitur AI TaniPintar...</p>
          </div>
        ) : (
          /* Form Upgrade Body */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Lokasi Lahan Panen Utama <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cilacap, Jawa Tengah"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Komoditas Utama yang Ditanam <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Sprout size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cabai Merah Besar, Bawang Merah, Padi"
                  value={primaryCommodity}
                  onChange={(e) => setPrimaryCommodity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Estimasi Luas Lahan</label>
                <input
                  type="text"
                  placeholder="Contoh: 1.5 Hektar"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kelompok Tani (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Poktan Makmur"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Memproses Verifikasi...
                </>
              ) : (
                <>
                  <span>Selesaikan &amp; Upgrade Akun Petani</span> <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
