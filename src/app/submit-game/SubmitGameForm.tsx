"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function sourceHint(value: string): string {
  try {
    const host = new URL(value).hostname.toLowerCase();
    if (host === "store.steampowered.com") return "Steam page detected — public store metadata will be prepared for editorial review.";
    if (host.endsWith(".itch.io") && host !== "itch.io") return "itch.io project detected — public project metadata will be prepared for editorial review.";
    return "Official site detected — an editor will verify the details manually.";
  } catch {
    return "Steam and itch.io pages can be pre-filled automatically. Other official sites are saved for manual review.";
  }
}

export function SubmitGameForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setLoading(true);
    setError("");
    const form = new FormData(formElement);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sourceUrl: form.get("sourceUrl"),
          email: form.get("email"),
          developerName: form.get("developerName"),
          notes: form.get("notes"),
          website: form.get("website"),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Could not submit this game. Please try again.");
        return;
      }
      setSuccess(payload.message || "Submitted for review.");
      setSourceUrl("");
      formElement.reset();
    } catch (requestError) {
      setError(requestError instanceof DOMException && requestError.name === "AbortError"
        ? "The submission took too long. Please check the game URL and try again."
        : "The submission could not reach PlayBloo. Check your connection and try again.");
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  if (success) return (
    <div role="status" aria-live="polite" className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-7 text-center">
      <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
      <h2 className="text-xl font-black text-emerald-100">{success}</h2>
      <p className="mt-2 text-sm text-emerald-200/80">Every submission is checked by an editor before it can appear on PlayBloo.</p>
      <Button className="mt-5" variant="outline" onClick={() => setSuccess("")}>Submit another game</Button>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-5 rounded-3xl border bg-card p-5 shadow-sm md:p-7">
      <div className="space-y-2">
        <Label htmlFor="sourceUrl">Game URL <span className="text-destructive">*</span></Label>
        <Input id="sourceUrl" name="sourceUrl" type="url" maxLength={2048} required value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://store.steampowered.com/app/... or https://creator.itch.io/game" className="h-11" />
        <p aria-live="polite" className="text-xs text-muted-foreground">{sourceHint(sourceUrl)}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="developerName">Developer or studio</Label>
          <Input id="developerName" name="developerName" maxLength={120} placeholder="Optional" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Contact email</Label>
          <Input id="email" name="email" type="email" maxLength={254} placeholder="Optional" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes for our editors</Label>
        <Textarea id="notes" name="notes" maxLength={2000} rows={5} placeholder="Anything useful about the game, its launch, or where it can be played." />
      </div>
      <div className="absolute -left-[10000px]" aria-hidden="true">
        <Label htmlFor="website">Website</Label><Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {error && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
      <p className="text-xs leading-relaxed text-muted-foreground">Your optional contact details are used only to review this submission. See our <Link href="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.</p>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        {loading ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}
