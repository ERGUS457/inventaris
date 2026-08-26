"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { type Location } from "@/lib/types";
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

const locationSchema = z.object({
  name: z.string().min(1, "Nama lokasi wajib diisi"),
});

type LocationFormValues = z.infer<typeof locationSchema>;

// ── Form Dialog ───────────────────────────────────────────────────────────────

interface LocationFormDialogProps {
  location?: Location;
  trigger: React.ReactElement;
  onSuccess: () => void;
}

function LocationFormDialog({ location, trigger, onSuccess }: LocationFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!location;

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { name: location?.name ?? "" },
  });

  async function onSubmit(values: LocationFormValues) {
    setServerError(null);
    const supabase = createClient();
    startTransition(async () => {
      const { error } = isEdit
        ? await supabase.from("locations").update({ name: values.name }).eq("id", location!.id)
        : await supabase.from("locations").insert({ name: values.name });
      if (error) { setServerError(error.message); return; }
      setOpen(false);
      form.reset();
      onSuccess();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { form.reset({ name: location?.name ?? "" }); setServerError(null); setOpen(o); }}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Lokasi" : "Tambah Lokasi"}</DialogTitle>
          <DialogDescription>
            {isEdit ? `Perbarui nama lokasi "${location?.name}"` : "Tambahkan lokasi aset baru"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lokasi</FormLabel>
                <FormControl><Input placeholder="Lantai 2 - Ruang IT" {...field} /></FormControl>
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

interface LocationsTableProps {
  locations: Location[];
}

export function LocationsTable({ locations }: LocationsTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [isPending, startTransition] = useTransition();

  function refresh() { router.refresh(); }

  async function handleDelete() {
    if (!deleteTarget) return;
    const supabase = createClient();
    startTransition(async () => {
      await supabase.from("locations").delete().eq("id", deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Lokasi ({locations.length})</h2>
        <LocationFormDialog
          onSuccess={refresh}
          trigger={
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Lokasi
            </Button>
          }
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nama Lokasi</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-muted-foreground text-sm">
                  Belum ada lokasi. Tambahkan yang pertama!
                </TableCell>
              </TableRow>
            ) : (
              locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-medium">{loc.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <LocationFormDialog
                        location={loc}
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
                        onClick={() => setDeleteTarget(loc)}
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
            <AlertDialogTitle>Hapus Lokasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Lokasi <strong className="text-foreground">"{deleteTarget?.name}"</strong> akan dihapus permanen.
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
