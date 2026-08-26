"use client";

import { useState, useEffect } from "react";
import { Item } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Box, Loader2, Package } from "lucide-react";

interface ItemDistributionDialogProps {
  item: Item;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDistributionDialog({ item, isOpen, onOpenChange }: ItemDistributionDialogProps) {
  const [distribution, setDistribution] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !item?.item_code) return;

    async function fetchDistribution() {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data } = await supabase
        .from("items")
        .select("*, locations(id, name)")
        .eq("item_code", item.item_code)
        .order("quantity", { ascending: false });
        
      if (data) {
        setDistribution(data as Item[]);
      }
      setIsLoading(false);
    }

    fetchDistribution();
  }, [isOpen, item]);

  const totalQuantity = distribution.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-[20px] bg-[#F4F7FE] border-none p-0 overflow-hidden">
        <div className="bg-white p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F7FE] text-[#4318FF]">
                <Package className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold text-[#2B3674]">{item.name}</span>
                <span className="text-xs font-mono font-medium text-[#A3AED0]">{item.item_code}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 pt-2">
          <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-4 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.04)]">
            <span className="text-sm font-bold text-[#2B3674]">Total Keseluruhan</span>
            <span className="text-xl font-black text-[#4318FF]">{totalQuantity} Unit</span>
          </div>

          <p className="text-xs font-bold text-[#A3AED0] mb-3 px-2 uppercase tracking-wider">
            Rincian Lokasi Penyebaran
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#4318FF] mb-2" />
                <p className="text-xs font-medium text-[#A3AED0]">Memuat data...</p>
              </div>
            ) : (
              distribution.map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-[#4318FF]/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-[#01B574]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#2B3674]">
                        {d.locations?.name ?? "Lokasi Tidak Diketahui"}
                      </span>
                      <span className="text-[10px] font-medium text-[#A3AED0] uppercase">
                        Kondisi: {d.condition}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F4F7FE] px-3 py-1.5 rounded-lg">
                    <Box className="h-3.5 w-3.5 text-[#4318FF]" />
                    <span className="text-sm font-bold text-[#4318FF]">{d.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
