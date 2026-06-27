import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV must have headers and at least one data row" }, { status: 400 });
    }

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const supabase = createAdminClient();
    let success = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

        const gameData: Record<string, any> = {
          title: row.title,
          slug: row.slug,
          thumbnail_url: row.thumbnail || row.thumbnail_url || null,
          iframe_url: row.iframe_url || row.url || "",
          description: row.description || null,
          how_to_play: row.how_to_play || null,
          controls: row.controls || null,
          tips: row.tips || null,
          features: row.features || null,
          is_published: true,
        };

        const { error } = await supabase.from("games").insert([gameData]);
        if (error) {
          errors.push(`Row ${i + 1}: ${error.message}`);
        } else {
          success++;
        }
      } catch (err: any) {
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    return NextResponse.json({ success, errors, total: lines.length - 1 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}
