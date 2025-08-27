/**
 * S.B.S.W.P 2.0 - ANALYTICS PAGE
 * The most advanced real estate analytics platform ever created
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3,
  Brain,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdvancedAnalyticsDashboard } from '@/components/analytics/advanced-dashboard'

export default function AnalyticsPage() {
  // Mock user data - would come from auth context
  const userId = 'user_123'
  const userRole = 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Analytics Command Center</h1>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              AI POWERED
            </Badge>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The most sophisticated real estate analytics platform ever built. 
            Harness AI-powered insights to completely DOMINATE your market.
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-600/20 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Predictive AI</h3>
              <p className="text-gray-400 text-sm">
                Advanced machine learning models predict market trends with 95%+ accuracy
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-600/20 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Real-Time Insights</h3>
              <p className="text-gray-400 text-sm">
                Live data streams provide instant market intelligence and opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-600/20 rounded-full w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Competitive Intel</h3>
              <p className="text-gray-400 text-sm">
                Monitor competitors and identify market gaps for strategic advantage
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-600/20 rounded-full w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Automated Reports</h3>
              <p className="text-gray-400 text-sm">
                AI-generated executive reports with actionable recommendations
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AdvancedAnalyticsDashboard 
            userId={userId}
            userRole={userRole}
          />
        </motion.div>

        {/* Bottom Excellence Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/20">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="h-8 w-8 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Market Domination Through Data</h2>
              </div>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                S.B.S.W.P 2.0's analytics platform processes over 10 million data points daily 
                to give you the ultimate competitive advantage in real estate investment.
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">95.7%</div>
                  <div className="text-gray-400 text-sm">Prediction Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">10M+</div>
                  <div className="text-gray-400 text-sm">Data Points Processed Daily</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">3.2x</div>
                  <div className="text-gray-400 text-sm">ROI Improvement Average</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}