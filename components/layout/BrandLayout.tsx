"use client"

import React from 'react'
import { Building2, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface BrandLayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
  className?: string
}

export function BrandLayout({ children, showNavigation = true, className = '' }: BrandLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 ${className}`}>
      {/* Premium Brand Navigation */}
      {showNavigation && (
        <nav className="nav-brand fixed top-0 z-50 w-full">
          <div className="brand-container">
            <div className="flex h-16 items-center justify-between">
              {/* Enhanced Brand Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="brand-logo-icon relative">
                  <Building2 className="h-8 w-8 text-white" />
                  <div className="brand-status-online absolute -top-1 -right-1" />
                </div>
                <div className="hidden md:block">
                  <div className="brand-logo text-xl">
                    StepByStep Wholesale Pro
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                    Enterprise SaaS Platform
                  </div>
                </div>
              </Link>

              {/* Premium Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                <Link href="#features" className="brand-nav-link">
                  Features
                </Link>
                <Link href="#pricing" className="brand-nav-link">
                  Pricing
                </Link>
                <Link href="#contact" className="brand-nav-link">
                  Contact
                </Link>
                <Link href="/wholesaler/signup" className="btn-brand-primary ml-4">
                  Get Started
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 text-gray-300 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`${showNavigation ? 'pt-16' : ''} relative z-10`}>
        {children}
      </main>

      {/* Enhanced Brand Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="brand-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Identity Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="brand-logo-icon">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span className="brand-logo text-lg">
                  StepByStep Wholesale Pro
                </span>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                The world's most advanced SaaS platform for real estate professionals. 
                Built with cutting-edge technology and premium user experience.
              </p>
              <div className="flex items-center gap-4">
                <div className="brand-badge brand-badge-success">
                  99.9% Uptime
                </div>
                <div className="brand-badge brand-badge-primary">
                  SOC 2 Certified
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/wholesaler" className="hover:text-white transition-colors">Wholesaler Tools</Link></li>
                <li><Link href="/investor" className="hover:text-white transition-colors">Investor Portal</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2025 StepByStep Wholesale Pro. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BrandLayout

// Brand Identity Helper Components
export function BrandBadge({ 
  children, 
  variant = 'primary', 
  className = '' 
}: { 
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'error'
  className?: string 
}) {
  const variantClasses = {
    primary: 'brand-badge-primary',
    success: 'brand-badge-success',
    warning: 'brand-badge-warning',
    error: 'brand-badge-error'
  }

  return (
    <span className={`brand-badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function BrandCard({ 
  children, 
  className = '',
  hover = true 
}: { 
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div className={`card-brand ${hover ? 'brand-card-premium' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function BrandButton({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}: { 
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  [key: string]: any
}) {
  const variantClasses = {
    primary: 'btn-brand-primary',
    secondary: 'brand-button-secondary'
  }

  return (
    <button className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function BrandInput({ 
  className = '',
  ...props 
}: { 
  className?: string
  [key: string]: any
}) {
  return (
    <input className={`input-brand ${className}`} {...props} />
  )
}

// Loading States
export function BrandSkeleton({ 
  className = '',
  width = 'w-full',
  height = 'h-4' 
}: { 
  className?: string
  width?: string
  height?: string
}) {
  return (
    <div className={`brand-skeleton ${width} ${height} ${className}`} />
  )
}

// Status Indicators
export function BrandStatusIndicator({ 
  status = 'online' 
}: { 
  status?: 'online' | 'busy' | 'away' 
}) {
  const statusClasses = {
    online: 'brand-status-online',
    busy: 'brand-status-busy',
    away: 'brand-status-away'
  }

  return <div className={statusClasses[status]} />
}