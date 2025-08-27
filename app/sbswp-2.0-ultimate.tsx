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
  Lock,
  Bot,
  Cpu,
  Database,
  Network,
  Activity,
  DollarSign,
  Home,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react"
import { useState, useEffect } from "react"

export default function SBSWP2UltimateHomepage() {
  const [email, setEmail] = useState("")
  const [adminClicks, setAdminClicks] = useState<number>(0)
  const [liveMetrics, setLiveMetrics] = useState({
    activeDeals: 847,
    totalVolume: 52300000,
    agentsOnline: 156,
    marketTrends: 94.7
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeDeals: prev.activeDeals + Math.floor(Math.random() * 3),
        totalVolume: prev.totalVolume + Math.floor(Math.random() * 50000),
        agentsOnline: prev.agentsOnline + Math.floor(Math.random() * 5) - 2,
        marketTrends: 90 + Math.random() * 10
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleAdminAccess = () => {
    setAdminClicks((prev: number) => prev + 1)
    if (adminClicks >= 4) {
      window.location.href = '/admin/login'
    }
  }

  const agents = [
    {
      name: "Sarah Chen",
      avatar: "SC",
      specialty: "Luxury Properties",
      successRate: 94.2,
      avgDealSize: 847000,
      responseTime: 2.3,
      satisfaction: 4.9,
      status: "online"
    },
    {
      name: "Marcus Rodriguez",
      avatar: "MR", 
      specialty: "First-Time Investors",
      successRate: 91.8,
      avgDealSize: 324000,
      responseTime: 1.7,
      satisfaction: 4.8,
      status: "online"
    },
    {
      name: "Emma Thompson",
      avatar: "ET",
      specialty: "Commercial Properties", 
      successRate: 96.1,
      avgDealSize: 1200000,
      responseTime: 3.1,
      satisfaction: 4.9,
      status: "busy"
    },
    {
      name: "David Kim",
      avatar: "DK",
      specialty: "Wholesale Deals",
      successRate: 89.5,
      avgDealSize: 180000,
      responseTime: 1.2,
      satisfaction: 4.7,
      status: "online"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
      {/* NEURAL BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl sbswp-animate-quantum-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl sbswp-animate-neural-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl sbswp-animate-gradient-shift" />
      </div>

      {/* QUANTUM NAVIGATION */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3 sbswp-scroll-reveal">
              <div className="relative sbswp-glow-primary">
                <Building2 className="h-8 w-8 text-blue-400 sbswp-animate-neural-pulse" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold sbswp-holographic-text">
                  S.B.S.W.P 2.0
                </span>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-blue-400" />
                  AI-Powered Platform
                </div>
              </div>
            </div>
            
            {/* NEURAL NAVIGATION */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">AI Features</Link>
              <Link href="#agents" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">Smart Agents</Link>
              <Link href="#analytics" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">Real-time Analytics</Link>
              <Button className="sbswp-neural-button" asChild>
                <Link href="/wholesaler/signup">Launch Platform</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO SECTION - COMPETITION ANNIHILATION */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* QUANTUM BADGE */}
            <div className="sbswp-live-indicator mb-8 sbswp-scroll-reveal">
              <div className="sbswp-live-dot" />
              <span>LIVE: Real-time Deal Flow Active</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30">
                {liveMetrics.agentsOnline} Agents Online
              </Badge>
            </div>

            {/* NEURAL HERO TITLE */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8 sbswp-scroll-reveal leading-tight">
              <span className="sbswp-holographic-text block mb-4">
                ANNIHILATE
              </span>
              <span className="bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent block">
                The Competition
              </span>
            </h1>

            {/* QUANTUM SUBTITLE */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed sbswp-scroll-reveal">
              The world's most advanced AI-powered real estate platform. 
              <span className="sbswp-text-quantum font-semibold"> TensorFlow ML models</span>, 
              <span className="text-emerald-400 font-semibold"> real-time WebSocket data</span>, and 
              <span className="text-purple-400 font-semibold"> automated deal intelligence</span>.
            </p>

            {/* NEURAL CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 sbswp-scroll-reveal">
              <Button size="lg" className="sbswp-neural-button px-12 py-6 text-lg" asChild>
                <Link href="/wholesaler/signup" className="flex items-center gap-3">
                  <Rocket className="h-5 w-5" />
                  Launch AI Platform
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-12 py-6 text-lg border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" asChild>
                <Link href="/demo" className="flex items-center gap-3">
                  <Eye className="h-5 w-5" />
                  Live Demo
                </Link>
              </Button>
            </div>

            {/* REAL-TIME METRICS DASHBOARD */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sbswp-scroll-reveal">
              <div className="sbswp-metric-card">
                <div className="sbswp-metric-value">${(liveMetrics.totalVolume / 1000000).toFixed(1)}M+</div>
                <div className="sbswp-metric-label">Volume Processed</div>
              </div>
              <div className="sbswp-metric-card">
                <div className="sbswp-metric-value">{liveMetrics.activeDeals}</div>
                <div className="sbswp-metric-label">Active Deals</div>
              </div>
              <div className="sbswp-metric-card">
                <div className="sbswp-metric-value">99.9%</div>
                <div className="sbswp-metric-label">AI Accuracy</div>
              </div>
              <div className="sbswp-metric-card">
                <div className="sbswp-metric-value">{liveMetrics.marketTrends.toFixed(1)}%</div>
                <div className="sbswp-metric-label">Market Score</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI AGENTS SHOWCASE */}
      <section id="agents" className="py-20 bg-gradient-to-r from-slate-950/50 to-blue-950/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="sbswp-holographic-text">AI-Powered Agent Network</span>
            </h2>
            <p className="text-xl text-gray-300">
              Our neural network assigns the perfect agent based on AI analysis of deal type, location, and investor profile
            </p>
          </div>

          <div className="sbswp-neural-grid">
            {agents.map((agent, index) => (
              <div key={index} className="sbswp-agent-card sbswp-scroll-reveal" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="sbswp-agent-avatar">
                    {agent.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{agent.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${
                        agent.status === 'online' ? 'bg-emerald-400 sbswp-animate-neural-pulse' : 
                        agent.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                    </div>
                    <p className="text-gray-400 text-sm">{agent.specialty}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Success Rate</span>
                    <span className="font-bold text-emerald-400">{agent.successRate}%</span>
                  </div>
                  <div className="sbswp-performance-meter">
                    <div className="sbswp-performance-fill" style={{width: `${agent.successRate}%`}} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold sbswp-text-quantum">
                        ${(agent.avgDealSize / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-400">Avg Deal</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">
                        {agent.responseTime}min
                      </div>
                      <div className="text-xs text-gray-400">Response</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 pt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(agent.satisfaction) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">{agent.satisfaction}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEURAL FEATURES COMPARISON */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="sbswp-holographic-text">Competition Destruction Matrix</span>
              </h2>
              <p className="text-xl text-gray-300">
                See how S.B.S.W.P 2.0 annihilates BiggerPockets, FortuneBuilders, and Roofstock
              </p>
            </div>

            {/* COMPARISON TABLE */}
            <div className="sbswp-quantum-card p-8 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-4 pr-4 text-gray-400">Feature</th>
                    <th className="py-4 px-4 text-gray-400">BiggerPockets</th>
                    <th className="py-4 px-4 text-gray-400">FortuneBuilders</th>
                    <th className="py-4 px-4 text-gray-400">Roofstock</th>
                    <th className="py-4 pl-4 sbswp-text-quantum font-bold">S.B.S.W.P 2.0</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["AI Analytics", "❌", "❌", "Basic", "🚀 Advanced ML"],
                    ["Real-time Data", "❌", "❌", "Limited", "⚡ Live Updates"],
                    ["Agent Management", "❌", "❌", "❌", "🤖 AI-Powered"],
                    ["Contract Automation", "❌", "Basic", "❌", "📝 Full AI Generation"],
                    ["Mobile Experience", "Poor", "Poor", "Average", "📱 Native-level"],
                    ["UI/UX Quality", "Outdated", "Basic", "Average", "🎨 World-class"],
                    ["Customization", "Limited", "Limited", "None", "⚙️ Fully Configurable"]
                  ].map(([feature, bp, fb, rs, sbswp], index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 pr-4 font-medium">{feature}</td>
                      <td className="py-4 px-4 text-red-400">{bp}</td>
                      <td className="py-4 px-4 text-red-400">{fb}</td>
                      <td className="py-4 px-4 text-yellow-400">{rs}</td>
                      <td className="py-4 pl-4 text-emerald-400 font-bold">{sbswp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIVE SHOWCASE */}
      <section className="py-20 bg-gradient-to-r from-purple-950/30 to-blue-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="sbswp-holographic-text">Perfect on Every Device</span>
            </h2>
            <p className="text-xl text-gray-300">
              World-class responsive design that adapts flawlessly from mobile to 8K displays
            </p>
          </div>

          <div className="flex justify-center items-center gap-8 mb-16">
            <div className="sbswp-quantum-card p-6 text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <div className="font-bold">Mobile First</div>
              <div className="text-sm text-gray-400">Touch Optimized</div>
            </div>
            <div className="sbswp-quantum-card p-6 text-center">
              <Tablet className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
              <div className="font-bold">Tablet Perfect</div>
              <div className="text-sm text-gray-400">Gesture Ready</div>
            </div>
            <div className="sbswp-quantum-card p-6 text-center">
              <Monitor className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <div className="font-bold">Desktop Pro</div>
              <div className="text-sm text-gray-400">8K Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* NEURAL NEWSLETTER */}
      <section className="py-20 bg-gradient-to-r from-blue-950/30 to-emerald-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 sbswp-holographic-text">
              Join the AI Revolution
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Get early access to the platform that will make every competitor obsolete
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="sbswp-neural-button">
                Launch Early Access
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* QUANTUM FOOTER */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold sbswp-text-quantum">
                S.B.S.W.P 2.0
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
              {/* DISCRETE ADMIN ACCESS */}
              <button 
                onClick={handleAdminAccess}
                className="text-gray-600 hover:text-gray-500 transition-colors text-xs opacity-30 p-2"
                title="Admin Access"
              >
                <Lock className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            © 2025 S.B.S.W.P 2.0. The Ultimate Real Estate Platform. Built to ANNIHILATE the competition.
          </div>
        </div>
      </footer>
    </div>
  )
}