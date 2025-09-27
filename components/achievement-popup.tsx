"use client"

import { useEffect, useState } from "react"
import type { Achievement } from "@/lib/achievements"
import { Card } from "@/components/ui/card"

interface AchievementPopupProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const rarityColors = {
    common: "from-gray-400 to-gray-600",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-yellow-600",
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card
        className={`p-6 bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white shadow-2xl border-0 animate-bounce-in`}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">{achievement.icon}</div>
          <div>
            <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
            <p className="font-semibold">{achievement.name}</p>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
