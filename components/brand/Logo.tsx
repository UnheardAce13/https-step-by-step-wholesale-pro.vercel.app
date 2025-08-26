"use client"

import React from 'react'
import { Building2, Zap, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface LogoProps {
  variant?: 'default' | 'minimal' | 'icon-only' | 'wordmark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  animated?: boolean
  className?: string
  href?: string
}

export function Logo({ 
  variant = 'default',
  size = 'md',
  showTagline = false,
  animated = true,
  className = '',
  href = '/'
}: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'h-6 w-6',
      text: 'text-lg',
      tagline: 'text-xs'
    },
    md: {
      icon: 'h-8 w-8',
      text: 'text-xl',
      tagline: 'text-sm'
    },
    lg: {
      icon: 'h-10 w-10',
      text: 'text-2xl',
      tagline: 'text-base'
    },
    xl: {
      icon: 'h-12 w-12',
      text: 'text-3xl',
      tagline: 'text-lg'
    }
  }

  const LogoIcon = () => (
    <div className={`relative ${animated ? 'brand-logo-icon' : 'bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg p-2'}`}>
      <Building2 className={`${sizeClasses[size].icon} text-white`} />
      {animated && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
      )}
    </div>
  )

  const LogoText = () => (
    <div className="flex flex-col">
      <span className={`font-bold ${sizeClasses[size].text} ${animated ? 'brand-text-gradient' : 'text-white'}`}>
        {variant === 'minimal' ? 'SWP' : 'StepByStep Wholesale Pro'}
      </span>
      {showTagline && (
        <span className={`${sizeClasses[size].tagline} text-gray-400 flex items-center gap-1`}>
          <Zap className="h-3 w-3 text-yellow-400" />
          Enterprise SaaS Platform
        </span>
      )}
    </div>
  )

  const LogoContent = () => {
    switch (variant) {
      case 'icon-only':
        return <LogoIcon />
      case 'wordmark':
        return <LogoText />
      case 'minimal':
        return (
          <div className="flex items-center gap-2">
            <LogoIcon />
            <LogoText />
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-3">
            <LogoIcon />
            <LogoText />
          </div>
        )
    }
  }

  if (href) {
    return (
      <Link href={href} className={`inline-flex items-center group ${className}`}>
        <LogoContent />
      </Link>
    )
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <LogoContent />
    </div>
  )
}

// Premium Logo Variations
export function PremiumLogo({ 
  size = 'lg',
  animated = true,
  className = ''
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Icon Container */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-emerald-600 to-purple-600 rounded-2xl opacity-90" />
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-emerald-400 to-purple-400 rounded-2xl opacity-0 animate-pulse" />
        )}
        
        {/* Icon */}
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          <Building2 className="h-1/2 w-1/2 text-white" />
        </div>
        
        {/* Status Indicators */}
        <div className="absolute -top-1 -right-1 flex gap-1">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  )
}

// Logo with Feature Icons
export function FeatureLogo({ 
  className = '',
  showFeatures = true 
}: {
  className?: string
  showFeatures?: boolean
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <PremiumLogo size="md" />
      <div className="flex flex-col">
        <span className="text-xl font-bold brand-text-gradient">
          StepByStep Wholesale Pro
        </span>
        {showFeatures && (
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <Target className="h-3 w-3" />
              <span>AI Powered</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>Real-time</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-400">
              <Zap className="h-3 w-3" />
              <span>Enterprise</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Animated Brand Mark
export function AnimatedBrandMark({ 
  className = '' 
}: {
  className?: string
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-emerald-600/50 rounded-full blur-xl animate-pulse" />
      
      {/* Main Container */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-2xl border border-white/10">
        {/* Brand Icon */}
        <div className="relative">
          <Building2 className="h-12 w-12 text-blue-400" />
          
          {/* Animated Elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-bounce" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-ping" />
          
          {/* Orbital Animation */}
          <div className="absolute inset-0 animate-spin" style={{animationDuration: '10s'}}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full" />
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="mt-3 text-center">
          <div className="text-sm font-bold brand-text-gradient">SWP</div>
          <div className="text-xs text-gray-400">Enterprise</div>
        </div>
      </div>
    </div>
  )
}

export default Logo