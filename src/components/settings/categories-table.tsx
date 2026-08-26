"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { type Category } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ── Schema ────────────────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// ── Form Dialog ───────────────────────────────────────────────────────────────

interface CategoryFormDialogProps {
  category?: Category;
  trigger: React.ReactElement;
  onSuccess: () => void;
}

function CategoryFormDialog({ category, trigger, onSuccess }: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    setServerError(null);
    const supabase = createClient();
    startTransition(async () => {
      const payload = { name: values.name, description: values.description || null };
      const { error } = isEdit
        ? await supabase.from("categories").update(payload).eq("id", category!.id)
        : await supabase.from("categories").insert(payload);
      if (error) { setServerError(error.message); return; }
      setOpen(false);
      form.reset();
      onSuccess();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { form.reset({ name: category?.name ?? "", description: category?.description ?? "" }); setServerError(null); setOpen(o); }}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          <DialogDescription>
            {isEdit ? `Perbarui data kategori "${category?.name}"` : "Tambahkan kategori aset baru"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl><Input placeholder="Elektronik" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span></FormLabel>
                <FormControl><Input placeholder="Perangkat elektronik kantor" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Batal</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Table Component ──────────────────────────────────────────────────────

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();

  function refresh() { router.refresh(); }

  async function handleDelete() {
    if (!deleteTarget) return;
    const supabase = createClient();
    startTransition(async () => {
      await supabase.from("categories").delete().eq("id", deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Kategori ({categories.length})</h2>
        <CategoryFormDialog
          onSuccess={refresh}
          trigger={
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Button>
          }
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm">
                  Belum ada kategori. Tambahkan yang pertama!
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{cat.description ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <CategoryFormDialog
                        category={cat}
                        onSuccess={refresh}
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(cat)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori <strong className="text-foreground">"{deleteTarget?.name}"</strong> akan dihapus. Aset yang menggunakan kategori ini tidak akan terhapus namun kehilangan referensi kategori.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
