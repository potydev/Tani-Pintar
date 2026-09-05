import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Leaf, Zap, KeyRound, X } from "lucide-react";
import { apiPost } from "../utils/apiClient.js";

export function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [farmLocation, setFarmLocation] = useState("Cilacap, Jateng");
  const [primaryCommodity, setPrimaryCommodity] = useState("Cabai Merah Besar");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleDemoLogin = () => {
    const demoUser = {
      id: 1,
      full_name: "Pak Joko Slamet",
      email: "joko.slamet@tanipintar.id",
      role: "farmer",
      phone: "081234567890",
      farm_location: "Cilacap, Jawa Tengah",
      primary_commodity: "Cabai Merah Besar",
      land_size: "1.5 Hektar"
    };
    localStorage.setItem("tanipintar_user", JSON.stringify(demoUser));
    if (onLoginSuccess) onLoginSuccess(demoUser);
    navigate(redirectUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    if (mode === "register" && !fullName) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload = mode === "register"
        ? { email, password, full_name: fullName, farm_location: farmLocation, primary_commodity: primaryCommodity, land_size: "1.5 Hektar" }
        : { email, password };

      const res = await apiPost(endpoint, payload);
      setLoading(false);

      if (res.ok && res.data && res.data.success && res.data.user) {
        localStorage.setItem("tanipintar_user", JSON.stringify(res.data.user));
        if (res.data.token) {
          localStorage.setItem("tanipintar_token", res.data.token);
        }
        if (onLoginSuccess) onLoginSuccess(res.data.user);
        if (res.data.user.role === "admin" || res.data.user.role === "super_admin") {
          navigate("/admin");
        } else {
          navigate(redirectUrl);
        }
      } else {
        const errorMsg = res.data?.error || "Email atau kata sandi tidak cocok. Silakan periksa kembali.";
        setError(errorMsg);
      }
    } catch (err) {
      setLoading(false);
      setError("Terjadi kendala saat menghubungi server. Silakan coba beberapa saat lagi.");
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#121212]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      
      {/* Left Column — Dark Green Branding & Impact Panel */}
      <div className="bg-[#081f13] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Brand Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Leaf size={18} className="text-slate-950" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">TaniPintar</span>
          </Link>
        </div>

        {/* Middle Main Headline & Stats */}
        <div className="relative z-10 my-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-4 border border-emerald-500/30">
            <span>✨ AI Intelligence &amp; Marketplace Tani</span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight mb-4">
            Ekosistem Cerdas Jual-Beli Hasil Panen
          </h1>
          <p className="text-emerald-100/70 text-sm sm:text-base leading-relaxed mb-12">
            Pantau pergerakan harga komoditas di seluruh Indonesia, prediksi tren panen dengan AI, dan beli komoditas langsung dari petani binaan.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-white font-extrabold text-3xl sm:text-4xl tracking-tight">12.450+</div>
              <div className="text-emerald-200/60 text-xs sm:text-sm mt-1 font-medium">Petani &amp; Pembeli Terhubung</div>
            </div>
            <div>
              <div className="text-white font-extrabold text-3xl sm:text-4xl tracking-tight">38</div>
              <div className="text-emerald-200/60 text-xs sm:text-sm mt-1 font-medium">Provinsi Terpantau BI PIHPS</div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-6 border-t border-emerald-800/40">
          <p className="text-emerald-100/90 text-sm leading-relaxed mb-2 font-medium">
            &ldquo;Satu akun untuk semua: pantau harga AI, jual panen ke luar kota, atau belanja hasil tani berkualitas.&rdquo;
          </p>
          <div className="text-emerald-400 text-xs font-semibold">
            TaniPintar Integrated Hub
          </div>
        </div>
      </div>

      {/* Right Column — Form Panel */}
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-md mx-auto w-full">
        
        {/* Header Title */}
        <div className="mb-8">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {mode === "login" ? "Selamat datang kembali" : "Daftar Akun Baru"}
          </h2>
          <p className="text-slate-400 text-sm">
            {mode === "login"
              ? "Masuk untuk akses Dashboard Analisis AI & Marketplace."
              : "Daftar cepat dalam 1 langkah untuk mulai bertransaksi atau menganalisis pasar."}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-2">Nama Lengkap</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full bg-[#1c1c1c] border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-[#1c1c1c] border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-2">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full bg-[#1c1c1c] border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {mode === "login" && (
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline font-medium transition-colors"
                >
                  Lupa kata sandi?
                </button>
              </div>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-slate-950 font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md mt-2"
          >
            {loading ? "Memproses..." : mode === "login" ? "Masuk sekarang" : "Daftar Akun Sekarang"}
          </button>
        </form>

        {/* Divider */}
        <div className="text-center text-xs text-slate-500 font-semibold my-5">
          atau
        </div>

        {/* Secondary Demo Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-transparent border border-slate-700 hover:border-slate-500 text-white font-semibold text-xs sm:text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Zap size={14} className="text-amber-400" /> Coba akun demo
        </button>

        {/* Switch Mode Footer Link */}
        <div className="text-center text-xs text-slate-400 mt-8">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className="text-emerald-500 hover:underline font-bold"
              >
                Daftar baru
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className="text-emerald-500 hover:underline font-bold"
              >
                Masuk sekarang
              </button>
            </>
          )}
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1c] border border-slate-800 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <KeyRound size={20} />
            </div>

            <h3 className="text-white font-extrabold text-lg mb-1">Pulihkan Kata Sandi</h3>
            <p className="text-slate-400 text-xs mb-4">
              Masukkan email Anda. Kami akan mengirimkan tautan pemulihan kata sandi instan.
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold text-center">
                ✓ Tautan reset kata sandi telah dikirimkan ke {forgotEmail}!
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-[#121212] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-slate-950 font-bold text-xs rounded-xl transition-all"
                >
                  Kirim Tautan Pemulihan
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
