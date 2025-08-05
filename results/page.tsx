"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, Heart, Briefcase } from "lucide-react"
import Link from "next/link"

export default function StudentResultsPage() {
  const [jobProfiles, setJobProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [interestedProfiles, setInterestedProfiles] = useState<number[]>([])

  useEffect(() => {
    fetchCareerMatches()
  }, [])

  const fetchCareerMatches = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const assessmentId = urlParams.get("assessmentId")
      const email = localStorage.getItem("userEmail") // You'll need to store this during assessment

      const response = await fetch(`/api/assessment?email=${email}`)
      const result = await response.json()

      if (result.careerMatches) {
        setJobProfiles(
          result.careerMatches.map((match) => ({
            id: match.id,
            title: match.career_title,
            fitmentScore: match.fitment_score,
            rolesAvailable: Math.floor(Math.random() * 8) + 1, // Mock data
            description: `Work in ${match.career_title} role with exciting opportunities`,
            matchReasons: match.match_reasons,
            icon: getCareerIcon(match.career_title),
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching career matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInterest = async (profileId: number) => {
    try {
      const profile = jobProfiles.find((p) => p.id === profileId)
      if (!profile) return

      const email = localStorage.getItem("userEmail")
      const studentResponse = await fetch(`/api/assessment?email=${email}`)
      const studentData = await studentResponse.json()

      await fetch("/api/career-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentData.student.id,
          careerTitle: profile.title,
          interested: true,
        }),
      })

      setInterestedProfiles((prev) => [...prev, profileId])
    } catch (error) {
      console.error("Error updating interest:", error)
    }
  }

  const getCareerIcon = (title: string) => {
    const icons = {
      "Frontend Developer": "💻",
      "UX Designer": "🎨",
      "Data Analyst": "📊",
      "Marketing Specialist": "📢",
      "Software Developer": "⚙️",
      "Product Manager": "📋",
      "Backend Developer": "🔧",
      "DevOps Engineer": "🚀",
    }
    return icons[title] || "💼"
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 75) return "text-[#794BE1]"
    if (score >= 65) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-green-100"
    if (score >= 75) return "bg-purple-100"
    if (score >= 65) return "bg-orange-100"
    return "bg-red-100"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent Match"
    if (score >= 75) return "Good Match"
    if (score >= 65) return "Fair Match"
    return "Low Match"
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <Link href="/student" className="inline-flex items-center text-[#794BE1] hover:text-[#794BE1]/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessment
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#794BE1] rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Career Matches</h1>
          <p className="text-gray-600">Based on your assessment, here are the career profiles that fit you best</p>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobProfiles.map((profile) => (
              <Card key={profile.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{profile.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{profile.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            className={`text-xs ${getScoreBg(profile.fitmentScore)} ${getScoreColor(profile.fitmentScore)} border-0`}
                          >
                            {profile.fitmentScore}% match
                          </Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {profile.rolesAvailable} roles available
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardDescription className="text-sm text-gray-700 mb-4">{profile.description}</CardDescription>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-2">WHY YOU MATCH</h4>
                      <div className="space-y-1">
                        {profile.matchReasons.map((reason, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-[#794BE1] rounded-full mt-1.5 flex-shrink-0"></div>
                            <p className="text-xs text-gray-600">{reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {interestedProfiles.includes(profile.id) ? (
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-600">Interest Registered!</p>
                        <p className="text-xs text-gray-600">We'll match you with relevant opportunities</p>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleInterest(profile.id)}
                      className="w-full bg-[#794BE1] hover:bg-[#794BE1]/90 text-white"
                    >
                      <Heart className="w-4 h-4 mr-2" />I am interested
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {jobProfiles.length === 0 && !loading && (
          <Card className="bg-white text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-[#F2F2F2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any career matches based on your current assessment.
              </p>
              <Link href="/student">
                <Button className="bg-[#794BE1] hover:bg-[#794BE1]/90 text-white">Retake Assessment</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
