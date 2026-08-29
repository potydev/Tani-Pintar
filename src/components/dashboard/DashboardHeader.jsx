import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, Calendar, ChevronDown, Check, MapPin } from "lucide-react";
import { fetchAvailableDates } from "../../utils/apiData";

export function DashboardHeader({
  name,
  user,
  onOpenAuth,
  selectedDate,
  setSelectedDate,
  selectedLocation,
  setSelectedLocation
}) {
  const [showNotif, setShowNotif] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showLocDropdown, setShowLocDropdown] = useState(false);

  const displayName = user?.full_name || name || "Pak Joko Slamet";

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Pasokan Cabai Merah di pasar pilihan Anda siap dipantau", time: "10 menit lalu", unread: true },
    { id: 2, text: "Harga Cabai Merah di Semarang naik +5.2%", time: "1 jam lalu", unread: true },
    { id: 3, text: "Pasokan Cabai Rawit nasional diprediksi stabil minggu ini", time: "3 jam lalu", unread: true },
  ]);

  const notifRef = useRef(null);
  const dateRef = useRef(null);
  const locRef = useRef(null);

  const [datesList, setDatesList] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);

  useEffect(() => {
    async function loadDates() {
      setLoadingDates(true);
      const datesFromDb = await fetchAvailableDates();
      if (datesFromDb && datesFromDb.length > 0) {
        const labels = datesFromDb.map(d => d.label);
        setDatesList(labels);
        if (!selectedDate || selectedDate === "Memuat Tanggal...") {
          setSelectedDate(labels[0]);
        }
      }
      setLoadingDates(false);
    }
    loadDates();
  }, []);

  const locations = [
    { name: "Cilacap, Jateng", desc: "Wilayah Asal Utama (Jateng)" },
    { name: "Brebes, Jateng", desc: "Sentra Bawang & Cabai (Jateng)" },
    { name: "Bandung, Jabar", desc: "Pasar Induk Cariu (Jabar)" },
    { name: "Surabaya, Jatim", desc: "Osowilangun (Jatim)" },
    { name: "Medan, Sumut", desc: "Pasar Induk Lau Cih (Sumut)" }
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotif(false);
      if (dateRef.current && !dateRef.current.contains(event.target)) setShowDateDropdown(false);
      if (locRef.current && !locRef.current.contains(event.target)) setShowLocDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const isPendingFarmer = user?.role === "farmer_pending" || user?.verification_status === "pending";

  return (
    <div className="flex flex-col gap-4 mb-6 pb-2">
      {/* Pending Admin Verification Alert Banner */}
      {isPendingFarmer && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-3.5 rounded-2xl text-white shadow-md flex items-center justify-between text-xs sm:text-sm font-bold animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>⏳ Status Akun: Pengajuan Verifikasi Petani Dalam Peninjauan Admin (Estimasi 1x24 jam)</span>
          </div>
          <a
            href="/admin"
            className="px-3 py-1 bg-slate-950/40 hover:bg-slate-950/60 text-white rounded-lg text-xs font-extrabold transition-colors shrink-0 ml-2"
          >
            Cek Portal Admin 🛡️
          </a>
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
              className="px-2.5 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors"
            >
              {user ? "Kelola Akun" : "Masuk / Daftar"}
            </button>
            <a
              href="/admin"
              className="px-2.5 py-1 bg-slate-800 text-slate-200 hover:bg-slate-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              title="Portal Admin Konfirmasi Verifikasi"
            >
              <span>Portal Admin</span> 🛡️
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            AI TaniPintar menemukan peluang terbaik untuk penjualan hasil panen Anda hari ini.
          </p>
        </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 relative hover:border-slate-300 transition-colors shadow-sm focus:outline-none"
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
                    className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
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

        {/* Date Filter Dropdown */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer hover:border-slate-300 focus:outline-none"
          >
            <Calendar size={14} className="text-slate-400" />
            <span>{selectedDate}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pilih Tanggal Acuan
              </div>
              {datesList.map((d, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(d);
                    setShowDateDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    selectedDate === d ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-slate-700"
                  }`}
                >
                  <span>{d}</span>
                  {selectedDate === d && <Check size={14} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative" ref={locRef}>
          <button
            onClick={() => setShowLocDropdown(!showLocDropdown)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer hover:border-slate-300 focus:outline-none"
          >
            <MapPin size={14} className="text-emerald-700" />
            <span>Lokasi Panen: <strong>{selectedLocation}</strong></span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showLocDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pilih Wilayah Panen Anda
              </div>
              {locations.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedLocation(loc.name);
                    setShowLocDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    selectedLocation === loc.name ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-slate-700"
                  }`}
                >
                  <div>
                    <div>{loc.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{loc.desc}</div>
                  </div>
                  {selectedLocation === loc.name && <Check size={14} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

