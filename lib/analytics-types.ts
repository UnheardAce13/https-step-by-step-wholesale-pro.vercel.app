/**
 * S.B.S.W.P 2.0 - ADVANCED ANALYTICS & REPORTING SYSTEM
 * Predictive insights and comprehensive analytics that ANNIHILATES competition
 * The most intelligent real estate analytics platform ever built
 */

import { z } from 'zod'

// CORE ANALYTICS TYPES
export enum AnalyticsTimeframe {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  LAST_6_MONTHS = 'last_6_months',
  LAST_YEAR = 'last_year',
  ALL_TIME = 'all_time',
  CUSTOM = 'custom'
}

export enum MetricType {
  REVENUE = 'revenue',
  PROFIT = 'profit',
  ROI = 'roi',
  DEAL_COUNT = 'deal_count',
  CONVERSION_RATE = 'conversion_rate',
  AVERAGE_DEAL_SIZE = 'average_deal_size',
  TIME_TO_CLOSE = 'time_to_close',
  MARKET_PENETRATION = 'market_penetration',
  CUSTOMER_LIFETIME_VALUE = 'customer_lifetime_value',
  AGENT_PERFORMANCE = 'agent_performance',
  LEAD_QUALITY = 'lead_quality',
  PROPERTY_APPRECIATION = 'property_appreciation'
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  AREA = 'area',
  PIE = 'pie',
  DONUT = 'donut',
  SCATTER = 'scatter',
  HEATMAP = 'heatmap',
  GAUGE = 'gauge',
  FUNNEL = 'funnel',
  WATERFALL = 'waterfall'
}

export enum PredictionConfidence {
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  VERY_LOW = 'very_low'
}

export enum AlertType {
  MARKET_OPPORTUNITY = 'market_opportunity',
  RISK_WARNING = 'risk_warning',
  PERFORMANCE_ALERT = 'performance_alert',
  DEAL_RECOMMENDATION = 'deal_recommendation',
  AGENT_PERFORMANCE = 'agent_performance',
  REVENUE_TARGET = 'revenue_target',
  COMPLIANCE_ISSUE = 'compliance_issue',
  SYSTEM_NOTIFICATION = 'system_notification'
}

// ANALYTICS DATA STRUCTURES
export interface AnalyticsMetric {
  id: string
  name: string
  type: MetricType
  value: number
  previousValue?: number
  change: number
  changePercentage: number
  trend: 'up' | 'down' | 'stable'
  unit: string
  format: 'currency' | 'percentage' | 'number' | 'time'
  target?: number
  targetStatus: 'below' | 'on_track' | 'above'
  lastUpdated: Date
  confidence: PredictionConfidence
}

export interface ChartDataPoint {
  timestamp: Date
  value: number
  label?: string
  category?: string
  metadata?: Record<string, any>
}

export interface AnalyticsChart {
  id: string
  title: string
  subtitle?: string
  type: ChartType
  metric: MetricType
  timeframe: AnalyticsTimeframe
  data: ChartDataPoint[]
  options: {
    showLegend: boolean
    showGrid: boolean
    showTooltip: boolean
    colors: string[]
    height: number
    responsive: boolean
    animations: boolean
  }
  insights: ChartInsight[]
  lastUpdated: Date
}

export interface ChartInsight {
  type: 'trend' | 'anomaly' | 'forecast' | 'correlation' | 'recommendation'
  severity: 'info' | 'warning' | 'critical' | 'success'
  title: string
  description: string
  impact: number // 1-10 scale
  confidence: PredictionConfidence
  actionable: boolean
  suggestedActions?: string[]
}

export interface AnalyticsDashboard {
  id: string
  name: string
  description: string
  userId: string
  userRole: string
  layout: DashboardLayout
  widgets: AnalyticsWidget[]
  filters: DashboardFilter[]
  refreshRate: number // minutes
  isDefault: boolean
  isShared: boolean
  createdAt: Date
  updatedAt: Date
  lastViewed: Date
  viewCount: number
}

export interface DashboardLayout {
  columns: number
  rows: number
  responsive: boolean
  breakpoints: {
    mobile: number
    tablet: number
    desktop: number
  }
}

export interface AnalyticsWidget {
  id: string
  title: string
  type: 'metric' | 'chart' | 'table' | 'map' | 'alert' | 'kpi' | 'custom'
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config: WidgetConfig
  data: any
  refreshInterval: number
  isVisible: boolean
  permissions: string[]
}

export interface WidgetConfig {
  metricType?: MetricType
  chartType?: ChartType
  timeframe?: AnalyticsTimeframe
  filters?: Record<string, any>
  displayOptions?: {
    showTitle: boolean
    showSubtitle: boolean
    showBorder: boolean
    theme: 'light' | 'dark' | 'auto'
  }
  interactivity?: {
    clickable: boolean
    drillDown: boolean
    export: boolean
    fullscreen: boolean
  }
}

export interface DashboardFilter {
  id: string
  name: string
  type: 'date_range' | 'category' | 'numeric_range' | 'boolean' | 'multi_select'
  value: any
  options?: any[]
  required: boolean
  global: boolean // Apply to all widgets
}

// PREDICTIVE ANALYTICS
export interface PredictionModel {
  id: string
  name: string
  type: 'regression' | 'classification' | 'time_series' | 'clustering' | 'neural_network'
  target: MetricType
  features: string[]
  accuracy: number
  confidence: PredictionConfidence
  trainingData: {
    startDate: Date
    endDate: Date
    recordCount: number
    features: ModelFeature[]
  }
  lastTrained: Date
  nextTraining: Date
  version: string
  isActive: boolean
}

export interface ModelFeature {
  name: string
  type: 'numeric' | 'categorical' | 'boolean' | 'datetime'
  importance: number // 0-1 scale
  correlation: number
  description: string
}

export interface Prediction {
  id: string
  modelId: string
  type: 'market_forecast' | 'deal_outcome' | 'property_value' | 'revenue_projection' | 'risk_assessment'
  target: string
  predictedValue: number
  confidence: PredictionConfidence
  probability: number
  timeframe: {
    start: Date
    end: Date
  }
  factors: PredictionFactor[]
  scenarios: PredictionScenario[]
  recommendations: string[]
  createdAt: Date
  expiresAt: Date
}

export interface PredictionFactor {
  name: string
  impact: number // -1 to 1
  importance: number // 0-1
  description: string
  category: string
}

export interface PredictionScenario {
  name: string
  probability: number
  outcome: number
  description: string
  requiredConditions: string[]
}

// MARKET INTELLIGENCE
export interface MarketInsight {
  id: string
  type: 'opportunity' | 'risk' | 'trend' | 'forecast' | 'competitive_analysis'
  title: string
  description: string
  market: string
  segment: string
  impact: number // 1-10 scale
  urgency: number // 1-10 scale
  confidence: PredictionConfidence
  dataPoints: InsightDataPoint[]
  recommendations: InsightRecommendation[]
  sources: string[]
  createdAt: Date
  validUntil: Date
  tags: string[]
}

export interface InsightDataPoint {
  metric: string
  value: number
  change: number
  significance: number
  source: string
  timestamp: Date
}

export interface InsightRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  action: string
  expectedOutcome: string
  timeframe: string
  resources: string[]
  riskLevel: number
}

// COMPETITIVE ANALYSIS
export interface CompetitorAnalysis {
  id: string
  competitor: CompetitorProfile
  metrics: CompetitorMetric[]
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  marketShare: number
  positioningMap: PositioningData[]
  lastAnalyzed: Date
  analysisFrequency: 'daily' | 'weekly' | 'monthly'
}

export interface CompetitorProfile {
  id: string
  name: string
  type: 'direct' | 'indirect' | 'emerging'
  website: string
  description: string
  targetMarket: string[]
  keyFeatures: string[]
  pricingModel: string
  estimatedUsers: number
  estimatedRevenue: number
  founded: Date
  headquarters: string
  employees: number
}

export interface CompetitorMetric {
  name: string
  ourValue: number
  competitorValue: number
  advantage: number // positive = we're better
  importance: number // 1-10 scale
  category: string
  lastUpdated: Date
}

export interface PositioningData {
  dimension1: string
  dimension2: string
  x: number
  y: number
  size: number
  label: string
  category: string
}

// PERFORMANCE ANALYTICS
export interface PerformanceReport {
  id: string
  name: string
  type: 'executive' | 'operational' | 'financial' | 'marketing' | 'sales' | 'custom'
  period: {
    start: Date
    end: Date
  }
  recipients: string[]
  sections: ReportSection[]
  summary: ReportSummary
  recommendations: ReportRecommendation[]
  status: 'draft' | 'generating' | 'ready' | 'sent' | 'archived'
  schedule: ReportSchedule
  format: 'pdf' | 'html' | 'excel' | 'powerpoint'
  createdAt: Date
  generatedAt?: Date
  fileUrl?: string
}

export interface ReportSection {
  id: string
  title: string
  order: number
  type: 'metrics' | 'charts' | 'insights' | 'tables' | 'text' | 'images'
  content: any
  config: {
    includeCharts: boolean
    includeTables: boolean
    includeInsights: boolean
    pageBreak: boolean
  }
}

export interface ReportSummary {
  keyMetrics: AnalyticsMetric[]
  highlights: string[]
  concerns: string[]
  achievements: string[]
  targets: {
    met: number
    total: number
    percentage: number
  }
}

export interface ReportRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  title: string
  description: string
  expectedImpact: string
  timeframe: string
  owner: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

export interface ReportSchedule {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  time: string // HH:MM format
  dayOfWeek?: number // 0-6, Sunday = 0
  dayOfMonth?: number // 1-31
  timezone: string
  nextRun?: Date
}

// ALERTS & NOTIFICATIONS
export interface AnalyticsAlert {
  id: string
  title: string
  description: string
  type: AlertType
  severity: 'info' | 'warning' | 'error' | 'success'
  priority: number // 1-10 scale
  conditions: AlertCondition[]
  actions: AlertAction[]
  recipients: AlertRecipient[]
  isActive: boolean
  triggeredAt?: Date
  resolvedAt?: Date
  metadata: Record<string, any>
  createdAt: Date
  createdBy: string
}

export interface AlertCondition {
  metric: MetricType
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'change_gt' | 'change_lt'
  value: number
  timeframe: AnalyticsTimeframe
  consecutive?: number // Number of consecutive periods
}

export interface AlertAction {
  type: 'email' | 'sms' | 'push' | 'webhook' | 'slack' | 'teams'
  config: Record<string, any>
  enabled: boolean
}

export interface AlertRecipient {
  userId: string
  email: string
  phone?: string
  preferences: {
    email: boolean
    sms: boolean
    push: boolean
    inApp: boolean
  }
}

// REAL-TIME ANALYTICS
export interface RealTimeMetric {
  id: string
  name: string
  value: number
  timestamp: Date
  source: string
  tags: Record<string, string>
  quality: number // 0-1 scale
}

export interface StreamingData {
  metric: MetricType
  value: number
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AnalyticsEvent {
  id: string
  userId: string
  sessionId: string
  event: string
  properties: Record<string, any>
  timestamp: Date
  source: string
  deviceInfo?: {
    type: 'mobile' | 'tablet' | 'desktop'
    os: string
    browser: string
    screen: string
  }
  location?: {
    country: string
    region: string
    city: string
    lat?: number
    lon?: number
  }
}

// DATA QUALITY & VALIDATION
export interface DataQualityReport {
  id: string
  source: string
  period: {
    start: Date
    end: Date
  }
  metrics: {
    completeness: number
    accuracy: number
    consistency: number
    timeliness: number
    validity: number
    uniqueness: number
  }
  issues: DataQualityIssue[]
  recommendations: string[]
  score: number // 0-100
  generatedAt: Date
}

export interface DataQualityIssue {
  type: 'missing_data' | 'duplicate_data' | 'invalid_format' | 'outlier' | 'inconsistency'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  affectedRecords: number
  suggestion: string
  autoFixable: boolean
}

// VALIDATION SCHEMAS
export const AnalyticsMetricSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(MetricType),
  value: z.number(),
  unit: z.string(),
  format: z.enum(['currency', 'percentage', 'number', 'time']),
  target: z.number().optional()
})

export const DashboardFilterSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['date_range', 'category', 'numeric_range', 'boolean', 'multi_select']),
  value: z.any(),
  required: z.boolean(),
  global: z.boolean()
})

export const AlertConditionSchema = z.object({
  metric: z.nativeEnum(MetricType),
  operator: z.enum(['gt', 'lt', 'eq', 'gte', 'lte', 'change_gt', 'change_lt']),
  value: z.number(),
  timeframe: z.nativeEnum(AnalyticsTimeframe)
})

// TYPE EXPORTS
export type AnalyticsMetricData = z.infer<typeof AnalyticsMetricSchema>
export type DashboardFilterData = z.infer<typeof DashboardFilterSchema>
export type AlertConditionData = z.infer<typeof AlertConditionSchema>

// CONSTANTS
export const METRIC_UNITS = {
  [MetricType.REVENUE]: '$',
  [MetricType.PROFIT]: '$',
  [MetricType.ROI]: '%',
  [MetricType.DEAL_COUNT]: '',
  [MetricType.CONVERSION_RATE]: '%',
  [MetricType.AVERAGE_DEAL_SIZE]: '$',
  [MetricType.TIME_TO_CLOSE]: 'days',
  [MetricType.MARKET_PENETRATION]: '%',
  [MetricType.CUSTOMER_LIFETIME_VALUE]: '$',
  [MetricType.AGENT_PERFORMANCE]: '/10',
  [MetricType.LEAD_QUALITY]: '/10',
  [MetricType.PROPERTY_APPRECIATION]: '%'
} as const

export const CHART_COLORS = {
  primary: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
  success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  warning: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
  error: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
  info: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  gradient: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ]
} as const

export const CONFIDENCE_COLORS = {
  [PredictionConfidence.VERY_HIGH]: '#10B981',
  [PredictionConfidence.HIGH]: '#34D399',
  [PredictionConfidence.MEDIUM]: '#F59E0B',
  [PredictionConfidence.LOW]: '#F97316',
  [PredictionConfidence.VERY_LOW]: '#EF4444'
} as const