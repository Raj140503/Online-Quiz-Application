"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme, type Theme } from "@/lib/theme"
import { useState } from "react"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  ]

  const currentTheme = themes.find((t) => t.value === theme)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50"
      >
        {currentTheme?.icon}
        <span className="hidden sm:inline">{currentTheme?.label}</span>
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute top-full right-0 mt-2 p-2 z-50 min-w-32 bg-background/95 backdrop-blur-sm border-border/50 shadow-lg">
            {themes.map((themeOption) => (
              <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setTheme(themeOption.value)
                  setIsOpen(false)
                }}
                className="w-full justify-start gap-2 mb-1 last:mb-0"
              >
                {themeOption.icon}
                {themeOption.label}
              </Button>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}
