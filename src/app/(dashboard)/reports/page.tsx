import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Package, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pusat Laporan",
};

export default function ReportsPage() {
  const reports = [
    {
      title: "Laporan Seluruh Aset",
      description: "Cetak dokumen PDF berisi daftar lengkap seluruh aset yang terdaftar di perusahaan beserta jumlah dan kondisinya.",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/reports/print?type=aset",
    },
    {
      title: "Laporan Riwayat Transaksi",
      description: "Cetak dokumen PDF berisi daftar seluruh aktivitas barang masuk dan keluar beserta catatan dari admin terkait.",
      icon: ClipboardList,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      href: "/reports/print?type=transaksi",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Pusat Laporan</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
          Pilih jenis laporan yang ingin Anda cetak (Export PDF).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.title} className="shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] dark:shadow-none border-none dark:bg-[#111c44] rounded-[20px] overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${report.bg} dark:bg-white/10`}>
                  <report.icon className={`h-6 w-6 ${report.color} dark:text-white`} />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-800 dark:text-white">{report.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 min-h-[40px]">
                {report.description}
              </CardDescription>
              <Link 
                href={report.href}
                className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-11 px-4 py-2 w-full bg-[#4318FF] hover:bg-[#4318FF]/90 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <FileText className="mr-2 h-4 w-4" />
                Pratinjau & Cetak PDF
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
