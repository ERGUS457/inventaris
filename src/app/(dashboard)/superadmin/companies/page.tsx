import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Package,
  MapPin,
  ArrowRight,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pantau Perusahaan - Superadmin",
};

export default async function CompaniesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (myProfile?.role !== "superadmin") redirect("/dashboard");

  // Fetch all profiles with company names
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, company_name, is_verified, role")
    .order("company_name", { ascending: true });

  // Group by company
  const companyMap = new Map<string, { users: typeof profiles; ownerId: string }>();
  
  for (const p of profiles ?? []) {
    const name = p.company_name || "Tanpa Perusahaan";
    if (!companyMap.has(name)) {
      companyMap.set(name, { users: [], ownerId: p.id });
    }
    companyMap.get(name)!.users!.push(p);
  }

  // Fetch item counts per owner
  const { data: items } = await supabase.from("items").select("id, owner_id");
  const { data: locations } = await supabase.from("locations").select("id, owner_id");

  // Build stats per owner
  const itemCountByOwner = new Map<string, number>();
  const locationCountByOwner = new Map<string, number>();

  for (const item of items ?? []) {
    itemCountByOwner.set(item.owner_id, (itemCountByOwner.get(item.owner_id) || 0) + 1);
  }
  for (const loc of locations ?? []) {
    locationCountByOwner.set(loc.owner_id, (locationCountByOwner.get(loc.owner_id) || 0) + 1);
  }

  const companies = Array.from(companyMap.entries()).map(([name, data]) => {
    const ownerIds = data.users!.map((u) => u.id);
    const totalItems = ownerIds.reduce((sum, id) => sum + (itemCountByOwner.get(id) || 0), 0);
    const totalLocations = ownerIds.reduce((sum, id) => sum + (locationCountByOwner.get(id) || 0), 0);
    return {
      name,
      ownerId: data.ownerId,
      userCount: data.users!.length,
      totalItems,
      totalLocations,
    };
  });

  const gradients = [
    "from-[#4318FF] to-[#868CFF]",
    "from-[#01B574] to-[#59D99D]",
    "from-[#FFB547] to-[#FF6B35]",
    "from-[#EE5D50] to-[#F2866D]",
    "from-[#7B61FF] to-[#B39DFF]",
    "from-[#0EA5E9] to-[#67E8F9]",
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <Link
          href="/superadmin"
          className="text-sm text-[#A3AED0] hover:text-[#4318FF] font-medium mb-2 inline-block"
        >
          ← Kembali ke Pusat Kendali
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-[#2B3674]">
          Pantau Perusahaan
        </h1>
        <p className="text-[#A3AED0] mt-1">
          Pilih perusahaan untuk melihat detail inventaris dan data mereka.
        </p>
      </div>

      {/* Company Cards */}
      {companies.length === 0 ? (
        <div className="rounded-[20px] bg-white p-16 text-center shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
          <Building2 className="h-12 w-12 text-[#A3AED0] mx-auto mb-4" />
          <p className="text-[#A3AED0] font-medium">Belum ada perusahaan yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, i) => (
            <Link
              key={company.name}
              href={`/superadmin/companies/${company.ownerId}`}
              className="group block"
            >
              <div className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${gradients[i % gradients.length]} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <h3 className="text-lg font-bold mb-1 truncate">{company.name}</h3>
                  
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-white/70" />
                      <span className="font-bold">{company.totalItems}</span>
                      <span className="text-white/60">Aset</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-white/70" />
                      <span className="font-bold">{company.totalLocations}</span>
                      <span className="text-white/60">Lokasi</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-white/70" />
                      <span className="font-bold">{company.userCount}</span>
                      <span className="text-white/60">User</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
