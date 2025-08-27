/**
 * S.B.S.W.P 2.0 - PROPERTY SEARCH HOOK
 * Advanced React hook for MLS property search with caching and real-time updates
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { mlsService } from './mls-service'
import {
  PropertySearchCriteria,
  PropertySearchResult,
  PropertyDetails,
  MLSProvider,
  MarketData,
  ComparableProperty,
  SystemHealth
} from './mls-types'

interface UsePropertySearchState {
  results: PropertySearchResult | null
  loading: boolean
  error: string | null
  hasMore: boolean
}

interface UsePropertySearchReturn extends UsePropertySearchState {
  search: (criteria: PropertySearchCriteria) => Promise<void>
  loadMore: () => Promise<void>
  clearResults: () => void
  refetch: () => Promise<void>
}

export function usePropertySearch(): UsePropertySearchReturn {
  const [state, setState] = useState<UsePropertySearchState>({
    results: null,
    loading: false,
    error: null,
    hasMore: false
  })
  const [lastCriteria, setLastCriteria] = useState<PropertySearchCriteria | null>(null)

  const search = useCallback(async (criteria: PropertySearchCriteria) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    setLastCriteria(criteria)

    try {
      const results = await mlsService.searchProperties(criteria)
      setState(prev => ({
        ...prev,
        results,
        loading: false,
        hasMore: results.page < results.totalPages
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }))
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!lastCriteria || !state.results || state.loading || !state.hasMore) return

    setState(prev => ({ ...prev, loading: true }))

    try {
      const nextPageCriteria = {
        ...lastCriteria,
        page: (state.results.page || 1) + 1
      }
      
      const nextResults = await mlsService.searchProperties(nextPageCriteria)
      
      setState(prev => ({
        ...prev,
        results: prev.results ? {
          ...nextResults,
          properties: [...prev.results.properties, ...nextResults.properties]
        } : nextResults,
        loading: false,
        hasMore: nextResults.page < nextResults.totalPages
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Load more failed'
      }))
    }
  }, [lastCriteria, state.results, state.loading, state.hasMore])

  const clearResults = useCallback(() => {
    setState({
      results: null,
      loading: false,
      error: null,
      hasMore: false
    })
    setLastCriteria(null)
  }, [])

  const refetch = useCallback(async () => {
    if (!lastCriteria) return
    await search(lastCriteria)
  }, [lastCriteria, search])

  return {
    ...state,
    search,
    loadMore,
    clearResults,
    refetch
  }
}

interface UsePropertyDetailsState {
  property: PropertyDetails | null
  loading: boolean
  error: string | null
}

interface UsePropertyDetailsReturn extends UsePropertyDetailsState {
  refetch: () => Promise<void>
}

export function usePropertyDetails(
  propertyId: string | null,
  provider?: MLSProvider
): UsePropertyDetailsReturn {
  const [state, setState] = useState<UsePropertyDetailsState>({
    property: null,
    loading: false,
    error: null
  })

  const fetchProperty = useCallback(async () => {
    if (!propertyId) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const property = await mlsService.getPropertyDetails(propertyId, provider)
      setState(prev => ({
        ...prev,
        property,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch property'
      }))
    }
  }, [propertyId, provider])

  useEffect(() => {
    fetchProperty()
  }, [fetchProperty])

  return {
    ...state,
    refetch: fetchProperty
  }
}

interface UseMarketDataState {
  marketData: MarketData | null
  loading: boolean
  error: string | null
}

interface UseMarketDataReturn extends UseMarketDataState {
  refetch: () => Promise<void>
}

export function useMarketData(location: string | null): UseMarketDataReturn {
  const [state, setState] = useState<UseMarketDataState>({
    marketData: null,
    loading: false,
    error: null
  })

  const fetchMarketData = useCallback(async () => {
    if (!location) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const marketData = await mlsService.getMarketData(location)
      setState(prev => ({
        ...prev,
        marketData,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market data'
      }))
    }
  }, [location])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  return {
    ...state,
    refetch: fetchMarketData
  }
}

interface UseComparablePropertiesState {
  comparables: ComparableProperty[]
  loading: boolean
  error: string | null
}

interface UseComparablePropertiesReturn extends UseComparablePropertiesState {
  refetch: () => Promise<void>
}

export function useComparableProperties(
  propertyId: string | null,
  radius: number = 1
): UseComparablePropertiesReturn {
  const [state, setState] = useState<UseComparablePropertiesState>({
    comparables: [],
    loading: false,
    error: null
  })

  const fetchComparables = useCallback(async () => {
    if (!propertyId) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const comparables = await mlsService.getComparableProperties(propertyId, radius)
      setState(prev => ({
        ...prev,
        comparables,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch comparables'
      }))
    }
  }, [propertyId, radius])

  useEffect(() => {
    fetchComparables()
  }, [fetchComparables])

  return {
    ...state,
    refetch: fetchComparables
  }
}

interface UseSystemHealthState {
  health: SystemHealth | null
  loading: boolean
  error: string | null
}

interface UseSystemHealthReturn extends UseSystemHealthState {
  refetch: () => Promise<void>
}

export function useSystemHealth(): UseSystemHealthReturn {
  const [state, setState] = useState<UseSystemHealthState>({
    health: null,
    loading: false,
    error: null
  })

  const fetchHealth = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const health = await mlsService.getSystemHealth()
      setState(prev => ({
        ...prev,
        health,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch system health'
      }))
    }
  }, [])

  useEffect(() => {
    fetchHealth()
    
    // Refresh health status every 5 minutes
    const interval = setInterval(fetchHealth, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchHealth])

  return {
    ...state,
    refetch: fetchHealth
  }
}

// Property search form helper hook
export function usePropertySearchForm() {
  const [criteria, setCriteria] = useState<PropertySearchCriteria>({
    page: 1,
    limit: 25,
    sortBy: 'price',
    sortOrder: 'asc'
  })

  const updateCriteria = useCallback((updates: Partial<PropertySearchCriteria>) => {
    setCriteria(prev => ({
      ...prev,
      ...updates,
      page: 1 // Reset to first page when criteria changes
    }))
  }, [])

  const resetCriteria = useCallback(() => {
    setCriteria({
      page: 1,
      limit: 25,
      sortBy: 'price',
      sortOrder: 'asc'
    })
  }, [])

  return {
    criteria,
    updateCriteria,
    resetCriteria
  }
}

// Saved searches hook
interface SavedSearch {
  id: string
  name: string
  criteria: PropertySearchCriteria
  createdAt: Date
  lastRun?: Date
  alertsEnabled: boolean
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  useEffect(() => {
    // Load saved searches from localStorage
    const stored = localStorage.getItem('sbswp-saved-searches')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSavedSearches(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          lastRun: s.lastRun ? new Date(s.lastRun) : undefined
        })))
      } catch (error) {
        console.error('Failed to load saved searches:', error)
      }
    }
  }, [])

  const saveSearch = useCallback((name: string, criteria: PropertySearchCriteria) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      criteria,
      createdAt: new Date(),
      alertsEnabled: false
    }

    setSavedSearches(prev => {
      const updated = [...prev, newSearch]
      localStorage.setItem('sbswp-saved-searches', JSON.stringify(updated))
      return updated
    })

    return newSearch.id
  }, [])

  const deleteSearch = useCallback((id: string) => {
    setSavedSearches(prev => {
      const updated = prev.filter(s => s.id !== id)
      localStorage.setItem('sbswp-saved-searches', JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateSearch = useCallback((id: string, updates: Partial<SavedSearch>) => {
    setSavedSearches(prev => {
      const updated = prev.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
      localStorage.setItem('sbswp-saved-searches', JSON.stringify(updated))
      return updated
    })
  }, [])

  const runSearch = useCallback((id: string) => {
    const search = savedSearches.find(s => s.id === id)
    if (search) {
      updateSearch(id, { lastRun: new Date() })
      return search.criteria
    }
    return null
  }, [savedSearches, updateSearch])

  return {
    savedSearches,
    saveSearch,
    deleteSearch,
    updateSearch,
    runSearch
  }
}

// Property favorites hook
export function usePropertyFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('sbswp-property-favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load favorites:', error)
      }
    }
  }, [])

  const addFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) return prev
      const updated = [...prev, propertyId]
      localStorage.setItem('sbswp-property-favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => {
      const updated = prev.filter(id => id !== propertyId)
      localStorage.setItem('sbswp-property-favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isFavorite = useCallback((propertyId: string) => {
    return favorites.includes(propertyId)
  }, [favorites])

  const toggleFavorite = useCallback((propertyId: string) => {
    if (isFavorite(propertyId)) {
      removeFavorite(propertyId)
    } else {
      addFavorite(propertyId)
    }
  }, [isFavorite, addFavorite, removeFavorite])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  }
}