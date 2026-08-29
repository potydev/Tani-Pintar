import React, { useState } from "react";
import { Star, MapPin, TrendingUp, TrendingDown, BadgeCheck, Flame, Heart, Eye, ShoppingCart } from "lucide-react";
import { CATEGORY_ICON } from "../../data/marketplaceData";

export function ProductCard({ product, onView, onBuy }) {
  const [liked, setLiked] = useState(false);
  const pc = parseFloat(product.price_change || 0);
  const priceUp = pc > 0;
  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/8 hover:border-emerald-200/60 transition-all duration-300 cursor-pointer" onClick={() => onView(product)}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden" style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)" }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-50 group-hover:scale-110 transition-transform duration-500">{CATEGORY_ICON(product.category)}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.trending && <span className="flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm"><Flame size={10} />Trending</span>}
          {product.grade && <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">{product.grade}</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <Heart size={15} className={liked ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
        </button>
        {pc !== 0 && (
          <div className="absolute bottom-3 right-3">
            <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm ${priceUp ? "bg-emerald-100/90 text-emerald-700" : "bg-rose-100/90 text-rose-600"}`} style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {priceUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {priceUp ? "+" : ""}{pc}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="font-bold text-sm text-slate-900 leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{product.name}</h3>
          <div className="flex items-center gap-0.5 shrink-0 ml-2">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>{product.rating || "5.0"}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{product.location}</span>
          {product.verified_seller && <BadgeCheck size={12} className="text-blue-500 shrink-0" />}
        </div>

        <div className="text-[11px] text-slate-400 mb-2.5" style={{ fontFamily: "Inter, sans-serif" }}>
          {product.farmer_name} · Terjual {(product.total_sold || 0).toLocaleString("id-ID")}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 2).map(tag => <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">{tag}</span>)}
          </div>
        )}

        <div className="flex items-end justify-between pt-2.5 border-t border-slate-100">
          <div>
            <div className="text-lg font-extrabold text-emerald-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              Rp {Number(product.price).toLocaleString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-400">per {product.unit || "kg"} · Min. {product.min_order || 50} {product.unit || "kg"}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onBuy(product); }} className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-sm">
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
