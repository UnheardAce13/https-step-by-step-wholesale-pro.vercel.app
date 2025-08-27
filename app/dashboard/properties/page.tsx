/**
 * S.B.S.W.P 2.0 - PROPERTY DASHBOARD PAGE
 * Central hub for property search, management, and analysis
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  TrendingUp,
  MapPin,
  Heart,
  Eye,
  Bell,
  Filter,
  BarChart3,
  Building,
  DollarSign,
  Calendar,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertySearch } from '@/components/property/property-search'
import { PropertyDetails } from '@/components/property/property-details'
import { useSystemHealth, usePropertyFavorites, useSavedSearches } from '@/hooks/use-property-search'
import { PropertyDetails as PropertyDetailsType } from '@/lib/mls-types'

export default function PropertyDashboard() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetailsType | null>(null)
  const [activeTab, setActiveTab] = useState('search')
  const { health } = useSystemHealth()
  const { favorites } = usePropertyFavorites()
  const { savedSearches } = useSavedSearches()

  const handlePropertySelect = (property: PropertyDetailsType) => {
    setSelectedProperty(property)
    setActiveTab('details')
  }

  const handleBackToSearch = () => {
    setSelectedProperty(null)
    setActiveTab('search')
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Property Intelligence Hub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            Advanced MLS integration with multiple data sources for superior market analysis
          </motion.p>
        </div>

        {/* System Health Status */}
        {health && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-white/10 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      health.overallStatus === 'healthy' 
                        ? 'bg-green-500' 
                        : health.overallStatus === 'degraded' 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`} />
                    <span className="text-white font-medium">
                      System Status: <span className="capitalize">{health.overallStatus}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{health.providers.filter(p => p.isOnline).length}/{health.providers.length} Providers Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span>{formatNumber(health.totalProperties)} Properties Available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Saved Searches</p>
                  <p className="text-3xl font-bold text-white">{savedSearches.length}</p>
                </div>
                <Search className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Favorite Properties</p>
                  <p className="text-3xl font-bold text-white">{favorites.length}</p>
                </div>
                <Heart className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Market Alerts</p>
                  <p className="text-3xl font-bold text-white">12</p>
                </div>
                <Bell className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm font-medium">Deals Analyzed</p>
                  <p className="text-3xl font-bold text-white">247</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-900/50 border border-white/10 p-1">
              <TabsTrigger 
                value="search" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Property Search
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                disabled={!selectedProperty}
              >
                <Eye className="h-4 w-4 mr-2" />
                Property Details
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Building className="h-4 w-4 mr-2" />
                My Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <PropertySearch onPropertySelect={handlePropertySelect} />
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {selectedProperty ? (
                <PropertyDetails
                  propertyId={selectedProperty.id}
                  onBack={handleBackToSearch}
                />
              ) : (
                <Card className="bg-slate-900/50 border-white/10">
                  <CardContent className="p-12 text-center">
                    <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Property Selected</h3>
                    <p className="text-gray-400">
                      Select a property from the search results to view detailed information
                    </p>
                    <Button
                      onClick={() => setActiveTab('search')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Go to Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Portfolio Overview */}
                <Card className="lg:col-span-2 bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Portfolio Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-gray-400 text-sm">Properties Owned</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">$0</div>
                        <div className="text-gray-400 text-sm">Total Value</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">$0</div>
                        <div className="text-gray-400 text-sm">Monthly Income</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">0%</div>
                        <div className="text-gray-400 text-sm">Avg Cap Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Favorite Properties */}
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Favorite Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        You have {favorites.length} favorite properties. 
                        Search for properties to start building your favorites list.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No favorite properties yet</p>
                      <Button
                        onClick={() => setActiveTab('search')}
                        variant="outline"
                        className="mt-4 bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        Start Searching
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Market Trends */}
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Market Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">National Median Price</span>
                        <div className="text-right">
                          <div className="text-white font-semibold">$425,000</div>
                          <div className="text-green-400 text-sm">+5.2% YoY</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">Average Days on Market</span>
                        <div className="text-right">
                          <div className="text-white font-semibold">28 days</div>
                          <div className="text-red-400 text-sm">+3 days</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">Inventory Levels</span>
                        <div className="text-right">
                          <div className="text-white font-semibold">2.1 months</div>
                          <div className="text-yellow-400 text-sm">Balanced</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Markets */}
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Top Investment Markets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { city: 'Austin, TX', capRate: 8.2, appreciation: 12.5 },
                        { city: 'Phoenix, AZ', capRate: 7.8, appreciation: 11.3 },
                        { city: 'Tampa, FL', capRate: 7.5, appreciation: 10.8 },
                        { city: 'Nashville, TN', capRate: 7.2, appreciation: 9.9 },
                        { city: 'Charlotte, NC', capRate: 6.9, appreciation: 8.7 }
                      ].map((market, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white font-medium">{market.city}</span>
                          <div className="text-right text-sm">
                            <div className="text-green-400">{market.capRate}% Cap Rate</div>
                            <div className="text-blue-400">{market.appreciation}% Appreciation</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Sources */}
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Data Sources & Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">MLS Systems</h4>
                      <div className="space-y-2">
                        {health?.providers.slice(0, 5).map((provider, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{provider.provider.replace('_', ' ')}</span>
                            <Badge 
                              variant="outline" 
                              className={`${
                                provider.isOnline 
                                  ? 'bg-green-900/20 border-green-500/20 text-green-300' 
                                  : 'bg-red-900/20 border-red-500/20 text-red-300'
                              }`}
                            >
                              {provider.isOnline ? 'Online' : 'Offline'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Coverage Areas</h4>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div>• All 50 US States</div>
                        <div>• 3,000+ Cities</div>
                        <div>• 25,000+ Neighborhoods</div>
                        <div>• 500+ MLS Systems</div>
                        <div>• Real-time Updates</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Data Quality</h4>
                      <div className="space-y-3">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Accuracy</span>
                            <span className="text-white text-sm">98.5%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Freshness</span>
                            <span className="text-white text-sm">99.2%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.2%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}