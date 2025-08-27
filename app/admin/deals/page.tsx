"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  TrendingUp, TrendingDown, DollarSign, Home, MapPin, Clock, Activity, Target, Search, Brain, Bot, Building2, Sparkles, RefreshCw, Database
} from "lucide-react"

interface Property {
  id: string
  address: string
  city: string
  state: string
  price: number
  estimated_value: number
  property_type: string
  days_on_market: number
  status: 'new' | 'under_contract' | 'sold' | 'expired'
  market_trends: {
    price_trend: 'up' | 'down' | 'stable'
    demand_level: string
    competition_score: number
  }
  investment_metrics: {
    roi_potential: number
    arv: number
    profit_potential: number
  }
  ai_score: number
  created_at: Date
}

interface DealFlowMetrics {
  total_properties: number
  new_today: number
  total_deals: number
  deals_in_progress: number
  total_pipeline_value: number
  conversion_rate: number
}

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'prop_001',
    address: '1247 Oak Street',
    city: 'Austin',
    state: 'TX',
    price: 485000,
    estimated_value: 520000,
    property_type: 'single_family',
    days_on_market: 12,
    status: 'new',
    market_trends: {
      price_trend: 'up',
      demand_level: 'very_high',
      competition_score: 8.5
    },
    investment_metrics: {
      roi_potential: 18.5,
      arv: 535000,
      profit_potential: 35000
    },
    ai_score: 94.2,
    created_at: new Date()
  },
  {
    id: 'prop_002',
    address: '892 Pine Avenue',
    city: 'Dallas',
    state: 'TX',
    price: 325000,
    estimated_value: 365000,
    property_type: 'single_family',
    days_on_market: 8,
    status: 'new',
    market_trends: {
      price_trend: 'up',
      demand_level: 'high',
      competition_score: 7.8
    },
    investment_metrics: {
      roi_potential: 22.3,
      arv: 390000,
      profit_potential: 40000
    },
    ai_score: 91.7,
    created_at: new Date()
  }
]

export default function DealFlowDashboard() {
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [metrics, setMetrics] = useState<DealFlowMetrics>({
    total_properties: 1247,
    new_today: 23,
    total_deals: 89,
    deals_in_progress: 34,
    total_pipeline_value: 14450000,
    conversion_rate: 68.5
  })

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMode) return
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        new_today: prev.new_today + Math.floor(Math.random() * 2),
        total_properties: prev.total_properties + Math.floor(Math.random() * 3),
        deals_in_progress: prev.deals_in_progress + Math.floor(Math.random() * 2) - 1,
        total_pipeline_value: prev.total_pipeline_value + Math.floor(Math.random() * 100000),
        conversion_rate: Math.max(0, Math.min(100, prev.conversion_rate + (Math.random() - 0.5) * 2))
      }))

      if (Math.random() > 0.8) {
        const newProperty: Property = {
          id: `prop_${Date.now()}`,
          address: `${Math.floor(Math.random() * 9999)} ${['Oak', 'Pine', 'Maple', 'Cedar'][Math.floor(Math.random() * 4)]} Street`,
          city: ['Austin', 'Dallas', 'Houston'][Math.floor(Math.random() * 3)],
          state: 'TX',
          price: Math.floor(Math.random() * 500000) + 200000,
          estimated_value: 0,
          property_type: 'single_family',
          days_on_market: Math.floor(Math.random() * 90),
          status: 'new',
          market_trends: {
            price_trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
            demand_level: ['medium', 'high', 'very_high'][Math.floor(Math.random() * 3)],
            competition_score: Math.random() * 10
          },
          investment_metrics: {
            roi_potential: Math.random() * 30 + 10,
            arv: 0,
            profit_potential: Math.floor(Math.random() * 100000) + 20000
          },
          ai_score: Math.random() * 20 + 80,
          created_at: new Date()
        }
        newProperty.estimated_value = newProperty.price * (1 + Math.random() * 0.2)
        newProperty.investment_metrics.arv = newProperty.estimated_value * (1 + Math.random() * 0.1)
        setProperties(prev => [newProperty, ...prev.slice(0, 19)])
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isLiveMode])

  const filteredProperties = useMemo(() => {
    return properties
      .filter(property => 
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.ai_score - a.ai_score)
  }, [properties, searchTerm])

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30',
      under_contract: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
      sold: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      expired: 'bg-red-500/20 text-red-400 border-red-400/30'
    }
    return colors[status as keyof typeof colors] || colors.new
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-emerald-400" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />
      default: return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold sbswp-holographic-text mb-2">Real-Time Deal Flow</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-400" />
              AI-powered property discovery with live market data
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={isLiveMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' : 'bg-gray-500/20 text-gray-400 border-gray-400/30'}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
              {isLiveMode ? 'LIVE' : 'PAUSED'}
            </Badge>
            <Button variant="outline" onClick={() => setIsLiveMode(!isLiveMode)} className="border-white/20 text-white hover:bg-white/10">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLiveMode ? 'animate-spin' : ''}`} />
              {isLiveMode ? 'Live Mode' : 'Start Live'}
            </Button>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Properties</p>
                  <p className="text-3xl font-bold text-blue-400">{metrics.total_properties.toLocaleString()}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+{metrics.new_today} today
                  </p>
                </div>
                <Home className="h-8 w-8 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Deals</p>
                  <p className="text-3xl font-bold text-emerald-400">{metrics.deals_in_progress}</p>
                  <p className="text-xs text-gray-400">of {metrics.total_deals} total</p>
                </div>
                <Target className="h-8 w-8 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="sbswp-quantum-card border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pipeline Value</p>
                  <p className="text-3xl font-bold text-purple-400">${(metrics.total_pipeline_value / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+8.3% this week
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
                  <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-orange-400">{metrics.conversion_rate.toFixed(1)}%</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+2.1% vs last month
                  </p>
                </div>
                <Activity className="h-8 w-8 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PROPERTY LISTINGS */}
        <Card className="sbswp-quantum-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-400" />AI-Powered Property Discovery
                </CardTitle>
                <p className="text-gray-400">Real-time property feed with intelligent scoring</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                  {filteredProperties.length} Properties
                </Badge>
                <Button size="sm" className="sbswp-neural-button">
                  <Sparkles className="h-4 w-4 mr-2" />AI Analyze All
                </Button>
              </div>
            </div>
            <div className="pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search properties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <div key={property.id} className="sbswp-quantum-card p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-white">{property.address}</h3>
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{property.city}, {property.state}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold sbswp-text-quantum">AI {property.ai_score.toFixed(1)}</div>
                          <Badge className={getStatusColor(property.status)}>{property.status.replace('_', ' ').toUpperCase()}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">${property.price.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">List Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-400">${property.investment_metrics.arv.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">ARV</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">{property.investment_metrics.roi_potential.toFixed(1)}%</div>
                          <div className="text-xs text-gray-400">ROI</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-400">${property.investment_metrics.profit_potential.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Profit</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(property.market_trends.price_trend)}
                          <span className="text-sm text-gray-400">Price Trend</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-gray-400">{property.days_on_market} days on market</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="sbswp-neural-button">
                          <Brain className="h-4 w-4 mr-1" />AI Analyze
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Bot className="h-4 w-4 mr-1" />Assign Agent
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
    </div>
  )
}