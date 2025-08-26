import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { searchCriteria, wholesalerId } = body

    // Send to Zapier for AI processing
    const zapierResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'huntz_search',
        data: {
          criteria: searchCriteria,
          wholesaler_id: wholesalerId,
          timestamp: new Date().toISOString()
        }
      })
    })

    return NextResponse.json({ 
      message: "Property search initiated",
      status: "searching"
    })

  } catch (error: any) {
    console.error('Huntz search error:', error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Huntz Property Search Agent",
    status: "active"
  })
}