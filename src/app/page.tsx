import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Package, ShieldCheck, ArrowRight, BarChart3, LayoutDashboard, Database } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#0b1437] font-sans selection:bg-[#4318FF] selection:text-white transition-colors duration-300">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/60 dark:bg-[#111c44]/60 border-b border-white/20 dark:border-white/5">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="Tracely" width={32} height={32} className="object-contain" />
            <p className="font-black text-xl sm:text-2xl tracking-tighter text-[#2B3674] dark:text-white uppercase">
              Tracely
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-[#2B3674] dark:text-white px-2 sm:px-4 font-bold hover:bg-[#E9EDF7] dark:hover:bg-white/10">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#4318FF] hover:bg-[#3311DB] text-white rounded-full px-4 sm:px-6 font-bold shadow-lg shadow-[#4318FF]/25">
                Mulai
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#111c44] text-[#4318FF] dark:text-[#868CFF] text-xs sm:text-sm font-bold shadow-sm mb-6 border border-white/50 dark:border-white/10">
            <span className="flex h-2 w-2 rounded-full bg-[#4318FF] dark:bg-[#868CFF] animate-pulse" />
            <span className="truncate max-w-[200px] sm:max-w-none">Sistem Multi-Perusahaan Tersedia Sekarang!</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#2B3674] dark:text-white tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Kelola Inventaris <br className="hidden md:block" /> Perusahaan Anda <br className="block md:hidden" />
            <span className="text-[#4318FF] dark:text-[#868CFF]">Lebih Cerdas</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#A3AED0] dark:text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium px-2">
            Platform modern untuk melacak, mengelola, dan memantau seluruh aset fisik maupun digital perusahaan Anda secara real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 sm:h-14 bg-[#4318FF] hover:bg-[#3311DB] text-white rounded-full px-6 sm:px-8 text-base sm:text-lg font-bold shadow-[0_10px_40px_-10px_rgba(67,24,255,0.7)] group">
                Buat Akun
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 rounded-full px-6 sm:px-8 text-base sm:text-lg font-bold border-[#A3AED0]/30 dark:border-white/20 text-[#2B3674] dark:text-white hover:bg-white dark:hover:bg-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                Lihat Dasbor
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#4318FF]/20 to-[#4318FF]/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* ── Features Section ───────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#111c44] transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B3674] dark:text-white mb-4">Fitur Unggulan</h2>
            <p className="text-[#A3AED0] dark:text-white/70 text-lg max-w-2xl mx-auto">Dirancang khusus untuk mempermudah tim logistik dan operasional dalam memonitor pergerakan aset.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[20px] bg-[#F4F7FE] dark:bg-white/5 border border-transparent hover:border-[#4318FF]/20 dark:hover:border-white/20 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-[#111c44] shadow-sm flex items-center justify-center mb-6 text-[#4318FF] dark:text-[#868CFF] group-hover:scale-110 transition-transform">
                <Database className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#2B3674] dark:text-white mb-3">Multi-Perusahaan</h3>
              <p className="text-[#A3AED0] dark:text-white/70 leading-relaxed">
                Data inventaris setiap perusahaan atau cabang terisolasi dengan aman menggunakan keamanan level baris (RLS).
              </p>
            </div>
            
            <div className="p-8 rounded-[20px] bg-[#F4F7FE] dark:bg-white/5 border border-transparent hover:border-[#4318FF]/20 dark:hover:border-white/20 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-[#111c44] shadow-sm flex items-center justify-center mb-6 text-[#4318FF] dark:text-[#868CFF] group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#2B3674] dark:text-white mb-3">Dasbor Interaktif</h3>
              <p className="text-[#A3AED0] dark:text-white/70 leading-relaxed">
                Antarmuka modern bergaya Horizon UI yang responsif, rapi, dan menyajikan ringkasan aset dengan jelas.
              </p>
            </div>

            <div className="p-8 rounded-[20px] bg-[#F4F7FE] dark:bg-white/5 border border-transparent hover:border-[#4318FF]/20 dark:hover:border-white/20 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-[#111c44] shadow-sm flex items-center justify-center mb-6 text-[#4318FF] dark:text-[#868CFF] group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#2B3674] dark:text-white mb-3">Akses Superadmin</h3>
              <p className="text-[#A3AED0] dark:text-white/70 leading-relaxed">
                Verifikasi pendaftaran pengguna baru secara manual dan pantau seluruh pergerakan aset secara global.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#2B3674] dark:bg-[#0b1437] py-12 text-center text-white/70 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/logo-icon.png" alt="Tracely" width={24} height={24} className="object-contain" />
            <p className="font-black text-xl tracking-tighter text-white uppercase">
              Tracely
            </p>
          </div>
          <p>© {new Date().getFullYear()} Tracely. Dibangun dengan Next.js & Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
