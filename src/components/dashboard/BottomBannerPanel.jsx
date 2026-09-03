import React from "react";
import { PlusCircle, Calculator, FileSpreadsheet, ShieldCheck, ArrowRight, Truck, Scale } from "lucide-react";

export function BottomBannerPanel({ onOpenSellProduct, onOpenCalculator }) {
  return (
    <div className="grid lg:grid-cols-12 gap-5 mt-6">
      {/* Quick Action Hub Left (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <Scale size={16} />
              </div>
              <div>
                <h3 className="font-heading text-base font-extrabold text-slate-900">
                  Pusat Operasional &amp; Aksi Penjualan Pangan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Akses langsung fasilitas transaksi, estimasi biaya logistik, dan laporan komoditas.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Layanan Terpadu
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                <PlusCircle size={15} />
              </div>
              <div className="font-heading font-bold text-xs text-slate-900">Pasang Komoditas Panen</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Tawarkan hasil panen ke pembeli pasar induk langsung.</div>
            </div>
            <button
              onClick={() => {
                const btn = document.querySelector('[data-testid="sidebar-sell-product"]') || document.querySelector('button:has(.lucide-plus-circle)');
                if (btn) btn.click();
              }}
              className="mt-3 text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Mulai Jual</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
                <Truck size={15} />
              </div>
              <div className="font-heading font-bold text-xs text-slate-900">Tarif Logistik Kargo</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Simulasi ongkos kirim darat &amp; laut antarpulau.</div>
            </div>
            <a
              href="#peluang"
              className="mt-3 text-xs font-bold text-blue-800 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Cek Tarif Kargo</span>
              <ArrowRight size={12} />
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                <FileSpreadsheet size={15} />
              </div>
              <div className="font-heading font-bold text-xs text-slate-900">Laporan Harga Harian</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Data historis komparasi harga 38 provinsi format cetak.</div>
            </div>
            <button
              onClick={() => window.print()}
              className="mt-3 text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Cetak / Simpan</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Quality Standards Card Right (4 cols) */}
      <div className="lg:col-span-4 bg-emerald-950 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-emerald-800">
        <div>
          <div className="flex items-center gap-2 mb-2 text-emerald-300">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Standar Mutu Pasar Induk</span>
          </div>
          <h4 className="font-heading font-bold text-base text-white leading-snug">
            Pedoman Sortasi &amp; Pengemasan Kargo
          </h4>
          <p className="text-emerald-100/80 text-xs leading-relaxed mt-2">
            Komoditas kualitas Super (kadar air &lt;14%, sortir tangkai) memperoleh selisih harga hingga +25% di pasar induk Kramat Jati, Caringin, dan Jakabaring.
          </p>
        </div>

        <div className="pt-4 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200">
          <span>Verifikasi SNI Pangan</span>
          <span className="font-mono text-emerald-400 font-bold">Grade A &amp; B</span>
        </div>
      </div>
    </div>
  );
}

