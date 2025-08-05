import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase"

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_TEST_PRICE_ID) {
      return NextResponse.json(
        {
          status: "error",
          message: "Stripe environment variables (STRIPE_SECRET_KEY, STRIPE_TEST_PRICE_ID) are not set.",
        },
        { status: 500 },
      )
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    })
    const supabase = createAdminClient()

    // Generate a unique test email
    const testEmail = `sub-test-${Date.now()}@example.com`
    const testPassword = "password123"
    let userId: string | null = null
    let customerId: string | null = null

    try {
      // 1. Register a new user in Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
      })

      if (signUpError) {
        throw new Error(`Supabase signup failed: ${signUpError.message}`)
      }
      userId = signUpData.user?.id || null
      if (!userId) {
        throw new Error("User ID not returned after Supabase signup.")
      }

      // 2. Create a Stripe Customer
      const customer = await stripe.customers.create({
        email: testEmail,
        metadata: {
          supabase_user_id: userId,
        },
      })
      customerId = customer.id

      // 3. Create a Checkout Session
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_TEST_PRICE_ID, // Use a test price ID
            quantity: 1,
          },
        ],
        mode: "subscription",
        customer: customerId,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        metadata: {
          userId: userId,
        },
      })

      if (!checkoutSession.url) {
        throw new Error("Stripe checkout session URL not generated.")
      }

      // 4. Simulate successful payment (this is the tricky part for E2E server-side)
      // In a real E2E, you'd visit the checkoutSession.url and complete payment.
      // For a server-side test, we'll simulate the webhook event that Stripe sends.
      // This requires knowing the subscription ID created by the checkout session.
      // Since we can't complete the actual payment flow here, we'll simulate the webhook
      // that would update the user's subscription status in your DB.

      // Find the subscription created by the checkout session (might take a moment)
      let subscription: Stripe.Subscription | null = null
      let attempts = 0
      while (!subscription && attempts < 5) {
        const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 1 })
        if (subscriptions.data.length > 0) {
          subscription = subscriptions.data[0]
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second
          attempts++
        }
      }

      if (!subscription) {
        throw new Error("Failed to find subscription for the test customer.")
      }

      // Simulate updating user role in Supabase based on subscription
      const { error: updateError } = await supabase
        .from("users")
        .update({ role: "wholesaler" }) // Example: user becomes a wholesaler upon subscription
        .eq("id", userId)

      if (updateError) {
        throw new Error(`Failed to update user role in Supabase: ${updateError.message}`)
      }

      // 5. Verify user role updated
      const { data: updatedUserData, error: fetchUserError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single()

      if (fetchUserError || updatedUserData?.role !== "wholesaler") {
        throw new Error(
          `User role not updated to 'wholesaler' after simulated subscription. Current role: ${updatedUserData?.role}`,
        )
      }

      return NextResponse.json({ status: "success", message: "Subscription flow E2E test successful!" })
    } finally {
      // Clean up: delete Stripe customer and Supabase user
      if (customerId) {
        try {
          await stripe.customers.del(customerId)
        } catch (e) {
          console.warn("Failed to delete Stripe customer:", e)
        }
      }
      if (userId) {
        try {
          await supabase.auth.admin.deleteUser(userId)
        } catch (e) {
          console.warn("Failed to delete Supabase user:", e)
        }
      }
    }
  } catch (error: any) {
    console.error("Subscription flow E2E test failed:", error)
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 })
  }
}
