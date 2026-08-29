import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, ArrowRight, Menu, X, ShoppingBag, User, LayoutDashboard } from "lucide-react";

export function LandingHeader({ isLoggedIn, userName, bgSolid = false }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isMarketplaceActive = location.pathname.startsWith("/marketplace");
  const isHomeActive = location.pathname === "/";

  return (
    <nav
      id="landing-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        bgSolid || scrolled || isMarketplaceActive
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Leaf size={18} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-slate-900 font-extrabold text-base tracking-tight"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              TaniPintar
            </span>
            <span
              className="text-emerald-600 text-[9px] font-extrabold tracking-widest uppercase mt-0.5"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              AI Market Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors ${
              isHomeActive ? "text-emerald-700 font-extrabold" : "text-slate-600 hover:text-emerald-700"
            }`}
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Beranda
          </Link>
          
          <Link
            to="/marketplace"
            className={`text-sm font-extrabold flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
              isMarketplaceActive
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60"
            }`}
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            <ShoppingBag size={14} /> Marketplace Panen
          </Link>

          <a
            href="/#features"
            className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Fitur AI
          </a>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-white text-[10px]">
                  <User size={12} />
                </div>
                <span>{userName}</span>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors px-2 py-1"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Masuk
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-900/10"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Mulai Berbelanja <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-700 p-2 focus:outline-none"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 py-1"
          >
            Beranda
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-extrabold text-emerald-700 py-1"
          >
            Marketplace Panen
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2.5 bg-emerald-700 text-white font-extrabold text-xs rounded-xl"
              >
                Ke Dashboard AI
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2.5 bg-emerald-700 text-white font-extrabold text-xs rounded-xl"
              >
                Masuk / Daftar Akun
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
