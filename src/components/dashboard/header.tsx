"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar";

interface HeaderProps {
  userEmail: string;
}

export function Header({ userEmail }: HeaderProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = userEmail
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-4 z-20 flex h-16 w-full shrink-0 items-center justify-between rounded-[20px] bg-white/40 backdrop-blur-xl px-4 md:px-6 mb-8 mx-auto max-w-[calc(100%-32px)] md:max-w-[calc(100%-64px)] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
      <div className="flex items-center gap-2">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger 
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#2B3674] hover:bg-white/60"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 p-0 border-r-0 rounded-r-3xl overflow-hidden">
            <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        {/* Placeholder for Breadcrumbs if needed */}
        <p className="text-[#2B3674] font-bold text-sm hidden md:block tracking-wide">
          Pages / <span className="text-[#4318FF]">Dashboard</span>
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="group relative flex h-10 w-10 items-center justify-center rounded-full p-[2px] bg-blue-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-transform hover:scale-105" />
          }
        >
          <div className="h-full w-full rounded-full border-2 border-white p-[1px]">
            <Avatar className="h-full w-full">
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          {/* User info section */}
          <div className="px-3 py-2.5 border-b mb-1 bg-slate-50 dark:bg-slate-900/50 rounded-t-lg">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Masuk sebagai
            </p>
            <p className="text-xs text-slate-500 truncate mt-1">
              {userEmail}
            </p>
          </div>
          <DropdownMenuItem disabled className="py-2">
            <User className="mr-2 h-4 w-4" />
            <span className="font-medium">Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2" onClick={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span className="font-medium">Pengaturan</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            variant="destructive"
            className="py-2 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="font-medium">Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
