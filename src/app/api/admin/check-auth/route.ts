import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ authorized: false }, { status: 401 });
  return NextResponse.json({ authorized: true, role: admin.role });
}
