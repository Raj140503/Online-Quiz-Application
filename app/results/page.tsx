"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, RotateCcw, Home, Award } from "lucide-react"

interface QuizResult {
  questionId: number
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  options: {
    A: string
    B: string
    C: string
    D: string
  }
}

interface Badge {
  name: string
  emoji: string
  color: string
}

interface QuizResults {
  score: number
  totalQuestions: number
  percentage: number
  results: QuizResult[]
  userName: string
  badge: Badge
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<QuizResults | null>(null)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem("quizResults")
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)
      setResults(parsedResults)

      // Animate score counting up
      const targetScore = parsedResults.score
      let currentScore = 0
      const increment = targetScore / 30 // Animate over ~1 second (30 frames)

      const scoreAnimation = setInterval(() => {
        currentScore += increment
        if (currentScore >= targetScore) {
          setAnimatedScore(targetScore)
          clearInterval(scoreAnimation)

          // Show confetti for good scores (70% or higher)
          if (parsedResults.percentage >= 70) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }

          setTimeout(() => setShowBadge(true), 500)
        } else {
          setAnimatedScore(Math.floor(currentScore))
        }
      }, 33) // ~30fps

      return () => clearInterval(scoreAnimation)
    } else {
      // Redirect to home if no results found
      router.push("/")
    }
  }, [router])

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! You're a quiz master!"
    if (percentage >= 80) return "Excellent work! You really know your stuff!"
    if (percentage >= 70) return "Great job! You did really well!"
    if (percentage >= 60) return "Good effort! Keep learning and improving!"
    if (percentage >= 50) return "Not bad! There's room for improvement!"
    return "Keep practicing! Every attempt makes you smarter!"
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-secondary"
    if (percentage >= 60) return "text-accent"
    return "text-destructive"
  }

  const getBadgeColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900",
      purple: "bg-gradient-to-r from-purple-400 to-purple-600 text-purple-900",
      blue: "bg-gradient-to-r from-blue-400 to-blue-600 text-blue-900",
      green: "bg-gradient-to-r from-green-400 to-green-600 text-green-900",
      orange: "bg-gradient-to-r from-orange-400 to-orange-600 text-orange-900",
      yellow: "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900",
      red: "bg-gradient-to-r from-red-400 to-red-600 text-red-900",
    }
    return colorMap[color] || "bg-gradient-to-r from-gray-400 to-gray-600 text-gray-900"
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <Card className="p-8 mb-8 text-center bg-gradient-to-br from-card via-card to-muted/20 animate-bounce-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Great job, {results.userName}!</h1>
          <p className="text-lg text-muted-foreground mb-6">Quiz Complete!</p>

          {/* Animated Score Display */}
          <div className="mb-6">
            <div
              className={`text-6xl md:text-8xl font-bold mb-2 animate-count-up ${getScoreColor(results.percentage)}`}
            >
              {animatedScore}
              <span className="text-4xl md:text-5xl">/{results.totalQuestions}</span>
            </div>
            <div className={`text-2xl md:text-3xl font-semibold ${getScoreColor(results.percentage)}`}>
              {results.percentage}%
            </div>
          </div>

          {showBadge && (
            <div className="mb-6 animate-bounce-in">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold shadow-lg ${getBadgeColorClasses(results.badge.color)}`}
              >
                <Award className="w-6 h-6" />
                <span className="text-2xl">{results.badge.emoji}</span>
                <span>{results.badge.name}</span>
              </div>
            </div>
          )}

          {/* Score Message */}
          <p className="text-xl md:text-2xl text-foreground mb-8 text-balance">{getScoreMessage(results.percentage)}</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                sessionStorage.removeItem("quizResults")
                sessionStorage.removeItem("userName")
                router.push("/")
              }}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Take New Quiz
            </Button>
            <Button onClick={() => router.push("/")} variant="outline" size="lg" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </div>
        </Card>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Review Your Answers</h2>

          {results.results.map((result, index) => (
            <Card key={result.questionId} className="p-6">
              <div className="flex items-start gap-4">
                {/* Question Number & Status */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      result.isCorrect
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-destructive text-destructive-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1">
                  {/* Question */}
                  <h3 className="text-lg font-semibold text-foreground mb-4">{result.question}</h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {Object.entries(result.options).map(([key, text]) => {
                      const isUserAnswer = result.userAnswer === key
                      const isCorrectAnswer = result.correctAnswer === key
                      const isWrongUserAnswer = isUserAnswer && !result.isCorrect

                      return (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                            isCorrectAnswer
                              ? "bg-secondary/20 border-secondary text-secondary-foreground"
                              : isWrongUserAnswer
                                ? "bg-destructive/20 border-destructive text-destructive-foreground"
                                : "bg-muted border-border"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              isCorrectAnswer
                                ? "bg-secondary text-secondary-foreground"
                                : isWrongUserAnswer
                                  ? "bg-destructive text-destructive-foreground"
                                  : "bg-muted-foreground text-muted"
                            }`}
                          >
                            {key}
                          </div>
                          <span className="flex-1">{text}</span>
                          {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-secondary" />}
                          {isWrongUserAnswer && <XCircle className="w-5 h-5 text-destructive" />}
                        </div>
                      )
                    })}
                  </div>

                  {/* Answer Status */}
                  <div className="flex items-center gap-2 text-sm">
                    {result.isCorrect ? (
                      <div className="flex items-center gap-2 text-secondary">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Correct!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-destructive">
                        <XCircle className="w-4 h-4" />
                        <span className="font-medium">
                          Your answer: {result.userAnswer} | Correct answer: {result.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
            <h3 className="text-xl font-bold text-foreground mb-2">Ready for Another Challenge?</h3>
            <p className="text-muted-foreground mb-4">
              Test your knowledge again and see if you can earn a better badge!
            </p>
            <Button
              onClick={() => {
                sessionStorage.removeItem("quizResults")
                sessionStorage.removeItem("userName")
                router.push("/")
              }}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              Start New Quiz
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
