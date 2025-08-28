'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Home,
  FileText,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
  Crown,
  Zap,
  Shield,
  Brain
} from 'lucide-react'

const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    description: 'Overview & metrics'
  },
  { 
    name: 'AI Contracts', 
    href: '/contracts', 
    icon: FileText,
    description: 'Generate & manage contracts',
    premium: true
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: BarChart3,
    description: 'Advanced insights'
  },
  { 
    name: 'Deals', 
    href: '/deals', 
    icon: Zap,
    description: 'Manage investments'
  },
  { 
    name: 'Team', 
    href: '/team', 
    icon: Users,
    description: 'User management'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    description: 'Configuration'
  }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="glass"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <Card 
        variant="glass" 
        className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:p-4 md:border-r md:border-white/10"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-4 mb-8">
            <div className="relative">
              <Crown className="h-8 w-8 text-yellow-400" />
              <div className="absolute inset-0 animate-pulse-glow">
                <Crown className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">S.B.S.W.P</h1>
              <p className="text-xs text-gray-300">2.0 Platform</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-white/10 hover:backdrop-blur-sm"
              >
                <div className="relative">
                  <item.icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                  {item.premium && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="h-3 w-3 text-yellow-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    {item.premium && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </nav>

          {/* Premium Features Badge */}
          <Card variant="quantum" className="p-4 mt-4">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-white">AI Powered</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Experience next-generation real estate intelligence
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-green-400">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Zap className="h-3 w-3" />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-1 text-purple-400">
                <Brain className="h-3 w-3" />
                <span>Smart</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <Crown className="h-3 w-3" />
                <span>Premium</span>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="fixed left-0 top-0 h-screen w-80 z-50 md:hidden"
            >
              <Card variant="glass" className="h-full p-4 border-r border-white/10">
                <div className="flex flex-col h-full">
                  {/* Logo */}
                  <div className="flex items-center gap-3 p-4 mb-8">
                    <div className="relative">
                      <Crown className="h-8 w-8 text-yellow-400" />
                      <div className="absolute inset-0 animate-pulse-glow">
                        <Crown className="h-8 w-8 text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">S.B.S.W.P</h1>
                      <p className="text-xs text-gray-300">2.0 Platform</p>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <nav className="flex-1 space-y-2">
                    {navigationItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="group flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-white/10 hover:backdrop-blur-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="relative">
                            <item.icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                            {item.premium && (
                              <div className="absolute -top-1 -right-1">
                                <Crown className="h-3 w-3 text-yellow-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                {item.name}
                              </span>
                              {item.premium && (
                                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  {/* Premium Features Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card variant="quantum" className="p-4 mt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Brain className="h-5 w-5 text-blue-400" />
                        <span className="text-sm font-medium text-white">AI Powered</span>
                      </div>
                      <p className="text-xs text-gray-300 mb-3">
                        Experience next-generation real estate intelligence
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-green-400">
                          <Shield className="h-3 w-3" />
                          <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <Zap className="h-3 w-3" />
                          <span>Fast</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-400">
                          <Brain className="h-3 w-3" />
                          <span>Smart</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Crown className="h-3 w-3" />
                          <span>Premium</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}