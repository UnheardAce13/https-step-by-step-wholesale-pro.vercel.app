/**
 * S.B.S.W.P 2.0 - CONTRACTS PAGE
 * Main contracts interface combining AI generation and management
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText,
  Sparkles,
  Settings,
  ArrowLeft,
  Brain,
  Zap,
  Shield,
  Clock,
  Users,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIContractGenerator } from '@/components/contracts/ai-contract-generator'
import { ContractDashboard } from '@/components/contracts/contract-dashboard'

export default function ContractsPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'generator' | 'viewer'>('dashboard')
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)

  const handleCreateNew = () => {
    setActiveView('generator')
  }

  const handleViewContract = (contractId: string) => {
    setSelectedContractId(contractId)
    setActiveView('viewer')
  }

  const handleContractGenerated = (contractId: string) => {
    setSelectedContractId(contractId)
    // Could navigate to viewer or stay in generator
  }

  const handleBackToDashboard = () => {
    setActiveView('dashboard')
    setSelectedContractId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        {activeView !== 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>
        )}

        {/* Main Content */}
        {activeView === 'dashboard' && (
          <>
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Legal Document Hub</h1>
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI POWERED
                </Badge>
              </div>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Revolutionary AI-powered contract generation with DocuSign integration. 
                Generate, manage, and execute legally compliant contracts in minutes, not hours.
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-600/20 rounded-full w-fit mx-auto mb-4">
                    <Brain className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">AI Generation</h3>
                  <p className="text-gray-400 text-sm">
                    Generate contracts using advanced AI trained on legal best practices
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/20">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-600/20 rounded-full w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Legal Compliance</h3>
                  <p className="text-gray-400 text-sm">
                    Ensure compliance with state and federal regulations
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/20">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-600/20 rounded-full w-fit mx-auto mb-4">
                    <Zap className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">DocuSign Integration</h3>
                  <p className="text-gray-400 text-sm">
                    Seamless e-signature workflow with industry-leading platform
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-orange-500/20">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-orange-600/20 rounded-full w-fit mx-auto mb-4">
                    <Clock className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-400 text-sm">
                    Generate complex contracts in under 3 minutes
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contract Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ContractDashboard 
                onCreateNew={handleCreateNew}
                onViewContract={handleViewContract}
              />
            </motion.div>
          </>
        )}

        {activeView === 'generator' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AIContractGenerator 
              onContractGenerated={handleContractGenerated}
            />
          </motion.div>
        )}

        {activeView === 'viewer' && selectedContractId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Contract Viewer</h3>
                <p className="text-gray-400 mb-4">
                  Contract viewer component would be implemented here
                </p>
                <p className="text-gray-500 text-sm">
                  Contract ID: {selectedContractId}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bottom CTA Section */}
        {activeView === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/20">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Award className="h-8 w-8 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Ready to Revolutionize Your Contracts?</h2>
                </div>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Experience the power of AI-driven contract generation. Create professional, 
                  legally compliant documents in minutes with our advanced technology.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    onClick={handleCreateNew}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Your First AI Contract
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-lg px-8 py-3"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    View Templates
                  </Button>
                </div>
                
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">2.3min</div>
                    <div className="text-gray-400 text-sm">Average Generation Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">96.8%</div>
                    <div className="text-gray-400 text-sm">AI Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">94.2%</div>
                    <div className="text-gray-400 text-sm">Completion Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}