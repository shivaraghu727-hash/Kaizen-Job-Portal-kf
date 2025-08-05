import { createClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "placeholder-key"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key"

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable")
}

if (!supabaseKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY environment variable")
}

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

// Admin client for server-side operations with elevated permissions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Mock functions for when Supabase is not configured
export const mockSupabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: { code: "PGRST116" } }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () =>
          Promise.resolve({
            data: { id: `mock_${Date.now()}`, ...data },
            error: null,
          }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
  }),
}

// Use mock if Supabase is not properly configured
export const db = supabaseUrl.includes("placeholder") ? mockSupabase : supabase

// Mock database functions for demo
export async function saveAssessment(assessmentData: any) {
  console.log("Saving assessment to mock database:", assessmentData)
  return { success: true, id: `assessment_${Date.now()}` }
}

export async function saveApplication(applicationData: any) {
  console.log("Saving application to mock database:", applicationData)
  return { success: true, id: `app_${Date.now()}` }
}

export async function getApplications() {
  console.log("Getting applications from mock database")
  return { success: true, applications: [] }
}

// Test connection function
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)
    if (error) {
      console.error("Supabase connection error:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Supabase connection failed:", error)
    return false
  }
}

// Types
export interface User {
  id: string
  email: string
  name: string
  role: "student" | "company" | "admin"
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  user_id: string
  company_name: string
  contact_person_name: string
  contact_person_number?: string
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  degree?: string
  specialization?: string
  assessment_completed: boolean
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  company_id: string
  title: string
  job_type: "internship" | "full-time" | "part-time" | "contract"
  location?: string
  description: string
  key_skills?: string
  salary?: string
  qr_code_url?: string
  active: boolean
  created_at: string
  updated_at: string
  company?: Company
}

export interface StudentAssessment {
  id: string
  student_id: string
  core_values: string[]
  work_preferences: Record<string, number>
  personality_answers: Record<string, number>
  ai_analysis?: any
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: string
  job_id: string
  student_id: string
  fitment_score?: number
  fitment_analysis?: any
  status: "pending" | "reviewed" | "accepted" | "rejected"
  applied_at: string
  reviewed_at?: string
  job?: Job
  student?: Student & { user?: User }
}

export interface CareerMatch {
  id: string
  student_id: string
  career_title: string
  fitment_score: number
  match_reasons: any
  interested: boolean
  created_at: string
}
