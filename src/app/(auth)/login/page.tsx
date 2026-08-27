import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Login — Aplikasi Inventaris",
  description: "Masuk ke sistem pencatatan inventaris aset",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b1437] px-4 transition-colors duration-300">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 mb-10 hover:opacity-90 transition-opacity">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20">
          <Package className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-none tracking-tight text-slate-800 dark:text-white">Inventaris</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Asset Management</p>
        </div>
      </Link>

      <LoginForm />

      <p className="mt-8 text-sm font-medium text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} Aplikasi Pencatatan Inventaris
      </p>
    </main>
  );
}
