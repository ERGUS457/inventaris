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

  return (
    <div className="min-h-screen bg-[#F4F7FE] print:bg-white text-[#2B3674] font-sans">
      {/* Fixed sidebar (desktop) */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* Main area shifted right on md+ */}
      <div className="md:pl-72 flex flex-col min-h-screen print:pl-0">
        <div className="print:hidden">
          <Header userEmail={user.email ?? "Pengguna"} />
        </div>
        <main className="flex-1 p-6 md:p-8 lg:p-10 print:p-0 print:m-0">{children}</main>
      </div>
    </div>
  );
}
