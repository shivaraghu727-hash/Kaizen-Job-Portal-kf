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
  Globe,
  Zap,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

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

const engineeringCareers = [
  { id: "frontend", label: "Frontend Development", skills: ["React", "JavaScript", "CSS", "HTML"] },
  { id: "backend", label: "Backend Development", skills: ["Node.js", "Python", "Java", "Databases"] },
  { id: "fullstack", label: "Full Stack Development", skills: ["React", "Node.js", "MongoDB", "APIs"] },
  { id: "mobile", label: "Mobile App Development", skills: ["React Native", "Flutter", "iOS", "Android"] },
  { id: "devops", label: "DevOps Engineering", skills: ["Docker", "Kubernetes", "AWS", "CI/CD"] },
  { id: "data", label: "Data Engineering", skills: ["Python", "SQL", "Apache Spark", "ETL"] },
  { id: "ml", label: "Machine Learning Engineering", skills: ["Python", "TensorFlow", "PyTorch", "MLOps"] },
  {
    id: "cybersecurity",
    label: "Cybersecurity Engineering",
    skills: ["Network Security", "Penetration Testing", "SIEM"],
  },
  { id: "cloud", label: "Cloud Engineering", skills: ["AWS", "Azure", "GCP", "Terraform"] },
  { id: "embedded", label: "Embedded Systems", skills: ["C/C++", "Microcontrollers", "IoT", "RTOS"] },
  { id: "game", label: "Game Development", skills: ["Unity", "C#", "3D Graphics", "Game Design"] },
  { id: "blockchain", label: "Blockchain Development", skills: ["Solidity", "Web3", "Smart Contracts", "DeFi"] },
]

const personalityQuestions = [
  "I enjoy exploring new ideas and creative solutions",
  "I am organized and like to plan ahead",
  "I feel energized when interacting with groups of people",
  "I try to be helpful and considerate of others' feelings",
  "I often worry about things that might go wrong",
  "I am curious about many different topics and subjects",
  "I follow through on my commitments and responsibilities",
  "I prefer being the center of attention in social situations",
  "I trust others and believe people have good intentions",
  "I remain calm and composed under pressure",
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
    | "phone-check"
    | "basic-info"
    | "core-values"
    | "career-interests"
    | "personality"
    | "work-preferences"
    | "results"
    | "opportunities"
  >("phone-check")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [phoneExists, setPhoneExists] = useState(false)
  const [existingAssessment, setExistingAssessment] = useState<any>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const jobId = searchParams.get("jobId")

  const [phoneNumber, setPhoneNumber] = useState("")
  const [studentData, setStudentData] = useState({
    fullName: "",
    email: "",
    phone: "",
    degree: "",
    specialization: "",
  })

  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [selectedCareers, setSelectedCareers] = useState<string[]>([])
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

  const checkPhoneNumber = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to continue.",
        variant: "destructive",
      })
      return
    }

    // Check if phone number exists in localStorage (mock check)
    const existingData = localStorage.getItem(`student_${phoneNumber}`)
    if (existingData) {
      const data = JSON.parse(existingData)
      setPhoneExists(true)
      setExistingAssessment(data)
      setStudentData(data.studentData || {})
      calculateFitmentScores(data.selectedCareers || [], data.personalityAnswers || {}, data.workPreferences || {})
      setCurrentStep("results")
    } else {
      setPhoneExists(false)
      setStudentData((prev) => ({ ...prev, phone: phoneNumber }))
      setCurrentStep("basic-info")
    }
  }

  const calculateFitmentScores = (careers: string[], personality: Record<number, number>, workPrefs: any) => {
    const matches: CareerMatch[] = []

    // Define career scoring logic based on selections and personality
    const careerScoring = {
      frontend: {
        base: careers.includes("frontend") ? 85 : 60,
        personality: [0, 1, 2], // creativity, organization, social
        skills: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
        openings: 2847,
        icon: Code,
        color: "bg-blue-500",
      },
      backend: {
        base: careers.includes("backend") ? 88 : 65,
        personality: [1, 6, 9], // organization, responsibility, calm
        skills: ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB"],
        openings: 1923,
        icon: Database,
        color: "bg-green-500",
      },
      fullstack: {
        base: careers.includes("fullstack") ? 82 : 70,
        personality: [0, 1, 5], // creativity, organization, curiosity
        skills: ["React", "Node.js", "MongoDB", "REST APIs", "Git"],
        openings: 3156,
        icon: Globe,
        color: "bg-purple-500",
      },
      mobile: {
        base: careers.includes("mobile") ? 79 : 62,
        personality: [0, 2, 5], // creativity, social, curiosity
        skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
        openings: 1456,
        icon: Smartphone,
        color: "bg-orange-500",
      },
      devops: {
        base: careers.includes("devops") ? 86 : 58,
        personality: [1, 6, 9], // organization, responsibility, calm
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
        openings: 1789,
        icon: Settings,
        color: "bg-red-500",
      },
      data: {
        base: careers.includes("data") ? 84 : 63,
        personality: [1, 5, 9], // organization, curiosity, calm
        skills: ["Python", "SQL", "Apache Spark", "ETL", "Data Modeling"],
        openings: 2234,
        icon: BarChart3,
        color: "bg-indigo-500",
      },
      ml: {
        base: careers.includes("ml") ? 87 : 55,
        personality: [0, 5, 9], // creativity, curiosity, calm
        skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "Statistics"],
        openings: 1567,
        icon: Cpu,
        color: "bg-pink-500",
      },
      cybersecurity: {
        base: careers.includes("cybersecurity") ? 81 : 59,
        personality: [1, 4, 6], // organization, worry, responsibility
        skills: ["Network Security", "Penetration Testing", "SIEM", "Compliance"],
        openings: 1345,
        icon: Shield,
        color: "bg-gray-500",
      },
      cloud: {
        base: careers.includes("cloud") ? 83 : 61,
        personality: [1, 5, 6], // organization, curiosity, responsibility
        skills: ["AWS", "Azure", "GCP", "Terraform", "Serverless"],
        openings: 1998,
        icon: Zap,
        color: "bg-yellow-500",
      },
    }

    // Calculate scores for each career
    Object.entries(careerScoring).forEach(([careerKey, config]) => {
      let score = config.base

      // Adjust based on personality answers
      config.personality.forEach((questionIndex) => {
        const answer = personality[questionIndex] || 3
        score += (answer - 3) * 2 // -4 to +4 adjustment
      })

      // Adjust based on work preferences
      if (workPrefs.independence) {
        if (careerKey === "backend" || careerKey === "data") {
          score += (workPrefs.independence[0] - 50) * 0.1
        }
      }

      // Ensure score is within bounds
      score = Math.max(45, Math.min(95, score))

      const career = engineeringCareers.find((c) => c.id === careerKey)
      if (career) {
        matches.push({
          id: careerKey,
          title: career.label,
          fitmentScore: Math.round(score),
          description: `Perfect match for your technical interests and personality profile`,
          skills: config.skills,
          openings: config.openings,
          icon: config.icon,
          color: config.color,
        })
      }
    })

    // Sort by fitment score and take top 3
    const topMatches = matches.sort((a, b) => b.fitmentScore - a.fitmentScore).slice(0, 3)
    setCareerMatches(topMatches)
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
    setCurrentStep("career-interests")
  }

  const handleCareerInterestsNext = () => {
    if (selectedCareers.length === 0) {
      toast({
        title: "Select Career Interests",
        description: "Please select at least one career area that interests you.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep("personality")
  }

  const handlePersonalityNext = () => {
    if (Object.keys(personalityAnswers).length !== 10) {
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
      calculateFitmentScores(selectedCareers, personalityAnswers, workPreferences)

      // Save assessment data
      const assessmentData = {
        studentData,
        selectedValues,
        selectedCareers,
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
    const steps = [
      "phone-check",
      "basic-info",
      "core-values",
      "career-interests",
      "personality",
      "work-preferences",
      "results",
    ]
    const currentIndex = steps.indexOf(currentStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  // Phone Check Step
  if (currentStep === "phone-check") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-md py-16">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Student Assessment</CardTitle>
              <CardDescription>Enter your phone number to start or continue your assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="text-center text-lg"
                />
              </div>

              <Button onClick={checkPhoneNumber} className="w-full bg-primary hover:bg-primary/90" size="lg">
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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

  // Core Values Step
  if (currentStep === "core-values") {
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
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Core Values</CardTitle>
                  <CardDescription>Select 5 values that matter most to you ({selectedValues.length}/5)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    />
                    <Label
                      htmlFor={value}
                      className={`text-sm cursor-pointer ${
                        !selectedValues.includes(value) && selectedValues.length >= 5 ? "text-muted-foreground" : ""
                      }`}
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  onClick={handleCoreValuesNext}
                  className="bg-primary hover:bg-primary/90"
                  disabled={selectedValues.length !== 5}
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

  // Career Interests Step
  if (currentStep === "career-interests") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentStep("core-values")}
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
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Engineering Career Interests</CardTitle>
                  <CardDescription>Select the engineering fields that interest you most</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {engineeringCareers.map((career) => (
                  <div key={career.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <Checkbox
                      id={career.id}
                      checked={selectedCareers.includes(career.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCareers((prev) => [...prev, career.id])
                        } else {
                          setSelectedCareers((prev) => prev.filter((c) => c !== career.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label htmlFor={career.id} className="text-sm font-medium cursor-pointer">
                        {career.label}
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {career.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  onClick={handleCareerInterestsNext}
                  className="bg-primary hover:bg-primary/90"
                  disabled={selectedCareers.length === 0}
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
              onClick={() => setCurrentStep("career-interests")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">Step 4 of 4</div>
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
                  onClick={handlePersonalityNext}
                  className="bg-primary hover:bg-primary/90"
                  disabled={Object.keys(personalityAnswers).length !== 10}
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
              onClick={() => setCurrentStep("personality")}
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
                    <Label className="text-sm font-medium">Do you prefer working independently or with others?</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.independence[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Independently</span>
                    <Slider
                      value={workPreferences.independence}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, independence: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">With Others</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Do you thrive on routines or flexibility?</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.routine[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Routines</span>
                    <Slider
                      value={workPreferences.routine}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, routine: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Flexibility</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">What work pace energizes you most?</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.pace[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Steady Pace</span>
                    <Slider
                      value={workPreferences.pace}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, pace: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Fast Pace</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Do you like switching tasks or going deep into one?</Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.focus[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Switching Tasks</span>
                    <Slider
                      value={workPreferences.focus}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, focus: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Deep Focus</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">
                      Do you like building things or thinking about big ideas?
                    </Label>
                    <span className="text-sm text-muted-foreground">{workPreferences.building[0]}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Building Things</span>
                    <Slider
                      value={workPreferences.building}
                      onValueChange={(value) => setWorkPreferences((prev) => ({ ...prev, building: value }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">Big Ideas</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  onClick={handleWorkPreferencesSubmit}
                  disabled={isSubmitting}
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
            {careerMatches.map((match, index) => {
              const IconComponent = match.icon
              return (
                <Card key={match.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 ${match.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
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
                              {match.fitmentScore}% match
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardDescription className="text-sm text-muted-foreground mb-4">
                      {match.description}
                    </CardDescription>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">KEY SKILLS</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
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
            {careerMatches.map((match) => {
              const IconComponent = match.icon
              const isInterested = interestedRoles.includes(match.id)

              return (
                <Card key={match.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${match.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
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
                              <span>{match.fitmentScore}% match</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{match.description}</p>
                          <div className="space-y-2">
                            <h4 className="text-xs font-medium text-muted-foreground">REQUIRED SKILLS</h4>
                            <div className="flex flex-wrap gap-2">
                              {match.skills.map((skill) => (
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
                      {isInterested ? (
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Heart className="w-6 h-6 text-green-600 fill-current" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-green-600">Interest Registered!</p>
                            <p className="text-xs text-muted-foreground">Companies will contact you soon</p>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleInterested(match.id)}
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-6 py-2"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          I'm Interested
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Career Journey?</h2>
                <p className="text-muted-foreground mb-6">
                  Your interests have been saved. Companies matching your profile will be notified and may reach out to
                  you directly.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {careerMatches.reduce((sum, match) => sum + match.openings, 0).toLocaleString()}+
                    </div>
                    <p className="text-muted-foreground">Total Opportunities</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">{careerMatches.length}</div>
                    <p className="text-muted-foreground">Career Matches</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {Math.round(
                        careerMatches.reduce((sum, match) => sum + match.fitmentScore, 0) / careerMatches.length,
                      )}
                      %
                    </div>
                    <p className="text-muted-foreground">Average Fit Score</p>
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
