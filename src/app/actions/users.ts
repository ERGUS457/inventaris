"use server";

import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getProfiles() {
  const supabase = await createClient();
  
  // Verify superadmin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Unauthorized" };

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "superadmin") return { data: [], error: "Unauthorized" };

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: data as Profile[], error: null };
}

export async function toggleUserVerification(userId: string, isVerified: boolean) {
  const supabase = await createClient();
  
  // Verify superadmin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "superadmin") return { error: "Unauthorized" };

  const { error } = await supabase
    .from("profiles")
    .update({ is_verified: isVerified })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/users");
  return { error: null };
}

export async function toggleUserRole(userId: string, currentRole: string) {
  const supabase = await createClient();
  
  // Verify superadmin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Cannot change own role
  if (user.id === userId) return { error: "Anda tidak bisa mengubah role Anda sendiri" };

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "superadmin") return { error: "Unauthorized" };

  const newRole = currentRole === "superadmin" ? "user" : "superadmin";

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/users");
  return { error: null };
}
