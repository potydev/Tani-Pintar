// Marketplace constants & API helpers for TaniPintar

export const COMMODITY_CATEGORIES = [
  { id: "all", label: "Semua", icon: "🌿" },
  { id: "cabai", label: "Cabai", icon: "🌶️" },
  { id: "bawang", label: "Bawang", icon: "🧅" },
  { id: "sayuran", label: "Sayuran", icon: "🥬" },
  { id: "buah", label: "Buah", icon: "🍎" },
  { id: "padi", label: "Beras & Padi", icon: "🌾" },
  { id: "rempah", label: "Rempah", icon: "🫚" },
];

export const SORT_OPTIONS = [
  { id: "popular", label: "Terpopuler" },
  { id: "price_low", label: "Harga Terendah" },
  { id: "price_high", label: "Harga Tertinggi" },
  { id: "newest", label: "Terbaru" },
  { id: "rating", label: "Rating Tertinggi" },
];

export const CATEGORY_ICON = (catId) => {
  const cat = COMMODITY_CATEGORIES.find(c => c.id === catId);
  return cat ? cat.icon : "🌿";
};

// API helpers
const API_BASE = "/api/marketplace";

export async function fetchProducts({ category, search, sort, page } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);
  if (page) params.set("page", page);
  try {
    const res = await fetch(`${API_BASE}/products?${params}`);
    return await res.json();
  } catch {
    return { success: false, data: [], total: 0 };
  }
}

export async function fetchProductDetail(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return await res.json();
  } catch {
    return { success: false, data: null };
  }
}

export async function fetchMarketplaceStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    return await res.json();
  } catch {
    return { success: false, data: { totalProducts: 0, totalSellers: 0, totalLocations: 0 } };
  }
}

export async function createOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Gagal mengirim pesanan." };
  }
}

export async function createProduct(productData) {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Gagal menambahkan produk." };
  }
}
