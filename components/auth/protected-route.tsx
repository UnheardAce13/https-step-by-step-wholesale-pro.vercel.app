"use client"

import { useAuth } from '@/lib/auth-context'
import { UserRole, Permission } from '@/lib/auth-types'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, Lock, AlertTriangle, Home, TrendingUp, Users, 
  ArrowRight, Settings, Eye
} from "lucide-react"
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  requiredPermissions?: Permission[]
  fallbackPath?: string
  showFallback?: boolean
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath,
  showFallback = true
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, hasRole, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const currentPath = window.location.pathname
      router.push(`/auth/login?returnUrl=${encodeURIComponent(currentPath)}`)
    }
  }, [loading, isAuthenticated, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Loading...</h3>
          <p className="text-gray-400">Verifying your access permissions</p>
        </motion.div>
      </div>
    )
  }

  // User not authenticated
  if (!isAuthenticated || !user) {
    return null // Router will handle redirect
  }

  // Check role requirements
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some(role => hasRole(role))
  
  // Check permission requirements  
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission))

  // User doesn't have required access
  if (!hasRequiredRole || !hasRequiredPermissions) {
    if (fallbackPath) {
      router.push(fallbackPath)
      return null
    }

    if (!showFallback) {
      return null
    }

    // Show access denied page
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="sbswp-quantum-card border-0 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-gray-400 text-lg">
                  You don't have permission to access this area
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="bg-white/5 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Current Access Level</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Role:</span>
                      <span className="text-white font-medium capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-emerald-400 font-medium capitalize">
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Subscription:</span>
                      <span className="text-purple-400 font-medium capitalize">
                        {user.subscription.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {requiredRoles.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                      <span className="text-orange-400 font-medium">Required Role(s):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {requiredRoles.map((role, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm capitalize"
                        >
                          {role.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {requiredPermissions.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Required Permission(s):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {requiredPermissions.map((permission, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm"
                        >
                          {permission.replace('_', ' ').toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    asChild
                    className="sbswp-neural-button"
                  >
                    <Link href="/dashboard">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Link href="/pricing">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3">
                    Need higher access? Contact your administrator or upgrade your plan.
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Link href="/contact">
                      <Users className="h-4 w-4 mr-2" />
                      Contact Support
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // User has required access, render children
  return <>{children}</>
}

// Convenience components for common access patterns
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
      {children}
    </ProtectedRoute>
  )
}

export function WholesalerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.WHOLESALER]}>
      {children}
    </ProtectedRoute>
  )
}

export function AgentRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.WHOLESALER, UserRole.AGENT]}>
      {children}
    </ProtectedRoute>
  )
}

export function InvestorRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.WHOLESALER, UserRole.INVESTOR, UserRole.AGENT]}>
      {children}
    </ProtectedRoute>
  )
}

// Hook for checking permissions in components
export function usePermissions() {
  const { hasPermission, hasRole, user } = useAuth()
  
  return {
    hasPermission,
    hasRole,
    canView: (permission: Permission) => hasPermission(permission),
    canEdit: (permission: Permission) => hasPermission(permission),
    canDelete: (permission: Permission) => hasPermission(permission),
    isAdmin: () => hasRole(UserRole.ADMIN),
    isWholesaler: () => hasRole(UserRole.WHOLESALER),
    isInvestor: () => hasRole(UserRole.INVESTOR),
    isAgent: () => hasRole(UserRole.AGENT),
    user
  }
}