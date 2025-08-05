import { type NextRequest, NextResponse } from "next/server"

// Mock companies storage
const mockCompanies: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const email = searchParams.get("email")
    const phone = searchParams.get("phone")

    if (type === "check-duplicate") {
      if (email) {
        const exists = mockCompanies.some((company) => company.email === email)
        return NextResponse.json({ exists })
      }
      if (phone) {
        const exists = mockCompanies.some((company) => company.contactPersonNumber === phone)
        return NextResponse.json({ exists })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Auth API GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, companyName, contactPersonName, contactPersonNumber, email } = body

    if (type === "company-register") {
      if (!companyName || !contactPersonName || !email) {
        return NextResponse.json(
          { success: false, message: "Company name, contact person name, and email are required" },
          { status: 400 },
        )
      }

      // Check for duplicates
      const emailExists = mockCompanies.some((company) => company.email === email)
      if (emailExists) {
        return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 })
      }

      if (contactPersonNumber) {
        const phoneExists = mockCompanies.some((company) => company.contactPersonNumber === contactPersonNumber)
        if (phoneExists) {
          return NextResponse.json({ success: false, message: "Phone number already registered" }, { status: 400 })
        }
      }

      const company = {
        id: `company_${Date.now()}`,
        companyName,
        contactPersonName,
        contactPersonNumber,
        email,
        verified: true,
        created_at: new Date().toISOString(),
      }

      mockCompanies.push(company)

      return NextResponse.json({
        success: true,
        message: "Company registered successfully",
        company,
      })
    }

    return NextResponse.json({ success: false, message: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("Auth API POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
