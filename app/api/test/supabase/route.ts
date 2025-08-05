import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("users").select("id").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: "success", message: "Supabase connection successful!" })
  } catch (error: any) {
    console.error("Supabase connection test failed (catch block):", error)
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}
