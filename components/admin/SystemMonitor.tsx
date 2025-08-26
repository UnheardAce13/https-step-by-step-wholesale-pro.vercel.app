"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Server, Database, CreditCard, MessageSquare, FileText, Zap, RefreshCw } from "lucide-react"

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  services: {
    database: ServiceStatus
    authentication: ServiceStatus
    stripe: ServiceStatus
    telnyx: ServiceStatus
    docusign: ServiceStatus
    zapier: ServiceStatus
  }
  performance: {
    responseTime: number
    memoryUsage: {
      rss: number
      heapTotal: number
      heapUsed: number
      external: number
      arrayBuffers: number
    }
    cpuUsage: number
  }
  errors: string[]
}

interface ServiceStatus {
  status: 'operational' | 'degraded' | 'down'
  responseTime?: number
  lastChecked: string
  error?: string
}

const serviceIcons = {
  database: Database,
  authentication: Server,
  stripe: CreditCard,
  telnyx: MessageSquare,
  docusign: FileText,
  zapier: Zap
}

const serviceNames = {
  database: 'Supabase Database',
  authentication: 'Authentication',
  stripe: 'Stripe Payments',
  telnyx: 'Telnyx SMS',
  docusign: 'DocuSign',
  zapier: 'Zapier AI'
}

export default function SystemMonitor() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchHealthData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/health/advanced')
      const data = await response.json()
      setHealthData(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'bg-green-500'
      case 'degraded':
        return 'bg-yellow-500'
      case 'unhealthy':
      case 'down':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'default'
      case 'degraded':
        return 'secondary'
      case 'unhealthy':
      case 'down':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const formatMemory = (bytes: number) => {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(1)} MB`
  }

  if (loading && !healthData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">System Monitor</h2>
          <div className="animate-pulse flex space-x-2">
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Monitor</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            onClick={fetchHealthData}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {healthData && (
        <>
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>System Status</span>
                <Badge variant={getStatusVariant(healthData.status)}>
                  {healthData.status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Uptime</p>
                  <p className="text-lg font-semibold">{formatUptime(healthData.uptime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Response Time</p>
                  <p className="text-lg font-semibold">{healthData.performance.responseTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Version</p>
                  <p className="text-lg font-semibold">v{healthData.version}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(healthData.services).map(([service, status]) => {
              const Icon = serviceIcons[service as keyof typeof serviceIcons]
              const serviceName = serviceNames[service as keyof typeof serviceNames]
              
              return (
                <Card key={service}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{serviceName}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Status</span>
                        <Badge variant={getStatusVariant(status.status)}>
                          {status.status}
                        </Badge>
                      </div>
                      
                      {status.responseTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Response</span>
                          <span className="text-sm font-medium">{status.responseTime}ms</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Last Check</span>
                        <span className="text-xs text-gray-400">
                          {new Date(status.lastChecked).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {status.error && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">
                          {status.error}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Memory Usage</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Heap Used</span>
                      <span>{formatMemory(healthData.performance.memoryUsage.heapUsed)}</span>
                    </div>
                    <Progress 
                      value={(healthData.performance.memoryUsage.heapUsed / healthData.performance.memoryUsage.heapTotal) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total: {formatMemory(healthData.performance.memoryUsage.heapTotal)}</span>
                      <span>RSS: {formatMemory(healthData.performance.memoryUsage.rss)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">CPU Usage</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>User Time</span>
                      <span>{healthData.performance.cpuUsage.toFixed(2)}ms</span>
                    </div>
                    <Progress 
                      value={Math.min((healthData.performance.cpuUsage / 1000) * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">API Response</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Health Check</span>
                      <span>{healthData.performance.responseTime}ms</span>
                    </div>
                    <Progress 
                      value={Math.min((healthData.performance.responseTime / 1000) * 100, 100)} 
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500">
                      Target: &lt; 500ms
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Errors */}
          {healthData.errors.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">System Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {healthData.errors.map((error, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {error}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}