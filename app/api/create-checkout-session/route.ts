import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json()

    if (!priceId || !userId) {
      return NextResponse.json({ message: "Price ID and User ID are required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch user's email from Supabase to pre-fill Stripe Checkout
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email, stripe_customer_id")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      console.error("Error fetching user for checkout:", userError)
      return NextResponse.json({ message: "User not found or error fetching user data" }, { status: 404 })
    }

    let customerId = user.stripe_customer_id

    // If no Stripe customer ID exists, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          supabase_user_id: userId,
        },
      })
      customerId = customer.id

      // Update user's profile with the new Stripe customer ID
      await supabase.from("users").update({ stripe_customer_id: customerId }).eq("id", userId)
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: customerId,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        userId: userId, // Pass Supabase user ID to webhook
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
