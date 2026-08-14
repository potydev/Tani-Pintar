import React, { useState, useRef, useEffect } from "react";
import { Bell, Calendar, MapPin, ChevronDown, Check, CheckCircle2 } from "lucide-react";

export function DashboardHeader({ name }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showLocDropdown, setShowLocDropdown] = useState(false);

  const [selectedDate, setSelectedDate] = useState("Hari ini, 6 Agt 2026");
  const [selectedLocation, setSelectedLocation] = useState("Cilacap, Jateng");

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Pesanan baru dari Pembeli Grosir Bandung (500 kg)", time: "10 menit lalu", unread: true },
    { id: 2, text: "Harga Cabai Merah di Semarang naik +5.2%", time: "1 jam lalu", unread: true },
    { id: 3, text: "Pasokan Cabai Rawit nasional diprediksi menurun minggu ini", time: "3 jam lalu", unread: true },
  ]);

  const notifRef = useRef(null);
  const dateRef = useRef(null);
  const locRef = useRef(null);

  const dates = [
    "Hari ini, 6 Agt 2026",
    "Rabu, 5 Agt 2026",
    "Selasa, 4 Agt 2026",
    "Senin, 3 Agt 2026",
    "Jumat, 31 Jul 2026",
    "Kamis, 30 Jul 2026"
  ];

  const locations = [
    { name: "Cilacap, Jateng", desc: "Wilayah Asal Utama" },
    { name: "Brebes, Jateng", desc: "Sentra Bawang & Cabai" },
    { name: "Bandung, Jabar", desc: "Pasar Induk Cariu" },
    { name: "Malang, Jatim", desc: "Sentra Sayur Mayur" },
    { name: "Medan, Sumut", desc: "Pasar Induk Lau Cih" }
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

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
          Halo, {name}! 👋
        </h1>
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
              {dates.map((d, i) => (
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
  );
}

