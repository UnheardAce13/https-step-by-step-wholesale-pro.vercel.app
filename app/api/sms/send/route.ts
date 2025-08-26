import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { to, message, type = "lead_outreach", userId } = body

    if (!to || !message) {
      return NextResponse.json({ error: "Missing phone number or message" }, { status: 400 })
    }

    // Send SMS via Telnyx
    const telnyxResponse = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.TELNYX_SMS_FROM_NUMBER,
        to: to,
        text: message,
        webhook_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/sms/webhook`
      })
    })

    const telnyxData = await telnyxResponse.json()

    if (!telnyxResponse.ok) {
      console.error('Telnyx error:', telnyxData)
      return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      messageId: telnyxData.data.id,
      status: "sent"
    })

  } catch (error: any) {
    console.error('SMS send error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}