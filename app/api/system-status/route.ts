import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Check database connection
    const { error: dbError } = await supabase.from("users").select("id").limit(1)
    const dbStatus = dbError ? "down" : "up"

    // Check external services (mocked for simplicity)
    const stripeStatus = "up"
    const telnyxStatus = "up"
    const docusignStatus = "up"
    const zapierStatus = "up"
    const resendStatus = "up"

    const overallStatus =
      dbStatus === "up" &&
      stripeStatus === "up" &&
      telnyxStatus === "up" &&
      docusignStatus === "up" &&
      zapierStatus === "up" &&
      resendStatus === "up"
        ? "operational"
        : "degraded"

    return NextResponse.json({
      status: overallStatus,
      services: {
        database: dbStatus,
        stripe: stripeStatus,
        telnyx: telnyxStatus,
        docusign: docusignStatus,
        zapier: zapierStatus,
        resend: resendStatus,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("System status check failed:", error)
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}
