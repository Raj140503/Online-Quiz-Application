"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface QuizMascotProps {
  mood: "idle" | "happy" | "excited" | "sad" | "thinking" | "celebrating"
  message?: string
  streak?: number
}

export function QuizMascot({ mood, message, streak = 0 }: QuizMascotProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(message)

  useEffect(() => {
    if (message) {
      setCurrentMessage(message)
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const getMascotEmoji = () => {
    switch (mood) {
      case "happy":
        return "😊"
      case "excited":
        return "🤩"
      case "sad":
        return "😔"
      case "thinking":
        return "🤔"
      case "celebrating":
        return "🎉"
      default:
        return "🤖"
    }
  }

  const getMascotAnimation = () => {
    switch (mood) {
      case "happy":
        return "animate-bounce"
      case "excited":
        return "animate-pulse"
      case "sad":
        return "animate-none"
      case "thinking":
        return "animate-pulse"
      case "celebrating":
        return "animate-bounce"
      default:
        return "animate-none"
    }
  }

  const getMascotColor = () => {
    switch (mood) {
      case "happy":
        return "from-green-400 to-green-600"
      case "excited":
        return "from-yellow-400 to-orange-500"
      case "sad":
        return "from-gray-400 to-gray-600"
      case "thinking":
        return "from-blue-400 to-blue-600"
      case "celebrating":
        return "from-purple-400 to-pink-500"
      default:
        return "from-blue-400 to-purple-500"
    }
  }

  const getDefaultMessage = () => {
    switch (mood) {
      case "happy":
        return "Great job! Keep it up!"
      case "excited":
        return streak > 0 ? `Amazing ${streak} streak!` : "You're on fire!"
      case "sad":
        return "Don't worry, you'll get the next one!"
      case "thinking":
        return "Take your time to think..."
      case "celebrating":
        return "Fantastic work! You're a quiz master!"
      default:
        return "Ready for the next question?"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card
        className={`p-4 bg-gradient-to-br ${getMascotColor()} text-white shadow-2xl transition-all duration-500 ${
          isAnimating ? "scale-110" : "scale-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`text-4xl ${getMascotAnimation()}`}>{getMascotEmoji()}</div>
          <div className="max-w-48">
            <div className="font-bold text-sm">Quiz Buddy</div>
            <div className="text-xs opacity-90">{currentMessage || getDefaultMessage()}</div>
          </div>
        </div>

        {streak > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs">🔥</span>
            <span className="text-xs font-bold">{streak} streak!</span>
          </div>
        )}
      </Card>
    </div>
  )
}
