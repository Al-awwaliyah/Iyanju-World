import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { ReactNode } from "react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export interface ProductCardProps {
  id?: string;
  product?: ProductCardProps;
  name: string;
  slug: string;
  businessName: string;
  businessSlug?: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string | null;
  categoryName?: string | null;
  available?: boolean;
  stock?: number | null;
  featured?: boolean;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  onAddToCart?: () => void;
  addingToCart?: boolean;
  actionIcon?: ReactNode;
  className?: string;
}

function formatPrice(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default function ProductCard(props: ProductCardProps) {
  const source = props.product ?? props;
  const { name, slug, businessName, businessSlug, price, compareAtPrice, imageUrl, categoryName, available = true, stock, featured = false, currency = "NGN", rating, reviewCount, onAddToCart, addingToCart = false, actionIcon, className = "" } = source;
  const isOutOfStock = available === false || (stock !== null && stock !== undefined && stock <= 0);
  const hasDiscount = compareAtPrice !== null && compareAtPrice !== undefined && compareAtPrice > price;
  const discount = hasDiscount ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : 0;

  return (
    <article className={["group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg", className].join(" ")}>
      <Link to={`/product/${props.id ?? slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
          {imageUrl ? <img src={imageUrl} alt={name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center px-6 text-center text-3xl font-bold text-slate-200">{name.charAt(0)}</div>}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {hasDiscount && <Badge variant="danger" size="sm">-{discount}%</Badge>}
            {featured && <Badge variant="info" size="sm">Featured</Badge>}
          </div>
          <button type="button" onClick={(e) => e.preventDefault()} aria-label={`Add ${name} to wishlist`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm hover:text-red-500">
            {actionIcon ?? <Heart className="h-4 w-4" />}
          </button>
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        {categoryName && <p className="mb-1 truncate text-[11px] text-slate-400">{categoryName}</p>}
        <Link to={`/product/${props.id ?? slug}`}><h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-slate-800 group-hover:text-[#082A63]">{name}</h3></Link>
        {rating !== undefined && <div className="mt-2 flex items-center gap-1 text-xs text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /><span>{rating.toFixed(1)}</span>{reviewCount !== undefined && <span className="text-slate-400">({reviewCount})</span>}</div>}
        <p className="mt-2 text-lg font-bold text-slate-950">{formatPrice(price, currency)}</p>
        {hasDiscount && <p className="text-xs text-slate-400 line-through">{formatPrice(compareAtPrice!, currency)}</p>}
        {businessSlug ? <Link to={`/store/${businessSlug}`} className="mt-2 block truncate text-xs text-slate-500 hover:text-[#082A63]">{businessName}</Link> : <p className="mt-2 truncate text-xs text-slate-500">{businessName}</p>}
        {onAddToCart && <Button type="button" fullWidth size="sm" className="mt-3" loading={addingToCart} disabled={isOutOfStock} onClick={onAddToCart}><ShoppingCart className="h-4 w-4" /> Add to cart</Button>}
      </div>
    </article>
  );
}
