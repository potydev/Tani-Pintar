import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Leaf, User, Lock, Mail, ArrowLeft, CheckCircle2, ShieldCheck, Zap, KeyRound, HelpCircle, X } from "lucide-react";

export function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
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
      role: "buyer",
      phone: "081234567890"
    };
    localStorage.setItem("tanipintar_user", JSON.stringify(demoUser));
    if (onLoginSuccess) onLoginSuccess(demoUser);
    navigate(redirectUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userObj = {
        id: Date.now(),
        full_name: mode === "register" ? fullName || email.split("@")[0] : email.split("@")[0],
        email: email,
        phone: phone || "08123456789",
        role: "buyer"
      };
      localStorage.setItem("tanipintar_user", JSON.stringify(userObj));
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess(userObj);
      navigate(redirectUrl);
    }, 600);
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Background Glow Decor */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 p-6 max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Leaf size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-xl tracking-tight">TaniPintar</span>
            <span className="text-emerald-400 text-[10px] font-semibold tracking-widest uppercase">AI Market Intelligence</span>
          </div>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="relative z-10 max-w-md w-full mx-auto px-6 py-8 my-auto">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          
          {/* Header title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white mb-2">
              {mode === "login" ? "Masuk ke Akun Anda" : "Daftar Akun TaniPintar"}
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              {mode === "login"
                ? "Masukkan email dan kata sandi untuk mengakses marketplace & AI."
                : "Buat akun baru untuk mulai berbelanja komoditas pertanian segar."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "login" ? "bg-emerald-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Masuk Akun
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "register" ? "bg-emerald-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Login / Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Pak Joko Slamet"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-300 text-xs font-semibold">Kata Sandi</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                  >
                    Lupa Kata Sandi?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-950/50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <span>{mode === "login" ? "Masuk Sekarang" : "Buat Akun Baru"}</span>
              )}
            </button>
          </form>

          {/* Discreet Bottom Demo Access (Kept for investor/testing purposes without distracting real login) */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs mb-2">
              <HelpCircle size={13} className="text-emerald-400" />
              <span>Untuk Pengujian & Akses Demo Investor:</span>
            </div>
            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-semibold rounded-xl border border-slate-700/60 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap size={13} /> Masuk Akun Demo (Pak Joko Slamet)
            </button>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl">
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Kirim Tautan Pemulihan
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-slate-500 text-xs border-t border-slate-900">
        © 2026 TaniPintar Platform — AI Market Intelligence & Marketplace Nusantara
      </footer>
    </div>
  );
}
