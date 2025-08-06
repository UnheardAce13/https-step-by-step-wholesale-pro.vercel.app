"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  Shield, 
  Users, 
  Building2, 
  TrendingUp, 
  Code, 
  Calendar,
  Copy,
  Eye,
  Settings,
  BarChart3,
  UserPlus,
  Key,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

interface AccessCode {
  id: string
  code: string
  type: "wholesaler" | "investor"
  expiryDays: number
  createdAt: string
  expiresAt: string
  isActive: boolean
  usedBy?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([])
  const [newCodeType, setNewCodeType] = useState<"wholesaler" | "investor">("wholesaler")
  const [newCodeDays, setNewCodeDays] = useState<number>(30)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Load existing codes from localStorage
    const savedCodes = localStorage.getItem("adminAccessCodes")
    if (savedCodes) {
      setAccessCodes(JSON.parse(savedCodes))
    }
  }, [])

  const generateAccessCode = async () => {
    if (newCodeDays < 1 || newCodeDays > 90) {
      toast.error("Code duration must be between 1 and 90 days")
      return
    }

    setIsGenerating(true)

    try {
      // Generate a unique code
      const code = `${newCodeType.toUpperCase()}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase()
      
      const now = new Date()
      const expiresAt = new Date(now.getTime() + (newCodeDays * 24 * 60 * 60 * 1000))

      const newCode: AccessCode = {
        id: Date.now().toString(),
        code,
        type: newCodeType,
        expiryDays: newCodeDays,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true
      }

      const updatedCodes = [...accessCodes, newCode]
      setAccessCodes(updatedCodes)
      localStorage.setItem("adminAccessCodes", JSON.stringify(updatedCodes))

      toast.success(`${newCodeType} access code generated successfully`)

      // Reset form
      setNewCodeDays(30)
    } catch (error) {
      toast.error("Failed to generate access code")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Access code copied to clipboard")
  }

  const deactivateCode = (codeId: string) => {
    const updatedCodes = accessCodes.map(code => 
      code.id === codeId ? { ...code, isActive: false } : code
    )
    setAccessCodes(updatedCodes)
    localStorage.setItem("adminAccessCodes", JSON.stringify(updatedCodes))
    
    toast.success("Access code deactivated")
  }

  const isExpired = (expiresAt: string) => {
    return new Date() > new Date(expiresAt)
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()
    
    if (diff <= 0) return "Expired"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">WholesalePro SaaS Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Button onClick={() => router.push("/")} variant="outline">
                Back to Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-100" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-100">Total Codes</p>
                  <p className="text-2xl font-bold">{accessCodes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-green-100" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-100">Wholesaler Codes</p>
                  <p className="text-2xl font-bold">
                    {accessCodes.filter(c => c.type === "wholesaler").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-100" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-100">Investor Codes</p>
                  <p className="text-2xl font-bold">
                    {accessCodes.filter(c => c.type === "investor").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Key className="h-8 w-8 text-orange-100" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-100">Active Codes</p>
                  <p className="text-2xl font-bold">
                    {accessCodes.filter(c => c.isActive && !isExpired(c.expiresAt)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator">Code Generator</TabsTrigger>
            <TabsTrigger value="codes">Manage Codes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System Management</TabsTrigger>
          </TabsList>

          {/* Code Generator Tab */}
          <TabsContent value="generator">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Access Code Generator</span>
                </CardTitle>
                <CardDescription>
                  Generate access codes for wholesalers and investors (1-90 days validity)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="codeType">Access Type</Label>
                    <Select value={newCodeType} onValueChange={(value: "wholesaler" | "investor") => setNewCodeType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wholesaler">Wholesaler Access</SelectItem>
                        <SelectItem value="investor">Investor Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codeDays">Validity (Days)</Label>
                    <Input
                      id="codeDays"
                      type="number"
                      min="1"
                      max="90"
                      value={newCodeDays}
                      onChange={(e) => setNewCodeDays(parseInt(e.target.value) || 30)}
                      placeholder="Enter days (1-90)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button 
                      onClick={generateAccessCode} 
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      {isGenerating ? "Generating..." : "Generate Code"}
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">How to Use Generated Codes:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Share the generated code with users</li>
                    <li>• Users enter the code during registration</li>
                    <li>• Codes automatically grant access to the specified section</li>
                    <li>• Codes expire after the set duration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Codes Tab */}
          <TabsContent value="codes">
            <Card>
              <CardHeader>
                <CardTitle>Access Codes Management</CardTitle>
                <CardDescription>
                  View and manage all generated access codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessCodes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No access codes generated yet. Use the Code Generator to create some.
                    </div>
                  ) : (
                    accessCodes.map((code) => (
                      <div key={code.id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant={code.type === "wholesaler" ? "default" : "secondary"}>
                              {code.type}
                            </Badge>
                            <Badge variant={code.isActive && !isExpired(code.expiresAt) ? "default" : "destructive"}>
                              {code.isActive && !isExpired(code.expiresAt) ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {getTimeRemaining(code.expiresAt)} remaining
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-3 py-2 rounded font-mono text-sm flex-1">
                            {code.code}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(code.code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {code.isActive && !isExpired(code.expiresAt) && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deactivateCode(code.id)}
                            >
                              Deactivate
                            </Button>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 grid grid-cols-2 gap-4">
                          <div>Created: {new Date(code.createdAt).toLocaleDateString()}</div>
                          <div>Expires: {new Date(code.expiresAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Code Usage Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Generated:</span>
                      <span className="font-bold">{accessCodes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currently Active:</span>
                      <span className="font-bold text-green-600">
                        {accessCodes.filter(c => c.isActive && !isExpired(c.expiresAt)).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expired:</span>
                      <span className="font-bold text-red-600">
                        {accessCodes.filter(c => isExpired(c.expiresAt)).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/wholesaler">
                      <Building2 className="h-4 w-4 mr-2" />
                      View Wholesaler Dashboard
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/investor">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Investor Dashboard
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/test-platform">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Test Platform
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Management Tab */}
          <TabsContent value="system">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Monitor the overall health and performance of the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/dashboard/system-health">
                      <Activity className="h-4 w-4 mr-2" />
                      View System Health
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts, roles, and permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/dashboard/users">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                  <CardDescription>Configure API keys, integrations, and system settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/config">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Platform
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reporting</CardTitle>
                  <CardDescription>Access platform usage statistics and reports.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/dashboard/analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Notifications</CardTitle>
                  <CardDescription>Manage system alerts and notification settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/dashboard/alerts">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Manage Alerts
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Promotional Codes</CardTitle>
                  <CardDescription>Create and manage promotional codes for subscriptions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/dashboard/promo-codes">
                      <Code className="h-4 w-4 mr-2" />
                      Manage Promo Codes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

