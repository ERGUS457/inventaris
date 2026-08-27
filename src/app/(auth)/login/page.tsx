import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — Tracely",
  description: "Masuk ke sistem pencatatan inventaris aset",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b1437] px-4 transition-colors duration-300">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 mb-10 hover:opacity-90 transition-opacity">
        <Image src="/logo-icon.png" alt="Tracely" width={48} height={48} className="object-contain" />
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Tracely</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Asset Management</p>
        </div>
      </Link>

      <LoginForm />

      <p className="mt-8 text-sm font-medium text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} Tracely
      </p>
    </main>
  );
}
