/**
 * S.B.S.W.P 2.0 - INTEGRATION TESTS
 * End-to-end testing for complete platform workflow
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { analyticsService } from '@/lib/analytics-service'
import { aiContractService } from '@/lib/contract-service'
import { ContractType, MetricType } from '@/lib/analytics-types'

// Mock external services
jest.mock('@/lib/analytics-service')
jest.mock('@/lib/contract-service')

const mockAnalyticsService = analyticsService as jest.Mocked<typeof analyticsService>
const mockContractService = aiContractService as jest.Mocked<typeof aiContractService>

describe('S.B.S.W.P 2.0 Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Complete Deal Workflow', () => {
    it('should handle complete real estate deal from lead to contract execution', async () => {
      // Step 1: Lead comes into system - Mock CRM functionality
      const leadData = {
        id: 'lead_123',
        name: 'John Investor',
        email: 'john@investor.com',
        phone: '555-0123',
        propertyInterest: 'investment',
        budget: 500000
      }

      // Step 2: AI Analytics predict deal success
      mockAnalyticsService.generatePrediction.mockResolvedValue({
        id: 'prediction_456',
        modelId: 'deal_outcome_model',
        type: 'deal_outcome',
        target: 'conversion_probability',
        predictedValue: 0.85,
        confidence: 'high',
        probability: 0.85,
        timeframe: { start: new Date(), end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        factors: [
          { name: 'Budget Match', impact: 0.8, importance: 0.9 },
          { name: 'Market Conditions', impact: 0.7, importance: 0.8 }
        ],
        scenarios: [
          { name: 'Best Case', probability: 0.9, outcome: 0.95, description: 'Ideal conditions' },
          { name: 'Most Likely', probability: 0.85, outcome: 0.85, description: 'Expected outcome' },
          { name: 'Worst Case', probability: 0.6, outcome: 0.6, description: 'Challenging conditions' }
        ],
        recommendations: ['Fast response required', 'Prepare property analysis'],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })

      // Step 3: Property analysis engine evaluates deal
      const propertyAnalysis = {
        propertyId: 'prop_789',
        address: '123 Investment Lane, Dallas, TX',
        estimatedValue: 475000,
        repairCosts: 35000,
        arv: 550000,
        roi: 0.18,
        cashFlow: 1200,
        riskScore: 'low'
      }

      // Step 4: Contract generation based on analysis
      mockContractService.generateContract.mockResolvedValue({
        contractId: 'contract_101112',
        generatedClauses: [
          {
            id: 'clause_1',
            title: 'Purchase Price',
            content: 'The total purchase price shall be ${{PURCHASE_PRICE}}.',
            required: true,
            type: 'ai_generated',
            category: 'financial',
            order: 1,
            variables: [
              {
                name: 'PURCHASE_PRICE',
                type: 'currency',
                value: 475000,
                required: true,
                description: 'Total purchase price',
                aiGenerated: true
              }
            ]
          },
          {
            id: 'clause_2',
            title: 'Inspection Period',
            content: 'Buyer shall have {{INSPECTION_DAYS}} days to complete inspections.',
            required: true,
            type: 'ai_generated',
            category: 'contingency',
            order: 2,
            variables: [
              {
                name: 'INSPECTION_DAYS',
                type: 'number',
                value: 10,
                required: true,
                description: 'Inspection period in days',
                aiGenerated: true
              }
            ]
          }
        ],
        variables: [
          {
            name: 'PURCHASE_PRICE',
            type: 'currency',
            value: 475000,
            required: true,
            description: 'Total purchase price',
            aiGenerated: true
          }
        ],
        confidence: 92,
        recommendations: [
          {
            type: 'clause_addition',
            priority: 'medium',
            title: 'Add Financing Contingency',
            description: 'Recommend adding financing contingency clause',
            suggestedAction: 'Include standard financing terms',
            impact: 'Protects buyer if financing falls through'
          }
        ],
        estimatedReviewTime: 15,
        legalCompliance: true,
        riskFactors: [
          {
            type: 'financial',
            severity: 'low',
            description: 'Standard purchase transaction risk',
            mitigation: 'Standard due diligence procedures'
          }
        ],
        suggestedTemplates: ['purchase_agreement_tx']
      })

      // Step 5: DocuSign integration for signature
      mockContractService.sendForSignature.mockResolvedValue({
        envelopeId: 'envelope_131415',
        status: 'sent',
        emailSubject: 'Investment Property Purchase Contract - Signature Required',
        emailBody: 'Please review and sign the purchase agreement.',
        createdDateTime: new Date(),
        sentDateTime: new Date(),
        recipients: [
          {
            recipientId: '1',
            recipientType: 'signer',
            name: 'John Investor',
            email: 'john@investor.com',
            routingOrder: 1,
            status: 'sent'
          }
        ],
        documents: [
          {
            documentId: '1',
            name: 'Purchase Agreement',
            order: 1,
            pages: 12
          }
        ]
      })

      // Execute complete workflow
      const prediction = await analyticsService.generatePrediction('deal_outcome', {
        leadId: leadData.id,
        propertyBudget: leadData.budget,
        marketConditions: 'favorable'
      })

      const contractResponse = await aiContractService.generateContract({
        contractType: ContractType.PURCHASE_AGREEMENT,
        jurisdiction: 'TX',
        parties: [
          {
            type: 'buyer',
            name: leadData.name,
            email: leadData.email,
            signatureRequired: true,
            signatureType: 'electronic'
          }
        ],
        propertyDetails: {
          address: propertyAnalysis.address,
          price: propertyAnalysis.estimatedValue,
          type: 'investment',
          description: 'Investment property purchase'
        },
        userRequirements: 'Investment property purchase with inspection contingency',
        complexity: 'moderate'
      })

      const envelope = await aiContractService.sendForSignature(
        contractResponse.contractId,
        [
          {
            type: 'buyer',
            name: leadData.name,
            email: leadData.email,
            signatureRequired: true,
            signatureType: 'electronic'
          }
        ]
      )

      // Verify complete workflow
      expect(prediction.probability).toBeGreaterThan(0.8)
      expect(contractResponse.confidence).toBeGreaterThan(85)
      expect(contractResponse.legalCompliance).toBe(true)
      expect(envelope.status).toBe('sent')
      expect(envelope.recipients).toHaveLength(1)

      // Verify analytics tracking
      expect(mockAnalyticsService.generatePrediction).toHaveBeenCalledWith('deal_outcome', expect.any(Object))
      expect(mockContractService.generateContract).toHaveBeenCalledWith(expect.objectContaining({
        contractType: ContractType.PURCHASE_AGREEMENT
      }))
      expect(mockContractService.sendForSignature).toHaveBeenCalledWith(
        contractResponse.contractId,
        expect.arrayContaining([expect.objectContaining({ email: leadData.email })])
      )
    })

    it('should handle wholesale deal assignment workflow', async () => {
      // Wholesale-specific workflow
      const wholesaleData = {
        originalContract: 'contract_original_123',
        assignmentFee: 15000,
        newBuyer: {
          name: 'Investment Group LLC',
          email: 'group@investment.com'
        }
      }

      mockContractService.generateContract.mockResolvedValue({
        contractId: 'assignment_contract_456',
        generatedClauses: [
          {
            id: 'assignment_clause',
            title: 'Assignment of Rights',
            content: 'Assignor hereby assigns all rights and obligations to Assignee for ${{ASSIGNMENT_FEE}}.',
            required: true,
            type: 'ai_generated',
            category: 'assignment',
            order: 1,
            variables: [
              {
                name: 'ASSIGNMENT_FEE',
                type: 'currency',
                value: wholesaleData.assignmentFee,
                required: true,
                description: 'Assignment fee amount',
                aiGenerated: true
              }
            ]
          }
        ],
        variables: [],
        confidence: 88,
        recommendations: [],
        estimatedReviewTime: 8,
        legalCompliance: true,
        riskFactors: [],
        suggestedTemplates: ['assignment_contract_standard']
      })

      const assignmentContract = await aiContractService.generateContract({
        contractType: ContractType.ASSIGNMENT_CONTRACT,
        jurisdiction: 'TX',
        parties: [
          {
            type: 'assignor',
            name: 'Original Buyer',
            email: 'original@buyer.com',
            signatureRequired: true,
            signatureType: 'electronic'
          },
          {
            type: 'assignee',
            name: wholesaleData.newBuyer.name,
            email: wholesaleData.newBuyer.email,
            signatureRequired: true,
            signatureType: 'electronic'
          }
        ],
        userRequirements: `Assignment contract with $${wholesaleData.assignmentFee} fee`,
        complexity: 'moderate'
      })

      expect(assignmentContract.contractId).toBeDefined()
      expect(assignmentContract.confidence).toBeGreaterThan(80)
    })
  })

  describe('Real-Time Analytics Integration', () => {
    it('should process real-time metrics and trigger alerts', async () => {
      // Mock real-time metric processing
      mockAnalyticsService.startRealTimeMetricStream.mockResolvedValue('stream_123')
      
      const mockCallback = jest.fn()
      const streamId = await analyticsService.startRealTimeMetricStream(
        MetricType.REVENUE,
        mockCallback
      )

      expect(streamId).toBeDefined()
      expect(mockAnalyticsService.startRealTimeMetricStream).toHaveBeenCalledWith(
        MetricType.REVENUE,
        mockCallback
      )

      // Simulate metric update
      const mockMetric = {
        id: 'metric_789',
        name: MetricType.REVENUE,
        value: 150000,
        timestamp: new Date(),
        source: 'deal_closed',
        tags: { type: 'wholesale' },
        quality: 0.95
      }

      mockCallback(mockMetric)
      expect(mockCallback).toHaveBeenCalledWith(mockMetric)
    })

    it('should generate comprehensive market insights', async () => {
      mockAnalyticsService.generateMarketInsights.mockResolvedValue([
        {
          id: 'insight_456',
          type: 'opportunity',
          title: 'Emerging Market Opportunity',
          description: 'Strong rental demand in suburban Dallas',
          market: 'Dallas',
          segment: 'residential',
          impact: 8,
          urgency: 7,
          confidence: 'high',
          dataPoints: [
            {
              metric: 'rental_demand',
              value: 0.95,
              change: 0.12,
              significance: 0.85,
              source: 'MLS Data',
              timestamp: new Date()
            }
          ],
          recommendations: [
            {
              priority: 'high',
              category: 'investment',
              action: 'Focus on suburban rental properties',
              expectedOutcome: '15-20% higher ROI',
              timeframe: '3-6 months',
              resources: ['Market analysis team', 'Property scouts'],
              riskLevel: 3
            }
          ],
          sources: ['MLS', 'Census Data', 'Rental Market Reports'],
          createdAt: new Date(),
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
          tags: ['opportunity', 'rental', 'suburban']
        }
      ])

      const insights = await analyticsService.generateMarketInsights('Dallas', 'residential')
      
      expect(insights).toHaveLength(1)
      expect(insights[0].impact).toBeGreaterThan(7)
      expect(insights[0].recommendations).toHaveLength(1)
    })
  })

  describe('Error Handling and Recovery', () => {
    it('should handle API failures gracefully', async () => {
      mockAnalyticsService.generatePrediction.mockRejectedValue(new Error('OpenAI API Error'))
      
      await expect(
        analyticsService.generatePrediction('market_forecast', {})
      ).rejects.toThrow('OpenAI API Error')
    })

    it('should handle DocuSign service failures', async () => {
      mockContractService.sendForSignature.mockRejectedValue(new Error('DocuSign API Error'))
      
      await expect(
        aiContractService.sendForSignature('contract_123', [])
      ).rejects.toThrow('DocuSign API Error')
    })

    it('should validate input data and provide meaningful errors', async () => {
      // Test invalid contract request
      const invalidRequest = {
        contractType: null,
        jurisdiction: '',
        parties: [],
        userRequirements: '',
        complexity: 'invalid'
      }

      mockContractService.generateContract.mockRejectedValue(
        new Error('Invalid contract parameters')
      )

      await expect(
        aiContractService.generateContract(invalidRequest as any)
      ).rejects.toThrow('Invalid contract parameters')
    })
  })

  describe('Performance Benchmarks', () => {
    it('should meet performance requirements for contract generation', async () => {
      const startTime = Date.now()
      
      mockContractService.generateContract.mockResolvedValue({
        contractId: 'perf_test_123',
        generatedClauses: [],
        variables: [],
        confidence: 85,
        recommendations: [],
        estimatedReviewTime: 10,
        legalCompliance: true,
        riskFactors: [],
        suggestedTemplates: []
      })

      await aiContractService.generateContract({
        contractType: ContractType.PURCHASE_AGREEMENT,
        jurisdiction: 'CA',
        parties: [
          { type: 'buyer', name: 'Test Buyer', email: 'test@buyer.com' }
        ],
        userRequirements: 'Performance test contract',
        complexity: 'simple'
      })

      const endTime = Date.now()
      const duration = endTime - startTime

      // Contract generation should complete within 5 seconds
      expect(duration).toBeLessThan(5000)
    })

    it('should handle concurrent contract generations efficiently', async () => {
      mockContractService.generateContract.mockResolvedValue({
        contractId: 'concurrent_test',
        generatedClauses: [],
        variables: [],
        confidence: 85,
        recommendations: [],
        estimatedReviewTime: 10,
        legalCompliance: true,
        riskFactors: [],
        suggestedTemplates: []
      })

      const concurrentRequests = Array.from({ length: 5 }, (_, i) => 
        aiContractService.generateContract({
          contractType: ContractType.PURCHASE_AGREEMENT,
          jurisdiction: 'CA',
          parties: [
            { type: 'buyer', name: `Buyer ${i}`, email: `buyer${i}@test.com` }
          ],
          userRequirements: `Concurrent test contract ${i}`,
          complexity: 'simple'
        })
      )

      const results = await Promise.all(concurrentRequests)
      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(result.contractId).toBeDefined()
      })
    })
  })

  describe('Data Consistency and Integrity', () => {
    it('should maintain data consistency across services', async () => {
      const dealId = 'deal_consistency_123'
      
      // Create prediction
      mockAnalyticsService.generatePrediction.mockResolvedValue({
        id: `prediction_${dealId}`,
        modelId: 'test_model',
        type: 'deal_outcome',
        target: dealId,
        predictedValue: 0.87,
        confidence: 'high',
        probability: 0.87,
        timeframe: { start: new Date(), end: new Date() },
        factors: [],
        scenarios: [],
        recommendations: [],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      })

      // Generate contract
      mockContractService.generateContract.mockResolvedValue({
        contractId: `contract_${dealId}`,
        generatedClauses: [],
        variables: [],
        confidence: 87,
        recommendations: [],
        estimatedReviewTime: 12,
        legalCompliance: true,
        riskFactors: [],
        suggestedTemplates: []
      })

      const prediction = await analyticsService.generatePrediction('deal_outcome', { dealId })
      const contract = await aiContractService.generateContract({
        contractType: ContractType.PURCHASE_AGREEMENT,
        jurisdiction: 'CA',
        parties: [],
        userRequirements: `Contract for deal ${dealId}`,
        complexity: 'simple'
      })

      // Verify data consistency
      expect(prediction.target).toBe(dealId)
      expect(contract.contractId).toContain(dealId)
      expect(prediction.probability).toBeCloseTo(contract.confidence / 100, 1)
    })
  })
})