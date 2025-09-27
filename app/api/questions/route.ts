import { NextResponse } from "next/server"
import { getAllQuestions, initializeDatabase } from "@/lib/database"

export async function GET() {
  try {
    console.log("[v0] Initializing database...")
    await initializeDatabase()
    console.log("[v0] Fetching questions...")
    const questions = await getAllQuestions()
    console.log("[v0] Questions fetched successfully:", questions.length)
    return NextResponse.json({ questions })
  } catch (error) {
    console.error("[v0] Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}
