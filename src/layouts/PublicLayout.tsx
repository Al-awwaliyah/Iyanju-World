import { Outlet, useLocation } from "react-router-dom";
import PublicHeader from "../components/layout/PublicHeader";
import PublicFooter from "../components/layout/PublicFooter";

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <PublicHeader />
      <main className={isHome ? "min-h-screen" : "min-h-screen py-6 sm:py-8"}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
