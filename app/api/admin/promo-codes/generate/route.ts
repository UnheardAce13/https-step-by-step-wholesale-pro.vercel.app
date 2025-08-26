import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { days, quantity = 1, description = "" } = body

    if (!days || days < 1 || days > 90) {
      return NextResponse.json({ error: "Days must be between 1 and 90" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const codes = []

    for (let i = 0; i < quantity; i++) {
      const code = generatePromoCode()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + days)

      const { data, error } = await supabase
        .from('promo_codes')
        .insert({
          code,
          days_valid: days,
          expires_at: expiresAt.toISOString(),
          description,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Promo code creation error:', error)
        continue
      }

      codes.push(data)
    }

    return NextResponse.json({ 
      message: `Generated ${codes.length} promo codes`,
      codes
    })

  } catch (error: any) {
    console.error('Promo code generation error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}