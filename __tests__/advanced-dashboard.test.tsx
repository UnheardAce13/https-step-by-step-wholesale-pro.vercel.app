/**
 * S.B.S.W.P 2.0 - ANALYTICS DASHBOARD COMPONENT TESTS
 * Comprehensive UI testing for market-dominating analytics interface
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AdvancedAnalyticsDashboard } from '@/components/analytics/advanced-dashboard'
import { useAdvancedAnalytics } from '@/hooks/use-analytics'

// Mock the analytics hook
jest.mock('@/hooks/use-analytics')
const mockUseAdvancedAnalytics = useAdvancedAnalytics as jest.MockedFunction<typeof useAdvancedAnalytics>

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }) => <div className={`card ${className}`}>{children}</div>,
  CardContent: ({ children }) => <div className="card-content">{children}</div>,
  CardHeader: ({ children }) => <div className="card-header">{children}</div>,
  CardTitle: ({ children }) => <div className="card-title">{children}</div>
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }) => (
    <button onClick={onClick} className={className}>{children}</button>
  )
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }) => <span className={`badge ${className}`}>{children}</span>
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }) => <div data-testid="tabs" data-default={defaultValue}>{children}</div>,
  TabsContent: ({ children, value }) => <div data-testid={`tab-content-${value}`}>{children}</div>,
  TabsList: ({ children }) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value, onClick }) => (
    <button data-testid={`tab-trigger-${value}`} onClick={onClick}>{children}</button>
  )
}))

describe('AdvancedAnalyticsDashboard', () => {
  const mockAnalyticsData = {
    analytics: {
      metrics: [
        { id: '1', name: 'Revenue', value: 2850000, change: 15.3, trend: 'up', format: 'currency' },
        { id: '2', name: 'Deals', value: 127, change: 8.7, trend: 'up', format: 'number' }
      ],
      loading: false,
      error: null,
      refreshMetrics: jest.fn()
    },
    predictions: {
      predictions: [],
      isGenerating: false,
      error: null,
      generatePrediction: jest.fn()
    },
    marketInsights: {
      insights: [],
      loading: false,
      error: null,
      refreshInsights: jest.fn()
    },
    dashboard: {
      dashboard: null,
      loading: false,
      error: null,
      generateDashboard: jest.fn()
    },
    competitive: {
      analyses: [],
      loading: false,
      error: null,
      runAnalysis: jest.fn()
    },
    alerts: {
      alerts: [],
      loading: false,
      error: null,
      setupAlerts: jest.fn()
    },
    isLoading: false,
    hasErrors: false,
    refreshAll: jest.fn()
  }

  beforeEach(() => {
    mockUseAdvancedAnalytics.mockReturnValue(mockAnalyticsData)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders dashboard header with title and description', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
    expect(screen.getByText(/AI-powered insights and predictive analytics/)).toBeInTheDocument()
  })

  it('displays key metrics with proper formatting', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('$2,850,000')).toBeInTheDocument()
    expect(screen.getByText('Active Deals')).toBeInTheDocument()
    expect(screen.getByText('127')).toBeInTheDocument()
  })

  it('shows AI-powered badge and features', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    expect(screen.getByText('AI POWERED')).toBeInTheDocument()
    expect(screen.getByText('AI Predictions & Market Intelligence')).toBeInTheDocument()
  })

  it('renders refresh button and handles click', async () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    const refreshButton = screen.getByText('Refresh All')
    fireEvent.click(refreshButton)
    
    await waitFor(() => {
      expect(mockAnalyticsData.refreshAll).toHaveBeenCalled()
    })
  })

  it('displays analytics tabs correctly', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-overview')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-performance')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-predictions')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-competitive')).toBeInTheDocument()
  })

  it('shows metric trends with appropriate styling', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    // Check for trend indicators
    const trendElements = document.querySelectorAll('[class*="text-green-400"]')
    expect(trendElements.length).toBeGreaterThan(0)
  })

  it('displays prediction confidence levels', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    expect(screen.getByText('92% confidence')).toBeInTheDocument()
    expect(screen.getByText('87% confidence')).toBeInTheDocument()
    expect(screen.getByText('94% confidence')).toBeInTheDocument()
  })

  it('handles loading state correctly', () => {
    mockUseAdvancedAnalytics.mockReturnValue({
      ...mockAnalyticsData,
      isLoading: true,
      analytics: {
        ...mockAnalyticsData.analytics,
        loading: true
      }
    })

    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    // Component should still render but may show loading indicators
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
  })

  it('handles error state gracefully', () => {
    mockUseAdvancedAnalytics.mockReturnValue({
      ...mockAnalyticsData,
      hasErrors: true,
      analytics: {
        ...mockAnalyticsData.analytics,
        error: 'Failed to load analytics data'
      }
    })

    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    // Component should still render despite errors
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <AdvancedAnalyticsDashboard 
        userId="test_user" 
        userRole="admin" 
        className="custom-class" 
      />
    )
    
    expect(container.firstChild).toHaveClass('space-y-6', 'custom-class')
  })

  it('formats currency values correctly', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    const currencyValues = screen.getAllByText(/^\$[\d,]+$/)
    expect(currencyValues.length).toBeGreaterThan(0)
    expect(currencyValues[0]).toHaveTextContent('$2,850,000')
  })

  it('formats percentage values correctly', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    const percentageValues = screen.getAllByText(/\d+\.\d+%/)
    expect(percentageValues.length).toBeGreaterThan(0)
  })

  it('shows appropriate icons for different metrics', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    // Icons should be rendered (mocked as components)
    expect(document.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('renders chart placeholders in overview tab', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    expect(screen.getByText('Revenue Trends')).toBeInTheDocument()
    expect(screen.getByText('Deal Distribution')).toBeInTheDocument()
    expect(screen.getByText('Advanced chart visualization')).toBeInTheDocument()
    expect(screen.getByText('Deal type distribution')).toBeInTheDocument()
  })

  it('maintains responsive design classes', () => {
    const { container } = render(
      <AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />
    )
    
    // Check for responsive grid classes
    const gridElements = container.querySelectorAll('[class*="grid-cols"]')
    expect(gridElements.length).toBeGreaterThan(0)
  })

  it('uses proper color coding for different metric types', () => {
    const { container } = render(
      <AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />
    )
    
    // Check for various color classes
    expect(container.querySelector('[class*="text-green-400"]')).toBeInTheDocument()
    expect(container.querySelector('[class*="text-blue-400"]')).toBeInTheDocument()
    expect(container.querySelector('[class*="text-purple-400"]')).toBeInTheDocument()
  })

  it('shows prediction timeframes correctly', () => {
    render(<AdvancedAnalyticsDashboard userId="test_user" userRole="admin" />)
    
    expect(screen.getByText('6 months')).toBeInTheDocument()
    expect(screen.getByText('Q4 2024')).toBeInTheDocument()
    expect(screen.getByText('Current')).toBeInTheDocument()
  })

  it('handles different user roles appropriately', () => {
    const { rerender } = render(
      <AdvancedAnalyticsDashboard userId="investor_123" userRole="investor" />
    )
    
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
    
    rerender(<AdvancedAnalyticsDashboard userId="admin_456" userRole="admin" />)
    
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
  })
})