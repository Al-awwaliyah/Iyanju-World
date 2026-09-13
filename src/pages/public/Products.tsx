import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import ProductGrid from "@/components/marketplace/ProductGrid";
import Button from "@/components/ui/Button";
import { useMarketplaceProducts, useMarketplaceCategories } from "@/hooks/useMarketplace";

export default function Products() {
  const [params] = useSearchParams();
  const initialSearch = params.get("q") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "newest");
  const dealsOnly = params.get("deals") === "true";
  const featuredOnly = params.get("featured") === "true";
  const { products, loading, error } = useMarketplaceProducts({ search, categorySlug: category || undefined, dealsOnly, featuredOnly, limit: 100 });
  const { categories } = useMarketplaceCategories();
  const sorted = useMemo(() => [...products].sort((a,b) => sort === "price-low" ? a.price-b.price : sort === "price-high" ? b.price-a.price : sort === "newest" ? +new Date(b.createdAt)-+new Date(a.createdAt) : 0), [products, sort]);
  return <PageContainer><div className="space-y-6 pb-16"><section className="rounded-2xl bg-[#082A63] p-6 text-white sm:p-8"><h1 className="text-3xl font-black sm:text-4xl">Marketplace Products</h1><p className="mt-2 max-w-2xl text-sm text-blue-100">Browse products published by active IyanjuWorld businesses.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…" className="h-12 w-full rounded-xl border-0 bg-white pl-11 pr-4 text-slate-900 outline-none"/></div><select value={category} onChange={e=>setCategory(e.target.value)} className="h-12 rounded-xl border-0 bg-white px-4 text-slate-900"><option value="">All categories</option>{categories.map(c=><option key={c.id} value={c.slug}>{c.name}</option>)}</select></div></section><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm text-slate-500"><SlidersHorizontal className="h-4 w-4"/><span>{sorted.length} published product{sorted.length===1?"":"s"}</span></div><select value={sort} onChange={e=>setSort(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>{error&&<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load marketplace products.</div>}<ProductGrid loading={loading} products={sorted.map(toCard)} columns={5} emptyState={<div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center"><p className="font-semibold text-slate-800">No products available</p><p className="mt-1 text-sm text-slate-500">Only products actually published by business owners appear here.</p><Link to="/business/products/new"><Button className="mt-5">Business owner? Add a product</Button></Link></div>}/></div></PageContainer>;
}
function toCard(p:any){return {id:p.id,name:p.name,slug:p.slug,businessName:p.businessName,businessSlug:p.businessSlug,price:p.price,compareAtPrice:p.compareAtPrice,imageUrl:p.imageUrl,categoryName:p.categoryName,stock:p.stock,available:p.available,featured:p.featured};}
