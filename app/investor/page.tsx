"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  DollarSign,
  Target,
  Eye,
  BarChart3,
  Wallet,
  Clock,
  Award,
  ArrowUpRight,
  Building2,
  Users,
  Zap,
  Shield,
  Star,
  Activity,
  ChevronRight,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

export default function InvestorDashboardPage() {
  // Mock data - would come from API in real implementation
  const stats = {
    portfolioValue: 2450000,
    activeOffers: 8,
    closedDeals: 23,
    monthlyROI: 14.2,
    avgDealSize: 106500,
    successRate: 87
  }

  const availableDeals = [
    { id: 1, address: "1247 Maple Street", price: 185000, roi: 18.5, wholesaler: "Sarah Wilson", status: "New", daysLeft: 4 },
    { id: 2, address: "892 Oak Avenue", price: 220000, roi: 22.1, wholesaler: "Mike Chen", status: "Bidding", daysLeft: 2 },
    { id: 3, address: "456 Pine Drive", price: 165000, roi: 16.8, wholesaler: "David Kim", status: "Hot", daysLeft: 1 }
  ]

  const myOffers = [
    { id: 1, address: "123 Elm Street", offer: 195000, status: "Pending", submitted: "2 hours ago" },
    { id: 2, address: "789 Cedar Lane", offer: 240000, status: "Accepted", submitted: "1 day ago" },
    { id: 3, address: "321 Birch Road", offer: 175000, status: "Countered", submitted: "3 days ago" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 flex-shrink-0">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Investor Intelligence Hub
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">AI-powered deal discovery and portfolio optimization</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg min-h-[44px] text-sm sm:text-base" asChild>
            <Link href="/investor/deals" className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              Browse Deals
            </Link>
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 min-h-[44px] text-sm sm:text-base" asChild>
            <Link href="/investor/portfolio">Portfolio</Link>
          </Button>
        </div>
      </div>

      {/* Performance Metrics - Premium Dashboard Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-400/30 backdrop-blur-xl hover:border-emerald-400/50 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm font-medium text-gray-300">Portfolio Value</CardTitle>
            <div className="p-2 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors flex-shrink-0">
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">${stats.portfolioValue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-400 font-medium">+12.5% this quarter</p>
            </div>
            <Progress value={85} className="mt-3 h-1 bg-emerald-950/50" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border-blue-400/30 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly ROI</CardTitle>
            <div className="p-2 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors flex-shrink-0">
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{stats.monthlyROI}%</div>
            <div className="flex items-center gap-1 mt-1">
              <Activity className="h-3 w-3 text-blue-400 flex-shrink-0" />
              <p className="text-xs text-blue-400 font-medium">Above market average</p>
            </div>
            <Progress value={78} className="mt-3 h-1 bg-blue-950/50" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-purple-400/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 group relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
            <div className="p-2 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors flex-shrink-0">
              <Award className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">{stats.successRate}%</div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 text-purple-400 flex-shrink-0" />
              <p className="text-xs text-purple-400 font-medium">{stats.closedDeals} deals closed</p>
            </div>
            <Progress value={87} className="mt-3 h-1 bg-purple-950/50" />
          </CardContent>
        </Card>
      </div>

      {/* Hot Deals Alert Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        <div className="xl:col-span-2 space-y-6">
          {/* AI-Recommended Hot Deals */}
          <Card className="bg-gradient-to-br from-red-950/30 to-orange-950/30 border-red-400/30 backdrop-blur-xl">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20 flex-shrink-0">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl text-white">🔥 Hot Deals Alert</CardTitle>
                    <CardDescription className="text-gray-400 text-sm sm:text-base">AI-curated time-sensitive opportunities</CardDescription>
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-400/30 animate-pulse self-start sm:self-center text-xs">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              {availableDeals.map((deal) => (
                <div key={deal.id} className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Building2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors text-sm sm:text-base truncate">{deal.address}</span>
                        <Badge 
                          className={`text-xs flex-shrink-0 ${
                            deal.status === 'Hot' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                            deal.status === 'New' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                          }`}
                        >
                          {deal.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 flex-shrink-0" />
                          ${deal.price.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                          {deal.roi}% ROI
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{deal.wholesaler}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:gap-2 justify-between lg:justify-start">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-red-400 flex-shrink-0" />
                        <span className="text-xs text-red-400 font-medium whitespace-nowrap">{deal.daysLeft} days left</span>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs sm:text-sm min-h-[36px]">
                        View Details
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Active Offers */}
          <Card className="bg-gradient-to-br from-slate-950/50 to-blue-950/50 border-blue-400/30 backdrop-blur-xl">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl text-white">My Active Offers</CardTitle>
                    <CardDescription className="text-gray-400 text-sm sm:text-base">Track your submitted bids and negotiations</CardDescription>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 self-start sm:self-center text-xs">{stats.activeOffers} Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              {myOffers.map((offer) => (
                <div key={offer.id} className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-white/10 hover:border-blue-400/30 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Building2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <span className="font-semibold text-white text-sm sm:text-base truncate">{offer.address}</span>
                        <Badge 
                          className={`text-xs flex-shrink-0 ${
                            offer.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' :
                            offer.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' :
                            'bg-orange-500/20 text-orange-400 border-orange-400/30'
                          }`}
                        >
                          {offer.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 flex-shrink-0" />
                          ${offer.offer.toLocaleString()} offer
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          {offer.submitted}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm min-h-[36px] self-start sm:self-center">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-slate-950/50 to-purple-950/50 border-purple-400/30 backdrop-blur-xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-400 text-xs sm:text-sm">Avg. Deal Size</span>
                <span className="text-white font-semibold text-sm sm:text-base">${stats.avgDealSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-400 text-xs sm:text-sm">Active Offers</span>
                <span className="text-emerald-400 font-semibold text-sm sm:text-base">{stats.activeOffers}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-400 text-xs sm:text-sm">Total Deals</span>
                <span className="text-blue-400 font-semibold text-sm sm:text-base">{stats.closedDeals}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-xs sm:text-sm">Win Rate</span>
                <span className="text-purple-400 font-semibold text-sm sm:text-base">{stats.successRate}%</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-400/30 backdrop-blur-xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
                <p className="text-xs sm:text-sm text-emerald-400 font-medium mb-1">Market Opportunity</p>
                <p className="text-xs text-gray-300">3 high-ROI properties match your investment criteria in your target area.</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <p className="text-xs sm:text-sm text-blue-400 font-medium mb-1">Portfolio Tip</p>
                <p className="text-xs text-gray-300">Consider diversifying into commercial properties for better risk distribution.</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
                <p className="text-xs sm:text-sm text-yellow-400 font-medium mb-1">Timing Alert</p>
                <p className="text-xs text-gray-300">Market conditions favor buyers this quarter. Increase offer frequency by 15%.</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-purple-400/30 backdrop-blur-xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 min-h-[44px] text-sm sm:text-base" asChild>
                <Link href="/investor/search">Find New Deals</Link>
              </Button>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 min-h-[44px] text-sm sm:text-base" asChild>
                <Link href="/investor/portfolio">View Portfolio</Link>
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-h-[44px] text-sm sm:text-base" asChild>
                <Link href="/investor/analytics">Advanced Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
