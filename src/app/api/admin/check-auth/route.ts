import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  try {
    const supabase = createAdminClient();

    // Try querying admin_users
    const { data: all, error: err1 } = await supabase
      .from("admin_users")
      .select("email, role, is_active");

    // Try the specific query
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("email", email)
      .eq("is_active", true)
      .maybeSingle();

    return NextResponse.json({
      authorized: !!data,
      all_rows: all || [],
      query_error: error?.message || null,
      all_error: err1?.message || null,
    });
  } catch (err: any) {
    return NextResponse.json({ authorized: false, error: err?.message || "Unknown error" });
  }
}
