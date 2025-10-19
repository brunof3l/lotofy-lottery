import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdvancedAnalyticsDashboard } from "@/components/analytics/advanced-analytics-dashboard"
import { MobileLayout } from "@/components/mobile/mobile-layout"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch data needed for analytics
  const { data: recentResults } = await supabase
    .from("lottery_results")
    .select("*")
    .order("contest_number", { ascending: false })
    .limit(30)

  const { data: userPredictions } = await supabase
    .from("user_predictions")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  const { data: allResults } = await supabase
    .from("lottery_results")
    .select("*")
    .order("contest_number", { ascending: false })

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        <DashboardHeader user={data.user} profile={null} />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <AdvancedAnalyticsDashboard
                recentResults={recentResults || []}
                userPredictions={userPredictions || []}
                allResults={allResults || []}
              />
            </div>
          </div>
        </main>
      </div>
    </MobileLayout>
  )
}
