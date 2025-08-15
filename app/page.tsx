"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Users,
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Brain,
  Rocket,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto max-w-screen-xl text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium animate-scale-in">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              AI-Powered Job Matching
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 gradient-text animate-slide-up">
              Find Your Perfect Career Match
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto animate-slide-up delay-100">
              Kaizen Job Portal uses advanced AI to connect talented students with their dream opportunities. Experience
              the future of career matching today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up delay-200">
              <Link href="/student">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift"
                >
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Find My Dream Job
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/company">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift bg-transparent"
                >
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Post Opportunities
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-screen-xl">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Why Choose Kaizen?</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to revolutionize how students and companies
              connect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="glass-effect hover-lift animate-fade-in">
              <CardHeader>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl">AI-Powered Matching</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Our advanced algorithms analyze skills, interests, and career goals to find perfect job matches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    Personality assessment integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    Skills gap analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    Career path recommendations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-effect hover-lift animate-fade-in delay-100">
              <CardHeader>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Instant Connections</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  QR code technology enables immediate job applications and seamless company-student interactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    QR code job applications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    Real-time notifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    Instant profile matching
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-effect hover-lift animate-fade-in delay-200">
              <CardHeader>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Career Growth</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Comprehensive tools and insights to accelerate your professional development journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    Skill development tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    Industry insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                    Mentorship connections
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-screen-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Students Matched</div>
            </div>
            <div className="animate-fade-in delay-100">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Partner Companies</div>
            </div>
            <div className="animate-fade-in delay-200">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-sm sm:text-base text-muted-foreground">Match Accuracy</div>
            </div>
            <div className="animate-fade-in delay-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-sm sm:text-base text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-screen-xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready to Transform Your Career?</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
            Join thousands of students and companies who have already discovered their perfect match.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/student">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Get Started as Student
              </Button>
            </Link>

            <Link href="/company">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift bg-transparent"
              >
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Post Your First Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto max-w-screen-xl text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary mr-2 sm:mr-3" />
            <span className="text-xl sm:text-2xl font-bold gradient-text">Kaizen Job Portal</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
            Empowering careers through intelligent matching and seamless connections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 text-xs sm:text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Portal
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/opportunities" className="hover:text-primary transition-colors">
              Browse Jobs
            </Link>
            <span className="hidden sm:inline">•</span>
            <span>© 2024 Kaizen Job Portal</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
