/**
 * S.B.S.W.P 2.0 - ANALYTICS SERVICE TESTS
 * Comprehensive testing for market-dominating analytics engine
 */

import { analyticsService } from '@/lib/analytics-service'
import { MetricType, PredictionConfidence } from '@/lib/analytics-types'

// Mock OpenAI API
global.fetch = jest.fn()

describe('AdvancedAnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              value: 100000,
              probability: 0.85,
              factors: [
                { name: 'Market Trend', impact: 0.7, importance: 0.8 },
                { name: 'Economic Indicators', impact: 0.6, importance: 0.9 }
              ],
              modelAccuracy: 0.92
            })
          }
        }]
      })
    })
  })

  describe('Prediction Generation', () => {
    it('should generate market forecast with high accuracy', async () => {
      const prediction = await analyticsService.generatePrediction(
        'market_forecast',
        {
          target: 'property_appreciation',
          timeframeDays: 180,
          complexity: 'moderate'
        }
      )

      expect(prediction).toBeDefined()
      expect(prediction.type).toBe('market_forecast')
      expect(prediction.predictedValue).toBe(100000)
      expect(prediction.confidence).toBe(PredictionConfidence.VERY_HIGH)
      expect(prediction.factors).toHaveLength(2)
      expect(prediction.recommendations).toBeDefined()
    })

    it('should handle revenue projection predictions', async () => {
      const prediction = await analyticsService.generatePrediction(
        'revenue_projection',
        {
          currentRevenue: 2500000,
          growthRate: 0.15,
          timeframeDays: 365
        }
      )

      expect(prediction.type).toBe('revenue_projection')
      expect(prediction.timeframe.start).toBeInstanceOf(Date)
      expect(prediction.timeframe.end).toBeInstanceOf(Date)
    })

    it('should assess risk with appropriate confidence levels', async () => {
      const prediction = await analyticsService.generatePrediction(
        'risk_assessment',
        {
          portfolioValue: 5000000,
          marketConditions: 'volatile',
          riskTolerance: 'moderate'
        }
      )

      expect(prediction.type).toBe('risk_assessment')
      expect(prediction.confidence).toBeOneOf([
        PredictionConfidence.LOW,
        PredictionConfidence.MEDIUM,
        PredictionConfidence.HIGH,
        PredictionConfidence.VERY_HIGH
      ])
    })

    it('should handle prediction errors gracefully', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

      await expect(
        analyticsService.generatePrediction('market_forecast', {})
      ).rejects.toThrow('Failed to generate prediction')
    })
  })

  describe('Market Insights Generation', () => {
    beforeEach(() => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{
            message: {
              content: JSON.stringify({
                insights: [
                  {
                    type: 'opportunity',
                    title: 'Emerging Market Opportunity',
                    description: 'Strong growth potential in suburban markets',
                    impact: 8,
                    urgency: 7,
                    confidence: PredictionConfidence.HIGH,
                    dataPoints: [],
                    recommendations: [],
                    sources: ['MLS Data', 'Market Analysis'],
                    tags: ['growth', 'suburban', 'opportunity']
                  }
                ]
              })
            }
          }]
        })
      })
    })

    it('should generate comprehensive market insights', async () => {
      const insights = await analyticsService.generateMarketInsights('California', 'residential')

      expect(insights).toHaveLength(1)
      expect(insights[0].market).toBe('California')
      expect(insights[0].segment).toBe('residential')
      expect(insights[0].type).toBe('opportunity')
      expect(insights[0].impact).toBeGreaterThanOrEqual(1)
      expect(insights[0].urgency).toBeGreaterThanOrEqual(1)
    })

    it('should handle market analysis API failures', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Market API Down'))

      await expect(
        analyticsService.generateMarketInsights('Texas', 'commercial')
      ).rejects.toThrow('Failed to generate market insights')
    })
  })

  describe('Real-Time Metrics', () => {
    it('should start real-time metric stream', async () => {
      const mockCallback = jest.fn()
      
      const streamId = await analyticsService.startRealTimeMetricStream(
        MetricType.REVENUE,
        mockCallback
      )

      expect(streamId).toMatch(/^stream_\d+_[a-z0-9]+$/)
      expect(global.WebSocket).toHaveBeenCalled()
    })

    it('should stop real-time metric stream', () => {
      const streamId = 'test_stream_123'
      const mockClose = jest.fn()
      
      analyticsService.realtimeConnections.set(streamId, { close: mockClose } as any)
      analyticsService.stopRealTimeMetricStream(streamId)

      expect(mockClose).toHaveBeenCalled()
    })
  })

  describe('Dashboard Generation', () => {
    it('should generate intelligent dashboard for admin users', async () => {
      const dashboard = await analyticsService.generateIntelligentDashboard(
        'admin_123',
        'admin',
        { theme: 'dark', autoRefresh: true }
      )

      expect(dashboard.userId).toBe('admin_123')
      expect(dashboard.userRole).toBe('admin')
      expect(dashboard.name).toContain('AI-Optimized Dashboard')
      expect(dashboard.widgets).toBeDefined()
      expect(dashboard.filters).toBeDefined()
      expect(dashboard.layout).toBeDefined()
    })

    it('should customize dashboard for different user roles', async () => {
      const investorDashboard = await analyticsService.generateIntelligentDashboard(
        'investor_456',
        'investor'
      )

      expect(investorDashboard.userRole).toBe('investor')
      expect(investorDashboard.refreshRate).toBeGreaterThan(0)
    })
  })

  describe('Chart Generation', () => {
    it('should generate intelligent charts with optimal visualization', async () => {
      const chart = await analyticsService.generateIntelligentChart(
        MetricType.REVENUE,
        'last_30_days',
        { showTrends: true }
      )

      expect(chart.metric).toBe(MetricType.REVENUE)
      expect(chart.timeframe).toBe('last_30_days')
      expect(chart.type).toBeDefined()
      expect(chart.data).toBeDefined()
      expect(chart.insights).toBeDefined()
      expect(chart.options.responsive).toBe(true)
    })

    it('should select appropriate chart types for different metrics', async () => {
      const revenueChart = await analyticsService.generateIntelligentChart(
        MetricType.REVENUE,
        'last_90_days'
      )

      const dealChart = await analyticsService.generateIntelligentChart(
        MetricType.DEAL_COUNT,
        'last_30_days'
      )

      expect(revenueChart.type).toBeDefined()
      expect(dealChart.type).toBeDefined()
      expect(revenueChart.title).toContain('Revenue')
      expect(dealChart.title).toContain('Deal Count')
    })
  })

  describe('Performance Reporting', () => {
    it('should generate executive performance reports', async () => {
      const report = await analyticsService.generatePerformanceReport(
        'executive',
        {
          start: new Date('2024-01-01'),
          end: new Date('2024-03-31')
        },
        ['ceo@sbswp.com', 'cfo@sbswp.com']
      )

      expect(report.type).toBe('executive')
      expect(report.recipients).toContain('ceo@sbswp.com')
      expect(report.sections).toBeDefined()
      expect(report.summary).toBeDefined()
      expect(report.recommendations).toBeDefined()
      expect(report.status).toBe('generating')
    })

    it('should generate operational reports with detailed metrics', async () => {
      const report = await analyticsService.generatePerformanceReport(
        'operational',
        {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31')
        },
        ['operations@sbswp.com']
      )

      expect(report.type).toBe('operational')
      expect(report.format).toBe('pdf')
    })
  })

  describe('Alert System', () => {
    it('should setup predictive alerts for users', async () => {
      const alerts = await analyticsService.setupPredictiveAlerts('user_789', {
        revenueThreshold: 1000000,
        riskTolerance: 'moderate'
      })

      expect(alerts).toBeInstanceOf(Array)
      expect(alerts.length).toBeGreaterThan(0)
      alerts.forEach(alert => {
        expect(alert.isActive).toBe(true)
        expect(alert.conditions).toBeDefined()
        expect(alert.actions).toBeDefined()
      })
    })
  })

  describe('Data Quality Assessment', () => {
    it('should assess data quality accurately', () => {
      const highQualityData = [
        { value: 100, timestamp: new Date() },
        { value: 150, timestamp: new Date() },
        { value: 120, timestamp: new Date() }
      ]

      const quality = analyticsService.assessDataQuality(highQualityData)
      expect(quality).toBeGreaterThan(0)
      expect(quality).toBeLessThanOrEqual(1)
    })

    it('should handle empty or invalid data', () => {
      expect(analyticsService.assessDataQuality(null)).toBe(0)
      expect(analyticsService.assessDataQuality([])).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Confidence Calculation', () => {
    it('should calculate prediction confidence based on multiple factors', () => {
      const mockPrediction = { modelAccuracy: 0.9 }
      const mockHistoricalData = [
        { value: 100 }, { value: 110 }, { value: 105 }
      ]

      const confidence = analyticsService.calculatePredictionConfidence(
        mockPrediction,
        mockHistoricalData
      )

      expect([
        PredictionConfidence.VERY_LOW,
        PredictionConfidence.LOW,
        PredictionConfidence.MEDIUM,
        PredictionConfidence.HIGH,
        PredictionConfidence.VERY_HIGH
      ]).toContain(confidence)
    })
  })
})