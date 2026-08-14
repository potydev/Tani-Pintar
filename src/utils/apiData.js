import liveData from "../data/harga_pangan_realtime.json";

const API_BASE_URL = "http://localhost:5000/api";

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

export async function fetchPriceHistory(commodity = 'Cabai Merah') {
  try {
    const res = await fetch(`${API_BASE_URL}/prices/history?commodity=${encodeURIComponent(commodity)}`);
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

export async function fetchAIRecommendations(origin = 'Jawa Tengah', commodity = 'Cabai Merah') {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations?origin=${encodeURIComponent(origin)}&commodity=${encodeURIComponent(commodity)}`);
    if (!res.ok) throw new Error("API Network response was not ok");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Backend API not reachable, using local fallback recommendations.", err);
    return null;
  }
}

