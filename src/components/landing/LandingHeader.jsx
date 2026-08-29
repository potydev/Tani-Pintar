import React, { useState, useEffect } from "react";
import { Leaf, ArrowRight, Menu, X, ShoppingBag, User } from "lucide-react";

export function LandingHeader({ onLoginClick, onNavigate, isLoggedIn, userName }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "Beranda", action: () => {} },
    { label: "Fitur Utama", action: () => {} },
    { label: "Marketplace", action: () => onNavigate && onNavigate("marketplace"), highlight: true },
    { label: "Panduan Petani", action: () => {} },
  ];

  return (
    <nav
      id="landing-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0d5c3a] rounded-lg flex items-center justify-center">
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
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`text-sm font-medium transition-colors ${
                item.highlight
                  ? "text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  : "text-[#0b1f13]/70 hover:text-[#0d5c3a]"
              }`}
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {item.highlight && <ShoppingBag size={14} />}
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
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
              <button
                onClick={() => onNavigate && onNavigate("dashboard")}
                className="flex items-center gap-1.5 bg-[#0d5c3a] hover:bg-[#0b4f31] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Dashboard <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="text-sm font-semibold text-[#0d5c3a] hover:text-[#0b1f13] transition-colors"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Masuk
              </button>
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 bg-[#0d5c3a] hover:bg-[#0b4f31] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Daftar Gratis <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[#0b1f13]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200/50 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => { item.action(); setMenuOpen(false); }}
              className={`text-sm font-medium text-left ${
                item.highlight ? "text-emerald-600 flex items-center gap-1.5" : "text-[#0b1f13]/70"
              }`}
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {item.highlight && <ShoppingBag size={14} />}
              {item.label}
            </button>
          ))}
          {isLoggedIn ? (
            <button
              onClick={() => { onNavigate && onNavigate("dashboard"); setMenuOpen(false); }}
              className="w-full bg-[#0d5c3a] text-white text-sm font-semibold py-2.5 rounded-lg"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => { onLoginClick(); setMenuOpen(false); }}
              className="w-full bg-[#0d5c3a] text-white text-sm font-semibold py-2.5 rounded-lg"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Masuk / Daftar
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
