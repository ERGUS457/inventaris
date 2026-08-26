import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Transaction } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Dashboard",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: items } = await supabase.from("items").select("id, condition");
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select(`id, transaction_type, quantity, notes, transaction_date, items ( id, name, item_code )`)
    .order("transaction_date", { ascending: false })
    .limit(5);

  const totalItems = items?.length ?? 0;
  const goodCondition = items?.filter((i) => i.condition === "Baik").length ?? 0;
  const damaged = items?.filter((i) => i.condition === "Rusak").length ?? 0;
  const needsRepair = items?.filter((i) => i.condition === "Perlu Perbaikan").length ?? 0;
  const transactions = (recentTransactions ?? []) as unknown as Transaction[];

  const goodPct = totalItems > 0 ? Math.round((goodCondition / totalItems) * 100) : 0;
  const damagedPct = totalItems > 0 ? Math.round((damaged / totalItems) * 100) : 0;
  const repairPct = totalItems > 0 ? Math.round((needsRepair / totalItems) * 100) : 0;

  const metrics = [
    {
      title: "Total Aset",
      value: totalItems,
      icon: Package,
      color: "text-[#4318FF]",
      bg: "bg-[#F4F7FE]",
    },
    {
      title: "Kondisi Baik",
      value: goodCondition,
      icon: CheckCircle2,
      color: "text-[#01B574]",
      bg: "bg-[#F4F7FE]",
    },
    {
      title: "Perlu Perbaikan",
      value: needsRepair,
      icon: Wrench,
      color: "text-[#FFB547]",
      bg: "bg-[#F4F7FE]",
    },
    {
      title: "Rusak",
      value: damaged,
      icon: AlertTriangle,
      color: "text-[#EE5D50]",
      bg: "bg-[#F4F7FE]",
    },
  ];

  return (
    <div className="space-y-8 pb-8">

      {/* ── Hero Header ───────────────────────────────────────── */}
      <div className="rounded-[20px] bg-gradient-to-br from-[#868CFF] to-[#4318FF] p-8 md:p-10 text-white shadow-[0_18px_40px_-10px_rgba(67,24,255,0.4)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#E0E5F2]">
              PT. Sejahtera Abadi
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Dashboard Inventaris
            </h1>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 border border-white/20 backdrop-blur-md">
            <TrendingUp className="h-8 w-8 text-[#01B574]" />
            <div>
              <p className="text-sm font-medium text-white/80">Kondisi Baik</p>
              <p className="text-3xl font-bold text-white">{goodPct}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ──────────────────────────────────────── */}
      <div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.title}
              className="flex items-center gap-4 rounded-[20px] bg-white p-5 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] transition-transform hover:-translate-y-1"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${m.bg}`}>
                <m.icon className={`h-8 w-8 ${m.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#A3AED0]">{m.title}</p>
                <p className="text-2xl font-bold text-[#2B3674]">{m.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Transactions ───────────────────────────────── */}
      <div>
        <h2 className="mb-5 text-xl font-bold text-[#2B3674]">
          Transaksi Terbaru
        </h2>

        <div className="overflow-hidden rounded-[20px] bg-white shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] px-5 pb-5 pt-2">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#A3AED0]">
              <Package className="h-12 w-12 mb-4 text-slate-200" />
              <p className="text-sm font-medium">Belum ada transaksi bulan ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#F4F7FE] hover:bg-transparent">
                    <TableHead className="text-[#A3AED0] font-bold py-4">Aset</TableHead>
                    <TableHead className="text-[#A3AED0] font-bold py-4 text-center w-[100px]">Jumlah</TableHead>
                    <TableHead className="text-[#A3AED0] font-bold py-4 hidden sm:table-cell">Catatan</TableHead>
                    <TableHead className="text-[#A3AED0] font-bold py-4 text-right">Tipe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const isMasuk = tx.transaction_type === "masuk";
                    const isMutasi = tx.transaction_type === "mutasi";
                    
                    return (
                      <TableRow key={tx.id} className="border-b border-[#F4F7FE] hover:bg-[#F4F7FE]/50 transition-colors">
                        <TableCell className="font-bold text-[#2B3674] py-4">
                          {tx.items?.name ?? "—"}
                        </TableCell>
                        <TableCell className="text-center font-bold text-[#2B3674] py-4">
                          {tx.quantity}
                        </TableCell>
                        <TableCell className="text-[#A3AED0] text-sm font-medium max-w-[200px] truncate hidden sm:table-cell py-4">
                          {tx.notes ?? "—"}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <span
                            className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${
                              isMasuk
                                ? "bg-[#01B574] text-white"
                                : isMutasi
                                ? "bg-[#4318FF] text-white"
                                : "bg-[#EE5D50] text-white"
                            }`}
                          >
                            {isMasuk ? "MASUK" : isMutasi ? "MUTASI" : "KELUAR"}
                          </span>
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
    </div>
  );
}
