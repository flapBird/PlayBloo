import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
}

export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  try {
    const authClient = await createServerSupabaseClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user?.email) return null;

    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("admin_users")
      .select("id, email, role, display_name")
      .eq("email", user.email)
      .eq("is_active", true)
      .maybeSingle();

    return data ? {
      id: data.id,
      email: data.email,
      role: data.role,
      displayName: data.display_name,
    } : null;
  } catch {
    return null;
  }
}
