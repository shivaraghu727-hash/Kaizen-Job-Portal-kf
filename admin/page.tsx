"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  Eye,
  Download,
  QrCode,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

interface Company {
  id: string
  name: string
  email: string
  contact_person: string
  verified: boolean
  created_at: string
}

interface Job {
  id: string
  title: string
  company_email: string
  job_type: string
  location: string
  qr_code_url: string
  student_url: string
  active: boolean
  applications_count: number
  created_at: string
}

interface Application {
  id: string
  student_name: string
  student_email: string
  job_title: string
  company: string
  fitment_score: number
  status: string
  applied_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [users, setUsers] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated])

  const loadAllData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([loadUsers(), loadCompanies(), loadJobs(), loadApplications()])
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/auth?type=users")
      const result = await response.json()
      if (result.success) {
        setUsers(result.users || [])
      }
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const loadCompanies = async () => {
    try {
      const response = await fetch("/api/auth?type=companies")
      const result = await response.json()
      if (result.success) {
        setCompanies(result.companies || [])
      }
    } catch (error) {
      console.error("Error loading companies:", error)
    }
  }

  const loadJobs = async () => {
    try {
      const response = await fetch("/api/jobs?type=all")
      const result = await response.json()
      if (result.success) {
        setJobs(result.jobs || [])
      }
    } catch (error) {
      console.error("Error loading jobs:", error)
    }
  }

  const loadApplications = async () => {
    try {
      const response = await fetch("/api/applications")
      const result = await response.json()
      if (result.success) {
        setApplications(result.applications || [])
      }
    } catch (error) {
      console.error("Error loading applications:", error)
    }
  }

  useEffect(() => {
    // Update stats when data changes
    setStats({
      totalUsers: users.length,
      totalCompanies: companies.length,
      totalJobs: jobs.filter((j) => j.active).length,
      totalApplications: applications.length,
    })
  }, [users, companies, jobs, applications])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "admin-login",
          username: loginData.username,
          password: loginData.password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsAuthenticated(true)
      } else {
        alert(result.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const downloadQR = (qrUrl: string, jobTitle: string) => {
    const link = document.createElement("a")
    link.href = qrUrl
    link.download = `${jobTitle.replace(/\s+/g, "_")}_QR.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "reviewed":
        return <Eye className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update-status",
          applicationId,
          status: newStatus,
        }),
      })

      const result = await response.json()
      if (result.success) {
        // Reload applications
        await loadApplications()
      }
    } catch (error) {
      console.error("Error updating application status:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA] p-4">
        <div className="container mx-auto max-w-md py-8">
          <Link href="/" className="inline-flex items-center text-[#794BE1] hover:text-[#794BE1]/80 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl">Admin Login</CardTitle>
              <CardDescription className="text-center">Access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={loginData.username}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                    required
                    className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1] h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    required
                    className="border-gray-300 focus:border-[#794BE1] focus:ring-[#794BE1] h-12"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] hover:from-[#6B3BC7] hover:to-[#8B4CE8] h-12 text-base font-semibold"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Username: admin
                  <br />
                  Password: admin123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FA] p-4">
      <div className="container mx-auto max-w-7xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, companies, jobs, and applications</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={loadAllData}
              disabled={isLoading}
              variant="outline"
              className="border-2 border-[#794BE1] text-[#794BE1] bg-transparent hover:bg-[#794BE1] hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              className="border-2 border-[#794BE1] text-[#794BE1] hover:bg-[#794BE1] hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] rounded-full flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#794BE1] to-[#9D5CE8] rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="applications" className="text-base">
              Applications
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-base">
              Jobs & QR Codes
            </TabsTrigger>
            <TabsTrigger value="companies" className="text-base">
              Companies
            </TabsTrigger>
            <TabsTrigger value="users" className="text-base">
              Users
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab - Now First */}
          <TabsContent value="applications">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Student Applications</CardTitle>
                <CardDescription className="text-base">
                  Real-time applications from students who clicked "I'm Interested" on job QR codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No applications yet</p>
                    <p className="text-base">Applications will appear here when students complete assessments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#F2F2F2] to-[#E9ECEF] rounded-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-[#794BE1]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{application.student_name}</h4>
                              <p className="text-gray-600">{application.student_email}</p>
                              <p className="text-gray-600">
                                Applied for: <strong>{application.job_title}</strong> at {application.company}
                              </p>
                              <p className="text-sm text-gray-500">
                                Applied: {new Date(application.applied_at).toLocaleDateString()} at{" "}
                                {new Date(application.applied_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#794BE1]">{application.fitment_score}%</div>
                              <div className="text-sm text-gray-500">AI Fitment</div>
                            </div>
                            <Badge className={getStatusColor(application.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(application.status)}
                                <span className="capitalize">{application.status}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#794BE1] text-[#794BE1] bg-transparent hover:bg-[#794BE1] hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {application.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => updateApplicationStatus(application.id, "accepted")}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white"
                                onClick={() => updateApplicationStatus(application.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Job Management & QR Codes</CardTitle>
                <CardDescription className="text-base">
                  All job postings from companies with their QR codes for the opportunity wall
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No jobs posted yet</p>
                    <p className="text-base">Jobs will appear here when companies post them</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#F2F2F2] to-[#E9ECEF] rounded-full flex items-center justify-center">
                              <Briefcase className="w-6 h-6 text-[#794BE1]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{job.title}</h4>
                              <p className="text-gray-600">Company: {job.company_email}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {job.job_type}
                                </Badge>
                                {job.location && (
                                  <>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>{job.applications_count} applications</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={job.active ? "default" : "secondary"}
                              className={job.active ? "bg-green-100 text-green-800" : ""}
                            >
                              {job.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Posted: {new Date(job.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(job.qr_code_url, "_blank")}
                              className="border-[#794BE1] text-[#794BE1] hover:bg-[#794BE1] hover:text-white"
                            >
                              <QrCode className="w-4 h-4 mr-1" />
                              View QR
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadQR(job.qr_code_url, job.title)}
                              className="border-[#794BE1] text-[#794BE1] hover:bg-[#794BE1] hover:text-white"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(job.student_url, "_blank")}
                              className="border-[#794BE1] text-[#794BE1] hover:bg-[#794BE1] hover:text-white"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Company Management</CardTitle>
                <CardDescription className="text-base">
                  All registered companies and their verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {companies.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No companies registered yet</p>
                    <p className="text-base">Companies will appear here when they register</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center justify-between p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#F2F2F2] to-[#E9ECEF] rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-[#794BE1]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{company.name}</h4>
                            <p className="text-gray-600">{company.email}</p>
                            <p className="text-sm text-gray-500">Contact: {company.contact_person}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={company.verified ? "default" : "secondary"}
                            className={company.verified ? "bg-green-100 text-green-800" : ""}
                          >
                            {company.verified ? "Verified" : "Pending"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(company.created_at).toLocaleDateString()}
                          </span>
                          {!company.verified && (
                            <Button size="sm" className="bg-[#794BE1] hover:bg-[#794BE1]/90">
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">User Management</CardTitle>
                <CardDescription className="text-base">All registered users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No users registered yet</p>
                    <p className="text-base">Users will appear here when they complete assessments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#F2F2F2] to-[#E9ECEF] rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-[#794BE1]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{user.name}</h4>
                            <p className="text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
