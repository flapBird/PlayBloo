"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_NAME } from "@/lib/constants";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

async function checkAdmin(email: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/check-auth?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.authorized;
  } catch {
    return false;
  }
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const authorized = await checkAdmin(session.user.email);
          if (authorized) {
            router.replace("/admin");
            return;
          }
        }
      } catch {}
      setCheckingSession(false);
    }
    checkSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check via API (bypasses RLS with service_role)
      const authorized = await checkAdmin(email);
      if (!authorized) {
        setError("This email is not authorized as an admin.");
        setLoading(false);
        return;
      }

      // Proceed with Supabase Auth sign in
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch (err: any) {
      setError(err?.message || "Login failed.");
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">Checking session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black">{SITE_NAME} Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your games</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 rounded-xl border bg-card p-6">
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="h-4 w-4 mr-2" />
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
