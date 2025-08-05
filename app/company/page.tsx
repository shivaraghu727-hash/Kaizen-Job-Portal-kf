"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  Plus,
  QrCode,
  Eye,
  Download,
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  Globe,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Copy,
  Loader2,
  Edit,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

// Define roles from Roles.xlsx
const ROLES = [
  "Agile Coach", "AI Engineer", "AI Research Scientist", "AI Solutions Architect", "Application Developer",
  "Assembly Line Worker", "Automation Tester", "Back-End Developer", "Bank Teller", "Big Data Engineer",
  "Business Analyst", "Change Management Specialist", "Clinical Research Associate", "Cloud Administrator",
  "Cloud Developer", "Cloud Security Engineer", "Cloud Solutions Architect", "CNC Machinist",
  "Compliance Analyst", "Compliance Engineer", "Computer Vision Engineer", "Conversational AI Designer",
  "Corporate Loan Analyst", "Credit Officer", "Cybersecurity Analyst", "Cybersecurity Consultant",
  "Data Analyst", "Data Engineer", "Data Scientist", "Data Warehouse Developer", "Database Administrator",
  "Database Engineer", "Deep Learning Engineer", "Desktop Application Developer", "DevOps Engineer",
  "Digital Marketing Specialist", "Digital Transformation Lead", "Documentation Specialist",
  "Electronics Design Engineer", "Electronics QA Inspector", "Embedded Software Engineer",
  "Enterprise Architect", "Ethical Hacker", "Front-End Developer", "Front-End Web Engineer",
  "Full-Stack Developer", "Game Developer", "Health & Safety Officer", "Healthcare Administrator",
  "Incident Responder", "Interaction Designer", "Inventory Control Manager", "IT Account Manager",
  "IT Auditor", "IT Consultant", "IT Manager", "IT Operations Engineer", "IT Risk Analyst",
  "IT Strategy Consultant", "IT Support Specialist", "Logistics Coordinator", "Machine Learning Engineer",
  "Maintenance Technician", "Market Access Specialist", "Medical Records Technician",
  "Medical Sales Representative", "Medical Technologist", "Mobile App Developer", "Network Administrator",
  "Network Engineer", "NLP Engineer", "Patient Care Coordinator", "Penetration Tester",
  "Performance Tester", "Pharmacovigilance Specialist", "Physician Assistant", "Physiotherapist",
  "Pre-Sales Consultant", "Process Consultant", "Process Engineer", "Procurement Specialist",
  "Product Manager", "Production Operator", "Production Planner", "Production Supervisor",
  "Project Manager", "Prototyping Specialist", "QA Analyst", "QA Engineer", "Quality Control Analyst",
  "Quality Inspector", "Quantitative Analyst", "Radiology Technician", "Regulatory Affairs Specialist",
  "Relationship Manager", "Reliability Engineer", "Research Scientist", "Scrum Master",
  "Security Architect", "Security Engineer", "Site Reliability Engineer", "Software Architect",
  "Software Tester", "Solutions Consultant", "Speech-Language Pathologist", "SQL Developer",
  "Staff Nurse", "Supply Chain Specialist", "System Administrator", "Systems Analyst",
  "Technical Product Manager", "Technical Sales Engineer", "Technical Writer", "Technology Analyst",
  "Test Automation Engineer", "UI Developer", "UI/UX Researcher", "UX Designer", "UX Engineer",
  "Vulnerability Analyst", "Web Developer"
]

interface Job {
  id: string
  title: string
  job_type: string
  location: string
  description: string
  key_skills: string
  salary: string
  company_name: string
  company_email: string
  qr_code_url: string
  student_url: string
  active: boolean
  created_at: string
}

export default function CompanyPage() {
  const [currentView, setCurrentView] = useState<"form" | "dashboard" | "preview">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [qrLoading, setQrLoading] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  const [companyData, setCompanyData] = useState({
    companyName: "",
    contactPersonName: "",
    contactPersonNumber: "",
    email: "",
  })

  const [jobData, setJobData] = useState({
    title: "",
    jobType: "",
    location: "",
    description: "",
    keySkills: "",
    salary: "",
  })

  useEffect(() => {
    // Check if Web Speech API is supported
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setVoiceSupported(true)
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          parseVoiceInput(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or use manual input.",
          variant: "destructive",
        })
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Load existing company data from localStorage
    const savedCompanyData = localStorage.getItem("companyData")
    if (savedCompanyData) {
      const parsed = JSON.parse(savedCompanyData)
      setCompanyData(parsed)
      setCurrentView("dashboard")
      loadCompanyJobs(parsed.email)
    }
  }, [toast])

  const parseVoiceInput = (transcript: string) => {
    const text = transcript.toLowerCase()

    // Extract company name
    const companyPatterns = [
      /(?:company|organization|firm|corp|corporation|inc|ltd|limited|solutions|technologies|systems|group|enterprises) (?:is|are|called|named) ([^,.]+)/i,
      /(?:we are|i am from|this is|representing|work at|from) ([^,.]+)/i,
      /([a-zA-Z0-9\s]+) (?:company|corp|corporation|inc|ltd|limited|solutions|technologies|systems|group|enterprises)/i,
    ]

    for (const pattern of companyPatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        setCompanyData((prev) => ({ ...prev, companyName: match[1].trim() }))
        break
      }
    }

    // Extract phone number
    const phoneMatch = text.match(
      /(?:phone|number|contact|call|reach|mobile|cell) (?:is|at|number)? ?(\d{10}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/i,
    )
    if (phoneMatch) {
      setCompanyData((prev) => ({ ...prev, contactPersonNumber: phoneMatch[1].replace(/[-.\s]/g, "") }))
    }

    // Extract email
    const emailMatch = text.match(
      /(?:email|mail|contact) (?:is|at)? ?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    )
    if (emailMatch) {
      setCompanyData((prev) => ({ ...prev, email: emailMatch[1] }))
    }

    // Extract contact person name
    const namePatterns = [/(?:my name is|i am|this is|name is|i'm|im) ([^,.]+)/i, /(?:speaking|here|calling) ([^,.]+)/i]

    for (const pattern of namePatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        setCompanyData((prev) => ({ ...prev, contactPersonName: match[1].trim() }))
        break
      }
    }

    // Extract job title
    const jobTitlePatterns = [
      /(?:hiring for|looking for|need|want|seeking|recruiting|position for|role for|job for|opening for) ([^,.]+)/i,
      /(?:we need|we want|we are looking for) ([^,.]+)/i,
    ]

    for (const pattern of jobTitlePatterns) {
      const match = text.match(pattern)
      if (match) {
        const spokenTitle = match[1].trim()
        // Find closest matching role from ROLES
        const matchedRole = ROLES.find((role) => role.toLowerCase().includes(spokenTitle.toLowerCase()))
        setJobData((prev) => ({ ...prev, title: matchedRole || spokenTitle }))
        break
      }
    }

    // Extract location
    const locationMatch = text.match(/(?:in|at|located in|based in|from) ([^,.]+)/i)
    if (locationMatch) {
      const location = locationMatch[1].trim()
      if (location.length < 50) {
        setJobData((prev) => ({ ...prev, location: location }))
      }
    }

    // Extract job type
    if (text.includes("full time") || text.includes("full-time")) {
      setJobData((prev) => ({ ...prev, jobType: "full-time" }))
    } else if (text.includes("part time") || text.includes("part-time")) {
      setJobData((prev) => ({ ...prev, jobType: "part-time" }))
    } else if (text.includes("intern") || text.includes("internship")) {
      setJobData((prev) => ({ ...prev, jobType: "internship" }))
    } else if (text.includes("contract")) {
      setJobData((prev) => ({ ...prev, jobType: "contract" }))
    }

    // Extract skills
    const skillsMatch = text.match(
      /(?:skills|technologies|tools|experience with|knowledge of|proficient in|familiar with) (?:include|are|:)? ?([^.]+)/i,
    )
    if (skillsMatch) {
      setJobData((prev) => ({ ...prev, keySkills: skillsMatch[1].trim() }))
    }

    // Extract salary
    const salaryMatch = text.match(
      /(?:salary|pay|compensation|package|offer|paying) (?:is|of|around|approximately)? ?([^.]+)/i,
    )
    if (salaryMatch) {
      setJobData((prev) => ({ ...prev, salary: salaryMatch[1].trim() }))
    }

    // Extract job description from longer text
    if (text.length > 50 && !jobData.description) {
      setJobData((prev) => ({ ...prev, description: transcript.trim() }))
    }

    toast({
      title: "Voice Input Processed",
      description: "Information extracted and filled in the form.",
    })
  }

  const startVoiceInput = () => {
    if (recognitionRef.current && voiceSupported) {
      setIsListening(true)
      recognitionRef.current.start()
      toast({
        title: "Voice Input Started",
        description: "Speak naturally about your company and job details.",
      })
    }
  }

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const clearForm = () => {
    setCompanyData({
      companyName: "",
      contactPersonName: "",
      contactPersonNumber: "",
      email: "",
    })
    setJobData({
      title: "",
      jobType: "",
      location: "",
      description: "",
      keySkills: "",
      salary: "",
    })
    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    })
  }

  const handleCompanyRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!companyData.companyName || !companyData.contactPersonName || !companyData.email) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required company fields.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Save company data to localStorage
      localStorage.setItem("companyData", JSON.stringify(companyData))

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "company-register",
          ...companyData,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Registration Successful!",
          description: "Your company has been registered successfully.",
        })

        // If job data is filled, also post the job
        if (jobData.title && jobData.description && jobData.jobType && jobData.location && jobData.keySkills && jobData.salary) {
          await handleJobPost()
        }

        setCurrentView("dashboard")
        await loadCompanyJobs(companyData.email)
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCompany = () => {
    setCurrentView("form")
  }

  const loadCompanyJobs = async (email: string) => {
    try {
      const response = await fetch(`/api/jobs?email=${encodeURIComponent(email)}`)
      const result = await response.json()
      if (result.success) {
        // Process jobs to ensure proper URLs
        const jobsWithUrls = (result.jobs || []).map((job: Job) => {
          const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "https://kaizen-job-portal.vercel.app"
          const studentUrl = `${baseUrl}/job/${job.id}`
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(studentUrl)}&format=png&bgcolor=FFFFFF&color=000000&qzone=2&margin=10&ecc=M`

          return {
            ...job,
            student_url: studentUrl,
            qr_code_url: qrCodeUrl,
          }
        })
        setJobs(jobsWithUrls)
      }
    } catch (error) {
      console.error("Error loading jobs:", error)
    }
  }

  const handleJobPost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (
      !jobData.title ||
      !jobData.description ||
      !jobData.jobType ||
      !jobData.location ||
      !jobData.keySkills ||
      !jobData.salary
    ) {
      toast({
        title: "All Job Fields Required",
        description: "Please fill in all job fields before posting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...jobData,
          companyEmail: companyData.email,
          companyName: companyData.companyName,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Job Posted Successfully!",
          description: "Your job posting has been created with a QR code.",
        })

        setJobData({
          title: "",
          jobType: "",
          location: "",
          description: "",
          keySkills: "",
          salary: "",
        })

        await loadCompanyJobs(companyData.email)
      } else {
        toast({
          title: "Job Posting Failed",
          description: result.message || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Job posting error:", error)
      toast({
        title: "Job Posting Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadQR = async (qrUrl: string, jobTitle: string, jobId: string) => {
    try {
      setQrLoading(jobId)

      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `${jobTitle.replace(/\s+/g, "_")}_QR_Code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)

      toast({
        title: "QR Code Downloaded",
        description: `QR code for "${jobTitle}" has been downloaded successfully.`,
      })
    } catch (error) {
      console.error("Error downloading QR code:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setQrLoading(null)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      })
    })
  }

  const testQRCode = (jobId: string, jobTitle: string) => {
    const baseUrl = window.location.origin
    const studentUrl = `${baseUrl}/job/${jobId}`
    window.open(studentUrl, "_blank")

    toast({
      title: "Testing QR Code",
      description: `Opening job page for "${jobTitle}" in new tab.`,
    })
  }

  // Preview Page
  if (currentView === "preview") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="container mx-auto max-w-4xl py-8">
          <Button
          onClick={() => setCurrentView("form")}
          className="inline-flex items-center text-white hover:text-white/80 mb-6 group"
            >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Form
          </Button>

          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Form Preview</CardTitle>
                  <CardDescription>Review your company and job details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Company Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <p className="text-sm text-foreground">{companyData.companyName || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonName">Contact Person Name</Label>
                      <p className="text-sm text-foreground">{companyData.contactPersonName || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Company Email</Label>
                      <p className="text-sm text-foreground">{companyData.email || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonNumber">Contact Person Number</Label>
                      <p className="text-sm text-foreground">{companyData.contactPersonNumber || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Job Information Section */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Job Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <p className="text-sm text-foreground">{jobData.title || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type</Label>
                      <p className="text-sm text-foreground">{jobData.jobType || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <p className="text-sm text-foreground">{jobData.location || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <p className="text-sm text-foreground">{jobData.salary || "Not provided"}</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="keySkills">Key Skills</Label>
                      <p className="text-sm text-foreground">{jobData.keySkills || "Not provided"}</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Job Description</Label>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{jobData.description || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="container mx-auto max-w-6xl py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Company Dashboard</h1>
              <p className="text-muted-foreground">Manage your job postings and view applications</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => setCurrentView("form")} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
              <Button onClick={handleEditCompany} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Company Details
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Company Info */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{companyData.companyName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{companyData.contactPersonName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{companyData.email}</span>
                </div>
                {companyData.contactPersonNumber && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{companyData.contactPersonNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Posted Jobs */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    Posted Jobs
                  </CardTitle>
                  <Badge variant="secondary">{jobs.length} jobs</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No jobs posted yet</p>
                    <p className="text-sm">Post your first job to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-foreground">{job.title}</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {job.job_type}
                              </Badge>
                              {job.location && <span>• {job.location}</span>}
                              {job.salary && <span>• {job.salary}</span>}
                            </div>
                          </div>
                          <Badge
                            variant={job.active ? "default" : "secondary"}
                            className={
                              job.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""
                            }
                          >
                            {job.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                        {job.key_skills && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Required Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {job.key_skills
                                .split(",")
                                .slice(0, 4)
                                .map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill.trim()}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* QR Code Display */}
                        <div className="mb-4 p-4 bg-white dark:bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm text-gray-900">QR Code</h5>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => testQRCode(job.id, job.title)}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Test
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadQR(job.qr_code_url, job.title, job.id)}
                                disabled={qrLoading === job.id}
                                className="text-xs"
                              >
                                {qrLoading === job.id ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <Download className="w-3 h-3 mr-1" />
                                )}
                                Download
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Image
                              src={job.qr_code_url || "/placeholder.svg"}
                              alt={`QR Code for ${job.title}`}
                              width={150}
                              height={150}
                              className="border rounded"
                              onError={(e) => {
                                console.error("QR Code failed to load:", e)
                              }}
                            />
                          </div>
                        </div>

                        {/* Job URL */}
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-muted-foreground">Job URL:</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(job.student_url, "Job URL")}
                                className="text-xs"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(job.student_url, "_blank")}
                                className="text-xs"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground break-all bg-background p-2 rounded border">
                            {job.student_url}
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-muted-foreground">
                          Posted: {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto max-w-4xl py-8">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Company Registration & Job Posting</CardTitle>
                <CardDescription>Register your company and post a job opportunity</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manual" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Manual Entry</span>
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center space-x-2" disabled={!voiceSupported}>
                  <Mic className="w-4 h-4" />
                  <span>Voice Input</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="space-y-6">
                {voiceSupported ? (
                  <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-4">
                      <Volume2 className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">Smart Voice Input</h4>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                      Speak naturally about your company and job details. Our AI will automatically extract and fill the
                      form fields.
                    </p>
                    <div className="flex space-x-3 mb-4">
                      <Button
                        type="button"
                        onClick={isListening ? stopVoiceInput : startVoiceInput}
                        className={`flex-1 ${
                          isListening
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                        {isListening ? "Stop Voice Input" : "Start Voice Input"}
                      </Button>
                      <Button
                        type="button"
                        onClick={clearForm}
                        variant="outline"
                        className="border-gray-300 bg-transparent"
                      >
                        Clear Form
                      </Button>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-300 space-y-2">
                      <p>
                        <strong>💡 Example phrases you can say:</strong>
                      </p>
                      <div className="grid gap-2">
                        <p>
                          <strong>Company Info:</strong> "Hi, I'm John from TechCorp. My email is john@techcorp.com and
                          phone is 9876543210."
                        </p>
                        <p>
                          <strong>Job Details:</strong> "We're hiring for Software Engineer, full-time position in
                          Mumbai. Need React and Node.js skills."
                        </p>
                        <p>
                          <strong>Mixed Style:</strong> "This is Sarah from ABC Solutions. Looking for web developer
                          intern. Contact me at sarah@abc.com."
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Voice input is not supported in your browser. Please use manual entry.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="manual" className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Fill in your company details below. All job fields are required for posting.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Form Fields - Shown in both tabs */}
              <form onSubmit={handleCompanyRegistration} className="space-y-6 mt-6">
                {/* Company Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Company Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companyData.companyName}
                        onChange={(e) => setCompanyData((prev) => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                      <Input
                        id="contactPersonName"
                        value={companyData.contactPersonName}
                        onChange={(e) => setCompanyData((prev) => ({ ...prev, contactPersonName: e.target.value }))}
                        placeholder="Enter contact person name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Company Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="company@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPersonNumber">Contact Person Number</Label>
                      <Input
                        id="contactPersonNumber"
                        value={companyData.contactPersonNumber}
                        onChange={(e) => setCompanyData((prev) => ({ ...prev, contactPersonNumber: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Information Section */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Job Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Select
                        value={jobData.title}
                        onValueChange={(value) => setJobData((prev) => ({ ...prev, title: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job title" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type *</Label>
                      <Select
                        value={jobData.jobType}
                        onValueChange={(value) => setJobData((prev) => ({ ...prev, jobType: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={jobData.location}
                        onChange={(e) => setJobData((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Remote, Mumbai, Bangalore"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range *</Label>
                      <Input
                        id="salary"
                        value={jobData.salary}
                        onChange={(e) => setJobData((prev) => ({ ...prev, salary: e.target.value }))}
                        placeholder="e.g. ₹50,000 - ₹70,000"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="keySkills">Key Skills *</Label>
                      <Input
                        id="keySkills"
                        value={jobData.keySkills}
                        onChange={(e) => setJobData((prev) => ({ ...prev, keySkills: e.target.value }))}
                        placeholder="e.g. React, Node.js, Python, JavaScript"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        value={jobData.description}
                        onChange={(e) => setJobData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                  <Button type="button" variant="outline" onClick={clearForm} disabled={isSubmitting}>
                    Clear Form
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentView("preview")}
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {companyData.companyName ? "Post Job" : "Register & Post Job"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
