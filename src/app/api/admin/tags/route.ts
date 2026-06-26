import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("tags").select("*").order("name", { ascending: true });
  return NextResponse.json({ data: data || [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("tags").insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("tags").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const supabase = createAdminClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
