"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Target,
  Heart,
  Brain,
  Users,
  Download,
  Briefcase,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CareerMatch {
  career: string
  reason: string
  fitmentScore: number
}

interface PersonalityTrait {
  score: number
  summary: string
}

interface PersonalityProfile {
  Openness: PersonalityTrait
  Conscientiousness: PersonalityTrait
  Extraversion: PersonalityTrait
  Agreeableness: PersonalityTrait
  Neuroticism: PersonalityTrait
}

interface WorkStyle {
  working_style: string
  preferred_environment: string
  learning_approach: string
  risk_attitude: string
  stress_response: string
  independence_vs_collaboration: string
}

export default function StudentResultsPage() {
  const router = useRouter()
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([])
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null)
  const [workStyle, setWorkStyle] = useState<WorkStyle | null>(null)
  const [loading, setLoading] = useState(true)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("assessmentId")
    setAssessmentId(id)

    // Simulate loading and show results
    setTimeout(() => {
      setCareerMatches([
        {
          career: "Software Developer",
          reason: "Strong technical background and problem-solving skills match your analytical nature",
          fitmentScore: 88,
        },
        {
          career: "Product Manager",
          reason: "Leadership potential and strategic thinking align with your organizational skills",
          fitmentScore: 82,
        },
        {
          career: "Data Analyst",
          reason: "Analytical mindset and attention to detail suit data-driven roles",
          fitmentScore: 76,
        },
      ])

      setPersonalityProfile({
        Openness: { score: 4, summary: "You're curious and enjoy exploring new ideas and creative solutions." },
        Conscientiousness: { score: 4, summary: "You're organized, reliable, and like to plan ahead." },
        Extraversion: { score: 3, summary: "You enjoy social interactions but also value quiet time." },
        Agreeableness: { score: 4, summary: "You're helpful, considerate, and work well with others." },
        Neuroticism: { score: 2, summary: "You tend to stay calm and composed under pressure." },
      })

      setWorkStyle({
        working_style: "Collaborative problem-solver with attention to detail",
        preferred_environment: "Team-based with flexibility for independent work",
        learning_approach: "Hands-on learning with structured guidance",
        risk_attitude: "Calculated risk-taker who evaluates options carefully",
        stress_response: "Stays calm under pressure and seeks solutions",
        independence_vs_collaboration: "Enjoys both teamwork and independent contributions",
      })

      setLoading(false)
    }, 1500)
  }, [])

  const getTraitColor = (score: number) => {
    if (score >= 4) return "bg-green-500"
    if (score >= 3) return "bg-blue-500"
    if (score >= 2) return "bg-yellow-500"
    return "bg-gray-500"
  }

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

  const handleDownloadResults = () => {
    // Create a comprehensive text version of results
    const resultsText = `
CAREER ASSESSMENT RESULTS
========================
Assessment ID: ${assessmentId}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

PERSONALITY PROFILE (Big Five Traits):
=====================================
${
  personalityProfile
    ? Object.entries(personalityProfile)
        .map(([trait, data]) => `${trait}: ${data.score}/5 - ${data.summary}`)
        .join("\n")
    : "No personality data available"
}

CAREER MATCHES:
==============
${careerMatches
  .map(
    (career, index) =>
      `${index + 1}. ${career.career} (${career.fitmentScore}% match)
   Reason: ${career.reason}`,
  )
  .join("\n\n")}

WORK STYLE PROFILE:
==================
${
  workStyle
    ? Object.entries(workStyle)
        .map(([key, value]) => `${key.replace(/_/g, " ").toUpperCase()}: ${value}`)
        .join("\n")
    : "No work style data available"
}

NEXT STEPS:
==========
1. Explore job opportunities that match your top career recommendations
2. Focus on developing skills relevant to your highest-scoring matches
3. Network with professionals in your target career fields
4. Consider retaking this assessment as your preferences evolve

Generated by Kaizen Job Portal - AI-Powered Career Matching
    `

    const blob = new Blob([resultsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `career_assessment_results_${assessmentId || "unknown"}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Show success message
    alert("Assessment results downloaded successfully!")
  }

  const handleExploreJobs = () => {
    // Navigate to opportunities page
    router.push("/opportunities")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA] p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#794BE1] mx-auto mb-6"></div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-700">Analyzing your assessment with AI...</p>
              <p className="text-gray-500">This may take a few moments</p>
              <div className="flex justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-[#794BE1] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[#794BE1] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#794BE1] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA] p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Link
          href="/student"
          className="inline-flex items-center text-[#794BE1] hover:text-[#794BE1]/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessment
        </Link>

        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Your AI-Powered Career Analysis</h1>
          <p className="text-lg text-gray-600 mb-4">Comprehensive assessment results powered by advanced AI</p>
          {assessmentId && (
            <Badge variant="secondary" className="bg-[#794BE1]/10 text-[#794BE1] px-4 py-2 text-sm font-medium">
              Assessment ID: {assessmentId}
            </Badge>
          )}
        </div>

        {/* Enhanced Results Overview */}
        <Card className="mb-8 bg-gradient-to-r from-[#794BE1]/5 via-[#9D5CE8]/5 to-[#794BE1]/5 border-[#794BE1]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-[#794BE1] text-xl">
              <TrendingUp className="w-6 h-6 mr-3" />
              Assessment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#794BE1] mb-2">{careerMatches.length}</div>
                <div className="text-gray-600 font-medium">Career Matches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#794BE1] mb-2">
                  {careerMatches.length > 0 ? Math.round(careerMatches[0].fitmentScore) : 0}%
                </div>
                <div className="text-gray-600 font-medium">Top Match Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#794BE1] mb-2">
                  {careerMatches.filter((c) => c.fitmentScore >= 75).length}
                </div>
                <div className="text-gray-600 font-medium">Strong Matches</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Personality Profile */}
        {personalityProfile && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Brain className="w-6 h-6 mr-3 text-[#794BE1]" />
                Your Personality Profile (Big Five Traits)
              </CardTitle>
              <CardDescription className="text-base">
                AI analysis of your personality based on your responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(personalityProfile).map(([trait, data]) => (
                  <div key={trait} className="flex items-center space-x-6">
                    <div className="w-32 text-base font-semibold text-gray-700">{trait}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                i <= data.score ? getTraitColor(data.score) : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-gray-600 flex-1">{data.summary}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Work Style Summary */}
        {workStyle && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="w-6 h-6 mr-3 text-[#794BE1]" />
                Your Work Style Profile
              </CardTitle>
              <CardDescription className="text-base">How you prefer to work based on your assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Working Style</h4>
                    <p className="text-gray-600">{workStyle.working_style}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Preferred Environment</h4>
                    <p className="text-gray-600">{workStyle.preferred_environment}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Learning Approach</h4>
                    <p className="text-gray-600">{workStyle.learning_approach}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Risk Attitude</h4>
                    <p className="text-gray-600">{workStyle.risk_attitude}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Stress Response</h4>
                    <p className="text-gray-600">{workStyle.stress_response}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Collaboration Style</h4>
                    <p className="text-gray-600">{workStyle.independence_vs_collaboration}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Career Matches */}
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-[#794BE1] mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Your AI-Recommended Careers</h2>
          </div>

          {careerMatches.map((career, index) => (
            <Card
              key={index}
              className="bg-white hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#794BE1]"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="secondary" className="bg-[#794BE1] text-white px-3 py-1">
                        #{index + 1}
                      </Badge>
                      <CardTitle className="text-xl">{career.career}</CardTitle>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getScoreBadgeColor(career.fitmentScore)} font-bold text-lg px-4 py-2`}>
                      {career.fitmentScore}% Match
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Enhanced Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">AI Fitment Score</span>
                      <span className={`font-bold ${getScoreColor(career.fitmentScore)}`}>{career.fitmentScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${career.fitmentScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Enhanced Reasons */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-[#794BE1]" />
                      AI Analysis - Why this matches you:
                    </h4>
                    <div className="p-4 bg-[#794BE1]/5 rounded-lg border border-[#794BE1]/20">
                      <p className="text-gray-700">{career.reason}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Next Steps */}
        <Card className="mt-8 bg-gradient-to-r from-[#F8F9FA] to-[#E9ECEF] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#794BE1] text-xl">Next Steps</CardTitle>
            <CardDescription className="text-base">Here's what you can do with your AI-powered results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-[#794BE1]" />
                  <h4 className="font-semibold">Explore Opportunities</h4>
                </div>
                <p className="text-gray-600">
                  Look for internships and jobs that match your AI-recommended career paths
                </p>
              </div>
              <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#794BE1]" />
                  <h4 className="font-semibold">Skill Development</h4>
                </div>
                <p className="text-gray-600">
                  Focus on building skills relevant to your highest-scoring career matches
                </p>
              </div>
              <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#794BE1]" />
                  <h4 className="font-semibold">Network & Connect</h4>
                </div>
                <p className="text-gray-600">Connect with professionals in your target career fields</p>
              </div>
              <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-[#794BE1]" />
                  <h4 className="font-semibold">Retake Assessment</h4>
                </div>
                <p className="text-gray-600">Your preferences may evolve - retake the assessment anytime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
          <Button
            onClick={handleDownloadResults}
            variant="outline"
            className="border-2 border-[#794BE1] text-[#794BE1] bg-transparent hover:bg-[#794BE1] hover:text-white transition-all duration-300 px-8 py-3 text-lg font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Results
          </Button>
          <Button
            onClick={handleExploreJobs}
            className="bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] hover:from-[#6B3BC7] hover:to-[#8B4CE8] text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Explore Job Opportunities
          </Button>
        </div>
      </div>
    </div>
  )
}
