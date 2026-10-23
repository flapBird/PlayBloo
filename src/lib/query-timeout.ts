// Abort budget for Supabase reads on public pages. Bulk prerendering can wait
// longer; visitor- and crawler-triggered regeneration must stay bounded, so a
// stalled database read fails fast instead of hanging the render for minutes.
export function queryTimeout(runtimeMs: number) {
  return process.env.NEXT_PHASE === "phase-production-build" ? 30000 : runtimeMs;
}
