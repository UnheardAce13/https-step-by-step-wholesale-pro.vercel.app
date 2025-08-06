import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ message: "No Stripe signature header" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      const subscriptionCreated = event.data.object as Stripe.Subscription
      console.log(`Subscription created: ${subscriptionCreated.id}`)
      // Update user's subscription status in your database
      // You might need to get the user ID from subscription metadata or customer object
      const customerIdCreated = subscriptionCreated.customer as string
      const customerCreated = await stripe.customers.retrieve(customerIdCreated)
      const userIdCreated = (customerCreated as Stripe.Customer).metadata?.supabase_user_id

      if (userIdCreated) {
        const { error } = await supabase
          .from("users")
          .update({
            subscription_status: "active",
            stripe_customer_id: customerIdCreated,
            stripe_subscription_id: subscriptionCreated.id,
          })
          .eq("id", userIdCreated)
        if (error) console.error("Error updating user subscription status:", error)
      }

      // Log payment event
      await supabase.from("payment_logs").insert({
        user_id: userIdCreated,
        event_type: "subscription_created",
        stripe_event_id: event.id,
        payload: event.data.object,
        status: "success",
      })
      break
    case "customer.subscription.updated":
      const subscriptionUpdated = event.data.object as Stripe.Subscription
      console.log(`Subscription updated: ${subscriptionUpdated.id}, Status: ${subscriptionUpdated.status}`)
      // Update user's subscription status in your database
      const customerIdUpdated = subscriptionUpdated.customer as string
      const customerUpdated = await stripe.customers.retrieve(customerIdUpdated)
      const userIdUpdated = (customerUpdated as Stripe.Customer).metadata?.supabase_user_id

      if (userIdUpdated) {
        const { error } = await supabase
          .from("users")
          .update({ subscription_status: subscriptionUpdated.status })
          .eq("id", userIdUpdated)
        if (error) console.error("Error updating user subscription status:", error)
      }

      // Log payment event
      await supabase.from("payment_logs").insert({
        user_id: userIdUpdated,
        event_type: "subscription_updated",
        stripe_event_id: event.id,
        payload: event.data.object,
        status: "success",
      })
      break
    case "customer.subscription.deleted":
      const subscriptionDeleted = event.data.object as Stripe.Subscription
      console.log(`Subscription deleted: ${subscriptionDeleted.id}`)
      // Update user's subscription status to inactive/canceled
      const customerIdDeleted = subscriptionDeleted.customer as string
      const customerDeleted = await stripe.customers.retrieve(customerIdDeleted)
      const userIdDeleted = (customerDeleted as Stripe.Customer).metadata?.supabase_user_id

      if (userIdDeleted) {
        const { error } = await supabase
          .from("users")
          .update({ subscription_status: "canceled", stripe_subscription_id: null })
          .eq("id", userIdDeleted)
        if (error) console.error("Error updating user subscription status:", error)
      }

      // Log payment event
      await supabase.from("payment_logs").insert({
        user_id: userIdDeleted,
        event_type: "subscription_deleted",
        stripe_event_id: event.id,
        payload: event.data.object,
        status: "success",
      })
      break
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      console.log(`Checkout session completed: ${checkoutSession.id}`)
      // Fulfill the purchase, grant access to content, etc.
      // The customer ID and subscription ID (if mode is 'subscription') are available here.
      const userIdFromCheckout = checkoutSession.metadata?.userId
      const customerIdFromCheckout = checkoutSession.customer as string
      const subscriptionIdFromCheckout = checkoutSession.subscription as string

      if (userIdFromCheckout) {
        const { error } = await supabase
          .from("users")
          .update({ stripe_customer_id: customerIdFromCheckout, stripe_subscription_id: subscriptionIdFromCheckout })
          .eq("id", userIdFromCheckout)
        if (error) console.error("Error updating user with Stripe IDs:", error)
      }

      // Log payment event
      await supabase.from("payment_logs").insert({
        user_id: userIdFromCheckout,
        event_type: "checkout_session_completed",
        stripe_event_id: event.id,
        payload: event.data.object,
        amount: checkoutSession.amount_total ? checkoutSession.amount_total / 100 : null,
        currency: checkoutSession.currency,
        status: "success",
      })
      break
    case "invoice.payment_succeeded":
      const invoicePaymentSucceeded = event.data.object as Stripe.Invoice
      console.log(`Invoice payment succeeded: ${invoicePaymentSucceeded.id}`)
      // Handle successful recurring payments
      // Log payment event
      await supabase.from("payment_logs").insert({
        user_id: null, // Can derive from customer_id if needed
        event_type: "invoice_payment_succeeded",
        stripe_event_id: event.id,
        payload: event.data.object,
        amount: invoicePaymentSucceeded.amount_paid ? invoicePaymentSucceeded.amount_paid / 100 : null,
        currency: invoicePaymentSucceeded.currency,
        status: "success",
      })
      break
    case "invoice.payment_failed":
      const invoicePaymentFailed = event.data.object as Stripe.Invoice
      console.log(`Invoice payment failed: ${invoicePaymentFailed.id}`)
      // Handle failed recurring payments, notify user, etc.
      // Log payment event
      await supabase.from("payment_logs").insert({
        user_id: null, // Can derive from customer_id if needed
        event_type: "invoice_payment_failed",
        stripe_event_id: event.id,
        payload: event.data.object,
        amount: invoicePaymentFailed.amount_due ? invoicePaymentFailed.amount_due / 100 : null,
        currency: invoicePaymentFailed.currency,
        status: "failed",
      })
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

export async function GET() {
  return NextResponse.json({
    message: "Stripe webhook endpoint is active. Send POST requests with Stripe webhook payloads.",
  })
}
