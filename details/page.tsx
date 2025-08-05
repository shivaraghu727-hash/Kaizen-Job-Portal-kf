"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  Heart,
  Brain,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function JobDetailsPage() {
  const [applied, setApplied] = useState(false)

  // Mock job data
  const jobData = {
    id: "JOB_ABC123XYZ",
    title: "Frontend Developer Intern",
    company: "TechFlow Solutions",
    location: "Mumbai, India",
    type: "Internship",
    duration: "6 months",
    salary: "₹25,000/month",
    postedDate: "2 days ago",
    description:
      "Join our dynamic team as a Frontend Developer Intern and work on cutting-edge web applications. You'll collaborate with experienced developers, learn modern frameworks, and contribute to real-world projects that impact thousands of users.",
    requirements: [
      "Currently pursuing B.Tech/B.E. in Computer Science or related field",
      "Basic knowledge of HTML, CSS, JavaScript",
      "Familiarity with React.js or similar frameworks",
      "Good problem-solving skills",
      "Excellent communication skills",
    ],
    responsibilities: [
      "Develop responsive web interfaces using React.js",
      "Collaborate with design team to implement UI/UX designs",
      "Write clean, maintainable code following best practices",
      "Participate in code reviews and team meetings",
      "Learn and adapt to new technologies as needed",
    ],
    skills: ["React.js", "JavaScript", "HTML/CSS", "Git", "REST APIs"],
    companyValues: [
      "Innovation and continuous learning",
      "Collaborative team environment",
      "Work-life balance",
      "Growth opportunities",
      "Inclusive culture",
    ],
  }

  // Mock fitment score calculation
  const fitmentScore = 87
  const matchReasons = [
    { category: "Technical Skills", score: 85, reason: "Strong match in React.js and JavaScript" },
    { category: "Experience Level", score: 90, reason: "Perfect fit for entry-level position" },
    { category: "Values Alignment", score: 92, reason: "High alignment with learning and growth values" },
    { category: "Personality Fit", score: 82, reason: "Good match for collaborative team environment" },
    { category: "Location Preference", score: 88, reason: "Mumbai is in your preferred locations" },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-100"
    if (score >= 60) return "bg-orange-100"
    return "bg-red-100"
  }

  const handleApply = () => {
    setApplied(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Link href="/student" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessment
        </Link>

        {/* Fitment Score Header */}
        <Card className="mb-6 border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Fitment Score</h2>
                  <p className="text-gray-600">Based on your assessment and preferences</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">{fitmentScore}%</div>
                <Badge className="bg-emerald-100 text-emerald-800">Excellent Match</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{jobData.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-gray-700">{jobData.company}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{jobData.type}</Badge>
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
                    <DollarSign className="w-4 h-4 mr-1" />
                    {jobData.salary}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Posted {jobData.postedDate}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{jobData.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {jobData.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
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

            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Culture & Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {jobData.companyValues.map((value, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <Card>
              <CardContent className="p-6">
                {applied ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-600">Application Submitted!</h3>
                      <p className="text-sm text-gray-600 mt-1">Your application has been sent to {jobData.company}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      Application ID: APP_{Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </Badge>
                  </div>
                ) : (
                  <Button
                    onClick={handleApply}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Fitment Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Fitment Analysis
                </CardTitle>
                <CardDescription>How well you match this opportunity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {matchReasons.map((match, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{match.category}</span>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${getScoreBg(match.score)} ${getScoreColor(match.score)}`}
                      >
                        {match.score}%
                      </div>
                    </div>
                    <Progress value={match.score} className="h-2" />
                    <p className="text-xs text-gray-600">{match.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Applications</span>
                  <Badge variant="secondary">23 applied</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Fitment</span>
                  <Badge variant="secondary">72%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <Badge variant="secondary">85%</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Your Rank</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-emerald-600">Top 15%</span>
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
