import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function GET() {
  try {
    const plans = [
      {
        id: "starter",
        name: "Starter Pack",
        price: 14900, // $149.00 in cents
        currency: "usd",
        interval: "month",
        features: ["2,500 SMS/month", "Zikk Lead Capture", "Basic CRM", "Email Support"]
      },
      {
        id: "pro", 
        name: "Pro Pack",
        price: 19900, // $199.00 in cents
        currency: "usd",
        interval: "month",
        features: ["6,500 SMS/month", "All Starter Features", "Advanced Analytics", "Priority Support"]
      },
      {
        id: "empire",
        name: "Empire Pack", 
        price: 59900, // $599.00 in cents
        currency: "usd",
        interval: "month",
        features: ["15,000 SMS/month", "All Pro Features", "White-Label Branding", "Dedicated Support"]
      }
    ]

    return NextResponse.json({ plans })
  } catch (error: any) {
    console.error('Plans fetch error:', error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}