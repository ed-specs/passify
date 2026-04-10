import { createServerClient } from "@supabase/ssr"; // Updated import
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Set cookies with security flags
          response.cookies.set({
            name,
            value,
            httpOnly: true, // Prevent JavaScript access
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict", // CSRF protection
            maxAge: 86400 * 7, // 7 days
            ...options,
          });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            ...options,
          });
        },
      },
    },
  );

  let session = null;
  try {
    const {
      data: { session: authSession },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Middleware: Failed to get session:", error);
    } else {
      session = authSession;
    }
  } catch (err) {
    console.error("Middleware: Error during session retrieval:", err);
  }

  const pathname = request.nextUrl.pathname;

  // Define Public Routes (only "/" and "/create-account")
  const isPublicRoute = pathname === "/" || pathname === "/create-account";

  // Define Auth-Only Routes (visible only when NOT logged in)
  const isAuthOnlyRoute = pathname === "/" || pathname === "/create-account";

  // Protected Routes (requires authentication)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/password-vault") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/api/passwords");

  // Rule 1: Unauthenticated users trying to access protected routes → redirect to "/"
  if (isProtectedRoute && !session) {
    console.log(
      `[Middleware] Unauthenticated access to ${pathname} → redirecting to /`,
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Rule 2: Authenticated users trying to access auth-only routes → redirect to "/dashboard"
  if (isAuthOnlyRoute && session) {
    console.log(
      `[Middleware] Authenticated user at ${pathname} → redirecting to /dashboard`,
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/create-account",
    "/dashboard/:path*",
    "/password-vault/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
