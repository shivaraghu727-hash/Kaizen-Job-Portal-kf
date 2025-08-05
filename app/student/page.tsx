"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { GraduationCap, User, Target, CheckCircle, ArrowLeft, ArrowRight, Briefcase } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface Job {
  id: string
  title: string
  job_type: string
  description: string
  key_skills: string
  values: string
  openings: number
}

interface StudentData {
  fullName: string
  email: string
  degree: string
  specialization: string
}

interface Recommendation {
  id: string
  title: string
  fitmentScore: number
  reason: string
  openings: number
}

export default function StudentPage() {
  const [currentStep, setCurrentStep] = useState<"basic-info" | "work-preferences" | "personality" | "results" | "opportunities">("basic-info")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")

  const [studentData, setStudentData] = useState<StudentData>({
    fullName: "",
    email: "",
    degree: "",
    specialization: "",
  })

  const [workPreferences, setWorkPreferences] = useState({
    independence: [50],
    analytical: [50],
    detail: [50],
    structured: [50],
    risk: [50],
  })

  const [personalityAnswers, setPersonalityAnswers] = useState<Record<number, number>>({})
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const personalityQuestions = [
    "I prefer working in a team to achieve goals.",
    "I enjoy solving complex problems.",
    "I thrive in structured environments.",
    "I value creativity in my work.",
    "I adapt quickly to changes.",
    "I focus on details to ensure quality.",
    "I like taking initiative on projects.",
  ]

  // Sample job data (replace with API call in production)
  const jobs: Job[] = [
    {
      id: "1",
      title: "UX Designer",
      job_type: "Full-Time",
      description: "Design user-friendly interfaces.",
      key_skills: "Creativity,Collaboration,Problem-Solving",
      values: "Team-Oriented,Innovative",
      openings: 3,
    },
    {
      id: "2",
      title: "Software Engineer",
      job_type: "Full-Time",
      description: "Develop robust applications.",
      key_skills: "Problem-Solving,Analytical,Detail-Oriented",
      values: "Structured,Innovative",
      openings: 2,
    },
    {
      id: "3",
      title: "Product Manager",
      job_type: "Full-Time",
      description: "Lead product development teams.",
      key_skills: "Collaboration,Big Picture,Initiative",
      values: "Flexible,Team-Oriented",
      openings: 1,
    },
    {
      id: "4",
      title: "Data Analyst",
      job_type: "Full-Time",
      description: "Analyze data for insights.",
      key_skills: "Analytical,Detail-Oriented,Problem-Solving",
      values: "Structured,Focused",
      openings: 4,
    },
    {
      id: "5",
      title: "Marketing Specialist",
      job_type: "Full-Time",
      description: "Create marketing campaigns.",
      key_skills: "Creativity,Collaboration,Initiative",
      values: "Flexible,Innovative",
      openings: 2,
    },
  ]

  useEffect(() => {
    if (jobId) {
      loadJobDetails(jobId)
    }
  }, [jobId])

  const loadJobDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs?jobId=${id}`)
      const result = await response.json()
      if (result.success && result.job) {
        setJob(result.job)
      }
    } catch (error) {
      console.error("Error loading job details:", error)
    }
  }

  const calculateFitmentScores = () => {
    const matches: Recommendation[] = jobs.map((job) => {
      let score = 0
      const reasons: string[] = []

      // Map sliders to job skills/values
      const sliderMappings = [
        { key: "independence", left: "Independent Work", right: "Collaboration" },
        { key: "analytical", left: "Analytical", right: "Creative" },
        { key: "detail", left: "Detail-Oriented", right: "Big Picture" },
        { key: "structured", left: "Structured", right: "Flexible" },
        { key: "risk", left: "Risk-Averse", right: "Risk-Taking" },
      ]

      const jobSkills = job.key_skills.split(",")
      const jobValues = job.values.split(",")

      sliderMappings.forEach(({ key, left, right }) => {
        const value = workPreferences[key as keyof typeof workPreferences][0] / 100 // Normalize to 0-1
        if (jobSkills.includes(right) || jobValues.includes(right)) {
          score += value * 10 // Right side alignment
          if (value > 0.7) reasons.push(`You lean towards ${right}, which aligns with this role.`)
        } else if (jobSkills.includes(left) || jobValues.includes(left)) {
          score += (1 - value) * 10 // Left side alignment
          if (value < 0.3) reasons.push(`You lean towards ${left}, which aligns with this role.`)
        }
      })

      // Map personality answers to job skills/values
      personalityQuestions.forEach((question, index) => {
        const value = (personalityAnswers[index] || 3) / 5 // Normalize to 0-1
        const keywords = question.toLowerCase().split(" ")
        if (
          jobSkills.some((skill) => keywords.includes(skill.toLowerCase())) ||
          jobValues.some((value) => keywords.includes(value.toLowerCase()))
        ) {
          score += value * 7.14 // Each statement contributes up to ~7.14% (100/14)
          if (value > 0.6) reasons.push(`Your response "${question}" aligns with this role.`)
        }
      })

      // Ensure score is between 0 and 100
      score = Math.min(Math.max(score, 0), 100)

      return {
        id: job.id,
        title: job.title,
        fitmentScore: Math.round(score),
        reason: reasons.join(" ") || "Your profile partially aligns with this role.",
        openings: job.openings,
      }
    })

    // Sort by fitment score and take top 5
    setRecommendations(matches.sort((a, b) => b.fitmentScore - a.fitmentScore).slice(0, 5))
  }

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentData.fullName || !studentData.email || !studentData.degree) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep("work-preferences")
  }

  const handleWorkPreferencesSubmit = () => {
    setCurrentStep("personality")
  }

  const handlePersonalitySubmit = () => {
    if (Object.keys(personalityAnswers).length !== 7) {
      toast({
        title: "Complete Assessment",
        description: "Please answer all 7 personality questions.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      calculateFitmentScores()
      toast({
        title: "Assessment Complete!",
        description: "Your career assessment has been completed successfully.",
      })
      setCurrentStep("results")
    } catch (error) {
      console.error("Assessment submission error:", error)
      toast({
        title: "Submission Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewOpenings = (jobId: string) => {
    // Placeholder for viewing job openings (e.g., redirect to job detail page or show modal)
    console.log(`View openings for job ID: ${jobId}`)
  }

  const getStepProgress = () => {
    const steps = ["basic-info", "work-preferences", "personality", "results", "opportunities"]
    const currentIndex = steps.indexOf(currentStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  // Basic Info Step
  if (currentStep === "basic-info") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 group">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            <div className="text-sm text-muted-foreground">Step 1 of 4</div>
          </div>

          <div className="mb-6">
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Basic Information</CardTitle>
                  <CardDescription>Let's start with your basic details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Name *</Label>
                    <Input
                      id="fullName"
                      value={studentData.fullName}
                      onChange={(e) => setStudentData((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={studentData.email}
                      onChange={(e) => setStudentData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree">Education Degree *</Label>
                    <Select
                      value={studentData.degree}
                      onValueChange={(value) => setStudentData((prev) => ({ ...prev, degree: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech</SelectItem>
                        <SelectItem value="be">B.E.</SelectItem>
                        <SelectItem value="mtech">M.Tech</SelectItem>
                        <SelectItem value="me">M.E.</SelectItem>
                        <SelectItem value="bsc">B.Sc</SelectItem>
                        <SelectItem value="msc">M.Sc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={studentData.specialization}
                      onChange={(e) => setStudentData((prev) => ({ ...prev, specialization: e.target.value }))}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-border">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Work Preferences Step
  if (currentStep === "work-preferences") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentStep("basic-info")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">Step 2 of 4</div>
          </div>

          <div className="mb-6">
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Work Preferences</CardTitle>
                  <CardDescription>Use the sliders to indicate your preferences (0-100)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Independent Work vs. Team Collaboration</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.independence[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Independent Work</span>
                    <Slider
                      value={workPreferences.independence}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, independence: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Team Collaboration</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Analytical vs. Creative</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.analytical[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Analytical</span>
                    <Slider
                      value={workPreferences.analytical}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, analytical: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Creative</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Detail-Oriented vs. Big Picture</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.detail[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Detail-Oriented</span>
                    <Slider
                      value={workPreferences.detail}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, detail: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Big Picture</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Structured vs. Flexible</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.structured[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Structured</span>
                    <Slider
                      value={workPreferences.structured}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, structured: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Flexible</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Risk-Averse vs. Risk-Taking</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.risk[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Risk-Averse</span>
                    <Slider
                      value={workPreferences.risk}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, risk: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Risk-Taking</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  onClick={handleWorkPreferencesSubmit}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Personality Assessment Step
  if (currentStep === "personality") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentStep("work-preferences")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">Step 3 of 4</div>
          </div>

          <div className="mb-6">
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Personality Assessment</CardTitle>
                  <CardDescription>
                    Rate how much you agree with each statement (1 = Strongly Disagree, 5 = Strongly Agree)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {personalityQuestions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="mb-4">
                      <span className="text-sm font-medium text-primary mr-2">{index + 1}.</span>
                      <span className="text-sm">{question}</span>
                    </div>
                    <RadioGroup
                      value={personalityAnswers[index]?.toString() || ""}
                      onValueChange={(value) =>
                        setPersonalityAnswers((prev) => ({ ...prev, [index]: Number.parseInt(value) }))
                      }
                      className="flex space-x-6"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <RadioGroupItem value={value.toString()} id={`q${index}-${value}`} />
                          <Label htmlFor={`q${index}-${value}`} className="text-sm">
                            {value}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  onClick={handlePersonalitySubmit}
                  disabled={isSubmitting || Object.keys(personalityAnswers).length !== 7}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      View Results
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Results Step
  if (currentStep === "results") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-6xl py-8">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Career Recommendations</h1>
            <p className="text-muted-foreground">Based on your assessment, here are your top career matches</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recommendations.map((match) => (
              <Card
                key={match.id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleViewOpenings(match.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{match.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            className={`text-xs ${
                              match.fitmentScore >= 85
                                ? "bg-green-100 text-green-600"
                                : match.fitmentScore >= 75
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-orange-100 text-orange-600"
                            } border-0`}
                          >
                            {match.fitmentScore}% Match
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardDescription className="text-sm text-muted-foreground mb-4">
                    <strong>Why You Match:</strong> {match.reason}
                  </CardDescription>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">OPENINGS</h4>
                      <p className="text-sm">{match.openings.toLocaleString()} openings available</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setCurrentStep("opportunities")}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Explore Opportunities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Opportunities Step
  if (currentStep === "opportunities") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-6xl py-8">
          <Button
            onClick={() => setCurrentStep("results")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Available Opportunities</h1>
            <p className="text-muted-foreground">Explore job openings in your recommended career paths</p>
          </div>

          <div className="grid gap-6">
            {recommendations.map((match) => (
              <Card key={match.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-1">{match.title}</h3>
                        <div className="flex items-center space-x-4 text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span className="font-medium">{match.openings.toLocaleString()} openings available</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{match.fitmentScore}% Match</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          <strong>Why You Match:</strong> {match.reason}
                        </p>
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium text-muted-foreground">REQUIRED SKILLS</h4>
                          <div className="flex flex-wrap gap-2">
                            {job?.key_skills.split(",").map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleViewOpenings(match.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      View Openings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
