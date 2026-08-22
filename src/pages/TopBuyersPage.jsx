import React, { useState } from "react";
import { ShoppingCart, Star, MapPin, CheckCircle2, PhoneCall, ShieldCheck, ArrowUpRight, Search } from "lucide-react";

export function TopBuyersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const buyers = [
    {
      id: 1,
      name: "PT Pasar Induk Cipinang Jaya",
      category: "Pasar Induk / Agregator",
      location: "Jakarta Timur, DKI Jakarta",
      commodityOffer: "Cabai Merah Besar & Beras",
      buyingPrice: "Rp 46.500 / kg",
      minQty: "1.000 kg (1 Ton)",
      rating: 4.9,
      reviews: 128,
      verified: true,
      phone: "+62 812-3456-7890",
      notes: "Pembayaran Tunai saat timbang barang (COD/Transfer Langsung)."
    },
    {
      id: 2,
      name: "CV Caringin Agro Mandiri",
      category: "Distributor Regional",
      location: "Bandung, Jawa Barat",
      commodityOffer: "Cabai Merah & Bawang Merah",
      buyingPrice: "Rp 45.000 / kg",
      minQty: "500 kg",
      rating: 4.8,
      reviews: 94,
      verified: true,
      phone: "+62 813-9876-5432",
      notes: "Menerima barang setiap hari kerja pukul 04:00 - 10:00 WIB."
    },
    {
      id: 3,
      name: "Koperasi Tani Makmur Johar",
      category: "Koperasi Pangan",
      location: "Semarang, Jawa Tengah",
      commodityOffer: "Cabai Rawit & Bawang Merah",
      buyingPrice: "Rp 42.000 / kg",
      minQty: "300 kg",
      rating: 4.7,
      reviews: 62,
      verified: true,
      phone: "+62 811-2233-4455",
      notes: "Diskon Subsidi Ongkir untuk pengiriman di atas 2 ton."
    },
    {
      id: 4,
      name: "UD Serapan Pangan Nusantara",
      category: "Pengepul Skala Besar",
      location: "Surabaya, Jawa Timur",
      commodityOffer: "Beras Medium & Cabai Merah",
      buyingPrice: "Rp 44.200 / kg",
      minQty: "2.000 kg (2 Ton)",
      rating: 4.9,
      reviews: 156,
      verified: true,
      phone: "+62 815-6677-8899",
      notes: "Kontrak pembelian jangka panjang (Bulanan) tersedia."
    }
  ];

  const filteredBuyers = buyers.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.location.toLowerCase().includes(search.toLowerCase()) ||
    b.commodityOffer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <ShieldCheck size={14} /> Terverifikasi Sistem TaniPintar
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            Direktori Pembeli &amp; Agregator Terbaik
          </h1>
          <p className="text-teal-100 text-sm mt-1">
            Hubungkan hasil panen Anda langsung dengan pembeli terpercaya, distributor besar, dan pasar induk dengan jaminan pembayaran tepat waktu.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pembeli, wilayah, atau komoditas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Filter:</span>
          {["Semua", "Pasar Induk", "Distributor", "Koperasi"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                category === cat ? "bg-emerald-700 text-white border-emerald-700 font-bold" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Buyers Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredBuyers.map((buyer) => (
          <div key={buyer.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-lg text-slate-900">{buyer.name}</h3>
                    {buyer.verified && (
                      <span title="Pembeli Terverifikasi">
                        <CheckCircle2 size={18} className="text-emerald-600 fill-emerald-100" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-slate-400" /> {buyer.location}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold justify-end">
                    <Star size={14} className="fill-amber-400 text-amber-400" /> {buyer.rating}
                  </div>
                  <div className="text-[10px] text-slate-400">({buyer.reviews} Transaksi)</div>
                </div>
              </div>

              {/* Offer Details Card */}
              <div className="mt-4 p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Penawaran Harga Beli</div>
                  <div className="font-extrabold text-emerald-800 text-base mt-0.5">{buyer.buyingPrice}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Kuantitas Minimal</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{buyer.minQty}</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div><span className="font-semibold text-slate-700">Komoditas yang Dicari:</span> {buyer.commodityOffer}</div>
                <div className="text-slate-500 italic">"{buyer.notes}"</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <a
                href={`https://wa.me/${buyer.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <PhoneCall size={14} />
                <span>Hubungi via WhatsApp</span>
              </a>
              <button className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                <span>Profil</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
