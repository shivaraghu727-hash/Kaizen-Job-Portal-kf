import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { studentId, careerTitle, interested } = await request.json()

    if (!studentId || !careerTitle) {
      return NextResponse.json({ error: "Student ID and career title are required" }, { status: 400 })
    }

    // Update career match interest
    const { data: careerMatch, error } = await supabase
      .from("career_matches")
      .update({ interested })
      .eq("student_id", studentId)
      .eq("career_title", careerTitle)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ careerMatch, success: true })
  } catch (error) {
    console.error("Career interest update error:", error)
    return NextResponse.json({ error: "Failed to update career interest" }, { status: 500 })
  }
}
