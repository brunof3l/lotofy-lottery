import type React from "react"
import { MobileBottomNav } from "./mobile-bottom-nav"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="pb-16 md:pb-0">{children}</div>
      <MobileBottomNav />
    </div>
  )
}
