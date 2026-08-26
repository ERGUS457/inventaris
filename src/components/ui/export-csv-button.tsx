"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportCSVButtonProps {
  data: any[];
  filename: string;
}

export function ExportCSVButton({ data, filename }: ExportCSVButtonProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    // Extract headers
    const headers = Object.keys(data[0]);

    // Convert rows to CSV string
    const csvRows = [
      headers.join(","), // Header row
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            let value = row[fieldName];
            
            // Handle null/undefined
            if (value === null || value === undefined) {
              value = "";
            } else if (typeof value === "object") {
              // If it's a joined object (like categories or locations), try to get the name
              value = value.name || JSON.stringify(value);
            }
            
            // Escape quotes and wrap in quotes to handle commas
            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
          })
          .join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      variant="outline" 
      onClick={exportToCSV}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
