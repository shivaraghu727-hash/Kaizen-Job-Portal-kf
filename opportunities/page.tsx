"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Heart,
  Building2,
  Users,
  Code,
  Palette,
  TrendingUp,
  Shield,
  Stethoscope,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface JobOpportunity {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  skills: string[]
  domain: string
  posted_date: string
  applications: number
}

const jobDomains = [
  { id: "technology", name: "Technology", icon: Code, color: "bg-blue-500", count: 45 },
  { id: "design", name: "Design & Creative", icon: Palette, color: "bg-purple-500", count: 23 },
  { id: "business", name: "Business & Finance", icon: TrendingUp, color: "bg-green-500", count: 34 },
  { id: "marketing", name: "Marketing & Sales", icon: Users, color: "bg-orange-500", count: 28 },
  { id: "healthcare", name: "Healthcare", icon: Stethoscope, color: "bg-red-500", count: 19 },
  { id: "education", name: "Education", icon: GraduationCap, color: "bg-indigo-500", count: 15 },
  { id: "security", name: "Security & Safety", icon: Shield, color: "bg-gray-500", count: 12 },
  { id: "consulting", name: "Consulting", icon: Building2, color: "bg-teal-500", count: 21 },
]

export default function OpportunitiesPage() {
  const router = useRouter()
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [jobs, setJobs] = useState<JobOpportunity[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobOpportunity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    if (selectedDomain) {
      const filtered = jobs.filter((job) => job.domain === selectedDomain)
      setFilteredJobs(filtered)
    } else {
      setFilteredJobs(jobs)
    }
  }, [selectedDomain, jobs])

  useEffect(() => {
    if (searchTerm) {
      const filtered = (selectedDomain ? jobs.filter((job) => job.domain === selectedDomain) : jobs).filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredJobs(filtered)
    } else {
      setFilteredJobs(selectedDomain ? jobs.filter((job) => job.domain === selectedDomain) : jobs)
    }
  }, [searchTerm, selectedDomain, jobs])

  const loadJobs = async () => {
    // Mock job data - in real app, fetch from API
    const mockJobs: JobOpportunity[] = [
      {
        id: "1",
        title: "Frontend Developer Intern",
        company: "TechCorp Solutions",
        location: "Bangalore, India",
        type: "Internship",
        salary: "₹15,000 - ₹25,000",
        description: "Work on modern web applications using React, TypeScript, and Next.js",
        skills: ["React", "TypeScript", "Next.js", "CSS"],
        domain: "technology",
        posted_date: "2024-01-15",
        applications: 23,
      },
      {
        id: "2",
        title: "UI/UX Designer",
        company: "Creative Studios",
        location: "Mumbai, India",
        type: "Full-time",
        salary: "₹30,000 - ₹50,000",
        description: "Design beautiful and intuitive user interfaces for mobile and web applications",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        domain: "design",
        posted_date: "2024-01-14",
        applications: 18,
      },
      {
        id: "3",
        title: "Business Analyst Trainee",
        company: "FinanceHub Inc",
        location: "Delhi, India",
        type: "Trainee",
        salary: "₹20,000 - ₹35,000",
        description: "Analyze business processes and help optimize operations",
        skills: ["Excel", "SQL", "Data Analysis", "Business Process"],
        domain: "business",
        posted_date: "2024-01-13",
        applications: 31,
      },
      {
        id: "4",
        title: "Digital Marketing Specialist",
        company: "MarketPro Agency",
        location: "Pune, India",
        type: "Full-time",
        salary: "₹25,000 - ₹40,000",
        description: "Manage social media campaigns and digital marketing strategies",
        skills: ["Social Media", "Google Ads", "SEO", "Content Marketing"],
        domain: "marketing",
        posted_date: "2024-01-12",
        applications: 27,
      },
      {
        id: "5",
        title: "Healthcare Data Analyst",
        company: "MedTech Solutions",
        location: "Hyderabad, India",
        type: "Full-time",
        salary: "₹35,000 - ₹55,000",
        description: "Analyze healthcare data to improve patient outcomes",
        skills: ["Python", "R", "Healthcare Analytics", "Statistics"],
        domain: "healthcare",
        posted_date: "2024-01-11",
        applications: 15,
      },
    ]
    setJobs(mockJobs)
    setFilteredJobs(mockJobs)
  }

  const handleInterested = async (job: JobOpportunity) => {
    // Check if user has phone number from previous assessment
    const hasPhoneNumber = localStorage.getItem("userPhoneNumber")
    const userEmail = localStorage.getItem("userEmail")

    if (hasPhoneNumber && userEmail) {
      // Check if already applied
      const existingApplication = localStorage.getItem(`application_${job.id}_${userEmail}`)
      if (existingApplication) {
        alert("You have already shown interest in this role!")
        return
      }

      // Auto-apply with existing phone number
      await submitInterest(job, hasPhoneNumber)
    } else {
      // Show phone number dialog
      setSelectedJob(job)
      setShowPhoneDialog(true)
    }
  }

  const submitInterest = async (job: JobOpportunity, phone: string) => {
    setIsSubmitting(true)
    try {
      const userEmail = localStorage.getItem("userEmail") || "anonymous@example.com"
      const userName = localStorage.getItem("userName") || "Anonymous User"

      // Store application locally
      localStorage.setItem(
        `application_${job.id}_${userEmail}`,
        JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          userEmail,
          userName,
          phoneNumber: phone,
          appliedAt: new Date().toISOString(),
        }),
      )

      // Store phone number for future use
      localStorage.setItem("userPhoneNumber", phone)

      // Submit to API
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          jobId: job.id,
          studentName: userName,
          studentEmail: userEmail,
          jobTitle: job.title,
          company: job.company,
          phoneNumber: phone,
          fitmentScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Interest submitted successfully! The company will contact you soon.")
        setShowPhoneDialog(false)
        setSelectedJob(null)
        setPhoneNumber("")
      } else {
        alert("Failed to submit interest. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting interest:", error)
      alert("Failed to submit interest. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter your phone number")
      return
    }

    if (selectedJob) {
      await submitInterest(selectedJob, phoneNumber)
    }
  }

  const getDomainIcon = (domain: string) => {
    const domainInfo = jobDomains.find((d) => d.id === domain)
    if (!domainInfo) return Code
    return domainInfo.icon
  }

  const getDomainColor = (domain: string) => {
    const domainInfo = jobDomains.find((d) => d.id === domain)
    return domainInfo?.color || "bg-gray-500"
  }

  if (selectedDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA] p-4">
        <div className="container mx-auto max-w-6xl py-8">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => setSelectedDomain(null)}
              variant="outline"
              className="border-[#794BE1] text-[#794BE1] hover:bg-[#794BE1] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Domains
            </Button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {jobDomains.find((d) => d.id === selectedDomain)?.name} Opportunities
            </h1>
            <p className="text-gray-600">{filteredJobs.length} positions available</p>
          </div>

          <div className="grid gap-6">
            {filteredJobs.map((job) => {
              const IconComponent = getDomainIcon(job.domain)
              return (
                <Card key={job.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 ${getDomainColor(job.domain)} rounded-lg flex items-center justify-center`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <Building2 className="w-4 h-4" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{job.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-[#794BE1]/10 text-[#794BE1]">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
                            <span>{job.applications} applications</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleInterested(job)}
                        className="bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] hover:from-[#6B3BC7] hover:to-[#8B4CE8] text-white px-6 py-2"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        I'm Interested
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Phone Number Dialog */}
        <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Your Application</DialogTitle>
              <DialogDescription>Please provide your phone number to show interest in this position.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1]"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowPhoneDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handlePhoneSubmit}
                  disabled={isSubmitting}
                  className="bg-[#794BE1] hover:bg-[#794BE1]/90"
                >
                  {isSubmitting ? "Submitting..." : "Submit Interest"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA] p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <Link
          href="/student/results"
          className="inline-flex items-center text-[#794BE1] hover:text-[#794BE1]/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Career Opportunities</h1>
          <p className="text-lg text-gray-600 mb-2">Discover exciting job openings across various domains</p>
          <p className="text-gray-500">Click on any domain to explore available positions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobDomains.map((domain) => {
            const IconComponent = domain.icon
            return (
              <Card
                key={domain.id}
                className="cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setSelectedDomain(domain.id)}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${domain.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{domain.name}</h3>
                  <div className="text-2xl font-bold text-[#794BE1] mb-1">{domain.count}</div>
                  <p className="text-sm text-gray-500">Open Positions</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-[#794BE1]/5 to-[#9D5CE8]/5 border-[#794BE1]/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Career Journey?</h2>
              <p className="text-gray-600 mb-6">
                Browse through hundreds of opportunities and find the perfect match for your skills and interests.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#794BE1] mb-2">200+</div>
                  <p className="text-gray-600">Total Opportunities</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#794BE1] mb-2">50+</div>
                  <p className="text-gray-600">Partner Companies</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#794BE1] mb-2">95%</div>
                  <p className="text-gray-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
