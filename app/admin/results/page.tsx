import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"
import { createServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { ResultsManager } from "@/components/admin/results-manager"

export default async function AdminResultsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get recent results
  const { data: recentResults } = await supabase
    .from("lottery_results")
    .select("*")
    .order("contest_number", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Resultados</h1>
            <p className="text-muted-foreground">Importe, adicione e gerencie resultados da Lotofácil</p>
          </div>

          <ResultsManager initialResults={recentResults || []} />
        </div>
      </main>
    </div>
  )
}
