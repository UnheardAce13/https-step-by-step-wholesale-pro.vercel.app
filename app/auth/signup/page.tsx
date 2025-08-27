"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { SignUpData, SignUpSchema, UserRole, ROLE_INFO } from '@/lib/auth-types'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Eye, EyeOff, Lock, Mail, User, Phone, Building, ArrowRight, 
  Shield, Zap, TrendingUp, Users, Target, Sparkles, Brain, 
  Home, Star, CheckCircle, Crown, Briefcase, UserCheck
} from "lucide-react"
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: UserRole.INVESTOR,
    company: '',
    referralCode: '',
    agreeToTerms: false,
    agreeToMarketing: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signUp, loading } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: keyof SignUpData, value: string | boolean | UserRole) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (stepNumber: number) => {
    const stepFields = {
      1: ['role'],
      2: ['firstName', 'lastName', 'email', 'phone'],
      3: ['password', 'confirmPassword', 'agreeToTerms']
    }

    try {
      const fieldsToValidate = stepFields[stepNumber as keyof typeof stepFields]
      const stepData = Object.fromEntries(
        fieldsToValidate.map(field => [field, formData[field as keyof SignUpData]])
      )
      
      // Create a partial schema for step validation
      const stepSchema = SignUpSchema.pick(
        Object.fromEntries(fieldsToValidate.map(field => [field, true])) as any
      )
      
      stepSchema.parse(stepData)
      setErrors({})
      return true
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        if (err.path) {
          fieldErrors[err.path[0]] = err.message
        }
      })
      setErrors(fieldErrors)
      return false
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      SignUpSchema.parse(formData)
      setErrors({})
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        if (err.path) {
          fieldErrors[err.path[0]] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)
    const result = await signUp(formData)
    
    if (result.success) {
      router.push('/auth/verify-email')
    } else {
      setErrors({ submit: result.error || 'Signup failed' })
    }
    setIsSubmitting(false)
  }

  const roleOptions = [
    {
      role: UserRole.INVESTOR,
      ...ROLE_INFO[UserRole.INVESTOR],
      icon: <TrendingUp className="h-6 w-6" />,
      popular: true,
      benefits: ['Property Analysis', 'Deal Flow', 'Market Insights']
    },
    {
      role: UserRole.WHOLESALER,
      ...ROLE_INFO[UserRole.WHOLESALER],
      icon: <Home className="h-6 w-6" />,
      popular: false,
      benefits: ['Lead Management', 'Contract Tools', 'Agent Network']
    },
    {
      role: UserRole.AGENT,
      ...ROLE_INFO[UserRole.AGENT],
      icon: <Users className="h-6 w-6" />,
      popular: false,
      benefits: ['CRM System', 'Client Management', 'Commission Tracking']
    }
  ]

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Choose Your Role</h3>
              <p className="text-gray-400">Select the option that best describes your real estate goals</p>
            </div>

            <div className="space-y-4">
              {roleOptions.map((option) => (
                <motion.div
                  key={option.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: roleOptions.indexOf(option) * 0.1 }}
                  onClick={() => handleInputChange('role', option.role)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    formData.role === option.role
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-4">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      formData.role === option.role
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {option.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{option.label}</h4>
                        {formData.role === option.role && (
                          <CheckCircle className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-gray-400 mb-3">{option.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {option.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-white/20 text-gray-300">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {errors.role && (
              <p className="text-red-400 text-sm text-center">{errors.role}</p>
            )}
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Personal Information</h3>
              <p className="text-gray-400">Tell us about yourself to personalize your experience</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
                {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
                {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
              {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-white">Company (Optional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="company"
                  placeholder="Your Company Name"
                  value={formData.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-white">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                placeholder="Enter referral code"
                value={formData.referralCode || ''}
                onChange={(e) => handleInputChange('referralCode', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Secure Your Account</h3>
              <p className="text-gray-400">Create a strong password to protect your account</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                  className="border-white/20 data-[state=checked]:bg-blue-500 mt-0.5"
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-300 leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>}

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToMarketing"
                  checked={formData.agreeToMarketing}
                  onCheckedChange={(checked) => handleInputChange('agreeToMarketing', !!checked)}
                  className="border-white/20 data-[state=checked]:bg-blue-500 mt-0.5"
                />
                <Label htmlFor="agreeToMarketing" className="text-sm text-gray-300 leading-relaxed">
                  I'd like to receive marketing emails about new features and opportunities
                </Label>
              </div>
            </div>

            {errors.submit && (
              <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold sbswp-holographic-text">S.B.S.W.P 2.0</h1>
              <p className="text-sm text-gray-400">Step-By-Step Wholesale Pro</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Join the Future of Real Estate</h2>
          <p className="text-gray-400">Create your account and start building your real estate empire</p>
        </motion.div>

        {/* PROGRESS INDICATOR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-20 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Choose Role</span>
            <span>Personal Info</span>
            <span>Security</span>
          </div>
        </motion.div>

        {/* FORM CARD */}
        <Card className="sbswp-quantum-card border-0 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-8">
            <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
              {renderStepContent()}

              {/* NAVIGATION BUTTONS */}
              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 sbswp-neural-button"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="flex-1 sbswp-neural-button"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Sparkles className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* LOGIN LINK */}
            <div className="text-center pt-6 border-t border-white/10 mt-6">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* TRUST INDICATORS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Bank-level Security</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <UserCheck className="h-4 w-4 text-blue-400" />
            <span>Trusted by 10K+ Users</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Crown className="h-4 w-4 text-yellow-400" />
            <span>Premium Platform</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}