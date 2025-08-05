import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Generate a unique test email and password
    const testEmail = `auth-test-${Date.now()}@example.com`
    const testPassword = "password123"

    let userId: string | null = null

    try {
      // 1. Register a new user
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true, // Auto-confirm for testing
      })

      if (signUpError) {
        throw new Error(`Signup failed: ${signUpError.message}`)
      }
      userId = signUpData.user?.id || null

      if (!userId) {
        throw new Error("User ID not returned after signup.")
      }

      // 2. Simulate sign-in (using admin client for simplicity, in real E2E this would be client-side)
      // Note: For a true E2E test, you'd simulate a client-side sign-in using `supabase.auth.signInWithPassword`
      // and then verify the session. This server-side test primarily checks the auth service's responsiveness.
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })

      if (signInError) {
        throw new Error(`Sign-in failed: ${signInError.message}`)
      }

      if (!signInData.session) {
        throw new Error("No session returned after sign-in.")
      }

      // 3. Verify the session (e.g., fetch user details with the session's access token)
      const {
        data: { user: sessionUser },
        error: sessionError,
      } = await supabase.auth.getUser(signInData.session.access_token)

      if (sessionError || !sessionUser || sessionUser.id !== userId) {
        throw new Error(`Session verification failed: ${sessionError?.message || "User mismatch"}`)
      }

      return NextResponse.json({ status: "success", message: "Authentication E2E test successful!" })
    } finally {
      // Clean up the created test user
      if (userId) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
        if (deleteError) {
          console.warn("Failed to clean up test user:", deleteError.message)
        }
      }
    }
  } catch (error: any) {
    console.error("Authentication E2E test failed:", error)
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 })
  }
}
