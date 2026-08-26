import { Metadata } from "next";
import { getProfiles } from "@/app/actions/users";
import { UsersTable } from "@/components/users/users-table";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Manajemen Pengguna - Aplikasi Inventaris",
};

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  
  if (profile?.role !== "superadmin") {
    redirect("/"); // Or show unauthorized
  }

  const { data: profiles, error } = await getProfiles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2B3674]">Manajemen Pengguna</h1>
          <p className="text-[#A3AED0] mt-1">Verifikasi dan atur peran (role) pengguna aplikasi Anda.</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Gagal memuat data pengguna: {error}
        </div>
      ) : (
        <UsersTable initialData={profiles} currentUserId={user.id} />
      )}
    </div>
  );
}
