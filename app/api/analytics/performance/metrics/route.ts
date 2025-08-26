import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

interface Lead {
  id: string;
  wholesaler_id: string;
  status: string;
  created_at: string;
}

interface Deal {
  id: string;
  wholesaler_id: string;
  profit?: number;
  created_at: string;
}

interface SmsMessage {
  id: string;
  user_id: string;
  direction: string;
  created_at: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const timeframe = searchParams.get('timeframe') || '30' // days

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const days = parseInt(timeframe)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get performance metrics
    const metrics = await calculatePerformanceMetrics(supabase, userId, startDate)
    
    return NextResponse.json({ metrics })

  } catch (error: any) {
    console.error('Performance metrics error:', error)
    return NextResponse.json({ error: "Failed to get metrics" }, { status: 500 })
  }
}

async function calculatePerformanceMetrics(supabase: any, userId: string, startDate: Date) {
  // Lead metrics
  const { data: leads }: { data: Lead[] | null } = await supabase
    .from('leads')
    .select('*')
    .eq('wholesaler_id', userId)
    .gte('created_at', startDate.toISOString())

  // Deal metrics
  const { data: deals }: { data: Deal[] | null } = await supabase
    .from('completed_deals')
    .select('*')
    .eq('wholesaler_id', userId)
    .gte('created_at', startDate.toISOString())

  // SMS metrics
  const { data: smsData }: { data: SmsMessage[] | null } = await supabase
    .from('sms_conversations')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())

  const totalLeads = leads?.length || 0
  const qualifiedLeads = leads?.filter((l: Lead) => l.status === 'qualified').length || 0
  const completedDeals = deals?.length || 0
  const totalRevenue = deals?.reduce((sum: number, deal: Deal) => sum + (deal.profit || 0), 0) || 0
  const smsCount = smsData?.filter((s: SmsMessage) => s.direction === 'outbound').length || 0

  // Calculate KPIs
  const conversionRate = totalLeads > 0 ? (completedDeals / totalLeads) * 100 : 0
  const avgDealSize = completedDeals > 0 ? totalRevenue / completedDeals : 0
  const leadQualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
  const responseRate = smsCount > 0 ? (smsData?.filter((s: SmsMessage) => s.direction === 'inbound').length || 0) / smsCount * 100 : 0

  return {
    summary: {
      totalLeads,
      qualifiedLeads,
      completedDeals,
      totalRevenue,
      smsCount
    },
    kpis: {
      conversionRate: Math.round(conversionRate * 100) / 100,
      avgDealSize: Math.round(avgDealSize),
      leadQualificationRate: Math.round(leadQualificationRate * 100) / 100,
      responseRate: Math.round(responseRate * 100) / 100,
      profitMargin: 22.5, // Mock data
      dealVelocity: completedDeals > 0 ? Math.round(30 / completedDeals * 100) / 100 : 0
    },
    trends: {
      leadsGrowth: 15.3, // Mock % growth
      revenueGrowth: 28.7,
      conversionTrend: "increasing",
      marketShare: 8.2
    },
    benchmarks: {
      industryAvgConversion: 3.5,
      industryAvgDealSize: 8500,
      industryAvgResponseRate: 15.2,
      yourRanking: "Top 25%"
    },
    aiInsights: [
      "Your conversion rate is 45% above industry average",
      "Consider increasing lead volume to maximize revenue potential",
      "SMS response rate indicates strong market engagement",
      "Deal velocity suggests efficient process optimization"
    ]
  }
}