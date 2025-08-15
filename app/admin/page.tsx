"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Users, Briefcase, TrendingUp, Search, GraduationCap, QrCode, Loader2, RefreshCw, Trash2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  degree: string
  specialization: string
  assessmentCompleted: boolean
  careerMatches: string[]
  fitmentScores: Record<string, number>
  appliedJobs: number
  registrationDate: string
}

interface Company {
  id: string
  name: string
  email: string
  contactPerson: string
  contactNumber?: string
  jobsPosted: number
  activeJobs: number
  registrationDate: string
  verified: boolean
}

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
  qr_code_url: string
  student_url: string
  active: boolean
  created_at: string
}

interface Assessment {
  id: string
  name: string
  email: string
  phone: string
  degree: string
  specialization: string
  core_values: Record<string, number>[]
  work_preferences: Record<string, number>[]
  personality_answers: Record<number, number>
  job_id: string
  job_title: string
  company: string
  created_at: string
}

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("job-management")
  const [qrLoading, setQrLoading] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAdminData()
    // Set up periodic refresh to get latest data
    const interval = setInterval(loadAdminData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)

      // Load jobs from API
      const jobsResponse = await fetch("/api/jobs")
      const jobsResult = await jobsResponse.json()
      const loadedJobs = jobsResult.success ? jobsResult.jobs || [] : []

      // Process jobs to ensure proper URLs
      const processedJobs = loadedJobs.map((job: Job) => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://kaizen-job-portal.vercel.app"
        const studentUrl = `${baseUrl}/student?jobId=${encodeURIComponent(job.id)}`
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(studentUrl)}&format=png&bgcolor=FFFFFF&color=000000&qzone=2&margin=10&ecc=M`

        return {
          ...job,
          student_url: studentUrl,
          qr_code_url: qrCodeUrl,
        }
      })

      setJobs(processedJobs)

      // Extract unique companies from jobs
      const uniqueCompanies = new Map<string, Company>()
      processedJobs.forEach((job: Job) => {
        if (!uniqueCompanies.has(job.company_email)) {
          uniqueCompanies.set(job.company_email, {
            id: job.company_email,
            name: job.company_name || job.company_email,
            email: job.company_email,
            contactPerson: "N/A",
            jobsPosted: 0,
            activeJobs: 0,
            registrationDate: job.created_at,
            verified: true,
          })
        }
      })

      // Count jobs for each company
      uniqueCompanies.forEach((company, email) => {
        const companyJobs = processedJobs.filter((job: Job) => job.company_email === email)
        company.jobsPosted = companyJobs.length
        company.activeJobs = companyJobs.filter((job: Job) => job.active).length
      })

      setCompanies(Array.from(uniqueCompanies.values()))

      // Load assessments from API
      const assessmentsResponse = await fetch("/api/assessments")
      const assessmentsResult = await assessmentsResponse.json()
      const loadedAssessments = assessmentsResult.success ? assessmentsResult.assessments || [] : []
      setAssessments(loadedAssessments)

      // Transform assessments into Student format for display
      const transformedStudents = loadedAssessments.map((assessment: Assessment) => ({
        id: assessment.id,
        name: assessment.name,
        email: assessment.email,
        phone: assessment.phone,
        degree: assessment.degree,
        specialization: assessment.specialization,
        assessmentCompleted: true, // Assume completion since data exists
        careerMatches: assessment.job_title ? [assessment.job_title] : [], // Derive from job title
        fitmentScores: {}, // To be calculated if needed (e.g., from personality_answers)
        appliedJobs: 1, // Assume 1 application per assessment for now
        registrationDate: assessment.created_at,
      }))
      setStudents(transformedStudents)
    } catch (error) {
      console.error("Error loading admin data:", error)
      toast({
        title: "Error Loading Data",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = async (qrUrl: string, jobTitle: string, jobId: string) => {
    try {
      setQrLoading(jobId)

      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `${jobTitle.replace(/\s+/g, "_")}_QR_Code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)

      toast({
        title: "QR Code Downloaded",
        description: `QR code for "${jobTitle}" has been downloaded successfully.`,
      })
    } catch (error) {
      console.error("Error downloading QR code:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setQrLoading(null)
    }
  }

  const deleteJob = async (jobId: string, jobTitle: string) => {
    try {
      // In a real app, you would make an API call to delete the job
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))

      toast({
        title: "Job Deleted",
        description: `"${jobTitle}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalJobs = jobs.length
  const totalStudents = students.length
  const internships = jobs.filter((job) => job.job_type.toLowerCase().includes("intern")).length
  const fullTimeJobs = jobs.filter((job) => job.job_type.toLowerCase().includes("full")).length

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-7xl py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto max-w-7xl py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage jobs, students, and platform analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={loadAdminData} disabled={loading} variant="outline" size="sm" className="w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">Total Jobs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{totalJobs}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">Internships</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{internships}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">Full-Time Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{fullTimeJobs}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="job-management" className="text-sm sm:text-base">Job Management</TabsTrigger>
            <TabsTrigger value="student-search" className="text-sm sm:text-base">Student Search</TabsTrigger>
            <TabsTrigger value="application-management" className="text-sm sm:text-base">Application Management</TabsTrigger>
          </TabsList>

          <TabsContent value="job-management" className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Job Postings</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">Manage all job postings on the platform</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 pl-10 text-sm sm:text-base"
                  />
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">No Jobs Found</h3>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {searchTerm ? "No jobs match your search criteria." : "No jobs have been posted yet."}
                      </p>
                    </div>
                  ) : (
                    filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border rounded-lg bg-background"
                      >
                        <div className="flex-1 mb-4 sm:mb-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg sm:text-xl">{job.title}</h3>
                            <Badge
                              variant={job.job_type.toLowerCase().includes("full") ? "default" : "secondary"}
                              className={
                                job.job_type.toLowerCase().includes("full")
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {job.job_type}
                            </Badge>
                          </div>
                          <div className="text-sm sm:text-base text-muted-foreground mb-1">{job.company_name || "Company"}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Job ID: {job.id} • Posted: {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQR(job.qr_code_url, job.title, job.id)}
                            disabled={qrLoading === job.id}
                            className="w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4"
                          >
                            {qrLoading === job.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <QrCode className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteJob(job.id, job.title)}
                            className="w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="student-search" className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Student Search</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">Search and manage student profiles</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 pl-10 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-4">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">No Students Found</h3>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {searchTerm ? "No students match your search criteria." : "No students have been registered yet."}
                      </p>
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border rounded-lg bg-background"
                      >
                        <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg sm:text-xl">{student.name}</h3>
                            <div className="text-sm sm:text-base text-muted-foreground mb-1">
                              {student.email} • {student.phone}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-sm sm:text-base">
                                {student.degree} - {student.specialization}
                              </Badge>
                              <Badge
                                className={
                                  student.assessmentCompleted
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {student.assessmentCompleted ? "Assessment Complete" : "Assessment Pending"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm sm:text-base text-muted-foreground mb-1">Applications</div>
                          <div className="text-2xl sm:text-3xl font-bold text-primary">{student.appliedJobs}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="application-management" className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Application Management</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">Review and manage student applications</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 pl-10 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-4">
                  {filteredAssessments.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">No Applications Found</h3>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {searchTerm ? "No applications match your search criteria." : "No applications have been submitted yet."}
                      </p>
                    </div>
                  ) : (
                    filteredAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border rounded-lg bg-background"
                      >
                        <div className="flex-1 mb-4 sm:mb-0">
                          <h3 className="font-semibold text-lg sm:text-xl">{assessment.name}</h3>
                          <div className="text-sm sm:text-base text-muted-foreground mb-1">
                            {assessment.email} • Applied for: {assessment.job_title}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Company: {assessment.company} • Date: {new Date(assessment.created_at).toLocaleDateString()}
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge> {/* Placeholder status */}
                        </div>
                        <div className="text-right">
                          <div className="text-sm sm:text-base text-muted-foreground mb-1">Fitment Score</div>
                          <div className="text-2xl sm:text-3xl font-bold text-primary">N/A</div> {/* To be calculated */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
