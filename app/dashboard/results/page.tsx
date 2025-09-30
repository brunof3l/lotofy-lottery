import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdvancedResultsViewer } from "@/components/dashboard/advanced-results-viewer"
import { MobileLayout } from "@/components/mobile/mobile-layout"

export const dynamic = "force-dynamic"

export default async function ResultsPage() {
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Resultados da Lotofácil</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Consulte os resultados históricos e análises de frequência
              </p>
            </div>

            <div className="space-y-6">
              <AdvancedResultsViewer limit={100} />
            </div>
          </div>
        </main>
      </div>
    </MobileLayout>
  )
}
