// Script untuk mengecek kondisi database Supabase
// Jalankan: node scratch/check_db.mjs

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vgjyhfczthcyvcccfzks.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3F9EgtV_4fIKjb-D3hl9kQ_tcQmt-_e";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDB() {
  console.log("═══════════════════════════════════════════");
  console.log("  🔍 CEK DATABASE SUPABASE");
  console.log("═══════════════════════════════════════════\n");

  // 1. Cek tabel profiles
  console.log("── 1. TABEL PROFILES ──────────────────────");
  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("*");

  if (profileErr) {
    console.log("  ❌ TIDAK DITEMUKAN atau ERROR:", profileErr.message);
    console.log("  ⚠️  Anda BELUM menjalankan SQL untuk membuat tabel profiles!\n");
  } else {
    console.log(`  ✅ Ditemukan: ${profiles.length} baris`);
    profiles.forEach((p) => {
      console.log(`     - ${p.email} | role: ${p.role} | verified: ${p.is_verified} | company: ${p.company_name || "-"}`);
    });
    console.log();
  }

  // 2. Cek tabel categories
  console.log("── 2. TABEL CATEGORIES ────────────────────");
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, name, owner_id");

  if (catErr) {
    console.log("  ❌ ERROR:", catErr.message);
  } else {
    console.log(`  ✅ Ditemukan: ${categories.length} baris`);
    const hasOwner = categories.length > 0 && categories[0].owner_id !== undefined && categories[0].owner_id !== null;
    console.log(`  📌 Kolom owner_id: ${hasOwner ? "✅ Ada" : "❌ Belum ada (perlu jalankan SQL multi-tenant)"}`);
    console.log();
  }

  // 3. Cek tabel locations
  console.log("── 3. TABEL LOCATIONS ─────────────────────");
  const { data: locations, error: locErr } = await supabase
    .from("locations")
    .select("id, name, owner_id");

  if (locErr) {
    console.log("  ❌ ERROR:", locErr.message);
  } else {
    console.log(`  ✅ Ditemukan: ${locations.length} baris`);
    const hasOwner = locations.length > 0 && locations[0].owner_id !== undefined && locations[0].owner_id !== null;
    console.log(`  📌 Kolom owner_id: ${hasOwner ? "✅ Ada" : "❌ Belum ada (perlu jalankan SQL multi-tenant)"}`);
    console.log();
  }

  // 4. Cek tabel items
  console.log("── 4. TABEL ITEMS ─────────────────────────");
  const { data: items, error: itemErr } = await supabase
    .from("items")
    .select("id, name, item_code, owner_id");

  if (itemErr) {
    console.log("  ❌ ERROR:", itemErr.message);
  } else {
    console.log(`  ✅ Ditemukan: ${items.length} baris`);
    const hasOwner = items.length > 0 && items[0].owner_id !== undefined && items[0].owner_id !== null;
    console.log(`  📌 Kolom owner_id: ${hasOwner ? "✅ Ada" : "❌ Belum ada (perlu jalankan SQL multi-tenant)"}`);
    console.log();
  }

  // 5. Cek tabel transactions
  console.log("── 5. TABEL TRANSACTIONS ──────────────────");
  const { data: transactions, error: txErr } = await supabase
    .from("transactions")
    .select("id, transaction_type, owner_id");

  if (txErr) {
    console.log("  ❌ ERROR:", txErr.message);
  } else {
    console.log(`  ✅ Ditemukan: ${transactions.length} baris`);
    const hasOwner = transactions.length > 0 && transactions[0].owner_id !== undefined && transactions[0].owner_id !== null;
    console.log(`  📌 Kolom owner_id: ${hasOwner ? "✅ Ada" : "❌ Belum ada (perlu jalankan SQL multi-tenant)"}`);
    console.log();
  }

  // Summary
  console.log("═══════════════════════════════════════════");
  console.log("  📋 RINGKASAN");
  console.log("═══════════════════════════════════════════");

  if (profileErr) {
    console.log("  🔴 Tabel profiles BELUM ADA → Jalankan SQL auth_roles terlebih dahulu!");
  } else if (profiles.length === 0) {
    console.log("  🟡 Tabel profiles ADA tapi KOSONG → Belum ada user yang terdaftar lewat trigger.");
  } else {
    const superadmins = profiles.filter((p) => p.role === "superadmin");
    if (superadmins.length === 0) {
      console.log("  🟡 Belum ada Superadmin → Jalankan SQL migrasi untuk menjadikan akun Anda sebagai Superadmin.");
    } else {
      console.log(`  🟢 Superadmin ditemukan: ${superadmins.map((s) => s.email).join(", ")}`);
    }
  }
  console.log("═══════════════════════════════════════════\n");
}

checkDB().catch(console.error);
