import React from "react";
import { Leaf } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <Leaf size={18} />
          </div>
          <span className="font-heading font-bold text-white text-base">TaniPintar AI</span>
          <span>© 2026. Data harga bersumber dari Bapanas &amp; BPS.</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-white transition-colors">Syarat &amp; Ketentuan</a>
          <a href="#" className="hover:text-white transition-colors">Bantuan Petani</a>
        </div>
      </div>
    </footer>
  );
}
