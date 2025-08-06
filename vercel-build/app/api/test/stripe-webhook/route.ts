import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function GET() {
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ status: "error", message: "STRIPE_WEBHOOK_SECRET is not set." }, { status: 500 })
    }

    // Attempt to retrieve a webhook endpoint to verify API key validity
    // This is a simplified check; a more robust check might involve listing endpoints
    // or attempting a specific Stripe API call that requires authentication.
    const webhookEndpoints = await stripe.webhookEndpoints.list({ limit: 1 })

    if (webhookEndpoints.data.length > 0) {
      return NextResponse.json({ status: "success", message: "Stripe Webhook API key is valid." })
    } else {
      return NextResponse.json({
        status: "success",
        message: "Stripe Webhook API key is valid, but no webhooks found.",
      })
    }
  } catch (error: any) {
    console.error("Stripe Webhook test failed:", error)
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}
