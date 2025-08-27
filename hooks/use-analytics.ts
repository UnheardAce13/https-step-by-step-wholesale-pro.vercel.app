/**
 * S.B.S.W.P 2.0 - ADVANCED ANALYTICS HOOKS
 * React hooks for seamless analytics integration
 * TOTAL DOMINATION through intelligent data insights
 */

'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { analyticsService } from '@/lib/analytics-service'
import {
  AnalyticsMetric,
  AnalyticsChart,
  AnalyticsDashboard,
  Prediction,
  MarketInsight,
  CompetitorAnalysis,
  PerformanceReport,
  AnalyticsAlert,
  RealTimeMetric,
  MetricType,
  AnalyticsTimeframe,
  ChartType,
  PredictionConfidence,
  AlertType
} from '@/lib/analytics-types'

// CORE ANALYTICS HOOK
export function useAnalytics() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const refreshMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // This would fetch metrics from the analytics service
      const updatedMetrics: AnalyticsMetric[] = []
      setMetrics(updatedMetrics)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshMetrics()
  }, [refreshMetrics])

  return {
    metrics,
    loading,
    error,
    lastUpdated,
    refreshMetrics
  }
}

// PREDICTIVE ANALYTICS HOOK
export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const generatePrediction = useCallback(async (
    type: 'market_forecast' | 'deal_outcome' | 'property_value' | 'revenue_projection' | 'risk_assessment',
    parameters: Record<string, any>
  ): Promise<Prediction> => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setError(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const prediction = await analyticsService.generatePrediction(type, parameters)
      
      clearInterval(progressInterval)
      setGenerationProgress(100)
      
      setPredictions(prev => [prediction, ...prev])
      return prediction
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction generation failed')
      throw err
    } finally {
      setIsGenerating(false)
      setTimeout(() => setGenerationProgress(0), 1000)
    }
  }, [])

  const getPredictionsByType = useCallback((type: string) => {
    return predictions.filter(p => p.type === type)
  }, [predictions])

  const getActivePredictions = useCallback(() => {
    const now = new Date()
    return predictions.filter(p => p.expiresAt > now)
  }, [predictions])

  return {
    predictions,
    isGenerating,
    generationProgress,
    error,
    generatePrediction,
    getPredictionsByType,
    getActivePredictions
  }
}

// MARKET INSIGHTS HOOK
export function useMarketInsights(market?: string, segment?: string) {
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const refreshInsights = useCallback(async () => {
    if (!market || !segment) return
    
    setLoading(true)
    setError(null)

    try {
      const newInsights = await analyticsService.generateMarketInsights(market, segment)
      setInsights(newInsights)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load market insights')
    } finally {
      setLoading(false)
    }
  }, [market, segment])

  useEffect(() => {
    refreshInsights()
  }, [refreshInsights])

  const getInsightsByType = useCallback((type: string) => {
    return insights.filter(insight => insight.type === type)
  }, [insights])

  const getHighImpactInsights = useCallback(() => {
    return insights.filter(insight => insight.impact >= 7).sort((a, b) => b.impact - a.impact)
  }, [insights])

  const getUrgentInsights = useCallback(() => {
    return insights.filter(insight => insight.urgency >= 7).sort((a, b) => b.urgency - a.urgency)
  }, [insights])

  return {
    insights,
    loading,
    error,
    lastRefresh,
    refreshInsights,
    getInsightsByType,
    getHighImpactInsights,
    getUrgentInsights
  }
}

// REAL-TIME METRICS HOOK
export function useRealTimeMetrics(metricType: MetricType) {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const streamIdRef = useRef<string | null>(null)

  const startStream = useCallback(async () => {
    try {
      setConnectionError(null)
      
      const streamId = await analyticsService.startRealTimeMetricStream(
        metricType,
        (metric: RealTimeMetric) => {
          setMetrics(prev => {
            const updated = [metric, ...prev.slice(0, 99)] // Keep last 100 metrics
            return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          })
        }
      )
      
      streamIdRef.current = streamId
      setIsConnected(true)
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Connection failed')
      setIsConnected(false)
    }
  }, [metricType])

  const stopStream = useCallback(() => {
    if (streamIdRef.current) {
      analyticsService.stopRealTimeMetricStream(streamIdRef.current)
      streamIdRef.current = null
      setIsConnected(false)
    }
  }, [])

  useEffect(() => {
    startStream()
    return () => stopStream()
  }, [startStream, stopStream])

  const getLatestValue = useCallback(() => {
    return metrics[0]?.value || 0
  }, [metrics])

  const getAverageValue = useCallback((count: number = 10) => {
    const recentMetrics = metrics.slice(0, count)
    if (recentMetrics.length === 0) return 0
    return recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length
  }, [metrics])

  const getTrend = useCallback(() => {
    if (metrics.length < 2) return 'stable'
    const current = metrics[0]?.value || 0
    const previous = metrics[1]?.value || 0
    const change = current - previous
    return change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
  }, [metrics])

  return {
    metrics,
    isConnected,
    connectionError,
    getLatestValue,
    getAverageValue,
    getTrend,
    startStream,
    stopStream
  }
}

// DASHBOARD MANAGEMENT HOOK
export function useDashboard(userId: string, userRole: string) {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const generateDashboard = useCallback(async (preferences?: Record<string, any>) => {
    setLoading(true)
    setError(null)

    try {
      const newDashboard = await analyticsService.generateIntelligentDashboard(
        userId,
        userRole,
        preferences
      )
      setDashboard(newDashboard)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dashboard generation failed')
    } finally {
      setLoading(false)
    }
  }, [userId, userRole])

  const updateDashboard = useCallback(async (updates: Partial<AnalyticsDashboard>) => {
    if (!dashboard) return

    setSaving(true)
    try {
      const updatedDashboard = { ...dashboard, ...updates, updatedAt: new Date() }
      setDashboard(updatedDashboard)
      
      // Save to backend
      // await saveDashboard(updatedDashboard)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save dashboard')
    } finally {
      setSaving(false)
    }
  }, [dashboard])

  const addWidget = useCallback((widget: any) => {
    if (!dashboard) return
    
    const updatedWidgets = [...dashboard.widgets, { ...widget, id: `widget_${Date.now()}` }]
    updateDashboard({ widgets: updatedWidgets })
  }, [dashboard, updateDashboard])

  const removeWidget = useCallback((widgetId: string) => {
    if (!dashboard) return
    
    const updatedWidgets = dashboard.widgets.filter(w => w.id !== widgetId)
    updateDashboard({ widgets: updatedWidgets })
  }, [dashboard, updateDashboard])

  const updateWidgetPosition = useCallback((widgetId: string, position: any) => {
    if (!dashboard) return
    
    const updatedWidgets = dashboard.widgets.map(w => 
      w.id === widgetId ? { ...w, position } : w
    )
    updateDashboard({ widgets: updatedWidgets })
  }, [dashboard, updateDashboard])

  useEffect(() => {
    if (userId && userRole) {
      generateDashboard()
    }
  }, [userId, userRole, generateDashboard])

  return {
    dashboard,
    loading,
    error,
    saving,
    generateDashboard,
    updateDashboard,
    addWidget,
    removeWidget,
    updateWidgetPosition
  }
}

// INTELLIGENT CHARTS HOOK
export function useIntelligentCharts() {
  const [charts, setCharts] = useState<Map<string, AnalyticsChart>>(new Map())
  const [generating, setGenerating] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<Map<string, string>>(new Map())

  const generateChart = useCallback(async (
    id: string,
    metricType: MetricType,
    timeframe: AnalyticsTimeframe,
    context?: Record<string, any>
  ): Promise<AnalyticsChart> => {
    setGenerating(prev => new Set([...prev, id]))
    setErrors(prev => {
      const updated = new Map(prev)
      updated.delete(id)
      return updated
    })

    try {
      const chart = await analyticsService.generateIntelligentChart(metricType, timeframe, context)
      setCharts(prev => new Map([...prev, [id, chart]]))
      return chart
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Chart generation failed'
      setErrors(prev => new Map([...prev, [id, errorMessage]]))
      throw err
    } finally {
      setGenerating(prev => {
        const updated = new Set(prev)
        updated.delete(id)
        return updated
      })
    }
  }, [])

  const getChart = useCallback((id: string) => {
    return charts.get(id)
  }, [charts])

  const isGeneratingChart = useCallback((id: string) => {
    return generating.has(id)
  }, [generating])

  const getChartError = useCallback((id: string) => {
    return errors.get(id)
  }, [errors])

  const refreshChart = useCallback(async (id: string) => {
    const chart = charts.get(id)
    if (!chart) return

    return generateChart(id, chart.metric, chart.timeframe)
  }, [charts, generateChart])

  return {
    charts: Array.from(charts.values()),
    generateChart,
    getChart,
    isGeneratingChart,
    getChartError,
    refreshChart
  }
}

// COMPETITIVE ANALYSIS HOOK
export function useCompetitiveAnalysis(targetMarket: string) {
  const [analyses, setAnalyses] = useState<CompetitorAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const runAnalysis = useCallback(async () => {
    if (!targetMarket) return

    setLoading(true)
    setError(null)

    try {
      const results = await analyticsService.analyzeCompetitors(targetMarket)
      setAnalyses(results)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Competitive analysis failed')
    } finally {
      setLoading(false)
    }
  }, [targetMarket])

  const getTopCompetitors = useCallback((count: number = 5) => {
    return analyses
      .sort((a, b) => b.marketShare - a.marketShare)
      .slice(0, count)
  }, [analyses])

  const getCompetitorStrengths = useCallback(() => {
    return analyses.flatMap(a => a.strengths).reduce((acc, strength) => {
      acc[strength] = (acc[strength] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [analyses])

  const getMarketGaps = useCallback(() => {
    return analyses.flatMap(a => a.opportunities)
  }, [analyses])

  useEffect(() => {
    runAnalysis()
  }, [runAnalysis])

  return {
    analyses,
    loading,
    error,
    lastUpdated,
    runAnalysis,
    getTopCompetitors,
    getCompetitorStrengths,
    getMarketGaps
  }
}

// PERFORMANCE REPORTS HOOK
export function usePerformanceReports() {
  const [reports, setReports] = useState<PerformanceReport[]>([])
  const [generating, setGenerating] = useState<Map<string, number>>(new Map()) // reportId -> progress
  const [error, setError] = useState<string | null>(null)

  const generateReport = useCallback(async (
    type: 'executive' | 'operational' | 'financial' | 'marketing' | 'sales',
    period: { start: Date; end: Date },
    recipients: string[]
  ): Promise<PerformanceReport> => {
    const reportId = `report_${Date.now()}`
    setGenerating(prev => new Map([...prev, [reportId, 0]]))
    setError(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerating(prev => {
          const current = prev.get(reportId) || 0
          if (current < 90) {
            return new Map([...prev, [reportId, current + 10]])
          }
          return prev
        })
      }, 500)

      const report = await analyticsService.generatePerformanceReport(type, period, recipients)
      
      clearInterval(progressInterval)
      setGenerating(prev => new Map([...prev, [reportId, 100]]))
      
      setReports(prev => [report, ...prev])
      
      // Clear progress after a delay
      setTimeout(() => {
        setGenerating(prev => {
          const updated = new Map(prev)
          updated.delete(reportId)
          return updated
        })
      }, 2000)
      
      return report
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Report generation failed')
      setGenerating(prev => {
        const updated = new Map(prev)
        updated.delete(reportId)
        return updated
      })
      throw err
    }
  }, [])

  const getReportsByType = useCallback((type: string) => {
    return reports.filter(r => r.type === type)
  }, [reports])

  const getScheduledReports = useCallback(() => {
    return reports.filter(r => r.schedule.enabled)
  }, [reports])

  const isGeneratingReport = useCallback((reportId?: string) => {
    if (reportId) {
      return generating.has(reportId)
    }
    return generating.size > 0
  }, [generating])

  const getReportProgress = useCallback((reportId: string) => {
    return generating.get(reportId) || 0
  }, [generating])

  return {
    reports,
    generating: Array.from(generating.keys()),
    error,
    generateReport,
    getReportsByType,
    getScheduledReports,
    isGeneratingReport,
    getReportProgress
  }
}

// ALERTS MANAGEMENT HOOK
export function useAnalyticsAlerts(userId: string) {
  const [alerts, setAlerts] = useState<AnalyticsAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setupAlerts = useCallback(async (preferences: Record<string, any>) => {
    setLoading(true)
    setError(null)

    try {
      const newAlerts = await analyticsService.setupPredictiveAlerts(userId, preferences)
      setAlerts(newAlerts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup alerts')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const getActiveAlerts = useCallback(() => {
    return alerts.filter(a => a.isActive && !a.resolvedAt)
  }, [alerts])

  const getAlertsByType = useCallback((type: AlertType) => {
    return alerts.filter(a => a.type === type)
  }, [alerts])

  const getHighPriorityAlerts = useCallback(() => {
    return alerts.filter(a => a.priority >= 7).sort((a, b) => b.priority - a.priority)
  }, [alerts])

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, resolvedAt: new Date() } : a
    ))
  }, [])

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId))
  }, [])

  useEffect(() => {
    if (userId) {
      setupAlerts({}) // Setup with default preferences
    }
  }, [userId, setupAlerts])

  return {
    alerts,
    loading,
    error,
    setupAlerts,
    getActiveAlerts,
    getAlertsByType,
    getHighPriorityAlerts,
    resolveAlert,
    dismissAlert
  }
}

// COMBINED ANALYTICS CONTEXT HOOK
export function useAdvancedAnalytics(
  userId: string,
  userRole: string,
  preferences: Record<string, any> = {}
) {
  const analytics = useAnalytics()
  const predictions = usePredictions()
  const marketInsights = useMarketInsights(preferences.market, preferences.segment)
  const dashboard = useDashboard(userId, userRole)
  const charts = useIntelligentCharts()
  const competitive = useCompetitiveAnalysis(preferences.market || 'general')
  const reports = usePerformanceReports()
  const alerts = useAnalyticsAlerts(userId)

  const refreshAll = useCallback(async () => {
    await Promise.all([
      analytics.refreshMetrics(),
      marketInsights.refreshInsights(),
      competitive.runAnalysis()
    ])
  }, [analytics, marketInsights, competitive])

  const isLoading = useMemo(() => {
    return analytics.loading || 
           predictions.isGenerating || 
           marketInsights.loading || 
           dashboard.loading || 
           competitive.loading || 
           reports.isGeneratingReport() ||
           alerts.loading
  }, [
    analytics.loading,
    predictions.isGenerating,
    marketInsights.loading,
    dashboard.loading,
    competitive.loading,
    reports.isGeneratingReport,
    alerts.loading
  ])

  const hasErrors = useMemo(() => {
    return !!(analytics.error || 
             predictions.error || 
             marketInsights.error || 
             dashboard.error || 
             competitive.error || 
             reports.error || 
             alerts.error)
  }, [
    analytics.error,
    predictions.error,
    marketInsights.error,
    dashboard.error,
    competitive.error,
    reports.error,
    alerts.error
  ])

  return {
    // Core analytics
    analytics,
    predictions,
    marketInsights,
    dashboard,
    charts,
    competitive,
    reports,
    alerts,
    
    // Aggregate state
    isLoading,
    hasErrors,
    refreshAll
  }
}