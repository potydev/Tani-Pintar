import React, { useState } from "react";
import { Star, MapPin, TrendingUp, TrendingDown, BadgeCheck, Flame, Heart, ShoppingCart } from "lucide-react";
import { CATEGORY_ICON } from "../../data/marketplaceData";

export function ProductCard({ product, onView, onBuy }) {
  const [liked, setLiked] = useState(false);
  const pc = parseFloat(product.price_change || 0);
  const priceUp = pc > 0;
  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/10 hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
      onClick={() => onView(product)}
    >
      {/* Top Image Container */}
      <div>
        <div className="relative h-48 overflow-hidden bg-slate-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-50">
              <span className="text-6xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                {CATEGORY_ICON(product.category)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.grade && (
              <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                Grade {product.grade}
              </span>
            )}
            {product.organic && (
              <span className="bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                🌱 Organik
              </span>
            )}
          </div>

          {/* Favorite heart */}
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Heart size={14} className={liked ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
          </button>
        </div>

        {/* Card Content Body */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-1.5 gap-2">
            <h3
              className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {product.name}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {product.rating || "4.8"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
            <MapPin size={11} className="shrink-0 text-emerald-600" />
            <span className="truncate">{product.location || "Indonesia"}</span>
            {product.verified_seller && (
              <BadgeCheck size={13} className="text-emerald-600 fill-emerald-100 shrink-0" title="Petani Terverifikasi" />
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium mb-3">
            Petani: {product.farmer_name || "Binaan TaniPintar"}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Action */}
      <div className="p-4 pt-0">
        <div className="flex items-end justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Harga per {product.unit || "kg"}</span>
            <div className="text-base font-extrabold text-emerald-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Rp {Number(product.price).toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-400">Min. {product.min_order || 50} {product.unit || "kg"}</div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onBuy(product); }}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/10 transition-all hover:scale-105"
          >
            <ShoppingCart size={13} />
            <span>Beli</span>
          </button>
        </div>
      </div>
    </div>
  );
}
