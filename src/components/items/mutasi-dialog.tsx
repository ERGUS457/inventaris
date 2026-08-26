"use client";

import { useState } from "react";
import { Item, Location } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transferItem } from "@/app/actions/mutasi";
import { ArrowRightLeft } from "lucide-react";

interface MutasiDialogProps {
  item: Item;
  locations: Location[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MutasiDialog({ item, locations, isOpen, onOpenChange }: MutasiDialogProps) {
  const [toLocationId, setToLocationId] = useState("");
  const [quantity, setQuantity] = useState<number | "">(1);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableLocations = locations.filter((loc) => loc.id !== item.location_id);

  async function handleTransfer() {
    if (!toLocationId) {
      setError("Silakan pilih lokasi tujuan.");
      return;
    }
    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum < 1 || qtyNum > item.quantity) {
      setError("Kuantitas tidak valid.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await transferItem(item.id, toLocationId, qtyNum, notes);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onOpenChange(false);
      // Reset form
      setToLocationId("");
      setQuantity(1);
      setNotes("");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#2B3674] text-xl font-bold">
            <ArrowRightLeft className="h-5 w-5 text-[#4318FF]" />
            Mutasi Aset
          </DialogTitle>
          <DialogDescription className="text-[#A3AED0]">
            Memindahkan <strong className="text-[#2B3674]">{item.name}</strong> dari lokasi saat ini.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col space-y-1.5">
            <Label className="text-[#2B3674] font-bold text-sm">Lokasi Tujuan</Label>
            <Select value={toLocationId} onValueChange={setToLocationId}>
              <SelectTrigger className="border-[#F4F7FE] bg-slate-50 focus:ring-[#4318FF]">
                <SelectValue placeholder="Pilih Gudang/Lokasi Baru">
                  {toLocationId 
                    ? availableLocations.find((loc) => loc.id === toLocationId)?.name || "Lokasi tidak ditemukan"
                    : "Pilih Gudang/Lokasi Baru"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableLocations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label className="text-[#2B3674] font-bold text-sm">
              Jumlah Dipindah (Maks: {item.quantity})
            </Label>
            <Input
              type="number"
              min={1}
              max={item.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
              className="border-[#F4F7FE] bg-slate-50 focus-visible:ring-[#4318FF]"
            />
            {typeof quantity === "number" && quantity < item.quantity && quantity > 0 && (
              <p className="text-xs text-[#01B574] mt-1 font-medium">
                Sistem akan memecah data: {item.quantity - quantity} tersisa, {quantity} dipindah.
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label className="text-[#2B3674] font-bold text-sm">Catatan Tambahan</Label>
            <Input
              placeholder="Contoh: Dipinjam untuk acara rapat"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-[#F4F7FE] bg-slate-50 focus-visible:ring-[#4318FF]"
            />
          </div>

          {error && <p className="text-sm text-[#EE5D50] font-medium">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Batal
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={isLoading}
            className="bg-[#4318FF] hover:bg-[#4318FF]/90 text-white font-bold"
          >
            {isLoading ? "Memproses..." : "Pindahkan Aset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
