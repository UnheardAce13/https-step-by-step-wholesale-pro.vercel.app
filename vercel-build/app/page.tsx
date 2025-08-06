"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Users, MessageSquare, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    trialCode: "",
    userType: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const aiTeamMembers = [
    {
      name: "Zikk",
      role: "Lead Capture & Qualification",
      description: "Captures and qualifies leads with 70% ARV accuracy for Zillow and Redfin for matching properties",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      name: "Automatz",
      role: "Lead Nurturing", 
      description: "Automated SMS/email sequences via Telnyx integration",
      icon: MessageSquare,
      color: "bg-purple-500"
    },
    {
      name: "Huntz",
      role: "Deal Analysis",
      description: "Centralized CRM for complete deal flow tracking",
      icon: TrendingUp,
      color: "bg-green-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hidden Admin Access */}
      <div className="absolute top-4 right-4 opacity-20 hover:opacity-100 transition-opacity">
        <Link href="/admin" className="text-xs text-slate-400 hover:text-white">
          Admin
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto">
          
          {/* Left Side - AI Team */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Meet Your AI Team
              </h1>
              <p className="text-xl text-slate-300">
                Six powerful AI agents working 24/7 to revolutionize your wholesale business
              </p>
            </div>

            <div className="space-y-6">
              {aiTeamMembers.map((member, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`${member.color} p-3 rounded-full`}>
                        <member.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {member.name}
                        </h3>
                        <p className="text-blue-400 text-sm font-medium mb-2">
                          {member.role}
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {member.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center lg:text-left">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <Zap className="h-3 w-3 mr-1" />
                2.3 days average deal time
              </Badge>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md bg-slate-800/80 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Join the Revolution
                  </h2>
                  <p className="text-slate-300 text-sm">
                    Create your account to start revolutionizing your wholesale business
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={formData.userType === "investor" ? "default" : "outline"}
                      className={`flex-1 ${
                        formData.userType === "investor" 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => handleInputChange("userType", "investor")}
                    >
                      Investor
                    </Button>
                    <Button
                      type="button"
                      variant={formData.userType === "wholesaler" ? "default" : "outline"}
                      className={`flex-1 ${
                        formData.userType === "wholesaler" 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => handleInputChange("userType", "wholesaler")}
                    >
                      Wholesaler
                    </Button>
                    <Link href="/login" className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-300">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-300">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Minimum 7 letters and 2 numbers required
                    </p>
                  </div>

                  {/* Trial Code */}
                  <div className="space-y-2">
                    <Label htmlFor="trialCode" className="text-slate-300">
                      Trial Code (Optional)
                    </Label>
                    <Input
                      id="trialCode"
                      type="text"
                      value={formData.trialCode}
                      onChange={(e) => handleInputChange("trialCode", e.target.value)}
                      placeholder="Enter promotional code"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
                    disabled={!formData.userType}
                  >
                    Start Your Journey
                  </Button>
                </form>

                {/* Registration Features */}
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Registration Features:</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Investment criteria setup (price range, locations)</li>
                    <li>• Trial code system for promotional access</li>
                    <li>• Password validation (7+ letters, 2+ numbers)</li>
                    <li>• Password visibility toggle with eye icons</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

