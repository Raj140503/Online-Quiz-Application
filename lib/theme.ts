"use client"

import { useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      let newResolvedTheme: "light" | "dark"

      if (theme === "system") {
        newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } else {
        newResolvedTheme = theme
      }

      setResolvedTheme(newResolvedTheme)

      root.classList.remove("light", "dark")
      root.classList.add(newResolvedTheme)
    }

    updateTheme()

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", updateTheme)
      return () => mediaQuery.removeEventListener("change", updateTheme)
    }
  }, [theme])

  const setThemeAndStore = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeAndStore,
  }
}
