import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl?: string | null;
  icon?: ReactNode;
  productCount?: number;
  className?: string;
}

export default function CategoryCard({ name, slug, imageUrl, icon, productCount, className = "" }: CategoryCardProps) {
  return (
    <Link to={`/category/${slug}`} className={["group flex min-h-32 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#082A63]/20 hover:shadow-md", className].join(" ")}>
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#eef3fb] text-[#082A63]">
        {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" /> : icon ?? <span className="text-xl font-bold">{name.charAt(0)}</span>}
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-[#082A63]">{name}</h3>
      {productCount !== undefined && <p className="mt-1 text-[11px] text-slate-400">{productCount} products</p>}
    </Link>
  );
}
