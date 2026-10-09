"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Verify that this user is in the admin allowlist
        const { data: adminRecord, error: adminErr } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (adminErr || !adminRecord) {
          await supabase.auth.signOut();
          setErrorMsg("Access Denied: Your account is not authorized as an administrator.");
          setLoading(false);
          return;
        }

        router.push("/admin");
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during login.";
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md relative z-10 bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 font-mono-custom text-xs uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Restricted Access
          </div>
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal tracking-tight uppercase">
            Admin Portal
          </h1>
          <p className="font-mono-custom text-xs text-[#888] mt-2">
            Kamrul Islam Portfolio & Works Management
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-mono-custom text-xs uppercase tracking-wider text-[#a1a1aa] mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          <div>
            <label className="block font-mono-custom text-xs uppercase tracking-wider text-[#a1a1aa] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-white text-black font-sans font-medium text-sm hover:bg-neutral-200 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between font-mono-custom text-[11px] text-[#666]">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to Website
          </Link>
          <span>Private System</span>
        </div>
      </div>
    </div>
  );
}
