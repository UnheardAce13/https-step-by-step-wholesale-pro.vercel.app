import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client for admin operations (e.g., in API routes, Server Actions)
// Uses the service role key for elevated privileges.
export const createAdminClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

// Helper to get current user on server-side (for protected routes/actions)
import { cookies } from "next/headers"
import { createServerClient } from "./supabase"

export async function getCurrentUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
