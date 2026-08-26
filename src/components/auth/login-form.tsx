"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LogIn } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ── Validation Schema ─────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ── Component ─────────────────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError("Email atau password salah. Silakan coba lagi.");
      return;
    }

    // Refresh the page to let Next.js middleware handle the redirect
    router.push("/");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-slate-200">
      <CardHeader className="space-y-2 pb-6 pt-8">
        <CardTitle className="text-3xl font-extrabold text-center text-slate-800">
          Selamat Datang
        </CardTitle>
        <CardDescription className="text-center text-base font-medium text-slate-500">
          Masuk ke Aplikasi Pencatatan Inventaris
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@perusahaan.com"
              autoComplete="email"
              disabled={isSubmitting}
              className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm font-medium text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-bold text-slate-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm font-medium text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm font-medium text-red-600">{serverError}</p>
            </div>
          )}

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full h-11 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Masuk...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Masuk
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
