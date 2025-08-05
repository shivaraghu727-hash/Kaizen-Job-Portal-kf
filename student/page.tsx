"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, User, GraduationCap, Heart, Briefcase, Brain, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface JobInfo {
  id: string
  title: string
  company: string
  description: string
}

export default function StudentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    degree: "",
    specialization: "",
    coreValues: [] as string[],
    workPreferences: {} as Record<string, number>,
    personalityAnswers: {} as Record<string, number>,
  })

  const totalSteps = 5

  // Check for job ID in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const jobId = urlParams.get("jobId")

    if (jobId) {
      // Check if user already applied for this job
      const userEmail = localStorage.getItem("userEmail")
      if (userEmail) {
        const existingApplication = localStorage.getItem(`application_${jobId}_${userEmail}`)
        if (existingApplication) {
          alert("You have already applied for this position!")
          router.push("/opportunities")
          return
        }
      }

      // Fetch job details from API
      fetchJobDetails(jobId)
    }
  }, [router])

  const fetchJobDetails = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs?jobId=${jobId}`)
      const result = await response.json()

      if (result.success) {
        setJobInfo({
          id: jobId,
          title: result.job.title,
          company: result.job.company_email,
          description: result.job.description,
        })
      } else {
        // Fallback to mock data if job not found
        setJobInfo({
          id: jobId,
          title: "Software Developer Intern",
          company: "Tech Corp Inc",
          description: "Join our team as a software developer intern and work on exciting projects!",
        })
      }
    } catch (error) {
      console.error("Error fetching job details:", error)
      // Fallback to mock data
      setJobInfo({
        id: jobId,
        title: "Software Developer Intern",
        company: "Tech Corp Inc",
        description: "Join our team as a software developer intern and work on exciting projects!",
      })
    }
  }

  const coreValuesOptions = [
    "Innovation and Creativity",
    "Work-Life Balance",
    "Financial Security",
    "Career Growth",
    "Team Collaboration",
    "Independence",
    "Social Impact",
    "Learning and Development",
    "Recognition and Achievement",
    "Stability and Security",
  ]

  const workPreferenceQuestions = [
    { id: "remote_work", question: "How much do you prefer remote work?", scale: "Not at all - Completely" },
    { id: "team_size", question: "Do you prefer working in large or small teams?", scale: "Small teams - Large teams" },
    {
      id: "structure",
      question: "How much structure do you prefer in your work?",
      scale: "Very flexible - Highly structured",
    },
    { id: "pace", question: "What work pace do you prefer?", scale: "Steady pace - Fast-paced" },
    {
      id: "leadership",
      question: "How interested are you in leadership roles?",
      scale: "Not interested - Very interested",
    },
  ]

  const personalityQuestions = [
    { id: "openness_1", question: "I enjoy trying new and different things", trait: "openness" },
    { id: "openness_2", question: "I am creative and imaginative", trait: "openness" },
    { id: "conscientiousness_1", question: "I am organized and methodical", trait: "conscientiousness" },
    { id: "conscientiousness_2", question: "I follow through on my commitments", trait: "conscientiousness" },
    { id: "extraversion_1", question: "I enjoy being around people", trait: "extraversion" },
    { id: "extraversion_2", question: "I am comfortable being the center of attention", trait: "extraversion" },
    { id: "agreeableness_1", question: "I try to be helpful and cooperative", trait: "agreeableness" },
    { id: "agreeableness_2", question: "I trust others easily", trait: "agreeableness" },
    { id: "neuroticism_1", question: "I remain calm under pressure", trait: "neuroticism" },
    { id: "neuroticism_2", question: "I worry about things that might go wrong", trait: "neuroticism" },
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCoreValueChange = (value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      coreValues: checked ? [...prev.coreValues, value] : prev.coreValues.filter((v) => v !== value),
    }))
  }

  const handleWorkPreferenceChange = (id: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      workPreferences: {
        ...prev.workPreferences,
        [id]: value,
      },
    }))
  }

  const handlePersonalityChange = (id: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      personalityAnswers: {
        ...prev.personalityAnswers,
        [id]: value,
      },
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      console.log("=== Assessment Submission ===")
      console.log("Form data:", formData)
      console.log("Job info:", jobInfo)

      // Store user data in localStorage for future use
      localStorage.setItem("userName", formData.name)
      localStorage.setItem("userEmail", formData.email)
      localStorage.setItem("userPhoneNumber", formData.phone)

      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          jobId: jobInfo?.id,
          jobTitle: jobInfo?.title,
          company: jobInfo?.company,
        }),
      })

      const result = await response.json()
      console.log("Assessment result:", result)

      if (result.success) {
        // If applying for a specific job, create application
        if (jobInfo) {
          await fetch("/api/applications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "create",
              jobId: jobInfo.id,
              studentName: formData.name,
              studentEmail: formData.email,
              jobTitle: jobInfo.title,
              company: jobInfo.company,
              phoneNumber: formData.phone,
              fitmentScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100
            }),
          })

          // Store application locally
          localStorage.setItem(
            `application_${jobInfo.id}_${formData.email}`,
            JSON.stringify({
              jobId: jobInfo.id,
              jobTitle: jobInfo.title,
              company: jobInfo.company,
              userEmail: formData.email,
              userName: formData.name,
              phoneNumber: formData.phone,
              appliedAt: new Date().toISOString(),
            }),
          )
        }

        // Redirect to results page
        router.push(result.redirectUrl)
      } else {
        alert(result.message || "Failed to submit assessment")
      }
    } catch (error) {
      console.error("Assessment submission error:", error)
      alert("Failed to submit assessment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone
      case 2:
        return formData.degree
      case 3:
        return formData.coreValues.length >= 3
      case 4:
        return Object.keys(formData.workPreferences).length === workPreferenceQuestions.length
      case 5:
        return Object.keys(formData.personalityAnswers).length === personalityQuestions.length
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA] p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <Link
          href="/"
          className="inline-flex items-center text-[#794BE1] hover:text-[#794BE1]/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Job Info Banner */}
        {jobInfo && (
          <Card className="mb-8 bg-gradient-to-r from-[#794BE1]/10 to-[#794BE1]/5 border-[#794BE1]/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] rounded-full flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Applying for: {jobInfo.title}</h3>
                  <p className="text-gray-600">Company: {jobInfo.company}</p>
                  <p className="text-sm text-gray-500 mt-1">Complete this assessment to apply for this position</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="font-medium">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#F2F2F2] to-[#E9ECEF] rounded-full flex items-center justify-center">
                {currentStep === 1 && <User className="w-6 h-6 text-[#794BE1]" />}
                {currentStep === 2 && <GraduationCap className="w-6 h-6 text-[#794BE1]" />}
                {currentStep === 3 && <Heart className="w-6 h-6 text-[#794BE1]" />}
                {currentStep === 4 && <Briefcase className="w-6 h-6 text-[#794BE1]" />}
                {currentStep === 5 && <Brain className="w-6 h-6 text-[#794BE1]" />}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Educational Background"}
                  {currentStep === 3 && "Core Values"}
                  {currentStep === 4 && "Work Preferences"}
                  {currentStep === 5 && "Personality Assessment"}
                </CardTitle>
                <CardDescription className="text-base">
                  {currentStep === 1 && "Tell us about yourself"}
                  {currentStep === 2 && "Your educational journey"}
                  {currentStep === 3 && "What matters most to you in work"}
                  {currentStep === 4 && "Your ideal work environment"}
                  {currentStep === 5 && "Understanding your personality traits"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1] h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1] h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1] h-12"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Educational Background */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-base font-medium">
                    Degree/Course *
                  </Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
                    placeholder="e.g. Bachelor of Computer Science"
                    className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1] h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-base font-medium">
                    Specialization (Optional)
                  </Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData((prev) => ({ ...prev, specialization: e.target.value }))}
                    placeholder="e.g. Software Engineering, Data Science"
                    className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1] h-12"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Core Values */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-gray-600 text-base">
                  Select at least 3 values that are most important to you in your career:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coreValuesOptions.map((value) => (
                    <div key={value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={value}
                        checked={formData.coreValues.includes(value)}
                        onCheckedChange={(checked) => handleCoreValueChange(value, checked as boolean)}
                        className="border-[#794BE1] data-[state=checked]:bg-[#794BE1]"
                      />
                      <Label htmlFor={value} className="text-base cursor-pointer">
                        {value}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className={`px-4 py-2 text-base ${
                      formData.coreValues.length >= 3 ? "bg-green-100 text-green-800" : "bg-[#F2F2F2] text-[#794BE1]"
                    }`}
                  >
                    Selected: {formData.coreValues.length}/10
                  </Badge>
                </div>
              </div>
            )}

            {/* Step 4: Work Preferences */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <p className="text-gray-600 text-base">Rate your preferences on a scale of 1-5:</p>
                {workPreferenceQuestions.map((question) => (
                  <div key={question.id} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <Label className="text-base font-medium">{question.question}</Label>
                    <div className="space-y-3">
                      <RadioGroup
                        value={formData.workPreferences[question.id]?.toString() || ""}
                        onValueChange={(value) => handleWorkPreferenceChange(question.id, Number.parseInt(value))}
                        className="flex justify-center space-x-6"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div key={num} className="flex flex-col items-center space-y-2">
                            <RadioGroupItem
                              value={num.toString()}
                              id={`${question.id}_${num}`}
                              className="border-[#794BE1] text-[#794BE1]"
                            />
                            <Label htmlFor={`${question.id}_${num}`} className="text-sm font-medium">
                              {num}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <div className="flex justify-between text-sm text-gray-500 px-4">
                        <span>{question.scale.split(" - ")[0]}</span>
                        <span>{question.scale.split(" - ")[1]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Personality Assessment */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <p className="text-gray-600 text-base">
                  Rate how much you agree with each statement (1 = Strongly Disagree, 5 = Strongly Agree):
                </p>
                {personalityQuestions.map((question, index) => (
                  <div key={question.id} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Badge variant="secondary" className="mt-1 bg-[#794BE1] text-white px-2 py-1 text-sm">
                        {index + 1}
                      </Badge>
                      <Label className="text-base font-medium flex-1">{question.question}</Label>
                    </div>
                    <RadioGroup
                      value={formData.personalityAnswers[question.id]?.toString() || ""}
                      onValueChange={(value) => handlePersonalityChange(question.id, Number.parseInt(value))}
                      className="flex justify-center space-x-6 mt-3"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="flex flex-col items-center space-y-2">
                          <RadioGroupItem
                            value={num.toString()}
                            id={`${question.id}_${num}`}
                            className="border-[#794BE1] text-[#794BE1]"
                          />
                          <Label htmlFor={`${question.id}_${num}`} className="text-sm font-medium">
                            {num}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-2 border-gray-300 bg-transparent hover:bg-gray-50 px-6 py-3 text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] hover:from-[#6B3BC7] hover:to-[#8B4CE8] px-6 py-3 text-base font-semibold shadow-lg"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] hover:from-[#6B3BC7] hover:to-[#8B4CE8] px-8 py-3 text-base font-semibold shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Assessment
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
