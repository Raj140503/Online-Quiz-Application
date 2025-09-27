export interface PowerUp {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  cooldown: number
  maxUses: number
}

export interface UserPowerUps {
  fiftyFifty: number
  extraTime: number
  skipQuestion: number
  usedThisQuiz: {
    fiftyFifty: number
    extraTime: number
    skipQuestion: number
  }
}

export const powerUps: PowerUp[] = [
  {
    id: "fiftyFifty",
    name: "50/50",
    description: "Remove two incorrect answers",
    icon: "🎯",
    cost: 100,
    cooldown: 0,
    maxUses: 3,
  },
  {
    id: "extraTime",
    name: "Extra Time",
    description: "Add 15 seconds to current question",
    icon: "⏰",
    cost: 150,
    cooldown: 0,
    maxUses: 2,
  },
  {
    id: "skipQuestion",
    name: "Skip Question",
    description: "Skip current question (counts as correct)",
    icon: "⏭️",
    cost: 200,
    cooldown: 0,
    maxUses: 1,
  },
]

export function getUserPowerUps(): UserPowerUps {
  if (typeof window === "undefined") {
    return {
      fiftyFifty: 3,
      extraTime: 2,
      skipQuestion: 1,
      usedThisQuiz: { fiftyFifty: 0, extraTime: 0, skipQuestion: 0 },
    }
  }

  const stored = localStorage.getItem("userPowerUps")
  if (stored) {
    const powerUps = JSON.parse(stored)
    // Reset usedThisQuiz for new quiz session
    powerUps.usedThisQuiz = { fiftyFifty: 0, extraTime: 0, skipQuestion: 0 }
    return powerUps
  }

  return {
    fiftyFifty: 3,
    extraTime: 2,
    skipQuestion: 1,
    usedThisQuiz: { fiftyFifty: 0, extraTime: 0, skipQuestion: 0 },
  }
}

export function updateUserPowerUps(newPowerUps: Partial<UserPowerUps>): UserPowerUps {
  const currentPowerUps = getUserPowerUps()
  const updatedPowerUps = { ...currentPowerUps, ...newPowerUps }

  if (typeof window !== "undefined") {
    localStorage.setItem("userPowerUps", JSON.stringify(updatedPowerUps))
  }

  return updatedPowerUps
}

export function canUsePowerUp(powerUpId: string, userPowerUps: UserPowerUps): boolean {
  const powerUp = powerUps.find((p) => p.id === powerUpId)
  if (!powerUp) return false

  const available = userPowerUps[powerUpId as keyof UserPowerUps] as number
  const used = userPowerUps.usedThisQuiz[powerUpId as keyof UserPowerUps["usedThisQuiz"]]

  return available > 0 && used < powerUp.maxUses
}
