"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, TrendingUp, Briefcase, Building2 } from "lucide-react"
import Link from "next/link"

interface JobApplication {
  id: string
  fitmentScore: number
  analysis: {
    strengths: string[]
    areas_for_improvement: string[]
    overall_recommendation: string
  }
  jobData: {
    id: string
    title: string
    description: string
    job_type: string
    location: string
    company: {
      name: string
    }
  }
}

export default function JobResultsPage({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [applicationId, setApplicationId] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const appId = urlParams.get("applicationId")
    setApplicationId(appId)

    // Mock application data for demo
    setTimeout(() => {
      setApplication({
        id: appId || "mock_app_id",
        fitmentScore: 87,
        analysis: {
          strengths: [
            "Educational background aligns perfectly with job requirements",
            "Strong technical foundation in relevant technologies",
            "Excellent growth potential for this role",
            "Values match well with company culture",
          ],
          areas_for_improvement: [
            "Gain more hands-on experience with industry projects",
            "Develop specific domain knowledge in the field",
            "Build a portfolio showcasing relevant skills",
          ],
          overall_recommendation:
            "This is an excellent fit for your profile! Your educational background and core values align perfectly with this role. The position offers great learning opportunities and matches your career aspirations. We recommend focusing on building practical experience to strengthen your application further.",
        },
        jobData: {
          id: params.id,
          title: "Software Developer Intern",
          description:
            "Join our dynamic team as a Software Developer Intern and work on cutting-edge projects using modern technologies. You'll collaborate with experienced developers and contribute to real-world applications.",
          job_type: "internship",
          location: "Remote/Hybrid",
          company: {
            name: "Tech Innovation Inc",
          },
        },
      })
      setLoading(false)
    }, 1500)
  }, [params.id])

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 65) return "text-yellow-600"
    return "text-gray-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800"
    if (score >= 75) return "bg-blue-100 text-blue-800"
    if (score >= 65) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent Match"
    if (score >= 75) return "Good Match"
    if (score >= 65) return "Fair Match"
    return "Consider"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#794BE1] mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your job application with AI...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Application not found</p>
            <Link href="/student">
              <Button className="bg-[#794BE1] hover:bg-[#794BE1]/90">Take Assessment Again</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Link href="/student" className="inline-flex items-center text-[#794BE1] hover:text-[#794BE1]/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessment
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#794BE1] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h1>
          <p className="text-gray-600">Your AI-powered job fit analysis is ready</p>
          {applicationId && (
            <Badge variant="secondary" className="mt-2 bg-[#F2F2F2] text-[#794BE1]">
              Application ID: {applicationId}
            </Badge>
          )}
        </div>

        {/* Job Information */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#794BE1]" />
              </div>
              <div>
                <CardTitle>{application.jobData.title}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>{application.jobData.company.name}</span>
                  <span>•</span>
                  <span>{application.jobData.location}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {application.jobData.job_type}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{application.jobData.description}</p>
          </CardContent>
        </Card>

        {/* Fitment Score */}
        <Card className="mb-8 bg-gradient-to-r from-[#794BE1]/5 to-[#794BE1]/10 border-[#794BE1]/20">
          <CardHeader>
            <CardTitle className="flex items-center text-[#794BE1]">
              <TrendingUp className="w-5 h-5 mr-2" />
              Your AI Fitment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-[#794BE1] mb-1">{application.fitmentScore}%</div>
                <Badge className={`${getScoreBadgeColor(application.fitmentScore)} font-semibold`}>
                  {getScoreLabel(application.fitmentScore)}
                </Badge>
              </div>
              <div className="w-32 h-32 relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#794BE1"
                    strokeWidth="2"
                    strokeDasharray={`${application.fitmentScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#794BE1]">{application.fitmentScore}%</span>
                </div>
              </div>
            </div>
            <Progress value={application.fitmentScore} className="h-3" />
          </CardContent>
        </Card>

        {/* Analysis Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Your Strengths
              </CardTitle>
              <CardDescription>What makes you a great fit for this role</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {application.analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Growth Opportunities
              </CardTitle>
              <CardDescription>Areas to focus on for even better fit</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {application.analysis.areas_for_improvement.map((area, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Overall Recommendation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#794BE1]">AI Recommendation</CardTitle>
            <CardDescription>Comprehensive analysis and next steps</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{application.analysis.overall_recommendation}</p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-[#F2F2F2]">
          <CardHeader>
            <CardTitle className="text-[#794BE1]">What Happens Next?</CardTitle>
            <CardDescription>Your application journey continues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Application Review</h4>
                <p className="text-sm text-gray-600">
                  The company will review your application along with your fitment score and analysis.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Skill Development</h4>
                <p className="text-sm text-gray-600">
                  Use the growth opportunities identified to strengthen your profile for future applications.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Stay Updated</h4>
                <p className="text-sm text-gray-600">
                  You'll be notified of any updates regarding your application status.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Explore More</h4>
                <p className="text-sm text-gray-600">
                  Continue exploring other opportunities that match your profile and interests.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" className="border-[#794BE1] text-[#794BE1] bg-transparent">
            Download Analysis
          </Button>
          <Button className="bg-[#794BE1] hover:bg-[#794BE1]/90">Explore More Jobs</Button>
        </div>
      </div>
    </div>
  )
}
