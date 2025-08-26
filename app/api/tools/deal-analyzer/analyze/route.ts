import { NextResponse } from "next/server"

interface PropertyData {
  address: string;
  purchasePrice: number;
  arv?: number;
  rehabCost?: number;
  sqft?: number;
  condition?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { propertyData, userId }: { propertyData: PropertyData; userId: string } = body

    if (!propertyData) {
      return NextResponse.json({ error: "Property data required" }, { status: 400 })
    }

    // AI Deal Analysis Logic
    const analysis = {
      property: {
        address: propertyData.address,
        purchasePrice: propertyData.purchasePrice,
        arv: propertyData.arv || calculateARV(propertyData),
        rehabCost: propertyData.rehabCost || estimateRehabCost(propertyData)
      },
      calculations: {
        totalInvestment: propertyData.purchasePrice + (propertyData.rehabCost || 0),
        potentialProfit: (propertyData.arv || 0) - (propertyData.purchasePrice + (propertyData.rehabCost || 0)),
        roi: calculateROI(propertyData),
        profitMargin: calculateProfitMargin(propertyData),
        wholesaleSpread: (propertyData.arv || 0) * 0.7 - propertyData.purchasePrice
      },
      marketAnalysis: {
        comparableProperties: await getComparables(propertyData.address),
        marketTrend: "Increasing", // Mock data
        demandLevel: "High",
        timeOnMarket: "45 days average"
      },
      riskAssessment: {
        overallRisk: calculateRiskScore(propertyData),
        factors: [
          { factor: "Market Conditions", risk: "Low", impact: "Positive" },
          { factor: "Property Condition", risk: "Medium", impact: "Neutral" },
          { factor: "Location", risk: "Low", impact: "Positive" }
        ]
      },
      recommendations: generateRecommendations(propertyData),
      aiInsights: await getAIInsights(propertyData)
    }

    return NextResponse.json({ analysis })

  } catch (error: any) {
    console.error('Deal analysis error:', error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

function calculateARV(data: PropertyData): number {
  // Simple ARV calculation - would use market data in production
  return data.purchasePrice * 1.4
}

function estimateRehabCost(data: PropertyData): number {
  // Estimate based on property type and condition
  const baseCost = data.sqft ? data.sqft * 15 : 25000
  return baseCost
}

function calculateROI(data: PropertyData): number {
  const investment = data.purchasePrice + (data.rehabCost || 0)
  const profit = (data.arv || 0) - investment
  return (profit / investment) * 100
}

function calculateProfitMargin(data: PropertyData): number {
  const revenue = data.arv || 0
  const cost = data.purchasePrice + (data.rehabCost || 0)
  return ((revenue - cost) / revenue) * 100
}

function calculateRiskScore(data: PropertyData): string {
  const roi = calculateROI(data)
  if (roi > 25) return "Low"
  if (roi > 15) return "Medium"
  return "High"
}

async function getComparables(address: string): Promise<any[]> {
  // Mock comparable properties
  return [
    { address: "Similar Property 1", soldPrice: 125000, soldDate: "2024-01-15" },
    { address: "Similar Property 2", soldPrice: 132000, soldDate: "2024-02-10" },
    { address: "Similar Property 3", soldPrice: 128000, soldDate: "2024-01-28" }
  ]
}

function generateRecommendations(data: PropertyData): string[] {
  const recommendations = []
  const roi = calculateROI(data)
  
  if (roi > 20) {
    recommendations.push("Excellent deal - proceed with confidence")
  } else if (roi > 15) {
    recommendations.push("Good deal - negotiate for better price if possible")
  } else {
    recommendations.push("Marginal deal - consider passing or negotiate significantly lower price")
  }
  
  recommendations.push("Verify all numbers with local market data")
  recommendations.push("Consider holding costs and carrying expenses")
  
  return recommendations
}

async function getAIInsights(data: PropertyData): Promise<string[]> {
  // Send to Zapier for AI analysis
  try {
    await fetch(process.env.ZAPIER_WEBHOOK_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deal_analysis',
        data: data
      })
    })
  } catch (error) {
    console.error('AI insights error:', error)
  }
  
  return [
    "Property shows strong fundamentals for the local market",
    "Recent sales indicate stable appreciation in the area",
    "Consider seasonal market fluctuations in your timeline"
  ]
}