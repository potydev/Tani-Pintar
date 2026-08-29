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
  Lock,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export function DashboardSidebar({ name, onLogout, activeTab = "dashboard", setActiveTab, onOpenAuth, onOpenUpgrade, user }) {
  const isVerifiedFarmer = user?.role === "verified_farmer" || user?.is_seller;

  const menuGroups = [
    {
      title: "Keputusan Penjualan AI",
      items: [
        { id: "peluang", label: "Peluang Penjualan", icon: Target, requiresFarmer: true },
        { id: "prediksi", label: "Prediksi Harga", icon: LineChartIcon, requiresFarmer: true },
        { id: "pembeli", label: "Pasar Induk", icon: Building2, requiresFarmer: false },
        { id: "rekomendasi", label: "Rekomendasi Harga", icon: Tag, requiresFarmer: true },
        { id: "hitung", label: "Hitung Keuntungan", icon: Calculator, requiresFarmer: false },
      ]
    },
    {
      title: "Data & Analytics",
      items: [
        { id: "analytics", label: "Market Analytics", icon: BarChart3, requiresFarmer: false }
      ]
    }
  ];

  const handleTabClick = (item) => {
    if (item.requiresFarmer && !isVerifiedFarmer) {
      if (onOpenUpgrade) onOpenUpgrade();
      return;
    }
    setActiveTab(item.id);
  };

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
        <div className="p-4 space-y-5">
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

          {/* Progressive Upgrade Banner for Buyer Roles */}
          {!isVerifiedFarmer && user && (
            <div className="p-3 bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl text-white space-y-2 border border-emerald-800 shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span className="flex items-center gap-1.5"><Sparkles size={14} /> Progressive Onboarding</span>
                <span className="text-[9px] bg-emerald-500/30 border border-emerald-400/30 px-1.5 py-0.5 rounded">GRATIS</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-snug">
                Daftarkan komoditas Anda untuk membuka analitik AI TaniPintar &amp; badge Petani Terverifikasi.
              </p>
              <button
                onClick={onOpenUpgrade}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <span>Daftar Jadi Petani</span> &rarr;
              </button>
            </div>
          )}

          {/* Dynamic Menu Groups */}
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </span>
                {gIdx === 0 && !isVerifiedFarmer && (
                  <span className="text-[9px] text-slate-400 font-medium italic">
                    Publik &amp; Personal
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isLocked = item.requiresFarmer && !isVerifiedFarmer;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item)}
                      title={isLocked ? "Fitur ini personal untuk petani terverifikasi (berdasarkan lokasi & komoditas Anda)" : item.label}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group/item ${isActive
                        ? "bg-emerald-50 text-emerald-800 font-bold border-r-2 border-emerald-600"
                        : isLocked
                        ? "text-slate-400 hover:bg-slate-50"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isActive ? "text-emerald-700" : "text-slate-400"} />
                        <span>{item.label}</span>
                      </div>
                      {isLocked ? (
                        <div className="relative group/tooltip flex items-center">
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            <Lock size={10} />
                            <span>Upgrade</span>
                          </div>
                          {/* Hover Tooltip explaining gating rationale */}
                          <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/tooltip:block group-hover/item:block w-48 p-2 bg-slate-900 text-white text-[10px] font-normal rounded-lg shadow-xl z-50 leading-tight text-left">
                            🔒 <strong>Fitur Personal Petani</strong>: Memerlukan lokasi panen &amp; komoditas terverifikasi.
                          </div>
                        </div>
                      ) : !item.requiresFarmer && !isVerifiedFarmer ? (
                        <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Publik
                        </span>
                      ) : null}
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
                <span>Data Transaksi TaniPintar</span>
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
                {isVerifiedFarmer ? (
                  <>
                    <ShieldCheck size={12} className="text-emerald-600" />
                    <span>{user?.primary_commodity || "Petani Cabai"}</span>
                  </>
                ) : (
                  <span className="text-slate-500 font-normal">Akun Pembeli</span>
                )}
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

