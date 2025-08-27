/**
 * S.B.S.W.P 2.0 - PROPERTY DETAILS COMPONENT
 * Comprehensive property information display with investment analysis
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  TrendingUp,
  Heart,
  Share2,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Camera,
  Calculator,
  FileText,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePropertyDetails, useComparableProperties, useMarketData } from '@/hooks/use-property-search'
import { PropertyDetails as PropertyDetailsType } from '@/lib/mls-types'

interface PropertyDetailsProps {
  propertyId: string
  onBack?: () => void
  className?: string
}

export function PropertyDetails({ propertyId, onBack, className }: PropertyDetailsProps) {
  const { property, loading, error } = usePropertyDetails(propertyId)
  const { comparables, loading: comparablesLoading } = useComparableProperties(propertyId)
  const { marketData, loading: marketLoading } = useMarketData(property?.address.city || null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  if (loading || !property) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-200">Failed to load property details</p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        )}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Phone className="h-4 w-4 mr-2" />
            Contact Agent
          </Button>
        </div>
      </div>

      {/* Property Overview */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photos */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Main Photo */}
                <div className="relative rounded-lg overflow-hidden">
                  {property.photos.length > 0 ? (
                    <img
                      src={property.photos[selectedPhotoIndex]?.url || property.photos[0].url}
                      alt="Property"
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 bg-slate-800 flex items-center justify-center">
                      <Home className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white">
                      {property.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-white/20 text-white">
                      <Camera className="h-4 w-4 mr-1" />
                      {property.photos.length} Photos
                    </Badge>
                  </div>
                </div>

                {/* Photo Thumbnails */}
                {property.photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {property.photos.map((photo, index) => (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhotoIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedPhotoIndex === index 
                            ? 'border-blue-500' 
                            : 'border-transparent hover:border-white/20'
                        }`}
                      >
                        <img
                          src={photo.thumbnailUrl || photo.url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Property Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {property.address.streetNumber} {property.address.streetName}
                </h1>
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {property.address.city}, {property.address.state} {property.address.zipCode}
                  </span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {formatPrice(property.listPrice || property.soldPrice || 0)}
                </div>
                {property.pricePerSqft && (
                  <p className="text-gray-400">
                    ${Math.round(property.pricePerSqft)}/sq ft
                  </p>
                )}
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bed className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-400">Bedrooms</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{property.bedrooms}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bath className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-400">Bathrooms</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{property.bathrooms}</div>
                </div>
                {property.squareFeet && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Square className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-400">Square Feet</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{formatNumber(property.squareFeet)}</div>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-400">Year Built</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{property.yearBuilt}</div>
                  </div>
                )}
              </div>

              {/* Agent Info */}
              {property.listingAgent && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Listing Agent</h3>
                  <div className="flex items-start gap-3">
                    {property.listingAgent.photoUrl ? (
                      <img
                        src={property.listingAgent.photoUrl}
                        alt={property.listingAgent.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {property.listingAgent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{property.listingAgent.name}</h4>
                      {property.listingAgent.office && (
                        <p className="text-gray-400 text-sm">{property.listingAgent.office}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {property.listingAgent.phone && (
                          <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                        )}
                        {property.listingAgent.email && (
                          <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-white/10">
          <TabsTrigger value="details" className="data-[state=active]:bg-blue-600">
            Property Details
          </TabsTrigger>
          <TabsTrigger value="investment" className="data-[state=active]:bg-blue-600">
            Investment Analysis
          </TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:bg-blue-600">
            Market Data
          </TabsTrigger>
          <TabsTrigger value="comparables" className="data-[state=active]:bg-blue-600">
            Comparables
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Description */}
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {property.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {property.features.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Property Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-white/5 border-white/10 text-gray-300"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {property.appliances.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Appliances</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.appliances.map((appliance, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-white/5 border-white/10 text-gray-300"
                          >
                            {appliance}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details Table */}
            <Card className="bg-slate-900/50 border-white/10 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Property Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Property Type:</span>
                        <span className="text-white">{property.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white capitalize">{property.status}</span>
                      </div>
                      {property.mlsId && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">MLS ID:</span>
                          <span className="text-white">{property.mlsId}</span>
                        </div>
                      )}
                      {property.daysOnMarket && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Days on Market:</span>
                          <span className="text-white">{property.daysOnMarket}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Financial Information</h4>
                    <div className="space-y-2 text-sm">
                      {property.propertyTaxes && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Property Taxes:</span>
                          <span className="text-white">{formatPrice(property.propertyTaxes)}/year</span>
                        </div>
                      )}
                      {property.hoaFees && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">HOA Fees:</span>
                          <span className="text-white">{formatPrice(property.hoaFees)}/month</span>
                        </div>
                      )}
                      {property.rentEstimate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rent Estimate:</span>
                          <span className="text-white">{formatPrice(property.rentEstimate)}/month</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Physical Details</h4>
                    <div className="space-y-2 text-sm">
                      {property.lotSize && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lot Size:</span>
                          <span className="text-white">{formatNumber(property.lotSize)} sq ft</span>
                        </div>
                      )}
                      {property.stories && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Stories:</span>
                          <span className="text-white">{property.stories}</span>
                        </div>
                      )}
                      {property.garage && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Garage Spaces:</span>
                          <span className="text-white">{property.garage}</span>
                        </div>
                      )}
                      {property.heating && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Heating:</span>
                          <span className="text-white">{property.heating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Investment Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {property.capRate && (
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Cap Rate</span>
                      <span className="text-2xl font-bold text-green-400">{property.capRate.toFixed(2)}%</span>
                    </div>
                  )}
                  {property.cashFlow && (
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Monthly Cash Flow</span>
                      <span className="text-2xl font-bold text-green-400">{formatPrice(property.cashFlow)}</span>
                    </div>
                  )}
                  {property.roi && (
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">ROI</span>
                      <span className="text-2xl font-bold text-green-400">{property.roi.toFixed(2)}%</span>
                    </div>
                  )}
                  {property.grossRentMultiplier && (
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Gross Rent Multiplier</span>
                      <span className="text-xl font-bold text-white">{property.grossRentMultiplier.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Rental Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {property.rentEstimate && (
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Estimated Rent</span>
                      <span className="text-xl font-bold text-white">{formatPrice(property.rentEstimate)}</span>
                    </div>
                  )}
                  {property.rentToValueRatio && (
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Rent-to-Value Ratio</span>
                      <span className="text-xl font-bold text-white">{(property.rentToValueRatio * 100).toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market">
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {marketLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading market data...</p>
                </div>
              ) : marketData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Market Prices</h4>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-sm">Median Price</div>
                        <div className="text-xl font-bold text-white">{formatPrice(marketData.medianPrice)}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-sm">Price per Sq Ft</div>
                        <div className="text-xl font-bold text-white">${marketData.pricePerSqft}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Market Activity</h4>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-sm">Days on Market</div>
                        <div className="text-xl font-bold text-white">{marketData.daysOnMarket}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-sm">Inventory Count</div>
                        <div className="text-xl font-bold text-white">{formatNumber(marketData.inventoryCount)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Investment Metrics</h4>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-sm">Average Cap Rate</div>
                        <div className="text-xl font-bold text-green-400">{marketData.averageCapRate.toFixed(2)}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-sm">Appreciation Rate</div>
                        <div className="text-xl font-bold text-green-400">{marketData.appreciationRate.toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Market data not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparables">
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Comparable Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {comparablesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading comparable properties...</p>
                </div>
              ) : comparables.length > 0 ? (
                <div className="space-y-4">
                  {comparables.map((comp, index) => (
                    <div key={comp.property.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">
                            {comp.property.address.streetNumber} {comp.property.address.streetName}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {comp.property.address.city}, {comp.property.address.state}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-900/20 border-blue-500/20 text-blue-300">
                          {comp.similarity.toFixed(0)}% match
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Price</div>
                          <div className="text-white font-medium">
                            {formatPrice(comp.property.soldPrice || comp.property.listPrice || 0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Beds/Baths</div>
                          <div className="text-white font-medium">
                            {comp.property.bedrooms}/{comp.property.bathrooms}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Sq Ft</div>
                          <div className="text-white font-medium">
                            {comp.property.squareFeet ? formatNumber(comp.property.squareFeet) : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Distance</div>
                          <div className="text-white font-medium">
                            {comp.distance.toFixed(1)} mi
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No comparable properties found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}