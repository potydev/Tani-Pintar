import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCircle2,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronsUpDown,
  Check,
  MapPin,
  Sparkles,
  RefreshCw,
  Search,
  Layers
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { fetchAvailableDates } from "../../utils/apiData";
import { HARVEST_LOCATIONS } from "../../data/harvestLocations";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "../ui/command";

export function DashboardHeader({
  name,
  user,
  onOpenAuth,
  onOpenUpgrade,
  selectedDate,
  setSelectedDate,
  selectedLocation,
  setSelectedLocation
}) {
  const [showNotif, setShowNotif] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLocComboboxOpen, setIsLocComboboxOpen] = useState(false);
  const [selectedIslandFilter, setSelectedIslandFilter] = useState("Semua");

  const displayName = user?.full_name || name || "Pak Joko Slamet";

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Pasokan Cabai Merah di pasar pilihan Anda siap dipantau", time: "10 menit lalu", unread: true },
    { id: 2, text: "Harga Cabai Merah di Semarang naik +5.2%", time: "1 jam lalu", unread: true },
    { id: 3, text: "Pasokan Cabai Rawit nasional diprediksi stabil minggu ini", time: "3 jam lalu", unread: true },
  ]);

  const notifRef = useRef(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);

  // Helper to parse date string into a Date object
  const parseDateString = (dateStr) => {
    if (!dateStr || dateStr === "Memuat Tanggal...") return new Date();
    if (dateStr instanceof Date) return dateStr;
    const clean = dateStr.replace(/\s*\(.*?\)/, "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      const [y, m, d] = clean.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    const monthsIndo = {
      jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, may: 4, jun: 5,
      jul: 6, agt: 7, agu: 7, aug: 7, sep: 8, okt: 9, oct: 9,
      nov: 10, des: 11, dec: 11
    };
    const parts = clean.split(/\s+/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const monthKey = parts[1].toLowerCase().slice(0, 3);
      const month = monthsIndo[monthKey] !== undefined ? monthsIndo[monthKey] : new Date().getMonth();
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    const fallback = new Date(clean);
    return isNaN(fallback.getTime()) ? new Date() : fallback;
  };

  const parsedSelectedDate = parseDateString(selectedDate);

  useEffect(() => {
    async function loadDates() {
      setLoadingDates(true);
      const datesFromDb = await fetchAvailableDates();
      if (datesFromDb && datesFromDb.length > 0) {
        setAvailableDates(datesFromDb);
        const labels = datesFromDb.map(d => d.label);
        if (!selectedDate || selectedDate === "Memuat Tanggal...") {
          setSelectedDate(labels[0]);
        }
      }
      setLoadingDates(false);
    }
    loadDates();
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotif(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleSelectDate = (date) => {
    if (!date) return;
    const formatted = format(date, "d MMM yyyy", { locale: idLocale });
    const latestDbDate = availableDates[0]?.date;
    const isLatest = latestDbDate ? format(date, "yyyy-MM-dd") === latestDbDate : isSameDay(date, new Date());
    const finalLabel = isLatest ? `${formatted} (Terbaru)` : formatted;
    setSelectedDate(finalLabel);
    setIsCalendarOpen(false);
  };

  const handleSelectQuickDate = (item) => {
    setSelectedDate(item.label);
    setIsCalendarOpen(false);
  };

  const isPendingFarmer = user?.role === "farmer_pending" || user?.verification_status === "pending";
  const isRejectedFarmer = user?.verification_status === "rejected";

  // Filter locations based on island/region tab if selected
  const filteredLocations = selectedIslandFilter === "Semua"
    ? HARVEST_LOCATIONS
    : selectedIslandFilter === "Lainnya"
    ? HARVEST_LOCATIONS.filter(l => !["Jawa", "Sumatera", "Sulawesi", "Bali & Nusa Tenggara"].includes(l.island))
    : HARVEST_LOCATIONS.filter(l => l.island === selectedIslandFilter);

  // Group locations by region/category
  const popularLocations = filteredLocations.filter(l => l.popular);
  const regularLocations = filteredLocations.filter(l => !l.popular);

  // Get current active location info
  const currentLocationInfo = HARVEST_LOCATIONS.find(l => l.name === selectedLocation) || {
    name: selectedLocation,
    region: "Indonesia",
    desc: "Wilayah Panen Terpilih"
  };

  return (
    <div className="flex flex-col gap-4 mb-6 pb-2">
      {/* Pending Admin Verification Alert Banner */}
      {isPendingFarmer && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-3.5 rounded-2xl text-white shadow-md flex items-center justify-between text-xs sm:text-sm font-bold animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>⏳ Status Akun: Pengajuan Verifikasi Petani Dalam Peninjauan Admin (Estimasi 1x24 jam)</span>
          </div>
        </div>
      )}

      {/* Rejected Admin Verification Alert Banner */}
      {isRejectedFarmer && (
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 p-4 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-bold animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
            <div>
              <span className="font-extrabold block sm:inline">❌ Pengajuan Verifikasi Petani Ditolak: </span>
              <span className="font-medium text-rose-100">&ldquo;{user?.rejection_reason || "Foto KTP / data lahan belum memenuhi syarat."}&rdquo;</span>
            </div>
          </div>
          {onOpenUpgrade && (
            <button
              onClick={onOpenUpgrade}
              className="px-3.5 py-1.5 bg-white text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-extrabold transition-colors shrink-0 shadow-sm"
            >
              Ajukan Ulang Verifikasi &rarr;
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Halo, {displayName}! 👋
            </h1>
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              {user ? "Kelola Akun" : "Masuk / Daftar"}
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            AI TaniPintar menemukan peluang terbaik untuk penjualan hasil panen Anda hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 relative hover:border-slate-300 transition-colors shadow-sm focus:outline-none cursor-pointer"
              title="Notifikasi"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h4 className="font-bold text-xs text-slate-800">Notifikasi Terbaru</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 size={12} /> Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs transition-colors ${
                        n.unread ? "bg-emerald-50/70 border border-emerald-100" : "bg-slate-50 border border-slate-100"
                      }`}
                    >
                      <p className="font-medium text-slate-800 leading-snug">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shadcn UI Pop-over + Calendar Component for Tanggal Acuan */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer hover:border-emerald-300 hover:bg-slate-50/80 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                title="Pilih Tanggal Acuan Analisis"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CalendarIcon size={13} className="text-emerald-700" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-medium text-slate-400 leading-tight">Tanggal Acuan</span>
                  <span className="text-xs font-bold text-slate-800">{selectedDate || "Pilih Tanggal..."}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400 ml-1 transition-transform duration-200" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="end" sideOffset={8} className="w-[320px] p-4 bg-white shadow-2xl rounded-2xl border border-slate-200/90 z-50">
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CalendarIcon size={13} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Pilih Tanggal Acuan</h4>
                    <p className="text-[10px] text-slate-400 leading-tight">Analisis tren harga & rekomendasi pasar</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  {format(parsedSelectedDate, "d MMM yyyy", { locale: idLocale })}
                </span>
              </div>

              {/* Shadcn UI Calendar Component */}
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={parsedSelectedDate}
                  onSelect={handleSelectDate}
                  defaultMonth={parsedSelectedDate}
                  className="rounded-xl"
                />
              </div>

              {/* Quick Preset Buttons (Available Database Scraped Dates) */}
              {availableDates.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Data Riwayat Tersedia</span>
                    <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Sparkles size={10} /> Real-time
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-0.5">
                    {availableDates.slice(0, 5).map((item, idx) => {
                      const isItemActive = selectedDate === item.label;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectQuickDate(item)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            isItemActive
                              ? "bg-emerald-700 text-white font-bold shadow-sm"
                              : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/70"
                          }`}
                        >
                          <span>{item.label}</span>
                          {isItemActive && <Check size={11} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popover Footer Action */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (availableDates.length > 0) {
                      setSelectedDate(availableDates[0].label);
                    } else {
                      const todayFormatted = `${format(new Date(), "d MMM yyyy", { locale: idLocale })} (Terbaru)`;
                      setSelectedDate(todayFormatted);
                    }
                    setIsCalendarOpen(false);
                  }}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw size={11} /> Reset ke Terbaru
                </button>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Shadcn UI Command Palette / Combobox (Searchable Popover) for Lokasi Panen */}
          <Popover open={isLocComboboxOpen} onOpenChange={setIsLocComboboxOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer hover:border-emerald-300 hover:bg-slate-50/80 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                title="Pilih Wilayah Panen / Asal Komoditas"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MapPin size={13} className="text-emerald-700" />
                </div>
                <div className="flex flex-col text-left max-w-[150px] sm:max-w-[180px]">
                  <span className="text-[10px] font-medium text-slate-400 leading-tight">Lokasi Panen</span>
                  <span className="text-xs font-bold text-slate-800 truncate">{selectedLocation}</span>
                </div>
                <ChevronsUpDown size={14} className="text-slate-400 ml-1 transition-transform duration-200 shrink-0" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[360px] sm:w-[400px] p-0 bg-white shadow-2xl rounded-2xl border border-slate-200/90 overflow-hidden z-50"
            >
              {/* Header Info */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white leading-tight">Pilih Lokasi Sentra Panen</h4>
                    <p className="text-[10px] text-emerald-200/80 leading-tight">Basis perhitungan biaya logistik & rekomendasi pasar</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                  {HARVEST_LOCATIONS.length} Wilayah
                </span>
              </div>

              {/* Island Filter Tabs */}
              <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto text-[11px] font-medium tp-scrollbar">
                {["Semua", "Jawa", "Sumatera", "Sulawesi", "Bali & Nusa Tenggara", "Lainnya"].map((island) => (
                  <button
                    key={island}
                    type="button"
                    onClick={() => setSelectedIslandFilter(island)}
                    className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                      selectedIslandFilter === island
                        ? "bg-emerald-700 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-200/60"
                    }`}
                  >
                    {island}
                  </button>
                ))}
              </div>

              {/* Shadcn Command Palette with Instant Search */}
              <Command className="w-full">
                <CommandInput placeholder="Cari kota, kabupaten, provinsi, atau sentra..." />
                <CommandList className="max-h-[300px] overflow-y-auto p-1.5 tp-scrollbar">
                  <CommandEmpty className="py-8 text-center text-xs text-slate-500">
                    <div className="flex flex-col items-center gap-1.5">
                      <Search size={24} className="text-slate-300" />
                      <p className="font-semibold text-slate-700">Wilayah tidak ditemukan</p>
                      <p className="text-[11px] text-slate-400">Coba ketik nama kota lain atau sentra produksi terdekat.</p>
                    </div>
                  </CommandEmpty>

                  {/* Popular agricultural centers */}
                  {popularLocations.length > 0 && (
                    <CommandGroup heading="⭐ Sentra Panen Utama & Terpopuler">
                      {popularLocations.map((loc) => {
                        const isSelected = selectedLocation === loc.name;
                        return (
                          <CommandItem
                            key={loc.name}
                            value={`${loc.name} ${loc.region} ${loc.desc} ${loc.island}`}
                            onSelect={() => {
                              setSelectedLocation(loc.name);
                              setIsLocComboboxOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all my-0.5 ${
                              isSelected
                                ? "bg-emerald-50/90 text-emerald-900 font-bold border border-emerald-200/60"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="flex items-start gap-2 text-left">
                              <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                              }`}>
                                <MapPin size={11} />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900">{loc.name}</span>
                                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                                    {loc.region}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-normal leading-snug mt-0.5 line-clamp-1">
                                  {loc.desc}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-2">
                                <Check size={12} />
                              </div>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}

                  {/* Other regional centers */}
                  {regularLocations.length > 0 && (
                    <CommandGroup heading="Daftar Wilayah & Sentra Lainnya">
                      {regularLocations.map((loc) => {
                        const isSelected = selectedLocation === loc.name;
                        return (
                          <CommandItem
                            key={loc.name}
                            value={`${loc.name} ${loc.region} ${loc.desc} ${loc.island}`}
                            onSelect={() => {
                              setSelectedLocation(loc.name);
                              setIsLocComboboxOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all my-0.5 ${
                              isSelected
                                ? "bg-emerald-50/90 text-emerald-900 font-bold border border-emerald-200/60"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="flex items-start gap-2 text-left">
                              <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                              }`}>
                                <MapPin size={11} />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900">{loc.name}</span>
                                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                                    {loc.region}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-normal leading-snug mt-0.5 line-clamp-1">
                                  {loc.desc}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-2">
                                <Check size={12} />
                              </div>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>

              {/* Popover Footer Info */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Layers size={12} className="text-emerald-600" /> Lokasi aktif: <strong className="text-slate-700">{selectedLocation}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsLocComboboxOpen(false)}
                  className="px-2 py-0.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
