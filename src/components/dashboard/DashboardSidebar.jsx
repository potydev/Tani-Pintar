import React, { useState } from "react";
import {
  Leaf,
  LayoutDashboard,
  Target,
  LineChart as LineChartIcon,
  ShoppingCart,
  Tag,
  Calculator,
  BarChart3,
  History,
  Database,
  MapPin,
  LogOut
} from "lucide-react";

export function DashboardSidebar({ name, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuGroups = [
    {
      title: "Keputusan Penjualan AI",
      items: [
        { id: "peluang", label: "Peluang Penjualan", icon: Target },
        { id: "prediksi", label: "Prediksi Harga", icon: LineChartIcon },
        { id: "pembeli", label: "Pembeli Terbaik", icon: ShoppingCart },
        { id: "rekomendasi", label: "Rekomendasi Harga", icon: Tag },
        { id: "hitung", label: "Hitung Keuntungan", icon: Calculator },
      ]
    },
    {
      title: "Data & Analytics",
      items: [
        { id: "analytics", label: "Market Analytics", icon: BarChart3 },
        { id: "riwayat", label: "Riwayat Transaksi", icon: History },
      ]
    }
  ];

  return (
    <aside className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto tp-scrollbar">
      <div>
        {/* Top Brand */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm">
              <Leaf size={20} />
            </div>
            <div>
              <div className="font-heading font-extrabold text-lg text-slate-900 leading-none">
                TaniPintar
              </div>
              <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                AI Market Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6">
          {/* Main Dashboard Link */}
          <div>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "dashboard"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
                }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <div className="pl-9 text-[11px] text-slate-400 font-medium mt-1">Ringkasan &amp; Peluang</div>
          </div>

          {/* Dynamic Menu Groups */}
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3 mb-2">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? "bg-emerald-50 text-emerald-800 font-bold border-r-2 border-emerald-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <Icon size={16} className={isActive ? "text-emerald-700" : "text-slate-400"} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sumber Data AI Box */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Database size={14} className="text-emerald-700" />
              <span>Sumber Data AI</span>
            </div>
            <div className="space-y-1.5 text-slate-600 text-[11px]">
              <div className="flex justify-between">
                <span>Harga Pangan (BI PIHPS)</span>
                <span className="text-emerald-700 font-medium">MySQL DB</span>
              </div>
              <div className="flex justify-between">
                <span>Produksi &amp; Konsumsi (BPS)</span>
                <span className="text-emerald-700 font-medium">Update bulanan</span>
              </div>
              <div className="flex justify-between">
                <span>Data Transaksi TaniPintar</span>
                <span className="text-emerald-700 font-medium">Real-time</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Distribusi (Maps)</span>
                <span className="text-emerald-700 font-medium">Jarak &amp; biaya</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card Bottom */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/farmer_avatar.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600"
            />
            <div>
              <div className="font-heading font-bold text-sm text-slate-900 leading-snug">{name}</div>
              <div className="text-[11px] text-slate-500">Petani Cabai</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <MapPin size={10} /> Cilacap, Jawa Tengah
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Keluar"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

