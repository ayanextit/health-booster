"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Settings, LogOut, Leaf, Box,
  MessageSquare, Users, UserCircle, ShieldCheck, User, Menu, X, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MeUser {
  name: string;
  email: string;
  role: string;
}

const adminNavItems = [
  { href: "/admin/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard, roles: ["admin", "staff"] },
  { href: "/admin/orders", label: "অর্ডার", icon: ShoppingCart, roles: ["admin", "staff"] },
  { href: "/admin/products", label: "পণ্য", icon: Box, roles: ["admin"] },
  { href: "/admin/packages", label: "প্যাকেজ", icon: Package, roles: ["admin"] },
  { href: "/admin/faq", label: "FAQ", icon: MessageSquare, roles: ["admin"] },
  { href: "/admin/invoices", label: "ইনভয়েস", icon: FileText, roles: ["admin"] },
  { href: "/admin/users", label: "ইউজার", icon: Users, roles: ["admin"] },
  { href: "/admin/settings", label: "সেটিংস", icon: Settings, roles: ["admin"] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<MeUser | null>(null);
  const [meLoaded, setMeLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => {
        if (!r.ok) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (d.user) setMe(d.user);
        setMeLoaded(true);
      })
      .catch(() => { router.push("/admin/login"); });
  }, [router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Show all items while loading; filter by role once resolved
  const visibleItems = !meLoaded
    ? adminNavItems
    : me
      ? adminNavItems.filter((item) => item.roles.includes(me.role))
      : adminNavItems.filter((item) => item.roles.includes("staff"));

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-gray-900 flex items-center gap-3 px-4 z-40 shadow-lg">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
            <Leaf size={15} className="text-white" />
          </div>
          <p className="font-bold text-white text-sm">Health Booster</p>
        </div>
      </header>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gray-900 text-white flex flex-col",
          // Mobile: fixed overlay with slide animation
          "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: static in flex layout, always visible
          "lg:static lg:w-64 lg:min-h-screen lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf size={18} />
            </div>
            <div>
              <p className="font-bold text-white">Health Booster</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-1">
          {/* Profile link */}
          <Link
            href="/admin/profile"
            className={cn(
              "flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium transition-colors",
              pathname === "/admin/profile"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <UserCircle size={18} />
            <div className="flex-1 min-w-0">
              {me ? (
                <>
                  <p className="truncate leading-tight">{me.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {me.role === "admin"
                      ? <ShieldCheck size={11} className="text-green-400" />
                      : <User size={11} className="text-blue-400" />}
                    <span className={`text-xs ${me.role === "admin" ? "text-green-400" : "text-blue-400"}`}>
                      {me.role === "admin" ? "Admin" : "Staff"}
                    </span>
                  </div>
                </>
              ) : (
                <span>প্রোফাইল</span>
              )}
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            লগআউট
          </button>
        </div>
      </aside>
    </>
  );
}
