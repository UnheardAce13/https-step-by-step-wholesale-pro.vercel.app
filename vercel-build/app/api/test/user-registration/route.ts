import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Generate a unique test email
    const testEmail = `test-user-${Date.now()}@example.com`
    const testPassword = "password123" // Use a strong password in production

    // 1. Attempt to register a new user
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Auto-confirm for testing
    })

    if (signUpError) {
      console.error("User registration test failed (Supabase auth):", signUpError)
      return NextResponse.json({ status: "failed", message: signUpError.message }, { status: 500 })
    }

    const userId = signUpData.user?.id

    if (!userId) {
      return NextResponse.json({ status: "failed", message: "User ID not returned after signup." }, { status: 500 })
    }

    // 2. Insert user into public.users table (simulating profile creation)
    const { error: insertError } = await supabase.from("users").insert({ id: userId, email: testEmail, role: "user" })

    if (insertError) {
      console.error("User registration test failed (public.users insert):", insertError)
      // Clean up auth user if public.users insert fails
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json({ status: "failed", message: insertError.message }, { status: 500 })
    }

    // 3. Verify user exists in public.users
    const { data: userData, error: fetchError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (fetchError || !userData) {
      console.error("User registration test failed (fetch public.users):", fetchError)
      // Clean up auth user
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { status: "failed", message: "Failed to verify user in public.users table." },
        { status: 500 },
      )
    }

    // Clean up the created test user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
    if (deleteError) {
      console.warn("Failed to clean up test user:", deleteError.message)
    }

    return NextResponse.json({ status: "success", message: "User registration E2E test successful!" })
  } catch (error: any) {
    console.error("User registration E2E test failed (catch block):", error)
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 })
  }
}
