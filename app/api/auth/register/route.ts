import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role, firstName, lastName, companyName, promoCode } = body

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        firstName,
        lastName,
        companyName
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Insert user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email,
        role,
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        promo_code_used: promoCode || null,
        created_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    return NextResponse.json({ 
      message: "User created successfully", 
      userId: authData.user.id 
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}