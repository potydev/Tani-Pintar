import React, { useState } from "react";
import { History, CheckCircle2, Clock, Truck, FileText, Download, Filter } from "lucide-react";

export function TransactionHistoryPage() {
  const [filterStatus, setFilterStatus] = useState("Semua");

  const transactions = [
    {
      id: "TRX-20260806-01",
      date: "06 Agu 2026",
      buyer: "PT Pasar Induk Cipinang Jaya",
      destination: "Jakarta",
      commodity: "Cabai Merah Besar",
      quantity: "1.000 kg (1 Ton)",
      pricePerKg: "Rp 46.500",
      totalRevenue: "Rp 46.500.000",
      status: "Selesai",
      paymentMethod: "Transfer Bank (BCA)"
    },
    {
      id: "TRX-20260804-02",
      date: "04 Agu 2026",
      buyer: "CV Caringin Agro Mandiri",
      destination: "Bandung",
      commodity: "Cabai Merah Besar",
      quantity: "500 kg",
      pricePerKg: "Rp 45.000",
      totalRevenue: "Rp 22.500.000",
      status: "Selesai",
      paymentMethod: "Tunai (COD)"
    },
    {
      id: "TRX-20260802-03",
      date: "02 Agu 2026",
      buyer: "Koperasi Tani Makmur Johar",
      destination: "Semarang",
      commodity: "Bawang Merah",
      quantity: "750 kg",
      pricePerKg: "Rp 32.000",
      totalRevenue: "Rp 24.000.000",
      status: "Selesai",
      paymentMethod: "Transfer Bank (Mandiri)"
    },
    {
      id: "TRX-20260731-04",
      date: "31 Jul 2026",
      buyer: "UD Serapan Pangan Nusantara",
      destination: "Surabaya",
      commodity: "Beras Medium",
      quantity: "2.000 kg (2 Ton)",
      pricePerKg: "Rp 14.500",
      totalRevenue: "Rp 29.000.000",
      status: "Dalam Pengiriman",
      paymentMethod: "DP 50% (Sisa COD)"
    }
  ];

  const filtered = transactions.filter(t => filterStatus === "Semua" || t.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 rounded-2xl p-6 text-white shadow-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <History size={14} /> Records &amp; Invoices
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            Riwayat Transaksi Penjualan
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            Catatan historis seluruh penjualan hasil panen, status penerimaan pembayaran, dan invoice pengiriman.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Pendapatan Terjual</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">Rp 122.000.000</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Dari 4 transaksi bulan ini</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Volume Terdistribusi</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">4.250 kg (4.25 Ton)</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Ke 4 kota tujuan</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Status Pengiriman Aktif</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">1 Pengiriman</div>
          <div className="text-[11px] text-blue-500 mt-0.5">Surabaya (Dalam Perjalanan)</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter size={16} className="text-slate-400" />
          <span>Status Transaksi:</span>
          {["Semua", "Selesai", "Dalam Pengiriman"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                filterStatus === st ? "bg-emerald-700 text-white border-emerald-700 font-bold" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID Transaksi &amp; Tanggal</th>
                <th className="px-6 py-3">Pembeli &amp; Tujuan</th>
                <th className="px-6 py-3">Komoditas &amp; Volume</th>
                <th className="px-6 py-3">Total Transaksi</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{trx.id}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{trx.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{trx.buyer}</div>
                    <div className="text-[11px] text-slate-500">Tujuan: {trx.destination}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{trx.commodity}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">{trx.quantity} • {trx.pricePerKg}/kg</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-slate-900 text-sm">{trx.totalRevenue}</div>
                    <div className="text-[10px] text-slate-400">{trx.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase ${
                      trx.status === "Selesai" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {trx.status === "Selesai" ? <CheckCircle2 size={12} /> : <Truck size={12} />}
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold">
                      <FileText size={14} className="text-emerald-700" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
