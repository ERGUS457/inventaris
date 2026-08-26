import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  MapPin,
  Building2,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Detail Perusahaan - Superadmin",
};

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: ownerId } = await params;
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

  // Fetch company profile
  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", ownerId)
    .single();

  if (!ownerProfile) redirect("/superadmin/companies");

  const companyName = ownerProfile.company_name || "Tanpa Perusahaan";

  // Fetch items for this owner
  const { data: items } = await supabase
    .from("items")
    .select("*, categories(name), locations(name)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  const { data: locations } = await supabase
    .from("locations")
    .select("*")
    .eq("owner_id", ownerId);

  const totalItems = items?.length ?? 0;
  const goodCondition = items?.filter((i) => i.condition === "Baik").length ?? 0;
  const damaged = items?.filter((i) => i.condition === "Rusak").length ?? 0;
  const needsRepair = items?.filter((i) => i.condition === "Perlu Perbaikan").length ?? 0;

  const metrics = [
    { title: "Total Aset", value: totalItems, icon: Package, color: "text-[#4318FF]" },
    { title: "Kondisi Baik", value: goodCondition, icon: CheckCircle2, color: "text-[#01B574]" },
    { title: "Perlu Perbaikan", value: needsRepair, icon: Wrench, color: "text-[#FFB547]" },
    { title: "Rusak", value: damaged, icon: AlertTriangle, color: "text-[#EE5D50]" },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <Link
          href="/superadmin/companies"
          className="text-sm text-[#A3AED0] hover:text-[#4318FF] font-medium mb-2 inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Perusahaan
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4318FF] text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#2B3674]">{companyName}</h1>
            <p className="text-[#A3AED0] text-sm">{ownerProfile.email} · {locations?.length ?? 0} Lokasi</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.title}
            className="flex items-center gap-4 rounded-[20px] bg-white p-5 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F7FE]">
              <m.icon className={`h-7 w-7 ${m.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#A3AED0]">{m.title}</p>
              <p className="text-2xl font-bold text-[#2B3674]">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Items Table */}
      <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
        <h2 className="text-xl font-bold text-[#2B3674] mb-4">Daftar Aset</h2>
        {(items?.length ?? 0) === 0 ? (
          <div className="text-center py-16 text-[#A3AED0]">
            <Package className="h-12 w-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium">Perusahaan ini belum memiliki aset.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-bold text-[#A3AED0]">Kode</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Nama Aset</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Kategori</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Lokasi</TableHead>
                  <TableHead className="font-bold text-[#A3AED0] text-center">Qty</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Kondisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id} className="border-b border-gray-50">
                    <TableCell className="font-mono text-sm text-[#A3AED0]">{item.item_code}</TableCell>
                    <TableCell className="font-bold text-[#2B3674]">{item.name}</TableCell>
                    <TableCell className="text-[#2B3674]">{item.categories?.name ?? "-"}</TableCell>
                    <TableCell className="text-[#2B3674]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#A3AED0]" />
                        {item.locations?.name ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-[#2B3674]">{item.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.condition === "Baik"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : item.condition === "Rusak"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }
                      >
                        {item.condition}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
