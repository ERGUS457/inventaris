import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar - Tracely",
  description: "Buat akun baru untuk Tracely",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#F4F7FE] dark:bg-[#0b1437] transition-colors duration-300 px-4">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-[20px] bg-white dark:bg-[#111c44] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] dark:shadow-none border-none px-8 py-10">
        <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#2B3674] dark:text-white">Daftar Akun</h1>
          <p className="text-sm text-[#A3AED0] dark:text-white/70">
            Masukkan email dan password untuk membuat akun baru
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
