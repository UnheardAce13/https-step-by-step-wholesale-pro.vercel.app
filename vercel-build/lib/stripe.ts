import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
})

export const getStripeCustomerPortalLink = async (customerId: string) => {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings/billing`,
  })
  return portalSession.url
}

export const createStripeCheckoutSession = async (
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string,
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  })
  return session.url
}
