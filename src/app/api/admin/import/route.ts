import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export async function POST(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        const values = parseCsvLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

        const gameData: Record<string, unknown> = {
          title: row.title,
          slug: row.slug,
          thumbnail_url: row.thumbnail_url || row.thumbnail || null,
          cover_url: row.cover_url || null,
          iframe_url: row.iframe_url || null,
          external_url: row.external_url || null,
          original_game_url: row.original_game_url || null,
          developer: row.developer || null,
          publisher: row.publisher || null,
          developer_url: row.developer_url || null,
          steam_url: row.steam_url || null,
          itch_url: row.itch_url || null,
          source_type: row.source_type || null,
          source_url: row.source_url || null,
          last_verified_at: row.last_verified_at || null,
          sources: (() => { try { const value = JSON.parse(row.sources_json || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } })(),
          description: row.description || null,
          how_to_play: row.how_to_play || null,
          controls: row.controls || null,
          tips: row.tips || null,
          features: row.features || null,
          release_date: row.release_date || null,
          is_published: row.is_published?.toLowerCase() === "true",
          is_featured: row.is_featured?.toLowerCase() === "true",
          is_trending: row.is_trending?.toLowerCase() === "true",
          content_verified: row.content_verified?.toLowerCase() === "true",
        };

        const { error } = await supabase.from("games").insert([gameData]);
        if (error) {
          errors.push(`Row ${i + 1}: ${error.message}`);
        } else {
          success++;
        }
      } catch (err: unknown) {
        errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : "Import failed"}`);
      }
    }

    return NextResponse.json({ success, errors, total: lines.length - 1 });
  } catch {
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}
