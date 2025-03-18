import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import { Category } from "@/models/Category"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { orderedIds } = await request.json()

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 })
    }

    await connectToDatabase()

    // Update each category with its new order
    const updatePromises = orderedIds.map((id, index) => {
      return Category.findByIdAndUpdate(id, { order: index })
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: "Categories reordered successfully",
    })
  } catch (error: any) {
    console.error("Error reordering categories:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to reorder categories" },
      { status: 500 },
    )
  }
}

