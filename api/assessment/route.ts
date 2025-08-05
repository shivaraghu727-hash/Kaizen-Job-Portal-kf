import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo
const assessments: any[] = []
const applications: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    console.log("=== Assessment GET Request ===")
    console.log("Type:", type)

    if (type === "applications") {
      return NextResponse.json({
        success: true,
        applications: applications,
      })
    }

    return NextResponse.json({
      success: true,
      assessments: assessments,
    })
  } catch (error) {
    console.error("Assessment GET error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch assessments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("=== Assessment POST Request ===")
    console.log("Request body:", body)

    const {
      name,
      email,
      phone,
      degree,
      specialization,
      coreValues,
      workPreferences,
      personalityAnswers,
      jobId,
      jobTitle,
      company,
    } = body

    // Generate assessment ID
    const assessmentId = `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create assessment object
    const newAssessment = {
      id: assessmentId,
      name,
      email,
      phone,
      degree,
      specialization,
      core_values: coreValues,
      work_preferences: workPreferences,
      personality_answers: personalityAnswers,
      job_id: jobId,
      job_title: jobTitle,
      company: company,
      created_at: new Date().toISOString(),
    }

    // Add to assessments array
    assessments.push(newAssessment)

    console.log("Assessment created:", assessmentId)

    // Create redirect URL to results page
    const redirectUrl = `/student/results?assessmentId=${assessmentId}`

    return NextResponse.json({
      success: true,
      message: "Assessment submitted successfully",
      assessmentId: assessmentId,
      redirectUrl: redirectUrl,
    })
  } catch (error) {
    console.error("Assessment POST error:", error)
    return NextResponse.json({ success: false, message: "Failed to submit assessment" }, { status: 500 })
  }
}
