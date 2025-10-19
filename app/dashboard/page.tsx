import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { NumberFrequency } from "@/components/dashboard/number-frequency"
import { RecentResults } from "@/components/dashboard/recent-results"
import { PredictionGenerator } from "@/components/dashboard/prediction-generator"
import { UserPredictions } from "@/components/dashboard/user-predictions"
import { MobileLayout } from "@/components/mobile/mobile-layout"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        <DashboardHeader user={data.user} profile={profile} />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Overview */}
            <StatsOverview />

            {/* Main Grid - Made responsive with better mobile layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                <NumberFrequency />
                <RecentResults />
              </div>

              {/* Right Column */}
              <div className="space-y-6 sm:space-y-8">
                <PredictionGenerator />
                <UserPredictions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </MobileLayout>
  )
}
