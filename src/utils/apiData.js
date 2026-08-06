import liveData from "../data/harga_pangan_realtime.json";

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
  if (!commodities || !commodities["Cabai Merah"]) return [];

  const cabaiPrices = commodities["Cabai Merah"].prices || [];
  // Select key representative regions
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
