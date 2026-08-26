"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  company_name: z.string().min(2, {
    message: "Nama Perusahaan minimal 2 karakter.",
  }),
  email: z.string().email({
    message: "Email tidak valid.",
  }),
  password: z.string().min(6, {
    message: "Password minimal 6 karakter.",
  }),
});

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          company_name: values.company_name,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      toast.error("Gagal mendaftar", { description: error.message });
      return;
    }

    // Kirim notifikasi email ke Superadmin
    try {
      await fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          companyName: values.company_name,
        }),
      });
    } catch {
      // Jangan block proses registrasi jika notifikasi gagal
    }

    toast.success("Pendaftaran berhasil!", { description: "Akun Anda sedang menunggu verifikasi dari Superadmin." });
    router.push("/login?registered=true");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#2B3674] font-bold">Nama Perusahaan</FormLabel>
              <FormControl>
                <Input
                  placeholder="PT Maju Bersama"
                  {...field}
                  className="border-[#F4F7FE] bg-slate-50 focus-visible:ring-[#4318FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#2B3674] font-bold">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="admin@perusahaan.com"
                  {...field}
                  className="border-[#F4F7FE] bg-slate-50 focus-visible:ring-[#4318FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#2B3674] font-bold">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="border-[#F4F7FE] bg-slate-50 focus-visible:ring-[#4318FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#4318FF] hover:bg-[#3311DB] text-white rounded-[16px] py-6 text-md font-bold transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Mendaftarkan...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
        <div className="text-center text-sm text-[#A3AED0]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-[#4318FF] hover:underline">
            Login di sini
          </Link>
        </div>
      </form>
    </Form>
  );
}
