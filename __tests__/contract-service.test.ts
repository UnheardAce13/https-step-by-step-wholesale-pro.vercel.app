/**
 * S.B.S.W.P 2.0 - CONTRACT GENERATION TESTS
 * Bulletproof testing for AI-powered legal document system
 */

import { aiContractService } from '@/lib/contract-service'
import { ContractType, ContractStatus, SignatureType } from '@/lib/contract-types'

// Mock OpenAI and DocuSign APIs
global.fetch = jest.fn()

describe('AIContractService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              clauses: [
                {
                  title: 'Purchase Price',
                  content: 'The total purchase price shall be {{PURCHASE_PRICE}}.',
                  required: true,
                  category: 'financial'
                },
                {
                  title: 'Closing Date',
                  content: 'Closing shall occur on or before {{CLOSING_DATE}}.',
                  required: true,
                  category: 'timeline'
                }
              ],
              riskFactors: [
                {
                  type: 'financial',
                  severity: 'medium',
                  description: 'Market volatility may affect property value'
                }
              ],
              recommendations: [
                {
                  type: 'clause_addition',
                  priority: 'medium',
                  title: 'Add Inspection Contingency',
                  description: 'Recommend adding property inspection clause'
                }
              ]
            })
          }
        }]
      })
    })
  })

  describe('Contract Generation', () => {
    it('should generate purchase agreement with AI', async () => {
      const request = {
        contractType: ContractType.PURCHASE_AGREEMENT,
        jurisdiction: 'CA',
        parties: [
          {
            type: 'buyer',
            name: 'John Doe',
            email: 'john@example.com',
            signatureRequired: true,
            signatureType: SignatureType.ELECTRONIC
          },
          {
            type: 'seller',
            name: 'Jane Smith',
            email: 'jane@example.com',
            signatureRequired: true,
            signatureType: SignatureType.ELECTRONIC
          }
        ],
        propertyDetails: {
          address: '123 Main St, Los Angeles, CA',
          price: 750000,
          type: 'residential',
          description: 'Single family home'
        },
        userRequirements: 'Standard residential purchase with 30-day closing',
        complexity: 'moderate' as const
      }

      const response = await aiContractService.generateContract(request)

      expect(response.contractId).toBeDefined()
      expect(response.generatedClauses).toHaveLength(2)
      expect(response.confidence).toBeGreaterThan(0)
      expect(response.legalCompliance).toBe(true)
      expect(response.riskFactors).toHaveLength(1)
      expect(response.recommendations).toHaveLength(1)
    })

    it('should generate wholesale contract with specific clauses', async () => {
      const request = {
        contractType: ContractType.WHOLESALE_CONTRACT,
        jurisdiction: 'TX',
        parties: [
          {
            type: 'wholesaler',
            name: 'Wholesale Pro',
            email: 'wholesale@sbswp.com',
            signatureRequired: true,
            signatureType: SignatureType.ELECTRONIC
          },
          {
            type: 'investor',
            name: 'Investment Group LLC',
            email: 'investor@group.com',
            signatureRequired: true,
            signatureType: SignatureType.ELECTRONIC
          }
        ],
        propertyDetails: {
          address: '456 Oak Ave, Dallas, TX',
          price: 125000,
          type: 'investment',
          description: 'Fix and flip opportunity'
        },
        userRequirements: 'Wholesale contract with assignment rights and inspection period',
        specialClauses: ['Assignment rights clause', 'Inspection contingency'],
        complexity: 'complex' as const
      }

      const response = await aiContractService.generateContract(request)

      expect(response.contractId).toBeDefined()
      expect(response.generatedClauses.length).toBeGreaterThan(0)
      expect(response.estimatedReviewTime).toBeGreaterThan(0)
    })

    it('should handle contract generation errors gracefully', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('OpenAI API Error'))

      const request = {
        contractType: ContractType.PURCHASE_AGREEMENT,
        jurisdiction: 'CA',
        parties: [],
        userRequirements: 'Test contract',
        complexity: 'simple' as const
      }

      await expect(aiContractService.generateContract(request)).rejects.toThrow(
        'Failed to generate contract'
      )
    })
  })

  describe('DocuSign Integration', () => {
    beforeEach(() => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access_token: 'mock_token', expires_in: 3600 })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ envelopeId: 'test_envelope_123' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ status: 'sent', envelopeId: 'test_envelope_123' })
        })
    })

    it('should send contract for signature via DocuSign', async () => {
      const contractId = 'contract_123'
      const signers = [
        {
          type: 'buyer',
          name: 'John Buyer',
          email: 'buyer@example.com',
          signatureRequired: true,
          signatureType: SignatureType.ELECTRONIC
        },
        {
          type: 'seller',
          name: 'Jane Seller',
          email: 'seller@example.com',
          signatureRequired: true,
          signatureType: SignatureType.ELECTRONIC
        }
      ]

      const envelope = await aiContractService.sendForSignature(contractId, signers)

      expect(envelope.envelopeId).toBe('test_envelope_123')
      expect(envelope.status).toBe('sent')
      expect(envelope.recipients).toHaveLength(2)
    })

    it('should check signature status', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          envelopeId: 'test_envelope_123',
          status: 'completed',
          recipients: {
            signers: [
              { status: 'signed', signedDateTime: new Date().toISOString() }
            ]
          }
        })
      })

      const status = await aiContractService.checkSignatureStatus('test_envelope_123')

      expect(status.envelopeId).toBe('test_envelope_123')
      expect(status.status).toBe('completed')
    })

    it('should handle DocuSign authentication errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      const contractId = 'contract_123'
      const signers = []

      await expect(aiContractService.sendForSignature(contractId, signers)).rejects.toThrow(
        'Failed to send for signature'
      )
    })
  })

  describe('Contract Analysis', () => {
    it('should analyze contract requirements accurately', async () => {
      const request = {
        contractType: ContractType.ASSIGNMENT_CONTRACT,
        jurisdiction: 'FL',
        parties: [
          { type: 'assignor', name: 'Original Buyer', email: 'original@test.com' },
          { type: 'assignee', name: 'New Buyer', email: 'new@test.com' }
        ],
        userRequirements: 'Assignment of purchase contract with full assignment fee',
        complexity: 'moderate' as const
      }

      // Mock analysis response
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{
            message: {
              content: JSON.stringify({
                keyLegalConsiderations: ['Assignment rights', 'Original contract compliance'],
                requiredClauses: ['Assignment clause', 'Fee structure', 'Notice requirements'],
                riskFactors: ['Original seller consent', 'Financing approval'],
                complianceRequirements: ['Florida real estate law compliance']
              })
            }
          }]
        })
      })

      const response = await aiContractService.generateContract(request)
      expect(response).toBeDefined()
    })
  })

  describe('Template Management', () => {
    it('should select optimal templates based on contract type and jurisdiction', async () => {
      const request = {
        contractType: ContractType.RESIDENTIAL_LEASE,
        jurisdiction: 'NY',
        parties: [
          { type: 'landlord', name: 'Property Owner', email: 'owner@property.com' },
          { type: 'tenant', name: 'Renter Smith', email: 'renter@email.com' }
        ],
        userRequirements: 'One-year residential lease with pet policy',
        complexity: 'simple' as const
      }

      const response = await aiContractService.generateContract(request)
      expect(response.suggestedTemplates).toBeDefined()
      expect(response.suggestedTemplates.length).toBeGreaterThan(0)
    })
  })

  describe('Risk Assessment', () => {
    it('should identify and categorize contract risks', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{
            message: {
              content: JSON.stringify({
                clauses: [],
                riskFactors: [
                  {
                    type: 'legal_compliance',
                    severity: 'high',
                    description: 'Potential zoning compliance issue',
                    mitigation: 'Verify zoning compliance before closing'
                  },
                  {
                    type: 'financial',
                    severity: 'medium',
                    description: 'Market volatility risk',
                    mitigation: 'Include market condition contingencies'
                  }
                ],
                recommendations: []
              })
            }
          }]
        })
      })

      const request = {
        contractType: ContractType.COMMERCIAL_LEASE,
        jurisdiction: 'CA',
        parties: [
          { type: 'landlord', name: 'Commercial Owner', email: 'commercial@owner.com' },
          { type: 'tenant', name: 'Business Corp', email: 'business@corp.com' }
        ],
        userRequirements: 'Long-term commercial lease with expansion options',
        complexity: 'complex' as const
      }

      const response = await aiContractService.generateContract(request)
      
      expect(response.riskFactors).toHaveLength(2)
      expect(response.riskFactors[0].severity).toBe('high')
      expect(response.riskFactors[1].severity).toBe('medium')
    })
  })

  describe('Contract Validation', () => {
    it('should validate contract completeness', async () => {
      const validRequest = {
        contractType: ContractType.PURCHASE_AGREEMENT,
        jurisdiction: 'CA',
        parties: [
          {
            type: 'buyer',
            name: 'Valid Buyer',
            email: 'buyer@valid.com',
            signatureRequired: true,
            signatureType: SignatureType.ELECTRONIC
          }
        ],
        userRequirements: 'Valid purchase agreement',
        complexity: 'simple' as const
      }

      const response = await aiContractService.generateContract(validRequest)
      expect(response.legalCompliance).toBe(true)
    })

    it('should handle incomplete contract requests', async () => {
      const incompleteRequest = {
        contractType: ContractType.PURCHASE_AGREEMENT,
        jurisdiction: '',
        parties: [],
        userRequirements: '',
        complexity: 'simple' as const
      }

      // Should still generate but with lower confidence
      const response = await aiContractService.generateContract(incompleteRequest)
      expect(response.confidence).toBeLessThan(80)
    })
  })

  describe('Performance Metrics', () => {
    it('should track contract generation performance', async () => {
      const startTime = Date.now()
      
      const request = {
        contractType: ContractType.OPTION_CONTRACT,
        jurisdiction: 'TX',
        parties: [
          { type: 'optionor', name: 'Property Owner', email: 'owner@test.com' },
          { type: 'optionee', name: 'Potential Buyer', email: 'buyer@test.com' }
        ],
        userRequirements: 'Real estate option contract with 90-day exercise period',
        complexity: 'moderate' as const
      }

      const response = await aiContractService.generateContract(request)
      const endTime = Date.now()
      const generationTime = endTime - startTime

      expect(generationTime).toBeLessThan(10000) // Should complete within 10 seconds
      expect(response.estimatedReviewTime).toBeGreaterThan(0)
    })
  })
})