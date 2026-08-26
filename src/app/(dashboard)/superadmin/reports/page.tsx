"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  FileBarChart,
  Building2,
  Package,
  ArrowRightLeft,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type CompanyOption = {
  id: string;
  company_name: string;
};

type ReportType = "items" | "transactions";

export default function SuperadminReportsPage() {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [reportType, setReportType] = useState<ReportType>("items");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      const supabase = createClient();
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, company_name")
        .not("company_name", "is", null)
        .order("company_name");

      const uniqueCompanies = new Map<string, CompanyOption>();
      for (const p of profiles ?? []) {
        if (p.company_name && !uniqueCompanies.has(p.company_name)) {
          uniqueCompanies.set(p.company_name, { id: p.id, company_name: p.company_name });
        }
      }
      setCompanies(Array.from(uniqueCompanies.values()));
    }
    loadCompanies();
  }, []);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      const supabase = createClient();

      if (reportType === "items") {
        let query = supabase
          .from("items")
          .select("*, categories(name), locations(name), profiles(email)")
          .order("created_at", { ascending: false });

        if (selectedCompany !== "all") {
          query = query.eq("owner_id", selectedCompany);
        }

        const { data: items } = await query;
        setData(items ?? []);
      } else {
        let query = supabase
          .from("transactions")
          .select("*, items(name, item_code), profiles(email)")
          .order("transaction_date", { ascending: false })
          .limit(100);

        if (selectedCompany !== "all") {
          query = query.eq("owner_id", selectedCompany);
        }

        const { data: txs } = await query;
        setData(txs ?? []);
      }

      setLoading(false);
    }
    loadReport();
  }, [selectedCompany, reportType]);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <Link
          href="/superadmin"
          className="text-sm text-[#A3AED0] hover:text-[#4318FF] font-medium mb-2 inline-block"
        >
          ← Kembali ke Pusat Kendali
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-[#2B3674]">
          Laporan Global
        </h1>
        <p className="text-[#A3AED0] mt-1">
          Filter laporan berdasarkan perusahaan dan jenis data.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#A3AED0]" />
          <h2 className="font-bold text-[#2B3674]">Filter Laporan</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Company Filter */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#2B3674]">Perusahaan</label>
            <Select value={selectedCompany} onValueChange={(val) => setSelectedCompany(val || "all")}>
              <SelectTrigger className="bg-[#F4F7FE] border-none h-12 rounded-xl">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#A3AED0]" />
                  <SelectValue placeholder="Semua Perusahaan" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Perusahaan</SelectItem>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report Type */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#2B3674]">Jenis Laporan</label>
            <Select value={reportType} onValueChange={(val) => setReportType((val || "items") as ReportType)}>
              <SelectTrigger className="bg-[#F4F7FE] border-none h-12 rounded-xl">
                <div className="flex items-center gap-2">
                  <FileBarChart className="h-4 w-4 text-[#A3AED0]" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="items">
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> Daftar Aset
                  </span>
                </SelectItem>
                <SelectItem value="transactions">
                  <span className="flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4" /> Riwayat Transaksi
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2B3674]">
            {reportType === "items" ? "Daftar Aset" : "Riwayat Transaksi"}
          </h2>
          <Badge variant="outline" className="bg-[#F4F7FE] text-[#4318FF] border-[#4318FF]/20">
            {data.length} data
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-16 text-[#A3AED0]">
            <div className="animate-spin h-8 w-8 border-4 border-[#4318FF] border-t-transparent rounded-full mx-auto mb-3" />
            <p className="font-medium">Memuat data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-[#A3AED0]">
            <FileBarChart className="h-12 w-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium">Tidak ada data ditemukan untuk filter ini.</p>
          </div>
        ) : reportType === "items" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-bold text-[#A3AED0]">Kode</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Nama Aset</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Pemilik</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Kategori</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Lokasi</TableHead>
                  <TableHead className="font-bold text-[#A3AED0] text-center">Qty</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Kondisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="border-b border-gray-50">
                    <TableCell className="font-mono text-sm text-[#A3AED0]">{item.item_code}</TableCell>
                    <TableCell className="font-bold text-[#2B3674]">{item.name}</TableCell>
                    <TableCell className="text-sm text-[#A3AED0]">{item.profiles?.email ?? "-"}</TableCell>
                    <TableCell className="text-[#2B3674]">{item.categories?.name ?? "-"}</TableCell>
                    <TableCell className="text-[#2B3674]">{item.locations?.name ?? "-"}</TableCell>
                    <TableCell className="text-center font-bold text-[#2B3674]">{item.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.condition === "Baik"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : item.condition === "Rusak"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }
                      >
                        {item.condition}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-bold text-[#A3AED0]">Tanggal</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Aset</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Pemilik</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Tipe</TableHead>
                  <TableHead className="font-bold text-[#A3AED0] text-center">Qty</TableHead>
                  <TableHead className="font-bold text-[#A3AED0]">Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((tx) => (
                  <TableRow key={tx.id} className="border-b border-gray-50">
                    <TableCell className="text-sm text-[#A3AED0]">
                      {new Date(tx.transaction_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-bold text-[#2B3674]">{tx.items?.name ?? "-"}</TableCell>
                    <TableCell className="text-sm text-[#A3AED0]">{tx.profiles?.email ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${
                          tx.transaction_type === "masuk"
                            ? "bg-[#01B574] text-white"
                            : tx.transaction_type === "mutasi"
                            ? "bg-[#4318FF] text-white"
                            : "bg-[#EE5D50] text-white"
                        }`}
                      >
                        {tx.transaction_type === "masuk" ? "MASUK" : tx.transaction_type === "mutasi" ? "MUTASI" : "KELUAR"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-[#2B3674]">{tx.quantity}</TableCell>
                    <TableCell className="text-sm text-[#A3AED0] max-w-[200px] truncate">{tx.notes ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
