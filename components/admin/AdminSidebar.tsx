"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Settings, LogOut, Leaf, Box,
  MessageSquare, Users, UserCircle, ShieldCheck, User, Menu, X, FileText,
  ChevronLeft, ChevronRight,
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => {
        if (!r.ok) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (d.user) setMe(d.user);
        setMeLoaded(true);
      })
      .catch(() => { router.push("/admin/login"); });
  }, [router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

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
          "bg-gray-900 text-white flex flex-col flex-shrink-0 transition-all duration-300",
          // Mobile: fixed overlay
          "fixed inset-y-0 left-0 z-50 w-72",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: sticky, full height, width based on collapsed state
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Leaf size={18} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-bold text-white text-sm truncate">Health Booster</p>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "সাইডবার বড় করুন" : "সাইডবার ছোট করুন"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                  collapsed ? "justify-center" : "",
                  active
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-800 space-y-1 flex-shrink-0">
          <Link
            href="/admin/profile"
            title={collapsed ? "প্রোফাইল" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-medium transition-colors",
              collapsed ? "justify-center" : "",
              pathname === "/admin/profile"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <UserCircle size={18} className="flex-shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                {me ? (
                  <>
                    <p className="truncate leading-tight text-sm">{me.name}</p>
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
            )}
          </Link>

          <button
            onClick={handleLogout}
            title={collapsed ? "লগআউট" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white text-sm font-medium transition-colors",
              collapsed ? "justify-center" : ""
            )}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>লগআউট</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
