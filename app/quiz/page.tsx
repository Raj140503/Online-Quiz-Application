"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { StreakDisplay } from "@/components/streak-display"
import { AchievementPopup } from "@/components/achievement-popup"
import { PowerUpPanel } from "@/components/powerup-panel"
import { QuizMascot } from "@/components/quiz-mascot"
import { MascotReactions } from "@/components/mascot-reactions"
import { getUserStats, updateUserStats, checkNewAchievements, type Achievement } from "@/lib/achievements"
import { ThemeToggle } from "@/components/theme-toggle"

interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

interface MascotReaction {
  emoji: string
  text: string
  color: string
}

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds per question
  const [userName, setUserName] = useState("")
  const [currentStreak, setCurrentStreak] = useState(0)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([])
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([])
  const [powerUpUsed, setPowerUpUsed] = useState(false)
  const [mascotMood, setMascotMood] = useState<"idle" | "happy" | "excited" | "sad" | "thinking" | "celebrating">(
    "idle",
  )
  const [mascotMessage, setMascotMessage] = useState<string>("")
  const [mascotReaction, setMascotReaction] = useState<MascotReaction | null>(null)

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName")
    if (!storedName) {
      router.push("/")
      return
    }
    setUserName(storedName)
    fetchQuestions()
  }, [])

  useEffect(() => {
    setTimeLeft(30)
    setMascotMood("idle")
    setMascotMessage("")
  }, [currentQuestionIndex])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      if (!selectedOption) {
        setMascotMood("sad")
        setMascotMessage("Time's up! Don't worry, let's move on to the next one.")
        setMascotReaction({
          emoji: "⏰",
          text: "TIME'S UP!",
          color: "bg-gradient-to-r from-yellow-500 to-orange-500",
        })
      }

      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => handleNext(), 1500)
      } else {
        setTimeout(() => handleSubmitQuiz(), 1500)
      }
    }
  }, [timeLeft, currentQuestionIndex, questions.length, selectedOption])

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions")
      const data = await response.json()
      setQuestions(data.questions)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching questions:", error)
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

    checkAnswerAndUpdateStreak(currentQuestion.id, option)
  }

  const checkAnswerAndUpdateStreak = async (questionId: number, selectedAnswer: string) => {
    try {
      const response = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answer: selectedAnswer }),
      })

      const result = await response.json()

      if (result.correct) {
        const newStreak = currentStreak + 1
        setCurrentStreak(newStreak)
        setCorrectAnswers((prev) => [...prev, questionId.toString()])

        if (newStreak >= 5) {
          setMascotMood("celebrating")
          setMascotMessage(`Incredible ${newStreak} streak! You're unstoppable!`)
          setMascotReaction({
            emoji: "🎉",
            text: "AMAZING STREAK!",
            color: "bg-gradient-to-r from-purple-500 to-pink-500",
          })
        } else if (newStreak >= 3) {
          setMascotMood("excited")
          setMascotMessage(`Fantastic! ${newStreak} in a row!`)
          setMascotReaction({
            emoji: "🔥",
            text: "ON FIRE!",
            color: "bg-gradient-to-r from-orange-500 to-red-500",
          })
        } else {
          setMascotMood("happy")
          setMascotMessage("Correct! Well done!")
          setMascotReaction({
            emoji: "✅",
            text: "CORRECT!",
            color: "bg-gradient-to-r from-green-500 to-emerald-500",
          })
        }

        const stats = getUserStats()
        const updatedStats = updateUserStats({
          currentStreak: newStreak,
          maxStreak: Math.max(stats.maxStreak, newStreak),
        })

        const newAchievements = checkNewAchievements(updatedStats)
        if (newAchievements.length > 0) {
          setNewAchievement(newAchievements[0])
          updateUserStats({
            achievements: [...updatedStats.achievements, ...newAchievements.map((a) => a.id)],
          })
        }
      } else {
        setCurrentStreak(0)
        updateUserStats({ currentStreak: 0 })
        setMascotMood("sad")
        setMascotMessage("Oops! That's not quite right. Keep trying!")
        setMascotReaction({
          emoji: "❌",
          text: "WRONG ANSWER",
          color: "bg-gradient-to-r from-red-500 to-pink-500",
        })
      }
    } catch (error) {
      console.error("Error checking answer:", error)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setEliminatedOptions([])
      setPowerUpUsed(false)
      setSelectedOption("")

      setMascotMood("excited")
      setMascotMessage("Let's tackle the next one!")
      setMascotReaction({
        emoji: "➡️",
        text: "NEXT QUESTION!",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      })
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setEliminatedOptions([])
      setPowerUpUsed(false)
      const prevAnswer = answers[questions[currentQuestionIndex - 1].id.toString()]
      setSelectedOption(prevAnswer || "")
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      setMascotMood("celebrating")
      setMascotMessage("Congratulations! You've completed the quiz!")
      setMascotReaction({
        emoji: "🏆",
        text: "QUIZ COMPLETE!",
        color: "bg-gradient-to-r from-gold-500 to-yellow-500",
      })

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers, userName }),
      })

      const results = await response.json()
      sessionStorage.setItem("quizResults", JSON.stringify(results))

      setTimeout(() => {
        router.push("/results")
      }, 2000)
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }
  }

  const handleUsePowerUp = async (powerUpId: string) => {
    const currentQuestion = questions[currentQuestionIndex]

    if (powerUpId === "fiftyFifty") {
      setMascotMood("thinking")
      setMascotMessage("Smart move! I'll eliminate two wrong answers for you.")
      setMascotReaction({
        emoji: "🎯",
        text: "50/50 USED!",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      })

      try {
        const response = await fetch("/api/check-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: currentQuestion.id, answer: "A" }),
        })
        const result = await response.json()
        const correctAnswer = result.correctAnswer

        const options = ["A", "B", "C", "D"]
        const incorrectOptions = options.filter((opt) => opt !== correctAnswer)
        const toEliminate = incorrectOptions.slice(0, 2)
        setEliminatedOptions(toEliminate)
      } catch (error) {
        console.error("Error using 50/50 power-up:", error)
      }
    } else if (powerUpId === "extraTime") {
      setMascotMood("excited")
      setMascotMessage("Extra time granted! Use it wisely!")
      setMascotReaction({
        emoji: "⏱️",
        text: "EXTRA TIME!",
        color: "bg-gradient-to-r from-green-500 to-teal-500",
      })
      setTimeLeft((prev) => prev + 15)
    } else if (powerUpId === "skipQuestion") {
      setMascotMood("happy")
      setMascotMessage("Question skipped! Moving on to the next one.")
      setMascotReaction({
        emoji: "⏭️",
        text: "QUESTION SKIPPED!",
        color: "bg-gradient-to-r from-purple-500 to-indigo-500",
      })

      const currentQuestion = questions[currentQuestionIndex]
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id.toString()]: "SKIP",
      }))
      setCorrectAnswers((prev) => [...prev, currentQuestion.id.toString()])

      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)

      const stats = getUserStats()
      const updatedStats = updateUserStats({
        currentStreak: newStreak,
        maxStreak: Math.max(stats.maxStreak, newStreak),
      })

      const newAchievements = checkNewAchievements(updatedStats)
      if (newAchievements.length > 0) {
        setNewAchievement(newAchievements[0])
        updateUserStats({
          achievements: [...updatedStats.achievements, ...newAchievements.map((a) => a.id)],
        })
      }

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          handleNext()
        } else {
          handleSubmitQuiz()
        }
      }, 1000)
    }

    setPowerUpUsed(true)
  }

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, "0")
  }

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">No questions available. Please try again later.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <AchievementPopup achievement={newAchievement} onClose={() => setNewAchievement(null)} />
      <MascotReactions reaction={mascotReaction} onComplete={() => setMascotReaction(null)} />
      <QuizMascot mood={mascotMood} message={mascotMessage} streak={currentStreak} />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Knowledge Challenge</h1>
              <p className="text-muted-foreground">Welcome, {userName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <StreakDisplay />
              <div className="text-lg font-semibold text-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-full transition-all duration-300 ${
                  timeLeft <= 10
                    ? "bg-destructive text-destructive-foreground animate-pulse scale-110"
                    : timeLeft <= 20
                      ? "bg-orange-500 text-white animate-pulse"
                      : "bg-accent text-accent-foreground"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-3 bg-muted" />
        </div>

        <div className="flex justify-between items-center mb-6">
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

          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Navigate Questions</div>
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestionIndex(index)
                    setEliminatedOptions([])
                    setPowerUpUsed(false)
                    const prevAnswer = answers[questions[index].id.toString()]
                    setSelectedOption(prevAnswer || "")
                  }}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110 ${
                    index === currentQuestionIndex
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : answers[questions[index].id.toString()]
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            size="lg"
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-6">
          <PowerUpPanel onUsePowerUp={handleUsePowerUp} disabled={selectedOption !== ""} />
        </div>

        <Card className="p-8 mb-8 animate-bounce-in">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance">
            {currentQuestion.question_text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { key: "A", text: currentQuestion.option_a },
              { key: "B", text: currentQuestion.option_b },
              { key: "C", text: currentQuestion.option_c },
              { key: "D", text: currentQuestion.option_d },
            ].map((option) => {
              const isEliminated = eliminatedOptions.includes(option.key)

              return (
                <button
                  key={option.key}
                  onClick={() => !isEliminated && handleOptionSelect(option.key)}
                  disabled={isEliminated}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 hover:scale-105 ${
                    isEliminated
                      ? "opacity-30 cursor-not-allowed bg-muted line-through"
                      : selectedOption === option.key
                        ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/30"
                        : "bg-card hover:bg-accent/10 border-2 border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isEliminated
                          ? "bg-muted text-muted-foreground"
                          : selectedOption === option.key
                            ? "bg-primary-foreground text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isEliminated ? "✗" : option.key}
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="flex justify-between items-center">
          {isLastQuestion ? (
            <Button
              onClick={handleSubmitQuiz}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              size="lg"
              className="flex items-center gap-2"
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
