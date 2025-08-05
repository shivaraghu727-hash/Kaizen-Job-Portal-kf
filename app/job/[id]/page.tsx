"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Building2, MapPin, Clock, DollarSign, Users, Star, ArrowLeft, Phone, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"

interface Job {
  id: string
  title: string
  job_type: string
  location: string
  description: string
  key_skills: string
  salary: string
  company_name: string
  company_email: string
  active: boolean
  created_at: string
}

interface PhoneRegistration {
  phone: string
  jobId: string
  timestamp: string
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneLoading, setPhoneLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadJobDetails(params.id as string)
    }
  }, [params.id])

  const loadJobDetails = async (jobId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/jobs?jobId=${jobId}`, { cache: "no-store" }) // ✅ CORRECT

      const result = await response.json()

      if (result.success && result.job) {
        setJob(result.job)
      } else {
        toast({
          title: "Job Not Found",
          description: "The job you're looking for doesn't exist or has been removed.",
          variant: "destructive",
        })
        router.push("/")
      }
    } catch (error) {
      console.error("Error loading job details:", error)
      toast({
        title: "Error Loading Job",
        description: "Failed to load job details. Please try again.",
        variant: "destructive",
      })
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handleInterestClick = () => {
    setShowPhoneDialog(true)
    setPhoneNumber("")
  }

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to continue.",
        variant: "destructive",
      })
      return
    }

    if (!job) return

    try {
      setPhoneLoading(true)

      // Check if phone number is already registered for this job
      const existingRegistrations = JSON.parse(
        localStorage.getItem("phoneRegistrations") || "[]",
      ) as PhoneRegistration[]
      const isAlreadyRegistered = existingRegistrations.some((reg) => reg.phone === phoneNumber && reg.jobId === job.id)

      if (isAlreadyRegistered) {
        toast({
          title: "Already Registered",
          description: "You have already clicked I am interested button for this opportunity!",
        })
        setShowPhoneDialog(false)
        return
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save registration
      const newRegistration: PhoneRegistration = {
        phone: phoneNumber,
        jobId: job.id,
        timestamp: new Date().toISOString(),
      }
      existingRegistrations.push(newRegistration)
      localStorage.setItem("phoneRegistrations", JSON.stringify(existingRegistrations))

      // Redirect to student assessment
      router.push(`/student?jobId=${job.id}&phone=${encodeURIComponent(phoneNumber)}`)
    } catch (error) {
      console.error("Error processing phone registration:", error)
      toast({
        title: "Error",
        description: "Failed to process registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPhoneLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground />
        <FloatingElements />

        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="relative z-10 container mx-auto max-w-4xl p-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground />
        <FloatingElements />

        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="relative z-10 container mx-auto max-w-4xl p-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h2>
            <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl p-4 py-8">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-lg">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-foreground mb-2">{job.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{job.company_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                    {job.job_type}
                  </Badge>
                  {job.salary && (
                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {job.salary}
                    </Badge>
                  )}
                  <Badge
                    variant={job.active ? "default" : "secondary"}
                    className={job.active ? "bg-green-100 text-green-800" : ""}
                  >
                    {job.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Job Description */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Job Description
              </h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="whitespace-pre-wrap leading-relaxed">{job.description}</p>
              </div>
            </div>

            {/* Key Skills */}
            {job.key_skills && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.key_skills.split(",").map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Company Information */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">About the Company</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{job.company_name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-6 border-t border-border">
              <Button
                onClick={handleInterestClick}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3"
              >
                <Star className="w-5 h-5 mr-2" />
                I'm Interested in this Opportunity
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Click to start your personalized assessment and get matched with this role
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phone Number Dialog */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Enter Your Phone Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              We need your phone number to check your profile and calculate job fitment
            </p>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={handlePhoneSubmit}
              disabled={phoneLoading || !phoneNumber.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {phoneLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Phone className="w-4 h-4 mr-2" />}
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
