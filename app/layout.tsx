import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Lotofy - Previsões Inteligentes para Lotofácil",
  description:
    "Use análise estatística e IA para fazer previsões mais assertivas na Lotofácil. Baseado em dados históricos e padrões matemáticos.",
  generator: "Lotofy",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="page-enter">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
