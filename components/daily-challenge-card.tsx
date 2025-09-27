"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTodaysChallenge, type DailyChallenge } from "@/lib/daily-challenges"
import { useRouter } from "next/navigation"

export function DailyChallengeCard() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const router = useRouter()

  useEffect(() => {
    setChallenge(getTodaysChallenge())
  }, [])

  if (!challenge) return null

  const difficultyColors = {
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
  }

  const handleStartChallenge = () => {
    sessionStorage.setItem("dailyChallenge", JSON.stringify(challenge))
    router.push("/daily-challenge")
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{challenge.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{challenge.title}</h3>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>
        </div>
        <Badge className={`${difficultyColors[challenge.difficulty]} text-white`}>
          {challenge.difficulty.toUpperCase()}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>🏆</span>
            <span>{challenge.reward.points} points</span>
          </div>
          {challenge.reward.powerUps && (
            <div className="flex items-center gap-1">
              <span>⚡</span>
              <span>Power-ups</span>
            </div>
          )}
        </div>

        {challenge.completed ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            ✓ Completed
          </Badge>
        ) : (
          <Button
            onClick={handleStartChallenge}
            size="sm"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            Start Challenge
          </Button>
        )}
      </div>
    </Card>
  )
}
