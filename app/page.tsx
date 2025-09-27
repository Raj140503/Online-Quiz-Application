"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { DailyChallengeCard } from "@/components/daily-challenge-card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)

  const handleStartQuiz = () => {
    if (!showNameInput) {
      setShowNameInput(true)
      return
    }

    if (userName.trim()) {
      sessionStorage.setItem("userName", userName.trim())
      router.push("/quiz")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <DailyChallengeCard />
        </div>

        {/* Main Quiz Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent p-8 md:p-12 text-center shadow-2xl animate-bounce-in">
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-secondary/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 bg-accent/40 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-4 w-8 h-8 bg-secondary/50 rounded-full blur-md"></div>

          {/* Quiz Title */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 text-balance">
              KNOWLEDGE
              <br />
              <span className="text-secondary-foreground">CHALLENGE</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-md mx-auto text-pretty">
              Test your knowledge with our fun and engaging quiz! Are you ready to challenge yourself?
            </p>

            {/* 3D-style Quiz Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-secondary rounded-2xl rotate-12 shadow-lg"></div>
                <div className="absolute inset-0 w-24 h-24 bg-accent rounded-2xl -rotate-6 shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-accent-foreground">?</span>
                </div>
              </div>
            </div>

            {showNameInput ? (
              <div className="mb-8 space-y-4">
                <h2 className="text-2xl font-semibold text-primary-foreground mb-4">What's your name?</h2>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="max-w-sm mx-auto text-lg py-3 text-center bg-card/90 border-2 border-secondary/30 focus:border-secondary"
                  onKeyPress={(e) => e.key === "Enter" && handleStartQuiz()}
                  autoFocus
                />
              </div>
            ) : null}

            {/* Start Button */}
            <Button
              onClick={handleStartQuiz}
              size="lg"
              disabled={showNameInput && !userName.trim()}
              className="bg-card text-card-foreground hover:bg-card/90 text-xl px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-glow font-semibold"
            >
              {showNameInput ? "Start Quiz" : "Get Started"}
            </Button>

            {/* Quiz Info */}
            <div className="mt-8 flex justify-center gap-6 text-primary-foreground/80">
              <div className="text-center">
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm">Questions</div>
              </div>
              <div className="w-px bg-primary-foreground/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">30s</div>
                <div className="text-sm">Per Question</div>
              </div>
              <div className="w-px bg-primary-foreground/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">🏆</div>
                <div className="text-sm">Badges</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-6 text-center bg-secondary/10 border-secondary/20 hover:bg-secondary/20 transition-colors">
            <div className="w-12 h-12 bg-secondary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Test Knowledge</h3>
            <p className="text-sm text-muted-foreground">Challenge yourself with diverse questions</p>
          </Card>

          <Card className="p-6 text-center bg-accent/10 border-accent/20 hover:bg-accent/20 transition-colors">
            <div className="w-12 h-12 bg-accent rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Quick & Fun</h3>
            <p className="text-sm text-muted-foreground">Fast-paced questions to keep you engaged</p>
          </Card>

          <Card className="p-6 text-center bg-primary/10 border-primary/20 hover:bg-primary/20 transition-colors">
            <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">See your score and learn from results</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
