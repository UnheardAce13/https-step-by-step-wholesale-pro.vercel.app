/**
 * S.B.S.W.P 2.0 - CONTRACT & LEGAL DOCUMENT TYPES
 * AI-Powered Contract Generation System
 * TOTAL ANNIHILATION of competition through automated legal document processing
 */

import { z } from 'zod'

// CONTRACT TYPES
export enum ContractType {
  // Purchase Contracts
  PURCHASE_AGREEMENT = 'purchase_agreement',
  WHOLESALE_CONTRACT = 'wholesale_contract',
  ASSIGNMENT_CONTRACT = 'assignment_contract',
  OPTION_CONTRACT = 'option_contract',
  
  // Rental/Lease Contracts
  RESIDENTIAL_LEASE = 'residential_lease',
  COMMERCIAL_LEASE = 'commercial_lease',
  RENT_TO_OWN = 'rent_to_own',
  
  // Investment Contracts
  JOINT_VENTURE = 'joint_venture',
  PARTNERSHIP_AGREEMENT = 'partnership_agreement',
  INVESTOR_AGREEMENT = 'investor_agreement',
  
  // Service Contracts
  PROPERTY_MANAGEMENT = 'property_management',
  CONTRACTOR_AGREEMENT = 'contractor_agreement',
  REALTOR_AGREEMENT = 'realtor_agreement',
  
  // Legal Documents
  DEED = 'deed',
  BILL_OF_SALE = 'bill_of_sale',
  DISCLOSURE = 'disclosure',
  ADDENDUM = 'addendum',
  AMENDMENT = 'amendment'
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  SENT_FOR_SIGNATURE = 'sent_for_signature',
  PARTIALLY_SIGNED = 'partially_signed',
  FULLY_EXECUTED = 'fully_executed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  VOIDED = 'voided'
}

export enum SignatureType {
  ELECTRONIC = 'electronic',
  WET_SIGNATURE = 'wet_signature',
  NOTARIZED = 'notarized',
  WITNESSED = 'witnessed'
}

export enum DocumentProvider {
  DOCUSIGN = 'docusign',
  HELLOSIGN = 'hellosign',
  ADOBE_SIGN = 'adobe_sign',
  PANDADOC = 'pandadoc',
  INTERNAL = 'internal'
}

// CORE INTERFACES
export interface ContractParty {
  id: string
  type: 'buyer' | 'seller' | 'agent' | 'broker' | 'investor' | 'contractor' | 'tenant' | 'landlord' | 'witness' | 'notary'
  role: string
  name: string
  email: string
  phone?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  signatureRequired: boolean
  signatureType: SignatureType
  signedAt?: Date
  ipAddress?: string
  deviceInfo?: string
  isCorporate: boolean
  corporateInfo?: {
    companyName: string
    title: string
    taxId?: string
  }
}

export interface ContractClause {
  id: string
  title: string
  content: string
  required: boolean
  type: 'standard' | 'custom' | 'conditional' | 'ai_generated'
  category: string
  order: number
  variables: ContractVariable[]
  conditions?: ClauseCondition[]
}

export interface ContractVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'select' | 'address' | 'signature'
  value?: any
  required: boolean
  description: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    options?: string[]
  }
  aiGenerated: boolean
}

export interface ClauseCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists'
  value: any
}

export interface ContractTemplate {
  id: string
  name: string
  type: ContractType
  description: string
  version: string
  state: string
  category: string
  clauses: ContractClause[]
  requiredParties: string[]
  estimatedCompletionTime: number // minutes
  legalCompliance: {
    reviewed: boolean
    reviewedBy: string
    reviewedAt: Date
    jurisdiction: string[]
    regulations: string[]
  }
  aiOptimized: boolean
  successRate: number
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Contract {
  id: string
  templateId: string
  type: ContractType
  title: string
  description?: string
  status: ContractStatus
  
  // Parties
  parties: ContractParty[]
  
  // Content
  clauses: ContractClause[]
  variables: Record<string, any>
  
  // Property Information (if applicable)
  propertyId?: string
  propertyAddress?: string
  purchasePrice?: number
  financingTerms?: FinancingTerms
  
  // Execution Details
  createdBy: string
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  executedAt?: Date
  
  // E-Signature Integration
  docusignEnvelopeId?: string
  signatureProvider: DocumentProvider
  signatureUrls: Record<string, string>
  
  // AI Generation Details
  aiGenerated: boolean
  aiPrompt?: string
  aiModel?: string
  confidence: number
  
  // Legal & Compliance
  jurisdiction: string
  governingLaw: string
  complianceChecked: boolean
  riskAssessment: RiskAssessment
  
  // Audit Trail
  auditTrail: ContractAuditEvent[]
  
  // File Management
  documents: ContractDocument[]
  finalPdfUrl?: string
}

export interface FinancingTerms {
  loanAmount: number
  downPayment: number
  interestRate: number
  loanTerm: number // months
  monthlyPayment: number
  lenderName?: string
  preApprovalLetter?: string
  contingencies: string[]
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high'
  factors: RiskFactor[]
  recommendations: string[]
  legalReviewRequired: boolean
  complianceIssues: string[]
  lastAssessed: Date
}

export interface RiskFactor {
  type: string
  severity: 'low' | 'medium' | 'high'
  description: string
  mitigation: string
}

export interface ContractAuditEvent {
  id: string
  timestamp: Date
  userId: string
  userEmail: string
  action: string
  description: string
  ipAddress: string
  userAgent: string
  changes?: Record<string, { old: any; new: any }>
}

export interface ContractDocument {
  id: string
  name: string
  type: 'pdf' | 'word' | 'image' | 'attachment'
  url: string
  size: number
  uploadedAt: Date
  uploadedBy: string
  version: number
  isExecuted: boolean
}

// DOCUSIGN INTEGRATION
export interface DocuSignConfiguration {
  accountId: string
  clientId: string
  clientSecret: string
  redirectUri: string
  environment: 'demo' | 'production'
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  basePath: string
}

export interface DocuSignEnvelope {
  envelopeId: string
  status: 'created' | 'sent' | 'delivered' | 'signed' | 'completed' | 'declined' | 'voided'
  emailSubject: string
  emailBody: string
  createdDateTime: Date
  sentDateTime?: Date
  deliveredDateTime?: Date
  signedDateTime?: Date
  completedDateTime?: Date
  recipients: DocuSignRecipient[]
  documents: DocuSignDocument[]
  customFields?: DocuSignCustomField[]
}

export interface DocuSignRecipient {
  recipientId: string
  recipientType: 'signer' | 'carbon_copy' | 'certified_delivery' | 'in_person_signer'
  name: string
  email: string
  routingOrder: number
  status: 'created' | 'sent' | 'delivered' | 'signed' | 'declined'
  tabs?: DocuSignTab[]
  signedDateTime?: Date
  deliveredDateTime?: Date
  declineReason?: string
}

export interface DocuSignDocument {
  documentId: string
  name: string
  order: number
  pages: number
  uri?: string
}

export interface DocuSignTab {
  tabId?: string
  tabType: 'sign_here' | 'date_signed' | 'text' | 'number' | 'checkbox' | 'radio_group' | 'list' | 'email' | 'company' | 'title' | 'full_name'
  documentId: string
  pageNumber: number
  xPosition: number
  yPosition: number
  width?: number
  height?: number
  required: boolean
  value?: string
  locked: boolean
  tabLabel: string
}

export interface DocuSignCustomField {
  fieldId: string
  name: string
  value: string
  required: boolean
  show: boolean
}

// AI CONTRACT GENERATION
export interface AIContractRequest {
  contractType: ContractType
  jurisdiction: string
  parties: Partial<ContractParty>[]
  propertyDetails?: {
    address: string
    price: number
    type: string
    description: string
  }
  userRequirements: string
  specialClauses?: string[]
  timeline?: string
  complexity: 'simple' | 'moderate' | 'complex'
  template?: string
}

export interface AIContractResponse {
  contractId: string
  generatedClauses: ContractClause[]
  variables: ContractVariable[]
  confidence: number
  recommendations: AIRecommendation[]
  estimatedReviewTime: number
  legalCompliance: boolean
  riskFactors: RiskFactor[]
  suggestedTemplates: string[]
}

export interface AIRecommendation {
  type: 'clause_addition' | 'clause_modification' | 'risk_mitigation' | 'compliance' | 'optimization'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  suggestedAction: string
  impact: string
}

// CONTRACT ANALYTICS
export interface ContractAnalytics {
  contractId: string
  metrics: {
    generationTime: number
    reviewTime: number
    signatureTime: number
    totalExecutionTime: number
    revisionCount: number
    signatureRate: number
    onTimeCompletion: boolean
  }
  engagement: {
    viewCount: number
    downloadCount: number
    timeSpentReviewing: number
    questionsAsked: number
    revisionsRequested: number
  }
  performance: {
    executionSuccess: boolean
    disputeOccurred: boolean
    legalIssues: string[]
    clientSatisfactionScore?: number
    agentPerformanceScore?: number
  }
  aiPerformance: {
    accuracy: number
    userSatisfaction: number
    editsMade: number
    clausesAccepted: number
    clausesRejected: number
  }
}

// WORKFLOW AUTOMATION
export interface ContractWorkflow {
  id: string
  name: string
  contractType: ContractType
  steps: WorkflowStep[]
  triggers: WorkflowTrigger[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'ai_generation' | 'review' | 'approval' | 'signature' | 'notification' | 'storage' | 'compliance_check'
  order: number
  assignedTo?: string
  estimatedDuration: number
  requirements: string[]
  automationRules: AutomationRule[]
  notifications: NotificationRule[]
}

export interface WorkflowTrigger {
  event: 'contract_created' | 'party_signed' | 'deadline_approaching' | 'status_changed' | 'error_occurred'
  conditions: Record<string, any>
  actions: string[]
}

export interface AutomationRule {
  condition: string
  action: string
  parameters: Record<string, any>
}

export interface NotificationRule {
  trigger: string
  recipients: string[]
  template: string
  channel: 'email' | 'sms' | 'push' | 'in_app'
  timing: 'immediate' | 'scheduled' | 'conditional'
}

// VALIDATION SCHEMAS
export const ContractPartySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  type: z.enum(['buyer', 'seller', 'agent', 'broker', 'investor', 'contractor', 'tenant', 'landlord', 'witness', 'notary']),
  role: z.string().min(1, 'Role is required'),
  signatureRequired: z.boolean(),
  signatureType: z.nativeEnum(SignatureType),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required')
  })
})

export const ContractCreateSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
  title: z.string().min(1, 'Contract title is required'),
  description: z.string().optional(),
  parties: z.array(ContractPartySchema).min(2, 'At least 2 parties are required'),
  propertyId: z.string().optional(),
  propertyAddress: z.string().optional(),
  purchasePrice: z.number().min(0).optional(),
  expiresAt: z.date().optional(),
  variables: z.record(z.any()).optional(),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  governingLaw: z.string().min(1, 'Governing law is required')
})

export const AIContractRequestSchema = z.object({
  contractType: z.nativeEnum(ContractType),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  parties: z.array(ContractPartySchema.partial()).min(2, 'At least 2 parties are required'),
  userRequirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  propertyDetails: z.object({
    address: z.string(),
    price: z.number().min(0),
    type: z.string(),
    description: z.string()
  }).optional(),
  specialClauses: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  complexity: z.enum(['simple', 'moderate', 'complex'])
})

// TYPE EXPORTS
export type ContractData = z.infer<typeof ContractCreateSchema>
export type AIContractData = z.infer<typeof AIContractRequestSchema>
export type ContractPartyData = z.infer<typeof ContractPartySchema>

// CONSTANTS
export const CONTRACT_TEMPLATES = {
  [ContractType.PURCHASE_AGREEMENT]: 'Real Estate Purchase Agreement',
  [ContractType.WHOLESALE_CONTRACT]: 'Wholesale Purchase Contract',
  [ContractType.ASSIGNMENT_CONTRACT]: 'Assignment of Purchase Contract',
  [ContractType.OPTION_CONTRACT]: 'Real Estate Option Contract',
  [ContractType.RESIDENTIAL_LEASE]: 'Residential Lease Agreement',
  [ContractType.COMMERCIAL_LEASE]: 'Commercial Lease Agreement',
  [ContractType.RENT_TO_OWN]: 'Rent-to-Own Agreement',
  [ContractType.JOINT_VENTURE]: 'Joint Venture Agreement',
  [ContractType.PARTNERSHIP_AGREEMENT]: 'Partnership Agreement',
  [ContractType.INVESTOR_AGREEMENT]: 'Investor Agreement',
  [ContractType.PROPERTY_MANAGEMENT]: 'Property Management Agreement',
  [ContractType.CONTRACTOR_AGREEMENT]: 'Contractor Agreement',
  [ContractType.REALTOR_AGREEMENT]: 'Realtor Service Agreement'
} as const

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
] as const

export const SIGNATURE_METHODS = {
  [SignatureType.ELECTRONIC]: 'Electronic Signature (DocuSign)',
  [SignatureType.WET_SIGNATURE]: 'Wet Signature (In-Person)',
  [SignatureType.NOTARIZED]: 'Notarized Signature',
  [SignatureType.WITNESSED]: 'Witnessed Signature'
} as const