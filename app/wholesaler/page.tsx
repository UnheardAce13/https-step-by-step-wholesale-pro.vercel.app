"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Zap, 
  MessageSquare,
  BarChart3,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

export default function WholesalerDashboardPage() {
  // Mock data - would come from API in real implementation
  const stats = {
    totalLeads: 142,
    qualifiedLeads: 38,
    activeDeals: 12,
    monthlyRevenue: 45000,
    smsUsed: 1250,
    smsLimit: 2500
  }

  const aiAgents = [
    { name: "Zikk", status: "active", description: "Lead Capture", processed: 45 },
    { name: "Huntz", status: "active", description: "Property Search", processed: 23 },
    { name: "Automatz", status: "active", description: "Lead Nurturing", processed: 67 },
    { name: "Rezz", status: "active", description: "CRM Management", processed: 89 },
    { name: "Pipz", status: "active", description: "Pipeline Triggers", processed: 34 },
    { name: "Vetzz", status: "active", description: "Contract Review", processed: 12 }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wholesaler Dashboard</h1>
          <p className="text-gray-600">Manage your wholesale empire with AI-powered automation</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          Add New Property
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeals}</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Agents Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Agents Status
          </CardTitle>
          <CardDescription>Your AI-powered automation suite is working 24/7</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiAgents.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-gray-600">{agent.description}</div>
                </div>
                <div className="text-right">
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                  <div className="text-sm text-gray-500">{agent.processed} processed</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SMS Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Usage
          </CardTitle>
          <CardDescription>Track your monthly SMS consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: {stats.smsUsed}</span>
              <span>Limit: {stats.smsLimit}</span>
            </div>
            <Progress value={(stats.smsUsed / stats.smsLimit) * 100} className="h-2" />
            <p className="text-xs text-gray-500">
              {stats.smsLimit - stats.smsUsed} messages remaining this month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Original Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Properties</CardTitle>
            <CardDescription>View and manage your listed properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/wholesaler/properties">View Properties</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Deal</CardTitle>
            <CardDescription>Create a new property listing or deal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/wholesaler/new-deal">Create New Deal</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offers Received</CardTitle>
            <CardDescription>Review offers from investors on your properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/wholesaler/offers">View Offers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
