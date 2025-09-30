"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Alternar tema" className="w-9 px-0">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const next = theme === "system" ? "light" : theme === "light" ? "dark" : "system"
  const icon = theme === "system" ? (
    <Laptop className="h-4 w-4" />
  ) : theme === "light" ? (
    <Sun className="h-4 w-4" />
  ) : (
    <Moon className="h-4 w-4" />
  )

  const label = `Tema: ${theme === "system" ? `Sistema (${systemTheme ?? "desconhecido"})` : theme}`

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={label}
      title={label + " — clique para alternar"}
      onClick={() => setTheme(next)}
      className="w-9 px-0"
    >
      {icon}
    </Button>
  )
}
