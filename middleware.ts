/**
 * S.B.S.W.P 2.0 - AUTHENTICATION MIDDLEWARE
 * Advanced route protection with role-based access control
 */

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole, Permission } from './lib/auth-types'

// Protected routes configuration
const PROTECTED_ROUTES = {
  // Admin routes - require admin role
  '/admin': {
    roles: [UserRole.ADMIN],
    permissions: []
  },
  '/admin/agents': {
    roles: [UserRole.ADMIN],
    permissions: []
  },
  '/admin/deals': {
    roles: [UserRole.ADMIN],
    permissions: []
  },
  '/admin/crm': {
    roles: [UserRole.ADMIN],
    permissions: []
  },
  '/admin/analytics': {
    roles: [UserRole.ADMIN],
    permissions: []
  },
  '/admin/settings': {
    roles: [UserRole.ADMIN],
    permissions: []
  },
  
  // Dashboard - authenticated users only
  '/dashboard': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.INVESTOR, UserRole.AGENT],
    permissions: []
  },
  
  // Properties - role-based access
  '/properties': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.INVESTOR, UserRole.AGENT],
    permissions: [Permission.VIEW_PROPERTIES]
  },
  '/properties/create': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.AGENT],
    permissions: [Permission.CREATE_PROPERTIES]
  },
  
  // Deals - role-based access
  '/deals': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.INVESTOR, UserRole.AGENT],
    permissions: [Permission.VIEW_DEALS]
  },
  '/deals/create': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.AGENT],
    permissions: [Permission.CREATE_DEALS]
  },
  
  // CRM - limited access
  '/crm': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.AGENT],
    permissions: [Permission.VIEW_CRM]
  },
  
  // Agents - admin and wholesaler access
  '/agents': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER],
    permissions: [Permission.VIEW_AGENTS]
  },
  
  // Profile and settings
  '/profile': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.INVESTOR, UserRole.AGENT, UserRole.VENDOR],
    permissions: []
  },
  '/settings': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.INVESTOR, UserRole.AGENT, UserRole.VENDOR],
    permissions: []
  }
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/pricing',
  '/features'
]

// API routes that require authentication
const PROTECTED_API_ROUTES = {
  '/api/properties': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.INVESTOR, UserRole.AGENT],
    permissions: [Permission.VIEW_PROPERTIES]
  },
  '/api/deals': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.INVESTOR, UserRole.AGENT],
    permissions: [Permission.VIEW_DEALS]
  },
  '/api/agents': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER],
    permissions: [Permission.VIEW_AGENTS]
  },
  '/api/crm': {
    roles: [UserRole.ADMIN, UserRole.WHOLESALER, UserRole.AGENT],
    permissions: [Permission.VIEW_CRM]
  },
  '/api/analytics': {
    roles: [UserRole.ADMIN],
    permissions: [Permission.VIEW_ANALYTICS]
  },
  '/api/admin': {
    roles: [UserRole.ADMIN],
    permissions: []
  }
}

async function getUserProfile(userId: string, supabase: any) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, status, subscription_tier')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return profile
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

function hasRequiredRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole)
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  })
}

function getProtectedRoute(pathname: string) {
  // Check exact matches first
  if (PROTECTED_ROUTES[pathname]) {
    return PROTECTED_ROUTES[pathname]
  }
  
  // Check for partial matches
  for (const route in PROTECTED_ROUTES) {
    if (pathname.startsWith(route) && route !== '/') {
      return PROTECTED_ROUTES[route]
    }
  }
  
  return null
}

function getProtectedApiRoute(pathname: string) {
  // Check exact matches first
  if (PROTECTED_API_ROUTES[pathname]) {
    return PROTECTED_API_ROUTES[pathname]
  }
  
  // Check for partial matches
  for (const route in PROTECTED_API_ROUTES) {
    if (pathname.startsWith(route)) {
      return PROTECTED_API_ROUTES[route]
    }
  }
  
  return null
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
    }

    const isAuthenticated = !!session?.user
    const userId = session?.user?.id

    // Check if route is public
    if (isPublicRoute(pathname)) {
      // If authenticated user tries to access auth pages, redirect to dashboard
      if (isAuthenticated && pathname.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return res
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Get user profile for role checking
    const profile = await getUserProfile(userId!, supabase)
    
    if (!profile) {
      console.error('No profile found for user:', userId)
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    const userRole = profile.role as UserRole
    const userStatus = profile.status

    // Check if user account is active
    if (userStatus !== 'active') {
      return NextResponse.redirect(new URL('/auth/account-suspended', req.url))
    }

    // Check API routes
    if (pathname.startsWith('/api/')) {
      const apiRoute = getProtectedApiRoute(pathname)
      
      if (apiRoute) {
        if (!hasRequiredRole(userRole, apiRoute.roles)) {
          return new NextResponse(
            JSON.stringify({ error: 'Insufficient permissions' }),
            {
              status: 403,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
        }
      }
      
      return res
    }

    // Check protected routes
    const protectedRoute = getProtectedRoute(pathname)
    
    if (protectedRoute) {
      if (!hasRequiredRole(userRole, protectedRoute.roles)) {
        // Redirect to appropriate dashboard based on role
        const dashboards = {
          [UserRole.ADMIN]: '/admin',
          [UserRole.WHOLESALER]: '/dashboard',
          [UserRole.INVESTOR]: '/dashboard',
          [UserRole.AGENT]: '/dashboard',
          [UserRole.VENDOR]: '/dashboard'
        }
        
        const redirectPath = dashboards[userRole] || '/dashboard'
        return NextResponse.redirect(new URL(redirectPath, req.url))
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}