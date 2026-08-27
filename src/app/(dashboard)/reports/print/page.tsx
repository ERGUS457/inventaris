import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/print-button";

export const metadata = {
  title: "Cetak Dokumen Laporan",
};

export default async function PrintReportPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const type = resolvedParams.type;
  
  if (!type || (type !== "aset" && type !== "transaksi")) {
    redirect("/reports");
  }

  const supabase = await createClient();
  const printDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { data: { user } } = await supabase.auth.getUser();

  let companyName = "Perusahaan Anda";
  let initials = "PA";
  let userEmail = "admin@perusahaan.com";
  
  if (user) {
    userEmail = user.email || userEmail;
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_name")
      .eq("id", user.id)
      .single();
      
    if (profile?.company_name) {
      companyName = profile.company_name;
      // Ciptakan inisial dari nama perusahaan, abaikan "PT" 
      const cleanName = companyName.replace(/PT\.?\s*/i, '').trim();
      const words = cleanName.split(" ").filter(Boolean);
      initials = words.length > 1 
        ? (words[0][0] + words[1][0]).toUpperCase()
        : (words[0] ? words[0].substring(0, 2).toUpperCase() : "PA");
    }
  }

  let dataTitle = "";
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  if (type === "aset") {
    dataTitle = "DAFTAR INVENTARIS ASET PERUSAHAAN";
    tableHeaders = ["NO", "KODE ASET", "NAMA ASET", "KATEGORI", "LOKASI", "JUMLAH", "KONDISI"];

    const { data: items } = await supabase
      .from("items")
      .select("*, categories(name), locations(name)")
      .order("created_at", { ascending: false });

    if (items) {
      tableRows = items.map((item, index) => [
        (index + 1).toString(),
        item.item_code,
        item.name,
        item.categories?.name ?? "-",
        item.locations?.name ?? "-",
        item.quantity.toString(),
        item.condition,
      ]);
    }
  } else if (type === "transaksi") {
    dataTitle = "LAPORAN RIWAYAT TRANSAKSI ASET";
    tableHeaders = ["NO", "TANGGAL", "KODE ASET", "NAMA ASET", "TIPE", "JUMLAH", "CATATAN"];

    const { data: txs } = await supabase
      .from("transactions")
      .select("*, items(name, item_code)")
      .order("transaction_date", { ascending: false });

    if (txs) {
      tableRows = txs.map((tx, index) => [
        (index + 1).toString(),
        new Date(tx.transaction_date).toLocaleDateString("id-ID"),
        tx.items?.item_code ?? "-",
        tx.items?.name ?? "-",
        tx.transaction_type === "masuk" ? "Masuk" : "Keluar",
        tx.quantity.toString(),
        tx.notes ?? "-",
      ]);
    }
  }

  return (
    <div className="mx-auto max-w-4xl bg-white min-h-screen text-black print:p-0 print:m-0 pb-20">
      {/* ── Toolbar (Hidden when printing) ─────────────────────────────────── */}
      <div className="print:hidden flex items-center justify-between mb-8 pb-4 border-b">
        <Link 
          href="/reports"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 h-9 px-4 py-2"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Link>
        <div className="flex gap-4 items-center">
          <p className="text-sm text-slate-500 font-medium hidden sm:block">
            Tekan tombol cetak lalu "Save as PDF".
          </p>
          <PrintButton />
        </div>
      </div>

      {/* ── Document Container ─────────────────────────────────────────────── */}
      <div className="bg-white p-8 sm:p-12 print:p-0 shadow-lg print:shadow-none border print:border-none">
        
        {/* Kop Surat (Letterhead) */}
        <div className="flex items-center gap-6 border-b-4 border-black pb-6 mb-6">
          <div className="flex-shrink-0 h-24 w-24 bg-blue-700 flex items-center justify-center rounded-lg text-white font-bold text-4xl">
            {initials}
          </div>
          <div className="flex-1 text-center pr-24">
            <h1 className="text-2xl font-black uppercase tracking-wider">{companyName}</h1>
            <p className="text-sm font-medium mt-1">
              Dokumen Laporan Sistem Inventaris<br />
              Dihasilkan otomatis oleh sistem
            </p>
            <p className="text-sm">
              Email: {userEmail}
            </p>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold uppercase underline underline-offset-4">{dataTitle}</h2>
          <p className="text-sm mt-2">Dicetak pada: {printDate}</p>
        </div>

        {/* Data Table */}
        <table className="w-full text-left text-sm border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 print:bg-slate-100">
              {tableHeaders.map((header, idx) => (
                <th key={idx} className="border border-slate-300 px-3 py-2 font-bold text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.length > 0 ? (
              tableRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-300">
                  {row.map((cell, cellIdx) => (
                    <td 
                      key={cellIdx} 
                      className={`border border-slate-300 px-3 py-2 ${cellIdx === 0 || cellIdx === 5 ? 'text-center' : ''}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center py-8 text-slate-500">
                  Tidak ada data yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Signature Area */}
        <div className="mt-16 flex justify-end">
          <div className="text-center">
            <p className="text-sm mb-16">Jakarta, {printDate}</p>
            <p className="text-sm font-bold underline">Manajer Operasional</p>
            <p className="text-xs mt-1">NIP: 19820412 201001 1 008</p>
          </div>
        </div>

      </div>
    </div>
  );
}
