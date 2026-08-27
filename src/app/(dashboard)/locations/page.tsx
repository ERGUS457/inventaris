import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Box, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Peta Lokasi Aset",
};

interface LocationWithItems {
  id: string;
  name: string;
  created_at: string;
  items: { quantity: number; condition: string }[];
}

export default async function LocationsPage() {
  const supabase = await createClient();

  // Fetch locations with their items to calculate stats
  const { data: locations, error } = await supabase
    .from("locations")
    .select("id, name, created_at, items(quantity, condition)")
    .order("name", { ascending: true });

  const safeLocations = (locations ?? []) as LocationWithItems[];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2B3674] dark:text-white">Peta Gudang & Lokasi</h1>
          <p className="text-[#A3AED0] dark:text-white/70 font-medium text-sm mt-1">
            Pantau sebaran aset di {safeLocations.length} lokasi penyimpanan
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 shadow-sm">
          Gagal memuat data lokasi: {error.message}
        </div>
      )}

      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeLocations.map((loc) => {
          const totalItems = loc.items.reduce((sum, item) => sum + item.quantity, 0);
          const totalGood = loc.items.filter(i => i.condition === 'Baik').reduce((sum, item) => sum + item.quantity, 0);
          const totalBad = loc.items.filter(i => i.condition === 'Rusak').reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div
              key={loc.id}
              className="group rounded-[20px] bg-white dark:bg-[#111c44] p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] dark:shadow-none transition-all hover:-translate-y-1 hover:shadow-[14px_20px_40px_8px_rgba(112,144,176,0.12)] border border-transparent dark:border-white/5 hover:border-[#4318FF]/10 dark:hover:border-white/20 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7FE] dark:bg-white/10 text-[#4318FF] dark:text-white transition-colors group-hover:bg-[#4318FF] group-hover:text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2B3674] dark:text-white">{loc.name}</h3>
                    <p className="text-xs font-medium text-[#A3AED0] dark:text-white/50">ID: {loc.id.split('-')[0]}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-4 flex items-center justify-between rounded-xl bg-[#F4F7FE] dark:bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-[#4318FF] dark:text-[#868CFF]" />
                    <span className="text-sm font-bold text-[#2B3674] dark:text-white">Total Kapasitas</span>
                  </div>
                  <span className="text-xl font-black text-[#4318FF] dark:text-white">{totalItems}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="rounded-xl border border-slate-100 dark:border-white/10 p-3">
                    <p className="text-xs font-medium text-[#A3AED0] dark:text-white/70">Kondisi Baik</p>
                    <p className="text-lg font-bold text-[#01B574]">{totalGood}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 dark:border-white/10 p-3">
                    <p className="text-xs font-medium text-[#A3AED0] dark:text-white/70">Kondisi Rusak</p>
                    <p className="text-lg font-bold text-[#EE5D50]">{totalBad}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/10">
                <Link href={`/locations/${loc.id}`} className="w-full">
                  <Button className="w-full bg-[#F4F7FE] dark:bg-white/10 text-[#4318FF] dark:text-white hover:bg-[#4318FF] hover:text-white font-bold rounded-xl h-11 transition-all group-hover:shadow-md">
                    Lihat Isi Gudang
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      
      {safeLocations.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-[#A3AED0] bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
          <MapPin className="h-12 w-12 mb-4 text-slate-200" />
          <p className="text-sm font-medium">Belum ada lokasi yang terdaftar.</p>
        </div>
      )}
    </div>
  );
}
