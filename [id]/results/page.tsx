"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, MapPin, Clock, Target, CheckCircle, Star, Heart, Brain, User, Award } from "lucide-react"
import Link from "next/link"

export default function JobFitmentResultsPage() {
  const [applied, setApplied] = useState(false)

  // Mock job data and fitment results
  const jobData = {
    id: "JOB_ABC123XYZ",
    title: "Frontend Developer Intern",
    company: "TechFlow Solutions",
    location: "Mumbai, India",
    type: "Internship",
    duration: "6 months",
  }

  // Mock fitment score calculation
  const fitmentScore = 89
  const matchReasons = [
    { category: "Technical Skills", score: 92, reason: "Strong match in React.js and JavaScript knowledge" },
    { category: "Values Alignment", score: 95, reason: "High alignment with Growth and Learning values" },
    { category: "Work Preferences", score: 87, reason: "Good match for collaborative team environment" },
    { category: "Personality Fit", score: 84, reason: "Creative problem-solving approach fits role requirements" },
    { category: "Experience Level", score: 88, reason: "Perfect fit for entry-level internship position" },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-[#794BE1]"
    return "text-orange-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-purple-100"
    return "bg-orange-100"
  }

  const handleApply = () => {
    setApplied(true)
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Link
          href={`/job/${jobData.id}`}
          className="inline-flex items-center text-[#794BE1] hover:text-[#794BE1]/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Details
        </Link>

        {/* Fitment Score Header */}
        <Card className="mb-6 border-2 border-[#794BE1] bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#794BE1] rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Fitment Score</h2>
                  <p className="text-gray-600">
                    For {jobData.title} at {jobData.company}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{fitmentScore}%</div>
                <Badge className="bg-green-100 text-green-800 border-0">Excellent Match</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Summary */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#794BE1] rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{jobData.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-gray-700">{jobData.company}</CardDescription>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {jobData.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {jobData.duration}
                      </div>
                      <Badge variant="secondary" className="bg-[#F2F2F2] text-[#794BE1]">
                        {jobData.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Detailed Fitment Analysis */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-[#794BE1]" />
                  Detailed Fitment Analysis
                </CardTitle>
                <CardDescription>Here's how well you match each aspect of this role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {matchReasons.map((match, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#F2F2F2] rounded-full flex items-center justify-center">
                          {index === 0 && <Award className="w-4 h-4 text-[#794BE1]" />}
                          {index === 1 && <Heart className="w-4 h-4 text-[#794BE1]" />}
                          {index === 2 && <User className="w-4 h-4 text-[#794BE1]" />}
                          {index === 3 && <Brain className="w-4 h-4 text-[#794BE1]" />}
                          {index === 4 && <Star className="w-4 h-4 text-[#794BE1]" />}
                        </div>
                        <span className="font-medium">{match.category}</span>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(match.score)} ${getScoreColor(match.score)}`}
                      >
                        {match.score}%
                      </div>
                    </div>
                    <Progress value={match.score} className="h-2" />
                    <p className="text-sm text-gray-600 ml-11">{match.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Why This Match Works */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Why This Match Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">
                      Your <strong>Growth and Learning</strong> values perfectly align with this company's focus on
                      continuous development and skill building.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">
                      Your preference for <strong>collaborative work</strong> matches the team-oriented environment at
                      TechFlow Solutions.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">
                      Your <strong>creative problem-solving</strong> approach is exactly what they're looking for in
                      frontend development projects.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">
                      The role's <strong>6-month duration</strong> aligns well with your preference for structured
                      learning experiences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <Card className="bg-white">
              <CardContent className="p-6">
                {applied ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-600">Interest Submitted!</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Your interest has been sent to {jobData.company}. They'll review your profile and get back to
                        you soon.
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0">
                      Application ID: APP_{Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{fitmentScore}%</div>
                      <p className="text-sm text-gray-600">Excellent match for this role!</p>
                    </div>
                    <Button
                      onClick={handleApply}
                      className="w-full bg-[#794BE1] hover:bg-[#794BE1]/90 text-white"
                      size="lg"
                    >
                      <Heart className="w-4 h-4 mr-2" />I am interested
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overall Fitment</span>
                  <Badge className="bg-green-100 text-green-800 border-0">{fitmentScore}%</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Your Rank</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-green-600">Top 10%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Match Quality</span>
                  <Badge className="bg-green-100 text-green-800 border-0">Excellent</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#794BE1] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Company Review</p>
                    <p className="text-gray-600">TechFlow Solutions will review your profile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#794BE1] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Interview Invitation</p>
                    <p className="text-gray-600">You may be invited for an interview</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#794BE1] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Final Decision</p>
                    <p className="text-gray-600">Get notified about the final outcome</p>
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
