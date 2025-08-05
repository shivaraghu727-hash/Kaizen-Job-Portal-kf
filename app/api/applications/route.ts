import { type NextRequest, NextResponse } from "next/server"

// Mock applications storage
const mockApplications: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const studentId = searchParams.get("studentId")

    let filteredApplications = mockApplications

    if (jobId) {
      filteredApplications = filteredApplications.filter((app) => app.job_id === jobId)
    }

    if (studentId) {
      filteredApplications = filteredApplications.filter((app) => app.student_id === studentId)
    }

    return NextResponse.json({ success: true, applications: filteredApplications })
  } catch (error) {
    console.error("Applications API GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId, studentId, studentData, assessmentData } = body

    if (!jobId || !studentId) {
      return NextResponse.json({ success: false, message: "Job ID and Student ID are required" }, { status: 400 })
    }

    const application = {
      id: `app_${Date.now()}`,
      job_id: jobId,
      student_id: studentId,
      student_data: studentData,
      assessment_data: assessmentData,
      status: "pending",
      applied_at: new Date().toISOString(),
    }

    mockApplications.push(application)

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      application,
    })
  } catch (error) {
    console.error("Applications API POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
