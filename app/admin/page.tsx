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

interface Application {
  id: string
  studentName: string
  studentEmail: string
  jobTitle: string
  company: string
  fitmentScore: number
  status: "pending" | "reviewed" | "accepted" | "rejected"
  appliedDate: string
}

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("job-management")
  const [qrLoading, setQrLoading] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAdminData()
    // Set up periodic refresh to get latest jobs
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
        const studentUrl = `${baseUrl}/job/${job.id}`
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

      // Load mock students data
      const mockStudents: Student[] = [
        {
          id: "1",
          name: "Rahul Sharma",
          email: "rahul.sharma@email.com",
          phone: "+91 9876543210",
          degree: "B.Tech",
          specialization: "Computer Science",
          assessmentCompleted: true,
          careerMatches: ["Frontend Developer", "Full Stack Developer"],
          fitmentScores: { frontend: 85, fullstack: 78 },
          appliedJobs: 3,
          registrationDate: "2024-01-15",
        },
        {
          id: "2",
          name: "Priya Patel",
          email: "priya.patel@email.com",
          phone: "+91 9876543211",
          degree: "B.E.",
          specialization: "Information Technology",
          assessmentCompleted: true,
          careerMatches: ["Backend Developer", "DevOps Engineer"],
          fitmentScores: { backend: 82, devops: 75 },
          appliedJobs: 2,
          registrationDate: "2024-01-16",
        },
        {
          id: "3",
          name: "Amit Kumar",
          email: "amit.kumar@email.com",
          phone: "+91 9876543212",
          degree: "M.Tech",
          specialization: "Data Science",
          assessmentCompleted: false,
          careerMatches: [],
          fitmentScores: {},
          appliedJobs: 0,
          registrationDate: "2024-01-17",
        },
      ]

      const mockApplications: Application[] = [
        {
          id: "1",
          studentName: "Rahul Sharma",
          studentEmail: "rahul.sharma@email.com",
          jobTitle: "Frontend Developer",
          company: "TechCorp Solutions",
          fitmentScore: 85,
          status: "pending",
          appliedDate: "2024-01-18",
        },
        {
          id: "2",
          studentName: "Priya Patel",
          studentEmail: "priya.patel@email.com",
          jobTitle: "Backend Developer",
          company: "InnovateLabs",
          fitmentScore: 82,
          status: "reviewed",
          appliedDate: "2024-01-17",
        },
      ]

      setStudents(mockStudents)
      setApplications(mockApplications)
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      })
    })
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

  const totalJobs = jobs.length
  const totalStudents = students.length
  const internships = jobs.filter((job) => job.job_type.toLowerCase().includes("intern")).length
  const fullTimeJobs = jobs.filter((job) => job.job_type.toLowerCase().includes("full")).length

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto max-w-7xl py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
    <div className="min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto max-w-7xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage jobs, students, and platform analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={loadAdminData} disabled={loading} variant="outline" size="sm">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalJobs}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Internships</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{internships}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Full-Time Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{fullTimeJobs}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="job-management">Job Management</TabsTrigger>
            <TabsTrigger value="student-search">Student Search</TabsTrigger>
          </TabsList>

          <TabsContent value="job-management" className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Job Postings</CardTitle>
                <p className="text-muted-foreground">Manage all job postings on the platform</p>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm ? "No jobs match your search criteria." : "No jobs have been posted yet."}
                      </p>
                    </div>
                  ) : (
                    filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-background"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{job.title}</h3>
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
                          <div className="text-sm text-muted-foreground mb-1">{job.company_name || "Company"}</div>
                          <div className="text-xs text-muted-foreground">
                            Job ID: {job.id} • Posted: {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQR(job.qr_code_url, job.title, job.id)}
                            disabled={qrLoading === job.id}
                            className="text-xs px-3"
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
                            className="text-xs px-3 text-red-600 hover:bg-red-50"
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

          <TabsContent value="student-search" className="space-y-4">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Student Search</CardTitle>
                <p className="text-muted-foreground">Search and manage student profiles</p>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-background"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <div className="text-sm text-muted-foreground mb-1">
                            {student.email} • {student.phone}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">
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
                        <div className="text-sm text-muted-foreground mb-1">Applications</div>
                        <div className="text-2xl font-bold text-primary">{student.appliedJobs}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
