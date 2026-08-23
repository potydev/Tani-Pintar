import React, { useState } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Sparkles, UserCheck, Lock } from "lucide-react";

export function LandingHero({ onLoginClick }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    commodity: "Cabai Merah Besar",
    location: "Cilacap, Jawa Tengah"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginClick();
  };

  return (
    <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white py-16 lg:py-24 px-6">
      {/* Background Subtle Overlay Image & Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="/assets/homepage.jpg"
          alt=""
          className="w-full h-full object-cover opacity-10 mix-blend-overlay filter blur-[1px]"
          onError={(e) => { e.target.src = "/homepage.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/70 to-slate-900/90" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold tracking-wide">
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span>PROGRAM MITRA PETANI & SUPPLIER PANGAN INDONESIA</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Jadilah Mitra Supplier <span className="text-emerald-400 underline decoration-emerald-500/50 underline-offset-8">TaniPintar</span> — Maksimalkan Profit Hasil Panen
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Bergabunglah dalam ekosistem kecerdasan pasar pangan modern. Dapatkan rekomendasi kota penjualan paling menguntungkan, transparansi harga real-time 34 provinsi, dan kepastian pembeli pasar induk.
          </p>

          {/* Key Advantages Checklist - Inspired by Warung Pangan */}
          <div className="grid sm:grid-cols-2 gap-4 py-2">
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white">Transparansi Harga Real-Time</div>
                <div className="text-xs text-slate-400">Terintegrasi langsung data BI PIHPS</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white">Rekomendasi Profit Bersih AI</div>
                <div className="text-xs text-slate-400">Kalkulasi ongkir & margin logistik</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white">Jaringan Pasar Induk Luas</div>
                <div className="text-xs text-slate-400">Akses langsung ke pembeli pedagang besar</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white">Aman & Terverifikasi</div>
                <div className="text-xs text-slate-400">Integrasi database Supabase Cloud</div>
              </div>
            </div>
          </div>

          {/* Social Proof & Metrics */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <div>
              <div className="font-heading text-2xl font-extrabold text-white">12.450+</div>
              <div className="text-slate-400 text-xs">Petani & Supplier</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="font-heading text-2xl font-extrabold text-emerald-400">34</div>
              <div className="text-slate-400 text-xs">Provinsi Dipantau</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="font-heading text-2xl font-extrabold text-amber-400">+9.2%</div>
              <div className="text-slate-400 text-xs">Rata-rata Margin Tambahan</div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form Card - Warung Pangan Supplier Style */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
              <UserCheck size={12} />
              <span>Pendaftaran Gratis</span>
            </div>

            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="font-heading text-2xl font-extrabold text-slate-900">
                Form Pendaftaran Supplier
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Isi form singkat di bawah ini untuk langsung mengakses Dashboard TaniPintar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap / Kelompok Tani *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Koko Petani Cabai"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Komoditas Utama *
                </label>
                <select
                  value={formData.commodity}
                  onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-800 bg-white"
                >
                  <option value="Cabai Merah Besar">Cabai Merah Besar</option>
                  <option value="Cabai Merah Keriting">Cabai Merah Keriting</option>
                  <option value="Cabai Rawit Merah">Cabai Rawit Merah</option>
                  <option value="Bawang Merah">Bawang Merah</option>
                  <option value="Bawang Putih">Bawang Putih</option>
                  <option value="Beras Medium">Beras Medium</option>
                  <option value="Beras Super">Beras Super</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Wilayah Panen Anda *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-800 bg-white"
                >
                  <option value="Cilacap, Jawa Tengah">Cilacap, Jawa Tengah</option>
                  <option value="Brebes, Jawa Tengah">Brebes, Jawa Tengah</option>
                  <option value="Garut, Jawa Barat">Garut, Jawa Barat</option>
                  <option value="Bandung, Jawa Barat">Bandung, Jawa Barat</option>
                  <option value="Malang, Jawa Timur">Malang, Jawa Timur</option>
                  <option value="Nganjuk, Jawa Timur">Nganjuk, Jawa Timur</option>
                </select>
              </div>

              {/* Dynamic Estimated Opportunity Preview Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">Potensi Keuntungan AI</div>
                  <div className="text-xs font-extrabold text-emerald-900">+9.2% Profit Tambahan</div>
                </div>
                <span className="text-[10px] font-extrabold text-white bg-emerald-600 px-2 py-1 rounded-md">
                  Live BI PIHPS
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-extrabold text-sm shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Daftar &amp; Masuk Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Sudah punya akun?{" "}
                <button
                  onClick={onLoginClick}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Login Sekarang
                </button>
              </p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mt-2">
                <Lock size={12} />
                <span>Data Anda terlindungi &amp; bersifat rahasia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
