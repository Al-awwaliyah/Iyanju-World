import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
  Package,
} from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";

export interface PublicHeaderProps {
  cartCount?: number;
  isAuthenticated?: boolean;
  userName?: string | null;
}

const quickCategories = [
  ["Phones & Tablets", "phones-accessories"],
  ["Electronics", "electronics"],
  ["Fashion", "fashion"],
  ["Home & Living", "home-living"],
  ["Beauty", "beauty-personal-care"],
  ["Groceries", "food-groceries"],
  ["Services", "services"],
] as const;

export default function PublicHeader({
  cartCount = 0,
  isAuthenticated = false,
  userName,
}: PublicHeaderProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchValue.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-[#082A63] text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
          <span className="hidden sm:block">Shop confidently from trusted marketplace sellers.</span>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/businesses" className="hover:text-[#F4B400]">Sell on IyanjuWorld</Link>
            <Link to="/about" className="hidden hover:text-[#F4B400] sm:block">Help Centre</Link>
          </div>
        </div>
      </div>

      <div className="bg-[#0b357d] text-white">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:px-6 lg:gap-5 lg:px-8">
          <button
            type="button"
            className="lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="shrink-0" aria-label="IyanjuWorld home">
            <img src="/logo.svg" alt="IyanjuWorld" className="h-9 w-auto brightness-0 invert" />
          </Link>

          <form onSubmit={handleSearch} className="order-3 w-full lg:order-none lg:flex-1">
            <div className="flex h-11 overflow-hidden rounded-md bg-white text-slate-900 shadow-sm">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products, brands and categories..."
                aria-label="Search products"
                className="min-w-0 flex-1 px-4 text-sm outline-none"
              />
              <button type="submit" className="flex w-12 items-center justify-center bg-[#F4B400] text-[#082A63] hover:bg-[#ffc928]" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-1 lg:flex">
            <button type="button" onClick={() => navigate(isAuthenticated ? "/account" : "/login")} className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
              <UserRound className="h-5 w-5" />
              <span className="text-left text-xs">
                <span className="block text-white/70">Hello,</span>
                <span className="block max-w-24 truncate font-semibold">{userName || "Account"}</span>
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => navigate("/orders")} className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
              <Package className="h-5 w-5" />
              <span className="text-xs font-semibold">Orders</span>
            </button>
            <button type="button" onClick={() => navigate("/customer/profile")} className="rounded-md p-2 hover:bg-white/10" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => navigate("/cart")} className="relative rounded-md p-2 hover:bg-white/10" aria-label="Cart">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#F4B400] px-1 text-center text-[10px] font-bold text-[#082A63]">{cartCount > 99 ? "99+" : cartCount}</span>}
            </button>
          </div>

          <button type="button" onClick={() => navigate("/cart")} className="relative ml-auto rounded-md p-2 lg:hidden" aria-label="Cart">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#F4B400] px-1 text-center text-[10px] font-bold text-[#082A63]">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="hidden border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          <Link to="/explore" className="flex items-center gap-2 border-r border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:text-[#082A63]">
            <Menu className="h-4 w-4" /> All Categories
          </Link>
          <nav className="flex min-w-0 flex-1 items-center overflow-hidden">
            {quickCategories.map(([label, slug]) => (
              <NavLink key={slug} to={`/category/${slug}`} className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#082A63]">
                {label}
              </NavLink>
            ))}
          </nav>
          {!isAuthenticated && (
            <div className="hidden items-center gap-2 xl:flex">
              <Button size="sm" variant="ghost" onClick={() => navigate("/login")}>Sign in</Button>
              <Button size="sm" onClick={() => navigate("/register")}>Create account</Button>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-[1440px] px-4 py-4">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded-md bg-slate-50 p-3 text-sm font-semibold">My Orders</Link>
              <Link to="/account" onClick={() => setMobileOpen(false)} className="rounded-md bg-slate-50 p-3 text-sm font-semibold">Account</Link>
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Shop by category</p>
            <div className="grid grid-cols-2 gap-1">
              {quickCategories.map(([label, slug]) => (
                <Link key={slug} to={`/category/${slug}`} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
