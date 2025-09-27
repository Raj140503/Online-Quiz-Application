"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getUserPowerUps, updateUserPowerUps, canUsePowerUp, powerUps, type UserPowerUps } from "@/lib/powerups"

interface PowerUpPanelProps {
  onUsePowerUp: (powerUpId: string) => void
  disabled?: boolean
}

export function PowerUpPanel({ onUsePowerUp, disabled = false }: PowerUpPanelProps) {
  const [userPowerUps, setUserPowerUps] = useState<UserPowerUps>({
    fiftyFifty: 0,
    extraTime: 0,
    skipQuestion: 0,
    usedThisQuiz: { fiftyFifty: 0, extraTime: 0, skipQuestion: 0 },
  })

  useEffect(() => {
    setUserPowerUps(getUserPowerUps())
  }, [])

  const handleUsePowerUp = (powerUpId: string) => {
    if (!canUsePowerUp(powerUpId, userPowerUps) || disabled) return

    const updatedPowerUps = {
      ...userPowerUps,
      usedThisQuiz: {
        ...userPowerUps.usedThisQuiz,
        [powerUpId]: userPowerUps.usedThisQuiz[powerUpId as keyof UserPowerUps["usedThisQuiz"]] + 1,
      },
    }

    setUserPowerUps(updatedPowerUps)
    updateUserPowerUps(updatedPowerUps)
    onUsePowerUp(powerUpId)
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-800">
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="text-xl">⚡</span>
        Power-ups
      </h3>
      <div className="flex gap-2">
        {powerUps.map((powerUp) => {
          const available = userPowerUps[powerUp.id as keyof UserPowerUps] as number
          const used = userPowerUps.usedThisQuiz[powerUp.id as keyof UserPowerUps["usedThisQuiz"]]
          const canUse = canUsePowerUp(powerUp.id, userPowerUps) && !disabled
          const remaining = powerUp.maxUses - used

          return (
            <Button
              key={powerUp.id}
              onClick={() => handleUsePowerUp(powerUp.id)}
              disabled={!canUse}
              variant={canUse ? "default" : "secondary"}
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-300 ${
                canUse
                  ? "bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="text-lg">{powerUp.icon}</span>
              <span className="text-xs font-semibold">{powerUp.name}</span>
              <span className="text-xs opacity-80">
                {remaining}/{powerUp.maxUses}
              </span>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
