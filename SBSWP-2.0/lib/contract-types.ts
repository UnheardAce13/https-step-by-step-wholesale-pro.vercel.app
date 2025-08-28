/**
 * S.B.S.W.P 2.0 - CONTRACT & LEGAL DOCUMENT TYPES
 * AI-Powered Contract Generation System - Clean Build
 * TOTAL ANNIHILATION of competition through automated legal document processing
 */

import { z } from 'zod'

// CONTRACT TYPES
export enum ContractType {
  PURCHASE_AGREEMENT = 'purchase_agreement',
  WHOLESALE_CONTRACT = 'wholesale_contract',
  ASSIGNMENT_CONTRACT = 'assignment_contract',
  OPTION_CONTRACT = 'option_contract',
  RESIDENTIAL_LEASE = 'residential_lease',
  COMMERCIAL_LEASE = 'commercial_lease',
  RENT_TO_OWN = 'rent_to_own',
  JOINT_VENTURE = 'joint_venture',
  PARTNERSHIP_AGREEMENT = 'partnership_agreement',
  INVESTOR_AGREEMENT = 'investor_agreement',
  PROPERTY_MANAGEMENT = 'property_management',
  CONTRACTOR_AGREEMENT = 'contractor_agreement',
  REALTOR_AGREEMENT = 'realtor_agreement',
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

// AI CONTRACT REQUEST/RESPONSE
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
  type: 'clause_addition' | 'clause_modification' | 'risk_mitigation' | 'compliance_check'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  impact: string
  implementation: string
}

export interface RiskFactor {
  id: string
  type: 'legal_compliance' | 'financial' | 'operational' | 'market' | 'regulatory'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  likelihood: number
  impact: number
  mitigation: string
  autoFixable: boolean
}

// DOCUSIGN INTEGRATION
export interface DocuSignConfiguration {
  accountId: string
  clientId: string
  clientSecret: string
  redirectUri: string
  environment: 'demo' | 'production'
  basePath: string
}

export interface DocuSignEnvelope {
  envelopeId: string
  status: 'created' | 'sent' | 'delivered' | 'signed' | 'completed' | 'declined' | 'voided'
  emailSubject: string
  emailBlurb: string
  documents: DocuSignDocument[]
  recipients: DocuSignRecipient[]
  createdDateTime: Date
  statusDateTime: Date
}

export interface DocuSignDocument {
  documentId: string
  name: string
  documentBase64: string
  fileExtension: string
  order: number
}

export interface DocuSignRecipient {
  recipientId: string
  recipientType: 'signer' | 'carbonCopy' | 'certifiedDelivery' | 'inPersonSigner'
  email: string
  name: string
  roleName?: string
  routingOrder: number
  status: 'created' | 'sent' | 'delivered' | 'signed' | 'declined'
  tabs?: DocuSignTab[]
}

export interface DocuSignTab {
  tabId: string
  tabType: 'signHere' | 'initialHere' | 'dateTime' | 'text' | 'number' | 'checkbox'
  documentId: string
  pageNumber: number
  xPosition: number
  yPosition: number
  width?: number
  height?: number
  value?: string
  required: boolean
}

// VALIDATION SCHEMAS
export const ContractPartySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  type: z.enum(['buyer', 'seller', 'agent', 'broker', 'investor', 'contractor', 'tenant', 'landlord', 'witness', 'notary']),
  signatureRequired: z.boolean(),
  signatureType: z.nativeEnum(SignatureType)
})

export const AIContractRequestSchema = z.object({
  contractType: z.nativeEnum(ContractType),
  jurisdiction: z.string().min(2, 'Jurisdiction is required'),
  parties: z.array(ContractPartySchema.partial()).min(1, 'At least one party is required'),
  userRequirements: z.string().min(10, 'Please provide detailed requirements'),
  complexity: z.enum(['simple', 'moderate', 'complex']),
  propertyDetails: z.object({
    address: z.string().min(1, 'Property address is required'),
    price: z.number().positive('Price must be positive'),
    type: z.string(),
    description: z.string()
  }).optional(),
  specialClauses: z.array(z.string()).optional(),
  timeline: z.string().optional()
})

// TYPE EXPORTS
export type ContractPartyData = z.infer<typeof ContractPartySchema>
export type AIContractRequestData = z.infer<typeof AIContractRequestSchema>

// CONSTANTS
export const CONTRACT_TYPE_LABELS = {
  [ContractType.PURCHASE_AGREEMENT]: 'Purchase Agreement',
  [ContractType.WHOLESALE_CONTRACT]: 'Wholesale Contract',
  [ContractType.ASSIGNMENT_CONTRACT]: 'Assignment Contract',
  [ContractType.OPTION_CONTRACT]: 'Option Contract',
  [ContractType.RESIDENTIAL_LEASE]: 'Residential Lease',
  [ContractType.COMMERCIAL_LEASE]: 'Commercial Lease',
  [ContractType.RENT_TO_OWN]: 'Rent to Own',
  [ContractType.JOINT_VENTURE]: 'Joint Venture',
  [ContractType.PARTNERSHIP_AGREEMENT]: 'Partnership Agreement',
  [ContractType.INVESTOR_AGREEMENT]: 'Investor Agreement',
  [ContractType.PROPERTY_MANAGEMENT]: 'Property Management',
  [ContractType.CONTRACTOR_AGREEMENT]: 'Contractor Agreement',
  [ContractType.REALTOR_AGREEMENT]: 'Realtor Agreement',
  [ContractType.DEED]: 'Deed',
  [ContractType.BILL_OF_SALE]: 'Bill of Sale',
  [ContractType.DISCLOSURE]: 'Disclosure',
  [ContractType.ADDENDUM]: 'Addendum',
  [ContractType.AMENDMENT]: 'Amendment'
} as const

export const STATUS_COLORS = {
  [ContractStatus.DRAFT]: 'bg-gray-500/20 text-gray-300',
  [ContractStatus.PENDING_REVIEW]: 'bg-yellow-500/20 text-yellow-300',
  [ContractStatus.SENT_FOR_SIGNATURE]: 'bg-blue-500/20 text-blue-300',
  [ContractStatus.PARTIALLY_SIGNED]: 'bg-orange-500/20 text-orange-300',
  [ContractStatus.FULLY_EXECUTED]: 'bg-green-500/20 text-green-300',
  [ContractStatus.EXPIRED]: 'bg-red-500/20 text-red-300',
  [ContractStatus.CANCELLED]: 'bg-red-500/20 text-red-300',
  [ContractStatus.VOIDED]: 'bg-red-500/20 text-red-300'
} as const