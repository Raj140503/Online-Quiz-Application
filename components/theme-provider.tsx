"use client"

import type React from "react"

import { useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const root = window.document.documentElement

    const updateTheme = () => {
      let resolvedTheme: "light" | "dark"

      if (!stored || stored === "system") {
        resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } else {
        resolvedTheme = stored as "light" | "dark"
      }

      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)
    }

    updateTheme()

    if (!stored || stored === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", updateTheme)
      return () => mediaQuery.removeEventListener("change", updateTheme)
    }
  }, [])

  return <>{children}</>
}
