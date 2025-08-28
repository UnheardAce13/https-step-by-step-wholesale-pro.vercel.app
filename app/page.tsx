'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Brain, TrendingUp, Shield, Rocket, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />
      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/20">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span>S.B.S.W.P 2.0 - TOTAL MARKET DOMINATION</span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Ultimate AI-Powered
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Real Estate Platform
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Revolutionary AI contract generation, predictive analytics, and market intelligence 
            that <strong>ANNIHILATES</strong> all competition. Welcome to the future of real estate investment.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button variant="quantum" size="lg" className="group">
              <span className="flex items-center gap-2">
                Launch Platform
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button variant="glass" size="lg">
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Market-Dominating Features
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Every feature designed to give you an unfair advantage in real estate
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card variant="glass" className="group h-full p-6 hover:scale-105 transition-all duration-300">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">{feature.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription className="text-gray-300 mb-4">
                      {feature.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-300"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card variant="quantum" className="px-6 py-24 text-center sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Dominate the Market?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
              Join the revolution. Experience AI-powered real estate investment like never before.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button variant="premium" size="lg" className="group">
                <span className="flex items-center gap-2">
                  Get Started Now
                  <Rocket className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    name: 'AI Contract Generation',
    description: 'Revolutionary OpenAI GPT-4 powered contract creation with DocuSign integration for seamless e-signatures.',
    icon: Brain,
    highlights: ['OpenAI GPT-4', 'DocuSign API', 'Legal Compliance', 'Risk Assessment']
  },
  {
    name: 'Predictive Analytics',
    description: 'Advanced market intelligence and deal outcome predictions that give you an unfair competitive advantage.',
    icon: TrendingUp,
    highlights: ['Market Forecasting', 'Deal Predictions', 'Performance Metrics', 'ROI Analysis']
  },
  {
    name: 'Lightning Fast Performance',
    description: 'Built on Next.js 15 and React 19 with enterprise-grade architecture for maximum speed and reliability.',
    icon: Zap,
    highlights: ['Next.js 15', 'React 19', 'TypeScript 5', 'Serverless Functions']
  },
  {
    name: 'Enterprise Security',
    description: 'Multi-role authentication, RBAC, and enterprise-grade security that protects your investments.',
    icon: Shield,
    highlights: ['Multi-Role Auth', 'RBAC', 'JWT Security', 'Data Encryption']
  },
  {
    name: 'Real-Time Intelligence',
    description: 'Live market data, performance tracking, and intelligent alerts that keep you ahead of the competition.',
    icon: Rocket,
    highlights: ['Live Data', 'Smart Alerts', 'Performance Tracking', 'Market Intelligence']
  },
  {
    name: 'Premium UI/UX',
    description: 'Glass morphism design, quantum animations, and premium user experience that impresses clients.',
    icon: Crown,
    highlights: ['Glass Morphism', 'Quantum Effects', 'Responsive Design', 'Premium Animations']
  }
]