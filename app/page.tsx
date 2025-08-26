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
  Award
} from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [promoCode, setPromoCode] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Building2 className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Step by Step Wholesale Pro</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Navigation can be added here */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Revolutionary AI-Powered Platform
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl lg:text-7xl">
              Transform Your 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wholesale Empire
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-400 sm:text-2xl">
              The ultimate AI-driven SaaS platform connecting wholesalers and investors with cutting-edge automation, 
              smart contracts, and real-time deal flow management.
            </p>
            
            {/* Promo Code Input */}
            <div className="mb-8 mx-auto max-w-md">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter promo code for free trial"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">Apply</Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">Get 1-90 days free trial with valid promo code</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="#get-started">Get Started Today</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 py-4 text-lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
            <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$2.5M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Deals Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Specific Sections */}
      <section id="get-started" className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Path to Success</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Whether you're a wholesaler or investor, we have the perfect solution tailored for your needs.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Wholesaler Section */}
            <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-bl-full opacity-10" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl">For Wholesalers</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Automate your lead generation, manage deals, and scale your wholesale business with AI-powered tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Zikk AI Lead Capture & Qualification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Huntz Property Search Automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Automatz Lead Nurturing System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Rezz CRM & Deal Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Agent Vetzz Contract Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>SMS Automation via Telnyx</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Subscription Plans:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div>
                        <div className="font-medium">Starter Pack</div>
                        <div className="text-sm text-gray-500">2,500 SMS/month</div>
                      </div>
                      <div className="text-lg font-bold">$149/mo</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div>
                        <div className="font-medium">Pro Pack</div>
                        <div className="text-sm text-gray-500">6,500 SMS/month</div>
                      </div>
                      <div className="text-lg font-bold">$199/mo</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded border border-purple-200 dark:border-purple-800">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          Empire Pack 
                          <Badge variant="secondary">White Label</Badge>
                        </div>
                        <div className="text-sm text-gray-500">15,000 SMS/month</div>
                      </div>
                      <div className="text-lg font-bold">$599/mo</div>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link href="/wholesaler/signup">
                    Start Wholesaling Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Investor Section */}
            <Card className="relative overflow-hidden border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-bl-full opacity-10" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-2xl">For Investors</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Discover profitable deals, place smart bids, and build your real estate portfolio with confidence.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Zikk 2 AI Property Matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Real-time Deal Alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Rezz 2 Portfolio Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>5-Day Bidding System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Contract Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>ROI Analytics & Tracking</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Investment Fees:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>Bidding Fee</span>
                      <span className="font-bold">$49 per bid</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>Closing Fee</span>
                      <span className="font-bold">1% of deal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>Overage Fee</span>
                      <span className="font-bold">10% of difference</span>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full" size="lg" variant="outline">
                  <Link href="/investor/signup">
                    Start Investing Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-800">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Everything you need to dominate the wholesale real estate market.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle>AI-Powered Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  6 specialized AI agents working 24/7 to capture leads, analyze deals, and manage your pipeline.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Smart Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Automated SMS campaigns, lead nurturing, and real-time notifications via Telnyx integration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Secure Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  State-specific legal templates and DocuSign integration for seamless contract management.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time performance tracking, deal scoring, and ROI analysis to optimize your strategy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle>5-Day Deal System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Fast-track deal completion with automated countdown timers and milestone tracking.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-indigo-500 mb-2" />
                <CardTitle>White-Label Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Empire tier includes full rebranding capabilities for agencies and enterprise users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Users Say</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "This platform transformed my wholesale business. The AI automation saved me 20+ hours per week!"
                </p>
                <div className="text-sm font-medium">- Sarah Johnson, Wholesaler</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "Found 3 profitable deals in my first month. The ROI analytics are incredibly accurate."
                </p>
                <div className="text-sm font-medium">- Mike Chen, Investor</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "The white-label feature helped me launch my own platform. Game changer for my agency!"
                </p>
                <div className="text-sm font-medium">- David Rodriguez, Agency Owner</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful wholesalers and investors already using our platform.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="px-8 py-4 text-lg">
              <Link href="/wholesaler/signup">Start as Wholesaler</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/investor/signup">Start as Investor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900">
        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="font-bold">Step by Step Wholesale Pro</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The ultimate AI-driven platform for wholesale real estate professionals.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/wholesaler" className="hover:text-gray-900 dark:hover:text-gray-100">Wholesaler</Link></li>
                <li><Link href="/investor" className="hover:text-gray-900 dark:hover:text-gray-100">Investor</Link></li>
                <li><Link href="/features" className="hover:text-gray-900 dark:hover:text-gray-100">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900 dark:hover:text-gray-100">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/help" className="hover:text-gray-900 dark:hover:text-gray-100">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-100">Contact</Link></li>
                <li><Link href="/docs" className="hover:text-gray-900 dark:hover:text-gray-100">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-100">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900 dark:hover:text-gray-100">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Step by Step Wholesale Pro. All rights reserved.
            </p>
            
            {/* Discrete Admin Access */}
            <div className="mt-4 sm:mt-0">
              <Link 
                href="/admin/login" 
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Admin Access"
              >
                ⚙️
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
