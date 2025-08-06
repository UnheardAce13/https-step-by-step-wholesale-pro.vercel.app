import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!process.env.ZAPIER_WEBHOOK_SECRET) {
      return NextResponse.json({ status: "error", message: "ZAPIER_WEBHOOK_SECRET is not set." }, { status: 500 })
    }

    // This endpoint is primarily for receiving webhooks.
    // A "test" for Zapier usually involves sending a test payload from Zapier itself.
    // Here, we'll just confirm the endpoint is reachable and the secret is present.
    return NextResponse.json({ status: "success", message: "Zapier webhook endpoint is configured." })
  } catch (error: any) {
    console.error("Zapier test failed:", error)
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}
