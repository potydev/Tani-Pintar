import React from "react";
import { Bell, Calendar, MapPin, ChevronDown } from "lucide-react";

export function DashboardHeader({ name }) {
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
        <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 relative hover:border-slate-300 transition-colors shadow-sm">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer hover:border-slate-300">
          <Calendar size={14} className="text-slate-400" />
          <span>Hari ini, 29 Juli 2026</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer hover:border-slate-300">
          <MapPin size={14} className="text-emerald-700" />
          <span>Lokasi Panen: <strong>Cilacap, Jateng</strong></span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}
