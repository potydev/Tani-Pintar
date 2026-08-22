import React, { useState } from "react";
import { Calculator, Truck, MapPin, DollarSign, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

export function ProfitCalculatorPage() {
  const [tonnage, setTonnage] = useState(1000); // 1,000 kg (1 Ton)
  const [origin, setOrigin] = useState("Cilacap, Jawa Tengah");
  const [destination, setDestination] = useState("Jakarta (Pasar Cipinang)");
  const [vehicle, setVehicle] = useState("Engkel Box (2.5 Ton)");
  const [originPrice, setOriginPrice] = useState(38000);
  const [destPrice, setDestPrice] = useState(46500);

  // Logistics & Cost Rules
  const vehicleCosts = {
    "Pickup L300 (1 Ton)": 450000,
    "Engkel Box (2.5 Ton)": 750000,
    "Fuso Truck (8 Ton)": 1800000
  };

  const shippingCost = vehicleCosts[vehicle] || 750000;
  const packingLaborCost = Math.round(tonnage * 500); // Rp 500/kg packing & labor
  const wastageLossVal = Math.round(tonnage * originPrice * 0.02); // 2% shrinkage loss during transport

  const grossRevenue = tonnage * destPrice;
  const totalCost = (tonnage * originPrice) + shippingCost + packingLaborCost + wastageLossVal;
  const netProfit = grossRevenue - totalCost;
  const roiPct = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Calculator size={14} /> Simulasi Logistik &amp; Keuntungan
        </div>
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
          Kalkulator Simulasi Keuntungan Bersih
        </h1>
        <p className="text-emerald-100 text-sm mt-1">
          Hitung estimasi pendapatan kotor, ongkos kirim armada, biaya penyusutan muatan, dan laba bersih secara presisi sebelum melakukan pengiriman.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 font-heading font-bold text-slate-900 text-lg pb-3 border-b border-slate-100">
            <Truck size={20} className="text-emerald-700" />
            <span>Parameter Pengiriman &amp; Muatan</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi Panen (Asal)</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi Pasar (Tujuan)</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2.5 font-medium"
              >
                <option value="Jakarta (Pasar Cipinang)">Jakarta (Pasar Cipinang) • 390 km</option>
                <option value="Bandung (Pasar Caringin)">Bandung (Pasar Caringin) • 312 km</option>
                <option value="Semarang (Pasar Johar)">Semarang (Pasar Johar) • 180 km</option>
                <option value="Surabaya (Pasar Osowilangun)">Surabaya (Pasar Osowilangun) • 340 km</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kuantitas Panen (kg): <span className="font-bold text-emerald-800">{tonnage.toLocaleString('id-ID')} kg</span>
              </label>
              <input
                type="number"
                value={tonnage}
                onChange={(e) => setTonnage(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2.5 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Armada Transportasi</label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2.5 font-medium"
              >
                <option value="Pickup L300 (1 Ton)">Pickup L300 (Kapasitas 1 Ton)</option>
                <option value="Engkel Box (2.5 Ton)">Engkel Box (Kapasitas 2.5 Ton)</option>
                <option value="Fuso Truck (8 Ton)">Fuso Truck (Kapasitas 8 Ton)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Harga Beli Panen / Modal Asal (per kg)</label>
              <input
                type="number"
                value={originPrice}
                onChange={(e) => setOriginPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2.5 font-semibold text-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Harga Jual Tujuan (per kg)</label>
              <input
                type="number"
                value={destPrice}
                onChange={(e) => setDestPrice(Number(e.target.value))}
                className="w-full bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg p-2.5 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right Financial Calculation Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-md border border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-xs uppercase font-bold text-slate-400">Hasil Simulasi Laba</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-400/30">
                ROI +{roiPct}%
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400">Estimasi Laba Bersih (Net Profit)</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                Rp {netProfit.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Per muatan {tonnage.toLocaleString('id-ID')} kg
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-2 pt-3 border-t border-slate-700 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Pendapatan Kotor (Gross):</span>
                <span className="font-bold text-white">Rp {grossRevenue.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Modal Beli Panen:</span>
                <span>Rp {(tonnage * originPrice).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Ongkir Armada ({vehicle}):</span>
                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Biaya Karung &amp; Buruh:</span>
                <span>Rp {packingLaborCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Est. Susut Muatan (2%):</span>
                <span>Rp {wastageLossVal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
