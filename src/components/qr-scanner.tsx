"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const initScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Stop scanning once we get a result
            if (scannerRef.current?.isScanning) {
              scannerRef.current.stop().then(() => {
                onScanSuccess(decodedText);
              });
            }
          },
          (errorMessage) => {
            // Ignore regular scanning errors (it just means no QR code in frame yet)
          }
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
        setError("Gagal mengakses kamera. Pastikan Anda telah memberikan izin kamera.");
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md relative bg-white dark:bg-[#111c44] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2 text-[#2B3674] dark:text-white font-bold">
            <Camera className="w-5 h-5" />
            <h3>Scan Barcode / QR</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Scanner Area */}
        <div className="p-4 bg-slate-900 flex flex-col items-center justify-center min-h-[300px]">
          {error ? (
            <div className="text-center p-6">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={onClose} variant="secondary">Tutup</Button>
            </div>
          ) : (
            <div id="reader" className="w-full h-full rounded-lg overflow-hidden border-2 border-dashed border-[#4318FF]/50" />
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Arahkan kamera ke Barcode atau QR Code aset. Sistem akan membacanya secara otomatis.
        </div>
      </div>
    </div>
  );
}
