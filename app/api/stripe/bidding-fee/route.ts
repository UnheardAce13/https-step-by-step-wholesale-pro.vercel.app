import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { propertyId, bidAmount, userId, investorEmail } = body

    if (!propertyId || !bidAmount || !userId || !investorEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Create payment intent for $49 bidding fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 4900, // $49.00 in cents
      currency: 'usd',
      metadata: {
        type: 'bidding_fee',
        property_id: propertyId,
        user_id: userId,
        bid_amount: bidAmount.toString()
      },
      description: `Bidding fee for property ${propertyId}`
    })

    // Store bid in database
    const { data: bidData, error: bidError } = await supabase
      .from('property_bids')
      .insert({
        property_id: propertyId,
        investor_id: userId,
        bid_amount: bidAmount,
        bidding_fee_payment_intent: paymentIntent.id,
        status: 'pending_payment',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (bidError) {
      console.error('Bid creation error:', bidError)
      return NextResponse.json({ error: "Failed to create bid" }, { status: 500 })
    }

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      bidId: bidData.id
    })

  } catch (error: any) {
    console.error('Bidding fee creation error:', error)
    return NextResponse.json({ error: "Failed to process bidding fee" }, { status: 500 })
  }
}