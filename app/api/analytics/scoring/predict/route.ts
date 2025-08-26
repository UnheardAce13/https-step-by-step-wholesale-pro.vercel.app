import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

interface PropertyData {
  price: number;
  location: string;
  condition: string;
  arv?: number;
  source?: string;
}

interface Deal {
  id: string;
  wholesaler_id: string;
  profit?: number;
  status: string;
}

interface ScoreFactors {
  pricePoint: number;
  location: number;
  condition: number;
  marketTiming: number;
  arvMargin: number;
  leadSource: number;
}

interface ScoreWeights {
  pricePoint: number;
  location: number;
  condition: number;
  marketTiming: number;
  arvMargin: number;
  leadSource: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { leadId, propertyData, wholesalerId }: { 
      leadId: string; 
      propertyData: PropertyData; 
      wholesalerId: string; 
    } = body

    const supabase = createAdminClient()

    // Get historical data for scoring model
    const { data: historicalDeals } = await supabase
      .from('completed_deals')
      .select('*')
      .eq('wholesaler_id', wholesalerId)
      .limit(100)

    // Calculate predictive score
    const score = calculatePredictiveScore(propertyData, historicalDeals || [])
    
    // Store score in database
    const { error: scoreError } = await supabase
      .from('lead_scores')
      .insert({
        lead_id: leadId,
        wholesaler_id: wholesalerId,
        score: score.overall,
        factors: score.factors,
        probability: score.probability,
        created_at: new Date().toISOString()
      })

    if (scoreError) {
      console.error('Score storage error:', scoreError)
    }

    return NextResponse.json({ 
      score,
      recommendation: getScoreRecommendation(score.overall)
    })

  } catch (error: any) {
    console.error('Predictive scoring error:', error)
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 })
  }
}

function calculatePredictiveScore(propertyData: PropertyData, historicalDeals: Deal[]): any {
  const factors = {
    pricePoint: scorePricePoint(propertyData.price),
    location: scoreLocation(propertyData.location),
    condition: scoreCondition(propertyData.condition),
    marketTiming: scoreMarketTiming(),
    arvMargin: scoreARVMargin(propertyData),
    leadSource: scoreLeadSource(propertyData.source || '')
  }

  // Weight factors based on historical performance
  const weights = {
    pricePoint: 0.25,
    location: 0.20,
    condition: 0.15,
    marketTiming: 0.15,
    arvMargin: 0.15,
    leadSource: 0.10
  }

  const overall = (Object.keys(factors) as Array<keyof ScoreFactors>).reduce((sum, key) => {
    return sum + (factors[key] * weights[key])
  }, 0)

  const probability = Math.min(Math.max(overall / 100, 0), 1)

  return {
    overall: Math.round(overall),
    probability: Math.round(probability * 100),
    factors,
    weights
  }
}

function scorePricePoint(price: number): number {
  // Score based on price range sweet spot
  if (price >= 50000 && price <= 150000) return 90
  if (price >= 30000 && price <= 200000) return 75
  if (price >= 200000 && price <= 300000) return 60
  return 40
}

function scoreLocation(location: string): number {
  // Mock location scoring - would use real market data
  const goodAreas = ['downtown', 'suburbs', 'growing area']
  const area = location?.toLowerCase() || ''
  
  if (goodAreas.some(good => area.includes(good))) return 85
  return 65
}

function scoreCondition(condition: string): number {
  const conditionScores: { [key: string]: number } = {
    'excellent': 95,
    'good': 85,
    'fair': 70,
    'poor': 45,
    'needs work': 60
  }
  
  return conditionScores[condition?.toLowerCase()] || 65
}

function scoreMarketTiming(): number {
  // Current market conditions score
  return 80 // Mock - would analyze current market data
}

function scoreARVMargin(data: PropertyData): number {
  if (!data.arv || !data.price) return 50
  
  const margin = (data.arv - data.price) / data.price
  
  if (margin > 0.4) return 95
  if (margin > 0.3) return 85
  if (margin > 0.2) return 70
  if (margin > 0.1) return 55
  return 30
}

function scoreLeadSource(source: string): number {
  const sourceScores: { [key: string]: number } = {
    'referral': 90,
    'website': 80,
    'direct mail': 75,
    'cold call': 60,
    'online ad': 70
  }
  
  return sourceScores[source?.toLowerCase()] || 65
}

function getScoreRecommendation(score: number): string {
  if (score >= 80) return "High Priority - Pursue Immediately"
  if (score >= 65) return "Medium Priority - Strong Potential"
  if (score >= 50) return "Low Priority - Monitor"
  return "Skip - Unlikely to Close"
}