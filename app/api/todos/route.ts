import { type NextRequest, NextResponse } from "next/server"
import { query, initializeDatabase } from "@/lib/db"

export async function GET() {
  try {
    // データベースの初期化を確認
    await initializeDatabase()

    const result = await query("SELECT * FROM todos ORDER BY created_at DESC")

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Failed to fetch todos:", error)
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // データベースの初期化を確認
    await initializeDatabase()

    const result = await query("INSERT INTO todos (title) VALUES ($1) RETURNING *", [title.trim()])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create todo:", error)
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
  }
}
