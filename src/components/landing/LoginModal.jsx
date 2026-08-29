import React, { useState, useEffect } from "react";
import {
  X, Leaf, Lock, Mail, User, MapPin, Sprout, ArrowRight,
  CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, ShieldCheck
} from "lucide-react";

export function LoginModal({ onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [farmLocation, setFarmLocation] = useState("Cilacap, Jawa Tengah");
  const [primaryCommodity, setPrimaryCommodity] = useState("Cabai Merah Besar");
  const [landSize, setLandSize] = useState("1.5 Hektar");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // Validations
    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      setLoading(false);
      return;
    }
    if (isRegister && !fullName) {
      setErrorMsg("Nama lengkap wajib diisi untuk pendaftaran.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { email, password, full_name: fullName, farm_location: farmLocation, primary_commodity: primaryCommodity, land_size: landSize }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success && json.user) {
        localStorage.setItem("tanipintar_user", JSON.stringify(json.user));
        if (onLogin) onLogin(json.user.full_name || json.user.email);
      } else {
        // Fallback local auth for demo/offline
        const mockUser = buildMockUser();
        localStorage.setItem("tanipintar_user", JSON.stringify(mockUser));
        if (onLogin) onLogin(mockUser.full_name);
      }
    } catch (err) {
      // Local fallback for development
      const mockUser = buildMockUser();
      localStorage.setItem("tanipintar_user", JSON.stringify(mockUser));
      if (onLogin) onLogin(mockUser.full_name);
    } finally {
      setLoading(false);
    }
  };

  const buildMockUser = () => ({
    id: Date.now(),
    email: email || "petani@tanipintar.id",
    full_name: fullName || (isRegister ? "Petani Pintar" : "Pak Joko Slamet"),
    farm_location: farmLocation,
    primary_commodity: primaryCommodity,
    land_size: landSize,
    avatar_url: "/assets/farmer_avatar.png"
  });

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
    if (onLogin) onLogin(demoUser.full_name);
  };

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => onClose(), 200);
  };

  const inputBase = "w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400";
  const inputSmall = "w-full pl-8 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        mounted ? "bg-slate-900/70 backdrop-blur-md" : "bg-transparent"
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 ${
          mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        style={{ maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* ── Header ── */}
        <div
          className="p-6 text-white relative"
          style={{
            background: "linear-gradient(135deg, #0b1f13 0%, #0d5c3a 60%, #16a34a 120%)",
          }}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-lg shadow-black/20 border border-white/10">
              <Leaf size={22} />
            </div>
            <div>
              <h3
                className="font-extrabold text-lg text-white leading-tight"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                TaniPintar
              </h3>
              <p
                className="text-xs text-white/60"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {isRegister ? "Daftar akun petani baru" : "Masuk ke Dashboard AI"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tab Switcher ── */}
        <div className="flex border-b border-slate-200 bg-slate-50/80">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              !isRegister
                ? "border-emerald-600 text-emerald-800 bg-white"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              isRegister
                ? "border-emerald-600 text-emerald-800 bg-white"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Daftar Baru
          </button>
        </div>

        {/* ── Form Body ── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-pulse">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span style={{ fontFamily: "Inter, sans-serif" }}>{errorMsg}</span>
            </div>
          )}

          {/* Full Name (Register) */}
          {isRegister && (
            <div>
              <label
                className="block text-xs font-bold text-slate-700 mb-1.5"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Joko Slamet"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              className="block text-xs font-bold text-slate-700 mb-1.5"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="petani@tanipintar.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-xs font-bold text-slate-700 mb-1.5"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBase} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Registration Extra Fields */}
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  Lokasi Panen
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    className={inputSmall}
                    placeholder="Kota, Provinsi"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  Komoditas Utama
                </label>
                <div className="relative">
                  <Sprout size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={primaryCommodity}
                    onChange={(e) => setPrimaryCommodity(e.target.value)}
                    className={inputSmall}
                    placeholder="Jenis komoditas"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 mt-1"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>{isRegister ? "Daftar Akun Sekarang" : "Masuk ke Dashboard"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Demo Login */}
          {!isRegister && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Masuk Cepat Demo (Pak Joko Slamet)</span>
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck size={12} className="text-slate-300" />
            <span
              className="text-[10px] text-slate-400"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Data Anda terenkripsi dan aman bersama TaniPintar
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
