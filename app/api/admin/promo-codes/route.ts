import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const {
      data: promoCodes,
      error,
      count,
    } = await supabase
      .from("promo_codes")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching promo codes:", error)
      return NextResponse.json({ message: "Error fetching promo codes", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ promoCodes, total: count, page, limit })
  } catch (error: any) {
    console.error("Error in GET /api/admin/promo-codes:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const { code, discount_percentage, expires_at, max_uses } = await req.json()

    if (!code || !discount_percentage) {
      return NextResponse.json({ message: "Code and discount_percentage are required" }, { status: 400 })
    }

    const { data: newPromoCode, error } = await supabase
      .from("promo_codes")
      .insert({
        code,
        discount_percentage,
        expires_at: expires_at || null,
        max_uses: max_uses || null,
        current_uses: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating promo code:", error)
      return NextResponse.json({ message: "Error creating promo code", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Promo code created successfully", promoCode: newPromoCode }, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/admin/promo-codes:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = createAdminClient()
    const { id, code, discount_percentage, expires_at, max_uses, current_uses } = await req.json()

    if (!id) {
      return NextResponse.json({ message: "Promo code ID is required" }, { status: 400 })
    }

    const { data: updatedPromoCode, error } = await supabase
      .from("promo_codes")
      .update({ code, discount_percentage, expires_at, max_uses, current_uses })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating promo code:", error)
      return NextResponse.json({ message: "Error updating promo code", error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { message: "Promo code updated successfully", promoCode: updatedPromoCode },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error in PUT /api/admin/promo-codes:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createAdminClient()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ message: "Promo code ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("promo_codes").delete().eq("id", id)

    if (error) {
      console.error("Error deleting promo code:", error)
      return NextResponse.json({ message: "Error deleting promo code", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Promo code deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/promo-codes:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
