import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const secret = req.headers.get("X-Zapier-Secret") // Example: Custom header for verification

    if (secret !== process.env.ZAPIER_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    console.log("Received Zapier webhook:", body)

    // Process the webhook payload here
    // e.g., save to database, trigger other actions

    return NextResponse.json({ message: "Webhook received successfully!" }, { status: 200 })
  } catch (error: any) {
    console.error("Error processing Zapier webhook:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
