"use client";

import { Profile } from "@/lib/types";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toggleUserRole, toggleUserVerification } from "@/app/actions/users";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface UsersTableProps {
  initialData: Profile[];
  currentUserId: string;
}

export function UsersTable({ initialData, currentUserId }: UsersTableProps) {
  
  async function handleToggleVerification(userId: string, currentStatus: boolean) {
    toast.promise(toggleUserVerification(userId, !currentStatus), {
      loading: "Memperbarui status verifikasi...",
      success: (result) => {
        if (result.error) throw new Error(result.error);
        return `Status verifikasi berhasil diperbarui`;
      },
      error: (err) => `Gagal memperbarui: ${err.message}`,
    });
  }

  async function handleToggleRole(userId: string, currentRole: string) {
    toast.promise(toggleUserRole(userId, currentRole), {
      loading: "Mengubah hak akses...",
      success: (result) => {
        if (result.error) throw new Error(result.error);
        return `Hak akses berhasil diubah`;
      },
      error: (err) => `Gagal mengubah hak akses: ${err.message}`,
    });
  }

  return (
    <Card className="rounded-[20px] border-none bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-bold text-[#A3AED0]">Email</TableHead>
              <TableHead className="font-bold text-[#A3AED0]">Perusahaan</TableHead>
              <TableHead className="font-bold text-[#A3AED0]">Terdaftar Pada</TableHead>
              <TableHead className="font-bold text-[#A3AED0]">Role</TableHead>
              <TableHead className="font-bold text-[#A3AED0]">Akses Superadmin</TableHead>
              <TableHead className="font-bold text-[#A3AED0] text-right">Verifikasi Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((profile) => (
              <TableRow key={profile.id} className="border-b border-gray-50">
                <TableCell className="font-bold text-[#2B3674]">
                  {profile.email}
                  {profile.id === currentUserId && (
                    <span className="ml-2 text-xs font-normal text-[#A3AED0]">(Anda)</span>
                  )}
                </TableCell>
                <TableCell className="text-[#2B3674] font-medium">
                  {profile.company_name || "-"}
                </TableCell>
                <TableCell className="text-[#2B3674] font-medium">
                  {format(new Date(profile.created_at), "dd MMM yyyy, HH:mm", { locale: id })}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      profile.role === "superadmin"
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }
                  >
                    {profile.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={profile.role === "superadmin"}
                    disabled={profile.id === currentUserId}
                    onCheckedChange={() => handleToggleRole(profile.id, profile.role)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm font-medium text-[#2B3674]">
                      {profile.is_verified ? "Terverifikasi" : "Menunggu"}
                    </span>
                    <Switch 
                      checked={profile.is_verified}
                      disabled={profile.id === currentUserId}
                      onCheckedChange={() => handleToggleVerification(profile.id, profile.is_verified)}
                      className={profile.is_verified ? "data-[state=checked]:bg-green-500" : ""}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-[#A3AED0]">
                  Belum ada pengguna terdaftar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
