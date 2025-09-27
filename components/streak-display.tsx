"use client"

import { useEffect, useState } from "react"
import { getUserStats } from "@/lib/achievements"

export function StreakDisplay() {
  const [stats, setStats] = useState({ currentStreak: 0, maxStreak: 0 })
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const userStats = getUserStats()
    setStats({ currentStreak: userStats.currentStreak, maxStreak: userStats.maxStreak })
  }, [])

  useEffect(() => {
    if (stats.currentStreak > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [stats.currentStreak])

  if (stats.currentStreak === 0) return null

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg transition-all duration-300 ${
        isAnimating ? "scale-110 animate-pulse" : ""
      }`}
    >
      <span className="text-xl">🔥</span>
      <span className="text-lg">{stats.currentStreak} Streak!</span>
      {stats.maxStreak > stats.currentStreak && <span className="text-sm opacity-80">Best: {stats.maxStreak}</span>}
    </div>
  )
}
