import { type NextRequest, NextResponse } from "next/server"

// Mock jobs storage - In production, this would be a database
const mockJobs: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const jobId = searchParams.get("jobId")

    if (jobId) {
      const job = mockJobs.find((j) => j.id === jobId)
      if (job) {
        return NextResponse.json({ success: true, job })
      } else {
        return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 })
      }
    }

    if (email) {
      const companyJobs = mockJobs.filter((job) => job.company_email === email)
      return NextResponse.json({ success: true, jobs: companyJobs })
    }

    return NextResponse.json({ success: true, jobs: mockJobs })
  } catch (error) {
    console.error("Jobs API GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, jobType, location, description, keySkills, salary, companyEmail, companyName } = body

    if (!title || !description || !companyEmail || !jobType || !location || !keySkills || !salary) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      )
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kaizen-job-portal.vercel.app"
    const studentUrl = `${baseUrl}/job/${jobId}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      studentUrl,
    )}&format=png&bgcolor=FFFFFF&color=000000&qzone=2&margin=10&ecc=M`

    const job = {
      id: jobId,
      title,
      job_type: jobType,
      location,
      description,
      key_skills: keySkills,
      salary,
      company_name: companyName || companyEmail,
      company_email: companyEmail,
      qr_code_url: qrCodeUrl,
      student_url: studentUrl,
      active: true,
      created_at: new Date().toISOString(),
    }

    mockJobs.push(job)

    console.log("Job created successfully:", {
      id: jobId,
      title,
      company: companyName,
      qrUrl: qrCodeUrl,
      studentUrl,
    })

    return NextResponse.json({
      success: true,
      message: "Job posted successfully with QR code",
      job,
    })
  } catch (error) {
    console.error("Jobs API POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
