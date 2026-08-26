"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { type Item, type Category, type Location, type ItemCondition } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ── Schema ────────────────────────────────────────────────────────────────────

const CONDITIONS: ItemCondition[] = ["Baik", "Rusak", "Perlu Perbaikan"];

const itemSchema = z.object({
  item_code: z.string().min(1, "Kode aset wajib diisi"),
  name: z.string().min(1, "Nama aset wajib diisi"),
  category_id: z.string().min(1, "Pilih kategori"),
  location_id: z.string().min(1, "Pilih lokasi"),
  quantity: z.coerce
    .number({ invalid_type_error: "Jumlah harus angka" })
    .int("Jumlah harus bilangan bulat")
    .min(0, "Jumlah tidak boleh negatif"),
  condition: z.enum(["Baik", "Rusak", "Perlu Perbaikan"], {
    required_error: "Pilih kondisi",
  }),
  image_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

type ItemFormValues = z.infer<typeof itemSchema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface ItemFormDialogProps {
  categories: Category[];
  locations: Location[];
  item?: Item; // If provided → Edit mode
  trigger?: React.ReactElement;
  /** When true, dialog opens immediately without a trigger button (used from external state) */
  defaultOpen?: boolean;
  /** Called when dialog closes in external-open mode */
  onClose?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ItemFormDialog({
  categories,
  locations,
  item,
  trigger,
  defaultOpen = false,
  onClose,
}: ItemFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [isPending, startTransition] = useTransition();

  const isEditMode = !!item;

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      item_code: item?.item_code ?? "",
      name: item?.name ?? "",
      category_id: item?.category_id ?? "",
      location_id: item?.location_id ?? "",
      quantity: item?.quantity ?? 0,
      condition: item?.condition ?? "Baik",
      image_url: item?.image_url ?? "",
    },
  });

  async function onSubmit(values: ItemFormValues) {
    const supabase = createClient();

    startTransition(async () => {
      const payload = {
        item_code: values.item_code,
        name: values.name,
        category_id: values.category_id,
        location_id: values.location_id,
        quantity: values.quantity,
        condition: values.condition,
        image_url: values.image_url || null,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (isEditMode) {
        ({ error } = await supabase
          .from("items")
          .update(payload)
          .eq("id", item!.id));
      } else {
        ({ error } = await supabase.from("items").insert({
          ...payload,
          created_at: new Date().toISOString(),
        }));
      }

      if (error) {
        toast.error(`Gagal ${isEditMode ? "memperbarui" : "menambah"} aset`, {
          description: error.message,
        });
        return;
      }

      toast.success(`Aset berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}`, {
        description: payload.name,
      });

      setOpen(false);
      form.reset();
      if (onClose) onClose();
      router.refresh();
    });
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset({
        item_code: item?.item_code ?? "",
        name: item?.name ?? "",
        category_id: item?.category_id ?? "",
        location_id: item?.location_id ?? "",
        quantity: item?.quantity ?? 0,
        condition: item?.condition ?? "Baik",
        image_url: item?.image_url ?? "",
      });
    }
    setOpen(next);
    if (!next && onClose) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Only show a trigger button when not controlled externally */}
      {!defaultOpen && (
        <DialogTrigger
          render={
            trigger ?? (
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Aset
              </Button>
            )
          }
        />
      )}

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Aset" : "Tambah Aset Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Perbarui data untuk aset "${item?.name}"`
              : "Isi formulir berikut untuk menambahkan aset baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Row: Kode & Nama */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="item_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Aset</FormLabel>
                    <FormControl>
                      <Input placeholder="AST-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Aset</FormLabel>
                    <FormControl>
                      <Input placeholder="Laptop Dell XPS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Kategori */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => {
                const selectedCat = categories.find((c) => c.id === field.value);
                return (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori">
                            {selectedCat ? selectedCat.name : (field.value ? "Kategori tidak ditemukan" : "Pilih kategori")}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {categories.length === 0 && <p className="text-xs text-red-500">Kategori kosong. Cek RLS Supabase.</p>}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Lokasi */}
            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => {
                const selectedLoc = locations.find((l) => l.id === field.value);
                return (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lokasi">
                            {selectedLoc ? selectedLoc.name : (field.value ? "Lokasi tidak ditemukan" : "Pilih lokasi")}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {locations.length === 0 && <p className="text-xs text-red-500">Lokasi kosong. Cek RLS Supabase.</p>}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Row: Jumlah & Kondisi */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kondisi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kondisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONDITIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image URL (optional) */}
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    URL Gambar{" "}
                    <span className="text-muted-foreground font-normal">
                      (opsional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* No server error block, using toast now */}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Simpan Perubahan" : "Tambah Aset"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
