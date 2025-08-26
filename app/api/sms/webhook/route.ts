import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ received: true })
    }

    const supabase = createAdminClient()

    // Handle different webhook types
    switch (data.record_type) {
      case 'message':
        // Incoming message from lead
        if (data.direction === 'inbound') {
          await supabase.from('sms_conversations').insert({
            message_id: data.id,
            from_number: data.from.phone_number,
            to_number: data.to[0].phone_number,
            message_text: data.text,
            direction: 'inbound',
            status: 'received',
            received_at: new Date().toISOString()
          })

          // Trigger AI response via Zapier
          await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'sms_reply',
              data: {
                from: data.from.phone_number,
                message: data.text,
                timestamp: new Date().toISOString()
              }
            })
          })
        }
        break

      case 'message_status':
        // Update message delivery status
        await supabase
          .from('sms_conversations')
          .update({
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq('message_id', data.id)
        break
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('SMS webhook error:', error)
    return NextResponse.json({ received: true }) // Always return success to Telnyx
  }
}