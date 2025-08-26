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
  CheckCircle,
  DollarSign,
  Target,
  Brain,
  Rocket,
  Eye,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Activity,
  Sparkles,
  Shield
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
    smsLimit: 2500,
    conversionRate: 26.8,
    avgDealValue: 3750
  }

  const aiAgents = [
    { name: "Zikk AI", status: "active", description: "Lead Capture & Qualification", processed: 45, efficiency: 98 },
    { name: "Huntz Pro", status: "active", description: "Property Discovery Engine", processed: 23, efficiency: 94 },
    { name: "Automatz", status: "active", description: "Smart Lead Nurturing", processed: 67, efficiency: 96 },
    { name: "Rezz CRM", status: "active", description: "Deal Management Suite", processed: 89, efficiency: 99 },
    { name: "Pipz Flow", status: "active", description: "Pipeline Automation", processed: 34, efficiency: 92 },
    { name: "Vetzz Legal", status: "active", description: "Contract Intelligence", processed: 12, efficiency: 97 }
  ]

  const recentDeals = [
    { id: 1, address: "123 Oak Street", status: "Under Contract", value: 4200, investor: "Mike Chen" },
    { id: 2, address: "456 Pine Avenue", status: "Negotiating", value: 3800, investor: "Sarah Kim" },
    { id: 3, address: "789 Elm Drive", status: "New Lead", value: 5100, investor: "Pending" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Wholesaler Command Center
              </h1>
              <p className="text-gray-400">AI-powered empire management at your fingertips</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg" asChild>
            <Link href="/wholesaler/new-deal" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              New Deal
            </Link>
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
            <Link href="/wholesaler/properties">View All</Link>
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border-blue-400/30 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Leads</CardTitle>
            <div className="p-2 rounded-full bg-blue-500/20">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{stats.totalLeads}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              <p className="text-xs text-emerald-400 font-medium">+12% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-400/30 backdrop-blur-xl hover:border-emerald-400/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Qualified Leads</CardTitle>
            <div className="p-2 rounded-full bg-emerald-500/20">
              <Target className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">{stats.qualifiedLeads}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              <p className="text-xs text-emerald-400 font-medium">+8% conversion rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-purple-400/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Deals</CardTitle>
            <div className="p-2 rounded-full bg-purple-500/20">
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">{stats.activeDeals}</div>
            <div className="flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3 text-purple-400" />
              <p className="text-xs text-purple-400 font-medium">3 closing this week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-950/50 to-orange-950/50 border-yellow-400/30 backdrop-blur-xl hover:border-yellow-400/50 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
            <div className="p-2 rounded-full bg-yellow-500/20">
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors">${stats.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-yellow-400" />
              <p className="text-xs text-yellow-400 font-medium">+15% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Command Center */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-slate-950/50 to-blue-950/50 border-blue-400/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <span className="text-xl text-white">AI Command Center</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">All systems operational</span>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your AI workforce is optimizing deals 24/7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {aiAgents.map((agent) => (
                  <div key={agent.name} className="group">
                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">{agent.name}</div>
                          <div className="text-sm text-gray-400">{agent.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30 mb-1">
                          {agent.efficiency}% efficient
                        </Badge>
                        <div className="text-sm text-gray-400">{agent.processed} tasks today</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-400/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-emerald-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800" asChild>
                <Link href="/wholesaler/properties">Manage Properties</Link>
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/wholesaler/offers">Review Offers</Link>
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/wholesaler/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          {/* SMS Usage */}
          <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-purple-400/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                SMS Campaign Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Used: {stats.smsUsed.toLocaleString()}</span>
                  <span>Limit: {stats.smsLimit.toLocaleString()}</span>
                </div>
                <Progress value={(stats.smsUsed / stats.smsLimit) * 100} className="h-3 bg-white/10" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {(stats.smsLimit - stats.smsUsed).toLocaleString()} messages remaining
                  </p>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                    {Math.round((stats.smsUsed / stats.smsLimit) * 100)}% used
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Deals Pipeline */}
      <Card className="bg-gradient-to-br from-slate-950/50 to-indigo-950/50 border-slate-400/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-slate-500/20 to-indigo-500/20">
              <BarChart3 className="h-6 w-6 text-slate-400" />
            </div>
            <span className="text-xl text-white">Active Deal Pipeline</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Track your most promising opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-emerald-500/20">
                    <Building2 className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">{deal.address}</div>
                    <div className="text-sm text-gray-400">Investor: {deal.investor}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">${deal.value.toLocaleString()}</div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      deal.status === 'Under Contract' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' :
                      deal.status === 'Negotiating' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' :
                      'bg-blue-500/20 text-blue-400 border-blue-400/30'
                    }`}
                  >
                    {deal.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <Button className="w-full bg-gradient-to-r from-slate-600 to-indigo-600 hover:from-slate-700 hover:to-indigo-700" asChild>
              <Link href="/wholesaler/deals">View All Deals</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
