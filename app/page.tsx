"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle,
  ArrowRight,
  Star,
  MessageSquare,
  BarChart3,
  Wallet,
  Clock,
  Award,
  Sparkles,
  Target,
  Brain,
  Rocket,
  Eye,
  Lock
} from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [adminClicks, setAdminClicks] = useState<number>(0)

  const handleAdminAccess = () => {
    setAdminClicks((prev: number) => prev + 1)
    if (adminClicks >= 4) {
      window.location.href = '/admin/login'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
      {/* Premium Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/10 backdrop-premium">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 animate-premium-slide-right">
              <div className="relative hover-glow-blue">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 animate-premium-float" />
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2 w-2 sm:h-3 sm:w-3 bg-emerald-400 rounded-full animate-premium-pulse" />
              </div>
              <div className="block">
                <span className="text-sm sm:text-xl font-bold text-gradient-animate">
                  <span className="hidden sm:inline">StepByStep Wholesale Pro</span>
                  <span className="sm:hidden">SWP</span>
                </span>
                <div className="text-xs text-gray-400 hidden sm:block">Enterprise SaaS Platform</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 animate-premium-slide-up">
              <Link href="#features" className="text-gray-300 hover:text-white transition-all duration-300 hover-lift interactive-scale text-sm xl:text-base">Features</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-all duration-300 hover-lift interactive-scale text-sm xl:text-base">Pricing</Link>
              <Link href="#contact" className="text-gray-300 hover:text-white transition-all duration-300 hover-lift interactive-scale text-sm xl:text-base">Contact</Link>
              <Button variant="outline" className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 btn-premium hover-glow-blue text-sm" asChild>
                <Link href="/wholesaler/signup">Get Started</Link>
              </Button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Competition Crushing Design */}
      <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-500/20 rounded-full blur-3xl animate-premium-float" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-emerald-500/20 rounded-full blur-3xl animate-premium-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-premium-gradient" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-400/30 mb-6 sm:mb-8 animate-premium-bounce-in hover-glow-blue interactive-scale">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 animate-premium-glow" />
              <span className="text-xs sm:text-sm font-medium">S.B.S.W.P 2.0 - TOTAL MARKET DOMINATION</span>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30 animate-premium-pulse text-xs">
                AI POWERED
              </Badge>
            </div>

            {/* Hero Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight mb-6 sm:mb-8 animate-premium-slide-up will-change-transform leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent block">
                S.B.S.W.P 2.0
              </span>
              <br className="hidden sm:block" />
              <span className="text-gradient-animate block" style={{animationDelay: '0.3s'}}>
                AI-Powered Real Estate Empire
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed animate-premium-slide-up px-4 sm:px-0" style={{animationDelay: '0.6s'}}>
              The ultimate real estate investment platform with 
              <span className="text-blue-400 font-semibold hover:text-glow"> AI contract generation</span>, 
              <span className="text-emerald-400 font-semibold hover:text-glow"> DocuSign integration</span>, and 
              <span className="text-purple-400 font-semibold hover:text-glow"> predictive analytics</span> that 
              <span className="text-yellow-400 font-bold"> ANNIHILATES </span> all competition.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-14 lg:mb-16 animate-premium-scale-in px-4 sm:px-0" style={{animationDelay: '0.9s'}}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-2xl shadow-blue-500/25 border-0 btn-premium hover-glow-blue will-change-transform min-h-[48px]"
                asChild
              >
                <Link href="/wholesaler/signup" className="flex items-center justify-center gap-2">
                  <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg border-white/30 text-white hover:bg-white/10 backdrop-blur-sm btn-premium hover-glow-emerald min-h-[48px]"
                asChild
              >
                <Link href="/investor/signup" className="flex items-center justify-center gap-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                  Investor Access
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center stagger-animation px-4 sm:px-0">
              <div className="space-y-1 sm:space-y-2 dashboard-metric hover-glow-blue p-2 sm:p-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 text-glow">$50M+</div>
                <div className="text-xs sm:text-sm text-gray-400">Deals Processed</div>
              </div>
              <div className="space-y-1 sm:space-y-2 dashboard-metric hover-glow-emerald p-2 sm:p-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 text-glow">99.9%</div>
                <div className="text-xs sm:text-sm text-gray-400">Uptime SLA</div>
              </div>
              <div className="space-y-1 sm:space-y-2 dashboard-metric hover-glow-purple p-2 sm:p-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 text-glow">5000+</div>
                <div className="text-xs sm:text-sm text-gray-400">Active Users</div>
              </div>
              <div className="space-y-1 sm:space-y-2 dashboard-metric hover-glow-blue p-2 sm:p-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 text-glow">24/7</div>
                <div className="text-xs sm:text-sm text-gray-400">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Enterprise-Grade Features
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4 sm:px-0">
              Built by top-tier engineers for the most demanding real estate professionals
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Wholesaler Section */}
            <Card className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border-blue-400/30 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-500 group">
              <CardHeader className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                    <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-xl sm:text-2xl text-white group-hover:text-blue-400 transition-colors">
                      For Wholesalers
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm sm:text-base">
                      AI-powered automation suite
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { icon: Brain, text: "AI Lead Qualification & Scoring" },
                    { icon: Target, text: "Automated Property Discovery" },
                    { icon: MessageSquare, text: "Smart SMS Campaigns" },
                    { icon: BarChart3, text: "Advanced Analytics Dashboard" },
                    { icon: Shield, text: "Contract Management Suite" },
                    { icon: Zap, text: "Real-time Deal Flow" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 group/item">
                      <div className="p-1 rounded-full bg-emerald-500/20 flex-shrink-0">
                        <feature.icon className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                      </div>
                      <span className="text-gray-300 group-hover/item:text-white transition-colors text-sm sm:text-base">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 min-h-[44px] text-sm sm:text-base" asChild>
                    <Link href="/wholesaler/signup">Start Wholesaling</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investor Section */}
            <Card className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-400/30 backdrop-blur-xl hover:border-emerald-400/50 transition-all duration-500 group">
              <CardHeader className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 flex-shrink-0">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-xl sm:text-2xl text-white group-hover:text-emerald-400 transition-colors">
                      For Investors
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm sm:text-base">
                      Intelligent investment platform
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { icon: Eye, text: "Deal Flow Intelligence" },
                    { icon: BarChart3, text: "ROI Prediction Models" },
                    { icon: Shield, text: "Risk Assessment Tools" },
                    { icon: Wallet, text: "Portfolio Management" },
                    { icon: Clock, text: "Real-time Notifications" },
                    { icon: Award, text: "Exclusive Deal Access" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 group/item">
                      <div className="p-1 rounded-full bg-blue-500/20 flex-shrink-0">
                        <feature.icon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                      </div>
                      <span className="text-gray-300 group-hover/item:text-white transition-colors text-sm sm:text-base">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 min-h-[44px] text-sm sm:text-base" asChild>
                    <Link href="/investor/signup">Start Investing</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Excellence Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-slate-950/50 to-blue-950/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-14 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Built for Excellence
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4 sm:px-0">
              Enterprise-grade architecture that scales with your ambitions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "Bank-Grade Security",
                description: "End-to-end encryption, SOC 2 compliance, and advanced threat protection"
              },
              {
                icon: Zap,
                title: "Lightning Performance",
                description: "Sub-100ms response times with global CDN and edge computing"
              },
              {
                icon: Globe,
                title: "99.9% Uptime SLA",
                description: "Multi-region deployment with automatic failover and disaster recovery"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 sm:col-span-1 lg:col-span-1">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-4 sm:mb-6">
                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className="py-16 sm:py-18 lg:py-20 bg-gradient-to-r from-blue-950/30 to-emerald-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4 sm:px-0">
              Join thousands of professionals already using our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto px-4 sm:px-0">
              <Input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[44px] text-sm sm:text-base"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 min-h-[44px] text-sm sm:text-base px-6 sm:px-8">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Discrete Admin Access */}
      <footer className="py-8 sm:py-10 lg:py-12 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              <span className="text-base sm:text-lg font-semibold text-white">
                <span className="hidden sm:inline">StepByStep Wholesale Pro</span>
                <span className="sm:hidden">SWP</span>
              </span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors py-2">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors py-2">Terms</Link>
              <Link href="/support" className="hover:text-white transition-colors py-2">Support</Link>
              {/* Discrete Admin Access - Click 5 times */}
              <button 
                onClick={handleAdminAccess}
                className="text-gray-600 hover:text-gray-500 transition-colors text-xs opacity-30 p-2"
                title="Admin Access"
              >
                <Lock className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 text-center text-gray-400 text-xs sm:text-sm">
            © 2025 StepByStep Wholesale Pro. All rights reserved. Enterprise SaaS Platform.
          </div>
        </div>
      </footer>
    </div>
  )
}
