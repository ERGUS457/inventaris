import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ItemsTable } from "@/components/items/items-table";
import { ItemFormDialog } from "@/components/items/item-form-dialog";
import { type Item, type Category, type Location } from "@/lib/types";
import { Package } from "lucide-react";

import { ExportCSVButton } from "@/components/ui/export-csv-button";

export const metadata: Metadata = {
  title: "Data Aset",
};

export default async function ItemsPage() {
  const supabase = await createClient();

  // Fetch all items with joined category and location names
  const { data: items, error } = await supabase
    .from("items")
    .select(
      `
      *,
      categories ( id, name, description, created_at ),
      locations ( id, name, created_at )
    `
    )
    .order("created_at", { ascending: false });

  // Fetch categories and locations for the add/edit form dropdowns
  const [categoriesResult, locationsResult] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("locations").select("*").order("name"),
  ]);

  if (categoriesResult.error) console.error("Categories error:", categoriesResult.error);
  if (locationsResult.error) console.error("Locations error:", locationsResult.error);

  const categories = categoriesResult.data;
  const locations = locationsResult.data;

  const safeItems = (items ?? []) as Item[];
  const safeCategories = (categories ?? []) as Category[];
  const safeLocations = (locations ?? []) as Location[];
  
  console.log("SafeCategories length:", safeCategories.length, safeCategories);
  console.log("SafeLocations length:", safeLocations.length, safeLocations);

  // Prepare data for export
  const exportData = safeItems.map((item) => ({
    "Kode Aset": item.item_code,
    "Nama Aset": item.name,
    "Kategori": item.categories?.name ?? "-",
    "Lokasi": item.locations?.name ?? "-",
    "Jumlah": item.quantity,
    "Kondisi": item.condition,
    "Terakhir Diperbarui": new Date(item.updated_at).toLocaleDateString("id-ID"),
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Data Aset</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {safeItems.length} aset terdaftar dalam sistem
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportCSVButton data={exportData} filename="Laporan_Aset" />
          <ItemFormDialog
            categories={safeCategories}
            locations={safeLocations}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">
            Gagal memuat data: {error.message}
          </p>
        </div>
      )}

      {/* Items Table */}
      <ItemsTable
        items={safeItems}
        categories={safeCategories}
        locations={safeLocations}
      />
    </div>
  );
}
