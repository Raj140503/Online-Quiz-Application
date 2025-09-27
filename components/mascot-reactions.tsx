"use client"

import { useState, useEffect } from "react"

interface MascotReaction {
  emoji: string
  text: string
  color: string
}

interface MascotReactionsProps {
  reaction: MascotReaction | null
  onComplete: () => void
}

export function MascotReactions({ reaction, onComplete }: MascotReactionsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (reaction) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300)
      }, 1500) // Reduced duration from 2000ms to 1500ms
      return () => clearTimeout(timer)
    }
  }, [reaction, onComplete])

  if (!reaction) return null

  return (
    <div
      className={`fixed top-20 right-4 z-40 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={`${reaction.color} text-white px-4 py-2 rounded-lg shadow-lg text-center`}>
        <div className="text-2xl">{reaction.emoji}</div>
        <div className="text-sm font-semibold">{reaction.text}</div>
      </div>
    </div>
  )
}
