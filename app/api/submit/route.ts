import { type NextRequest, NextResponse } from "next/server"
import { getQuestionsWithAnswers, initializeDatabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Initializing database for score calculation...")
    await initializeDatabase()

    console.log("[v0] Parsing request body...")
    const { answers, userName } = await request.json()
    console.log("[v0] Received answers:", answers)
    console.log("[v0] User name:", userName)

    if (!answers || typeof answers !== "object") {
      console.log("[v0] Invalid answers format")
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 })
    }

    console.log("[v0] Fetching questions with answers...")
    const questions = await getQuestionsWithAnswers()
    console.log("[v0] Questions loaded:", questions.length)

    let score = 0
    const results = []

    const answeredQuestionIds = Object.keys(answers).map((id) => Number.parseInt(id))
    const relevantQuestions = questions.filter((q) => answeredQuestionIds.includes(q.id))

    for (const question of relevantQuestions) {
      const userAnswer = answers[question.id.toString()]
      const isCorrect = userAnswer === question.correct_option

      if (isCorrect) {
        score++
      }

      results.push({
        questionId: question.id,
        question: question.question_text,
        userAnswer,
        correctAnswer: question.correct_option,
        isCorrect,
        options: {
          A: question.option_a,
          B: question.option_b,
          C: question.option_c,
          D: question.option_d,
        },
      })
    }

    const totalQuestions = relevantQuestions.length
    const percentage = Math.round((score / totalQuestions) * 100)

    const getBadge = (percentage: number) => {
      if (percentage >= 95) return { name: "Perfect Scholar", emoji: "🏆", color: "gold" }
      if (percentage >= 90) return { name: "Quiz Master", emoji: "👑", color: "purple" }
      if (percentage >= 80) return { name: "Knowledge Expert", emoji: "🎓", color: "blue" }
      if (percentage >= 70) return { name: "Smart Cookie", emoji: "🍪", color: "green" }
      if (percentage >= 60) return { name: "Good Learner", emoji: "📚", color: "orange" }
      if (percentage >= 50) return { name: "Getting There", emoji: "🌟", color: "yellow" }
      return { name: "Keep Trying", emoji: "💪", color: "red" }
    }

    const response = {
      score,
      totalQuestions,
      percentage,
      results,
      userName: userName || "Anonymous", // Include userName in response
      badge: getBadge(percentage), // Include badge in response
    }

    console.log("[v0] Score calculation complete:", {
      score,
      totalQuestions,
      percentage,
      badge: response.badge.name,
    })
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Error calculating score:", error)
    return NextResponse.json({ error: "Failed to calculate score" }, { status: 500 })
  }
}
