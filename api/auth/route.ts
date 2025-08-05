import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo
const users: any[] = []
const companies: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    console.log("=== Auth GET Request ===")
    console.log("Type:", type)

    if (type === "users") {
      return NextResponse.json({
        success: true,
        users: users,
      })
    }

    if (type === "companies") {
      return NextResponse.json({
        success: true,
        companies: companies,
      })
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Auth GET error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("=== Auth POST Request ===")
    console.log("Request body:", body)

    const { type } = body

    if (type === "company-register") {
      const { companyName, contactPersonName, contactPersonNumber, email } = body

      // Check if company already exists
      const existingCompany = companies.find((c) => c.email === email)
      if (existingCompany) {
        return NextResponse.json({ success: false, message: "Company already registered with this email" })
      }

      // Create company object
      const newCompany = {
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: companyName,
        email: email,
        contact_person: contactPersonName,
        contact_number: contactPersonNumber || "",
        verified: true, // Auto-verify for demo
        created_at: new Date().toISOString(),
      }

      companies.push(newCompany)

      console.log("Company registered:", newCompany.id)

      return NextResponse.json({
        success: true,
        message: "Company registered successfully",
        company: newCompany,
      })
    }

    if (type === "company-login") {
      const { email } = body

      // Find company by email
      const company = companies.find((c) => c.email === email)
      if (!company) {
        return NextResponse.json({ success: false, message: "Company not found. Please register first." })
      }

      return NextResponse.json({
        success: true,
        message: "Login successful",
        company: company,
      })
    }

    if (type === "admin-login") {
      const { username, password } = body

      // Simple admin credentials check
      if (username === "admin" && password === "admin123") {
        return NextResponse.json({
          success: true,
          message: "Admin login successful",
        })
      }

      return NextResponse.json({ success: false, message: "Invalid admin credentials" })
    }

    return NextResponse.json({ success: false, message: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("Auth POST error:", error)
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}
