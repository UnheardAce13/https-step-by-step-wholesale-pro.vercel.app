import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/api/health', '/api/stripe/webhook', '/api/sms/webhook', '/api/docusign/webhook']
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/test'))

  // Allow public routes
  if (isPublicRoute) {
    return res
  }

  // Redirect to login if no session
  if (!session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control
  const userRole = session.user?.user_metadata?.role

  // Admin routes - only accessible by admin users
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Wholesaler routes - only accessible by wholesalers
  if (pathname.startsWith('/wholesaler')) {
    if (userRole !== 'wholesaler' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Investor routes - only accessible by investors
  if (pathname.startsWith('/investor')) {
    if (userRole !== 'investor' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // API route protection
  if (pathname.startsWith('/api/')) {
    // Admin API routes
    if (pathname.startsWith('/api/admin/') && userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Wholesaler API routes
    if (pathname.startsWith('/api/wholesaler/') && userRole !== 'wholesaler' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Investor API routes
    if (pathname.startsWith('/api/investor/') && userRole !== 'investor' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  }

  return res
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}