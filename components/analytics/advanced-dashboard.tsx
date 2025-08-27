/**
 * S.B.S.W.P 2.0 - ADVANCED ANALYTICS DASHBOARD
 * The most intelligent real estate analytics interface ever built
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3,
  TrendingUp,
  Brain,
  Target,
  Zap,
  Eye,
  AlertTriangle,
  DollarSign,
  Users,
  Activity,
  Sparkles,
  LineChart,
  PieChart,
  Map
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdvancedAnalytics, useRealTimeMetrics } from '@/hooks/use-analytics'
import { MetricType } from '@/lib/analytics-types'

interface AnalyticsDashboardProps {
  userId: string
  userRole: string
  className?: string
}

export function AdvancedAnalyticsDashboard({ userId, userRole, className }: AnalyticsDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('last_30_days')
  
  const {
    analytics,
    predictions,
    marketInsights,
    dashboard,
    competitive,
    alerts,
    isLoading,
    refreshAll
  } = useAdvancedAnalytics(userId, userRole, { market: 'general' })

  const revenueMetrics = useRealTimeMetrics(MetricType.REVENUE)
  const dealMetrics = useRealTimeMetrics(MetricType.DEAL_COUNT)

  // Mock data for demonstration
  const mockMetrics = [
    { id: '1', name: 'Total Revenue', value: 2850000, change: 15.3, trend: 'up' as const, format: 'currency' as const },
    { id: '2', name: 'Active Deals', value: 127, change: 8.7, trend: 'up' as const, format: 'number' as const },
    { id: '3', name: 'Conversion Rate', value: 24.5, change: -2.1, trend: 'down' as const, format: 'percentage' as const },
    { id: '4', name: 'Avg Deal Size', value: 185000, change: 12.4, trend: 'up' as const, format: 'currency' as const }
  ]

  const mockPredictions = [
    { type: 'Market Forecast', confidence: 92, value: '+18.5% growth', timeframe: '6 months' },
    { type: 'Revenue Projection', confidence: 87, value: '$3.2M target', timeframe: 'Q4 2024' },
    { type: 'Risk Assessment', confidence: 94, value: 'Low Risk', timeframe: 'Current' }
  ]

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency': return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
      case 'percentage': return `${value}%`
      default: return value.toLocaleString()
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
          <p className="text-gray-400">
            AI-powered insights and predictive analytics for total market domination
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            <Brain className="h-3 w-3 mr-1" />
            AI POWERED
          </Badge>
          <Button onClick={refreshAll} className="bg-blue-600 hover:bg-blue-700">
            <Activity className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {mockMetrics.map((metric, index) => (
          <Card key={metric.id} className="bg-slate-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{metric.name}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {formatValue(metric.value, metric.format)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  metric.trend === 'up' ? 'bg-green-600/20' : 'bg-red-600/20'
                }`}>
                  {index === 0 && <DollarSign className="h-6 w-6 text-green-400" />}
                  {index === 1 && <Target className="h-6 w-6 text-blue-400" />}
                  {index === 2 && <TrendingUp className="h-6 w-6 text-purple-400" />}
                  {index === 3 && <BarChart3 className="h-6 w-6 text-orange-400" />}
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className={`flex items-center ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    metric.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  <span className="text-sm font-medium">
                    {Math.abs(metric.change)}%
                  </span>
                </div>
                <span className="text-gray-400 text-sm ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* AI Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-400" />
              AI Predictions & Market Intelligence
              <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockPredictions.map((pred, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{pred.type}</h4>
                    <Badge className={`${
                      pred.confidence >= 90 
                        ? 'bg-green-600/20 text-green-300 border-green-500/30'
                        : pred.confidence >= 80
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                        : 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30'
                    }`}>
                      {pred.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{pred.value}</p>
                  <p className="text-gray-400 text-sm">{pred.timeframe}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-white/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Eye className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="predictions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Brain className="h-4 w-4 mr-2" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="competitive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Target className="h-4 w-4 mr-2" />
              Competitive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-400">Advanced chart visualization</p>
                      <p className="text-gray-500 text-sm">Chart component would render here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Deal Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-400">Deal type distribution</p>
                      <p className="text-gray-500 text-sm">Pie chart would render here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Performance Analytics</h3>
                <p className="text-gray-400">Detailed performance metrics and KPI tracking</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-8 text-center">
                <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">AI Predictions</h3>
                <p className="text-gray-400">Advanced predictive analytics and forecasting</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitive">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-8 text-center">
                <Target className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Competitive Intelligence</h3>
                <p className="text-gray-400">Market positioning and competitor analysis</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}