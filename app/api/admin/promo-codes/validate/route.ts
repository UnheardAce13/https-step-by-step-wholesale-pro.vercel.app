import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: "Promo code required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ 
        valid: false, 
        message: "Invalid promo code" 
      })
    }

    // Check if expired
    const now = new Date()
    const expiresAt = new Date(data.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json({ 
        valid: false, 
        message: "Promo code has expired" 
      })
    }

    return NextResponse.json({ 
      valid: true, 
      days: data.days_valid,
      description: data.description
    })

  } catch (error: any) {
    console.error('Promo code validation error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}