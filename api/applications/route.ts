import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo
const applications: any[] = []

export async function GET(request: NextRequest) {
  try {
    console.log("=== Applications GET Request ===")
    console.log("Total applications:", applications.length)

    return NextResponse.json({
      success: true,
      applications: applications,
    })
  } catch (error) {
    console.error("Applications GET error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("=== Applications POST Request ===")
    console.log("Request body:", body)

    const { action } = body

    if (action === "create") {
      const { jobId, studentName, studentEmail, jobTitle, company, fitmentScore } = body

      // Create application
      const newApplication = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        job_id: jobId,
        student_name: studentName,
        student_email: studentEmail,
        job_title: jobTitle,
        company: company,
        fitment_score: fitmentScore || Math.floor(Math.random() * 30) + 70, // Random score 70-100
        status: "pending",
        applied_at: new Date().toISOString(),
      }

      applications.push(newApplication)

      console.log("Application created:", newApplication.id)

      return NextResponse.json({
        success: true,
        message: "Application submitted successfully",
        application: newApplication,
      })
    }

    if (action === "update-status") {
      const { applicationId, status } = body

      const applicationIndex = applications.findIndex((app) => app.id === applicationId)
      if (applicationIndex !== -1) {
        applications[applicationIndex].status = status
        applications[applicationIndex].reviewed_at = new Date().toISOString()

        return NextResponse.json({
          success: true,
          message: "Application status updated",
        })
      }

      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Applications POST error:", error)
    return NextResponse.json({ success: false, message: "Failed to process application" }, { status: 500 })
  }
}
