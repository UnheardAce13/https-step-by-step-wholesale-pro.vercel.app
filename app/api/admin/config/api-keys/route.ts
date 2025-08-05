import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient()
    const { data: config, error } = await supabase.from("system_config").select("*").eq("key", "api_keys").single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means "no rows found"
      console.error("Error fetching API keys config:", error)
      return NextResponse.json({ message: "Error fetching API keys", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ apiKeys: config?.value || {} })
  } catch (error: any) {
    console.error("Error in GET /api/admin/config/api-keys:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const { apiKeys } = await req.json()

    if (!apiKeys || typeof apiKeys !== "object") {
      return NextResponse.json({ message: "Invalid API keys data" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("system_config")
      .upsert(
        {
          key: "api_keys",
          value: apiKeys,
          description: "Centralized storage for various API keys and secrets.",
        },
        { onConflict: "key" },
      )
      .select()
      .single()

    if (error) {
      console.error("Error saving API keys config:", error)
      return NextResponse.json({ message: "Error saving API keys", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "API keys saved successfully", config: data })
  } catch (error: any) {
    console.error("Error in POST /api/admin/config/api-keys:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
