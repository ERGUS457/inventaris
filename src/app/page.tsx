import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ShieldCheck, ArrowRight, BarChart3, LayoutDashboard, Database } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans selection:bg-[#4318FF] selection:text-white">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/60 border-b border-white/20">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#4318FF] shadow-md shadow-[#4318FF]/20">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="font-black text-xl sm:text-2xl tracking-tighter text-[#2B3674] uppercase">
              INVENTARIS<span className="font-medium hidden sm:inline"> APP</span>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#2B3674] px-2 sm:px-4 font-bold hover:bg-[#E9EDF7]">
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#4318FF] text-xs sm:text-sm font-bold shadow-sm mb-6 border border-white/50">
            <span className="flex h-2 w-2 rounded-full bg-[#4318FF] animate-pulse" />
            <span className="truncate max-w-[200px] sm:max-w-none">Sistem Multi-Perusahaan Tersedia Sekarang!</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#2B3674] tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Kelola Inventaris <br className="hidden md:block" /> Perusahaan Anda <br className="block md:hidden" />
            <span className="text-[#4318FF]">Lebih Cerdas</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#A3AED0] mb-8 sm:mb-10 max-w-2xl mx-auto font-medium px-2">
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
              <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 rounded-full px-6 sm:px-8 text-base sm:text-lg font-bold border-[#A3AED0]/30 text-[#2B3674] hover:bg-white bg-white/50 backdrop-blur-sm">
                Lihat Dasbor
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#4318FF]/20 to-[#4318FF]/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* ── Features Section ───────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B3674] mb-4">Fitur Unggulan</h2>
            <p className="text-[#A3AED0] text-lg max-w-2xl mx-auto">Dirancang khusus untuk mempermudah tim logistik dan operasional dalam memonitor pergerakan aset.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[20px] bg-[#F4F7FE] border border-transparent hover:border-[#4318FF]/20 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#4318FF] group-hover:scale-110 transition-transform">
                <Database className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#2B3674] mb-3">Multi-Perusahaan</h3>
              <p className="text-[#A3AED0] leading-relaxed">
                Data inventaris setiap perusahaan atau cabang terisolasi dengan aman menggunakan keamanan level baris (RLS).
              </p>
            </div>
            
            <div className="p-8 rounded-[20px] bg-[#F4F7FE] border border-transparent hover:border-[#4318FF]/20 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#4318FF] group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#2B3674] mb-3">Dasbor Interaktif</h3>
              <p className="text-[#A3AED0] leading-relaxed">
                Antarmuka modern bergaya Horizon UI yang responsif, rapi, dan menyajikan ringkasan aset dengan jelas.
              </p>
            </div>

            <div className="p-8 rounded-[20px] bg-[#F4F7FE] border border-transparent hover:border-[#4318FF]/20 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#4318FF] group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#2B3674] mb-3">Akses Superadmin</h3>
              <p className="text-[#A3AED0] leading-relaxed">
                Verifikasi pendaftaran pengguna baru secara manual dan pantau seluruh pergerakan aset secara global.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#2B3674] py-12 text-center text-white/70">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Package className="h-6 w-6 text-[#4318FF]" />
            <p className="font-black text-xl tracking-tighter text-white uppercase">
              INVENTARIS<span className="font-medium"> APP</span>
            </p>
          </div>
          <p>© {new Date().getFullYear()} Aplikasi Pencatatan Inventaris. Dibangun dengan Next.js & Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
