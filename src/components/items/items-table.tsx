"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, MoreHorizontal, ArrowRightLeft, MapPin } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { type Item, type Category, type Location } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ItemFormDialog } from "./item-form-dialog";
import { MutasiDialog } from "./mutasi-dialog";
import { ItemDistributionDialog } from "./item-distribution-dialog";

// ── Helpers ───────────────────────────────────────────────────────────────────

function ConditionBadge({ condition }: { condition: string }) {
  const styles: Record<string, string> = {
    Baik: "bg-[#01B574]/10 text-[#01B574] border-[#01B574]/20",
    Rusak: "bg-[#EE5D50]/10 text-[#EE5D50] border-[#EE5D50]/20",
    "Perlu Perbaikan": "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${
        styles[condition] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {condition}
    </span>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ItemsTableProps {
  items: Item[];
  categories: Category[];
  locations: Location[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ItemsTable({ items, categories, locations }: ItemsTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [editTarget, setEditTarget] = useState<Item | null>(null);
  const [mutasiTarget, setMutasiTarget] = useState<Item | null>(null);
  const [distributionTarget, setDistributionTarget] = useState<Item | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    if (!deleteTarget) return;
    const supabase = createClient();
    startTransition(async () => {
      await supabase.from("items").delete().eq("id", deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#A3AED0] border-none rounded-[20px] bg-white shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
        <p className="text-sm font-medium">Belum ada data aset di tabel ini.</p>
      </div>
    );
  }

  return (
    <>
      {/* Edit dialog — rendered outside the table to avoid nesting issues */}
      {editTarget && (
        <ItemFormDialog
          key={`edit-${editTarget.id}`}
          categories={categories}
          locations={locations}
          item={editTarget}
          defaultOpen
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Mutasi dialog */}
      {mutasiTarget && (
        <MutasiDialog
          key={`mutasi-${mutasiTarget.id}`}
          item={mutasiTarget}
          locations={locations}
          isOpen={!!mutasiTarget}
          onOpenChange={(open) => !open && setMutasiTarget(null)}
        />
      )}

      {/* Distribution dialog */}
      {distributionTarget && (
        <ItemDistributionDialog
          key={`dist-${distributionTarget.id}`}
          item={distributionTarget}
          isOpen={!!distributionTarget}
          onOpenChange={(open) => !open && setDistributionTarget(null)}
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-[20px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2B3674] font-bold">Hapus Data Aset?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#A3AED0]">
              Tindakan ini tidak dapat dibatalkan. Aset{" "}
              <strong className="text-[#2B3674]">{deleteTarget?.name}</strong> akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              className="bg-[#EE5D50] hover:bg-[#EE5D50]/90 font-bold rounded-xl text-white"
            >
              {isPending ? "Menghapus..." : "Ya, Hapus Aset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="overflow-hidden rounded-[20px] bg-white shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] border-none px-5 pb-5 pt-2">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#F4F7FE] hover:bg-transparent">
                <TableHead className="w-[120px] text-[#A3AED0] font-bold py-4">Kode</TableHead>
                <TableHead className="text-[#A3AED0] font-bold py-4">Nama Aset</TableHead>
                <TableHead className="text-[#A3AED0] font-bold py-4">Kategori</TableHead>
                <TableHead className="text-[#A3AED0] font-bold py-4">Lokasi</TableHead>
                <TableHead className="text-center w-[100px] text-[#A3AED0] font-bold py-4">Jumlah</TableHead>
                <TableHead className="w-[130px] text-[#A3AED0] font-bold py-4">Kondisi</TableHead>
                <TableHead className="w-[60px] text-right py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-b border-[#F4F7FE] hover:bg-[#F4F7FE]/50 transition-colors">
                  <TableCell className="font-mono text-sm font-bold text-[#A3AED0] py-4">
                    {item.item_code}
                  </TableCell>
                  <TableCell className="font-bold text-[#2B3674] py-4">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-[#2B3674] font-medium py-4">
                    {item.categories?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-[#2B3674] font-medium py-4">
                    {item.locations?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-center font-bold text-[#2B3674] py-4">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="py-4">
                    <ConditionBadge condition={item.condition} />
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#A3AED0] hover:text-[#4318FF] hover:bg-[#F4F7FE]"
                          >
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-56 rounded-xl">
                        <DropdownMenuItem onClick={() => setDistributionTarget(item)} className="cursor-pointer font-medium text-[#2B3674] focus:text-[#4318FF] focus:bg-[#F4F7FE]">
                          <MapPin className="mr-2 h-4 w-4" />
                          Detail Penyebaran
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMutasiTarget(item)} className="cursor-pointer font-medium text-[#2B3674] focus:text-[#4318FF] focus:bg-[#F4F7FE]">
                          <ArrowRightLeft className="mr-2 h-4 w-4" />
                          Mutasi Aset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditTarget(item)} className="cursor-pointer font-medium text-[#2B3674] focus:text-[#4318FF] focus:bg-[#F4F7FE]">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Aset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteTarget(item)}
                          className="cursor-pointer font-medium focus:bg-red-50 text-[#EE5D50]"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
