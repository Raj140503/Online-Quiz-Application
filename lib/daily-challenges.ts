export interface DailyChallenge {
  id: string
  date: string
  title: string
  description: string
  theme: string
  icon: string
  reward: {
    points: number
    powerUps?: {
      fiftyFifty?: number
      extraTime?: number
      skipQuestion?: number
    }
  }
  difficulty: "easy" | "medium" | "hard"
  completed: boolean
}

export const challengeThemes = [
  {
    theme: "Science",
    icon: "🔬",
    description: "Test your scientific knowledge",
    categories: ["science", "biology", "chemistry", "physics"],
  },
  {
    theme: "History",
    icon: "📚",
    description: "Journey through time",
    categories: ["history", "ancient", "modern"],
  },
  {
    theme: "Geography",
    icon: "🌍",
    description: "Explore the world",
    categories: ["geography", "countries", "capitals"],
  },
  {
    theme: "Technology",
    icon: "💻",
    description: "Digital age knowledge",
    categories: ["technology", "computers", "internet"],
  },
  {
    theme: "Sports",
    icon: "⚽",
    description: "Athletic achievements",
    categories: ["sports", "olympics", "football"],
  },
  {
    theme: "Arts & Culture",
    icon: "🎨",
    description: "Creative expressions",
    categories: ["art", "music", "literature"],
  },
  {
    theme: "Mixed Bag",
    icon: "🎲",
    description: "A bit of everything",
    categories: ["general", "mixed"],
  },
]

export function generateDailyChallenge(date: Date): DailyChallenge {
  const dateString = date.toISOString().split("T")[0]
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)

  const themeIndex = dayOfYear % challengeThemes.length
  const theme = challengeThemes[themeIndex]

  const difficulties = ["easy", "medium", "hard"] as const
  const difficultyIndex = dayOfYear % 3
  const difficulty = difficulties[difficultyIndex]

  const rewards = {
    easy: { points: 100, powerUps: { fiftyFifty: 1 } },
    medium: { points: 200, powerUps: { fiftyFifty: 1, extraTime: 1 } },
    hard: { points: 300, powerUps: { fiftyFifty: 2, extraTime: 1, skipQuestion: 1 } },
  }

  return {
    id: `daily-${dateString}`,
    date: dateString,
    title: `${theme.theme} Challenge`,
    description: `${theme.description} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty`,
    theme: theme.theme,
    icon: theme.icon,
    reward: rewards[difficulty],
    difficulty,
    completed: false,
  }
}

export function getTodaysChallenge(): DailyChallenge {
  const today = new Date()
  const challenge = generateDailyChallenge(today)

  if (typeof window !== "undefined") {
    const completed = localStorage.getItem(`challenge-${challenge.id}`)
    challenge.completed = completed === "true"
  }

  return challenge
}

export function markChallengeCompleted(challengeId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(`challenge-${challengeId}`, "true")
  }
}

export function getChallengeHistory(): DailyChallenge[] {
  if (typeof window === "undefined") return []

  const history: DailyChallenge[] = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const challenge = generateDailyChallenge(date)
    const completed = localStorage.getItem(`challenge-${challenge.id}`)
    challenge.completed = completed === "true"
    history.push(challenge)
  }

  return history
}
