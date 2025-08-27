/**
 * S.B.S.W.P 2.0 - ADVANCED AUTHENTICATION SYSTEM
 * Comprehensive multi-role authentication with enterprise-grade security
 * Surpasses all competition with advanced role-based access control
 */

import { z } from 'zod'

// USER ROLES AND PERMISSIONS
export enum UserRole {
  ADMIN = 'admin',
  WHOLESALER = 'wholesaler', 
  INVESTOR = 'investor',
  AGENT = 'agent',
  VENDOR = 'vendor',
  GUEST = 'guest'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
  PLATINUM = 'platinum'
}

export enum Permission {
  // Property Management
  VIEW_PROPERTIES = 'view_properties',
  CREATE_PROPERTIES = 'create_properties',
  EDIT_PROPERTIES = 'edit_properties',
  DELETE_PROPERTIES = 'delete_properties',
  
  // Deal Management
  VIEW_DEALS = 'view_deals',
  CREATE_DEALS = 'create_deals',
  EDIT_DEALS = 'edit_deals',
  DELETE_DEALS = 'delete_deals',
  CLOSE_DEALS = 'close_deals',
  
  // Agent Management
  VIEW_AGENTS = 'view_agents',
  MANAGE_AGENTS = 'manage_agents',
  ASSIGN_LEADS = 'assign_leads',
  
  // CRM Access
  VIEW_CRM = 'view_crm',
  MANAGE_CONTACTS = 'manage_contacts',
  VIEW_REPORTS = 'view_reports',
  
  // Financial
  VIEW_FINANCIALS = 'view_financials',
  MANAGE_BILLING = 'manage_billing',
  
  // Admin Functions
  MANAGE_USERS = 'manage_users',
  SYSTEM_SETTINGS = 'system_settings',
  VIEW_ANALYTICS = 'view_analytics'
}

// USER INTERFACES
export interface User {
  id: string
  email: string
  username?: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  phone?: string
  role: UserRole
  status: UserStatus
  subscription: SubscriptionTier
  permissions: Permission[]
  profile: UserProfile
  settings: UserSettings
  verification: UserVerification
  security: SecuritySettings
  metadata: UserMetadata
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface UserProfile {
  bio?: string
  company?: string
  website?: string
  linkedin?: string
  location: {
    city?: string
    state?: string
    country?: string
    timezone?: string
  }
  experience: {
    yearsInRealEstate: number
    specializations: string[]
    totalDeals: number
    totalVolume: number
  }
  preferences: {
    investmentTypes: string[]
    priceRange: [number, number]
    locations: string[]
    communicationStyle: 'email' | 'sms' | 'phone' | 'all'
    marketingOptIn: boolean
  }
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    marketing: boolean
  }
  privacy: {
    profileVisible: boolean
    contactInfoVisible: boolean
    activityVisible: boolean
  }
  dashboard: {
    layout: string
    widgets: string[]
    defaultView: string
  }
}

export interface UserVerification {
  emailVerified: boolean
  phoneVerified: boolean
  identityVerified: boolean
  businessVerified: boolean
  licenseVerified: boolean
  documents: VerificationDocument[]
}

export interface VerificationDocument {
  id: string
  type: 'identity' | 'business' | 'license' | 'insurance' | 'financial'
  status: 'pending' | 'approved' | 'rejected'
  url: string
  uploadedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  notes?: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  loginAttempts: number
  lastPasswordChange: Date
  securityQuestions: SecurityQuestion[]
  trustedDevices: TrustedDevice[]
  activeSessions: ActiveSession[]
}

export interface SecurityQuestion {
  question: string
  answer: string // hashed
  createdAt: Date
}

export interface TrustedDevice {
  id: string
  name: string
  deviceType: string
  browser: string
  location: string
  addedAt: Date
  lastUsed: Date
}

export interface ActiveSession {
  id: string
  deviceInfo: string
  ipAddress: string
  location: string
  createdAt: Date
  lastActivity: Date
}

export interface UserMetadata {
  source: string
  referrer?: string
  onboardingCompleted: boolean
  tourCompleted: boolean
  lastFeatureUpdate: string
  experimentGroups: string[]
  customFields: Record<string, any>
}

// AUTHENTICATION SCHEMAS
export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  company: z.string().optional(),
  referralCode: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  agreeToMarketing: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
  twoFactorCode: z.string().optional()
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  company: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    timezone: z.string().optional()
  }).optional()
})

// ROLE-BASED PERMISSIONS
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW_PROPERTIES,
    Permission.CREATE_PROPERTIES,
    Permission.EDIT_PROPERTIES,
    Permission.DELETE_PROPERTIES,
    Permission.VIEW_DEALS,
    Permission.CREATE_DEALS,
    Permission.EDIT_DEALS,
    Permission.DELETE_DEALS,
    Permission.CLOSE_DEALS,
    Permission.VIEW_AGENTS,
    Permission.MANAGE_AGENTS,
    Permission.ASSIGN_LEADS,
    Permission.VIEW_CRM,
    Permission.MANAGE_CONTACTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_FINANCIALS,
    Permission.MANAGE_BILLING,
    Permission.MANAGE_USERS,
    Permission.SYSTEM_SETTINGS,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.WHOLESALER]: [
    Permission.VIEW_PROPERTIES,
    Permission.CREATE_PROPERTIES,
    Permission.EDIT_PROPERTIES,
    Permission.VIEW_DEALS,
    Permission.CREATE_DEALS,
    Permission.EDIT_DEALS,
    Permission.CLOSE_DEALS,
    Permission.VIEW_AGENTS,
    Permission.ASSIGN_LEADS,
    Permission.VIEW_CRM,
    Permission.MANAGE_CONTACTS,
    Permission.VIEW_REPORTS
  ],
  [UserRole.INVESTOR]: [
    Permission.VIEW_PROPERTIES,
    Permission.VIEW_DEALS,
    Permission.CREATE_DEALS,
    Permission.VIEW_AGENTS,
    Permission.VIEW_CRM,
    Permission.VIEW_REPORTS
  ],
  [UserRole.AGENT]: [
    Permission.VIEW_PROPERTIES,
    Permission.CREATE_PROPERTIES,
    Permission.EDIT_PROPERTIES,
    Permission.VIEW_DEALS,
    Permission.CREATE_DEALS,
    Permission.EDIT_DEALS,
    Permission.VIEW_CRM,
    Permission.MANAGE_CONTACTS
  ],
  [UserRole.VENDOR]: [
    Permission.VIEW_PROPERTIES,
    Permission.VIEW_DEALS,
    Permission.VIEW_CRM
  ],
  [UserRole.GUEST]: [
    Permission.VIEW_PROPERTIES
  ]
}

// SUBSCRIPTION TIER LIMITS
export const SUBSCRIPTION_LIMITS = {
  [SubscriptionTier.FREE]: {
    maxProperties: 10,
    maxDeals: 5,
    maxContacts: 100,
    maxAgents: 0,
    analyticsAccess: false,
    apiAccess: false,
    prioritySupport: false
  },
  [SubscriptionTier.BASIC]: {
    maxProperties: 50,
    maxDeals: 25,
    maxContacts: 500,
    maxAgents: 2,
    analyticsAccess: true,
    apiAccess: false,
    prioritySupport: false
  },
  [SubscriptionTier.PRO]: {
    maxProperties: 200,
    maxDeals: 100,
    maxContacts: 2000,
    maxAgents: 10,
    analyticsAccess: true,
    apiAccess: true,
    prioritySupport: true
  },
  [SubscriptionTier.ENTERPRISE]: {
    maxProperties: 1000,
    maxDeals: 500,
    maxContacts: 10000,
    maxAgents: 50,
    analyticsAccess: true,
    apiAccess: true,
    prioritySupport: true
  },
  [SubscriptionTier.PLATINUM]: {
    maxProperties: -1, // unlimited
    maxDeals: -1,
    maxContacts: -1,
    maxAgents: -1,
    analyticsAccess: true,
    apiAccess: true,
    prioritySupport: true
  }
}

// ROLE DISPLAY INFORMATION
export const ROLE_INFO = {
  [UserRole.ADMIN]: {
    label: 'Administrator',
    description: 'Full platform access and management capabilities',
    color: 'red',
    icon: 'Shield'
  },
  [UserRole.WHOLESALER]: {
    label: 'Wholesaler',
    description: 'Property acquisition and deal management specialist',
    color: 'blue',
    icon: 'Home'
  },
  [UserRole.INVESTOR]: {
    label: 'Investor',
    description: 'Investment opportunities and portfolio management',
    color: 'green',
    icon: 'TrendingUp'
  },
  [UserRole.AGENT]: {
    label: 'Real Estate Agent',
    description: 'Property listings and client relationship management',
    color: 'purple',
    icon: 'Users'
  },
  [UserRole.VENDOR]: {
    label: 'Vendor/Contractor',
    description: 'Service provider and project management',
    color: 'orange',
    icon: 'Tool'
  },
  [UserRole.GUEST]: {
    label: 'Guest',
    description: 'Limited access for browsing properties',
    color: 'gray',
    icon: 'Eye'
  }
}

// AUTHENTICATION TYPES
export type SignUpData = z.infer<typeof SignUpSchema>
export type SignInData = z.infer<typeof SignInSchema>
export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  forgotPassword: (data: ForgotPasswordData) => Promise<{ success: boolean; error?: string }>
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; error?: string }>
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: UserRole) => boolean
  canAccessRoute: (route: string) => boolean
}