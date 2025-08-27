/**
 * S.B.S.W.P 2.0 - PREMIUM PROPERTY SEARCH COMPONENT
 * Advanced property search with multiple MLS integration
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Home, 
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  ChevronDown,
  X,
  Save,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { usePropertySearch, usePropertySearchForm, useSavedSearches, usePropertyFavorites } from '@/hooks/use-property-search'
import { PropertyType, PropertyStatus, PropertyDetails } from '@/lib/mls-types'

interface PropertySearchProps {
  onPropertySelect?: (property: PropertyDetails) => void
  className?: string
}

export function PropertySearch({ onPropertySelect, className }: PropertySearchProps) {
  const { criteria, updateCriteria, resetCriteria } = usePropertySearchForm()
  const { results, loading, error, search, loadMore, hasMore } = usePropertySearch()
  const { savedSearches, saveSearch, deleteSearch } = useSavedSearches()
  const { favorites, toggleFavorite, isFavorite } = usePropertyFavorites()
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [saveSearchDialog, setSaveSearchDialog] = useState(false)
  const [searchName, setSearchName] = useState('')

  const handleSearch = async () => {
    await search(criteria)
  }

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      saveSearch(searchName.trim(), criteria)
      setSaveSearchDialog(false)
      setSearchName('')
    }
  }

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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Property Search</h2>
            <p className="text-gray-400">Find your next investment opportunity</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            <Dialog open={saveSearchDialog} onOpenChange={setSaveSearchDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Search
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">Save Search</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search-name" className="text-white">Search Name</Label>
                    <Input
                      id="search-name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="e.g., Downtown Condos Under $500K"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSaveSearchDialog(false)}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSearch}
                      disabled={!searchName.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save Search
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="City, State, ZIP, or Address"
                value={criteria.city || ''}
                onChange={(e) => updateCriteria({ city: e.target.value })}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <Select value={criteria.propertyTypes?.[0] || ''} onValueChange={(value) => updateCriteria({ propertyTypes: value ? [value as PropertyType] : undefined })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10">
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value={PropertyType.SINGLE_FAMILY}>Single Family</SelectItem>
              <SelectItem value={PropertyType.CONDO}>Condo</SelectItem>
              <SelectItem value={PropertyType.TOWNHOUSE}>Townhouse</SelectItem>
              <SelectItem value={PropertyType.MULTI_FAMILY}>Multi-Family</SelectItem>
              <SelectItem value={PropertyType.COMMERCIAL}>Commercial</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Separator className="my-4 bg-white/10" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Price Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min Price"
                      value={criteria.minPrice || ''}
                      onChange={(e) => updateCriteria({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="bg-white/5 border-white/10 text-white text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max Price"
                      value={criteria.maxPrice || ''}
                      onChange={(e) => updateCriteria({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="bg-white/5 border-white/10 text-white text-sm"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Bedrooms</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={criteria.minBedrooms || ''}
                      onChange={(e) => updateCriteria({ minBedrooms: e.target.value ? Number(e.target.value) : undefined })}
                      className="bg-white/5 border-white/10 text-white text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={criteria.maxBedrooms || ''}
                      onChange={(e) => updateCriteria({ maxBedrooms: e.target.value ? Number(e.target.value) : undefined })}
                      className="bg-white/5 border-white/10 text-white text-sm"
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pool"
                        checked={criteria.hasPool || false}
                        onCheckedChange={(checked) => updateCriteria({ hasPool: checked as boolean })}
                        className="border-white/20"
                      />
                      <Label htmlFor="pool" className="text-sm text-gray-300">Pool</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="garage"
                        checked={criteria.hasGarage || false}
                        onCheckedChange={(checked) => updateCriteria({ hasGarage: checked as boolean })}
                        className="border-white/20"
                      />
                      <Label htmlFor="garage" className="text-sm text-gray-300">Garage</Label>
                    </div>
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Sort By</Label>
                  <Select value={criteria.sortBy || 'price'} onValueChange={(value) => updateCriteria({ sortBy: value as any })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="sqft">Square Footage</SelectItem>
                      <SelectItem value="bedrooms">Bedrooms</SelectItem>
                      <SelectItem value="bathrooms">Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={resetCriteria}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  Reset Filters
                </Button>
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-white">
                {formatNumber(results.totalCount)} Properties Found
              </h3>
              <Badge variant="outline" className="bg-blue-900/20 border-blue-500/20 text-blue-300">
                Search completed in {results.searchTime}ms
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="bg-white/5 border-white/10"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="bg-white/5 border-white/10"
              >
                List
              </Button>
            </div>
          </div>

          {/* Property Results */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {results.properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode={viewMode}
                isFavorite={isFavorite(property.id)}
                onToggleFavorite={() => toggleFavorite(property.id)}
                onSelect={() => onPropertySelect?.(property)}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <Button
                onClick={loadMore}
                disabled={loading}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Load More Properties
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface PropertyCardProps {
  property: PropertyDetails
  viewMode: 'grid' | 'list'
  isFavorite: boolean
  onToggleFavorite: () => void
  onSelect: () => void
}

function PropertyCard({ property, viewMode, isFavorite, onToggleFavorite, onSelect }: PropertyCardProps) {
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

  const mainPhoto = property.photos.find(p => p.isMain) || property.photos[0]

  return (
    <Card className="bg-slate-900/50 border-white/10 hover:bg-slate-900/70 transition-all duration-200 cursor-pointer group overflow-hidden" onClick={onSelect}>
      <div className="relative">
        {mainPhoto ? (
          <img
            src={mainPhoto.url}
            alt="Property"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="bg-blue-600 text-white">
            {property.type.replace('_', ' ')}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/40 p-2"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-black/20 backdrop-blur-sm hover:bg-black/40 p-2"
          >
            <Share2 className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white mb-1">
            {property.address.streetNumber} {property.address.streetName}
          </h3>
          <p className="text-gray-400 text-sm">
            {property.address.city}, {property.address.state} {property.address.zipCode}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.bedrooms}
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms}
          </div>
          {property.squareFeet && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              {formatNumber(property.squareFeet)}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-white">
            {formatPrice(property.listPrice || property.soldPrice || 0)}
          </p>
          {property.pricePerSqft && (
            <p className="text-sm text-gray-400">
              ${Math.round(property.pricePerSqft)}/sq ft
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}