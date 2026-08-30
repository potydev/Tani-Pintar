import liveData from "../data/harga_pangan_realtime.json";

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined' && window.location.port === '3000') {
    return 'http://localhost:5000/api';
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export function getLiveCommodityPrices() {
  if (!liveData || !liveData.commodities) {
    return null;
  }
  return liveData.commodities;
}

export function getLiveTickerItems() {
  const commodities = getLiveCommodityPrices();
  if (!commodities) return [];

  const items = [];
  for (const [name, info] of Object.entries(commodities)) {
    const avg = info.national_avg;
    const firstProv = info.prices && info.prices[0];
    const change = firstProv ? firstProv.percentage_change : 0;
    items.push({
      name: name,
      price: `Rp ${avg.toLocaleString('id-ID')}/kg`,
      change: change,
      up: change >= 0
    });
  }
  return items;
}

export function getRegionalDemandData() {
  const commodities = getLiveCommodityPrices();
  if (!commodities) return [];

  const cabaiData = commodities["Cabai Merah"] || commodities["Cabai Merah Besar"] || commodities["Cabai Merah Keriting"];
  if (!cabaiData) return [];

  const cabaiPrices = cabaiData.prices || [];
  const selectedProvinces = ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur"];

  return cabaiPrices
    .filter(p => selectedProvinces.includes(p.province))
    .map(p => ({
      city: p.province,
      price: p.price,
      status: p.percentage_change > 2 ? "Tinggi" : p.percentage_change >= 0 ? "Sedang" : "Rendah",
      percent: `${p.percentage_change >= 0 ? '↑' : '↓'} ${Math.abs(p.percentage_change)}%`,
      val: Math.min(100, Math.max(20, Math.round((p.price / 80000) * 100))),
      color: p.percentage_change > 2 ? "#16A34A" : p.percentage_change >= 0 ? "#EAB308" : "#EF4444"
    }));
}

// ASYNC BACKEND API FETCHERS (MySQL Integration)

export async function fetchPriceHistory(commodity = 'Cabai Merah', origin = 'Cilacap, Jateng') {
  try {
    const res = await fetch(`${API_BASE_URL}/prices/history?commodity=${encodeURIComponent(commodity)}&origin=${encodeURIComponent(origin)}`);
    if (!res.ok) throw new Error("API Network response was not ok");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Backend API not reachable, using local fallback history.", err);
    return null;
  }
}

export async function fetchRegionalDemand(commodity = 'Cabai Merah') {
  try {
    const res = await fetch(`${API_BASE_URL}/demand/regional?commodity=${encodeURIComponent(commodity)}`);
    if (!res.ok) throw new Error("API Network response was not ok");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Backend API not reachable, using local fallback demand.", err);
    return getRegionalDemandData();
  }
}

export async function fetchAvailableDates() {
  try {
    const res = await fetch(`${API_BASE_URL}/dates`);
    if (!res.ok) throw new Error("API response not ok");
    const json = await res.json();
    if (json.data && json.data.length > 0) return json.data;
  } catch (err) {
    console.warn("Backend API not reachable for dates, using dynamic generator.", err);
  }
  
  // Dynamic fallback generator from current date
  const monthsMap = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  const dynamicDates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = `${d.getDate()} ${monthsMap[d.getMonth()]} ${d.getFullYear()}`;
    const isoDate = d.toISOString().split('T')[0];
    dynamicDates.push({
      date: isoDate,
      isoDate: isoDate,
      label: i === 0 ? `${label} (Terbaru)` : label
    });
  }
  return dynamicDates;
}

export async function fetchAIRecommendations(origin = 'Cilacap, Jateng', commodity = 'Cabai Merah', date = null) {
  try {
    let url = `${API_BASE_URL}/recommendations?origin=${encodeURIComponent(origin)}&commodity=${encodeURIComponent(commodity)}`;
    if (date) url += `&date=${encodeURIComponent(date)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API Network response was not ok");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Backend API not reachable, using local fallback recommendations.", err);
    return null;
  }
}

