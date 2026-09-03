import React from "react";
import {
  Leaf,
  LayoutDashboard,
  Target,
  LineChart as LineChartIcon,
  Building2,
  Tag,
  Calculator,
  BarChart3,
  Database,
  MapPin,
  LogOut,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  PlusCircle,
  Package
} from "lucide-react";

export function DashboardSidebar({ name, onLogout, activeTab = "dashboard", setActiveTab, onOpenAuth, onOpenSellProduct, user }) {
  const menuGroups = [
    {
      title: "Strategi & Keputusan Pasar",
      items: [
        { id: "peluang", label: "Peluang Arbitrase Pasar", icon: Target },
        { id: "prediksi", label: "Tren & Prediksi Harga", icon: LineChartIcon },
        { id: "pembeli", label: "Direktori Pasar Induk", icon: Building2 },
        { id: "rekomendasi", label: "Batas Harga Tawar Aman", icon: Tag },
        { id: "hitung", label: "Kalkulator Arbitrase & Laba", icon: Calculator },
      ]
    },
    {
      title: "Marketplace & Transaksi",
      items: [
        { id: "marketplace_view", label: "Jelajah Marketplace", icon: ShoppingBag, badge: "Beli" },
        { id: "sell_product", label: "Mulai Menjual (Pasang Panen)", icon: PlusCircle, badge: "Jual" },
        { id: "orders", label: "Kelola Pesanan", icon: Package }
      ]
    },
    {
      title: "Analitik Komoditas",
      items: [
        { id: "analytics", label: "Market Analytics Nasional", icon: BarChart3 }
      ]
    }
  ];

  return (
    <aside className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto tp-scrollbar">
      <div>
        {/* Top Brand */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-xs">
              <Leaf size={20} />
            </div>
            <div>
              <div className="font-heading font-extrabold text-lg text-slate-900 leading-none">
                TaniPintar
              </div>
              <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                Intelijen Pasar Pangan
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-5">
          {/* Main Dashboard Link */}
          <div>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "dashboard"
                ? "bg-emerald-800 text-white shadow-xs font-bold"
                : "text-slate-700 hover:bg-slate-50"
                }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard Ringkasan</span>
            </button>
            <div className="pl-9 text-[11px] text-slate-400 font-medium mt-1">Peluang &amp; Rute Arbitrase</div>
          </div>

          {/* Market Feed Status Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Data Pasar Terhubung
              </span>
              <span className="text-[9px] bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded font-extrabold text-emerald-800">
                BI PIHPS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Sinkronisasi harga harian 38 provinsi &amp; pasar induk nasional.
            </p>
          </div>

          {/* Dynamic Menu Groups */}
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${isActive
                        ? "bg-emerald-50 text-emerald-900 font-bold border-r-2 border-emerald-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isActive ? "text-emerald-700" : "text-slate-400"} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                          {item.badge}
                        </span>
                      )}
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
                <span className="text-emerald-700 font-medium">PostgreSQL DB</span>
              </div>
              <div className="flex justify-between">
                <span>Produksi &amp; Konsumsi (BPS)</span>
                <span className="text-emerald-700 font-medium">Update bulanan</span>
              </div>
              <div className="flex justify-between">
                <span>Gemini AI Predictive</span>
                <span className="text-emerald-700 font-medium">Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card Bottom */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-3 text-left group hover:opacity-80 transition-opacity"
            title="Kelola Akun / Profil Pengguna"
          >
            <img
              src={user?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
            />
            <div>
              <div className="font-heading font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                {user?.full_name || name}
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>{user?.primary_commodity || "Petani Cabai"}</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                <MapPin size={10} /> {user?.farm_location || "Cilacap, Jawa Tengah"}
              </div>
            </div>
          </button>
          <button
            onClick={onLogout}
            title="Keluar / Reset Session"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}


