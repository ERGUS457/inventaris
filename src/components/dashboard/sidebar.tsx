"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  ClipboardList,
  X,
  Boxes,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/items",
    label: "Data Aset",
    icon: Package,
  },
  {
    href: "/locations",
    label: "Peta Lokasi",
    icon: MapPin,
  },
  {
    href: "/transactions",
    label: "Transaksi",
    icon: ClipboardList,
  },
  {
    href: "/reports",
    label: "Laporan",
    icon: FileText,
  },
];

interface SidebarContentProps {
  onClose?: () => void;
  userRole?: string;
}

export function SidebarContent({ onClose, userRole }: SidebarContentProps) {
  const pathname = usePathname();

  // Add superadmin routes dynamically
  const displayedItems = userRole === "superadmin"
    ? [
        { href: "/superadmin", label: "Pusat Kendali", icon: LayoutDashboard },
        { href: "/superadmin/companies", label: "Pantau Perusahaan", icon: MapPin },
        { href: "/superadmin/reports", label: "Laporan Global", icon: FileText },
        { href: "/users", label: "Kelola Pengguna", icon: Users },
        { href: "/settings", label: "Pengaturan", icon: Settings },
      ]
    : [...navItems];

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#111c44] text-[#2B3674] dark:text-white shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] dark:shadow-none transition-colors duration-300">
      {/* ── Logo Header ────────────────────────────────────── */}
      <div className="flex items-center justify-center px-6 py-10 border-b border-[#F4F7FE] dark:border-white/10">
        <div className="flex items-center gap-2 uppercase">
          <p className="font-black text-2xl tracking-tighter text-[#2B3674] dark:text-white">
            INVENTARIS<span className="font-medium"> APP</span>
          </p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden text-[#A3AED0] dark:text-white/70 hover:text-[#2B3674] dark:hover:text-white hover:bg-[#F4F7FE] dark:hover:bg-white/10 absolute right-4"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {displayedItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-3 text-base font-bold transition-all duration-200",
                isActive
                  ? "text-[#4318FF] dark:text-white bg-[#F4F7FE] dark:bg-white/10"
                  : "text-[#A3AED0] dark:text-white/60 hover:text-[#2B3674] dark:hover:text-white hover:bg-[#F4F7FE] dark:hover:bg-white/5"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center transition-all",
                  isActive ? "text-[#4318FF] dark:text-white" : "text-[#A3AED0] dark:text-white/60"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <p>{item.label}</p>
              {isActive && (
                <div className="absolute right-0 h-9 w-1 rounded-l-lg bg-[#4318FF]" />
              )}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}

export function Sidebar({ userRole }: { userRole?: string }) {
  return (
    <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 left-0 z-30 bg-white">
      <SidebarContent userRole={userRole} />
    </aside>
  );
}
