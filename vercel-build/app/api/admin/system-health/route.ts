import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Example: Check database connection by querying a simple table
    const { data: users, error: dbError } = await supabase.from("users").select("id").limit(1)

    if (dbError) {
      console.error("Database health check failed:", dbError)
      return NextResponse.json({ status: "error", message: "Database connection failed." }, { status: 500 })
    }

    // Example: Check external API status (mocked for now)
    const externalApiStatus = {
      stripe: "operational",
      telnyx: "operational",
      docusign: "operational",
      zapier: "operational",
    }

    return NextResponse.json({
      status: "success",
      message: "System is operational.",
      database: "connected",
      externalApis: externalApiStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("System health check failed:", error)
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}
