import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../utils/gsapSetup";
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
  Scale,
  DollarSign,
  Leaf,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Calendar,
  Box,
  MessageCircle,
  FileText,
  BadgePercent,
  CheckSquare,
  Square
} from "lucide-react";
import { LandingHeader } from "../components/landing/LandingHeader";
import { LandingTicker } from "../components/landing/LandingTicker";
import { LandingFooter } from "../components/landing/LandingFooter";

export function FarmerGuidePage({ isLoggedIn, userName }) {
  const [activeChapter, setActiveChapter] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const heroRef = useRef(null);
  const chaptersNavRef = useRef(null);
  const chapterContentRef = useRef(null);
  const checklistSectionRef = useRef(null);
  const faqSectionRef = useRef(null);
  const ctaSectionRef = useRef(null);

  // Initial page entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroEls = heroRef.current?.querySelectorAll(".gsap-hero-item");
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

      if (chaptersNavRef.current?.children) {
        gsap.fromTo(
          Array.from(chaptersNavRef.current.children),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.6,
            delay: 0.15,
            ease: "power2.out",
            clearProps: "transform,opacity",
          }
        );
      }

      if (checklistSectionRef.current) {
        gsap.fromTo(
          checklistSectionRef.current,
          { y: 30, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: checklistSectionRef.current,
              start: "top 85%",
              once: true,
            },
            clearProps: "transform,opacity",
          }
        );
      }

      if (faqSectionRef.current) {
        const faqCards = faqSectionRef.current.querySelectorAll(".gsap-faq-card");
        if (faqCards.length > 0) {
          gsap.fromTo(
            faqCards,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: faqSectionRef.current,
                start: "top 85%",
                once: true,
              },
              clearProps: "transform,opacity",
            }
          );
        }
      }

      if (ctaSectionRef.current) {
        gsap.fromTo(
          ctaSectionRef.current,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaSectionRef.current,
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

  // Smooth transition when activeChapter changes
  useEffect(() => {
    if (chapterContentRef.current) {
      gsap.fromTo(
        chapterContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeChapter]);
  const [checklistState, setChecklistState] = useState([
    { id: 1, text: "Cek data harga pasar tujuan di dashboard TaniPintar hari ini", checked: true },
    { id: 2, text: "Pastikan komoditas dipetik pada waktu sejuk (pagi hari sebelum jam 09:00)", checked: true },
    { id: 3, text: "Lakukan sortasi mutu (pisahkan komoditas busuk/cacat dari Grade A)", checked: false },
    { id: 4, text: "Gunakan kemasan keranjang berventilasi atau kardus berlubang untuk sirkulasi udara", checked: false },
    { id: 5, text: "Timbang dan catat total berat kotor dan tara wadah sebelum muat ke armada", checked: false },
    { id: 6, text: "Konfirmasi kesiapan pedagang pembeli di pasar induk tujuan", checked: false }
  ]);

  const toggleChecklist = (id) => {
    setChecklistState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const chapters = [
    {
      id: 1,
      number: "01",
      icon: Calendar,
      title: "Menentukan Waktu Panen Terbaik",
      subtitle: "Hindari anjloknya harga akibat panen raya dengan membaca sinyal pasar",
      content: [
        {
          heading: "1. Membaca Grafik Tren Harga di Dashboard",
          desc: "Sebelum memetik, buka menu 'Tren & Prediksi Harga' di TaniPintar. Perhatikan apakah harga sedang bergerak naik (hijau) atau mulai melandai. Jika grafik menunjukkan sinyal kenaikan dalam 2 hari ke depan dan komoditas masih dapat bertahan di pohon, pertimbangkan menunda panen 1-2 hari."
        },
        {
          heading: "2. Waspadai Efek Panen Raya Wilayah Tetangga",
          desc: "Pantau indikator status pasokan di dashboard. Jika sentra-sentra besar seperti Brebes atau Banyuwangi sedang mengalami panen puncak bersamaan, pasar induk Jawa akan banjir pasokan. Saat ini terjadi, segera alihkan pandangan ke pasar luar pulau seperti Maluku, Kalimantan, atau Papua yang tidak terpengaruh panen raya Jawa."
        },
        {
          heading: "3. Waktu Pemetikan yang Tepat",
          desc: "Petik cabai atau sayuran pada pagi hari antara pukul 06:00 - 09:00 WIB atau sore hari setelah pukul 15:30 WIB saat suhu udara rendah. Jangan memetik saat terik matahari siang karena kadar air dan daya simpan komoditas akan menurun drastis selama perjalanan."
        }
      ],
      tip: "Tips TaniBot: Cabai merah yang dipetik saat embun pagi telah mengering memiliki daya tahan simpan 36 jam lebih lama dibanding yang dipetik dalam kondisi basah."
    },
    {
      id: 2,
      number: "02",
      icon: Scale,
      title: "Menghitung Peluang Arbitrase & Selisih Laba",
      subtitle: "Rumus sederhana menghitung laba bersih setelah dipotong ongkir dan susut",
      content: [
        {
          heading: "1. Jangan Hanya Tergiur Harga Jual Tinggi",
          desc: "Harga cabai di Ternate bisa Rp 110.000/kg sedangkan di kebun Anda Rp 35.000/kg. Selisih kotor adalah Rp 75.000/kg. Namun, Anda harus selalu menghitung ongkir kargo, biaya penyeberangan fuso/kontainer, serta toleransi susut muatan."
        },
        {
          heading: "2. Rumus Laba Bersih Arbitrase",
          desc: "Laba Bersih = (Harga Jual Tujuan x Estimasi Berat Sampai) - (Harga Pokok Panen x Berat Asal) - Total Biaya Kargo & Retribusi. Di TaniPintar, rumus ini telah otomatis dihitung oleh kalkulator kami, sehingga Anda cukup melihat angka 'Est. Laba Bersih'."
        },
        {
          heading: "3. Memperhitungkan Toleransi Susut Bobot",
          desc: "Sayuran dan cabai yang dikirim 2-4 hari biasanya mengalami susut bobot antara 1% hingga 3.5%. Pastikan Anda melebihkan timbangan asal sebesar 2% agar saat tiba di pasar tujuan dan ditimbang ulang, berat bersih tetap sesuai pesanan pembeli."
        }
      ],
      tip: "Kalkulator Arbitrase TaniPintar secara otomatis memperhitungkan standar susut 1.5% - 2.5% berdasarkan durasi kargo yang dipilih."
    },
    {
      id: 3,
      number: "03",
      icon: Truck,
      title: "Standar Pengemasan & Pengiriman Kargo Aman",
      subtitle: "Menjaga kualitas komoditas tetap Grade A selama perjalanan darat dan laut",
      content: [
        {
          heading: "1. Pemilihan Wadah yang Memiliki Ventilasi",
          desc: "Gunakan keranjang plastik berpori (*krat*) atau karung jaring berlubang halus. Jangan pernah menggunakan karung plastik kedap udara (karung terigu/semen) untuk komoditas basah karena gas etilen yang terperangkap akan memicu pembusukan cepat dan panas."
        },
        {
          heading: "2. Penataan Muatan di Dalam Bak Truk",
          desc: "Beri jarak rongga udara antar-tumpukan peti minimal 5-10 cm agar sirkulasi angin bekerja saat armada melaju. Jika menggunakan truk terbuka, gunakan terpal kanvas berlapis yang dinaikkan kerangkanya agar tidak menekan muatan paling atas."
        },
        {
          heading: "3. Kapan Menggunakan Armada Pendingin (Reefer)?",
          desc: "Untuk perjalanan lintas pulau yang memakan waktu lebih dari 4 hari (seperti rute Jawa ke Maluku atau Papua), sangat disarankan menyewa kontainer berpendingin (*reefer container*) pada suhu 8°C - 12°C. Biaya sewa lebih tinggi, namun risiko rusak turun dari 15% menjadi di bawah 1%."
        }
      ],
      tip: "Mitra logistik TaniPintar telah dilatih SOP pengangkutan pangan segar, mencakup jadwal penyemprotan es halus untuk sayuran daun dan pengecekan suhu berkala."
    },
    {
      id: 4,
      number: "04",
      icon: Box,
      title: "Cara Memasang Panen di Marketplace TaniPintar",
      subtitle: "Panduan cepat membuat katalog hasil panen agar langsung diminati pembeli",
      content: [
        {
          heading: "1. Ambil Foto Asli dengan Pencahayaan Jelas",
          desc: "Potret hasil panen di kebun atau di tempat penimbangan dengan cahaya alami. Tunjukkan foto tampak dekat untuk memperlihatkan kesegaran tangkai, kelurusan buah, dan warna mengkilap."
        },
        {
          heading: "2. Cantumkan Grade dan Spesifikasi Nyata",
          desc: "Sebutkan Grade secara jujur: Grade A (panjang seragam >14 cm, warna merah 95%), Grade B (sedang, sedikit melengkung). Kejujuran deskripsi membangun reputasi toko petani Anda sehingga pembeli grosir akan menjadi pelanggan tetap."
        },
        {
          heading: "3. Tentukan Minimal Order yang Masuk Akal",
          desc: "Untuk penjualan eceran atau warung, minimal order 20-50 kg. Untuk pedagang pasar induk, pasang minimal order 200 kg hingga 1 ton agar biaya kargo per kg menjadi ekonomis."
        }
      ],
      tip: "Akun Petani Binaan yang terverifikasi dengan foto KTP dan sertifikat lahan mendapatkan badge centang hijau dan diprioritaskan di hasil pencarian pembeli."
    },
    {
      id: 5,
      number: "05",
      icon: DollarSign,
      title: "Strategi Negosiasi & Menghadapi Tengkulak",
      subtitle: "Gunakan data TaniPintar sebagai senjata tawar-menawar harga yang adil",
      content: [
        {
          heading: "1. Tunjukkan Data Harga Hari Ini di Layar HP",
          desc: "Saat pedagang pengepul menawar panen Anda dengan harga rendah dengan alasan 'pasar lagi banjir', tunjukkan halaman harga TaniPintar yang bersumber dari BI PIHPS hari ini. Tengkulak tidak dapat lagi memanipulasi informasi saat Anda memiliki data resmi."
        },
        {
          heading: "2. Ketahui 'Batas Harga Tawar Aman'",
          desc: "Buka menu 'Batas Harga Tawar Aman' di dashboard. Sistem telah menghitung biaya pokok produksi (pupuk, bibit, tenaga kerja panen) dan memberikan angka batas bawah. Jangan pernah melepas panen di bawah angka batas aman ini."
        },
        {
          heading: "3. Memiliki Opsi Penjualan Alternatif",
          desc: "Kunci negosiasi yang kuat adalah memiliki alternatif. Karena Anda telah terdaftar di Marketplace TaniPintar dan dapat menjual langsung ke pasar induk kota lain, Anda memiliki posisi tawar yang jauh lebih kuat di hadapan tengkulak lokal."
        }
      ],
      tip: "Petani yang menunjukkan grafik harga pasar TaniPintar rata-rata berhasil menaikkan penawaran harga beli pedagang lokal sebesar Rp 2.500 s/d Rp 4.000 per kg."
    }
  ];

  const faqs = [
    {
      q: "Apakah mendaftar dan menggunakan TaniPintar berbayar?",
      a: "Pendaftaran, pemantauan harga harian 38 provinsi, penggunaan kalkulator arbitrase, dan konsultasi TaniBot AI adalah 100% GRATIS untuk seluruh petani Indonesia. Kami tidak memungut biaya langganan bulanan."
    },
    {
      q: "Bagaimana jika saya tidak memiliki armada truk sendiri untuk kirim barang?",
      a: "Anda tidak perlu khawatir! TaniPintar terhubung dengan jaringan mitra logistik terverifikasi (Engkel, Fuso, Tol Laut). Saat pembeli memesan di Marketplace atau saat Anda memilih rute arbitrase, sistem kami dapat menjadwalkan penjemputan langsung di lokasi kebun atau titik kumpul kelompok tani."
    },
    {
      q: "Kapan petani menerima pembayaran dari hasil penjualan di Marketplace?",
      a: "Sistem TaniPintar menggunakan rekening penampung aman (Escrow). Saat pembeli memesan, dana langsung dikunci di sistem. Begitu muatan tiba dan ditimbang terima oleh pembeli di pasar tujuan, dana secara otomatis ditransfer ke rekening bank petani dalam 1x24 jam tanpa potongan tersembunyi."
    },
    {
      q: "Apakah petani pemula yang lahan garapannya kecil bisa bergabung?",
      a: "Tentu saja! TaniPintar dirancang untuk seluruh petani, mulai dari petani individu dengan lahan 0.2 hektar hingga gabungan kelompok tani (Gapoktan). Petani kecil juga dapat menggabungkan muatan panen dengan tetangga (*konsolidasi muatan*) agar memenuhi kuota pengiriman."
    },
    {
      q: "Bagaimana cara kerja TaniBot jika saya ingin tanya seputar penyakit tanaman?",
      a: "Cukup buka widget obrolan TaniBot di dashboard, lalu ketik gejala tanaman Anda (contoh: 'daun cabai menguning dan ada bercak hitam, obatnya apa?'). TaniBot akan menganalisis gejala hama/jamur dan memberikan saran tindakan agronomis yang tepat."
    }
  ];

  const currentChapter = chapters.find((c) => c.id === activeChapter) || chapters[0];
  const IconComponent = currentChapter.icon;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <LandingTicker />
      <LandingHeader isLoggedIn={isLoggedIn} userName={userName} bgSolid={true} />

      <main className="space-y-20 pb-24">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-12 pb-16 bg-gradient-to-b from-emerald-50/70 via-white to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="gsap-hero-item flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link to="/" className="hover:text-emerald-800 transition-colors">
                Beranda
              </Link>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="text-emerald-800 font-extrabold">Panduan Praktis Petani</span>
            </div>

            <div className="max-w-3xl">
              <div className="gsap-hero-item inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold mb-4">
                <BookOpen size={14} className="text-emerald-800" />
                <span>Pusat Edukasi &amp; Pengetahuan Agribisnis</span>
              </div>
              <h1
                className="gsap-hero-item text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Panduan Sukses Penjualan Hasil Panen Tanpa Perantara
              </h1>
              <p className="gsap-hero-item text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-medium">
                Kumpulan panduan praktis langkah-demi-langkah yang disusun oleh pakar agronomi, praktisi logistik pangan,
                dan pedagang pasar induk untuk membantu Anda menjual hasil bumi dengan keuntungan maksimal.
              </p>

              <div className="gsap-hero-item flex flex-wrap items-center gap-4 mt-8">
                <a
                  href="#chapters"
                  className="px-6 py-3.5 bg-[#0d5c3a] hover:bg-[#0b4f31] text-white font-extrabold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  <span>Mulai Baca Panduan</span>
                  <ArrowRight size={16} />
                </a>
                <Link
                  to="/fitur"
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  <span>Lihat Fitur Utama TaniPintar</span>
                </Link>
              </div>
            </div>

            {/* Chapter Navigation Tabs */}
            <div ref={chaptersNavRef} id="chapters" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-14 pt-8 border-t border-slate-200/80">
              {chapters.map((ch) => {
                const Icon = ch.icon;
                const isSelected = activeChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChapter(ch.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-800 text-white border-emerald-900 shadow-md scale-[1.02]"
                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-emerald-700 text-emerald-100" : "bg-slate-100 text-slate-600"
                      }`}>
                        Bab {ch.number}
                      </span>
                      <Icon size={18} className={isSelected ? "text-emerald-300" : "text-emerald-700"} />
                    </div>
                    <div className="mt-4">
                      <div className="font-heading font-extrabold text-xs sm:text-sm leading-snug line-clamp-2">
                        {ch.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Active Chapter Reading View */}
        <section className="max-w-7xl mx-auto px-6">
          <div ref={chapterContentRef} className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
            <div className="max-w-4xl space-y-8">
              {/* Chapter Header */}
              <div className="border-b border-slate-200 pb-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <IconComponent size={18} className="text-emerald-700" />
                  <span>MODUL PEMBELAJARAN AGRIBISNIS • BAB {currentChapter.number}</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  {currentChapter.title}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base font-medium">
                  {currentChapter.subtitle}
                </p>
              </div>

              {/* Sub-sections */}
              <div className="space-y-6">
                {currentChapter.content.map((sec, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      {sec.heading}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                      {sec.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Expert Tip Callout */}
              <div className="bg-emerald-100/70 border-l-4 border-emerald-700 p-5 rounded-r-2xl space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                  <Sparkles size={14} className="text-emerald-800" />
                  <span>TIPS PRAKTIS PETANI BINAAN</span>
                </div>
                <p className="text-emerald-950 text-xs sm:text-sm font-medium leading-relaxed">
                  {currentChapter.tip}
                </p>
              </div>

              {/* Next Chapter Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-medium">
                  Sedang membaca Bab {currentChapter.number} dari {chapters.length}
                </span>
                {currentChapter.id < chapters.length ? (
                  <button
                    onClick={() => setActiveChapter(currentChapter.id + 1)}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Lanjut ke Bab 0{currentChapter.id + 1}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="px-5 py-2.5 bg-[#0d5c3a] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Terapkan di Dashboard Sekarang</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Pre-Shipment Checklist */}
        <section ref={checklistSectionRef} className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-3">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                  <CheckSquare size={14} />
                  <span>Alat Interaktif Mandiri</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Checklist Pra-Pengiriman Hasil Panen
                </h3>
                <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed font-medium">
                  Sebelum armada kargo diberangkatkan, centang 6 poin pemeriksaan penting ini untuk memastikan hasil panen tiba tanpa potongan komplain dari pembeli.
                </p>
                <div className="pt-2 text-xs text-emerald-300 font-bold">
                  Selesai: {checklistState.filter((c) => c.checked).length} dari {checklistState.length} Langkah
                </div>
              </div>

              <div className="lg:col-span-7 bg-white rounded-2xl p-6 text-slate-800 shadow-md space-y-2.5">
                {checklistState.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      item.checked
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.checked ? (
                      <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded border border-slate-300 bg-white shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs sm:text-sm font-semibold leading-snug ${item.checked ? "line-through opacity-80" : ""}`}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Pertanyaan yang Sering Ditanyakan Petani (FAQ)
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Jawaban ringkas dan jelas seputar cara kerja platform TaniPintar untuk kelancaran usaha agribisnis Anda.
            </p>
          </div>

          <div ref={faqSectionRef} className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div
                  key={fIdx}
                  className="gsap-faq-card border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-extrabold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={17} className="text-emerald-700 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180 text-emerald-800" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed font-medium border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner Bottom */}
        <section ref={ctaSectionRef} className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            <div className="max-w-2xl space-y-2">
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                Butuh Bantuan Konsultasi Langsung?
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                TaniBot AI siap menjawab pertanyaan seputar takaran pupuk, perbandingan harga pasar hari ini, dan perhitungan rute pengiriman 24 jam sehari.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Link
                to="/login"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all text-center cursor-pointer"
              >
                Buka TaniBot di Dashboard
              </Link>
              <Link
                to="/marketplace"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm rounded-xl border border-slate-700 transition-all text-center cursor-pointer"
              >
                Lihat Marketplace
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
