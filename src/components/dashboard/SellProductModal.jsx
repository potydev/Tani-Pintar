import React, { useState } from "react";
import {
  X,
  Plus,
  Leaf,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Tag,
  DollarSign,
  Package,
  Calendar,
  MapPin,
  FileText
} from "lucide-react";
import { createProduct } from "../../data/marketplaceData";

export function SellProductModal({ isOpen, onClose, user, onSuccess }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("cabai");
  const [grade, setGrade] = useState("Grade A");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minOrder, setMinOrder] = useState("50");
  const [location, setLocation] = useState(user?.farm_location || "Surabaya, Jawa Timur");
  const [description, setDescription] = useState("");
  const [organic, setOrganic] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const samplePresets = [
    { label: "Cabai Merah", url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80" },
    { label: "Cabai Rawit", url: "https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&w=800&q=80" },
    { label: "Bawang Merah", url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80" },
    { label: "Sayur Hijau", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80" },
    { label: "Beras / Padi", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80" },
    { label: "Tomat Segar", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name || !price || !stock) {
      setError("Nama komoditas, harga per kg, dan stok wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        seller_id: user?.id,
        name,
        category,
        grade,
        price: parseFloat(price),
        unit: "kg",
        min_order: parseInt(minOrder) || 50,
        stock: parseInt(stock),
        location: location || user?.farm_location || "Surabaya, Jawa Timur",
        description,
        organic,
        image_url: imageUrl,
        harvest_date: harvestDate,
        tags: [category, grade, organic ? "Organik" : "Konvensional"]
      };

      const res = await createProduct(payload);
      if (res.success) {
        setSuccessMsg("✅ Berhasil memasang komoditas panen ke Marketplace!");
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data);
          onClose();
        }, 1500);
      } else {
        setError(res.error || "Gagal memasang komoditas.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi saat memasang produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#081f13] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md">
              <Leaf size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Mulai Menjual Hasil Panen</h2>
              <p className="text-xs text-emerald-100/70">
                Pasang komoditas Anda ke etalase Marketplace TaniPintar agar dapat dibeli langsung oleh pembeli se-Indonesia.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 tp-scrollbar">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Komoditas Panen *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Cabai Merah Besar Segar Panen Perkebunan Cilacap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Category & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Komoditas</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="cabai">🌶️ Cabai</option>
                <option value="bawang">🧅 Bawang</option>
                <option value="sayuran">🥬 Sayuran Segar</option>
                <option value="buah">🍎 Buah-buahan</option>
                <option value="padi">🌾 Beras & Padi</option>
                <option value="rempah">🫚 Rempah & Herbal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kualitas / Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="Grade A">Grade A (Kualitas Super / Ekspor)</option>
                <option value="Grade B">Grade B (Kualitas Pasar Induk)</option>
                <option value="Grade C">Grade C (Kualitas Olahan/Industri)</option>
              </select>
            </div>
          </div>

          {/* Price, Stock, Min Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Harga Jual (Rp / kg) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  required
                  placeholder="38000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Stok (kg) *</label>
              <input
                type="number"
                required
                placeholder="1000"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min. Pembelian (kg)</label>
              <input
                type="number"
                placeholder="50"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Location & Harvest Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Asal Panen / Kebun</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Panen / Kesiapan</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Preset Images */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Gambar Sampul Cepat</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {samplePresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all ${
                    imageUrl === p.url
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Atau tempel URL gambar custom (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 mt-1"
            />
          </div>

          {/* Description & Organic check */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi &amp; Keunggulan Panen</label>
            <textarea
              rows={3}
              placeholder="Jelaskan kondisi panen, tingkat kesegaran, kebersihan sortir, dan packing pengiriman..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="organicCheck"
              checked={organic}
              onChange={(e) => setOrganic(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="organicCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
              🌱 Hasil Panen Bebas Pestisida / Organik Bersertifikat
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {loading ? "Memproses..." : "Pasang ke Marketplace Now"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
