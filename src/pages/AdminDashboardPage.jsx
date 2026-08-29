import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  User,
  MapPin,
  Sprout,
  FileText,
  CreditCard,
  Building,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from "lucide-react";

export function AdminDashboardPage({ onBackToUserApp }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKtpModal, setSelectedKtpModal] = useState(null);
  const [notification, setNotification] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/farmers");
      const data = await res.json();
      if (data.success && data.requests) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Error fetching admin requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectCategory, setRejectCategory] = useState("Foto KTP tidak jelas / terpotong");
  const [rejectDetailReason, setRejectDetailReason] = useState("");

  const handleApprove = async (reqItem) => {
    try {
      const res = await fetch("/api/admin/approve-farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: reqItem.email, req_id: reqItem.id })
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.map(r => r.id === reqItem.id ? { ...r, verification_status: "approved" } : r));
        setNotification(`✅ Berhasil menyetujui verifikasi petani: ${reqItem.full_name}`);
        setTimeout(() => setNotification(""), 4000);
      }
    } catch (err) {
      console.error("Error approving farmer:", err);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalItem) return;
    const finalReason = `${rejectCategory}${rejectDetailReason ? `: ${rejectDetailReason}` : ""}`;
    try {
      const res = await fetch("/api/admin/reject-farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: rejectModalItem.email,
          req_id: rejectModalItem.id,
          reason: finalReason
        })
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.map(r => r.id === rejectModalItem.id ? { ...r, verification_status: "rejected", rejection_reason: finalReason } : r));
        setNotification(`❌ Pengajuan verifikasi ${rejectModalItem.full_name} ditolak.`);
        setTimeout(() => setNotification(""), 5000);
        setRejectModalItem(null);
        setRejectDetailReason("");
      }
    } catch (err) {
      console.error("Error rejecting farmer:", err);
    }
  };

  // Metrics
  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.verification_status === "pending").length;
  const approvedCount = requests.filter(r => r.verification_status === "approved").length;
  const rejectedCount = requests.filter(r => r.verification_status === "rejected").length;

  // Filter & Search Logic
  const filteredRequests = requests.filter(item => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "pending" && item.verification_status === "pending") ||
      (activeFilter === "approved" && item.verification_status === "approved") ||
      (activeFilter === "rejected" && item.verification_status === "rejected");

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.full_name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.nik?.includes(query) ||
      item.farm_location?.toLowerCase().includes(query) ||
      item.primary_commodity?.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToUserApp}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} /> Kembali ke Aplikasi
          </button>
          <div className="h-6 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white leading-tight">
                TaniPintar Admin Portal
              </h1>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Verifikasi Petani &amp; Kelompok Tani
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl text-xs text-emerald-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Super Admin Active
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Toast Alert */}
        {notification && (
          <div className="p-4 bg-emerald-900/80 border border-emerald-500 text-emerald-100 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-300">
            <span>{notification}</span>
            <button onClick={() => setNotification("")} className="text-emerald-400 hover:text-white">
              <XCircle size={16} />
            </button>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengajuan</div>
            <div className="text-2xl font-black text-white mt-1">{totalRequests}</div>
            <div className="text-[10px] text-slate-500 mt-1">Registrasi Verifikasi</div>
          </div>

          <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-2xl">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Clock size={14} /> Menunggu Verifikasi
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</div>
            <div className="text-[10px] text-amber-400/70 mt-1">Perlu Peninjauan Admin</div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-2xl">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={14} /> Petani Terverifikasi
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">{approvedCount}</div>
            <div className="text-[10px] text-emerald-400/70 mt-1">Akses Penjualan Aktif</div>
          </div>

          <div className="bg-rose-950/30 border border-rose-800/40 p-4 rounded-2xl">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <XCircle size={14} /> Pengajuan Ditolak
            </div>
            <div className="text-2xl font-black text-rose-300 mt-1">{rejectedCount}</div>
            <div className="text-[10px] text-rose-400/70 mt-1">Dokumen Tidak Sesuai</div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "all" ? "bg-emerald-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Semua ({totalRequests})
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === "pending" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-amber-400 hover:text-amber-300"
              }`}
            >
              <Clock size={13} /> Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveFilter("approved")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === "approved" ? "bg-emerald-500 text-slate-950 shadow-md" : "bg-slate-800 text-emerald-400 hover:text-emerald-300"
              }`}
            >
              <CheckCircle2 size={13} /> Disetujui ({approvedCount})
            </button>
            <button
              onClick={() => setActiveFilter("rejected")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === "rejected" ? "bg-rose-500 text-slate-950 shadow-md" : "bg-slate-800 text-rose-400 hover:text-rose-300"
              }`}
            >
              <XCircle size={13} /> Ditolak ({rejectedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari NIK, Nama, Lokasi, Komoditas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Request Cards / Table */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center space-y-2">
              <Sprout size={36} className="mx-auto text-slate-600" />
              <h3 className="font-bold text-slate-300 text-sm">Tidak Ada Pengajuan Verifikasi</h3>
              <p className="text-xs text-slate-500">Tidak ada data yang sesuai dengan pencarian atau filter pilihan Anda.</p>
            </div>
          ) : (
            filteredRequests.map((item) => {
              const isPending = item.verification_status === "pending";
              const isApproved = item.verification_status === "approved";
              const isRejected = item.verification_status === "rejected";

              return (
                <div
                  key={item.id}
                  className="bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-5 sm:p-6 transition-all space-y-4"
                >
                  {/* Top Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-white">{item.full_name}</h3>
                          <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-400">
                            {item.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{item.email}</span> &bull; <span>{item.phone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-3">
                      {isPending && (
                        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold px-3 py-1 rounded-xl">
                          <Clock size={14} /> Menunggu Konfirmasi Admin
                        </div>
                      )}
                      {isApproved && (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-xl">
                          <CheckCircle2 size={14} /> Terverifikasi (Approved)
                        </div>
                      )}
                      {isRejected && (
                        <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold px-3 py-1 rounded-xl">
                          <XCircle size={14} /> Pengajuan Ditolak
                        </div>
                      )}

                      {/* Action Buttons */}
                      {isPending && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(item)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 size={15} /> Setujui
                          </button>
                          <button
                            onClick={() => setRejectModalItem(item)}
                            className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1"
                          >
                            <XCircle size={15} /> Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5 font-semibold">NIK KTP (16 Digit)</span>
                      <span className="font-extrabold text-slate-200 tracking-wider font-mono">{item.nik || "-"}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 font-semibold">Wilayah &amp; Komoditas</span>
                      <span className="font-extrabold text-emerald-400">{item.farm_location}</span>
                      <span className="block text-[11px] text-slate-300">{item.primary_commodity}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 font-semibold">Lahan &amp; Kapasitas</span>
                      <span className="font-bold text-slate-200">{item.land_size} ({item.land_type || "Milik Sendiri"})</span>
                      <span className="block text-[11px] text-slate-400">Panen: {item.harvest_capacity || "1-5 Ton"}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 font-semibold">Kelompok Tani / Poktan</span>
                      <span className="font-bold text-slate-200">{item.group_name || "-"}</span>
                      <span className="block text-[11px] text-slate-400">{item.bank_name}: {item.account_number}</span>
                    </div>
                  </div>

                  {/* Document & KTP Preview Bar */}
                  <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-emerald-400" />
                      <span>Dokumen KTP Terlampir:</span>
                      <button
                        onClick={() => setSelectedKtpModal(item.ktp_image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80")}
                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                      >
                        Pratinjau KTP <ExternalLink size={12} />
                      </button>
                    </div>

                    {isRejected && item.rejection_reason && (
                      <div className="text-[11px] text-rose-300 bg-rose-950/40 border border-rose-800/40 px-2.5 py-1 rounded-lg">
                        <strong>Alasan Penolakan:</strong> {item.rejection_reason}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500">
                      Dikirim pada: {new Date(item.submitted_at).toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Image Preview Modal */}
      {selectedKtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-lg w-full space-y-4 relative">
            <button
              onClick={() => setSelectedKtpModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <XCircle size={22} />
            </button>
            <h3 className="font-extrabold text-white text-base">Pratinjau Dokumen KTP</h3>
            <img src={selectedKtpModal} alt="KTP Preview" className="w-full h-56 object-cover rounded-2xl border border-slate-700 shadow-md" />
            <button
              onClick={() => setSelectedKtpModal(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-md w-full space-y-4 relative">
            <button
              onClick={() => setRejectModalItem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <XCircle size={22} />
            </button>

            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <XCircle size={22} />
            </div>

            <h3 className="font-extrabold text-white text-lg">Tolak Pengajuan Verifikasi</h3>
            <p className="text-xs text-slate-400">
              Pilih alasan spesifik penolakan untuk dikirimkan kepada <strong>{rejectModalItem.full_name}</strong>.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori Alasan Penolakan *</label>
                <select
                  value={rejectCategory}
                  onChange={(e) => setRejectCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Foto KTP tidak jelas / terpotong">Foto KTP tidak jelas / terpotong</option>
                  <option value="NIK tidak valid / format salah">NIK tidak valid / format salah</option>
                  <option value="Data lokasi lahan tidak sesuai">Data lokasi lahan tidak sesuai</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={3}
                  value={rejectDetailReason}
                  onChange={(e) => setRejectDetailReason(e.target.value)}
                  placeholder="Contoh: Mohon foto KTP diunggah ulang dengan pencahayaan terang."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRejectModalItem(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectCategory}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
