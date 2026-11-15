import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const isProd = process.env.NODE_ENV === "production";

  const applyUiHintCookie = (res: NextResponse, isAdminSession: boolean) => {
    res.cookies.set("admin_ui_hint", isAdminSession ? "1" : "", {
      path: "/",
      maxAge: isAdminSession ? 60 * 60 * 24 * 30 : 0,
      sameSite: "lax",
      secure: isProd,
      httpOnly: false,
    });
    return res;
  };

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookieOptions: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure: isProd,
            sameSite: options?.sameSite ?? "lax",
            path: options?.path ?? "/",
          });
        });
      },
    },
  });

  // Refresh session tokens securely
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect /admin routes (excluding /admin/login) with both authentication and admin_users allowlist check
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return applyUiHintCookie(NextResponse.redirect(loginUrl), false);
    }

    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!adminRecord) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return applyUiHintCookie(NextResponse.redirect(loginUrl), false);
    }

    return applyUiHintCookie(response, true);
  }

  // If already logged in as a verified admin and visiting /admin/login, redirect to /admin
  // Checking admin_users first avoids an infinite redirect loop for non-admin sessions
  if (pathname === "/admin/login" && user) {
    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminRecord) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin";
      const adminRedirect = NextResponse.redirect(adminUrl);
      response.cookies.getAll().forEach((c) => {
        adminRedirect.cookies.set(c);
      });
      return applyUiHintCookie(adminRedirect, true);
    }
  }

  return applyUiHintCookie(response, false);
}

export const config = {
  matcher: ["/admin/:path*"],
};
