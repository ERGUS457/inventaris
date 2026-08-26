import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  UserCheck,
  Building2,
  FileBarChart,
  Users,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Superadmin - Pusat Kendali",
};

export default async function SuperadminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "superadmin") redirect("/dashboard");

  // Fetch stats
  const { data: allProfiles } = await supabase.from("profiles").select("id, is_verified, company_name, role");
  
  const pendingUsers = allProfiles?.filter((p) => !p.is_verified && p.role !== "superadmin") ?? [];
  const verifiedUsers = allProfiles?.filter((p) => p.is_verified && p.role !== "superadmin") ?? [];
  const companies = [...new Set(allProfiles?.map((p) => p.company_name).filter(Boolean))];

  const menuCards = [
    {
      title: "Verifikasi Pengguna",
      description: "Tinjau dan verifikasi pendaftaran akun baru yang masuk ke sistem.",
      href: "/users",
      icon: UserCheck,
      gradient: "from-[#4318FF] to-[#868CFF]",
      shadowColor: "shadow-[#4318FF]/25",
      stats: [
        {
          label: "Menunggu",
          value: pendingUsers.length,
          icon: Clock,
          color: "text-amber-400",
        },
        {
          label: "Terverifikasi",
          value: verifiedUsers.length,
          icon: CheckCircle2,
          color: "text-emerald-400",
        },
      ],
    },
    {
      title: "Pantau Perusahaan",
      description: "Pilih dan pantau data inventaris dari setiap perusahaan yang terdaftar.",
      href: "/superadmin/companies",
      icon: Building2,
      gradient: "from-[#01B574] to-[#59D99D]",
      shadowColor: "shadow-[#01B574]/25",
      stats: [
        {
          label: "Perusahaan Terdaftar",
          value: companies.length,
          icon: Building2,
          color: "text-emerald-200",
        },
      ],
    },
    {
      title: "Laporan Global",
      description: "Lihat laporan inventaris dengan filter per perusahaan dan jenis laporan.",
      href: "/superadmin/reports",
      icon: FileBarChart,
      gradient: "from-[#FFB547] to-[#FF6B35]",
      shadowColor: "shadow-[#FFB547]/25",
      stats: [
        {
          label: "Perusahaan",
          value: companies.length,
          icon: Building2,
          color: "text-amber-200",
        },
      ],
    },
    {
      title: "Kelola Pengguna",
      description: "Ubah role, verifikasi akun, dan kelola seluruh pengguna sistem.",
      href: "/users",
      icon: Users,
      gradient: "from-[#EE5D50] to-[#F2866D]",
      shadowColor: "shadow-[#EE5D50]/25",
      stats: [
        {
          label: "Total Pengguna",
          value: allProfiles?.length ?? 0,
          icon: Users,
          color: "text-red-200",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* ── Hero Header ─────────────────────────────────── */}
      <div className="rounded-[20px] bg-gradient-to-br from-[#2B3674] to-[#1B2559] p-8 md:p-10 text-white shadow-[0_18px_40px_-10px_rgba(43,54,116,0.5)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-bold mb-4 border border-white/10">
              <ShieldCheck className="h-4 w-4 text-[#4318FF]" />
              Superadmin Panel
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Pusat Kendali
            </h1>
            <p className="text-white/60 mt-2 text-sm md:text-base max-w-md">
              Kelola seluruh perusahaan, pengguna, dan laporan inventaris dari satu tempat.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {pendingUsers.length > 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-amber-500/20 p-4 border border-amber-500/30 backdrop-blur-md">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
                <div>
                  <p className="text-xs font-medium text-white/70">Perlu Tindakan</p>
                  <p className="text-2xl font-bold text-white">{pendingUsers.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Menu Cards ──────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2">
        {menuCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group block"
          >
            <div className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${card.gradient} p-6 md:p-8 text-white shadow-lg ${card.shadowColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                {/* Icon & Arrow */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <card.icon className="h-7 w-7" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl md:text-2xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">{card.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/20">
                  {card.stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className="text-xs text-white/60">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Pending Users Preview ────────────────────────── */}
      {pendingUsers.length > 0 && (
        <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#2B3674]">
              Menunggu Verifikasi
            </h2>
            <Link
              href="/users"
              className="text-sm font-bold text-[#4318FF] hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingUsers.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-[#F4F7FE] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2B3674] text-sm">
                      {(p as { id: string; company_name?: string }).company_name || "Belum ada nama perusahaan"}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  Menunggu
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
