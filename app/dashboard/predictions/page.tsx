import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdvancedPredictionGenerator } from "@/components/dashboard/advanced-prediction-generator"
import { UserPredictions } from "@/components/dashboard/user-predictions"
import { MobileLayout } from "@/components/mobile/mobile-layout"

export const dynamic = "force-dynamic"

export default async function PredictionsPage() {
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
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Minhas Previsões</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Gere e gerencie suas previsões inteligentes para a Lotofácil
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Gerador de Previsões */}
              <div className="space-y-6">
                <AdvancedPredictionGenerator userId={data.user.id} />
              </div>

              {/* Histórico de Previsões */}
              <div className="space-y-6">
                <UserPredictions userId={data.user.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </MobileLayout>
  )
}
