import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Login — Aplikasi Inventaris",
  description: "Masuk ke sistem pencatatan inventaris aset",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Package className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none">Inventaris</h1>
          <p className="text-xs text-muted-foreground">Manajemen Aset</p>
        </div>
      </div>

      <LoginForm />

      <p className="mt-6 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Aplikasi Pencatatan Inventaris
      </p>
    </main>
  );
}
