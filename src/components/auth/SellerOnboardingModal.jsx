import React, { useState } from "react";
import { X, Sprout, MapPin, ShieldCheck, CheckCircle2, ArrowRight, Loader2, Upload, CreditCard, Building, FileText, AlertCircle } from "lucide-react";

export function SellerOnboardingModal({ isOpen, onClose, user, onUpgradeSuccess }) {
  const [farmLocation, setFarmLocation] = useState(user?.farm_location || "Cilacap, Jawa Tengah");
  const [primaryCommodity, setPrimaryCommodity] = useState(user?.primary_commodity || "Cabai Merah Besar");
  const [landSize, setLandSize] = useState(user?.land_size || "1.5 Hektar");
  const [landType, setLandType] = useState("Milik Sendiri");
  const [harvestCapacity, setHarvestCapacity] = useState("1 - 5 Ton");
  const [nik, setNik] = useState("");
  const [groupName, setGroupName] = useState("");
  const [bankName, setBankName] = useState("BRI (Bank Rakyat Indonesia)");
  const [accountNumber, setAccountNumber] = useState("");
  const [ktpPreview, setKtpPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const locationsList = [
    "Cilacap, Jawa Tengah",
    "Brebes, Jawa Tengah",
    "Bandung, Jawa Barat",
    "Garut, Jawa Barat",
    "Malang, Jawa Timur",
    "Nganjuk, Jawa Timur",
    "Medan, Sumatera Utara",
    "Makassar, Sulawesi Selatan",
    "Denpasar, Bali"
  ];

  const commoditiesList = [
    "Cabai Merah Besar",
    "Cabai Rawit Merah",
    "Bawang Merah",
    "Bawang Putih",
    "Beras Medium",
    "Beras Premium",
    "Jagung Hibrida",
    "Tomat",
    "Kentang Super"
  ];

  const landTypesList = [
    "Milik Sendiri",
    "Sewa Lahan",
    "Bagi Hasil / Garapan",
    "Kemitraan Poktan"
  ];

  const capacityList = [
    "< 500 kg",
    "500 kg - 1 Ton",
    "1 - 5 Ton",
    "5 - 10 Ton",
    "> 10 Ton"
  ];

  const bankList = [
    "BRI (Bank Rakyat Indonesia)",
    "Bank Mandiri",
    "BCA (Bank Central Asia)",
    "BNI (Bank Negara Indonesia)",
    "Bank Jateng",
    "DANA / OVO / GoPay"
  ];

  const handleKtpUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setKtpPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!nik || nik.length < 16) {
      setErrorMsg("NIK KTP wajib 16 digit angka.");
      return;
    }

    if (!accountNumber) {
      setErrorMsg("Nomor rekening / e-wallet pencairan wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        farm_location: farmLocation,
        primary_commodity: primaryCommodity,
        land_size: landSize,
        land_type: landType,
        harvest_capacity: harvestCapacity,
        nik,
        group_name: groupName,
        bank_name: bankName,
        account_number: accountNumber,
        ktp_image_url: ktpPreview || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
      };

      const res = await fetch("/api/auth/upgrade-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        const updatedUser = {
          ...user,
          role: "farmer_pending",
          verification_status: "pending",
          is_seller: false,
          farm_location: farmLocation,
          primary_commodity: primaryCommodity,
          land_size: landSize,
          nik
        };
        localStorage.setItem("tanipintar_user", JSON.stringify(updatedUser));
        setSubmittedSuccess(true);
        if (onUpgradeSuccess) onUpgradeSuccess(updatedUser);
      } else {
        setErrorMsg(data.error || "Gagal mengirim formulir verifikasi.");
      }
    } catch (err) {
      setLoading(false);
      const updatedUser = {
        ...user,
        role: "farmer_pending",
        verification_status: "pending",
        is_seller: false,
        farm_location: farmLocation,
        primary_commodity: primaryCommodity,
        land_size: landSize,
        nik
      };
      localStorage.setItem("tanipintar_user", JSON.stringify(updatedUser));
      setSubmittedSuccess(true);
      if (onUpgradeSuccess) onUpgradeSuccess(updatedUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto tp-scrollbar relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-950 p-6 sm:p-8 text-white relative">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck size={13} /> Form Verifikasi Petani Resmi
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            Pengajuan Akun Petani Terverifikasi
          </h3>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 leading-relaxed">
            Lengkapi formulir verifikasi lahan &amp; identitas untuk membuka akses penuh analitik pasar AI &amp; jualan di Marketplace.
          </p>
        </div>

        {/* Pending Confirmation Success Screen */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <ShieldCheck size={36} />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xl">Pengajuan Verifikasi Terkirim! ⏳</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Data Anda telah diterima. Tim Admin TaniPintar akan meninjau NIK, Dokumen KTP, dan Wilayah Panen Anda dalam waktu <strong className="text-slate-800">1x24 jam</strong>.
              </p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl max-w-md mx-auto text-left text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertCircle size={15} className="text-amber-600" /> Status Akun Saat Ini: "Dalam Peninjauan Admin"
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                Anda sudah dapat mencoba tampilan dashboard analitik. Akses penjualan penuh akan terbuka otomatis setelah dikonfirmasi oleh Admin.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          /* Detailed Multi-Section Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Data Lahan & Komoditas (Dropdown Selects) */}
            <div className="space-y-4">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Sprout size={14} className="text-emerald-600" /> 1. Data Lahan &amp; Hasil Panen
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilayah / Lokasi Panen Utama <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    {locationsList.map((loc, i) => (
                      <option key={i} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Komoditas Utama Ditanam <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={primaryCommodity}
                    onChange={(e) => setPrimaryCommodity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    {commoditiesList.map((comm, i) => (
                      <option key={i} value={comm}>{comm}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Pengelolaan Lahan</label>
                  <select
                    value={landType}
                    onChange={(e) => setLandType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    {landTypesList.map((lt, i) => (
                      <option key={i} value={lt}>{lt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Luas Lahan</label>
                  <input
                    type="text"
                    placeholder="Contoh: 1.5 Hektar"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kapasitas Panen / Siklus</label>
                  <select
                    value={harvestCapacity}
                    onChange={(e) => setHarvestCapacity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    {capacityList.map((cap, i) => (
                      <option key={i} value={cap}>{cap}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Data Identitas & Verifikasi KTP */}
            <div className="space-y-4 pt-2">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-emerald-600" /> 2. Verifikasi Identitas &amp; Dokumen
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIK KTP Pengelola (16 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="3301xxxxxxxxxxxx"
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Kelompok Tani / Gapoktan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Poktan Tani Makmur"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Upload Foto KTP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Unggah Foto KTP / Kartu Anggota Poktan (Opsional untuk Verifikasi Cepat)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 bg-slate-50 transition-colors text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleKtpUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {ktpPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={ktpPreview} alt="Preview KTP" className="w-20 h-12 object-cover rounded-lg border border-slate-300 shadow-sm" />
                      <div className="text-left text-xs">
                        <span className="font-bold text-emerald-700 block">✓ Dokumen Terpilih</span>
                        <span className="text-[10px] text-slate-400">Klik untuk mengganti foto</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-500 text-xs">
                      <Upload size={20} className="text-emerald-600" />
                      <span className="font-bold text-slate-700">Klik untuk upload foto KTP / dokumen</span>
                      <span className="text-[10px] text-slate-400">Format JPG, PNG (Maks 5MB)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Data Rekening Pencairan */}
            <div className="space-y-4 pt-2">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-600" /> 3. Rekening / E-Wallet Pencairan Panen
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilihan Bank / E-Wallet</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    {bankList.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Rekening / Akun <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0123-01-045678-50-2"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Mengirim Pengajuan Verifikasi...
                </>
              ) : (
                <>
                  <span>Kirim Pengajuan Verifikasi Ke Admin</span> <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
