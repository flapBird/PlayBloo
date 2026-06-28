"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle2, Download } from "lucide-react";

const CSV_TEMPLATE_HEADERS = [
  "title",
  "slug",
  "thumbnail_url",
  "cover_url",
  "iframe_url",
  "external_url",
  "description",
  "how_to_play",
  "controls",
  "tips",
  "features",
  "release_date",
  "is_published",
  "is_featured",
  "is_trending",
  "categories",
];

const CSV_TEMPLATE_EXAMPLE = [
  "Fun Racing Game",
  "fun-racing-game",
  "https://example.com/thumb.jpg",
  "",
  "https://example.com/game.html",
  "",
  '"A fast-paced racing game with cool cars and tracks."',
  '"Use arrow keys to steer, space to boost."',
  '"Arrow Keys = Move, Space = Boost"',
  '"Collect coins for extra points!"',
  '"5 unique tracks, 10 cars, online leaderboard"',
  "2025-01-15",
  "true",
  "false",
  "false",
  '"Action, Racing"',
];

function generateCsvContent(): string {
  const headerLine = CSV_TEMPLATE_HEADERS.join(",");
  const exampleLine = CSV_TEMPLATE_EXAMPLE.join(",");
  return headerLine + "\n" + exampleLine + "\n";
}

function downloadCsv() {
  const content = generateCsvContent();
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "playbloo-games-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminImport() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setResult(null);

    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    if (lines.length < 2) {
      setResult({ success: 0, errors: ["CSV must have headers and at least one data row"] });
      setImporting(false);
      return;
    }

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    let success = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Simple CSV parser: handle quoted fields with commas
      const values = parseCsvLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

      const gameData: Record<string, any> = {
        title: row.title,
        slug: row.slug,
        thumbnail_url: row.thumbnail_url || row.thumbnail || null,
        cover_url: row.cover_url || null,
        iframe_url: row.iframe_url || null,
        external_url: row.external_url || null,
        description: row.description || null,
        how_to_play: row.how_to_play || null,
        controls: row.controls || null,
        tips: row.tips || null,
        features: row.features || null,
        release_date: row.release_date || null,
        is_published: row.is_published?.toLowerCase() === "true",
        is_featured: row.is_featured?.toLowerCase() === "true",
        is_trending: row.is_trending?.toLowerCase() === "true",
      };

      // Parse categories as comma-separated inside quotes: "Action,Racing"
      const categoriesRaw = row.categories || "";
      const categoryNames = categoriesRaw
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      try {
        const res = await fetch("/api/admin/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...gameData,
            category_names: categoryNames,
          }),
        });

        if (res.ok) {
          success++;
        } else {
          const err = await res.json().catch(() => ({}));
          errors.push(`Row ${i + 1}: ${err?.error || "Unknown error"}`);
        }
      } catch (err: any) {
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    setResult({ success, errors });
    setImporting(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Import CSV</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a CSV file to bulk import games. Download the template to get started.
        </p>
      </div>

      {/* Template download */}
      <div className="rounded-xl border bg-card p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">CSV Template</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download a pre-formatted CSV with all supported columns and an example row.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadCsv}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* Upload area */}
      <div className="rounded-xl border-2 border-dashed border-border/80 p-12 text-center">
        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <label className="cursor-pointer">
          <span className="text-sm font-medium text-primary hover:underline">
            {importing ? "Importing..." : "Choose CSV file"}
          </span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFile}
            disabled={importing}
          />
        </label>
        <p className="text-xs text-muted-foreground mt-2">Supports .csv files</p>
      </div>

      {/* Column reference */}
      <details className="rounded-xl border bg-card p-4">
        <summary className="text-sm font-medium cursor-pointer select-none">
          Supported Columns
        </summary>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
          {CSV_TEMPLATE_HEADERS.map(h => (
            <div key={h} className="text-xs text-muted-foreground">
              <code className="text-[11px] bg-muted px-1 py-0.5 rounded">{h}</code>
            </div>
          ))}
        </div>
      </details>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Imported: {result.success} games
          </div>
          {result.errors.length > 0 && (
            <div className="rounded-xl border bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                Errors ({result.errors.length})
              </div>
              <ul className="space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-xs text-muted-foreground">{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Parse a CSV line that may contain quoted fields with commas inside */
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
