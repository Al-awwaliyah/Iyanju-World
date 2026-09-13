import { supabase } from "@/libs/supabase";

export type MarketplaceProduct = {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  available: boolean;
  featured: boolean;
  status: string;
  imageUrl: string | null;
  businessName: string;
  businessSlug: string;
  businessVerified: boolean;
  businessOpen: boolean;
  categoryName: string;
  categorySlug: string;
  city: string | null;
  state: string | null;
  createdAt: string;
};

export type MarketplaceBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  verified: boolean;
  open: boolean;
  productCount: number;
};

export type MarketplaceCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
};

function fileUrl(path: string | null | undefined) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export async function listMarketplaceProducts(options: {
  limit?: number;
  search?: string;
  categorySlug?: string;
  businessId?: string;
  featuredOnly?: boolean;
  dealsOnly?: boolean;
} = {}): Promise<MarketplaceProduct[]> {
  const { limit = 100, search, categorySlug, businessId, featuredOnly, dealsOnly } = options;

  let query = supabase
    .from("products")
    .select("id,business_id,category_id,name,slug,description,price,compare_at_price,stock_quantity,status,is_available,is_featured,created_at,image_url")
    .eq("status", "active")
    .eq("is_available", true)
    .gt("stock_quantity", 0)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (businessId) query = query.eq("business_id", businessId);
  if (featuredOnly) query = query.eq("is_featured", true);
  if (search?.trim()) {
    const term = search.trim().replace(/,/g, " ");
    query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const [{ data: products, error: productError }, { data: businesses, error: businessError }, { data: categories, error: categoryError }] = await Promise.all([
    query,
    supabase.from("businesses").select("id,name,slug,description,logo_url,cover_image_url,city,state,country,phone,whatsapp_number,email,address_line,status,is_verified,is_open").eq("status", "active"),
    supabase.from("categories").select("id,name,slug,description,image_url,is_active").eq("is_active", true).order("sort_order", { ascending: true }),
  ]);

  if (productError) throw productError;
  if (businessError) throw businessError;
  if (categoryError) throw categoryError;

  const productIds = (products ?? []).map((p: any) => p.id);
  const { data: imageRows, error: imageError } = productIds.length
    ? await supabase.from("product_images").select("product_id,storage_path,sort_order,is_primary").in("product_id", productIds).order("is_primary", { ascending: false }).order("sort_order", { ascending: true })
    : { data: [], error: null };
  if (imageError) throw imageError;

  const imageMap = new Map<string, string>();
  for (const image of imageRows ?? []) {
    if (!imageMap.has(image.product_id)) imageMap.set(image.product_id, fileUrl(image.storage_path) ?? "");
  }
  const businessMap = new Map((businesses ?? []).map((b: any) => [b.id, b]));
  const categoryMap = new Map((categories ?? []).map((c: any) => [c.id, c]));

  const visible = (products ?? []).map((p: any) => {
    const b = businessMap.get(p.business_id);
    const c = categoryMap.get(p.category_id);
    if (!b || !c) return null;
    const compareAt = p.compare_at_price == null ? null : Number(p.compare_at_price);
    const price = Number(p.price);
    return {
      id: p.id,
      businessId: p.business_id,
      categoryId: p.category_id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? null,
      price,
      compareAtPrice: compareAt,
      stock: Number(p.stock_quantity ?? 0),
      available: Boolean(p.is_available),
      featured: Boolean(p.is_featured),
      status: p.status,
      imageUrl: imageMap.get(p.id) || fileUrl(p.image_url),
      businessName: b.name,
      businessSlug: b.slug,
      businessVerified: Boolean(b.is_verified),
      businessOpen: Boolean(b.is_open),
      categoryName: c.name,
      categorySlug: c.slug,
      city: b.city ?? null,
      state: b.state ?? null,
      createdAt: p.created_at,
    } as MarketplaceProduct;
  }).filter(Boolean) as MarketplaceProduct[];

  const filtered = categorySlug ? visible.filter((p) => p.categorySlug === categorySlug) : visible;
  return dealsOnly ? filtered.filter((p) => p.compareAtPrice != null && p.compareAtPrice > p.price) : filtered;
}

export async function getMarketplaceProduct(productId: string): Promise<MarketplaceProduct | null> {
  const rows = await listMarketplaceProducts({ limit: 1000 });
  return rows.find((p) => p.id === productId || p.slug === productId) ?? null;
}

export async function listMarketplaceBusinesses(limit = 100): Promise<MarketplaceBusiness[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("id,name,slug,description,logo_url,cover_image_url,city,state,country,phone,whatsapp_number,email,address_line,status,is_verified,is_open")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;

  const ids = (data ?? []).map((b: any) => b.id);
  let counts: Record<string, number> = {};
  if (ids.length) {
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("business_id")
      .in("business_id", ids)
      .eq("status", "active")
      .eq("is_available", true)
      .gt("stock_quantity", 0);
    if (productError) throw productError;
    for (const p of products ?? []) counts[p.business_id] = (counts[p.business_id] ?? 0) + 1;
  }

  return (data ?? []).map((b: any) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    description: b.description ?? null,
    logoUrl: b.logo_url ?? null,
    coverUrl: b.cover_image_url ?? null,
    city: b.city ?? null,
    state: b.state ?? null,
    country: b.country ?? null,
    phone: b.phone ?? null,
    whatsapp: b.whatsapp_number ?? null,
    email: b.email ?? null,
    address: b.address_line ?? null,
    verified: Boolean(b.is_verified),
    open: Boolean(b.is_open),
    productCount: counts[b.id] ?? 0,
  }));
}

export async function getMarketplaceBusiness(slug: string): Promise<MarketplaceBusiness | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("id,name,slug,description,logo_url,cover_image_url,city,state,country,phone,whatsapp_number,email,address_line,status,is_verified,is_open")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const businesses = await listMarketplaceBusinesses(1000);
  return businesses.find((b) => b.id === data.id) ?? null;
}

export async function listMarketplaceCategories(limit = 100): Promise<MarketplaceCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description,image_url,sort_order,is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .limit(limit);
  if (error) throw error;

  const { data: products, error: productError } = await supabase
    .from("products")
    .select("category_id")
    .eq("status", "active")
    .eq("is_available", true)
    .gt("stock_quantity", 0);
  if (productError) throw productError;

  const counts: Record<string, number> = {};
  for (const p of products ?? []) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;

  return (data ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    imageUrl: c.image_url ?? null,
    productCount: counts[c.id] ?? 0,
  }));
}
