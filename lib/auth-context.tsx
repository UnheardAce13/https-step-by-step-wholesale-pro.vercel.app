/**
 * S.B.S.W.P 2.0 - AUTHENTICATION CONTEXT
 * Enterprise-grade authentication with advanced security features
 */

'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  User, 
  AuthContextType, 
  AuthState, 
  SignUpData, 
  SignInData, 
  ForgotPasswordData, 
  ResetPasswordData,
  UpdateProfileData,
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  UserStatus,
  SubscriptionTier
} from './auth-types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
  })

  const supabase = createClientComponentClient()

  // Helper function to transform Supabase user to our User interface
  const transformUser = useCallback(async (supabaseUser: any): Promise<User | null> => {
    if (!supabaseUser) return null

    // Fetch additional user data from our profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    const user: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      username: profile?.username,
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      fullName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
      avatar: profile?.avatar_url,
      phone: profile?.phone,
      role: profile?.role || UserRole.GUEST,
      status: profile?.status || UserStatus.ACTIVE,
      subscription: profile?.subscription_tier || SubscriptionTier.FREE,
      permissions: ROLE_PERMISSIONS[profile?.role || UserRole.GUEST] || [],
      profile: {
        bio: profile?.bio,
        company: profile?.company,
        website: profile?.website,
        linkedin: profile?.linkedin,
        location: {
          city: profile?.city,
          state: profile?.state,
          country: profile?.country,
          timezone: profile?.timezone
        },
        experience: {
          yearsInRealEstate: profile?.years_in_real_estate || 0,
          specializations: profile?.specializations || [],
          totalDeals: profile?.total_deals || 0,
          totalVolume: profile?.total_volume || 0
        },
        preferences: {
          investmentTypes: profile?.investment_types || [],
          priceRange: profile?.price_range || [0, 1000000],
          locations: profile?.preferred_locations || [],
          communicationStyle: profile?.communication_style || 'email',
          marketingOptIn: profile?.marketing_opt_in || false
        }
      },
      settings: {
        theme: profile?.theme || 'system',
        language: profile?.language || 'en',
        notifications: {
          email: profile?.email_notifications ?? true,
          push: profile?.push_notifications ?? true,
          sms: profile?.sms_notifications ?? false,
          marketing: profile?.marketing_notifications ?? false
        },
        privacy: {
          profileVisible: profile?.profile_visible ?? true,
          contactInfoVisible: profile?.contact_info_visible ?? false,
          activityVisible: profile?.activity_visible ?? false
        },
        dashboard: {
          layout: profile?.dashboard_layout || 'default',
          widgets: profile?.dashboard_widgets || [],
          defaultView: profile?.default_view || 'overview'
        }
      },
      verification: {
        emailVerified: supabaseUser.email_confirmed_at != null,
        phoneVerified: profile?.phone_verified || false,
        identityVerified: profile?.identity_verified || false,
        businessVerified: profile?.business_verified || false,
        licenseVerified: profile?.license_verified || false,
        documents: profile?.verification_documents || []
      },
      security: {
        twoFactorEnabled: profile?.two_factor_enabled || false,
        loginAttempts: profile?.login_attempts || 0,
        lastPasswordChange: new Date(profile?.last_password_change || supabaseUser.created_at),
        securityQuestions: profile?.security_questions || [],
        trustedDevices: profile?.trusted_devices || [],
        activeSessions: profile?.active_sessions || []
      },
      metadata: {
        source: profile?.source || 'direct',
        referrer: profile?.referrer,
        onboardingCompleted: profile?.onboarding_completed || false,
        tourCompleted: profile?.tour_completed || false,
        lastFeatureUpdate: profile?.last_feature_update || '',
        experimentGroups: profile?.experiment_groups || [],
        customFields: profile?.custom_fields || {}
      },
      createdAt: new Date(supabaseUser.created_at),
      updatedAt: new Date(profile?.updated_at || supabaseUser.updated_at),
      lastLoginAt: profile?.last_login_at ? new Date(profile.last_login_at) : undefined
    }

    return user
  }, [supabase])

  // Load user on mount
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setState(prev => ({
            ...prev,
            loading: false,
            error: error.message
          }))
          return
        }

        if (session?.user) {
          const user = await transformUser(session.user)
          setState({
            user,
            loading: false,
            error: null,
            isAuthenticated: !!user
          })
        } else {
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false
          })
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setState({
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred',
          isAuthenticated: false
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = await transformUser(session.user)
          setState({
            user,
            loading: false,
            error: null,
            isAuthenticated: !!user
          })
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, transformUser])

  const signUp = useCallback(async (data: SignUpData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            company: data.company,
            phone: data.phone,
            referralCode: data.referralCode
          }
        }
      })

      if (authError) {
        setState(prev => ({ ...prev, loading: false, error: authError.message }))
        return { success: false, error: authError.message }
      }

      if (authData.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            role: data.role,
            company: data.company,
            referral_code: data.referralCode,
            marketing_opt_in: data.agreeToMarketing || false,
            status: UserStatus.PENDING,
            subscription_tier: SubscriptionTier.FREE,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Don't fail the signup for profile creation errors
        }

        setState(prev => ({ ...prev, loading: false }))
        return { success: true }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: false, error: 'Unknown error occurred' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [supabase])

  const signIn = useCallback(async (data: SignInData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      if (authData.user) {
        // Update last login time
        await supabase
          .from('profiles')
          .update({ 
            last_login_at: new Date().toISOString(),
            login_attempts: 0 
          })
          .eq('id', authData.user.id)

        const user = await transformUser(authData.user)
        setState({
          user,
          loading: false,
          error: null,
          isAuthenticated: !!user
        })
        return { success: true }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: false, error: 'Login failed' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [supabase, transformUser])

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      await supabase.auth.signOut()
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      })
    } catch (error) {
      console.error('Error signing out:', error)
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      }))
    }
  }, [supabase])

  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      setState(prev => ({ ...prev, loading: false }))

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [supabase])

  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      setState(prev => ({ ...prev, loading: false }))

      if (error) {
        return { success: false, error: error.message }
      }

      // Update last password change
      if (state.user) {
        await supabase
          .from('profiles')
          .update({ 
            last_password_change: new Date().toISOString() 
          })
          .eq('id', state.user.id)
      }

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [supabase, state.user])

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      if (!state.user) {
        return { success: false, error: 'User not authenticated' }
      }

      setState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          bio: data.bio,
          company: data.company,
          website: data.website,
          linkedin: data.linkedin,
          city: data.location?.city,
          state: data.location?.state,
          country: data.location?.country,
          timezone: data.location?.timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id)

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      // Refresh user data
      await refreshUser()
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [supabase, state.user])

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        setState(prev => ({ ...prev, user: null, isAuthenticated: false }))
        return
      }

      const transformedUser = await transformUser(user)
      setState(prev => ({ 
        ...prev, 
        user: transformedUser,
        isAuthenticated: !!transformedUser 
      }))
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }, [supabase, transformUser])

  const hasPermission = useCallback((permission: Permission) => {
    return state.user?.permissions.includes(permission) || false
  }, [state.user])

  const hasRole = useCallback((role: UserRole) => {
    return state.user?.role === role
  }, [state.user])

  const canAccessRoute = useCallback((route: string) => {
    if (!state.user) return false

    // Define route permissions
    const routePermissions: Record<string, Permission[]> = {
      '/admin': [Permission.SYSTEM_SETTINGS],
      '/admin/agents': [Permission.VIEW_AGENTS],
      '/admin/deals': [Permission.VIEW_DEALS],
      '/admin/crm': [Permission.VIEW_CRM],
      '/admin/analytics': [Permission.VIEW_ANALYTICS],
      '/dashboard': [Permission.VIEW_PROPERTIES],
      '/properties': [Permission.VIEW_PROPERTIES],
      '/deals': [Permission.VIEW_DEALS],
      '/agents': [Permission.VIEW_AGENTS],
      '/crm': [Permission.VIEW_CRM]
    }

    const requiredPermissions = routePermissions[route]
    if (!requiredPermissions) return true // No specific permissions required

    return requiredPermissions.some(permission => hasPermission(permission))
  }, [state.user, hasPermission])

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile,
    refreshUser,
    hasPermission,
    hasRole,
    canAccessRoute
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}