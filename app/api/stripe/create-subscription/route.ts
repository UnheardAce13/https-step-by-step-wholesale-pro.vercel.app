import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { planId, userId, email, promoCode } = body

    if (!planId || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get plan details
    const planPrices = {
      starter: "price_starter_pack_monthly",
      pro: "price_pro_pack_monthly", 
      empire: "price_empire_pack_monthly"
    }

    const priceId = planPrices[planId as keyof typeof planPrices]
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Create or get Stripe customer
    let customer
    try {
      const customers = await stripe.customers.list({ email, limit: 1 })
      if (customers.data.length > 0) {
        customer = customers.data[0]
      } else {
        customer = await stripe.customers.create({
          email,
          metadata: { supabase_user_id: userId }
        })
      }
    } catch (error) {
      console.error('Customer creation error:', error)
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
    }

    // Apply promo code discount if provided
    let discounts = []
    if (promoCode) {
      // Validate promo code
      const { data: promoData } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (promoData) {
        // Create trial period based on promo code
        const trialEnd = Math.floor(Date.now() / 1000) + (promoData.days_valid * 24 * 60 * 60)
        
        // Create checkout session with trial
        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          payment_method_types: ['card'],
          line_items: [{
            price: priceId,
            quantity: 1,
          }],
          mode: 'subscription',
          subscription_data: {
            trial_end: trialEnd,
            metadata: {
              user_id: userId,
              plan_id: planId,
              promo_code: promoCode
            }
          },
          success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wholesaler/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wholesaler/signup`,
        })

        // Mark promo code as used
        await supabase
          .from('promo_codes')
          .update({ 
            times_used: (promoData.times_used || 0) + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', promoData.id)

        return NextResponse.json({ sessionId: session.id, url: session.url })
      }
    }

    // Create regular checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId
        }
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wholesaler/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wholesaler/signup`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })

  } catch (error: any) {
    console.error('Subscription creation error:', error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}