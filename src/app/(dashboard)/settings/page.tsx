import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoriesTable } from "@/components/settings/categories-table";
import { LocationsTable } from "@/components/settings/locations-table";
import { type Category, type Location } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Kategori & Lokasi",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: locations }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("locations").select("*").order("name"),
  ]);

  const safeCategories = (categories ?? []) as Category[];
  const safeLocations = (locations ?? []) as Location[];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kategori &amp; Lokasi</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kelola master data kategori dan lokasi yang digunakan oleh aset
        </p>
      </div>

      {/* Categories Section */}
      <section>
        <CategoriesTable categories={safeCategories} />
      </section>

      <Separator />

      {/* Locations Section */}
      <section>
        <LocationsTable locations={safeLocations} />
      </section>
    </div>
  );
}
