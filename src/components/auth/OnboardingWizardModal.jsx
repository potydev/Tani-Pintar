import React, { useState } from "react";
import {
  Sprout,
  ShoppingCart,
  Layers,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Search,
  Leaf
} from "lucide-react";

export const INDONESIAN_CITIES = [
  { id: "Surabaya, Jatim", label: "Surabaya, Jawa Timur", province: "Jawa Timur", badge: "Hub Jatim" },
  { id: "Cilacap, Jateng", label: "Cilacap, Jawa Tengah", province: "Jawa Tengah", badge: "Sentra Cabai" },
  { id: "Brebes, Jateng", label: "Brebes, Jawa Tengah", province: "Jawa Tengah", badge: "Sentra Bawang" },
  { id: "Bandung, Jabar", label: "Bandung, Jawa Barat", province: "Jawa Barat", badge: "Sentra Sayur" },
  { id: "Garut, Jabar", label: "Garut, Jawa Barat", province: "Jawa Barat", badge: "Sentra Cabai & Padi" },
  { id: "Malang, Jatim", label: "Malang, Jawa Timur", province: "Jawa Timur", badge: "Sentra Buah & Sayur" },
  { id: "Jakarta, DKI", label: "DKI Jakarta (Pasar Induk)", province: "DKI Jakarta", badge: "Pasar Konsumen" },
  { id: "Medan, Sumut", label: "Medan, Sumatera Utara", province: "Sumatera Utara", badge: "Hub Sumut" },
  { id: "Makassar, Sulsel", label: "Makassar, Sulawesi Selatan", province: "Sulawesi Selatan", badge: "Hub Timur" },
  { id: "Denpasar, Bali", label: "Denpasar, Bali", province: "Bali", badge: "Sentra Pariwisata" },
  { id: "Bandar Lampung, Lampung", label: "Bandar Lampung, Lampung", province: "Lampung", badge: "Hub Sumatera" },
];

export const COMMODITIES_LIST = [
  { id: "Cabai Merah Besar", label: "Cabai Merah Besar", icon: "🌶️", color: "from-red-500/20 to-orange-500/20" },
  { id: "Cabai Rawit Merah", label: "Cabai Rawit Merah", icon: "🔥", color: "from-rose-500/20 to-red-500/20" },
  { id: "Bawang Merah", label: "Bawang Merah", icon: "🧅", color: "from-purple-500/20 to-pink-500/20" },
  { id: "Beras Kualitas Medium", label: "Beras Medium & Padi", icon: "🌾", color: "from-amber-500/20 to-yellow-500/20" },
  { id: "Sayuran Segar", label: "Sayuran Daun & Hijau", icon: "🥬", color: "from-emerald-500/20 to-teal-500/20" },
  { id: "Tomat Buah", label: "Tomat & Palawija", icon: "🍅", color: "from-red-500/20 to-amber-500/20" },
  { id: "Buah-buahan Lokal", label: "Buah-buahan Panen", icon: "🍎", color: "from-orange-500/20 to-amber-500/20" },
  { id: "Rempah & Jahe", label: "Rempah & Herbal", icon: "🫚", color: "from-amber-600/20 to-yellow-600/20" },
];

export function OnboardingWizardModal({ isOpen, user, onComplete, redirectUrl }) {
  const [step, setStep] = useState(1);
  const [roleIntent, setRoleIntent] = useState("farmer"); // 'farmer' | 'buyer' | 'both'
  const [selectedLocation, setSelectedLocation] = useState(user?.farm_location || "Surabaya, Jatim");
  const [selectedCommodity, setSelectedCommodity] = useState(user?.primary_commodity || "Cabai Merah Besar");
  const [citySearch, setCitySearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredCities = INDONESIAN_CITIES.filter(c =>
    c.label.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.province.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const payload = {
        id: user?.id,
        email: user?.email,
        role: roleIntent === "buyer" ? "buyer" : "farmer",
        farm_location: selectedLocation,
        primary_commodity: selectedCommodity,
        land_size: roleIntent === "buyer" ? "Konsumen / Mitra Pembeli" : "1.5 Hektar"
      };

      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      const updatedUser = data.user || {
        ...user,
        ...payload,
        needsOnboarding: false,
        onboarded: true
      };

      localStorage.setItem("tanipintar_user", JSON.stringify(updatedUser));
      if (onComplete) onComplete(updatedUser, redirectUrl);
    } catch (e) {
      console.error("Onboarding failed:", e);
      if (onComplete) onComplete(user, redirectUrl);
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = [
    {
      id: "farmer",
      title: "Jual Panen & Pantau AI",
      badge: "Petani / Produsen",
      desc: "Saya ingin memantau harga komoditas real-time, rekomendasi jual terbaik, dan memasang panen di marketplace.",
      icon: Sprout,
      color: "border-emerald-500 bg-emerald-50/40"
    },
    {
      id: "buyer",
      title: "Belanja Komoditas Segar",
      badge: "Pembeli / Restoran / Pedagang",
      desc: "Saya ingin membeli komoditas hasil tani berkualitas langsung dari petani terverifikasi dengan harga wajar.",
      icon: ShoppingCart,
      color: "border-teal-500 bg-teal-50/40"
    },
    {
      id: "both",
      title: "Analisis Pasar & Transaksi",
      badge: "Mitra Lengkap (Produsen & Pembeli)",
      desc: "Saya ingin akses penuh ke dashboard analisis AI sekaligus bertransaksi jual-beli di marketplace.",
      icon: Layers,
      color: "border-emerald-600 bg-emerald-50/50"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Top Progress & Banner */}
        <div className="bg-[#081f13] p-6 text-white relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md">
                <Leaf size={16} />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white">TaniPintar Onboarding</span>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step
                      ? "w-8 bg-emerald-400"
                      : s < step
                      ? "w-4 bg-emerald-700"
                      : "w-2 bg-slate-700"
                  }`}
                />
              ))}
              <span className="text-[11px] font-bold text-emerald-300 ml-1">
                Langkah {step} dari 3
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {step === 1 && "Apa tujuan utama Anda di TaniPintar?"}
            {step === 2 && "Pilih Lokasi Wilayah Operasional / Kebun Anda"}
            {step === 3 && "Apa komoditas panen yang menjadi fokus Anda?"}
          </h2>
          <p className="text-xs text-emerald-100/70 mt-1">
            {step === 1 && "Kami akan menyesuaikan tampilan antarmuka dan rekomendasi sesuai kebutuhan Anda."}
            {step === 2 && "Analisis harga real-time BI PIHPS dan peluang pasar akan otomatis dihitung dari wilayah ini."}
            {step === 3 && "Kami prioritaskan signal harga dan notifikasi panen untuk komoditas ini."}
          </p>
        </div>

        {/* Modal Body: Dynamic Step Content */}
        <div className="p-6 overflow-y-auto flex-1 tp-scrollbar space-y-4">
          
          {/* STEP 1: Role / Intent Selection (Fiverr Style 3-cards) */}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-3.5 pt-2">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = roleIntent === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setRoleIntent(opt.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-extrabold text-sm text-slate-900">{opt.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"
                    }`}>
                      {isSelected && <CheckCircle2 size={16} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 2: Location Selection */}
          {step === 2 && (
            <div className="space-y-4 pt-1">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Ketik nama kota / provinsi (mis: Surabaya, Cilacap, Brebes)..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {filteredCities.map((city) => {
                  const isSelected = selectedLocation === city.id || selectedLocation === city.label;
                  return (
                    <div
                      key={city.id}
                      onClick={() => setSelectedLocation(city.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/70 font-bold text-emerald-900 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin size={16} className={isSelected ? "text-emerald-700" : "text-slate-400"} />
                        <div>
                          <div className="text-xs font-bold">{city.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{city.badge}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="text-emerald-600" />}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-800">
                <Sparkles size={14} className="text-emerald-600 shrink-0" />
                <span>
                  Lokasi aktif saat ini: <strong>{selectedLocation}</strong>. AI akan otomatis mengarahkan arbitrase harga dari titik ini.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Primary Commodity Selection */}
          {step === 3 && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COMMODITIES_LIST.map((comm) => {
                  const isSelected = selectedCommodity === comm.id;
                  return (
                    <div
                      key={comm.id}
                      onClick={() => setSelectedCommodity(comm.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-3xl">{comm.icon}</span>
                      <span className={`text-xs leading-tight font-bold ${
                        isSelected ? "text-emerald-900" : "text-slate-700"
                      }`}>
                        {comm.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>Ringkasan Profil Pengguna:</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px]">
                    {roleIntent === "buyer" ? "Akun Pembeli" : "Akun Petani / Seller"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Wilayah: <strong>{selectedLocation}</strong> · Fokus: <strong>{selectedCommodity}</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Kembali
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Lewati (Gunakan Default)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Lanjut</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinish}
                className="px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <span>Selesai &amp; Buka Dashboard</span>
                    <Sparkles size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
