import React, { useState } from "react";
import { X, Leaf, Lock, Mail, User, MapPin, Sprout, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { apiPost } from "../../utils/apiClient.js";

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [farmLocation, setFarmLocation] = useState("Cilacap, Jawa Tengah");
  const [primaryCommodity, setPrimaryCommodity] = useState("Cabai Merah Besar");
  const [landSize, setLandSize] = useState("1.5 Hektar");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { email, password, full_name: fullName, farm_location: farmLocation, primary_commodity: primaryCommodity, land_size: landSize }
      : { email, password };

    try {
      const res = await apiPost(endpoint, payload);

      if (res.ok && res.data && res.data.success && res.data.user) {
        localStorage.setItem("tanipintar_user", JSON.stringify(res.data.user));
        if (onAuthSuccess) onAuthSuccess(res.data.user);
        onClose();
      } else {
        setErrorMsg(res.data?.error || "Email atau kata sandi tidak cocok. Silakan periksa kembali.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kendala saat menghubungi server. Silakan coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: "DEMO-001",
      email: "joko.slamet@tanipintar.id",
      full_name: "Pak Joko Slamet",
      farm_location: "Cilacap, Jawa Tengah",
      primary_commodity: "Cabai Merah Besar",
      land_size: "1.5 Hektar",
      avatar_url: "/assets/farmer_avatar.png"
    };
    localStorage.setItem("tanipintar_user", JSON.stringify(demoUser));
    if (onAuthSuccess) onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Leaf size={22} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">Akun TaniPintar</h3>
              <p className="text-xs text-slate-300">
                {isRegister ? "Daftar akun petani baru" : "Masuk ke Dashboard Analisis AI"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              !isRegister ? "border-emerald-600 text-emerald-800 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              isRegister ? "border-emerald-600 text-emerald-800 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Daftar Petani Baru
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Joko Slamet"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email / Username</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="petani@tanipintar.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>{isRegister ? "Daftar Akun Sekarang" : "Masuk ke Dashboard"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {!isRegister && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Masuk Cepat Demo (Pak Joko Slamet)</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
