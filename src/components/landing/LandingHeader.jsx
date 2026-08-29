import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, ArrowRight, Menu, X, ShoppingBag, User, LayoutDashboard } from "lucide-react";

export function LandingHeader({ isLoggedIn, userName, bgSolid = false }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isMarketplaceActive = location.pathname.startsWith("/marketplace");

  return (
    <nav
      id="landing-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        bgSolid || scrolled || isMarketplaceActive
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#0d5c3a] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <Leaf size={16} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-[#0b1f13] font-bold text-base tracking-tight"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              TaniPintar
            </span>
            <span
              className="text-[#16a34a] text-[9px] font-semibold tracking-[0.15em] uppercase"
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
            className="text-sm font-medium text-[#0b1f13]/70 hover:text-[#0d5c3a] transition-colors"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Beranda
          </Link>
          <a
            href="/#features"
            className="text-sm font-medium text-[#0b1f13]/70 hover:text-[#0d5c3a] transition-colors"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Fitur Utama
          </a>
          <Link
            to="/marketplace"
            className={`text-sm font-medium flex items-center gap-1 transition-colors ${
              isMarketplaceActive
                ? "text-[#0d5c3a] font-bold"
                : "text-[#0b1f13]/70 hover:text-[#0d5c3a]"
            }`}
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            <ShoppingBag size={14} className="text-[#0d5c3a]" />
            Marketplace
          </Link>
          <a
            href="/#guidance"
            className="text-sm font-medium text-[#0b1f13]/70 hover:text-[#0d5c3a] transition-colors"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Panduan Petani
          </a>
        </div>

        {/* Desktop Right Actions (Secondary / Outline CTA hierarchy to keep Hero Primary) */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User size={14} className="text-emerald-700" />
                </div>
                <span className="font-medium text-xs text-slate-700" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {userName}
                </span>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 bg-[#0d5c3a] hover:bg-[#0b4f31] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Dashboard <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-[#0d5c3a] transition-colors px-2 py-1"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Masuk
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0d5c3a] border border-emerald-300 text-xs font-extrabold px-4 py-2 rounded-xl transition-all"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Mulai Sekarang <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-700 p-2 focus:outline-none"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1"
          >
            Beranda
          </Link>
          <a
            href="/#features"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1"
          >
            Fitur Utama
          </a>
          <Link
            to="/marketplace"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-bold text-[#0d5c3a] py-1"
          >
            Marketplace
          </Link>
          <a
            href="/#guidance"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1"
          >
            Panduan Petani
          </a>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2 bg-[#0d5c3a] text-white font-bold text-xs rounded-lg"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2 bg-emerald-50 text-[#0d5c3a] border border-emerald-300 font-bold text-xs rounded-lg"
              >
                Masuk / Mulai Sekarang
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
