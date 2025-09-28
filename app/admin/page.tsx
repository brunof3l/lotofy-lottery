import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Verifica se é admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return <div>Área restrita do Admin ✅</div>
}
