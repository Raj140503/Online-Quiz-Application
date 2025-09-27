export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: UserStats) => boolean
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface UserStats {
  totalQuizzes: number
  totalCorrect: number
  totalQuestions: number
  currentStreak: number
  maxStreak: number
  perfectScores: number
  averageTime: number
  achievements: string[]
}

export const achievements: Achievement[] = [
  {
    id: "first_quiz",
    name: "Getting Started",
    description: "Complete your first quiz",
    icon: "🎯",
    condition: (stats) => stats.totalQuizzes >= 1,
    rarity: "common",
  },
  {
    id: "streak_3",
    name: "On Fire",
    description: "Get 3 correct answers in a row",
    icon: "🔥",
    condition: (stats) => stats.currentStreak >= 3,
    rarity: "common",
  },
  {
    id: "streak_5",
    name: "Hot Streak",
    description: "Get 5 correct answers in a row",
    icon: "⚡",
    condition: (stats) => stats.currentStreak >= 5,
    rarity: "rare",
  },
  {
    id: "streak_10",
    name: "Unstoppable",
    description: "Get 10 correct answers in a row",
    icon: "💫",
    condition: (stats) => stats.currentStreak >= 10,
    rarity: "epic",
  },
  {
    id: "perfect_score",
    name: "Perfectionist",
    description: "Score 100% on a quiz",
    icon: "👑",
    condition: (stats) => stats.perfectScores >= 1,
    rarity: "rare",
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Average less than 15 seconds per question",
    icon: "🏃‍♂️",
    condition: (stats) => stats.averageTime < 15,
    rarity: "epic",
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Complete 10 quizzes",
    icon: "🎓",
    condition: (stats) => stats.totalQuizzes >= 10,
    rarity: "legendary",
  },
]

export function checkNewAchievements(stats: UserStats): Achievement[] {
  return achievements.filter(
    (achievement) => achievement.condition(stats) && !stats.achievements.includes(achievement.id),
  )
}

export function getUserStats(): UserStats {
  if (typeof window === "undefined") {
    return {
      totalQuizzes: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      currentStreak: 0,
      maxStreak: 0,
      perfectScores: 0,
      averageTime: 0,
      achievements: [],
    }
  }

  const stored = localStorage.getItem("userStats")
  if (stored) {
    return JSON.parse(stored)
  }

  return {
    totalQuizzes: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    currentStreak: 0,
    maxStreak: 0,
    perfectScores: 0,
    averageTime: 0,
    achievements: [],
  }
}

export function updateUserStats(newStats: Partial<UserStats>): UserStats {
  const currentStats = getUserStats()
  const updatedStats = { ...currentStats, ...newStats }

  if (typeof window !== "undefined") {
    localStorage.setItem("userStats", JSON.stringify(updatedStats))
  }

  return updatedStats
}
