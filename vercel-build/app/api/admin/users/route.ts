import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)

    if (role) {
      query = query.eq("role", role)
    }

    const { data: users, error, count } = await query

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users, total: count, page, limit })
  } catch (error: any) {
    console.error("Error in GET /api/admin/users:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const { email, password, role } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Email, password, and role are required" }, { status: 400 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for admin creation
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return NextResponse.json({ message: "Error creating user", error: authError.message }, { status: 500 })
    }

    const userId = authData.user?.id

    if (!userId) {
      return NextResponse.json({ message: "User ID not returned after auth creation" }, { status: 500 })
    }

    // Insert into public.users table with specified role
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .insert({ id: userId, email, role })
      .select()
      .single()

    if (profileError) {
      console.error("Error inserting user profile:", profileError)
      // Attempt to delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json({ message: "Error creating user profile", error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ message: "User created successfully", user: userProfile }, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/admin/users:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = createAdminClient()
    const { id, email, role } = await req.json()

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Update user in public.users table
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .update({ email, role })
      .eq("id", id)
      .select()
      .single()

    if (profileError) {
      console.error("Error updating user profile:", profileError)
      return NextResponse.json({ message: "Error updating user", error: profileError.message }, { status: 500 })
    }

    // Optionally update email in auth.users if changed
    if (email && userProfile?.email !== email) {
      const { error: authUpdateError } = await supabase.auth.admin.updateUserById(id, { email })
      if (authUpdateError) {
        console.warn("Warning: Failed to update email in auth.users:", authUpdateError.message)
        // Continue, but log the warning. You might want to handle this more robustly.
      }
    }

    return NextResponse.json({ message: "User updated successfully", user: userProfile }, { status: 200 })
  } catch (error: any) {
    console.error("Error in PUT /api/admin/users:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createAdminClient()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Delete user from Supabase Auth (this should cascade to public.users if foreign key is set up)
    const { error: authError } = await supabase.auth.admin.deleteUser(id)

    if (authError) {
      console.error("Error deleting auth user:", authError)
      return NextResponse.json({ message: "Error deleting user", error: authError.message }, { status: 500 })
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/users:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
