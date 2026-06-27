"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminImport() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true); setResult(null);
    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const supabase = createClient();
    let success = 0; const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
        const gameData: Record<string, any> = {
          title: row.title, slug: row.slug,
          thumbnail_url: row.thumbnail || row.thumbnail_url || null,
          iframe_url: row.iframe_url || row.url || "",
          description: row.description || null, how_to_play: row.how_to_play || null,
          controls: row.controls || null, tips: row.tips || null, features: row.features || null,
          
          is_published: true,
        };
        const { error } = await supabase.from("games").insert([gameData]);
        if (error) errors.push(`Row ${i + 1}: ${error.message}`); else success++;
      } catch (err: any) { errors.push(`Row ${i + 1}: ${err.message}`); }
    }
    setResult({ success, errors }); setImporting(false);
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Import CSV</h1><p className="text-sm text-muted-foreground">Upload a CSV file with columns: title, slug, thumbnail, iframe_url, description, etc.</p></div>
      <div className="rounded-xl border-2 border-dashed p-12 text-center">
        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <label className="cursor-pointer"><span className="text-sm font-medium text-primary hover:underline">{importing ? "Importing..." : "Choose CSV file"}</span><input type="file" accept=".csv" className="hidden" onChange={handleFile} disabled={importing} /></label>
        <p className="text-xs text-muted-foreground mt-2">Supports .csv files</p>
      </div>
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" />Imported: {result.success} games</div>
          {result.errors.length > 0 && (
            <div className="rounded-xl border bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-2"><AlertCircle className="h-4 w-4" />Errors ({result.errors.length})</div>
              <ul className="space-y-1">{result.errors.map((err, i) => <li key={i} className="text-xs text-muted-foreground">{err}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
