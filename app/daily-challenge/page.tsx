"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { markChallengeCompleted, type DailyChallenge } from "@/lib/daily-challenges"
import { updateUserPowerUps, getUserPowerUps } from "@/lib/powerups"
import { ThemeToggle } from "@/components/theme-toggle"

interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

export default function DailyChallengePage() {
  const router = useRouter()
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName")
    const storedChallenge = sessionStorage.getItem("dailyChallenge")

    if (!storedName || !storedChallenge) {
      router.push("/")
      return
    }

    setUserName(storedName)
    setChallenge(JSON.parse(storedChallenge))
    fetchChallengeQuestions()
  }, [])

  useEffect(() => {
    setTimeLeft(30)
  }, [currentQuestionIndex])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        handleNext()
      } else {
        handleSubmitChallenge()
      }
    }
  }, [timeLeft, currentQuestionIndex, questions.length])

  const fetchChallengeQuestions = async () => {
    try {
      const response = await fetch("/api/questions?challenge=true")
      const data = await response.json()
      setQuestions(data.questions.slice(0, 10)) // Daily challenges are shorter
      setLoading(false)
    } catch (error) {
      console.error("Error fetching challenge questions:", error)
      setLoading(false)
    }
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    const currentQuestion = questions[currentQuestionIndex]
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id.toString()]: option,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption("")
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevAnswer = answers[questions[currentQuestionIndex - 1].id.toString()]
      setSelectedOption(prevAnswer || "")
    }
  }

  const handleSubmitChallenge = async () => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers, userName, isChallenge: true }),
      })

      const results = await response.json()

      if (challenge) {
        markChallengeCompleted(challenge.id)

        // Award challenge rewards
        if (challenge.reward.powerUps) {
          const currentPowerUps = getUserPowerUps()
          const updatedPowerUps = {
            ...currentPowerUps,
            fiftyFifty: currentPowerUps.fiftyFifty + (challenge.reward.powerUps.fiftyFifty || 0),
            extraTime: currentPowerUps.extraTime + (challenge.reward.powerUps.extraTime || 0),
            skipQuestion: currentPowerUps.skipQuestion + (challenge.reward.powerUps.skipQuestion || 0),
          }
          updateUserPowerUps(updatedPowerUps)
        }
      }

      sessionStorage.setItem("challengeResults", JSON.stringify({ ...results, challenge }))
      router.push("/challenge-results")
    } catch (error) {
      console.error("Error submitting challenge:", error)
    }
  }

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, "0")
  }

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading daily challenge...</p>
        </div>
      </div>
    )
  }

  if (!challenge || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">Challenge not available. Please try again later.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{challenge.icon}</span>
                <h1 className="text-2xl font-bold text-foreground">{challenge.title}</h1>
                <Badge className={`bg-gradient-to-r ${difficultyColors[challenge.difficulty]} text-white`}>
                  {challenge.difficulty.toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">Daily Challenge - {userName}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold text-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-full transition-all duration-300 ${
                  timeLeft <= 10
                    ? "bg-destructive text-destructive-foreground animate-pulse scale-110"
                    : timeLeft <= 20
                      ? "bg-orange-500 text-white animate-pulse"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-3 bg-muted" />
        </div>

        <Card className="p-8 mb-8 animate-bounce-in border-yellow-200 dark:border-yellow-800">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance">
            {currentQuestion.question_text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { key: "A", text: currentQuestion.option_a },
              { key: "B", text: currentQuestion.option_b },
              { key: "C", text: currentQuestion.option_c },
              { key: "D", text: currentQuestion.option_d },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleOptionSelect(option.key)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 hover:scale-105 ${
                  selectedOption === option.key
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg ring-4 ring-yellow-300"
                    : "bg-card hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-2 border-border hover:border-yellow-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      selectedOption === option.key ? "bg-white text-yellow-600" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {option.key}
                  </div>
                  <span className="text-lg">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-yellow-500"
                    : answers[questions[index].id.toString()]
                      ? "bg-orange-500"
                      : "bg-muted"
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmitChallenge}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2"
            >
              Complete Challenge
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
