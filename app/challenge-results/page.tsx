"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import type { DailyChallenge } from "@/lib/daily-challenges"

interface ChallengeResults {
  score: number
  totalQuestions: number
  percentage: number
  results: Array<{
    questionId: number
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }>
  challenge: DailyChallenge
}

export default function ChallengeResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<ChallengeResults | null>(null)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const storedResults = sessionStorage.getItem("challengeResults")
    if (!storedResults) {
      router.push("/")
      return
    }

    const parsedResults = JSON.parse(storedResults)
    setResults(parsedResults)

    // Animate score counting
    let current = 0
    const target = parsedResults.score
    const increment = target / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setAnimatedScore(Math.floor(current))
    }, 30)

    return () => clearInterval(timer)
  }, [router])

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  const difficultyColors = {
    easy: "from-green-500 to-green-600",
    medium: "from-yellow-500 to-yellow-600",
    hard: "from-red-500 to-red-600",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">{results.challenge.icon}</span>
            <h1 className="text-3xl font-bold text-foreground">Challenge Complete!</h1>
            <Badge className={`bg-gradient-to-r ${difficultyColors[results.challenge.difficulty]} text-white`}>
              {results.challenge.difficulty.toUpperCase()}
            </Badge>
          </div>

          <div className="text-6xl font-bold text-yellow-600 mb-4 animate-count-up">
            {animatedScore}/{results.totalQuestions}
          </div>

          <div className="text-2xl font-semibold text-muted-foreground mb-6">{results.percentage}% Correct</div>

          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">+{results.challenge.reward.points}</div>
              <div className="text-sm text-muted-foreground">Bonus Points</div>
            </div>
            {results.challenge.reward.powerUps && (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">⚡</div>
                <div className="text-sm text-muted-foreground">Power-ups Earned</div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push("/")} variant="outline" size="lg">
              Back to Home
            </Button>
            <Button
              onClick={() => router.push("/quiz")}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              Take Regular Quiz
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Challenge Review</h2>
          <div className="space-y-4">
            {results.results.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      result.isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {result.isCorrect ? "✓" : "✗"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">
                      Question {index + 1}: {result.question}
                    </h3>
                    <div className="text-sm space-y-1">
                      <div
                        className={
                          result.isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                        }
                      >
                        Your answer: {result.userAnswer}
                      </div>
                      {!result.isCorrect && (
                        <div className="text-green-700 dark:text-green-300">Correct answer: {result.correctAnswer}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
