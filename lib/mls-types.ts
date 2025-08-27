/**
 * S.B.S.W.P 2.0 - COMPREHENSIVE MLS & REAL ESTATE DATA INTEGRATION
 * Multiple data source integration to ANNIHILATE all competition
 * Supports: MLS, Zillow, Realtor.com, Realty API, PropertyData, and more
 */

import { z } from 'zod'

// MLS PROVIDERS AND DATA SOURCES
export enum MLSProvider {
  // Major MLS Systems
  BRIGHT_MLS = 'bright_mls',
  CALIFORNIA_REGIONAL_MLS = 'california_regional_mls', 
  HOUSTON_ASSOCIATION_REALTORS = 'houston_association_realtors',
  METRO_MLS = 'metro_mls',
  NORTHEAST_MLS = 'northeast_mls',
  MIDWEST_REAL_ESTATE_DATA = 'midwest_real_estate_data',
  SOUTHEAST_MLS = 'southeast_mls',
  FLORIDA_MLS = 'florida_mls',
  TEXAS_MLS = 'texas_mls',
  
  // Commercial APIs
  ZILLOW_API = 'zillow_api',
  REALTOR_API = 'realtor_api',
  REALTY_MOLE = 'realty_mole',
  PROPERTY_DATA_API = 'property_data_api',
  WALK_SCORE = 'walk_score',
  RENTALS_API = 'rentals_api',
  PROPERTY_RADAR = 'property_radar',
  REONOMY = 'reonomy',
  
  // Government Data
  COUNTY_ASSESSOR = 'county_assessor',
  TAX_RECORDS = 'tax_records',
  BUILDING_PERMITS = 'building_permits',
  CODE_VIOLATIONS = 'code_violations',
  
  // Custom Sources
  INTERNAL_DATABASE = 'internal_database',
  THIRD_PARTY_FEEDS = 'third_party_feeds'
}

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  MULTI_FAMILY = 'multi_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  APARTMENT = 'apartment',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  RETAIL = 'retail',
  OFFICE = 'office',
  WAREHOUSE = 'warehouse',
  LAND = 'land',
  FARM = 'farm',
  MOBILE_HOME = 'mobile_home',
  MANUFACTURED = 'manufactured',
  OTHER = 'other'
}

export enum PropertyStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SOLD = 'sold',
  EXPIRED = 'expired',
  WITHDRAWN = 'withdrawn',
  CANCELLED = 'cancelled',
  COMING_SOON = 'coming_soon',
  CONTINGENT = 'contingent',
  UNDER_CONTRACT = 'under_contract',
  PRE_FORECLOSURE = 'pre_foreclosure',
  FORECLOSURE = 'foreclosure',
  REO = 'reo',
  AUCTION = 'auction',
  OFF_MARKET = 'off_market'
}

export enum DataSource {
  MLS = 'mls',
  PUBLIC_RECORDS = 'public_records',
  ZILLOW = 'zillow',
  REALTOR = 'realtor',
  RENTAL_LISTINGS = 'rental_listings',
  FORECLOSURE_DATA = 'foreclosure_data',
  TAX_ASSESSOR = 'tax_assessor',
  BUILDING_PERMITS = 'building_permits',
  MARKET_ANALYTICS = 'market_analytics',
  COMPARABLE_SALES = 'comparable_sales'
}

// CORE PROPERTY INTERFACES
export interface PropertyAddress {
  streetNumber: string
  streetName: string
  unit?: string
  city: string
  state: string
  zipCode: string
  county: string
  neighborhood?: string
  subdivision?: string
  coordinates: {
    latitude: number
    longitude: number
  }
  mapUrl?: string
}

export interface PropertyDetails {
  id: string
  mlsId?: string
  apn?: string // Assessor Parcel Number
  address: PropertyAddress
  type: PropertyType
  status: PropertyStatus
  
  // Basic Info
  bedrooms: number
  bathrooms: number
  halfBaths?: number
  squareFeet?: number
  lotSize?: number
  yearBuilt?: number
  stories?: number
  garage?: number
  parking?: number
  
  // Property Features
  description?: string
  features: string[]
  appliances: string[]
  heating?: string
  cooling?: string
  fireplace?: boolean
  pool?: boolean
  spa?: boolean
  garage_type?: string
  roof_type?: string
  exterior_material?: string
  flooring?: string[]
  
  // Pricing
  listPrice?: number
  soldPrice?: number
  pricePerSqft?: number
  rentEstimate?: number
  estimatedValue?: number
  taxAssessedValue?: number
  
  // Dates
  listDate?: Date
  soldDate?: Date
  daysOnMarket?: number
  lastUpdated: Date
  
  // Financial
  propertyTaxes?: number
  hoaFees?: number
  utilities?: Record<string, number>
  insurance?: number
  
  // Investment Metrics
  capRate?: number
  grossRentMultiplier?: number
  rentToValueRatio?: number
  cashFlow?: number
  roi?: number
  
  // Photos and Media
  photos: PropertyPhoto[]
  virtualTour?: string
  videoTour?: string
  floorPlan?: string
  
  // Listing Agent/Office
  listingAgent?: AgentInfo
  listingOffice?: OfficeInfo
  
  // Data Sources
  dataSources: DataSource[]
  dataProviders: MLSProvider[]
  dataQuality: DataQualityScore
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface PropertyPhoto {
  id: string
  url: string
  thumbnailUrl?: string
  caption?: string
  order: number
  room?: string
  isMain: boolean
}

export interface AgentInfo {
  id: string
  name: string
  email?: string
  phone?: string
  license?: string
  office?: string
  photoUrl?: string
  rating?: number
  reviewCount?: number
  salesVolume?: number
  totalSales?: number
  specializations?: string[]
}

export interface OfficeInfo {
  id: string
  name: string
  address?: PropertyAddress
  phone?: string
  website?: string
  logoUrl?: string
}

export interface DataQualityScore {
  overall: number // 0-100
  accuracy: number
  completeness: number
  freshness: number
  lastVerified: Date
  sourcesCount: number
}

// MARKET DATA INTERFACES
export interface MarketData {
  areaId: string
  areaName: string
  areaType: 'neighborhood' | 'city' | 'county' | 'state' | 'zip'
  
  // Market Metrics
  medianPrice: number
  averagePrice: number
  pricePerSqft: number
  daysOnMarket: number
  inventoryCount: number
  salesVolume: number
  
  // Trends
  priceGrowth: {
    oneMonth: number
    threeMonth: number
    sixMonth: number
    oneYear: number
    threeYear: number
    fiveYear: number
  }
  
  // Supply & Demand
  monthsOfSupply: number
  absorptionRate: number
  newListings: number
  closedSales: number
  pendingSales: number
  
  // Rental Market
  medianRent: number
  rentGrowth: number
  vacancyRate: number
  rentToIncomeRatio: number
  
  // Demographics
  population?: number
  medianIncome?: number
  unemploymentRate?: number
  crimeRate?: number
  walkScore?: number
  schoolRating?: number
  
  // Investment Metrics
  averageCapRate: number
  appreciationRate: number
  cashFlowPotential: number
  
  lastUpdated: Date
}

export interface ComparableProperty {
  property: PropertyDetails
  distance: number // in miles
  similarity: number // 0-100 score
  adjustments: PropertyAdjustment[]
  adjustedValue: number
}

export interface PropertyAdjustment {
  factor: string
  value: number
  description: string
}

// SEARCH AND FILTERING
export interface PropertySearchCriteria {
  // Location
  city?: string
  state?: string
  zipCodes?: string[]
  counties?: string[]
  neighborhoods?: string[]
  radius?: number // miles from center point
  centerPoint?: [number, number] // [lat, lng]
  
  // Property Details
  propertyTypes?: PropertyType[]
  statuses?: PropertyStatus[]
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  minSquareFeet?: number
  maxSquareFeet?: number
  minLotSize?: number
  maxLotSize?: number
  minYearBuilt?: number
  maxYearBuilt?: number
  
  // Pricing
  minPrice?: number
  maxPrice?: number
  minPricePerSqft?: number
  maxPricePerSqft?: number
  minRent?: number
  maxRent?: number
  
  // Investment Criteria
  minCapRate?: number
  maxCapRate?: number
  minCashFlow?: number
  minROI?: number
  
  // Features
  features?: string[]
  hasPool?: boolean
  hasGarage?: boolean
  hasFireplace?: boolean
  
  // Market Conditions
  maxDaysOnMarket?: number
  minDataQuality?: number
  dataSources?: DataSource[]
  
  // Sorting
  sortBy?: 'price' | 'sqft' | 'bedrooms' | 'bathrooms' | 'lot_size' | 'year_built' | 'days_on_market' | 'price_per_sqft' | 'cap_rate' | 'cash_flow'
  sortOrder?: 'asc' | 'desc'
  
  // Pagination
  page?: number
  limit?: number
}

export interface PropertySearchResult {
  properties: PropertyDetails[]
  totalCount: number
  page: number
  totalPages: number
  searchCriteria: PropertySearchCriteria
  searchTime: number
  dataSourcesUsed: MLSProvider[]
}

// MLS INTEGRATION INTERFACES
export interface MLSConfiguration {
  provider: MLSProvider
  credentials: {
    username?: string
    password?: string
    apiKey?: string
    accessToken?: string
    refreshToken?: string
    clientId?: string
    clientSecret?: string
  }
  endpoints: {
    search: string
    details: string
    photos: string
    market: string
    auth?: string
  }
  rateLimits: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  isActive: boolean
  lastSync: Date
  errorCount: number
  successRate: number
}

export interface DataSyncJob {
  id: string
  provider: MLSProvider
  type: 'full' | 'incremental' | 'specific'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  startedAt?: Date
  completedAt?: Date
  recordsProcessed: number
  recordsAdded: number
  recordsUpdated: number
  recordsDeleted: number
  errors: SyncError[]
  metadata: Record<string, any>
}

export interface SyncError {
  id: string
  provider: MLSProvider
  propertyId?: string
  error: string
  errorCode?: string
  timestamp: Date
  resolved: boolean
}

// API RESPONSE INTERFACES
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
  metadata: {
    provider: MLSProvider
    requestId: string
    timestamp: Date
    processingTime: number
    rateLimitRemaining?: number
    rateLimitReset?: Date
  }
}

export interface BulkAPIResponse<T> {
  success: boolean
  data?: T[]
  errors?: Array<{
    item: any
    error: string
  }>
  metadata: {
    totalRequested: number
    totalSuccessful: number
    totalFailed: number
    processingTime: number
    providers: MLSProvider[]
  }
}

// VALIDATION SCHEMAS
export const PropertySearchSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  zipCodes: z.array(z.string()).optional(),
  counties: z.array(z.string()).optional(),
  neighborhoods: z.array(z.string()).optional(),
  radius: z.number().min(0).max(100).optional(),
  centerPoint: z.tuple([z.number(), z.number()]).optional(),
  
  propertyTypes: z.array(z.nativeEnum(PropertyType)).optional(),
  statuses: z.array(z.nativeEnum(PropertyStatus)).optional(),
  minBedrooms: z.number().min(0).max(20).optional(),
  maxBedrooms: z.number().min(0).max(20).optional(),
  minBathrooms: z.number().min(0).max(20).optional(),
  maxBathrooms: z.number().min(0).max(20).optional(),
  minSquareFeet: z.number().min(0).optional(),
  maxSquareFeet: z.number().min(0).optional(),
  minLotSize: z.number().min(0).optional(),
  maxLotSize: z.number().min(0).optional(),
  minYearBuilt: z.number().min(1800).max(new Date().getFullYear() + 2).optional(),
  maxYearBuilt: z.number().min(1800).max(new Date().getFullYear() + 2).optional(),
  
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minPricePerSqft: z.number().min(0).optional(),
  maxPricePerSqft: z.number().min(0).optional(),
  minRent: z.number().min(0).optional(),
  maxRent: z.number().min(0).optional(),
  
  minCapRate: z.number().min(0).max(100).optional(),
  maxCapRate: z.number().min(0).max(100).optional(),
  minCashFlow: z.number().optional(),
  minROI: z.number().min(0).optional(),
  
  features: z.array(z.string()).optional(),
  hasPool: z.boolean().optional(),
  hasGarage: z.boolean().optional(),
  hasFireplace: z.boolean().optional(),
  
  maxDaysOnMarket: z.number().min(0).optional(),
  minDataQuality: z.number().min(0).max(100).optional(),
  dataSources: z.array(z.nativeEnum(DataSource)).optional(),
  
  sortBy: z.enum(['price', 'sqft', 'bedrooms', 'bathrooms', 'lot_size', 'year_built', 'days_on_market', 'price_per_sqft', 'cap_rate', 'cash_flow']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional()
})

// WEBHOOK INTERFACES
export interface PropertyWebhook {
  id: string
  url: string
  events: PropertyEvent[]
  providers: MLSProvider[]
  filters?: PropertySearchCriteria
  isActive: boolean
  secret?: string
  retryPolicy: {
    maxRetries: number
    retryDelay: number
  }
  createdAt: Date
  lastTriggered?: Date
}

export enum PropertyEvent {
  PROPERTY_LISTED = 'property_listed',
  PROPERTY_UPDATED = 'property_updated',
  PROPERTY_SOLD = 'property_sold',
  PROPERTY_WITHDRAWN = 'property_withdrawn',
  PRICE_CHANGED = 'price_changed',
  STATUS_CHANGED = 'status_changed',
  PHOTOS_UPDATED = 'photos_updated'
}

export interface WebhookPayload {
  event: PropertyEvent
  property: PropertyDetails
  changes?: Record<string, { old: any; new: any }>
  provider: MLSProvider
  timestamp: Date
  webhookId: string
}

// ANALYTICS INTERFACES
export interface PropertyAnalytics {
  propertyId: string
  views: number
  saves: number
  inquiries: number
  tourRequests: number
  applications?: number
  
  // Performance Metrics
  clickThroughRate: number
  conversionRate: number
  timeOnListing: number
  
  // Source Attribution
  trafficSources: Record<string, number>
  
  // Geographic
  viewerLocations: Array<{
    city: string
    state: string
    count: number
  }>
  
  // Time-based
  viewsByDay: Array<{
    date: string
    views: number
  }>
  
  lastUpdated: Date
}

// TYPE EXPORTS
export type PropertySearchData = z.infer<typeof PropertySearchSchema>

// UTILITY TYPES
export interface MLSProviderStatus {
  provider: MLSProvider
  isOnline: boolean
  lastCheck: Date
  responseTime: number
  errorRate: number
  dataFreshness: Date
}

export interface SystemHealth {
  overallStatus: 'healthy' | 'degraded' | 'down'
  providers: MLSProviderStatus[]
  totalProperties: number
  lastFullSync: Date
  syncInProgress: boolean
  errors: SyncError[]
}
