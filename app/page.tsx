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
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium animate-scale-in">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Job Matching
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text animate-slide-up">
              Find Your Perfect Career Match
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up delay-100">
              Kaizen Job Portal uses advanced AI to connect talented students with their dream opportunities. Experience
              the future of career matching today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-200">
              <Link href="/student">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold hover-lift"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Find My Dream Job
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/company">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold hover-lift bg-transparent"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Post Opportunities
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Kaizen?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to revolutionize how students and companies
              connect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect hover-lift animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">AI-Powered Matching</CardTitle>
                <CardDescription>
                  Our advanced algorithms analyze skills, interests, and career goals to find perfect job matches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Personality assessment integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Skills gap analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Career path recommendations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-effect hover-lift animate-fade-in delay-100">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Instant Connections</CardTitle>
                <CardDescription>
                  QR code technology enables immediate job applications and seamless company-student interactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    QR code job applications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Real-time notifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Instant profile matching
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-effect hover-lift animate-fade-in delay-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Career Growth</CardTitle>
                <CardDescription>
                  Comprehensive tools and insights to accelerate your professional development journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Skill development tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Industry insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Mentorship connections
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-muted-foreground">Students Matched</div>
            </div>
            <div className="animate-fade-in delay-100">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-muted-foreground">Partner Companies</div>
            </div>
            <div className="animate-fade-in delay-200">
              <div className="text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-muted-foreground">Match Accuracy</div>
            </div>
            <div className="animate-fade-in delay-300">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students and companies who have already discovered their perfect match.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/student">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold hover-lift"
              >
                <Users className="w-5 h-5 mr-2" />
                Get Started as Student
              </Button>
            </Link>

            <Link href="/company">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold hover-lift bg-transparent"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Post Your First Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <span className="text-2xl font-bold gradient-text">Kaizen Job Portal</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Empowering careers through intelligent matching and seamless connections.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Portal
            </Link>
            <span>•</span>
            <Link href="/opportunities" className="hover:text-primary transition-colors">
              Browse Jobs
            </Link>
            <span>•</span>
            <span>© 2024 Kaizen Job Portal</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
