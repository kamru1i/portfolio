"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { KamrulBrandWordmark } from "@/components/layout/KamrulBrandWordmark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "unauthorized"
      ? "Your account does not have administrator privileges."
      : errorParam === "missing_config"
      ? "Supabase credentials are not configured yet. Please check .env.local."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data?.user) {
        setErrorMessage(
          error?.message || "Authentication failed. Please check your credentials."
        );
        setLoading(false);
        return;
      }

      // Verify that this user is in the admin_users allowlist
      const { data: adminRecord, error: adminErr } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (adminErr || !adminRecord) {
        await supabase.auth.signOut();
        setErrorMessage(
          "Access Denied: Your account does not have administrator privileges."
        );
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Unable to reach authentication server. Please check your connection and try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-[420px]">
        {/* Top Wordmark Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-4 hover:opacity-80 transition-opacity">
            <KamrulBrandWordmark className="h-8 w-auto text-white" />
          </Link>
          <Badge variant="default" className="px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin Authentication</span>
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.75)]">
          <div className="flex items-center gap-2.5 mb-1">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <h1 className="font-sans text-xl font-medium text-white">
              Sign in to CMS
            </h1>
          </div>
          <p className="font-mono-custom text-xs text-[#888] mb-6">
            Authorized administrator access for portfolio projects &amp; metadata.
          </p>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom leading-relaxed flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="admin-email" className="mb-1.5">
                Admin Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@kamrulislam.me"
              />
            </div>

            <div>
              <Label htmlFor="admin-password" className="mb-1.5">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full mt-2 font-medium text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono-custom text-xs text-[#777] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Return to Live Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#09090b] text-white flex items-center justify-center font-mono-custom text-xs text-[#888]">
          Loading authentication...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
