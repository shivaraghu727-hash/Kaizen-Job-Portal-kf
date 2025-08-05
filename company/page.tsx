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
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/hooks/use-toast"

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
  qr_code_url: string
  active: boolean
  created_at: string
}

interface ValidationErrors {
  email?: string
  phone?: string
  general?: string
  jobTitle?: string
  jobDescription?: string
}

export default function CompanyPage() {
  const [currentView, setCurrentView] = useState<"form" | "dashboard">("form")
  const [inputMethod, setInputMethod] = useState<"manual" | "voice">("manual")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isRegistered, setIsRegistered] = useState(false)
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
  }, [toast])

  const parseVoiceInput = (transcript: string) => {
    const text = transcript.toLowerCase()

    // Extract company name - improved pattern
    const companyPatterns = [
      /(?:company|organization|firm|corp|corporation|inc|ltd|limited|solutions|technologies|systems|group|enterprises|consulting|services|agency|studio|labs|works|digital|tech|software) (?:is|are|called|named) ([^,.!?]+)/i,
      /(?:we are|this is|i work at|i'm from|im from) ([^,.!?]+) (?:company|corp|corporation|inc|ltd|limited|solutions|technologies|systems|group|enterprises)/i,
      /(?:my company is|our company is|company name is) ([^,.!?]+)/i,
    ]

    for (const pattern of companyPatterns) {
      const match = text.match(pattern)
      if (match) {
        setCompanyData((prev) => ({ ...prev, companyName: match[1].trim() }))
        break
      }
    }

    // Extract phone number - improved pattern
    const phonePatterns = [
      /(?:phone|number|contact|call|reach|mobile|cell) (?:is|at|number)?\s*(\d{10}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/i,
      /(?:my number is|contact me at|call me at)\s*(\d{10}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/i,
      /(\d{10}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/i,
    ]

    for (const pattern of phonePatterns) {
      const match = text.match(pattern)
      if (match) {
        setCompanyData((prev) => ({ ...prev, contactPersonNumber: match[1].replace(/[-.\s]/g, "") }))
        break
      }
    }

    // Extract email - improved pattern
    const emailPatterns = [
      /(?:email|mail|contact) (?:is|at)?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
      /(?:my email is|contact me at|email me at)\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    ]

    for (const pattern of emailPatterns) {
      const match = text.match(pattern)
      if (match) {
        setCompanyData((prev) => ({ ...prev, email: match[1] }))
        break
      }
    }

    // Extract contact person name - improved pattern
    const namePatterns = [
      /(?:my name is|i am|this is|name is|i'm|im)\s+([^,.!?]+)/i,
      /(?:contact person is|hr is|recruiter is)\s+([^,.!?]+)/i,
    ]

    for (const pattern of namePatterns) {
      const match = text.match(pattern)
      if (match) {
        setCompanyData((prev) => ({ ...prev, contactPersonName: match[1].trim() }))
        break
      }
    }

    // Extract job title - improved pattern
    const jobTitlePatterns = [
      /(?:hiring for|looking for|need|want|seeking|recruiting|position for|role for|job for|opening for)\s+([^,.!?]+)/i,
      /(?:we need|we want|we are looking for)\s+([^,.!?]+)/i,
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

    // Extract location - improved pattern
    const locationPatterns = [
      /(?:in|at|located in|based in|from|office in)\s+([^,.!?]+)/i,
      /(?:location is|work location is|job location is)\s+([^,.!?]+)/i,
    ]

    for (const pattern of locationPatterns) {
      const match = text.match(pattern)
      if (match) {
        const location = match[1].trim()
        if (location.length < 50) {
          setJobData((prev) => ({ ...prev, location: location }))
        }
        break
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

    // Extract skills - improved pattern
    const skillsPatterns = [
      /(?:skills|technologies|tools|experience with|knowledge of|proficient in|familiar with) (?:include|are|:)?\s*([^.!?]+)/i,
      /(?:need|require|looking for) (?:skills in|experience in|knowledge of)\s*([^.!?]+)/i,
    ]

    for (const pattern of skillsPatterns) {
      const match = text.match(pattern)
      if (match) {
        setJobData((prev) => ({ ...prev, keySkills: match[1].trim() }))
        break
      }
    }

    // Extract salary - improved pattern
    const salaryPatterns = [
      /(?:salary|pay|compensation|package|offer|paying) (?:is|of|around|approximately)?\s*([^.!?]+)/i,
      /(?:we offer|offering|budget is)\s*([^.!?]+)/i,
    ]

    for (const pattern of salaryPatterns) {
      const match = text.match(pattern)
      if (match) {
        setJobData((prev) => ({ ...prev, salary: match[1].trim() }))
        break
      }
    }

    // Extract job description from context
    if (text.includes("responsibilities") || text.includes("duties") || text.includes("role involves")) {
      const descMatch = text.match(/(?:responsibilities|duties|role involves|job involves|work involves)\s*([^.!?]+)/i)
      if (descMatch) {
        setJobData((prev) => ({ ...prev, description: descMatch[1].trim() }))
      }
    }
  }

  const startVoiceInput = () => {
    if (recognitionRef.current && voiceSupported) {
      setIsListening(true)
      recognitionRef.current.start()
      toast({
        title: "Voice Input Started",
        description: "Speak naturally about your company and job requirements.",
      })
    }
  }

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      toast({
        title: "Voice Input Stopped",
        description: "Processing your input...",
      })
    }
  }

  const clearAllForms = () => {
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
    setValidationErrors({})
    toast({
      title: "Forms Cleared",
      description: "All fields have been reset.",
    })
  }

  const validateData = async () => {
    const errors: ValidationErrors = {}

    // Check for duplicate email
    if (companyData.email) {
      try {
        const response = await fetch(`/api/auth?type=check-email&email=${encodeURIComponent(companyData.email)}`)
        const result = await response.json()
        if (result.exists) {
          errors.email = "This email is already registered. Please use a different email or login."
        }
      } catch (error) {
        console.error("Email validation error:", error)
      }
    }

    // Check for duplicate phone number
    if (companyData.contactPersonNumber) {
      try {
        const response = await fetch(
          `/api/auth?type=check-phone&phone=${encodeURIComponent(companyData.contactPersonNumber)}`,
        )
        const result = await response.json()
        if (result.exists) {
          errors.phone = "This phone number is already registered. Please use a different number."
        }
      } catch (error) {
        console.error("Phone validation error:", error)
      }
    }

    // Validate required job fields
    if (!jobData.title) {
      errors.jobTitle = "Job Title is required."
    }
    if (!jobData.description) {
      errors.jobDescription = "Job Description is required."
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate for duplicates and required fields
      const isValid = await validateData()
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // First register the company
      console.log("=== Company Registration ===")
      console.log("Registration data:", companyData)

      const registerResponse = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "company-register",
          ...companyData,
        }),
      })

      const registerResult = await registerResponse.json()
      console.log("Registration result:", registerResult)

      if (!registerResult.success) {
        toast({
          title: "Registration Failed",
          description: registerResult.message || "Failed to register company",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      setIsRegistered(true)

      // Post the job (now required)
      console.log("=== Job Posting ===")
      console.log("Job data:", jobData)

      const jobResponse = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...jobData,
          companyEmail: companyData.email,
        }),
      })

      const jobResult = await jobResponse.json()
      console.log("Job posting result:", jobResult)

      if (jobResult.success) {
        toast({
          title: "Success!",
          description: "Company registered and job posted successfully! QR code generated.",
        })
      } else {
        toast({
          title: "Partial Success",
          description: "Company registered but job posting failed. You can try posting from the dashboard.",
          variant: "destructive",
        })
      }

      // Switch to dashboard view
      setCurrentView("dashboard")
      await loadCompanyJobs(companyData.email)
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadCompanyJobs = async (email: string) => {
    try {
      console.log("Loading jobs for company:", email)
      const response = await fetch(`/api/jobs?email=${encodeURIComponent(email)}`)
      const result = await response.json()

      if (result.success) {
        setJobs(result.jobs || [])
        console.log("Jobs loaded:", result.jobs?.length || 0)
      }
    } catch (error) {
      console.error("Error loading jobs:", error)
    }
  }

  const handleJobPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("=== Job Posting ===")
      console.log("Job data:", jobData)

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...jobData,
          companyEmail: companyData.email,
        }),
      })

      const jobResult = await response.json()
      console.log("Job posting result:", jobResult)

      if (jobResult.success) {
        toast({
          title: "Job Posted!",
          description: "Job posted successfully! QR code generated.",
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
          title: "Error",
          description: result.message || "Failed to post job",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Job posting error:", error)
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadQR = (qrUrl: string, jobTitle: string) => {
    const link = document.createElement("a")
    link.href = qrUrl
    link.download = `${jobTitle.replace(/\s+/g, "_")}_QR.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (currentView === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="glass-effect shadow-xl hover-lift">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl gradient-text">Company Registration & Job Posting</CardTitle>
                  <CardDescription className="text-lg">
                    Register your company and post your first job
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Input Method Selection */}
              <div className="mb-8">
                <Label className="text-base font-semibold mb-4 block">Choose Input Method</Label>
                <Tabs
                  value={inputMethod}
                  onValueChange={(value) => setInputMethod(value as "manual" | "voice")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Manual Entry</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center space-x-2" disabled={!voiceSupported}>
                      <Volume2 className="w-4 h-4" />
                      <span>Voice Input</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="voice" className="mt-6">
                    {voiceSupported ? (
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center space-x-2 mb-4">
                          <Volume2 className="w-6 h-6 text-blue-600" />
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">Smart Voice Input</h4>
                        </div>

                        <p className="text-blue-700 dark:text-blue-300 mb-6">
                          Speak naturally about your company and job requirements. Our AI will automatically fill in all
                          the fields for you!
                        </p>

                        <div className="flex space-x-4 mb-6">
                          <Button
                            type="button"
                            onClick={isListening ? stopVoiceInput : startVoiceInput}
                            className={`flex-1 ${
                              isListening
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            } text-white shadow-lg`}
                          >
                            {isListening ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                            {isListening ? "Stop Listening" : "Start Voice Input"}
                          </Button>
                          <Button
                            type="button"
                            onClick={clearAllForms}
                            variant="outline"
                            className="border-gray-300 bg-transparent"
                          >
                            Clear All
                          </Button>
                        </div>

                        {isListening && (
                          <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700 dark:text-green-300">
                              Listening... Speak naturally about your company and job requirements.
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                          <p>
                            <strong>💡 Example phrases you can use:</strong>
                          </p>
                          <div className="grid md:grid-cols-2 gap-3 text-xs">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                              <strong>Company Info:</strong>
                              <br />
                              "Hi, I'm John from TechCorp Solutions. My email is john@techcorp.com and phone is
                              9876543210."
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                              <strong>Job Details:</strong>
                              <br />
                              "We're hiring for Software Engineer, full-time position in Mumbai. Need React and Node.js
                              skills."
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Voice input is not supported in your browser. Please use manual entry.
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitAll} className="space-y-8">
                {/* Company Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl font-semibold">Company Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companyData.companyName}
                        onChange={(e) => setCompanyData((prev) => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Enter company name"
                        required
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Company Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={companyData.email}
                          onChange={(e) => setCompanyData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="company@example.com"
                          required
                          className={`pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${
                            validationErrors.email ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {validationErrors.email && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{validationErrors.email}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPersonNumber">Contact Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="contactPersonNumber"
                          value={companyData.contactPersonNumber}
                          onChange={(e) => setCompanyData((prev) => ({ ...prev, contactPersonNumber: e.target.value }))}
                          placeholder="Enter phone number"
                          className={`pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${
                            validationErrors.phone ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {validationErrors.phone && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{validationErrors.phone}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Information Section */}
                <div className="space-y-6 border-t pt-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl font-semibold">Job Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Select
                        value={jobData.title}
                        onValueChange={(value) => setJobData((prev) => ({ ...prev, title: value }))}
                        required
                      >
                        <SelectTrigger className={`border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${
                          validationErrors.jobTitle ? "border-red-500" : ""
                        }`}>
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
                      {validationErrors.jobTitle && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{validationErrors.jobTitle}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type</Label>
                      <Select
                        value={jobData.jobType}
                        onValueChange={(value) => setJobData((prev) => ({ ...prev, jobType: value }))}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={jobData.location}
                        onChange={(e) => setJobData((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Remote, Mumbai"
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        value={jobData.salary}
                        onChange={(e) => setJobData((prev) => ({ ...prev, salary: e.target.value }))}
                        placeholder="e.g. ₹50,000 - ₹70,000"
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="keySkills">Key Skills</Label>
                      <Input
                        id="keySkills"
                        value={jobData.keySkills}
                        onChange={(e) => setJobData((prev) => ({ ...prev, keySkills: e.target.value }))}
                        placeholder="e.g. React, Node.js, Python"
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                        className={`border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${
                          validationErrors.jobDescription ? "border-red-500" : ""
                        }`}
                      />
                      {validationErrors.jobDescription && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{validationErrors.jobDescription}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-3 text-lg font-semibold rounded-full shadow-lg hover-lift button-glow"
                  >
                    {isSubmitting ? "Processing..." : "Register Company & Post Job"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Company Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Welcome back! Manage your job postings and applications</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            Registered
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Post New Job */}
          <Card className="glass-effect shadow-lg hover-lift">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Post a New Job</CardTitle>
                  <CardDescription>Add another job opportunity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJobPost} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newTitle">Job Title *</Label>
                  <Select
                    value={jobData.title}
                    onValueChange={(value) => setJobData((prev) => ({ ...prev, title: value }))}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newJobType">Job Type *</Label>
                    <Select
                      value={jobData.jobType}
                      onValueChange={(value) => setJobData((prev) => ({ ...prev, jobType: value }))}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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
                    <Label htmlFor="newLocation">Location</Label>
                    <Input
                      id="newLocation"
                      value={jobData.location}
                      onChange={(e) => setJobData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Remote"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newDescription">Job Description *</Label>
                  <Textarea
                    id="newDescription"
                    value={jobData.description}
                    onChange={(e) => setJobData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={4}
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newKeySkills">Key Skills</Label>
                  <Input
                    id="newKeySkills"
                    value={jobData.keySkills}
                    onChange={(e) => setJobData((prev) => ({ ...prev, keySkills: e.target.value }))}
                    placeholder="e.g. React, Node.js, Python"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newSalary">Salary Range</Label>
                  <Input
                    id="newSalary"
                    value={jobData.salary}
                    onChange={(e) => setJobData((prev) => ({ ...prev, salary: e.target.value }))}
                    placeholder="e.g. ₹50,000 - ₹70,000"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover-lift"
                >
                  {isSubmitting ? "Posting..." : "Post Job & Generate QR"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Posted Jobs */}
          <Card className="glass-effect shadow-lg hover-lift">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Posted Jobs</CardTitle>
                    <CardDescription>Manage your job postings and QR codes</CardDescription>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  {jobs.length} jobs
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No jobs posted yet</p>
                  <p className="text-sm">Post your first job to get started</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{job.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {job.job_type}
                            </Badge>
                            {job.location && <span>• {job.location}</span>}
                          </div>
                        </div>
                        <Badge
                          variant={job.active ? "default" : "secondary"}
                          className={
                            job.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                          }
                        >
                          {job.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-gray-500">
                          Posted: {new Date(job.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          {job.qr_code_url && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(job.qr_code_url, "_blank")}
                                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View QR
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadQR(job.qr_code_url, job.title)}
                                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Job URL for direct access */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Direct Link:</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/job/${job.id}`, "_blank")}
                            className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-xs"
                          >
                            Open in New Tab
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500 break-all font-mono bg-white dark:bg-gray-900 p-2 rounded border">
                          {typeof window !== "undefined" ? `${window.location.origin}/job/${job.id}` : `/job/${job.id}`}
                        </div>
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
