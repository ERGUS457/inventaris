"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function transferItem(
  itemId: string,
  toLocationId: string,
  transferQty: number,
  notes?: string
) {
  const supabase = await createClient();

  // 1. Fetch original item
  const { data: originalItem, error: fetchError } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (fetchError || !originalItem) {
    return { error: "Gagal mengambil data aset asal." };
  }

  if (transferQty <= 0 || transferQty > originalItem.quantity) {
    return { error: "Kuantitas tidak valid." };
  }

  if (originalItem.location_id === toLocationId) {
    return { error: "Lokasi tujuan tidak boleh sama dengan lokasi asal." };
  }

  const fromLocationId = originalItem.location_id;
  let targetItemId = originalItem.id;

  // 2. Logic based on quantity
  if (transferQty === originalItem.quantity) {
    // Memindahkan seluruh stok (Update lokasi saja)
    const { error: updateError } = await supabase
      .from("items")
      .update({ location_id: toLocationId, updated_at: new Date().toISOString() })
      .eq("id", itemId);

    if (updateError) {
      return { error: "Gagal memindahkan seluruh aset." };
    }
  } else {
    // Memindahkan sebagian (Smart Split)
    
    // Cek apakah di lokasi baru sudah ada barang dengan kode dan kondisi yang sama
    const { data: existingTarget } = await supabase
      .from("items")
      .select("id, quantity")
      .eq("item_code", originalItem.item_code)
      .eq("condition", originalItem.condition)
      .eq("location_id", toLocationId)
      .single();

    if (existingTarget) {
      // Tambahkan stok ke barang yang sudah ada
      targetItemId = existingTarget.id;
      const { error: addError } = await supabase
        .from("items")
        .update({
          quantity: existingTarget.quantity + transferQty,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingTarget.id);

      if (addError) return { error: "Gagal menambah stok di lokasi tujuan." };
    } else {
      // Buat entitas barang baru di lokasi tujuan
      const { data: newItem, error: createError } = await supabase
        .from("items")
        .insert({
          item_code: originalItem.item_code,
          name: originalItem.name,
          category_id: originalItem.category_id,
          location_id: toLocationId,
          quantity: transferQty,
          condition: originalItem.condition,
          image_url: originalItem.image_url,
        })
        .select("id")
        .single();

      if (createError || !newItem) {
        console.error("Create Asset Error:", createError);
        // If it's a unique constraint on item_code, maybe we need a distinct code, or we allow duplicate item_code.
        // For inventory systems, if an item splits across locations, usually item_code is NOT strictly unique per row, OR we append a suffix.
        return { error: `Gagal membuat rekaman aset baru: ${createError?.message || "Unknown error"}. Jika Kode Aset unik, pertimbangkan untuk mengubah pengaturan database (hapus constraint UNIQUE pada item_code) atau mutasi tidak bisa dilakukan terpisah.` };
      }
      targetItemId = newItem.id;
    }

    // Kurangi stok dari barang asli
    const { error: reduceError } = await supabase
      .from("items")
      .update({
        quantity: originalItem.quantity - transferQty,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId);

    if (reduceError) return { error: "Gagal mengurangi stok di lokasi asal." };
  }

  // 3. Catat ke tabel transaksi (Histori Mutasi)
  // Untuk transaksi mutasi, item_id merujuk ke barang yang dipindah (target).
  const { error: txError } = await supabase.from("transactions").insert({
    item_id: targetItemId,
    transaction_type: "mutasi",
    quantity: transferQty,
    notes: notes || "Pemindahan aset antar gudang",
    from_location_id: fromLocationId,
    to_location_id: toLocationId,
  });

  if (txError) {
    console.error("Tx Error", txError);
    return { error: "Berhasil memindah aset, tetapi gagal mencatat riwayat transaksi." };
  }

  // Refresh data di halaman terkait
  revalidatePath("/items");
  revalidatePath("/transactions");
  revalidatePath("/");

  return { success: true };
}
