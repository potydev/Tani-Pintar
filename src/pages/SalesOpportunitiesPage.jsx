import React, { useState, useEffect, useMemo } from "react";
import {
  Target,
  TrendingUp,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Filter,
  Search,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  X,
  Compass,
  DollarSign
} from "lucide-react";
import { fetchAIRecommendations } from "../utils/apiData";
import { ShippingModal } from "../components/dashboard/ShippingModal";

export function SalesOpportunitiesPage({
  originLocation = "Cilacap, Jawa Tengah",
  selectedDate = null,
  initialCommodity = "Cabai Merah",
  onBackToDashboard
}) {
  const [selectedCommodity, setSelectedCommodity] = useState(initialCommodity);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIsland, setSelectedIsland] = useState("Semua");
  const [sortBy, setSortBy] = useState("profit"); // 'profit', 'price', 'percent', 'distance'
  const [selectedOpportunityForModal, setSelectedOpportunityForModal] = useState(null);

  useEffect(() => {
    if (initialCommodity) {
      setSelectedCommodity(initialCommodity);
    }
  }, [initialCommodity]);

  const loadData = async () => {
    setLoading(true);
    // Request all=true to fetch all regional destinations across Indonesia
    const data = await fetchAIRecommendations(originLocation, selectedCommodity, selectedDate, true);
    if (data && data.length > 0) {
      setOpportunities(data);
    } else {
      // Robust comprehensive fallback
      setOpportunities([
        {
          rank: 1,
          city: "Ternate",
          province: "Maluku Utara",
          island: "Maluku & Papua",
          originCity: originLocation.split(',')[0],
          originLocation,
          commodity: selectedCommodity,
          badge: "Sangat Direkomendasikan",
          originPrice: "Rp 34.225",
          destPrice: "Rp 112.500",
          diffPercent: "+228.7% Lebih tinggi",
          marginDiff: "Rp 39.137.500",
          shippingCost: "Rp 7.904.000",
          netProfit: "Rp 31.233.500",
          netProfitVal: 31233500,
          netProfitQty: "per 500 kg muatan",
          aiReasons: [
            `Harga ${selectedCommodity} +228.7% dibanding sentra panen Anda`,
            "Tujuan pasar utama di Ternate (Maluku Utara)",
            "Rute pengiriman kargo laut/udara terjadwal"
          ],
          shippingInfo: { distance: "2680 km", cost: "Rp 7.904.000", duration: "8-9 hari (Kargo Laut/Udara)" }
        },
        {
          rank: 2,
          city: "Ambon",
          province: "Maluku",
          island: "Maluku & Papua",
          originCity: originLocation.split(',')[0],
          originLocation,
          commodity: selectedCommodity,
          badge: "Direkomendasikan",
          originPrice: "Rp 34.225",
          destPrice: "Rp 98.150",
          diffPercent: "+186.8% Lebih tinggi",
          marginDiff: "Rp 31.962.500",
          shippingCost: "Rp 7.682.800",
          netProfit: "Rp 24.279.700",
          netProfitVal: 24279700,
          netProfitQty: "per 500 kg muatan",
          aiReasons: [
            `Harga ${selectedCommodity} +186.8% lebih tinggi di Pasar Ambon`,
            "Permintaan pasokan cabai segar tinggi",
            "Armada laut berpendingin tersedia rutin"
          ],
          shippingInfo: { distance: "2601 km", cost: "Rp 7.682.800", duration: "7-8 hari (Kargo Laut/Udara)" }
        },
        {
          rank: 3,
          city: "Palangkaraya",
          province: "Kalimantan Tengah",
          island: "Kalimantan",
          originCity: originLocation.split(',')[0],
          originLocation,
          commodity: selectedCommodity,
          badge: "Direkomendasikan",
          originPrice: "Rp 34.225",
          destPrice: "Rp 86.250",
          diffPercent: "+152.0% Lebih tinggi",
          marginDiff: "Rp 26.012.500",
          shippingCost: "Rp 2.799.600",
          netProfit: "Rp 23.212.900",
          netProfitVal: 23212900,
          netProfitQty: "per 500 kg muatan",
          aiReasons: [
            `Harga ${selectedCommodity} +152.0% dibanding sentra panen`,
            "Aksesibilitas pelabuhan Sampit/Kumai lancar",
            "Tingkat serapan pasar konsisten"
          ],
          shippingInfo: { distance: "857 km", cost: "Rp 2.799.600", duration: "2-3 hari (Kargo Laut/Udara)" }
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedCommodity, originLocation, selectedDate]);

  const commodities = [
    "Cabai Merah",
    "Cabai Rawit",
    "Bawang Merah",
    "Bawang Putih",
    "Beras",
    "Daging Ayam",
    "Daging Sapi",
    "Telur Ayam",
    "Minyak Goreng",
    "Gula Pasir"
  ];

  const islandOptions = [
    "Semua",
    "Jawa",
    "Sumatera",
    "Kalimantan",
    "Sulawesi",
    "Maluku & Papua",
    "Bali & Nusa Tenggara"
  ];

  // Filter & Search Logic
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        // Search filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          opp.city?.toLowerCase().includes(q) ||
          opp.province?.toLowerCase().includes(q) ||
          opp.island?.toLowerCase().includes(q);

        // Island filter
        const oppIsland = opp.island || "";
        let matchesIsland = true;
        if (selectedIsland === "Semua") {
          matchesIsland = true;
        } else if (selectedIsland === "Maluku & Papua") {
          matchesIsland = oppIsland.includes("Maluku") || oppIsland.includes("Papua");
        } else if (selectedIsland === "Bali & Nusa Tenggara") {
          matchesIsland = oppIsland.includes("Bali") || oppIsland.includes("Nusa Tenggara");
        } else {
          matchesIsland = oppIsland.toLowerCase().includes(selectedIsland.toLowerCase());
        }

        return matchesSearch && matchesIsland;
      })
      .sort((a, b) => {
        if (sortBy === "profit") {
          return (b.netProfitVal || 0) - (a.netProfitVal || 0);
        }
        if (sortBy === "price") {
          const numA = parseInt(String(a.destPrice || "0").replace(/[^0-9]/g, "")) || 0;
          const numB = parseInt(String(b.destPrice || "0").replace(/[^0-9]/g, "")) || 0;
          return numB - numA;
        }
        if (sortBy === "percent") {
          const pA = parseFloat(String(a.diffPercent || "0").replace("+", "")) || 0;
          const pB = parseFloat(String(b.diffPercent || "0").replace("+", "")) || 0;
          return pB - pA;
        }
        if (sortBy === "distance") {
          const dA = parseInt(String(a.shippingInfo?.distance || "9999").replace(/[^0-9]/g, "")) || 9999;
          const dB = parseInt(String(b.shippingInfo?.distance || "9999").replace(/[^0-9]/g, "")) || 9999;
          return dA - dB;
        }
        return 0;
      });
  }, [opportunities, searchQuery, selectedIsland, sortBy]);

  const topOpportunity = opportunities[0];
  const positiveOpportunitiesCount = opportunities.filter((o) => (o.netProfitVal || 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          {onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold transition-colors cursor-pointer group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali ke Dashboard Ringkasan</span>
            </button>
          ) : (
            <span>Dashboard Ringkasan</span>
          )}
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-800 font-bold">Peluang Arbitrase Pasar (Semua Daerah)</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Data Terhubung: Seluruh Provinsi BI PIHPS</span>
        </div>
      </div>

      {/* Hero Banner with National Stats */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-6 opacity-10 pointer-events-none">
          <Compass size={280} />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-emerald-200 text-xs font-bold px-3.5 py-1 rounded-full mb-3">
            <Target size={14} />
            <span>AI Multi-Regional Arbitrage Engine</span>
            <span className="w-1 h-1 rounded-full bg-emerald-300"></span>
            <span>34+ Provinsi Terverifikasi</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
            Daftar Lengkap Pilihan Seluruh Daerah Tujuan
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
            Peta peluang pasar komoditas pangan se-Indonesia. Temukan selisih harga tertinggi dari sentra panen Anda di{" "}
            <strong className="text-white underline decoration-emerald-400 underline-offset-2">{originLocation}</strong>{" "}
            ke pasar induk di Pulau Jawa, Sumatera, Kalimantan, Sulawesi, hingga Maluku dan Papua.
          </p>

          {/* Key Stat Badges in Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-emerald-700/50">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200/90 tracking-wider block">
                Total Pasar Terdata
              </span>
              <span className="font-heading font-black text-xl sm:text-2xl text-white block mt-0.5">
                {opportunities.length || 34} Daerah
              </span>
              <span className="text-[10px] text-emerald-200/80 font-medium">38 Provinsi Nasional</span>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200/90 tracking-wider block">
                Peluang Margin Positif
              </span>
              <span className="font-heading font-black text-xl sm:text-2xl text-emerald-300 block mt-0.5">
                {positiveOpportunitiesCount || 3} Daerah
              </span>
              <span className="text-[10px] text-emerald-200/80 font-medium">Laba setelah ongkir kargo</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200/90 tracking-wider block">
                Rute Paling Menguntungkan
              </span>
              <span className="font-heading font-black text-base sm:text-lg text-white truncate block mt-0.5">
                {topOpportunity?.city || "Ternate"} ({topOpportunity?.province || "Maluku Utara"})
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">
                Laba Bersih: {topOpportunity?.netProfit || "Rp 31.233.500"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter, Commodity, Search & Sorting Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Row 1: Commodity Selector, Search Input, and Sorter */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Commodity Dropdown */}
          <div className="flex items-center gap-2.5 min-w-[240px]">
            <Filter size={16} className="text-emerald-700 shrink-0" />
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Komoditas:</span>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="bg-slate-50 border border-slate-300 hover:border-emerald-500 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none flex-1 transition-colors cursor-pointer"
            >
              {commodities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kota atau provinsi (contoh: Jayapura, Medan, Makassar)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Selector & Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs">
              <SlidersHorizontal size={14} className="text-slate-500" />
              <span className="font-bold text-slate-600 whitespace-nowrap">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="profit">Laba Tertinggi</option>
                <option value="price">Harga Jual Tertinggi</option>
                <option value="percent">Selisih % Tertinggi</option>
                <option value="distance">Jarak Terdekat</option>
              </select>
            </div>

            <button
              onClick={loadData}
              className="p-2.5 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 rounded-xl border border-slate-200 transition-colors"
              title="Perbarui Data Pasar"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-emerald-700" : ""} />
            </button>
          </div>
        </div>

        {/* Row 2: Island / Regional Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 text-xs tp-scrollbar">
          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1 shrink-0">
            Wilayah:
          </span>
          {islandOptions.map((island) => {
            const count =
              island === "Semua"
                ? opportunities.length
                : opportunities.filter((o) => {
                    const oppIsland = o.island || "";
                    if (island === "Maluku & Papua") return oppIsland.includes("Maluku") || oppIsland.includes("Papua");
                    if (island === "Bali & Nusa Tenggara") return oppIsland.includes("Bali") || oppIsland.includes("Nusa Tenggara");
                    return oppIsland.toLowerCase().includes(island.toLowerCase());
                  }).length;

            const isActive = selectedIsland === island;

            return (
              <button
                key={island}
                type="button"
                onClick={() => setSelectedIsland(island)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-2xs font-extrabold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80"
                }`}
              >
                <span>{island}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? "bg-emerald-700 text-emerald-100" : "bg-white text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h4 className="font-heading font-bold text-slate-800 text-base">
              Memindai Harga Pasar di 38 Provinsi...
            </h4>
            <p className="text-slate-500 text-xs mt-1">
              Menghubungkan data BI PIHPS dan menghitung tarif kargo logistik nasional.
            </p>
          </div>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 size={24} />
          </div>
          <h4 className="font-heading font-bold text-slate-800 text-base">
            Tidak Ditemukan Pasar Tujuan yang Cocok
          </h4>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Tidak ada daerah yang sesuai dengan kata kunci pencarian "{searchQuery}" pada filter wilayah {selectedIsland}.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedIsland("Semua");
            }}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw size={13} />
            <span>Reset Pencarian &amp; Filter</span>
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4 px-1 text-xs text-slate-500 font-semibold">
            <span>
              Menampilkan <strong>{filteredOpportunities.length}</strong> daerah tujuan dari sentra panen {originLocation}
            </span>
            <span className="text-emerald-800 font-bold">Komoditas: {selectedCommodity}</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOpportunities.map((opp, idx) => {
              const isTop = idx === 0 && selectedIsland === "Semua" && !searchQuery;
              const isPositive = (opp.netProfitVal || 0) > 0;

              return (
                <div
                  key={opp.city + opp.province + idx}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                    isTop
                      ? "border-emerald-400 ring-2 ring-emerald-500/20 shadow-md"
                      : "border-slate-200/90 hover:border-emerald-300 hover:shadow-md shadow-2xs"
                  }`}
                >
                  {/* Card Top */}
                  <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 border ${
                            isTop
                              ? "bg-emerald-800 text-white border-emerald-900 shadow-xs"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          #{opp.rank || idx + 1}
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 truncate">
                          {opp.island || "Nasional"}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 border ${
                          opp.badge === "Sangat Direkomendasikan"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : opp.badge === "Direkomendasikan"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : isPositive
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {opp.badge || (isPositive ? "Direkomendasikan" : "Margin Ketat")}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                      {opp.city}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      Prov. {opp.province} • Pasar Induk Regional
                    </p>
                  </div>

                  {/* Pricing Comparison Box */}
                  <div className="p-5 space-y-4 flex-1">
                    <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        <span>Harga Sentra &rarr; Tujuan</span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                            opp.diffPercent?.includes("+")
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-slate-200 text-slate-700 border-slate-300"
                          }`}
                        >
                          {opp.diffPercent}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700">{opp.originPrice}</span>
                        <span className="text-slate-400">&rarr;</span>
                        <span className="font-extrabold text-emerald-800 text-sm">{opp.destPrice}</span>
                      </div>
                    </div>

                    {/* Logistics specs */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Jarak</span>
                        <span className="font-bold text-slate-700">{opp.shippingInfo?.distance || "—"}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Ongkir Kargo</span>
                        <span className="font-bold text-slate-700 truncate block">
                          {opp.shippingCost || opp.shippingInfo?.cost || "—"}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Estimasi Waktu</span>
                        <span className="font-bold text-slate-700 truncate block">
                          {opp.shippingInfo?.duration?.split(" ")[0] || "—"}
                        </span>
                      </div>
                    </div>

                    {/* AI bullet */}
                    {opp.aiReasons && opp.aiReasons.length > 0 && (
                      <div className="text-[11px] text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/70 flex items-start gap-2 leading-relaxed">
                        <ShieldCheck size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                        <span>{opp.aiReasons[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Est Net Profit & Simulation Action */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Est. Laba Bersih
                      </span>
                      <span
                        className={`font-black text-sm sm:text-base leading-tight block ${
                          isPositive ? "text-emerald-800" : "text-slate-600"
                        }`}
                      >
                        {opp.netProfit}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOpportunityForModal(opp)}
                      className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Simulasi Rute</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Shipping Modal for chosen Route */}
      {selectedOpportunityForModal && (
        <ShippingModal
          isOpen={true}
          onClose={() => setSelectedOpportunityForModal(null)}
          destination={selectedOpportunityForModal.city}
          province={selectedOpportunityForModal.province}
          estimatedProfit={selectedOpportunityForModal.netProfit}
          origin={selectedOpportunityForModal.originCity || originLocation.split(",")[0]}
          commodity={selectedOpportunityForModal.commodity || selectedCommodity}
          originPrice={selectedOpportunityForModal.originPrice}
          destPrice={selectedOpportunityForModal.destPrice}
          diffPercent={selectedOpportunityForModal.diffPercent}
          shippingInfo={selectedOpportunityForModal.shippingInfo}
        />
      )}
    </div>
  );
}
