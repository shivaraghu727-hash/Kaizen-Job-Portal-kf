import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (replace with real database)
const jobs: any[] = []
const companies: any[] = []

export async function POST(request: NextRequest) {
  try {
    console.log("=== Jobs API POST Called ===")

    const body = await request.json()
    console.log("Job posting data:", body)

    const { title, jobType, location, description, keySkills, salary, companyEmail } = body

    if (!title || !jobType || !description || !companyEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Generate QR code URL that points to student assessment with job ID
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const studentUrl = `${baseUrl}/student?jobId=${encodeURIComponent(jobId)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(studentUrl)}`;


    const jobData = {
      id: jobId,
      title,
      job_type: jobType,
      location: location || "",
      description,
      key_skills: keySkills || "",
      salary: salary || "",
      company_email: companyEmail,
      qr_code_url: qrCodeUrl,
      student_url: studentUrl,
      active: true,
      applications_count: 0,
      created_at: new Date().toISOString(),
    }

    jobs.push(jobData)
    console.log("Job posted successfully:", jobId)
    console.log("QR Code URL:", qrCodeUrl)
    console.log("Student URL:", studentUrl)

    return NextResponse.json({
      success: true,
      message: "Job posted successfully",
      job: jobData,
    })
  } catch (error) {
    console.error("Jobs API POST error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const type = searchParams.get("type")
    const jobId = searchParams.get("jobId")

    console.log("=== Jobs GET Request ===")
    console.log("Email:", email)
    console.log("Type:", type)
    console.log("JobId:", jobId)

    if (jobId) {
      // Get specific job by ID
      const job = jobs.find((j) => j.id === jobId)
      if (job) {
        return NextResponse.json({
          success: true,
          job: job,
        })
      } else {
        return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 })
      }
    }

    if (type === "all") {
      // Return all jobs for admin
      const jobsWithApplicationCount = jobs.map((job) => ({
        ...job,
        applications_count: Math.floor(Math.random() * 50), // Mock application count
        student_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/student?jobId=${job.id}`,
      }))

      return NextResponse.json({
        success: true,
        jobs: jobsWithApplicationCount,
      })
    }

    if (email) {
      // Filter jobs by company email
      const companyJobs = jobs.filter((job) => job.company_email === email)
      console.log("Company jobs found:", companyJobs.length)

      return NextResponse.json({
        success: true,
        jobs: companyJobs,
      })
    }

    // Return all jobs
    return NextResponse.json({
      success: true,
      jobs: jobs,
    })
  } catch (error) {
    console.error("Jobs GET error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch jobs" }, { status: 500 })
  }
}
