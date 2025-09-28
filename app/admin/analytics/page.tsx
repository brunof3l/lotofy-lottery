import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminAnalytics } from "@/components/admin/admin-analytics"

export const metadata = {
  title: "Analytics Administrativo | Lotofy",
  description: "Visão completa do sistema e performance dos usuários",
}

type LotteryResult = {
  // defina os campos conforme sua tabela
}
type UserPrediction = {
  // defina os campos conforme sua tabela
}
type UserProfile = {
  id: string
  full_name: string
  created_at: string
  role: string
}

export default async function AdminAnalyticsPage() {
  const supabase = createServerClient()

  const {
    data: { user } = {},
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
    return null
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile || profile.role !== "admin") {
    redirect("/dashboard")
    return null
  }

  // Get comprehensive analytics data
  const [
    { data: allResults = [], error: resultsError },
    { data: allPredictions = [], error: predictionsError },
    { data: userStats = [], error: usersError },
    { data: systemStats = [], error: systemError }
  ] = await Promise.all([
    supabase.from("lottery_results").select("*").order("contest_number", { ascending: false }),
    supabase.from("user_predictions").select("*, profiles(full_name)").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, created_at, role"),
    supabase.from("lottery_results").select("id"),
  ])

  // Opcional: tratar erros das queries de analytics
  // if (resultsError || predictionsError || usersError || systemError) { ... }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Administrativo</h1>
            <p className="text-muted-foreground">Visão completa do sistema e performance dos usuários</p>
          </div>

          <AdminAnalytics
            results={allResults}
            predictions={allPredictions}
            users={userStats}
            systemStats={{
              totalResults: systemStats.length,
              totalPredictions: allPredictions.length,
              totalUsers: userStats.length,
            }}
          />
        </div>
      </main>
    </div>
  )
}
