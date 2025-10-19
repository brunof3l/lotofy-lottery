import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PrizeChecker } from "@/components/dashboard/prize-checker"
import { AdvancedPredictionGenerator } from "@/components/dashboard/advanced-prediction-generator"
import { UserPredictions } from "@/components/dashboard/user-predictions"

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

            <div className="space-y-6 sm:space-y-8">
              {/* Verificador de Prêmios */}
              <PrizeChecker />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Gerador de Previsões */}
                <div className="space-y-6">
                  <AdvancedPredictionGenerator />
                </div>

                {/* Histórico de Previsões */}
                <div className="space-y-6">
                  <UserPredictions />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MobileLayout>
  )
}
