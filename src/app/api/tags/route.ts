import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });
  return NextResponse.json({ data: data || [] });
}
