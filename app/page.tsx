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
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const HomePage: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    gsap.registerPlugin(ScrollTrigger)

    // Hero animations
    gsap.from(".hero-badge", {
      scale: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    })
    gsap.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    })
    gsap.from(".hero-desc", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      delay: 0.4,
    })
    gsap.from(".hero-buttons > *", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      delay: 0.8,
    })

    // Features animations
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
    })

    // Stats animations
    gsap.from(".stat-item", {
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
    })

    // CTA animations
    gsap.from(".cta-heading", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power2.out",
    })
    gsap.from(".cta-desc", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: "power2.out",
    })
    gsap.from(".cta-buttons > *", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      delay: 0.6,
      ease: "power2.out",
    })

    // Footer fade in
    gsap.from(".footer-content", {
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    })
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-section relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto max-w-7xl text-center">
          <Badge variant="secondary" className="hero-badge mb-6 px-4 py-2 text-sm sm:text-base font-medium">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            AI-Powered Job Matching
          </Badge>

          <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            Find Your Perfect Career Match
          </h1>

          <p className="hero-desc text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Kaizen Job Portal uses advanced AI to connect talented students with their dream opportunities. Experience
            the future of career matching today.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/student">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift"
              >
                <Target className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Find My Dream Job
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/company">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift bg-transparent"
              >
                <Building2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Post Opportunities
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Why Choose Kaizen?</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to revolutionize how students and companies
              connect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="feature-card glass-effect hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl">AI-Powered Matching</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Our advanced algorithms analyze skills, interests, and career goals to find perfect job matches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
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

            <Card className="feature-card glass-effect hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Instant Connections</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  QR code technology enables immediate job applications and seamless company-student interactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
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

            <Card className="feature-card glass-effect hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Career Growth</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Comprehensive tools and insights to accelerate your professional development journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
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
      <section className="stats-section py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="stat-item">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Students Matched</div>
            </div>
            <div className="stat-item">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Partner Companies</div>
            </div>
            <div className="stat-item">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-sm sm:text-base text-muted-foreground">Match Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-sm sm:text-base text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="cta-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="cta-desc text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
            Join thousands of students and companies who have already discovered their perfect match.
          </p>

          <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/student">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift"
              >
                <Users className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Get Started as Student
              </Button>
            </Link>

            <Link href="/company">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-lift bg-transparent"
              >
                <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Post Your First Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="footer-content container mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-primary mr-3" />
            <span className="text-xl sm:text-2xl font-bold gradient-text">Kaizen Job Portal</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Empowering careers through intelligent matching and seamless connections.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
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

export default HomePage
