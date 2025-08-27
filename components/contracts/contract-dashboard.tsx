/**
 * S.B.S.W.P 2.0 - CONTRACT MANAGEMENT DASHBOARD
 * Comprehensive contract oversight and management interface
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Zap,
  Star,
  MessageCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useContractList, useContractAnalytics } from '@/hooks/use-contracts'
import { 
  ContractStatus, 
  ContractType, 
  CONTRACT_TEMPLATES,
  Contract 
} from '@/lib/contract-types'

interface ContractDashboardProps {
  onCreateNew?: () => void
  onViewContract?: (contractId: string) => void
  className?: string
}

export function ContractDashboard({ onCreateNew, onViewContract, className }: ContractDashboardProps) {
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus | 'all'>('all')
  const [selectedType, setSelectedType] = useState<ContractType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'type' | 'value'>('date')
  
  const { contracts, loading, error, totalCount, updateFilters, refreshContracts, deleteContract } = useContractList()

  const handleStatusFilter = (status: ContractStatus | 'all') => {
    setSelectedStatus(status)
    updateFilters({ 
      status: status === 'all' ? undefined : [status] 
    })
  }

  const handleTypeFilter = (type: ContractType | 'all') => {
    setSelectedType(type)
    updateFilters({ 
      type: type === 'all' ? undefined : [type] 
    })
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    updateFilters({ searchTerm: term })
  }

  const getStatusColor = (status: ContractStatus): string => {
    switch (status) {
      case ContractStatus.DRAFT: return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
      case ContractStatus.PENDING_REVIEW: return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
      case ContractStatus.SENT_FOR_SIGNATURE: return 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      case ContractStatus.PARTIALLY_SIGNED: return 'bg-purple-500/20 text-purple-300 border-purple-400/30'
      case ContractStatus.FULLY_EXECUTED: return 'bg-green-500/20 text-green-300 border-green-400/30'
      case ContractStatus.EXPIRED: return 'bg-red-500/20 text-red-300 border-red-400/30'
      case ContractStatus.CANCELLED: return 'bg-red-500/20 text-red-300 border-red-400/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    }
  }

  const getStatusIcon = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT: return <Edit className="h-3 w-3" />
      case ContractStatus.PENDING_REVIEW: return <Clock className="h-3 w-3" />
      case ContractStatus.SENT_FOR_SIGNATURE: return <Send className="h-3 w-3" />
      case ContractStatus.PARTIALLY_SIGNED: return <Users className="h-3 w-3" />
      case ContractStatus.FULLY_EXECUTED: return <CheckCircle className="h-3 w-3" />
      case ContractStatus.EXPIRED: return <AlertTriangle className="h-3 w-3" />
      case ContractStatus.CANCELLED: return <Trash2 className="h-3 w-3" />
      default: return <FileText className="h-3 w-3" />
    }
  }

  // Mock data for demonstration
  const mockStats = {
    totalContracts: 247,
    activeContracts: 89,
    completedThisMonth: 45,
    totalValue: 12500000,
    averageCompletionTime: 7.2,
    successRate: 94.2
  }

  const mockRecentActivity = [
    { id: 1, action: 'Contract signed', contract: 'Purchase Agreement #PA-2024-001', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'New contract generated', contract: 'Wholesale Contract #WC-2024-045', time: '4 hours ago', type: 'info' },
    { id: 3, action: 'Contract expired', contract: 'Assignment Contract #AC-2024-023', time: '1 day ago', type: 'warning' },
    { id: 4, action: 'Signature requested', contract: 'Lease Agreement #LA-2024-078', time: '2 days ago', type: 'info' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contract Management</h1>
          <p className="text-gray-400">
            AI-powered contract generation and comprehensive document management
          </p>
        </div>
        <Button onClick={onCreateNew} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Contract
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Contracts</p>
                <p className="text-3xl font-bold text-white">{mockStats.totalContracts}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+12%</span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Active Contracts</p>
                <p className="text-3xl font-bold text-white">{mockStats.activeContracts}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+8%</span>
              <span className="text-gray-400 ml-2">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-white">{mockStats.completedThisMonth}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+15%</span>
              <span className="text-gray-400 ml-2">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold text-white">${(mockStats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-400" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+23%</span>
              <span className="text-gray-400 ml-2">portfolio value</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-200 text-sm font-medium">Avg. Time</p>
                <p className="text-3xl font-bold text-white">{mockStats.averageCompletionTime}d</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDownRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">-2.1d</span>
              <span className="text-gray-400 ml-2">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-900/30 to-rose-800/30 border-rose-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-200 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-white">{mockStats.successRate}%</p>
              </div>
              <Star className="h-8 w-8 text-rose-400" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+2.1%</span>
              <span className="text-gray-400 ml-2">vs industry avg</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="contracts" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-white/10 p-1">
            <TabsTrigger 
              value="contracts" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              All Contracts
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contracts" className="space-y-6">
            {/* Filters */}
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Contract Management</h3>
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={refreshContracts}
                      variant="outline" 
                      size="sm"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="bg-white/5 border-white/10 text-white pl-10"
                      placeholder="Search contracts..."
                    />
                  </div>

                  <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={ContractStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={ContractStatus.PENDING_REVIEW}>Pending Review</SelectItem>
                      <SelectItem value={ContractStatus.SENT_FOR_SIGNATURE}>Sent for Signature</SelectItem>
                      <SelectItem value={ContractStatus.PARTIALLY_SIGNED}>Partially Signed</SelectItem>
                      <SelectItem value={ContractStatus.FULLY_EXECUTED}>Fully Executed</SelectItem>
                      <SelectItem value={ContractStatus.EXPIRED}>Expired</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={handleTypeFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(CONTRACT_TEMPLATES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date Created</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                      <SelectItem value="value">Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Contract List */}
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading contracts...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-200">Failed to load contracts</p>
                    <p className="text-gray-400 text-sm mt-2">{error}</p>
                  </div>
                ) : contracts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No contracts found</p>
                    <Button onClick={onCreateNew} className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Contract
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Demo contract items since we don't have real data */}
                    {[
                      {
                        id: 'contract_1',
                        title: 'Purchase Agreement - 123 Main St',
                        type: ContractType.PURCHASE_AGREEMENT,
                        status: ContractStatus.SENT_FOR_SIGNATURE,
                        createdAt: new Date('2024-01-15'),
                        value: 450000,
                        parties: 2,
                        aiGenerated: true
                      },
                      {
                        id: 'contract_2',
                        title: 'Wholesale Contract - 456 Oak Ave',
                        type: ContractType.WHOLESALE_CONTRACT,
                        status: ContractStatus.FULLY_EXECUTED,
                        createdAt: new Date('2024-01-12'),
                        value: 320000,
                        parties: 3,
                        aiGenerated: true
                      },
                      {
                        id: 'contract_3',
                        title: 'Assignment Contract - 789 Pine Rd',
                        type: ContractType.ASSIGNMENT_CONTRACT,
                        status: ContractStatus.DRAFT,
                        createdAt: new Date('2024-01-10'),
                        value: 25000,
                        parties: 2,
                        aiGenerated: false
                      }
                    ].map((contract) => (
                      <motion.div
                        key={contract.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => onViewContract?.(contract.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{contract.title}</h4>
                                {contract.aiGenerated && (
                                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                                    <Zap className="h-3 w-3 mr-1" />
                                    AI Generated
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">
                                {CONTRACT_TEMPLATES[contract.type]} • Created {contract.createdAt.toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-sm text-gray-400">
                                  <Users className="h-3 w-3" />
                                  {contract.parties} parties
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-400">
                                  <DollarSign className="h-3 w-3" />
                                  ${contract.value.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(contract.status)}>
                              {getStatusIcon(contract.status)}
                              <span className="ml-1 capitalize">{contract.status.replace('_', ' ')}</span>
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onViewContract?.(contract.id)
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Download action
                                }}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Contract Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Average Generation Time</span>
                      <span className="text-white font-medium">2.3 minutes</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Average Review Time</span>
                      <span className="text-white font-medium">4.7 hours</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Signature Completion Rate</span>
                      <span className="text-green-400 font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">AI Accuracy Score</span>
                      <span className="text-blue-400 font-medium">96.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Contract Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'Purchase Agreements', count: 89, percentage: 36 },
                      { type: 'Wholesale Contracts', count: 67, percentage: 27 },
                      { type: 'Assignment Contracts', count: 45, percentage: 18 },
                      { type: 'Lease Agreements', count: 31, percentage: 13 },
                      { type: 'Other', count: 15, percentage: 6 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">{item.type}</span>
                          <span className="text-white font-medium">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 bg-white/5 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'success' 
                          ? 'bg-green-600/20' 
                          : activity.type === 'warning'
                          ? 'bg-yellow-600/20'
                          : 'bg-blue-600/20'
                      }`}>
                        {activity.type === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : activity.type === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.contract}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}