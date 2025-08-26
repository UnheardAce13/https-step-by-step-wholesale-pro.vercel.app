import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { leadData, wholesalerId } = body

    if (!leadData || !wholesalerId) {
      return NextResponse.json({ error: "Missing lead data or wholesaler ID" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Send to Zapier webhook for AI processing
    const zapierResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'zikk_capture',
        data: {
          ...leadData,
          wholesaler_id: wholesalerId,
          timestamp: new Date().toISOString()
        }
      })
    })

    // Store lead in database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        wholesaler_id: wholesalerId,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        property_address: leadData.propertyAddress,
        lead_source: leadData.source || 'website',
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (leadError) {
      console.error('Lead storage error:', leadError)
      return NextResponse.json({ error: "Failed to store lead" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Lead captured successfully",
      leadId: lead.id,
      status: "processing"
    })

  } catch (error: any) {
    console.error('Zikk capture error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}