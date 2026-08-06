import {
  Target,
  TrendingUp,
  ShoppingCart,
  Wallet,
  PackageCheck
} from "lucide-react";

export const TICKER_DATA = [
  { name: "Cabai Merah", price: "Rp 38.000/kg", change: 6.2, up: true },
  { name: "Bawang Merah", price: "Rp 29.500/kg", change: -2.1, up: false },
  { name: "Tomat Buah", price: "Rp 12.000/kg", change: 3.4, up: true },
  { name: "Bawang Putih", price: "Rp 41.200/kg", change: 1.1, up: true },
  { name: "Cabai Rawit", price: "Rp 52.000/kg", change: -4.6, up: false },
  { name: "Kentang Granola", price: "Rp 15.800/kg", change: 0.8, up: true },
];

export const METRICS_DATA = [
  {
    title: "Peluang Aktif Hari Ini",
    value: "3",
    unit: "peluang",
    change: "↑ 2 dari kemarin",
    isUp: true,
    icon: Target,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A"
  },
  {
    title: "Prediksi Harga (5 Hari)",
    value: "↑ 6.2%",
    unit: "",
    change: "Cabai Merah",
    isUp: true,
    icon: TrendingUp,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED"
  },
  {
    title: "Permintaan Tinggi",
    value: "Purwokerto",
    unit: "",
    change: "↑ 18% dari kemarin",
    isUp: true,
    icon: ShoppingCart,
    iconBg: "#FFEDD5",
    iconColor: "#EA580C"
  },
  {
    title: "Estimasi Keuntungan",
    value: "Rp 12.450.000",
    unit: "",
    change: "Jika jual ke Bandung",
    isUp: true,
    icon: Wallet,
    iconBg: "#DBEAFE",
    iconColor: "#2563EB"
  },
  {
    title: "Pesanan Masuk",
    value: "5",
    unit: "pesanan",
    change: "pesanan baru",
    isUp: true,
    icon: PackageCheck,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A"
  }
];

export const RECOMMENDATION_FEATURED = {
  rank: 1,
  city: "Bandung",
  badge: "Sangat Direkomendasikan",
  badgeType: "green",
  aiReasons: [
    "Harga 9.2% lebih tinggi dari lokasi Anda",
    "Permintaan tinggi dalam 3 hari ke depan",
    "Persaingan rendah",
    "Keuntungan bersih paling tinggi"
  ],
  originCity: "Cilacap (Anda)",
  originPrice: "Rp 38.000",
  destCity: "Bandung",
  destPrice: "Rp 41.500",
  diffPercent: "↑ 9.2% Lebih tinggi",
  netProfit: "Rp 1.250.000",
  netProfitQty: "per 500 kg",
  marginDiff: "Rp 1.750.000",
  shippingCost: "Rp 500.000",
  shippingInfo: {
    distance: "312 km",
    cost: "Rp 500.000",
    duration: "8-10 jam"
  }
};

export const RECOMMENDATIONS_COMPACT = [
  {
    rank: 2,
    city: "Purwokerto",
    badge: "Direkomendasikan",
    badgeType: "yellow",
    originPrice: "Rp 38.000 /kg",
    destPrice: "Rp 40.000 /kg",
    diffPercent: "↑ 5.3%",
    netProfit: "Rp 650.000"
  },
  {
    rank: 3,
    city: "Yogyakarta",
    badge: "Direkomendasikan",
    badgeType: "yellow",
    originPrice: "Rp 38.000 /kg",
    destPrice: "Rp 39.200 /kg",
    diffPercent: "↑ 3.2%",
    netProfit: "Rp 420.000"
  }
];

export const PRICE_TREND_DATA = [
  { date: "23 Jul", aktual: 32000, prediksi: null },
  { date: "24 Jul", aktual: 33500, prediksi: null },
  { date: "25 Jul", aktual: 31800, prediksi: null },
  { date: "26 Jul", aktual: 34200, prediksi: null },
  { date: "27 Jul", aktual: 36000, prediksi: null },
  { date: "28 Jul", aktual: 37500, prediksi: 37500 },
  { date: "29 Jul", aktual: 38000, prediksi: 39500 },
  { date: "30 Jul", aktual: null, prediksi: 41200 },
  { date: "31 Jul", aktual: null, prediksi: 42500 }
];

export const DEMAND_REGION_DATA = [
  { city: "Purwokerto", status: "Tinggi", percent: "↑ 18%", val: 88, color: "#16A34A" },
  { city: "Bandung", status: "Tinggi", percent: "↑ 12%", val: 74, color: "#16A34A" },
  { city: "Yogyakarta", status: "Sedang", percent: "↑ 6%", val: 52, color: "#EAB308" },
  { city: "Semarang", status: "Sedang", percent: "↑ 3%", val: 46, color: "#EAB308" },
  { city: "Jakarta", status: "Rendah", percent: "↓ 2%", val: 24, color: "#EF4444" }
];

export const RECENT_ORDERS_DATA = [
  {
    id: "P.00125",
    status: "Baru",
    statusType: "green",
    commodity: "500 kg Cabai Merah",
    location: "Bandung, Jabar",
    price: "Rp 41.000 /kg",
    time: "29 Jul 2026, 10:30",
    actionState: "Menunggu Konfirmasi"
  },
  {
    id: "P.00124",
    status: "Baru",
    statusType: "green",
    commodity: "300 kg Cabai Merah",
    location: "Purwokerto, Jateng",
    price: "Rp 39.500 /kg",
    time: "29 Jul 2026, 09:15",
    actionState: "Menunggu Konfirmasi"
  },
  {
    id: "P.00123",
    status: "Dikemas",
    statusType: "yellow",
    commodity: "200 kg Cabai Merah",
    location: "Yogyakarta, DIY",
    price: "Rp 39.000 /kg",
    time: "29 Jul 2026, 08:40",
    actionState: "Siap Kirim"
  }
];

export const QUICK_CHAT_PROMPTS = [
  "Ke mana saya sebaiknya menjual cabai hari ini?",
  "Kapan waktu terbaik untuk menjual cabai?",
  "Berapa harga yang sebaiknya saya pasang?",
  "Hitung keuntungan jika kirim ke Bandung",
  "Prediksi harga cabai minggu depan"
];
