import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Loader2,
  RefreshCw,
  ShoppingBag,
  DollarSign
} from "lucide-react";

export function OrdersManagementPage({ user }) {
  const [activeTab, setActiveTab] = useState("buyer"); // 'buyer' | 'seller'
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const buyerIdParam = user?.id ? `?buyer_id=${user.id}` : "";
      const res = await fetch(`/api/marketplace/orders/my-orders${buyerIdParam}`);
      const json = await res.json();
      if (json.success && json.data) {
        setBuyerOrders(json.data.buyerOrders || []);
        setSellerOrders(json.data.sellerOrders || []);
      }
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`✅ Status pesanan #${orderId} diubah menjadi: ${newStatus}`);
        setTimeout(() => setToastMsg(""), 4000);
        fetchOrders();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Diproses":
      case "Diproses / Dikemas":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">📦 Sedang Dikemas</span>;
      case "Siap Kirim":
      case "Siap Kirim / Dikirim":
      case "Dalam Pengiriman":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">🚚 Dalam Pengiriman</span>;
      case "Selesai":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Selesai</span>;
      case "Menunggu Konfirmasi":
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">⏳ Menunggu Konfirmasi</span>;
    }
  };

  const extractPhone = (addressStr) => {
    if (!addressStr) return "";
    const match = addressStr.match(/HP:\s*([0-9+]+)/);
    return match ? match[1] : "";
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Manajemen Transaksi &amp; Pesanan</h1>
            <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
              Marketplace Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status pengiriman hasil panen yang Anda beli atau kelola pesanan masuk dari pembeli komoditas Anda.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between animate-in fade-in">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("buyer")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "buyer"
              ? "bg-white text-emerald-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShoppingBag size={14} />
          <span>Pesanan Saya (Belanjaan)</span>
          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-extrabold">
            {buyerOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("seller")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "seller"
              ? "bg-white text-emerald-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Package size={14} />
          <span>Pesanan Masuk (Penjualan)</span>
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-extrabold">
            {sellerOrders.length}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center flex flex-col items-center justify-center">
          <Loader2 size={32} className="animate-spin text-emerald-700 mb-3" />
          <span className="text-xs font-bold text-slate-500">Memuat Riwayat Pesanan...</span>
        </div>
      ) : activeTab === "buyer" ? (
        /* TAB 1: BUYER ORDERS */
        buyerOrders.length > 0 ? (
          <div className="space-y-4">
            {buyerOrders.map((order) => {
              const prod = order.product || {};
              return (
                <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-400">#TP-{order.id}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> {new Date(order.created_at || Date.now()).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={prod.image_url || "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=200&q=80"}
                        alt={prod.name || "Komoditas"}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 mb-1">{prod.name || "Hasil Panen"}</h4>
                        <div className="text-xs text-slate-500">
                          Penjual: <strong className="text-slate-700">{prod.farmer_name || "Petani Binaan"}</strong> ({prod.location || "Nusantara"})
                        </div>
                        <div className="text-xs font-semibold text-slate-700 mt-1">
                          {order.quantity} {prod.unit || "kg"} x Rp {Number(prod.price || order.total_price / order.quantity).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>

                    <div className="text-right bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
                      <div className="text-[11px] text-slate-400 font-semibold">Total Pembayaran</div>
                      <div className="text-lg font-extrabold text-emerald-800">
                        Rp {Number(order.total_price).toLocaleString("id-ID")}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Metode: <strong>{order.payment_method || "COD / Transfer"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">Alamat Pengiriman: {order.shipping_address}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Belum Ada Riwayat Belanja</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Anda belum melakukan pembelian komoditas hasil tani. Jelajahi katalog marketplace kami untuk belanja langsung dari petani.
            </p>
          </div>
        )
      ) : (
        /* TAB 2: SELLER ORDERS */
        sellerOrders.length > 0 ? (
          <div className="space-y-4">
            {sellerOrders.map((order) => {
              const prod = order.product || {};
              const buyerPhone = extractPhone(order.shipping_address);
              return (
                <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-400">#ORDER-{order.id}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> {new Date(order.created_at || Date.now()).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-6 flex items-center gap-4">
                      <img
                        src={prod.image_url || "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=200&q=80"}
                        alt={prod.name || "Komoditas"}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 mb-1">{prod.name || "Komoditas Hasil Panen"}</h4>
                        <div className="text-xs text-slate-500">
                          Jumlah: <strong className="text-slate-800">{order.quantity} {prod.unit || "kg"}</strong>
                        </div>
                        <div className="text-xs font-bold text-emerald-800 mt-1">
                          Total: Rp {Number(order.total_price).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
                      {buyerPhone && (
                        <a
                          href={`https://wa.me/${buyerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <MessageCircle size={14} className="text-emerald-700" />
                          <span>Hubungi Pembeli via WA</span>
                        </a>
                      )}

                      <select
                        disabled={updatingId === order.id}
                        value={order.status || "Menunggu Konfirmasi"}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Menunggu Konfirmasi">⏳ Menunggu Konfirmasi</option>
                        <option value="Diproses / Dikemas">📦 Diproses / Dikemas</option>
                        <option value="Siap Kirim / Dikirim">🚚 Siap Kirim / Dikirim</option>
                        <option value="Selesai">✓ Selesai</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span>{order.shipping_address}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Belum Ada Pesanan Masuk</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Ketika ada pembeli yang memesan komoditas panen dari etalase Anda, rincian pengiriman dan kontak pembeli akan muncul di sini.
            </p>
          </div>
        )
      )}

    </div>
  );
}
