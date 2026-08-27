import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get current user — middleware already protects this route,
  // but we need the user data for the header.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile && !profile.is_verified) {
    await supabase.auth.signOut();
    redirect("/login?error=not_verified");
  }

  const userRole = profile?.role || "user";

  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#0b1437] print:bg-white text-[#2B3674] dark:text-white font-sans transition-colors duration-300">
      {/* Fixed sidebar (desktop) */}
      <div className="print:hidden">
        <Sidebar userRole={userRole} />
      </div>

      {/* Main area shifted right on md+ */}
      <div className="md:pl-72 flex flex-col min-h-screen print:pl-0">
        <div className="print:hidden">
          <Header userEmail={user.email ?? "Pengguna"} userRole={userRole} />
        </div>
        <main className="flex-1 p-6 md:p-8 lg:p-10 print:p-0 print:m-0">{children}</main>
      </div>
    </div>
  );
}
