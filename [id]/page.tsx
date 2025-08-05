"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Clock, Users, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"

export default function JobDetailsPage() {
  const [email, setEmail] = useState("")
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobData()
  }, [])

  const fetchJobData = async () => {
    try {
      const pathParts = window.location.pathname.split("/")
      const jobId = pathParts[pathParts.length - 1]

      const response = await fetch(`/api/jobs?id=${jobId}`)
      const result = await response.json()

      if (result.job) {
        setJobData({
          id: result.job.id,
          title: result.job.title,
          company: result.job.company.company_name,
          location: result.job.location || "Remote",
          type: result.job.job_type,
          duration: "6 months", // You might want to add this to your schema
          postedDate: new Date(result.job.created_at).toLocaleDateString(),
          description: result.job.description,
          skills: result.job.key_skills ? result.job.key_skills.split(",").map((s) => s.trim()) : [],
          // Add other fields as needed
        })
      }
    } catch (error) {
      console.error("Error fetching job data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      localStorage.setItem("userEmail", email) // Store for assessment
      setEmailSubmitted(true)
    }
  }

  const handleProceed = () => {
    window.location.href = `/student?jobId=${jobData.id}`
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!jobData) {
    return <div>Error: Could not load job data.</div>
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#794BE1] rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{jobData.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-gray-700">{jobData.company}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-[#F2F2F2] text-[#794BE1]">
                    {jobData.type}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {jobData.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {jobData.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Posted {jobData.postedDate}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{jobData.description}</p>
              </CardContent>
            </Card>

            {jobData.responsibilities && (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {jobData.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {jobData.requirements && (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {jobData.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#F2F2F2] text-[#794BE1]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {jobData.companyValues && (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Company Culture & Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobData.companyValues.map((value, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#794BE1] rounded-full"></div>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Email Collection */}
          <div className="space-y-6">
            <Card className="bg-white border-2 border-[#794BE1]">
              <CardHeader>
                <CardTitle className="text-[#794BE1]">Interested in this role?</CardTitle>
                <CardDescription>Enter your email to start the application process</CardDescription>
              </CardHeader>
              <CardContent>
                {emailSubmitted ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-green-600 mb-1">Email Confirmed!</h3>
                      <p className="text-sm text-gray-600">Let's assess your fit for this role</p>
                    </div>
                    <Button onClick={handleProceed} className="w-full bg-[#794BE1] hover:bg-[#794BE1]/90 text-white">
                      Start Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1]"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#794BE1] hover:bg-[#794BE1]/90 text-white">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#794BE1] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Quick Assessment</p>
                    <p className="text-gray-600">Complete a 4-step assessment (5 minutes)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#794BE1] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Get Your Fitment Score</p>
                    <p className="text-gray-600">See how well you match this role</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#794BE1] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Express Interest</p>
                    <p className="text-gray-600">Apply if it's a good match</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
