"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Star, 
  Clock, 
  DollarSign, 
  Target,
  Bot,
  Activity,
  Phone,
  Mail,
  MessageSquare,
  Award,
  Zap,
  Brain,
  Eye,
  Settings,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Globe,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react"
import { Agent, AgentSpecialty, Lead, AIAgentMatcher, SAMPLE_AGENTS } from '@/lib/ai-agent-system'

interface AgentMetrics {
  totalAgents: number
  activeAgents: number
  totalLeads: number
  leadsAssigned: number
  avgResponseTime: number
  totalVolume: number
  conversionRate: number
  satisfactionScore: number
}

interface LiveUpdate {
  id: string
  type: 'lead_assigned' | 'deal_closed' | 'agent_online' | 'performance_update'
  message: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
}

export default function AgentManagementDashboard() {
  const [agents, setAgents] = useState<Agent[]>(SAMPLE_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState<AgentSpecialty | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([])
  const [metrics, setMetrics] = useState<AgentMetrics>({
    totalAgents: 156,
    activeAgents: 134,
    totalLeads: 847,
    leadsAssigned: 623,
    avgResponseTime: 2.1,
    totalVolume: 52300000,
    conversionRate: 91.4,
    satisfactionScore: 4.8
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalLeads: prev.totalLeads + Math.floor(Math.random() * 3),
        leadsAssigned: prev.leadsAssigned + Math.floor(Math.random() * 2),
        totalVolume: prev.totalVolume + Math.floor(Math.random() * 50000),
        activeAgents: 130 + Math.floor(Math.random() * 10)
      }))

      // Add live updates
      const updateTypes = ['lead_assigned', 'deal_closed', 'agent_online', 'performance_update'] as const
      const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)]
      const agentName = agents[Math.floor(Math.random() * agents.length)]?.name || 'Agent'
      
      const messages = {
        lead_assigned: `New lead assigned to ${agentName}`,
        deal_closed: `${agentName} closed a $${Math.floor(Math.random() * 500000 + 200000).toLocaleString()} deal`,
        agent_online: `${agentName} came online`,
        performance_update: `${agentName} achieved 95%+ satisfaction score`
      }

      const newUpdate: LiveUpdate = {
        id: Date.now().toString(),
        type: randomType,
        message: messages[randomType],
        timestamp: new Date(),
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      }

      setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 9)])
    }, 5000)

    return () => clearInterval(interval)
  }, [agents])

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = specialtyFilter === 'all' || agent.specialty === specialtyFilter
    const matchesStatus = statusFilter === 'all' || agent.availability.status === statusFilter
    
    return matchesSearch && matchesSpecialty && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'busy': return 'bg-yellow-500'
      case 'away': return 'bg-orange-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getUpdatePriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const handleAssignLead = useCallback(async (agentId: string) => {
    // Simulate lead assignment
    console.log(`Assigning lead to agent ${agentId}`)
    
    // Update agent load
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, availability: { ...agent.availability, current_load: agent.availability.current_load + 1 } }
        : agent
    ))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* NEURAL HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold sbswp-holographic-text mb-2">
              AI Agent Command Center
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-400" />
              Advanced neural network-powered agent management and optimization
            </p>
          </div>
          <div className="sbswp-live-indicator">
            <div className="sbswp-live-dot" />
            <span>LIVE: Real-time Agent Monitoring</span>
          </div>
        </div>

        {/* QUANTUM METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Agents</p>
                  <p className="text-3xl font-bold text-blue-400">{metrics.activeAgents}</p>
                  <p className="text-xs text-gray-500">of {metrics.totalAgents} total</p>
                </div>
                <Users className="h-8 w-8 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Lead Assignment</p>
                  <p className="text-3xl font-bold text-emerald-400">{metrics.leadsAssigned}</p>
                  <p className="text-xs text-gray-500">of {metrics.totalLeads} total</p>
                </div>
                <Target className="h-8 w-8 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Volume</p>
                  <p className="text-3xl font-bold text-purple-400">${(metrics.totalVolume / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.4% today
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Response</p>
                  <p className="text-3xl font-bold text-orange-400">{metrics.avgResponseTime}min</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    -15% vs yesterday
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* AGENT LIST PANEL */}
          <div className="xl:col-span-3">
            <Card className="sbswp-quantum-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-400" />
                      AI Agent Network
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Neural network-optimized agent allocation and performance monitoring
                    </CardDescription>
                  </div>
                  <Button className="sbswp-neural-button">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure AI
                  </Button>
                </div>

                {/* SEARCH AND FILTERS */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search agents by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <select 
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value as AgentSpecialty | 'all')}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="all">All Specialties</option>
                    <option value={AgentSpecialty.LUXURY_PROPERTIES}>Luxury Properties</option>
                    <option value={AgentSpecialty.FIRST_TIME_INVESTORS}>First-Time Investors</option>
                    <option value={AgentSpecialty.COMMERCIAL_REAL_ESTATE}>Commercial</option>
                    <option value={AgentSpecialty.WHOLESALE_DEALS}>Wholesale</option>
                  </select>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="online">Online</option>
                    <option value="busy">Busy</option>
                    <option value="away">Away</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredAgents.map((agent) => (
                    <div 
                      key={agent.id}
                      className="sbswp-agent-card cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-start gap-4">
                        {/* AGENT AVATAR */}
                        <div className="relative">
                          <div className="sbswp-agent-avatar w-16 h-16 text-lg">
                            {agent.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${getStatusColor(agent.availability.status)}`} />
                        </div>

                        {/* AGENT INFO */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-white">{agent.name}</h3>
                              <p className="text-sm text-gray-400">{agent.specialty.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold sbswp-text-quantum">
                                AI Score: {agent.ai_score}
                              </div>
                              <div className="text-sm text-gray-400">
                                Load: {agent.availability.current_load}/{agent.availability.max_capacity}
                              </div>
                            </div>
                          </div>

                          {/* PERFORMANCE METRICS */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-emerald-400">
                                {agent.performance.success_rate}%
                              </div>
                              <div className="text-xs text-gray-400">Success Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-400">
                                ${(agent.performance.avg_deal_size / 1000).toFixed(0)}K
                              </div>
                              <div className="text-xs text-gray-400">Avg Deal</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-400">
                                {agent.performance.avg_response_time}min
                              </div>
                              <div className="text-xs text-gray-400">Response</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(agent.performance.client_satisfaction) 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-400'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="text-xs text-gray-400">{agent.performance.client_satisfaction}/5</div>
                            </div>
                          </div>

                          {/* CAPACITY BAR */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Capacity</span>
                              <span>{Math.round((agent.availability.current_load / agent.availability.max_capacity) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(agent.availability.current_load / agent.availability.max_capacity) * 100}
                              className="h-2 bg-gray-700"
                            />
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="sbswp-neural-button flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAssignLead(agent.id)
                              }}
                              disabled={agent.availability.current_load >= agent.availability.max_capacity}
                            >
                              <Target className="h-4 w-4 mr-1" />
                              Assign Lead
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LIVE UPDATES PANEL */}
          <div className="xl:col-span-1">
            <Card className="sbswp-quantum-card border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  Live Updates
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time agent and system activity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {liveUpdates.map((update) => (
                    <div key={update.id} className={`p-3 rounded-lg border ${getUpdatePriorityColor(update.priority)}`}>
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{update.message}</p>
                          <p className="text-xs opacity-60">
                            {update.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {update.priority === 'high' && (
                          <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* QUICK STATS */}
            <Card className="sbswp-quantum-card border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Conversion Rate</span>
                    <span className="text-lg font-bold text-emerald-400">{metrics.conversionRate}%</span>
                  </div>
                  <Progress value={metrics.conversionRate} className="h-2 bg-gray-700" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Satisfaction Score</span>
                    <span className="text-lg font-bold text-yellow-400">{metrics.satisfactionScore}/5</span>
                  </div>
                  <Progress value={(metrics.satisfactionScore / 5) * 100} className="h-2 bg-gray-700" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}