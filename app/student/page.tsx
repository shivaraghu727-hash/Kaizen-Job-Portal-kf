"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  GraduationCap,
  User,
  Target,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Heart,
  Code,
  Database,
  Settings,
  Smartphone,
  Shield,
  BarChart3,
  Cpu,
  Zap,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

interface Job {
  id: string
  title: string
  job_type: string
  location: string
  description: string
  key_skills: string
  salary: string
  company_email: string
}

interface CareerMatch {
  id: string
  title: string
  fitmentScore: number
  description: string
  skills: string[]
  openings: number
  icon: React.ComponentType<any>
  color: string
}

const careerOptions = [
  {
    id: "frontend",
    label: "Frontend Development",
    skills: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
    values: ["Creativity", "Excellence", "Craftsmanship"],
    personality: [0, 2, 5], // creativity, social, curiosity
    workPrefs: { independence: [0, 50], pace: [50, 100], focus: [0, 50] },
    openings: 2847,
    icon: Code,
    color: "bg-blue-500",
  },
  {
    id: "data_analyst",
    label: "Data Analyst",
    skills: ["Excel", "SQL", "Tableau", "Statistics", "Data Visualization"],
    values: ["Learning", "Curiosity", "Purpose"],
    personality: [1, 5, 9], // organization, curiosity, calm
    workPrefs: { independence: [50, 100], pace: [0, 50], focus: [50, 100] },
    openings: 2100,
    icon: BarChart3,
    color: "bg-indigo-500",
  },
  {
    id: "project_manager",
    label: "Project Manager",
    skills: ["Project Planning", "Communication", "Leadership", "Agile", "Risk Management"],
    values: ["Leadership", "Collaboration", "Impact"],
    personality: [2, 6, 9], // social, responsibility, calm
    workPrefs: { independence: [0, 50], pace: [50, 100], focus: [0, 50] },
    openings: 1800,
    icon: Briefcase,
    color: "bg-green-500",
  },
  {
    id: "ux_designer",
    label: "UX Designer",
    skills: ["Wireframing", "Prototyping", "Figma", "User Research", "UI Design"],
    values: ["Creativity", "Empathy", "Innovation"],
    personality: [0, 3, 5], // creativity, helpfulness, curiosity
    workPrefs: { independence: [0, 50], pace: [50, 100], focus: [0, 50] },
    openings: 1650,
    icon: Heart,
    color: "bg-pink-500",
  },
  {
    id: "healthcare_admin",
    label: "Healthcare Administrator",
    skills: ["Operations Management", "Compliance", "Patient Coordination", "Budgeting"],
    values: ["Service", "Community", "Responsibility"],
    personality: [3, 6, 9], // helpfulness, responsibility, calm
    workPrefs: { independence: [0, 50], pace: [0, 50], focus: [50, 100] },
    openings: 1450,
    icon: Settings,
    color: "bg-yellow-500",
  },
]

const personalityQuestions = [
  "I enjoy exploring new ideas and creative solutions",
  "I am organized and like to plan ahead",
  "I feel energized when interacting with groups of people",
  "I try to be helpful and consider others' feelings",
  "I often worry about things that might go wrong",
  "I am curious about many different topics",
  "I follow through on my commitments",
]

const coreValues = [
  "Impact",
  "Autonomy",
  "Creativity",
  "Growth",
  "Justice",
  "Service",
  "Security",
  "Challenge",
  "Belonging",
  "Freedom",
  "Community",
  "Excellence",
  "Balance",
  "Recognition",
  "Learning",
  "Purpose",
  "Curiosity",
  "Adventure",
  "Leadership",
  "Craftsmanship",
]

export default function StudentPage() {
  const [currentStep, setCurrentStep] = useState<
    "basic-info" | "core-values" | "personality" | "work-preferences" | "results" | "opportunities"
  >("basic-info")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const jobId = searchParams.get("jobId")

  const [studentData, setStudentData] = useState({
    fullName: "",
    email: "",
    phone: "",
    degree: "",
    specialization: "",
  })

  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [personalityAnswers, setPersonalityAnswers] = useState<Record<number, number>>({})
  const [workPreferences, setWorkPreferences] = useState({
    independence: [50],
    routine: [50],
    pace: [50],
    focus: [50],
    building: [50],
  })

  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([])
  const [interestedRoles, setInterestedRoles] = useState<string[]>([])

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

  const calculateFitmentScores = (values: string[], personality: Record<number, number>, workPrefs: any) => {
    const matches: CareerMatch[] = []

    careerOptions.forEach((career) => {
      let score = 50 // Base score

      // Value alignment (30% weight)
      const valueMatches = values.filter((v) => career.values.includes(v)).length
      score += (valueMatches / 5) * 30 // Max 30 points for matching all 5 values

      // Personality alignment (40% weight)
      let personalityScore = 0
      career.personality.forEach((questionIndex) => {
        const answer = personality[questionIndex] || 3
        personalityScore += (answer - 3) * 4 // -8 to +8 per question
      })
      score += (personalityScore / 24) * 40 // Normalize to 40 points max

      // Work preferences alignment (30% weight)
      let workPrefScore = 0
      if (workPrefs.independence[0] >= career.workPrefs.independence[0] && workPrefs.independence[0] <= career.workPrefs.independence[1]) {
        workPrefScore += 10
      }
      if (workPrefs.pace[0] >= career.workPrefs.pace[0] && workPrefs.pace[0] <= career.workPrefs.pace[1]) {
        workPrefScore += 10
      }
      if (workPrefs.focus[0] >= career.workPrefs.focus[0] && workPrefs.focus[0] <= career.workPrefs.focus[1]) {
        workPrefScore += 10
      }
      score += (workPrefScore / 30) * 30 // Normalize to 30 points max

      // Ensure score is within bounds
      score = Math.max(45, Math.min(95, score))

      // Generate reasoning
      const reasoning = []
      if (valueMatches > 0) {
        reasoning.push(`Your values (${values.filter((v) => career.values.includes(v)).join(", ")}) align with this role's focus on ${career.values.join(", ")}.`)
      }
      if (personalityScore > 0) {
        reasoning.push("Your personality traits match the role's requirements for creativity and responsibility.")
      }
      if (workPrefScore > 0) {
        reasoning.push("Your work preferences for independence, pace, and focus suit this role's work style.")
      }

      matches.push({
        id: career.id,
        title: career.label,
        fitmentScore: Math.round(score),
        description: reasoning.length > 0 ? reasoning.join(" ") : "This role aligns with your profile.",
        skills: career.skills,
        openings: career.openings,
        icon: career.icon,
        color: career.color,
      })
    })

    // Sort by fitment score and take top 5
    const topMatches = matches.sort((a, b) => b.fitmentScore - a.fitmentScore).slice(0, 5)
    setCareerMatches(topMatches)
  }

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentData.fullName || !studentData.email || !studentData.degree || !studentData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep("core-values")
  }

  const handleCoreValuesNext = () => {
    if (selectedValues.length !== 5) {
      toast({
        title: "Select 5 Values",
        description: "Please select exactly 5 core values that matter most to you.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep("personality")
  }

  const handlePersonalityNext = () => {
    if (Object.keys(personalityAnswers).length !== 7) {
      toast({
        title: "Complete Assessment",
        description: "Please answer all personality questions.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep("work-preferences")
  }

  const handleWorkPreferencesSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Calculate fitment scores
      calculateFitmentScores(selectedValues, personalityAnswers, workPreferences)

      // Save assessment data
      const assessmentData = {
        studentData,
        selectedValues,
        personalityAnswers,
        workPreferences,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem(`student_${studentData.phone}`, JSON.stringify(assessmentData))

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

  const handleInterested = async (roleId: string) => {
    if (interestedRoles.includes(roleId)) {
      toast({
        title: "Already Interested",
        description: "You have already shown interest in this role.",
      })
      return
    }

    try {
      // Save interest
      const interestData = {
        roleId,
        studentPhone: studentData.phone,
        timestamp: new Date().toISOString(),
      }

      const existingInterests = JSON.parse(localStorage.getItem("student_interests") || "[]")
      existingInterests.push(interestData)
      localStorage.setItem("student_interests", JSON.stringify(existingInterests))

      setInterestedRoles((prev) => [...prev, roleId])

      toast({
        title: "Interest Saved!",
        description: "Your interest has been recorded. Companies will be notified.",
      })
    } catch (error) {
      console.error("Error saving interest:", error)
      toast({
        title: "Error",
        description: "Failed to save interest. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStepProgress = () => {
    const steps = ["basic-info", "core-values", "personality", "work-preferences", "results"]
    const currentIndex = steps.indexOf(currentStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  // Basic Info Step
  if (currentStep === "basic-info") {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-screen-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link href="/" className="inline-flex items-center text-primary hover:bg-primary/10 text-sm sm:text-base font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            <div className="text-sm sm:text-base text-muted-foreground">Step 1 of 4</div>
          </div>

          <div className="mb-4 sm:mb-6">
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">Basic Information</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Let's start with your basic details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleBasicInfoSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm sm:text-base">Name *</Label>
                    <Input
                      id="fullName"
                      value={studentData.fullName}
                      onChange={(e) => setStudentData((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                      className="w-full text-sm sm:text-base rounded-lg border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={studentData.email}
                      onChange={(e) => setStudentData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                      className="w-full text-sm sm:text-base rounded-lg border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={studentData.phone}
                      onChange={(e) => setStudentData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      required
                      className="w-full text-sm sm:text-base rounded-lg border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree" className="text-sm sm:text-base">Education Degree *</Label>
                    <Select
                      value={studentData.degree}
                      onValueChange={(value) => setStudentData((prev) => ({ ...prev, degree: value }))}
                      required
                    >
                      <SelectTrigger className="w-full text-sm sm:text-base rounded-lg border-gray-300">
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech" className="text-sm sm:text-base">B.Tech</SelectItem>
                        <SelectItem value="be" className="text-sm sm:text-base">B.E.</SelectItem>
                        <SelectItem value="mtech" className="text-sm sm:text-base">M.Tech</SelectItem>
                        <SelectItem value="me" className="text-sm sm:text-base">M.E.</SelectItem>
                        <SelectItem value="bsc" className="text-sm sm:text-base">B.Sc</SelectItem>
                        <SelectItem value="msc" className="text-sm sm:text-base">M.Sc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="specialization" className="text-sm sm:text-base">Specialization</Label>
                    <Input
                      id="specialization"
                      value={studentData.specialization}
                      onChange={(e) => setStudentData((prev) => ({ ...prev, specialization: e.target.value }))}
                      placeholder="e.g. Computer Science"
                      className="w-full text-sm sm:text-base rounded-lg border-gray-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 sm:pt-6 border-t border-border">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Core Values Step
  if (currentStep === "core-values") {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-screen-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Button
              onClick={() => setCurrentStep("basic-info")}
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm sm:text-base font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Previous
            </Button>
            <div className="text-sm sm:text-base text-muted-foreground">Step 2 of 4</div>
          </div>

          <div className="mb-4 sm:mb-6">
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">Core Values</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Select 5 values that matter most to you ({selectedValues.length}/5)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {coreValues.map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={value}
                      checked={selectedValues.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked && selectedValues.length < 5) {
                          setSelectedValues((prev) => [...prev, value])
                        } else if (!checked) {
                          setSelectedValues((prev) => prev.filter((v) => v !== value))
                        }
                      }}
                      disabled={!selectedValues.includes(value) && selectedValues.length >= 5}
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                    <Label
                      htmlFor={value}
                      className={`text-sm sm:text-base cursor-pointer ${
                        !selectedValues.includes(value) && selectedValues.length >= 5 ? "text-muted-foreground" : ""
                      }`}
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 sm:pt-6 border-t border-border">
                <Button
                  onClick={handleCoreValuesNext}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg"
                  disabled={selectedValues.length !== 5}
                >
                  Next
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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
      <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-screen-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Button
              onClick={() => setCurrentStep("core-values")}
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm sm:text-base font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Previous
            </Button>
            <div className="text-sm sm:text-base text-muted-foreground">Step 3 of 4</div>
          </div>

          <div className="mb-4 sm:mb-6">
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">Personality Assessment</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Rate how much you agree with each statement (1 = Strongly Disagree, 5 = Strongly Agree)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                {personalityQuestions.map((question, index) => (
                  <div key={index} className="p-3 sm:p-4 lg:p-5 border rounded-lg bg-background/50">
                    <div className="mb-2 sm:mb-3">
                      <span className="text-sm sm:text-base font-medium text-primary mr-2">{index + 1}.</span>
                      <span className="text-sm sm:text-base">{question}</span>
                    </div>
                    <RadioGroup
                      value={personalityAnswers[index]?.toString() || ""}
                      onValueChange={(value) =>
                        setPersonalityAnswers((prev) => ({ ...prev, [index]: Number.parseInt(value) }))
                      }
                      className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <RadioGroupItem value={value.toString()} id={`q${index}-${value}`} className="h-4 w-4 sm:h-5 sm:w-5" />
                          <Label htmlFor={`q${index}-${value}`} className="text-sm sm:text-base cursor-pointer">
                            {value}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 sm:pt-6 border-t border-border">
                <Button
                  onClick={handlePersonalityNext}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg"
                  disabled={Object.keys(personalityAnswers).length !== 7}
                >
                  Next
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Work Preferences Step
  if (currentStep === "work-preferences") {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-screen-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Button
              onClick={() => setCurrentStep("personality")}
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm sm:text-base font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Previous
            </Button>
            <div className="text-sm sm:text-base text-muted-foreground">Step 4 of 4</div>
          </div>

          <div className="mb-4 sm:mb-6">
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">Work Preferences</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Use the sliders to indicate your preferences (0-100)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-5 sm:space-y-6 lg:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm sm:text-base font-medium">Do you prefer working independently or with others?</Label>
                    <span className="text-sm sm:text-base text-muted-foreground">{workPreferences.independence[0]}</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
                    <span className="text-xs sm:text-sm text-muted-foreground">Independently</span>
                    <Slider
                      value={workPreferences.independence}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, independence: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">With Others</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm sm:text-base font-medium">Do you thrive on routines or flexibility?</Label>
                    <span className="text-sm sm:text-base text-muted-foreground">{workPreferences.routine[0]}</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
                    <span className="text-xs sm:text-sm text-muted-foreground">Routines</span>
                    <Slider
                      value={workPreferences.routine}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, routine: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">Flexibility</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm sm:text-base font-medium">What work pace energizes you most?</Label>
                    <span className="text-sm sm:text-base text-muted-foreground">{workPreferences.pace[0]}</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
                    <span className="text-xs sm:text-sm text-muted-foreground">Steady Pace</span>
                    <Slider
                      value={workPreferences.pace}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, pace: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">Fast Pace</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm sm:text-base font-medium">Do you like switching tasks or going deep into one?</Label>
                    <span className="text-sm sm:text-base text-muted-foreground">{workPreferences.focus[0]}</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
                    <span className="text-xs sm:text-sm text-muted-foreground">Switching Tasks</span>
                    <Slider
                      value={workPreferences.focus}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, focus: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">Deep Focus</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm sm:text-base font-medium">
                      Do you like building things or thinking about big ideas?
                    </Label>
                    <span className="text-sm sm:text-base text-muted-foreground">{workPreferences.building[0]}</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
                    <span className="text-xs sm:text-sm text-muted-foreground">Building Things</span>
                    <Slider
                      value={workPreferences.building}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, building: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">Big Ideas</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 sm:pt-6 border-t border-border">
                <Button
                  onClick={handleWorkPreferencesSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      View Results
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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
      <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-screen-lg">
          <Link href="/" className="inline-flex items-center text-primary hover:bg-primary/10 mb-6 sm:mb-8 text-sm sm:text-base font-medium transition-colors group">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Your Career Recommendations</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Based on your assessment, here are your top career matches</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {careerMatches.map((match, index) => {
              const IconComponent = match.icon
              return (
                <Card key={match.id} className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-xl hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${match.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base sm:text-lg font-medium">{match.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              className={`text-xs sm:text-sm ${
                                match.fitmentScore >= 85
                                  ? "bg-green-100 text-green-600"
                                  : match.fitmentScore >= 75
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-orange-100 text-orange-600"
                              } border-0`}
                            >
                              {match.fitmentScore}% match
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardDescription className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      {match.description}
                    </CardDescription>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">KEY SKILLS</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {match.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs sm:text-sm">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Button
              onClick={() => setCurrentStep("opportunities")}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg"
            >
              Explore Opportunities
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Opportunities Step
  if (currentStep === "opportunities") {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-screen-lg">
          <Button
            onClick={() => setCurrentStep("results")}
            variant="outline"
            className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground mb-6 sm:mb-8 text-sm sm:text-base font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Results
          </Button>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Available Opportunities</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Explore job openings in your recommended career paths</p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8">
            {careerMatches.map((match) => {
              const IconComponent = match.icon
              const isInterested = interestedRoles.includes(match.id)

              return (
                <Card key={match.id} className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-xl hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-start space-x-3 sm:space-x-4 w-full">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${match.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-1">{match.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-muted-foreground mb-2 sm:mb-3">
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-sm sm:text-base font-medium">{match.openings.toLocaleString()} openings</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-sm sm:text-base">{match.fitmentScore}% match</span>
                            </div>
                          </div>
                          <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3 line-clamp-3">{match.description}</p>
                          <div className="space-y-2">
                            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">REQUIRED SKILLS</h4>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {match.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs sm:text-sm bg-primary/10 text-primary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      {isInterested ? (
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 fill-current" />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-green-600">Interest Registered!</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Companies will contact you soon</p>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleInterested(match.id)}
                          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg"
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          I'm Interested
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">Ready to Start Your Career Journey?</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Your interests have been saved. Companies matching your profile will be notified and may reach out to
                  you directly.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
                      {careerMatches.reduce((sum, match) => sum + match.openings, 0).toLocaleString()}+
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">Total Opportunities</p>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">{careerMatches.length}</div>
                    <p className="text-sm sm:text-base text-muted-foreground">Career Matches</p>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
                      {Math.round(
                        careerMatches.reduce((sum, match) => sum + match.fitmentScore, 0) / careerMatches.length,
                      )}
                      %
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">Average Fit Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return null
}
