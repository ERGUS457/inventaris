import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { type Item, type Category, type Location } from "@/lib/types";
import { ItemsTable } from "@/components/items/items-table";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Detail Gudang",
};

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Location
  const { data: location, error: locError } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (locError || !location) {
    notFound();
  }

  // 2. Fetch items for this location
  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("*, categories(id, name), locations(id, name)")
    .eq("location_id", id)
    .order("name", { ascending: true });

  // 3. Fetch categories and locations for the Mutasi/Edit dialogs inside ItemsTable
  const [{ data: categories }, { data: locations }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("locations").select("*").order("name"),
  ]);

  const safeItems = (items ?? []) as Item[];
  const safeCategories = (categories ?? []) as Category[];
  const safeLocations = (locations ?? []) as Location[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/locations">
          <Button variant="ghost" className="w-fit text-[#A3AED0] hover:text-[#4318FF] hover:bg-[#F4F7FE] px-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Peta Lokasi
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4318FF] text-white shadow-lg shadow-[#4318FF]/20">
            <MapPin className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#2B3674]">{location.name}</h1>
            <p className="text-[#A3AED0] font-medium text-sm mt-1">
              Menampilkan {safeItems.length} jenis aset di dalam lokasi ini
            </p>
          </div>
        </div>
      </div>

      {itemsError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 shadow-sm">
          Gagal memuat isi gudang: {itemsError.message}
        </div>
      )}

      {/* Reusing ItemsTable for consistency */}
      <div className="mt-8">
        <ItemsTable
          items={safeItems}
          categories={safeCategories}
          locations={safeLocations}
        />
      </div>
    </div>
  );
}
