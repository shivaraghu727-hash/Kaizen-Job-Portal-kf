import { type NextRequest, NextResponse } from "next/server"

// Mock assessments storage
const mockAssessments: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, assessmentData, jobId } = body

    if (!studentId || !assessmentData) {
      return NextResponse.json(
        { success: false, message: "Student ID and assessment data are required" },
        { status: 400 },
      )
    }

    const assessment = {
      id: `assessment_${Date.now()}`,
      student_id: studentId,
      job_id: jobId,
      assessment_data: assessmentData,
      score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      created_at: new Date().toISOString(),
    }

    mockAssessments.push(assessment)

    return NextResponse.json({
      success: true,
      message: "Assessment completed successfully",
      assessment,
    })
  } catch (error) {
    console.error("Assessment API POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const jobId = searchParams.get("jobId")

    let filteredAssessments = mockAssessments

    if (studentId) {
      filteredAssessments = filteredAssessments.filter((assessment) => assessment.student_id === studentId)
    }

    if (jobId) {
      filteredAssessments = filteredAssessments.filter((assessment) => assessment.job_id === jobId)
    }

    return NextResponse.json({ success: true, assessments: filteredAssessments })
  } catch (error) {
    console.error("Assessment API GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
