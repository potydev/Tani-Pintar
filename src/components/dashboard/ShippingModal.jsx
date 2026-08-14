import React, { useState } from "react";
import { X, Truck, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export function ShippingModal({ destination, netProfit, onClose, onSuccess }) {
  const [courier, setCourier] = useState("tanikirim");
  const [weight, setWeight] = useState(500);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    setIsSuccess(true);
    setTimeout(() => {
      if (onSuccess) onSuccess({ destination, weight, courier });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="text-emerald-400" size={20} />
            <h3 className="font-heading font-bold text-base">Jadwalkan Pengiriman Panen</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="font-heading font-bold text-xl text-slate-900">Pengiriman Berhasil Dijadwalkan!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Mitra kurir TaniKirim akan menghubungi Anda untuk konfirmasi armada penjemputan di lokasi panen.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Route Summary */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Rute Tujuan AI</span>
                <div className="flex items-center gap-2 font-heading font-extrabold text-slate-900 text-base">
                  <MapPin size={16} className="text-emerald-600" />
                  <span>Cilacap</span>
                  <ArrowRight size={14} className="text-slate-400" />
                  <span>{destination || "Bandung"}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Est. Profit Bersih</span>
                <span className="font-heading font-black text-emerald-700 text-lg">{netProfit || "Rp 1.250.000"}</span>
              </div>
            </div>

            {/* Form Weight */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Jumlah Hasil Panen (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Courier Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pilih Mitra Logistik Agrikultur</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCourier("tanikirim")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    courier === "tanikirim"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">TaniKirim Express</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Truk Pendingin (AC)</div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-2">Rp 500.000</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCourier("cargolokal")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    courier === "cargolokal"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">Cargo Lokal Jateng</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Truk Bak Terbuka</div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-2">Rp 380.000</div>
                </button>
              </div>
            </div>

            {/* Protection Insurance info */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
              <span>Dilengkapi Asuransi Kerusakan Komoditas TaniPintar Protect (Ganti rugi 100% jika susut &gt; 5%).</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Konfirmasi & Kirim</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
