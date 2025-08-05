import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ status: "error", message: "STRIPE_SECRET_KEY is not set." }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    })

    // Attempt a simple API call to verify the key, e.g., list products
    const products = await stripe.products.list({ limit: 1 })

    if (products) {
      return NextResponse.json({ status: "success", message: "Stripe API connection successful!" })
    } else {
      return NextResponse.json(
        { status: "error", message: "Stripe API connection failed: No products found." },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Stripe API test failed:", error)
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}
