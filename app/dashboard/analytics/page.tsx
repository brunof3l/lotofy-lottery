import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { MobileLayout } from "@/components/mobile/mobile-layout"

export default async function AnalyticsPage() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get analytics data
  const [{ data: recentResults }, { data: userPredictions }, { data: allResults }] = await Promise.all([
    supabase.from("lottery_results").select("*").order("contest_number", { ascending: false }).limit(100),
    supabase.from("user_predictions").select("*").eq("user_id", data.user.id).order("created_at", { ascending: false }),
    supabase
      .from("lottery_results")
      .select("numbers, draw_date, contest_number")
      .order("contest_number", { ascending: false })
      .limit(500),
  ])

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        <DashboardHeader user={data.user} profile={profile} />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Análises Avançadas</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Insights detalhados sobre padrões e tendências da Lotofácil
              </p>
            </div>

            <AnalyticsDashboard
              recentResults={recentResults || []}
              userPredictions={userPredictions || []}
              allResults={allResults || []}
              userId={data.user.id}
            />
          </div>
        </main>
      </div>
    </MobileLayout>
  )
}
