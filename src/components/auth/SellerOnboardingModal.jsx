import React, { useState } from "react";
import { X, ArrowRight, ArrowLeft, ArrowDown, Check, ShieldCheck, Leaf, Upload, AlertCircle, Loader2, MapPin } from "lucide-react";

export function SellerOnboardingModal({ isOpen, onClose, user, onUpgradeSuccess }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Lokasi, 2: Komoditas, 3: Verifikasi

  // Comprehensive 3-tier Indonesian Regional Data (Provinsi -> Kabupaten/Kota -> Kecamatan)
  const regionalHierarchy = {
    "Jawa Tengah": {
      "Cilacap": ["Sidareja", "Cipari", "Gandrungmangu", "Kedungreja", "Majenang", "Patimuan", "Karangpucung", "Kroya", "Adipala", "Jeruklegi"],
      "Brebes": ["Brebes", "Bulakamba", "Larangan", "Ketanggungan", "Tanjung", "Jatibarang", "Wanasari", "Songgom", "Sirampog", "Paguyangan"],
      "Semarang": ["Ungaran Barat", "Ungaran Timur", "Bandungan", "Ambarawa", "Bawen", "Getasan", "Tuntang", "Bergas"],
      "Banyumas": ["Purwokerto Timur", "Purwokerto Selatan", "Sumbang", "Baturraden", "Ajibarang", "Wangon", "Sokaraja", "Kembaran"],
      "Grobogan": ["Purwodadi", "Toroh", "Geyer", "Pulokulon", "Kradenan", "Grobogan", "Wirosari", "Tawangharjo"],
      "Boyolali": ["Boyolali", "Ampel", "Cepogo", "Selo", "Musuk", "Mojosongo", "Teras", "Banyudono"]
    },
    "Jawa Barat": {
      "Bandung": ["Cileunyi", "Baleendah", "Dayeuhkolot", "Ciwidey", "Pangalengan", "Soreang", "Banjarwangi", "Kertasari"],
      "Garut": ["Tarogong Kaler", "Tarogong Kidul", "Cisurupan", "Cikajang", "Bayongbong", "Leles", "Kadungora", "Wanaraja"],
      "Cianjur": ["Cianjur", "Cugenang", "Pacet", "Cipanas", "Cibeber", "Warungkondang", "Campaka", "Sukanagara"],
      "Sukabumi": ["Cisaat", "Cibadak", "Cicurug", "Parungkuda", "Cikidang", "Pelabuhanratu", "Jampangtengah", "Surade"],
      "Subang": ["Subang", "Kalijati", "Ciater", "Jalanforka", "Cipunagara", "Pamanukan", "Pagaden", "Cijambe"]
    },
    "Jawa Timur": {
      "Malang": ["Kepanjen", "Batu", "Singosari", "Lawang", "Poncokusumo", "Pujon", "Ngantang", "Turen", "Dampit"],
      "Nganjuk": ["Nganjuk", "Kertosono", "Loceret", "Berbek", "Pace", "Baron", "Tanjunganom", "Bagor"],
      "Banyuwangi": ["Banyuwangi", "Genteng", "Rogojampi", "Srono", "Muncar", "Kabat", "Glenmore", "Kalibaru"],
      "Kediri": ["Pare", "Ngasem", "Gurah", "Plosoklaten", "Kandangan", "Kras", "Wates", "Kapar"],
      "Jember": ["Patrang", "Sumbersari", "Kaliwates", "Ambulu", "Tanggul", "Rambipuji", "Puger", "Semboro"]
    },
    "Sumatera Utara": {
      "Karo": ["Berastagi", "Kabanjahe", "Tigapanah", "Simpang Empat", "Merek", "Payung", "Laubaleng"],
      "Simalungun": ["Raya", "Siantar", "Tanah Jawa", "Sidamanik", "Perbaungan", "Bosar Maligas", "Girsang Sipangan Bolon"],
      "Deli Serdang": ["Lubuk Pakam", "Tanjung Morawa", "Percut Sei Tuan", "Sunggal", "Pancasurba", "Hamparan Perak"]
    },
    "Sulawesi Selatan": {
      "Gowa": ["Sungguminasa", "Malino / Tinggimoncong", "Pallangga", "Bajeng", "Parangloe", "Bontomarannu", "Manuju"],
      "Bantaeng": ["Bantaeng", "Bissappu", "Erekang", "Pajukukang", "Sinoa", "Uluere", "Tompobulu"],
      "Jeneponto": ["Bontosunggu", "Tamalatea", "Binamu", "Kelara", "Banggakala", "Arungkeke", "Tarowang"]
    }
  };

  // Step 1 State: 3-Tier Regional Cascading Dropdowns
  const [province, setProvince] = useState("Jawa Tengah");
  const [regency, setRegency] = useState("Cilacap");
  const [district, setDistrict] = useState("Sidareja");
  const [landAddress, setLandAddress] = useState("Desa Sukamaju, RT 02/05");

  // Step 2 State: Komoditas
  const [primaryCommodity, setPrimaryCommodity] = useState("Cabai Merah Besar");
  const [landSize, setLandSize] = useState("1.5 Hektar");
  const [harvestCapacity, setHarvestCapacity] = useState("1 - 5 Ton");

  // Step 3 State: Verifikasi Identitas
  const [nik, setNik] = useState("");
  const [groupName, setGroupName] = useState("");
  const [bankName, setBankName] = useState("BRI (Bank Rakyat Indonesia)");
  const [accountNumber, setAccountNumber] = useState("");
  const [ktpPreview, setKtpPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !user) return null;

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

  // Cascading Handler 1: Province Change -> Update Regencies & District
  const handleProvinceChange = (e) => {
    const selectedProv = e.target.value;
    setProvince(selectedProv);

    const availableRegencies = Object.keys(regionalHierarchy[selectedProv] || {});
    if (availableRegencies.length > 0) {
      const firstRegency = availableRegencies[0];
      setRegency(firstRegency);

      const availableDistricts = regionalHierarchy[selectedProv][firstRegency] || [];
      setDistrict(availableDistricts[0] || "");
    }
  };

  // Cascading Handler 2: Regency Change -> Update District
  const handleRegencyChange = (e) => {
    const selectedReg = e.target.value;
    setRegency(selectedReg);

    const availableDistricts = regionalHierarchy[province]?.[selectedReg] || [];
    setDistrict(availableDistricts[0] || "");
  };

  const handleKtpUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setKtpPreview(url);
    }
  };

  const handleNextStep = () => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!province || !regency || !district) {
        setErrorMsg("Silakan pilih provinsi, kabupaten/kota, dan kecamatan lahan Anda.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!primaryCommodity) {
        setErrorMsg("Silakan pilih komoditas utama yang Anda tanam.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitVerification = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!nik || nik.length < 16) {
      setErrorMsg("NIK KTP wajib diisi 16 digit angka.");
      return;
    }

    if (!accountNumber) {
      setErrorMsg("Nomor rekening / e-wallet pencairan wajib diisi.");
      return;
    }

    setLoading(true);
    const fullFarmLoc = `Kec. ${district}, ${regency}, ${province}`;
    try {
      const payload = {
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        farm_location: fullFarmLoc,
        province,
        regency,
        district,
        land_address: landAddress,
        primary_commodity: primaryCommodity,
        land_size: landSize,
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
          farm_location: fullFarmLoc,
          primary_commodity: primaryCommodity,
          land_size: landSize,
          nik
        };
        localStorage.setItem("tanipintar_user", JSON.stringify(updatedUser));
        setSubmittedSuccess(true);
        if (onUpgradeSuccess) onUpgradeSuccess(updatedUser);
      } else {
        setErrorMsg(data.error || "Gagal mengirim pengajuan verifikasi.");
      }
    } catch (err) {
      setLoading(false);
      const updatedUser = {
        ...user,
        role: "farmer_pending",
        verification_status: "pending",
        is_seller: false,
        farm_location: `Kec. ${district}, ${regency}, ${province}`,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0a0a0b]/90 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto tp-scrollbar"
      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
    >
      <div className="bg-[#141416] text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden relative my-auto">
        
        {/* Top Header Bar */}
        <div className="p-6 sm:p-8 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 w-9 h-9 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* Brand Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 shadow-sm">
              <Leaf size={16} />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">TaniPintar</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Daftar jadi petani terverifikasi
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Lengkapi data ini untuk mengaktifkan dashboard AI dan rekomendasi penjualan.
          </p>

          {/* 3 Step Indicator Progress Bar */}
          <div className="mt-8 mb-2 flex items-center justify-between relative max-w-md mx-auto">
            {/* Connecting Lines */}
            <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-800 -z-0" />
            <div
              className="absolute top-4 left-6 h-[2px] bg-emerald-500 transition-all duration-300 -z-0"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%"
              }}
            />

            {/* Step 1 Circle */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentStep >= 1
                    ? "bg-emerald-500 text-slate-950 shadow-md ring-4 ring-emerald-500/20"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                1
              </div>
              <span className={`text-xs font-semibold ${currentStep === 1 ? "text-white font-bold" : "text-slate-400"}`}>
                Lokasi
              </span>
            </div>

            {/* Step 2 Circle */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentStep >= 2
                    ? "bg-emerald-500 text-slate-950 shadow-md ring-4 ring-emerald-500/20"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                2
              </div>
              <span className={`text-xs font-semibold ${currentStep === 2 ? "text-white font-bold" : "text-slate-400"}`}>
                Komoditas
              </span>
            </div>

            {/* Step 3 Circle */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentStep >= 3
                    ? "bg-emerald-500 text-slate-950 shadow-md ring-4 ring-emerald-500/20"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                3
              </div>
              <span className={`text-xs font-semibold ${currentStep === 3 ? "text-white font-bold" : "text-slate-400"}`}>
                Verifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 pt-2">
          
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submittedSuccess ? (
            /* Success / Pending Confirmation Screen */
            <div className="p-8 text-center space-y-4 bg-[#1a1a1e] rounded-3xl border border-slate-800">
              <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <ShieldCheck size={36} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Pengajuan Verifikasi Terkirim! ⏳</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Data lokasi panen (<strong className="text-white">Kec. {district}, {regency}, {province}</strong>), komoditas, dan KTP Anda telah diterima. Tim Admin TaniPintar akan meninjau verifikasi Anda dalam estimasi <strong className="text-white">1x24 jam</strong>.
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl max-w-md mx-auto text-left text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <AlertCircle size={15} className="text-amber-400" /> Status Akun: "Dalam Peninjauan Admin"
                </div>
                <p className="text-[11px] text-amber-200/80 leading-snug">
                  Anda sudah dapat menjelajahi seluruh tampilan analitik. Akses penuh penjualan akan aktif otomatis begitu dikonfirmasi oleh Admin.
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all"
              >
                Kembali ke Dashboard
              </button>
            </div>
          ) : (
            /* Wizard Steps Cards Container */
            <div className="bg-[#1c1c1f] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-inner">
              
              {/* STEP 1: LOKASI (3-TIER DROPDOWNS: PROVINSI -> KABUPATEN/KOTA -> KECAMATAN) */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      Di mana lokasi lahan atau panen Anda?
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Data ini dipakai AI untuk menghitung peluang jual terbaik berdasarkan jarak dan harga wilayah lain.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* 1. Provinsi Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Provinsi</label>
                      <select
                        value={province}
                        onChange={handleProvinceChange}
                        className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        {Object.keys(regionalHierarchy).map((p, i) => (
                          <option key={i} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Kabupaten / Kota Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Kabupaten / kota</label>
                      <select
                        value={regency}
                        onChange={handleRegencyChange}
                        className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        {Object.keys(regionalHierarchy[province] || {}).map((r, i) => (
                          <option key={i} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Kecamatan Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Kecamatan</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        {(regionalHierarchy[province]?.[regency] || []).map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* 4. Alamat Detail / Desa (opsional) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Alamat detail / desa (opsional)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Desa Sukamaju, RT 02/05"
                        value={landAddress}
                        onChange={(e) => setLandAddress(e.target.value)}
                        className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: KOMODITAS */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      Apa komoditas utama yang Anda tanam?
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Data ini digunakan untuk menampilkan harga real-time dan analisis tren pasar wilayah sasaran.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Komoditas Utama</label>
                      <select
                        value={primaryCommodity}
                        onChange={(e) => setPrimaryCommodity(e.target.value)}
                        className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        {commoditiesList.map((comm, i) => (
                          <option key={i} value={comm}>{comm}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">Estimasi Luas Lahan</label>
                        <input
                          type="text"
                          placeholder="Contoh: 1.5 Hektar"
                          value={landSize}
                          onChange={(e) => setLandSize(e.target.value)}
                          className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">Estimasi Panen / Siklus</label>
                        <select
                          value={harvestCapacity}
                          onChange={(e) => setHarvestCapacity(e.target.value)}
                          className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                          {capacityList.map((cap, i) => (
                            <option key={i} value={cap}>{cap}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: VERIFIKASI IDENTITAS & REKENING */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      Verifikasi Identitas &amp; Rekening Pencairan
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Verifikasi NIK KTP dan rekening pencairan untuk bertransaksi aman di Marketplace TaniPintar.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">NIK KTP (16 Digit)</label>
                        <input
                          type="text"
                          required
                          maxLength={16}
                          placeholder="3301xxxxxxxxxxxx"
                          value={nik}
                          onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono tracking-wider transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">Nama Kelompok Tani (opsional)</label>
                        <input
                          type="text"
                          placeholder="Contoh: Poktan Makmur Jaya"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">Bank / E-Wallet Pencairan</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                          {bankList.map((b, i) => (
                            <option key={i} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">Nomor Rekening / Akun</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 0123-01-045678-50-2"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full bg-[#141416] border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Upload Foto KTP */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Foto KTP / Kartu Poktan (Opsional)</label>
                      <div className="border border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-4 bg-[#141416] transition-colors text-center cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleKtpUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {ktpPreview ? (
                          <div className="flex items-center justify-center gap-3">
                            <img src={ktpPreview} alt="KTP Preview" className="w-16 h-10 object-cover rounded-lg border border-slate-600" />
                            <span className="text-xs text-emerald-400 font-semibold">✓ Foto Dokumen Terpilih</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs py-1">
                            <Upload size={16} className="text-emerald-400" />
                            <span>Unggah Foto KTP / Kartu Anggota Poktan</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Bottom Control Navigation Bar */}
          {!submittedSuccess && (
            <div className="mt-8 flex items-center justify-between gap-4">
              {/* Back Button */}
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-5 py-3.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all border ${
                  currentStep === 1
                    ? "border-slate-800 text-slate-600 cursor-not-allowed bg-transparent"
                    : "border-slate-700 hover:border-slate-500 text-white bg-transparent hover:bg-slate-800"
                }`}
              >
                Kembali
              </button>

              {/* Circular Arrow Button (Visual Indicator) */}
              <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                <ArrowDown size={16} />
              </div>

              {/* Right Action Button */}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3.5 bg-[#10b981] hover:bg-[#059669] text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
                >
                  <span>{currentStep === 1 ? "Lanjut ke komoditas" : "Lanjut ke verifikasi"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitVerification}
                  disabled={loading}
                  className="px-6 py-3.5 bg-[#10b981] hover:bg-[#059669] text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Mengirim...
                    </>
                  ) : (
                    <>
                      <span>Kirim Pengajuan Verifikasi</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
