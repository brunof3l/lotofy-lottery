"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Target, BarChart3, Calendar, Settings } from "lucide-react"

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/dashboard/predictions", icon: Target, label: "Previsões" },
    { href: "/dashboard/results", icon: Calendar, label: "Resultados" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Análises" },
    { href: "/dashboard/profile", icon: Settings, label: "Perfil" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
