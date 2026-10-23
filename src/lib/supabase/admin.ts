import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// One admin client per isolate. createClient() builds a whole fetch/auth
// stack, and the service-role client holds no per-request state
// (autoRefreshToken off, no persisted session), so every query path can share
// a single instance instead of rebuilding it on each call.
const globalStore = globalThis as unknown as { __playblooSupabaseAdmin?: SupabaseClient };

export function createAdminClient(): SupabaseClient {
  if (!globalStore.__playblooSupabaseAdmin) {
    globalStore.__playblooSupabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return globalStore.__playblooSupabaseAdmin;
}
