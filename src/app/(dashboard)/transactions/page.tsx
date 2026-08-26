import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { type Transaction } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpCircle, ArrowDownCircle, ClipboardList, ArrowRightLeft } from "lucide-react";
import { ExportCSVButton } from "@/components/ui/export-csv-button";

export const metadata: Metadata = {
  title: "Riwayat Transaksi",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TransactionsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      transaction_type,
      quantity,
      notes,
      transaction_date,
      created_by,
      from_location_id,
      to_location_id,
      items ( id, name, item_code ),
      from_location:locations!transactions_from_location_id_fkey(name),
      to_location:locations!transactions_to_location_id_fkey(name)
    `
    )
    .order("transaction_date", { ascending: false });

  const transactions = (data ?? []) as unknown as Transaction[];

  const exportData = transactions.map((tx) => {
    let tipeStr = tx.transaction_type === "masuk" ? "Masuk" : tx.transaction_type === "mutasi" ? "Mutasi" : "Keluar";
    let catatan = tx.notes ?? "-";
    if (tx.transaction_type === "mutasi") {
      catatan = `${tx.from_location?.name} ➔ ${tx.to_location?.name} | ${catatan}`;
    }

    return {
      "Tipe": tipeStr,
      "Kode Aset": tx.items?.item_code ?? "-",
      "Nama Aset": tx.items?.name ?? "-",
      "Jumlah": tx.quantity,
      "Catatan": catatan,
      "Tanggal": formatDate(tx.transaction_date),
    };
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2B3674]">Riwayat Transaksi</h1>
          <p className="text-[#A3AED0] font-medium text-sm mt-1">
            {transactions.length} transaksi tercatat dalam sistem
          </p>
        </div>
        <ExportCSVButton data={exportData} filename="Laporan_Transaksi" />
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 shadow-sm">
          Gagal memuat data transaksi: {error.message}
        </div>
      )}

      {/* Transactions list */}
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] px-5 pb-5 pt-2">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#A3AED0]">
            <ClipboardList className="h-12 w-12 mb-4 text-slate-200" />
            <p className="text-sm font-medium">Belum ada riwayat transaksi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#F4F7FE] hover:bg-transparent">
                  <TableHead className="w-[180px] text-[#A3AED0] font-bold py-4">Tanggal</TableHead>
                  <TableHead className="text-[#A3AED0] font-bold py-4">Aset</TableHead>
                  <TableHead className="text-[#A3AED0] font-bold py-4">Tipe</TableHead>
                  <TableHead className="text-center w-[100px] text-[#A3AED0] font-bold py-4">Jumlah</TableHead>
                  <TableHead className="text-[#A3AED0] font-bold py-4">Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const isMasuk = tx.transaction_type === "masuk";
                  const isMutasi = tx.transaction_type === "mutasi";

                  return (
                    <TableRow key={tx.id} className="border-b border-[#F4F7FE] hover:bg-[#F4F7FE]/50 transition-colors">
                      <TableCell className="text-sm font-medium text-[#A3AED0] py-4">
                        {formatDate(tx.transaction_date)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#2B3674]">{tx.items?.name ?? "—"}</span>
                          <span className="text-xs font-mono text-[#A3AED0] mt-0.5">
                            {tx.items?.item_code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ${
                            isMasuk
                              ? "bg-[#01B574] text-white"
                              : isMutasi
                              ? "bg-[#4318FF] text-white"
                              : "bg-[#EE5D50] text-white"
                          }`}
                        >
                          {isMasuk ? (
                            <ArrowUpCircle className="h-3.5 w-3.5" />
                          ) : isMutasi ? (
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownCircle className="h-3.5 w-3.5" />
                          )}
                          {isMasuk ? "MASUK" : isMutasi ? "MUTASI" : "KELUAR"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-[#2B3674] py-4">
                        {tx.quantity}
                      </TableCell>
                      <TableCell className="text-[#A3AED0] text-sm font-medium py-4">
                        {isMutasi && tx.from_location && tx.to_location && (
                          <div className="flex items-center gap-1.5 text-[#2B3674] font-bold text-xs mb-1 bg-[#F4F7FE] w-max px-2 py-1 rounded-md">
                            <span>{tx.from_location.name}</span>
                            <ArrowRightLeft className="h-3 w-3 text-[#4318FF]" />
                            <span>{tx.to_location.name}</span>
                          </div>
                        )}
                        <span>{tx.notes ?? "—"}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
