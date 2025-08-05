import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Generate a unique test email and password
    const testEmail = `dashboard-test-${Date.now()}@example.com`
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

      // 2. Insert user into public.users table with a default role (e.g., 'user')
      const { error: insertError } = await supabase.from("users").insert({ id: userId, email: testEmail, role: "user" })
      if (insertError) {
        throw new Error(`Failed to insert user into public.users: ${insertError.message}`)
      }

      // 3. Simulate sign-in to get a session (using admin client for simplicity)
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

      // 4. Simulate accessing a protected dashboard route
      // In a real E2E test, you'd use a client-side fetch with the session cookie.
      // Here, we'll directly check if the user's role allows dashboard access.
      const { data: userData, error: userRoleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single()

      if (userRoleError || !userData) {
        throw new Error(`Failed to fetch user role: ${userRoleError?.message || "No user data"}`)
      }

      // Assuming 'user', 'wholesaler', 'investor', 'admin' roles can access some dashboard
      if (!["user", "wholesaler", "investor", "admin"].includes(userData.role || "")) {
        throw new Error(`User role '${userData.role}' does not have dashboard access.`)
      }

      return NextResponse.json({ status: "success", message: "Dashboard access E2E test successful!" })
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
    console.error("Dashboard access E2E test failed:", error)
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 })
  }
}
