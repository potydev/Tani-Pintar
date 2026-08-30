import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft, CheckCircle2, MapPin, Phone, User, Truck, CreditCard,
  ShieldCheck, AlertCircle, ShoppingBag, Leaf, FileText
} from "lucide-react";
import { fetchProductDetail, createOrder } from "../data/marketplaceData";

export function CheckoutPage({ isLoggedIn }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQty = parseInt(searchParams.get("qty") || "50");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState("");

  // User details
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    // Check auth
    const savedUser = localStorage.getItem("tanipintar_user");
    if (!savedUser && !isLoggedIn) {
      const checkoutUrl = `/checkout/${id}?qty=${initialQty}`;
      navigate(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }

    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setBuyerPhone(u.phone || "");
      } catch (e) {}
    }

    async function loadProduct() {
      setLoading(true);
      const res = await fetchProductDetail(id);
      if (res.success && res.data) {
        setProduct(res.data);
      } else {
        // Fallback fetch all products
        const allRes = await fetch("/api/marketplace/products");
        const json = await allRes.json();
        if (json.success && json.data) {
          const found = json.data.find((p) => String(p.id) === String(id));
          if (found) setProduct(found);
        }
      }
      setLoading(false);
    }

    loadProduct();
  }, [id, isLoggedIn, navigate, initialQty]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!shippingAddress.trim()) {
      setError("Alamat lengkap pengiriman wajib diisi.");
      return;
    }
    if (!buyerPhone.trim()) {
      setError("Nomor WhatsApp/HP wajib diisi.");
      return;
    }

    setSubmitting(true);
    const orderData = {
      buyer_id: user ? user.id : null,
      product_id: parseInt(id),
      quantity: initialQty,
      shipping_address: shippingAddress,
      buyer_phone: buyerPhone,
      notes: notes,
      payment_method: paymentMethod
    };

    const res = await createOrder(orderData);
    setSubmitting(false);

    if (res.success) {
      setOrderSuccess(res.data || res);
    } else {
      setError(res.error || "Gagal membuat pesanan. Silakan coba lagi.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Menyiapkan Lembar Pesanan...</span>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} className="text-emerald-600" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Pesanan Berhasil Dibuat!</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Terima kasih telah berbelanja di TaniPintar Marketplace. Penjual akan segera menghubungi nomor WhatsApp Anda untuk konfirmasi pengiriman.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Nomor Pesanan:</span>
              <span className="font-mono font-bold text-slate-900">#TP-{orderSuccess.order?.id || Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Komoditas:</span>
              <span className="font-bold text-slate-900">{product ? product.name : "Hasil Tani"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jumlah:</span>
              <span className="font-bold text-slate-900">{initialQty} {product?.unit || "kg"}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm text-emerald-800">
              <span>Total Pembayaran:</span>
              <span>Rp {((product?.price || 0) * initialQty).toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              to="/dashboard"
              className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md block text-center"
            >
              📦 Lacak di Pesanan Saya
            </Link>
            <Link
              to="/marketplace"
              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all block text-center"
            >
              Belanja Lagi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = (product?.price || 0) * initialQty;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-lg">TaniPintar</span>
          </Link>

          <Link
            to={`/marketplace/product/${id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700"
          >
            <ArrowLeft size={14} /> Batalkan & Kembali
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Konfirmasi Pesanan & Pengiriman</h1>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Left Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Buyer & Delivery Info */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin size={16} className="text-emerald-700" /> Alamat & Kontak Pengiriman
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pemesan</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    disabled
                    value={user?.full_name || "Pembeli TaniPintar"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / HP Aktif *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap Pengiriman *</label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Jalan, Nomor Rumah, RT/RW, Kecamatan, Kota, Kode Pos"
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Pengiriman (Opsional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Titip ke satpam / Kirim sebelum jam 12 siang"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CreditCard size={16} className="text-emerald-700" /> Metode Pembayaran
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <label className={`border rounded-2xl p-4 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === "cod" ? "border-emerald-600 bg-emerald-50/50 shadow-sm" : "border-slate-200 bg-white"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-xs text-slate-900">COD (Bayar di Tempat)</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-emerald-700"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">Bayar langsung saat barang sampai di lokasi.</span>
                </label>

                <label className={`border rounded-2xl p-4 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === "transfer" ? "border-emerald-600 bg-emerald-50/50 shadow-sm" : "border-slate-200 bg-white"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-xs text-slate-900">Transfer Bank / QRIS</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "transfer"}
                      onChange={() => setPaymentMethod("transfer")}
                      className="accent-emerald-700"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">Transfer bank resmi sesudah konfirmasi pesanan.</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShoppingBag size={16} className="text-emerald-700" /> Rincian Produk
              </h2>

              {product && (
                <div className="flex gap-3 py-2 border-b border-slate-100">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80"}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                  />
                  <div className="flex-1">
                    <span className="font-extrabold text-xs text-slate-900 block truncate">{product.name}</span>
                    <span className="text-[11px] text-slate-500 block">Petani: {product.farmer_name}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-bold text-slate-700">{initialQty} {product.unit || "kg"} x Rp {Number(product.price).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Produk:</span>
                  <span className="font-semibold text-slate-900">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan Platform:</span>
                  <span className="font-semibold text-emerald-700">Gratis (Rp 0)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Logistik:</span>
                  <span className="font-semibold text-slate-900">Ditentukan saat konfirmasi</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-extrabold text-emerald-800">
                  <span>Total Tagihan:</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <span>Mengirim Pesanan...</span>
                ) : (
                  <span>Konfirmasi & Buat Pesanan Now</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-2">
                <ShieldCheck size={12} className="text-emerald-600" /> Transaksi Terproteksi Sistem TaniPintar
              </div>

            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
