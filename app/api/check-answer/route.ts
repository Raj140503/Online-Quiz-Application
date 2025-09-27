import { type NextRequest, NextResponse } from "next/server"
import { getQuestions } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer } = await request.json()

    console.log("[v0] Checking answer for question:", questionId, "answer:", answer)

    const questions = getQuestions()
    const question = questions.find((q) => q.id === questionId)

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const isCorrect = question.correct_option === answer

    console.log("[v0] Answer check result:", isCorrect)

    return NextResponse.json({
      correct: isCorrect,
      correctAnswer: question.correct_option,
    })
  } catch (error) {
    console.error("[v0] Error checking answer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
