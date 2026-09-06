import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "../utils/gsapSetup";
import {
  Target,
  TrendingUp,
  Truck,
  ShieldCheck,
  MapPin,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Zap,
  Sparkles,
  Building2,
  ChevronRight,
  Calculator,
  MessageSquare,
  ShoppingBag,
  Database,
  ArrowUpRight,
  LineChart,
  Boxes,
  HelpCircle,
  Clock
} from "lucide-react";
import { LandingHeader } from "../components/landing/LandingHeader";
import { LandingTicker } from "../components/landing/LandingTicker";
import { LandingFooter } from "../components/landing/LandingFooter";

export function FeaturesPage({ isLoggedIn, userName }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("arbitrase");

  const heroRef = useRef(null);
  const ribbonRef = useRef(null);
  const previewBoxRef = useRef(null);
  const tableRef = useRef(null);
  const ctaRef = useRef(null);

  // Page entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroEls = heroRef.current?.querySelectorAll(".gsap-hero-el");
      if (heroEls && heroEls.length > 0) {
        gsap.fromTo(
          heroEls,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }
        );
      }

      if (ribbonRef.current?.children) {
        gsap.fromTo(
          Array.from(ribbonRef.current.children),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.5,
            delay: 0.2,
            ease: "power2.out",
            clearProps: "transform,opacity",
          }
        );
      }

      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll("tbody tr");
        if (rows.length > 0) {
          gsap.fromTo(
            rows,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: tableRef.current,
                start: "top 85%",
                once: true,
              },
              clearProps: "transform,opacity",
            }
          );
        }
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              once: true,
            },
            clearProps: "transform,opacity",
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Smooth transition when switching tabs in interactive preview
  useEffect(() => {
    if (previewBoxRef.current) {
      gsap.fromTo(
        previewBoxRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const featuresList = [
    {
      id: "arbitrase",
      icon: Target,
      tag: "Fitur Unggulan #1",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      title: "AI Sales Arbitrage Engine",
      subtitle: "Deteksi disparitas harga antar-provinsi dan temukan pasar dengan keuntungan tertinggi",
      summary:
        "Algoritma cerdas TaniPintar membandingkan harga komoditas pangan dari sentra panen Anda terhadap pasar induk di 38 provinsi di seluruh Indonesia secara real-time.",
      keyMetrics: [
        { label: "Margin Laba Rata-rata", val: "+18.4% s/d +120%" },
        { label: "Cakupan Pasar", val: "38 Provinsi Terdata" },
        { label: "Akurasi Estimasi", val: "98.2% Sesuai Lapangan" }
      ],
      points: [
        "Menghitung selisih harga kotor (*gross margin*) per 500 kg hingga puluhan ton muatan.",
        "Mengalkulasi otomatis estimasi ongkir kargo, biaya penyeberangan laut, dan susut bobot komoditas.",
        "Memberikan rekomendasi peringkat (#1, #2, #3) rute paling menguntungkan dari sentra produksi Anda.",
        "Simulasi instan sekali klik untuk memproyeksikan laba bersih sebelum truk kargo diberangkatkan."
      ],
      interactivePreview: {
        type: "route_card",
        origin: "Cilacap (Jawa Tengah)",
        dest: "Ternate (Maluku Utara)",
        commodity: "Cabai Merah",
        originPrice: "Rp 34.225 /kg",
        destPrice: "Rp 112.500 /kg",
        priceDiff: "+228.7% Lebih tinggi",
        netProfit: "Rp 31.233.500",
        netProfitUnit: "per 500 kg muatan",
        distance: "2.680 km",
        transitTime: "8-9 hari (Kargo Laut/Udara)"
      }
    },
    {
      id: "prediksi",
      icon: LineChart,
      tag: "Fitur Unggulan #2",
      badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
      title: "Prediksi & Tren Harga Pasar BI PIHPS",
      subtitle: "Prakiraan harga 7 hingga 14 hari ke depan untuk waktu panen paling tepat",
      summary:
        "Terintegrasi langsung dengan Bank Indonesia Pusat Informasi Harga Pangan Strategis (PIHPS) dan histori fluktuasi harga 460+ sentra produksi nasional.",
      keyMetrics: [
        { label: "Pembaruan Data", val: "Harian 10:00 & 18:00 WIB" },
        { label: "Komoditas Pokok", val: "10 Komoditas Strategis" },
        { label: "Histori Analisis", val: "12 Bulan Terakhir" }
      ],
      points: [
        "Grafik historis harga harian yang membandingkan sentra panen lokal terhadap rata-rata nasional.",
        "Peringatan dini penurunan harga akibat lonjakan panen raya di wilayah tetangga.",
        "Indikator indeks permintaan regional: memetakan provinsi dengan status permintaan Tinggi, Sedang, atau Rendah.",
        "Membantu petani memutuskan apakah harus memanen hari ini atau menahan 2-3 hari ke depan."
      ],
      interactivePreview: {
        type: "trend_card",
        title: "Tren Pasar Cabai Merah Nasional",
        status: "Tren Naik (+4.8% Minggu Ini)",
        avgPrice: "Rp 57.750 /kg",
        forecastDays: "7 Hari Mendatang Stabil di Atas Rp 55.000",
        demandHigh: ["DKI Jakarta (Tinggi)", "Jawa Barat (Tinggi)", "Maluku Utara (Sangat Tinggi)"]
      }
    },
    {
      id: "logistik",
      icon: Truck,
      tag: "Fitur Unggulan #3",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      title: "Kalkulator Logistik & Simulasi Muatan",
      subtitle: "Hitung ongkir armada pick-up, engkel box, fuso, dan kapal kargo tanpa tebak-tebakan",
      summary:
        "Biaya kirim seringkali menjadi jebakan yang memakan habis keuntungan petani. TaniPintar menyediakan kalkulator biaya riil per kg dan per ton muatan.",
      keyMetrics: [
        { label: "Pilihan Armada", val: "Pick-up s/d Tronton" },
        { label: "Dukungan Kargo", val: "Darat, Tol Laut & Feri" },
        { label: "Transparansi Tarif", val: "100% Bebas Biaya Gaib" }
      ],
      points: [
        "Perhitungan tarif berdasarkan jarak kilometer riil dan karakteristik armada berpendingin (cold chain) atau terpal.",
        "Faktor toleransi susut muatan: menghitung penyusutan alami cabai/sayur selama perjalanan.",
        "Saran kapasitas muatan paling ekonomis (contoh: muatan 500 kg lebih efisien dengan Pick-up L300 vs Fuso).",
        "Rekomendasi jadwal kapal Pelni / ASDP untuk penyeberangan lintas pulau."
      ],
      interactivePreview: {
        type: "logistics_card",
        vehicle: "Engkel Box Dingin (Kapasitas 2 Ton)",
        route: "Banyuwangi ke Denpasar & Mataram",
        estCost: "Rp 1.450.000 (Rp 725/kg)",
        shrinkage: "Estimasi Susut 1.2% (Terkendali)",
        transitHours: "8-10 Jam Termasuk Kapal Feri Ketapang-Gilimanuk"
      }
    },
    {
      id: "tanibot",
      icon: Sparkles,
      tag: "Fitur Unggulan #4",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      title: "TaniBot AI: Konsultan Pintar 24/7",
      subtitle: "Didukung Google Gemini AI dengan data komoditas pangan riil Indonesia",
      summary:
        "Tanyakan apa saja seputar harga pasar, waktu panen ideal, batas harga negosiasi dengan tengkulak, hingga penanganan hama penyakit secara instan.",
      keyMetrics: [
        { label: "Model AI", val: "Google Gemini 2.5 Flash" },
        { label: "Waktu Respon", val: "< 1.5 Detik" },
        { label: "Bahasa", val: "Bahasa Indonesia Kasual & Petani" }
      ],
      points: [
        "Menjawab pertanyaan spesifik: 'Berapa harga cabai di Pasar Cipinang hari ini?' dengan data harga hari ini.",
        "Memberikan argumen negosiasi kuat agar petani tidak mudah ditekan harga oleh perantara.",
        "Rekomendasi takaran pupuk dan pencegahan patek pada cabai atau busuk umbi pada bawang.",
        "Tersedia langsung di dalam dashboard dan dapat diakses dari smartphone petani."
      ],
      interactivePreview: {
        type: "chat_card",
        userQuery: "Berapa harga cabai merah di Ambon hari ini dan apakah untung jika dikirim dari Cilacap?",
        botReply:
          "Halo Pak! Hari ini harga Cabai Merah di Ambon mencapai Rp 98.150/kg. Dibandingkan sentra Cilacap (Rp 34.225/kg), terdapat selisih Rp 63.925/kg. Setelah dikurangi biaya kargo laut Rp 15.365/kg, proyeksi laba bersih Anda mencapai Rp 24.279.700 per 500 kg muatan. Sangat direkomendasikan!"
      }
    },
    {
      id: "direktori",
      icon: Building2,
      tag: "Fitur Unggulan #5",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      title: "Direktori Pasar Induk & Pedagang Besar",
      subtitle: "Akses kontak pedagang besar dan serapan tonase di pasar induk utama",
      summary:
        "Menghubungkan petani langsung dengan pedagang grosir terpercaya di Pasar Induk Kramat Jati, Pasar Induk Cipinang, Osowilangun Surabaya, dan Lau Cih Medan.",
      keyMetrics: [
        { label: "Mitra Terverifikasi", val: "450+ Pedagang Besar" },
        { label: "Kapasitas Serapan", val: "> 1.200 Ton / Hari" },
        { label: "Verifikasi Legalitas", val: "KTP, NIK & Lokasi Kios" }
      ],
      points: [
        "Profil lengkap pedagang besar: nama kios, nomor blok, jenis komoditas yang dicari, dan kapasitas serapan harian.",
        "Petani dapat menawarkan panen sebelum truk diberangkatkan untuk kepastian harga beli.",
        "Sistem rating dan ulasan dari sesama petani binaan untuk menjamin keamanan transaksi.",
        "Pemberitahuan kuota serapan komoditas yang sedang kosong di pasar tujuan."
      ],
      interactivePreview: {
        type: "buyer_card",
        name: "Haji Mahmud (Kios Berkah Tani - Blok B No. 12)",
        market: "Pasar Induk Kramat Jati, Jakarta Timur",
        demand: "Cabai Merah & Rawit (Butuh 3-5 Ton/Minggu)",
        paymentTerms: "Tunai / Transfer Saat Timbang Barang (H+0)",
        status: "Terverifikasi Resmi TaniPintar"
      }
    },
    {
      id: "marketplace",
      icon: ShoppingBag,
      tag: "Fitur Unggulan #6",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      title: "Marketplace Komoditas Tanpa Perantara",
      subtitle: "Pasang hasil panen Anda dan jangkau ribuan pembeli B2B di seluruh Indonesia",
      summary:
        "Platform perdagangan digital resmi TaniPintar yang memotong rantai distribusi panjang, sehingga petani menikmati harga lebih tinggi dan pembeli mendapat pasokan segar.",
      keyMetrics: [
        { label: "Biaya Transaksi", val: "0% Komisi Petani" },
        { label: "Sistem Transaksi", val: "Escrow Rekening Bersama" },
        { label: "Pilihan Komoditas", val: "Sayur, Cabai, Buah, Beras, Rempah" }
      ],
      points: [
        "Kemudahan memasang produk hasil panen dalam 2 menit via smartphone.",
        "Transparansi spesifikasi mutu: pencantuman Grade A/B, kadar air, tanggal petik, dan foto asli.",
        "Sistem pembayaran aman: dana ditahan di rekening bersama dan langsung diteruskan ke rekening petani saat muatan diterima.",
        "Status pesanan terintegrasi dengan nomor resi kargo pengiriman."
      ],
      interactivePreview: {
        type: "market_card",
        title: "Cabai Merah Keriting Grade A Super",
        farmer: "Pak Joko Slamet • Kelompok Tani Cilacap Sejahtera",
        price: "Rp 36.500 /kg",
        minOrder: "Min. 50 kg",
        stock: "Tersedia 480 kg (Panen Pagi Ini)",
        badge: "Organik • Terverifikasi Mutu"
      }
    }
  ];

  const currentFeature = featuresList.find((f) => f.id === activeTab) || featuresList[0];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <LandingTicker />
      <LandingHeader isLoggedIn={isLoggedIn} userName={userName} bgSolid={true} />

      <main className="space-y-20 pb-24">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-12 pb-16 bg-gradient-to-b from-emerald-50/70 via-white to-white overflow-hidden border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Breadcrumb */}
            <div className="gsap-hero-el flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link to="/" className="hover:text-emerald-800 transition-colors">
                Beranda
              </Link>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="text-emerald-800 font-extrabold">Fitur Utama &amp; Teknologi AI</span>
            </div>

            <div className="max-w-3xl">
              <div className="gsap-hero-el inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-900 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-bold mb-4 shadow-2xs">
                <Sparkles size={14} className="text-emerald-700" />
                <span>Ekosistem Lengkap Intelijen Agribisnis 2026</span>
              </div>
              <h1
                className="gsap-hero-el text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Teknologi Cerdas untuk Petani Indonesia Jual dengan Harga Tertinggi
              </h1>
              <p className="gsap-hero-el text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-medium">
                TaniPintar menggabungkan analitik data pasar real-time Bank Indonesia (PIHPS), kecerdasan buatan Google
                Gemini, dan jaringan logistik terpadu untuk menghilangkan dominasi tengkulak dan melipatgandakan margin petani.
              </p>

              <div className="gsap-hero-el flex flex-wrap items-center gap-4 mt-8">
                <Link
                  to="/login"
                  className="px-6 py-3.5 bg-[#0d5c3a] hover:bg-[#0b4f31] text-white font-extrabold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  <span>Coba Demo Fitur Sekarang</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/panduan"
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  <span>Baca Panduan Petani</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            {/* Quick Feature Pillars Ribbon */}
            <div ref={ribbonRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-14 pt-8 border-t border-slate-200/80">
              {featuresList.map((f) => {
                const Icon = f.icon;
                const isCurrent = activeTab === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveTab(f.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? "bg-emerald-800 text-white border-emerald-900 shadow-md scale-[1.02]"
                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs"
                    }`}
                  >
                    <Icon size={20} className={isCurrent ? "text-emerald-300" : "text-emerald-700"} />
                    <div className="mt-3">
                      <div className="font-heading font-extrabold text-xs leading-snug line-clamp-2">
                        {f.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Interactive Deep-Dive Feature Showcase */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Feature Narrative */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${currentFeature.badgeColor}`}>
                    {currentFeature.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Teknologi Berbasis Data Riil</span>
                </div>

                <h2
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  {currentFeature.title}
                </h2>

                <p className="text-emerald-800 font-bold text-sm sm:text-base leading-snug">
                  {currentFeature.subtitle}
                </p>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {currentFeature.summary}
                </p>

                {/* Key Metrics row */}
                <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-200/80">
                  {currentFeature.keyMetrics.map((km, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {km.label}
                      </span>
                      <span className="font-heading font-extrabold text-slate-900 text-xs sm:text-sm mt-0.5 block">
                        {km.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bullet Points */}
                <div className="space-y-2.5 pt-1">
                  {currentFeature.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Coba Fitur Ini di Dashboard</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Live Interactive Mock Preview */}
              <div className="lg:col-span-5">
                <div ref={previewBoxRef} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Live Visual Demonstrator
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Real Data Sample
                    </span>
                  </div>

                  {/* Dynamic Interactive Card Content depending on activeTab */}
                  {currentFeature.id === "arbitrase" && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Sentra Asal</span>
                          <div className="font-bold text-slate-800 text-sm">{currentFeature.interactivePreview.origin}</div>
                        </div>
                        <span className="text-slate-400 font-black text-base">&rarr;</span>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Pasar Tujuan</span>
                          <div className="font-bold text-emerald-800 text-sm">{currentFeature.interactivePreview.dest}</div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Harga Sentra:</span>
                          <span className="font-bold text-slate-700">{currentFeature.interactivePreview.originPrice}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Harga Tujuan:</span>
                          <span className="font-extrabold text-emerald-800 text-sm">{currentFeature.interactivePreview.destPrice}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200">
                          <span className="text-slate-500">Selisih Margin:</span>
                          <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {currentFeature.interactivePreview.priceDiff}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex justify-between items-center">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-200 block">Proyeksi Laba Bersih</span>
                          <span className="font-heading font-black text-lg text-white block">
                            {currentFeature.interactivePreview.netProfit}
                          </span>
                          <span className="text-[10px] text-emerald-200">{currentFeature.interactivePreview.netProfitUnit}</span>
                        </div>
                        <div className="text-right text-[11px] text-emerald-100">
                          <div>Jarak: {currentFeature.interactivePreview.distance}</div>
                          <div>Waktu: {currentFeature.interactivePreview.transitTime}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFeature.id === "prediksi" && (
                    <div className="space-y-4 text-xs">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-900 text-xs">
                        {currentFeature.interactivePreview.title}
                      </div>
                      <div className="space-y-2 text-slate-600">
                        <div className="flex justify-between">
                          <span>Status Tren:</span>
                          <span className="font-bold text-emerald-700">{currentFeature.interactivePreview.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rata-rata Nasional:</span>
                          <span className="font-bold text-slate-800">{currentFeature.interactivePreview.avgPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prakiraan AI:</span>
                          <span className="font-bold text-slate-800 text-right">{currentFeature.interactivePreview.forecastDays}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Demand Tertinggi:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentFeature.interactivePreview.demandHigh.map((d, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px]">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFeature.id === "logistik" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl font-bold text-blue-900">
                        {currentFeature.interactivePreview.vehicle}
                      </div>
                      <div className="space-y-2 text-slate-600">
                        <div className="flex justify-between">
                          <span>Rute Muatan:</span>
                          <span className="font-bold text-slate-800">{currentFeature.interactivePreview.route}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimasi Tarif:</span>
                          <span className="font-extrabold text-emerald-700">{currentFeature.interactivePreview.estCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Toleransi Susut:</span>
                          <span className="font-bold text-slate-700">{currentFeature.interactivePreview.shrinkage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Durasi Tempuh:</span>
                          <span className="font-bold text-slate-700 text-right">{currentFeature.interactivePreview.transitHours}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFeature.id === "tanibot" && (
                    <div className="space-y-3 text-xs">
                      <div className="bg-slate-100 p-3 rounded-xl text-slate-800 font-medium">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Pertanyaan Petani:</span>
                        "{currentFeature.interactivePreview.userQuery}"
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-950 font-medium leading-relaxed">
                        <span className="text-[10px] text-emerald-700 uppercase font-bold block mb-1 flex items-center gap-1">
                          <Sparkles size={11} /> Jawaban TaniBot AI:
                        </span>
                        {currentFeature.interactivePreview.botReply}
                      </div>
                    </div>
                  )}

                  {currentFeature.id === "direktori" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="font-bold text-amber-900 text-sm">{currentFeature.interactivePreview.name}</div>
                        <div className="text-amber-800 text-[11px] mt-0.5">{currentFeature.interactivePreview.market}</div>
                      </div>
                      <div className="space-y-2 text-slate-600 text-xs">
                        <div className="flex justify-between">
                          <span>Kebutuhan Serapan:</span>
                          <span className="font-bold text-slate-800">{currentFeature.interactivePreview.demand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sistem Pembayaran:</span>
                          <span className="font-bold text-emerald-700">{currentFeature.interactivePreview.paymentTerms}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                          <span>Status Verifikasi:</span>
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            {currentFeature.interactivePreview.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFeature.id === "marketplace" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 text-sm">{currentFeature.interactivePreview.title}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            {currentFeature.interactivePreview.badge}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px]">{currentFeature.interactivePreview.farmer}</div>
                      </div>
                      <div className="space-y-2 text-slate-600">
                        <div className="flex justify-between items-center">
                          <span>Harga Penjual:</span>
                          <span className="font-extrabold text-emerald-800 text-sm">{currentFeature.interactivePreview.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ketentuan Order:</span>
                          <span className="font-bold text-slate-700">{currentFeature.interactivePreview.minOrder}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stok Tersedia:</span>
                          <span className="font-bold text-slate-700">{currentFeature.interactivePreview.stock}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison: Cara Konvensional vs TaniPintar AI */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Mengapa Petani Memilih TaniPintar?
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Perbandingan langsung cara konvensional mengandalkan tengkulak lokal versus pemanfaatan kecerdasan buatan TaniPintar.
            </p>
          </div>

          <div ref={tableRef} className="overflow-x-auto tp-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="p-4 sm:p-5 w-1/3">Aspek Penjualan</th>
                  <th className="p-4 sm:p-5 w-1/3 text-rose-800 bg-rose-50/50">Cara Lama (Tengkulak / Pengepul)</th>
                  <th className="p-4 sm:p-5 w-1/3 text-emerald-900 bg-emerald-50">TaniPintar AI Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">Penetapan Harga Beli</td>
                  <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">
                    Ditentukan sepihak oleh perantara. Petani buta harga pasar kota besar.
                  </td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-900 bg-emerald-50/30">
                    Transparan berbasis data BI PIHPS 38 provinsi secara real-time.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">Jangkauan Pasar</td>
                  <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">
                    Terbatas hanya di pasar desa atau pengepul kecamatan.
                  </td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-900 bg-emerald-50/30">
                    Menembus pasar induk antar-pulau dengan selisih harga tertinggi.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">Kepastian Pembayaran</td>
                  <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">
                    Sering diutang berbulan-bulan (*tempo*) atau dipotong susut sepihak.
                  </td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-900 bg-emerald-50/30">
                    Sistem Escrow rekening bersama, pencairan langsung saat timbang terima.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">Keputusan Waktu Panen</td>
                  <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">
                    Menebak-nebak kalender, sering terjebak anjlok saat panen raya.
                  </td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-900 bg-emerald-50/30">
                    Panduan AI prediktif 7-14 hari ke depan untuk waktu panen paling menguntungkan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="max-w-7xl mx-auto px-6">
          <div ref={ctaRef} className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                Siap Melipatgandakan Keuntungan Panen Anda?
              </h3>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-medium">
                Bergabunglah bersama 12.450+ petani mandiri di 38 provinsi yang telah menikmati kepastian harga dan pasar tanpa perantara.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Link
                to="/login"
                className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-sm rounded-xl shadow-md transition-all text-center cursor-pointer"
              >
                Mulai Gratis Sekarang
              </Link>
              <Link
                to="/panduan"
                className="px-6 py-3.5 bg-emerald-700/60 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl border border-emerald-500/40 transition-all text-center cursor-pointer"
              >
                Pelajari Panduan Petani
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
