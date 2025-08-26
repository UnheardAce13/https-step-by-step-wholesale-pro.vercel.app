import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { propertyId, bidAmount, investorId, paymentMethodId } = body

    if (!propertyId || !bidAmount || !investorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if bidding is still open
    const now = new Date()
    const listingDate = new Date(property.created_at)
    const daysSinceListing = (now.getTime() - listingDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysSinceListing > 5) {
      return NextResponse.json({ error: "Bidding period has expired" }, { status: 400 })
    }

    // Calculate 10% overage fee if bid is above asking price
    let overageFee = 0
    if (bidAmount > property.asking_price) {
      overageFee = (bidAmount - property.asking_price) * 0.10
    }

    // Create payment intent for bidding fee + overage
    const totalFee = 4900 + (overageFee * 100) // $49 + overage in cents
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalFee,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        type: 'bidding_fee',
        property_id: propertyId,
        investor_id: investorId,
        bid_amount: bidAmount.toString(),
        overage_fee: overageFee.toString()
      },
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/investor/dashboard`
    })

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: "Payment failed" }, { status: 400 })
    }

    // Create bid record
    const { data: bid, error: bidError } = await supabase
      .from('property_bids')
      .insert({
        property_id: propertyId,
        investor_id: investorId,
        bid_amount: bidAmount,
        bidding_fee_paid: 49.00,
        overage_fee: overageFee,
        payment_intent_id: paymentIntent.id,
        status: 'active',
        expires_at: new Date(listingDate.getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (bidError) {
      console.error('Bid creation error:', bidError)
      return NextResponse.json({ error: "Failed to place bid" }, { status: 500 })
    }

    // Notify wholesaler
    const { data: wholesaler } = await supabase
      .from('user_profiles')
      .select('email, phone')
      .eq('id', property.wholesaler_id)
      .single()

    if (wholesaler) {
      // Send SMS notification
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: wholesaler.phone,
          message: `New bid of $${bidAmount.toLocaleString()} received for ${property.address}. View details in your dashboard.`,
          type: 'bid_notification'
        })
      })
    }

    return NextResponse.json({ 
      success: true,
      bidId: bid.id,
      expiresAt: bid.expires_at,
      totalFeesPaid: totalFee / 100
    })

  } catch (error: any) {
    console.error('Bidding error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}