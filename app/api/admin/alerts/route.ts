import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev"

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const {
      data: alerts,
      error,
      count,
    } = await supabase
      .from("system_alerts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching alerts:", error)
      return NextResponse.json({ message: "Error fetching alerts", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ alerts, total: count, page, limit })
  } catch (error: any) {
    console.error("Error in GET /api/admin/alerts:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const { message, severity, recipient_email } = await req.json()

    if (!message || !severity) {
      return NextResponse.json({ message: "Message and severity are required" }, { status: 400 })
    }

    // Insert alert into database
    const { data: newAlert, error: dbError } = await supabase
      .from("system_alerts")
      .insert({ message, severity })
      .select()
      .single()

    if (dbError) {
      console.error("Error saving alert to DB:", dbError)
      return NextResponse.json({ message: "Error saving alert", error: dbError.message }, { status: 500 })
    }

    // Email functionality temporarily disabled - focusing on core platform deployment
    // TODO: Re-enable email alerts after successful deployment
    if (recipient_email) {
      console.log(`Email alert would be sent to ${recipient_email} (disabled for deployment)`);
    }

    return NextResponse.json({ message: "Alert created and processed successfully", alert: newAlert }, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/admin/alerts:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = createAdminClient()
    const { id, message, severity, resolved } = await req.json()

    if (!id) {
      return NextResponse.json({ message: "Alert ID is required" }, { status: 400 })
    }

    const { data: updatedAlert, error } = await supabase
      .from("system_alerts")
      .update({ message, severity, resolved, resolved_at: resolved ? new Date().toISOString() : null })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating alert:", error)
      return NextResponse.json({ message: "Error updating alert", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Alert updated successfully", alert: updatedAlert }, { status: 200 })
  } catch (error: any) {
    console.error("Error in PUT /api/admin/alerts:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createAdminClient()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ message: "Alert ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("system_alerts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting alert:", error)
      return NextResponse.json({ message: "Error deleting alert", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Alert deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/alerts:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
