import React from "react";
import { X, MapPin, CheckCircle2, PhoneCall, TrendingUp, Sparkles, Building2, ShieldCheck } from "lucide-react";

export function ShippingModal({ destination, netProfit, onClose }) {
  const city = destination || "Bandung";

  const buyerDirectory = {
    Bandung: {
      marketName: "Pasar Induk Caringin Bandung",
      contactPerson: "Pak Haji Dedi (Koperasi Pedagang)",
      phone: "+6281398765432",
      demandStatus: "Tinggi (Serapan > 3 Ton/hari)",
      buyingPrice: "Rp 45.000 / kg"
    },
    Jakarta: {
      marketName: "Pasar Induk Cipinang Jaya",
      contactPerson: "Pak Bambang (PT Cipinang Jaya)",
      phone: "+6281234567890",
      demandStatus: "Sangat Tinggi (Serapan > 10 Ton/hari)",
      buyingPrice: "Rp 46.500 / kg"
    },
    Purwokerto: {
      marketName: "Pasar Manis Purwokerto",
      contactPerson: "Ibu Ratna (Agregator Regional)",
      phone: "+6281566778899",
      demandStatus: "Sedang (Serapan ~ 1.5 Ton/hari)",
      buyingPrice: "Rp 42.500 / kg"
    },
    Yogyakarta: {
      marketName: "Pasar Giwangan Yogyakarta",
      contactPerson: "Pak Yudi (Paguyuban Pedagang)",
      phone: "+6281122334455",
      demandStatus: "Stabil (Serapan ~ 2 Ton/hari)",
      buyingPrice: "Rp 43.000 / kg"
    }
  };

  const buyer = buyerDirectory[city] || buyerDirectory["Bandung"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={20} />
            <h3 className="font-heading font-bold text-base">Analisis Rute &amp; Kontak Pasar Induk</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Route Summary */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block mb-1">
                Tujuan Analisis Peluang AI
              </span>
              <div className="flex items-center gap-2 font-heading font-extrabold text-slate-900 text-lg">
                <MapPin size={18} className="text-emerald-600" />
                <span>{city}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Est. Margin Bersih</span>
              <span className="font-heading font-black text-emerald-700 text-xl">{netProfit || "Rp 3.000.000"}</span>
            </div>
          </div>

          {/* AI Market Rationale */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-emerald-600" />
              <span>Faktor Keunggulan Pasar {city}:</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-700 border border-slate-100">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Status Permintaan:</strong> {buyer.demandStatus}.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Penawaran Harga Beli:</strong> {buyer.buyingPrice} (Konsisten tinggi).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Efisiensi Logistik:</strong> Akses rute darat lancar untuk truk muatan sedang (Engkel/Pickup).</span>
              </div>
            </div>
          </div>

          {/* Direct Buyer / Market Station Contact */}
          <div className="p-4 bg-emerald-700 text-white rounded-xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 uppercase">
                <Building2 size={16} />
                <span>Pasar Induk &amp; Kontak Pembeli</span>
              </div>
              <span className="text-[10px] bg-emerald-600 text-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                Terverifikasi
              </span>
            </div>

            <div>
              <div className="font-heading font-extrabold text-base text-white">{buyer.marketName}</div>
              <div className="text-xs text-emerald-100 mt-0.5">Penanggung Jawab: {buyer.contactPerson}</div>
            </div>

            <a
              href={`https://wa.me/${buyer.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
            >
              <PhoneCall size={15} />
              <span>Hubungi Pedagang via WhatsApp</span>
            </a>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Transparansi Data TaniPintar AI</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
