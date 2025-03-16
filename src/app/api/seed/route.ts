import { NextResponse } from "next/server"
import seedDatabase from "@/lib/seedData"

export async function GET() {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error in seed route:", error)
    return NextResponse.json({ success: false, message: "Failed to seed database" }, { status: 500 })
  }
}

